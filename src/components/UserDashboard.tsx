import {
  User,
  FileText,
  TrendingUp,
  Briefcase,
  BookOpen,
  MapPin,
  Clock,
  DollarSign,
  CreditCard,
  Calendar,
  Target,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import { formatSalary } from "../data/vacancies";
import { matchBadgeClasses } from "../data/matching";
import type { UserProfile } from "../data/userProfile";
import type { NotificationCenter } from "../data/notifications";
import type { DashboardData } from "../hooks/useDashboardData";
import type { Screen } from "../hooks/useRouter";
import type { PreferencesData } from "./PreferencesForm";

interface UserDashboardProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  /** Perfil real del usuario, derivado de su análisis guardado. */
  profile: UserProfile;
  /** Preferencias laborales guardadas, si las ha rellenado. */
  prefs: PreferencesData | null;
  hasAnalysis: boolean;
  data: DashboardData;
  notificationCenter: NotificationCenter;
}

/** "Hace 2 días", "Hoy"… a partir de una fecha ISO del backend. */
function relativeDate(iso: string | null | undefined): string {
  if (!iso) return "Sin registro";

  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "Sin registro";

  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 7) return `Hace ${days} días`;
  if (days < 30) return `Hace ${Math.floor(days / 7)} semana(s)`;
  return new Date(iso).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function monthYear(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-PE", { month: "short", year: "numeric" });
}

