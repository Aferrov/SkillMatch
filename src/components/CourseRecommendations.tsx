import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Search,
  GraduationCap,
  Clock,
  BookOpen,
  Star,
  ExternalLink,
  Award,
  Sparkles,
  AlertCircle,
  X,
} from 'lucide-react';
import { VACANCIES } from '../data/vacancies';
import type { UserProfile } from '../data/userProfile';
import { calculateAllMatches, aggregateMissingSkills } from '../data/matching';
import {
  recommendCoursesForGaps,
  getUniquePlatforms,
  type CourseLevel,
  type CoursePlatform,
} from '../data/courses';

interface CourseRecommendationsProps {
  profile: UserProfile;
  onBack: () => void;
}

const LEVELS: Array<CourseLevel | 'Todos'> = [
  'Todos',
  'Básico',
  'Intermedio',
  'Avanzado',
];

export function CourseRecommendations({ profile, onBack }: CourseRecommendationsProps) {
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<CourseLevel | 'Todos'>('Todos');
  const [platformFilter, setPlatformFilter] = useState<CoursePlatform | 'Todas'>(
    'Todas',
  );

  const recommendations = useMemo(() => {
    const matches = calculateAllMatches(profile, VACANCIES);
    const gaps = aggregateMissingSkills(matches, 20).map((g) => ({
      skill: g.skill,
      demandCount: g.count,
    }));
    return recommendCoursesForGaps(gaps);
  }, [profile]);

  const platforms = useMemo(() => getUniquePlatforms(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recommendations.filter(({ course }) => {
      if (levelFilter !== 'Todos' && course.level !== levelFilter) return false;
      if (platformFilter !== 'Todas' && course.platform !== platformFilter)
        return false;
      if (!q) return true;
      return (
        course.name.toLowerCase().includes(q) ||
        course.skill.toLowerCase().includes(q) ||
        course.platform.toLowerCase().includes(q)
      );
    });
  }, [recommendations, query, levelFilter, platformFilter]);

  const certCount = recommendations.filter(
    (r) => r.course.isCertification,
  ).length;
  const freeCount = recommendations.filter((r) => r.course.isFree).length;

  const clearFilters = () => {
    setQuery('');
    setLevelFilter('Todos');
    setPlatformFilter('Todas');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img
                  src="/logo_skillmatch.png"
                  alt="SkillMatch"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-gray-900 font-semibold text-lg">
                SkillMatch
              </span>
            </div>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={18} />
              Volver
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
            <Sparkles size={18} />
            <span>Rutas de aprendizaje</span>
          </div>
          <h1
            className="text-gray-900 mb-2"
            style={{ fontSize: '28px', fontWeight: 700 }}
          >
            Cursos recomendados para cerrar tus brechas
          </h1>
          <p className="text-gray-600">
            Basados en las habilidades que más piden las vacantes y aún no tienes.
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Cursos sugeridos</span>
              <GraduationCap className="text-purple-600" size={20} />
            </div>
            <p
              className="text-gray-900"
              style={{ fontSize: '32px', fontWeight: 700 }}
            >
              {recommendations.length}
            </p>
            <p className="text-gray-500 text-sm">
              ligados a tus brechas reales
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Certificaciones</span>
              <Award className="text-blue-600" size={20} />
            </div>
            <p
              className="text-gray-900"
              style={{ fontSize: '32px', fontWeight: 700 }}
            >
              {certCount}
            </p>
            <p className="text-gray-500 text-sm">
              con certificación oficial
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Gratuitos</span>
              <Sparkles className="text-green-600" size={20} />
            </div>
            <p
              className="text-gray-900"
              style={{ fontSize: '32px', fontWeight: 700 }}
            >
              {freeCount}
            </p>
            <p className="text-gray-500 text-sm">
              sin costo de inscripción
            </p>
          </div>
        </div>

        {/* Search + filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por curso, habilidad o plataforma…"
                className="flex-1 outline-none text-gray-900"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-2 text-sm">Nivel</label>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((lv) => {
                  const active = levelFilter === lv;
                  return (
                    <button
                      key={lv}
                      onClick={() => setLevelFilter(lv)}
                      className={`px-3 py-1 rounded-full border transition-colors ${
                        active
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {lv}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-2 text-sm">
                Plataforma
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Todas', ...platforms] as Array<
                  CoursePlatform | 'Todas'
                >).map((p) => {
                  const active = platformFilter === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setPlatformFilter(p)}
                      className={`px-3 py-1 rounded-full border transition-colors ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <span className="text-gray-600 text-sm">
              {filtered.length} resultado{filtered.length === 1 ? '' : 's'}
            </span>
            {(query ||
              levelFilter !== 'Todos' ||
              platformFilter !== 'Todas') && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:underline text-sm"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Course cards */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Search className="text-gray-400 mx-auto mb-4" size={40} />
            <h3 className="text-gray-900 mb-2">Sin coincidencias</h3>
            <p className="text-gray-600 mb-4">
              Ajusta los filtros o prueba otra búsqueda.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((rec) => {
              const c = rec.course;
              return (
                <div
                  key={c.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-purple-300 transition-colors flex flex-col"
                >
                  <div className="flex items-start gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs mb-3 self-start max-w-full">
                    <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
                    <span>{rec.reason}</span>
                  </div>

                  {/* min-h reserva 2 líneas para el título: así los bloques de
                      metadatos quedan alineados entre tarjetas de la misma fila */}
                  <div className="flex items-start justify-between mb-3 gap-2 min-h-[3rem]">
                    <h3 className="text-gray-900 flex-1 line-clamp-2 leading-snug">
                      {c.name}
                    </h3>
                    {c.rating && (
                      <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
                        <Star size={14} fill="currentColor" />
                        <span className="text-gray-900 text-sm">
                          {c.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* `flex` y no `inline-flex`: en línea las tres filas se
                      apelotonaban en el mismo renglón en vez de apilarse */}
                  <div className="space-y-2 text-gray-600 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <BookOpen size={14} className="flex-shrink-0" />
                      <span>Plataforma:</span>
                      <span className="text-gray-900 truncate">{c.platform}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles size={14} className="flex-shrink-0" />
                      <span>Habilidad:</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs truncate">
                        {c.skill}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="flex-shrink-0" />
                      <span>Duración:</span>
                      <span className="text-gray-900">{c.duration}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        c.level === 'Básico'
                          ? 'bg-green-100 text-green-700'
                          : c.level === 'Intermedio'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {c.level}
                    </span>
                    {c.isCertification && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                        <Award size={12} />
                        Certificación
                      </span>
                    )}
                    {c.isFree && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        Gratis
                      </span>
                    )}
                  </div>

                  {/* mt-auto pega el botón al fondo: todas las tarjetas de la
                      fila terminan con el CTA a la misma altura */}
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Ver curso
                    <ExternalLink size={14} />
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
