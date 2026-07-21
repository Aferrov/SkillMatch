/**
 * Notificaciones derivadas del estado real del usuario.
 *
 * No hay una tabla de notificaciones en el backend: se calculan a partir de
 * datos que sí son reales (el análisis guardado, las vacantes compatibles,
 * las brechas de habilidades y el historial de análisis). Así el contador
 * del header refleja algo cierto en vez de un punto rojo decorativo.
 */

import type { MatchResult, MissingSkillAgg } from './matching';
import type { UserStats } from '../services/auth';
import type { Screen } from '../hooks/useRouter';

export type NotificationKind = 'match' | 'gap' | 'course' | 'profile' | 'analysis';

export interface AppNotification {
  /** Estable entre recargas: se usa para recordar cuáles ya se leyeron. */
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  /** Pantalla a la que lleva al pulsarla. */
  target: Screen;
}

/** Lo que necesita el header para pintar y gestionar la campana. */
export interface NotificationCenter {
  notifications: AppNotification[];
  unreadIds: Set<string>;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const READ_KEY = 'skillmatch.notifications.read';

export function loadReadIds(): Set<string> {
  try {
    const raw = window.localStorage.getItem(READ_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function saveReadIds(ids: Set<string>): void {
  try {
    window.localStorage.setItem(READ_KEY, JSON.stringify([...ids]));
  } catch {
    /* almacenamiento no disponible */
  }
}

interface BuildArgs {
  matches: MatchResult[];
  missingSkills: MissingSkillAgg[];
  courseCount: number;
  hasAnalysis: boolean;
  hasCV: boolean;
  stats: UserStats | null;
}

/**
 * Construye la lista de notificaciones. Los ids son deterministas para que
 * marcar una como leída siga surtiendo efecto tras recargar la página.
 */
export function buildNotifications({
  matches,
  missingSkills,
  courseCount,
  hasAnalysis,
  hasCV,
  stats,
}: BuildArgs): AppNotification[] {
  const notifications: AppNotification[] = [];

  if (!hasAnalysis) {
    notifications.push({
      id: 'no-analysis',
      kind: 'analysis',
      title: 'Aún no has analizado tu CV',
      description: 'Sube tu currículum para ver ofertas compatibles contigo.',
      target: 'upload',
    });
    return notifications;
  }

  const strongMatches = matches.filter((m) => m.score >= 75);
  if (strongMatches.length > 0) {
    notifications.push({
      id: `matches-${strongMatches.length}`,
      kind: 'match',
      title: `${strongMatches.length} vacante${
        strongMatches.length === 1 ? '' : 's'
      } con match alto`,
      description: `La mejor es ${strongMatches[0].vacancy.title} en ${strongMatches[0].vacancy.company} (${strongMatches[0].score}%).`,
      target: 'recommendations',
    });
  }

  const topGap = missingSkills[0];
  if (topGap) {
    notifications.push({
      id: `gap-${topGap.skill}`,
      kind: 'gap',
      title: `«${topGap.skill}» te está costando ofertas`,
      description: `Aparece en ${topGap.count} vacante${
        topGap.count === 1 ? '' : 's'
      } que no cubres. Prioridad ${topGap.priority.toLowerCase()}.`,
      target: 'skillGap',
    });
  }

  if (courseCount > 0) {
    notifications.push({
      id: `courses-${courseCount}`,
      kind: 'course',
      title: `${courseCount} curso${courseCount === 1 ? '' : 's'} para tus brechas`,
      description: 'Formación seleccionada según las habilidades que te faltan.',
      target: 'courses',
    });
  }

  if (!hasCV) {
    notifications.push({
      id: 'no-cv-file',
      kind: 'profile',
      title: 'No tienes un CV adjunto',
      description: 'Súbelo en tu perfil para mantenerlo siempre a mano.',
      target: 'profile',
    });
  }

  if (stats?.score_delta != null && stats.score_delta !== 0) {
    const up = stats.score_delta > 0;
    notifications.push({
      id: `score-${stats.analysis_count}-${stats.score_delta}`,
      kind: 'analysis',
      title: up
        ? `Tu puntuación subió ${stats.score_delta} puntos`
        : `Tu puntuación bajó ${Math.abs(stats.score_delta)} puntos`,
      description: `Comparado con tu análisis anterior (llevas ${stats.analysis_count}).`,
      target: 'results',
    });
  }

  return notifications;
}
