/**
 * Datos reales del usuario para el panel, el perfil y el header.
 *
 * Combina tres fuentes, ninguna inventada:
 *   - el perfil derivado del análisis de CV guardado,
 *   - el cruce con las vacantes (puntuación, compatibilidad, brechas),
 *   - las métricas históricas que devuelve el backend (/api/auth/stats).
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { VACANCIES } from '../data/vacancies';
import {
  aggregateMissingSkills,
  calculateAllMatches,
  calculateProfileScore,
} from '../data/matching';
import { recommendCoursesForGaps } from '../data/courses';
import {
  buildNotifications,
  loadReadIds,
  saveReadIds,
  type NotificationCenter,
} from '../data/notifications';
import { fetchStats, type UserStats } from '../services/auth';
import type { UserProfile } from '../data/userProfile';

export interface DashboardData {
  stats: UserStats | null;
  isLoadingStats: boolean;
  matches: ReturnType<typeof calculateAllMatches>;
  missingSkills: ReturnType<typeof aggregateMissingSkills>;
  courseRecs: ReturnType<typeof recommendCoursesForGaps>;
  profileScore: ReturnType<typeof calculateProfileScore>;
  compatibleCount: number;
  notificationCenter: NotificationCenter;
}

export function useDashboardData(
  profile: UserProfile,
  hasAnalysis: boolean,
  isAuthenticated: boolean
): DashboardData {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(() => loadReadIds());

  useEffect(() => {
    if (!isAuthenticated) {
      setStats(null);
      return;
    }

    let cancelled = false;
    setIsLoadingStats(true);

    fetchStats()
      .then((result) => {
        if (!cancelled) setStats(result);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingStats(false);
      });

    return () => {
      cancelled = true;
    };
    // Se vuelve a pedir cuando cambia el análisis: así el contador de
    // "análisis realizados" se actualiza sin recargar la página.
  }, [isAuthenticated, hasAnalysis, profile.technicalSkills.length]);

  const matches = useMemo(
    () => calculateAllMatches(profile, VACANCIES),
    [profile]
  );

  const profileScore = useMemo(
    () => calculateProfileScore(profile, matches),
    [profile, matches]
  );

  const missingSkills = useMemo(
    () => aggregateMissingSkills(matches, 5),
    [matches]
  );

  const courseRecs = useMemo(() => {
    const gaps = aggregateMissingSkills(matches, 20).map((g) => ({
      skill: g.skill,
      demandCount: g.count,
    }));
    return recommendCoursesForGaps(gaps);
  }, [matches]);

  const compatibleCount = useMemo(
    () => matches.filter((m) => m.score >= 60).length,
    [matches]
  );

  const notifications = useMemo(
    () =>
      buildNotifications({
        matches,
        missingSkills,
        courseCount: courseRecs.length,
        hasAnalysis,
        hasCV: Boolean(profile.cvFile),
        stats,
      }),
    [matches, missingSkills, courseRecs.length, hasAnalysis, profile.cvFile, stats]
  );

  // Todo lo que no se ha marcado como leído cuenta como pendiente
  const unreadIds = useMemo(() => {
    const ids = new Set<string>();
    notifications.forEach((n) => {
      if (!readIds.has(n.id)) ids.add(n.id);
    });
    return ids;
  }, [notifications, readIds]);

  const markRead = useCallback((id: string) => {
    setReadIds((previous) => {
      const next = new Set(previous).add(id);
      saveReadIds(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setReadIds((previous) => {
      const next = new Set(previous);
      notifications.forEach((n) => next.add(n.id));
      saveReadIds(next);
      return next;
    });
  }, [notifications]);

  const notificationCenter = useMemo<NotificationCenter>(
    () => ({ notifications, unreadIds, markRead, markAllRead }),
    [notifications, unreadIds, markRead, markAllRead]
  );

  return {
    stats,
    isLoadingStats,
    matches,
    missingSkills,
    courseRecs,
    profileScore,
    compatibleCount,
    notificationCenter,
  };
}