export function UserDashboard({
  onNavigate,
  onLogout,
  profile,
  prefs,
  hasAnalysis,
  data,
  notificationCenter,
}: UserDashboardProps) {
  const {
    stats,
    matches,
    missingSkills,
    courseRecs,
    profileScore,
    compatibleCount,
  } = data;

  const firstName = profile.name.trim().split(/\s+/)[0];
  const topSkills = profile.technicalSkills.slice(0, 6);
  const topMatches = matches.slice(0, 3);
  const topCourses = courseRecs.slice(0, 3);
  const analysisCount = stats?.analysis_count ?? 0;
  const completedCourses = 0; // Aún no hay seguimiento de cursos completados

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bienvenida */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">¡Bienvenido de nuevo, {firstName}!</h1>
          <p className="text-gray-600">
            {hasAnalysis
              ? "Aquí tienes un resumen de tu progreso profesional"
              : "Sube tu CV para empezar a ver tu diagnóstico y ofertas compatibles"}
          </p>
        </div>

        {!hasAnalysis && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="text-blue-600" size={20} />
            </div>
            <div className="flex-1">
              <h2 className="text-gray-900 mb-1">Todavía no has analizado tu CV</h2>
              <p className="text-gray-600 mb-3">
                Las cifras de abajo se calcularán con tus datos reales en cuanto
                subas tu currículum.
              </p>
              <button
                onClick={() => onNavigate("upload")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Analizar mi CV
              </button>
            </div>
          </div>
        )}

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Puntuación CV */}
          <button
            onClick={() => onNavigate("results")}
            className="text-left bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-600 hover:border-blue-400 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Puntuación CV</span>
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-700 text-xl font-semibold">
                {hasAnalysis ? profileScore.total : "—"}
              </span>
            </div>
            {stats?.score_delta != null && stats.score_delta !== 0 ? (
              <p
                className={`text-center ${
                  stats.score_delta > 0 ? "text-green-600" : "text-orange-600"
                }`}
              >
                {stats.score_delta > 0 ? "+" : ""}
                {stats.score_delta} pts vs. anterior
              </p>
            ) : (
              <p className="text-gray-500 text-center">Sobre 100 puntos</p>
            )}
          </button>

          {/* Análisis realizados */}
          <button
            onClick={() => onNavigate("upload")}
            className="text-left bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-600 hover:border-purple-400 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Análisis realizados</span>
              <FileText className="text-purple-600" size={20} />
            </div>
            <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-700 text-xl font-semibold">
                {analysisCount}
              </span>
            </div>
            <p className="text-gray-500 text-center">
              Último: {relativeDate(stats?.last_analysis_at)}
            </p>
          </button>

          {/* Cursos sugeridos */}
          <button
            onClick={() => onNavigate("courses")}
            className="text-left bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-600 hover:border-green-400 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Cursos sugeridos</span>
              <BookOpen className="text-green-600" size={20} />
            </div>
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
              <span className="text-green-700 text-xl font-semibold">
                {courseRecs.length}
              </span>
            </div>
            <p className="text-gray-500 text-center">
              {completedCourses} completados
            </p>
          </button>

          {/* Ofertas compatibles */}
          <button
            onClick={() => onNavigate("vacancies")}
            className="text-left bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-600 hover:border-orange-400 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Ofertas compatibles</span>
              <Briefcase className="text-orange-600" size={20} />
            </div>
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-2">
              <span className="text-orange-700 text-xl font-semibold">
                {compatibleCount}
              </span>
            </div>
            <p className="text-gray-500 text-center">Match ≥ 60%</p>
          </button>
        </div>

        {/* Plan */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white mb-8">
          <div className="flex items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <CreditCard size={24} className="flex-shrink-0" />
              <div className="min-w-0">
                <h2 className="text-white mb-1">Plan {profile.plan}</h2>
                <p className="text-blue-100">
                  {profile.plan === "Premium"
                    ? "Acceso completo a análisis, ofertas y cursos"
                    : "Plan gratuito · mejora para desbloquear todo"}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate("profile")}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex-shrink-0"
            >
              Gestionar plan
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
            <div>
              <p className="text-blue-100 mb-1">Análisis</p>
              <p className="text-white">
                {profile.plan === "Premium" ? "Ilimitados" : "Limitados"}
              </p>
            </div>
            <div>
              <p className="text-blue-100 mb-1">Estado</p>
              <p className="text-white">Activo</p>
            </div>
            <div>
              <p className="text-blue-100 mb-1">Desde</p>
              <p className="text-white">{monthYear(stats?.member_since)}</p>
            </div>
          </div>
        </div>

        {/* Cuerpo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Resumen de perfil */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6 gap-4">
                <h2 className="text-gray-900">Resumen de perfil</h2>
                <button
                  onClick={() => onNavigate("upload")}
                  className="text-blue-600 hover:underline flex-shrink-0"
                >
                  Actualizar CV
                </button>
              </div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="text-white" size={32} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 mb-1">{profile.name}</h3>
                  <p className="text-gray-600 mb-2">{profile.headline}</p>
                  <p className="text-gray-500">
                    {profile.location} · {profile.yearsExperience} años de experiencia
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-600 mb-4">Principales habilidades:</p>
                {topSkills.length === 0 ? (
                  <p className="text-gray-500">
                    Todavía no hemos detectado habilidades. Sube tu CV para verlas aquí.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {topSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Preferencias laborales */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6 gap-4">
                <h2 className="text-gray-900">Mis preferencias laborales</h2>
                <button
                  onClick={() => onNavigate("preferences")}
                  className="text-blue-600 hover:underline inline-flex items-center gap-1 flex-shrink-0"
                >
                  <Target size={16} />
                  {prefs ? "Editar" : "Completar"}
                </button>
              </div>

              {!prefs ? (
                <p className="text-gray-500">
                  Aún no has definido tus preferencias. Complétalas para afinar
                  las recomendaciones.
                </p>
              ) : (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="text-blue-600" size={20} />
                      <h3 className="text-gray-900">Áreas de interés</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {prefs.jobAreas.map((area) => (
                        <span
                          key={area}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="text-green-600" size={18} />
                        <h3 className="text-gray-900">Ubicación</h3>
                      </div>
                      <p className="text-gray-600">
                        {prefs.locations.join(", ") || "Sin definir"}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="text-orange-600" size={18} />
                        <h3 className="text-gray-900">Tipo de empleo</h3>
                      </div>
                      <p className="text-gray-600">
                        {prefs.jobTypes.join(", ") || "Sin definir"}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="text-blue-600" size={18} />
                        <h3 className="text-gray-900">Salario esperado</h3>
                      </div>
                      <p className="text-gray-600">
                        {prefs.salaryRange || "Sin definir"}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="text-purple-600" size={18} />
                        <h3 className="text-gray-900">Modalidad</h3>
                      </div>
                      <p className="text-gray-600">
                        {prefs.workModality.join(", ") || "Sin definir"}
                      </p>
                    </div>
                  </div>

                  {prefs.careerGoals && (
                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="text-gray-900 mb-2">Objetivos profesionales</h3>
                      <p className="text-gray-600">{prefs.careerGoals}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Historial de análisis */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-gray-900 mb-4">Actividad reciente</h2>
              {!stats || stats.history.length === 0 ? (
                <p className="text-gray-500">
                  Sin actividad todavía. Tu historial de análisis aparecerá aquí.
                </p>
              ) : (
                <div className="space-y-4">
                  {stats.history.slice(0, 5).map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="text-blue-600" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900">
                          Análisis {entry.source === "manual" ? "manual" : "de CV"}
                          {entry.career ? ` · ${entry.career}` : ""}
                        </p>
                        <p className="text-gray-500">
                          {entry.skills_found} habilidades detectadas ·{" "}
                          {entry.skills_missing} brechas ·{" "}
                          {relativeDate(entry.created_at)}
                        </p>
                      </div>
                      {entry.score != null && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm flex-shrink-0">
                          {entry.score}/100
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            {/* Próximos pasos: brechas reales */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} />
                <h2 className="text-white">Próximos pasos</h2>
              </div>
              {missingSkills.length === 0 ? (
                <p className="text-blue-100">
                  {hasAnalysis
                    ? "No detectamos brechas relevantes. ¡Buen trabajo!"
                    : "Sube tu CV para recibir recomendaciones personalizadas."}
                </p>
              ) : (
                <div className="space-y-3">
                  {missingSkills.slice(0, 4).map((gap, index) => (
                    <div key={gap.skill} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm">{index + 1}</span>
                      </div>
                      <p className="text-white">
                        Aprende <strong>{gap.skill}</strong>
                        <span className="text-blue-100">
                          {" "}
                          · {gap.count} vacante{gap.count === 1 ? "" : "s"}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mejores ofertas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4 gap-2">
                <h2 className="text-gray-900">Mejores ofertas</h2>
                <button
                  onClick={() => onNavigate("vacancies")}
                  className="text-blue-600 hover:underline text-sm flex-shrink-0"
                >
                  Ver todas
                </button>
              </div>
              {topMatches.length === 0 ? (
                <p className="text-gray-500">Sin ofertas todavía.</p>
              ) : (
                <div className="space-y-4">
                  {topMatches.map((match) => (
                    <button
                      key={match.vacancy.id}
                      onClick={() => onNavigate("recommendations")}
                      className="w-full text-left border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-gray-900 line-clamp-2 leading-snug">
                          {match.vacancy.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-sm flex-shrink-0 ${matchBadgeClasses(
                            match.score
                          )}`}
                        >
                          {match.score}%
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm truncate">
                        {match.vacancy.company} · {formatSalary(match.vacancy.salary)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cursos recomendados */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4 gap-2">
                <h2 className="text-gray-900">Cursos recomendados</h2>
                <button
                  onClick={() => onNavigate("courses")}
                  className="text-blue-600 hover:underline text-sm flex-shrink-0"
                >
                  Ver todos
                </button>
              </div>
              {topCourses.length === 0 ? (
                <p className="text-gray-500">
                  Sin cursos pendientes: no detectamos brechas con formación
                  disponible.
                </p>
              ) : (
                <div className="space-y-4">
                  {topCourses.map((rec) => (
                    <button
                      key={rec.course.id}
                      onClick={() => onNavigate("courses")}
                      className="w-full text-left border border-gray-200 rounded-lg p-4 hover:border-purple-400 transition-colors"
                    >
                      <h3 className="text-gray-900 mb-2 line-clamp-2 leading-snug">
                        {rec.course.name}
                      </h3>
                      <div className="flex items-center justify-between text-gray-500 gap-2">
                        <span className="flex items-center gap-1 min-w-0">
                          <Calendar size={16} className="flex-shrink-0" />
                          <span className="truncate">{rec.course.duration}</span>
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-gray-600 text-sm flex-shrink-0">
                          {rec.course.level}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Acciones rápidas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-gray-900 mb-4">Acciones rápidas</h2>
              <div className="space-y-2">
                <button
                  onClick={() => onNavigate("upload")}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Nuevo análisis
                </button>
                {[
                  { label: "Ver mi diagnóstico", screen: "results" as Screen },
                  { label: "Análisis de brechas", screen: "skillGap" as Screen },
                  { label: "Cursos recomendados", screen: "courses" as Screen },
                  { label: "Mi perfil", screen: "profile" as Screen },
                  { label: "Ver recomendaciones", screen: "recommendations" as Screen },
                  { label: "Explorar vacantes", screen: "vacancies" as Screen },
                ].map((action) => (
                  <button
                    key={action.screen}
                    onClick={() => onNavigate(action.screen)}
                    className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
