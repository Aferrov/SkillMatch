import { useMemo } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Sparkles,
  Building2,
  MapPin,
  DollarSign,
  Star,
  Clock,
  BookOpen,
  Edit,
  Target,
  Zap,
} from 'lucide-react';
import { VACANCIES, formatSalary } from '../data/vacancies';
import { MOCK_USER_PROFILE } from '../data/userProfile';
import {
  calculateAllMatches,
  calculateProfileScore,
  aggregateMissingSkills,
  matchBadgeClasses,
} from '../data/matching';

interface ResultsDashboardProps {
  onBack: () => void;
  onSeeRecommendations: () => void;
  onSeeAllVacancies: () => void;
  onImproveProfile: () => void;
}

const SUGGESTED_COURSES = [
  {
    title: 'Scrum Master PSM I',
    provider: 'Kanban & Agile Perú',
    duration: '20 horas',
    level: 'Intermedio',
    rating: 4.8,
    related: 'PMI · Metodologías ágiles',
  },
  {
    title: 'Inglés para Profesionales',
    provider: 'Británico',
    duration: '40 horas',
    level: 'Avanzado',
    rating: 4.7,
    related: 'Inglés avanzado',
  },
  {
    title: 'Power BI desde cero',
    provider: 'Cibertec Perú',
    duration: '15 horas',
    level: 'Básico',
    rating: 4.6,
    related: 'Power BI / Tableau',
  },
];

function profileScoreColor(total: number): string {
  if (total >= 80) return 'text-green-600';
  if (total >= 65) return 'text-blue-600';
  if (total >= 50) return 'text-orange-600';
  return 'text-red-500';
}

function profileScoreLabel(total: number): string {
  if (total >= 80) return 'Perfil muy competitivo';
  if (total >= 65) return 'Perfil sólido';
  if (total >= 50) return 'Perfil con potencial';
  return 'Perfil en construcción';
}

export function ResultsDashboard({
  onBack,
  onSeeRecommendations,
  onSeeAllVacancies,
  onImproveProfile,
}: ResultsDashboardProps) {
  const matches = useMemo(
    () => calculateAllMatches(MOCK_USER_PROFILE, VACANCIES),
    [],
  );
  const profileScore = useMemo(
    () => calculateProfileScore(MOCK_USER_PROFILE, matches),
    [matches],
  );
  const topVacancies = matches.slice(0, 3);
  const compatibleCount = matches.filter((m) => m.score >= 60).length;
  const missingSkills = useMemo(
    () => aggregateMissingSkills(matches, 5),
    [matches],
  );
  const detectedTechnicalSkills = MOCK_USER_PROFILE.technicalSkills.slice(0, 10);
  const detectedSoftSkills = MOCK_USER_PROFILE.softSkills.slice(0, 6);

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
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
            <CheckCircle2 size={18} />
            <span>Diagnóstico completado</span>
          </div>
          <h1
            className="text-gray-900 mb-2"
            style={{ fontSize: '28px', fontWeight: 700 }}
          >
            Tu Dashboard de Resultados
          </h1>
          <p className="text-gray-600">
            Hola {MOCK_USER_PROFILE.name.split(' ')[0]} · Aquí tienes la radiografía completa de tu perfil profesional.
          </p>
        </div>

        {/* SECTION 1: Puntuación general del CV */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="text-center">
              <p className="text-blue-100 mb-2">Puntuación general del CV</p>
              <div className="inline-flex items-baseline gap-1">
                <span style={{ fontSize: '64px', fontWeight: 700, lineHeight: 1, color: 'white' }}>
                  {profileScore.total}
                </span>
                <span className="text-blue-100">/100</span>
              </div>
              <div className="inline-flex items-center gap-1 bg-white bg-opacity-20 px-3 py-1 rounded-full mt-3">
                <Sparkles size={14} />
                <span className="text-sm">{profileScoreLabel(profileScore.total)}</span>
              </div>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-3">
              {[
                { label: 'Amplitud de skills', value: profileScore.breakdown.skillsBreadth, max: 20 },
                { label: 'Experiencia', value: profileScore.breakdown.experience, max: 20 },
                { label: 'Encaje con mercado', value: profileScore.breakdown.marketFit, max: 50 },
                { label: 'Cobertura del mercado', value: profileScore.breakdown.compatibilityBreadth, max: 10 },
              ].map((b) => (
                <div key={b.label} className="bg-white bg-opacity-10 rounded-lg p-4">
                  <p className="text-blue-100 text-sm mb-1">{b.label}</p>
                  <p className="text-white">
                    <span className="font-semibold">{b.value}</span>
                    <span className="text-blue-100 text-sm"> / {b.max}</span>
                  </p>
                  <div className="bg-white bg-opacity-20 rounded-full h-1 mt-2 overflow-hidden">
                    <div
                      className="bg-white h-full"
                      style={{ width: `${(b.value / b.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2 + 3: Habilidades detectadas + faltantes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Detected */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="text-green-600" size={24} />
                </div>
                <div>
                  <h2 className="text-gray-900">Habilidades detectadas</h2>
                  <p className="text-gray-600 text-sm">
                    {detectedTechnicalSkills.length + detectedSoftSkills.length} fortalezas en tu perfil
                  </p>
                </div>
              </div>
              <button
                onClick={onImproveProfile}
                className="text-blue-600 hover:underline inline-flex items-center gap-1 text-sm"
              >
                <Edit size={14} />
                Editar
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm mb-2">Técnicas</p>
                <div className="flex flex-wrap gap-2">
                  {detectedTechnicalSkills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-2">Blandas</p>
                <div className="flex flex-wrap gap-2">
                  {detectedSoftSkills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Missing */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="text-orange-600" size={24} />
                </div>
                <div>
                  <h2 className="text-gray-900">Habilidades faltantes</h2>
                  <p className="text-gray-600 text-sm">
                    Más demandadas en las vacantes que no cubres aún
                  </p>
                </div>
              </div>
            </div>
            {missingSkills.length === 0 ? (
              <p className="text-gray-600">¡No detectamos brechas significativas!</p>
            ) : (
              <div className="space-y-3">
                {missingSkills.map((m) => (
                  <div
                    key={m.skill}
                    className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <p className="text-gray-900">{m.skill}</p>
                      <p className="text-gray-500 text-sm">
                        Pedida en {m.count} vacante{m.count === 1 ? '' : 's'}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        m.priority === 'Alta'
                          ? 'bg-red-100 text-red-700'
                          : m.priority === 'Media'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {m.priority} prioridad
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: Vacantes compatibles */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-gray-900">Vacantes compatibles</h2>
                <p className="text-gray-600 text-sm">
                  Tienes {compatibleCount} ofertas con match ≥ 60% en Arequipa y Perú
                </p>
              </div>
            </div>
            <button
              onClick={onSeeAllVacancies}
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              Ver todas
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topVacancies.map((m) => {
              const v = m.vacancy;
              return (
                <div
                  key={v.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">{v.title}</h3>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Building2 size={14} />
                        <span>{v.company}</span>
                      </div>
                    </div>
                    <div className={`text-center px-2 py-1 rounded-lg ${matchBadgeClasses(m.score)}`}>
                      <div className="font-semibold text-sm">{m.score}%</div>
                    </div>
                  </div>
                  <div className="space-y-1 text-gray-600 text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{v.location} · {v.modalidad}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} />
                      <span>{formatSalary(v.salary)}</span>
                    </div>
                  </div>
                  <button
                    onClick={onSeeRecommendations}
                    className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                  >
                    Ver detalles
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 5: Cursos sugeridos */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-purple-600" size={24} />
              </div>
              <div>
                <h2 className="text-gray-900">Cursos sugeridos</h2>
                <p className="text-gray-600 text-sm">
                  Formación recomendada para cubrir tus brechas
                </p>
              </div>
            </div>
            <button
              onClick={onSeeRecommendations}
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              Ver todos
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SUGGESTED_COURSES.map((c) => (
              <div
                key={c.title}
                className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-gray-900 flex-1">{c.title}</h3>
                  <div className="inline-flex items-center gap-1 text-yellow-500 ml-2">
                    <Star size={14} fill="currentColor" />
                    <span className="text-gray-900 text-sm">{c.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{c.provider}</p>
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs mb-3">
                  <AlertCircle size={12} />
                  Relacionado con: {c.related}
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm mb-3">
                  <div className="inline-flex items-center gap-1">
                    <Clock size={14} />
                    <span>{c.duration}</span>
                  </div>
                  <div className="inline-flex items-center gap-1">
                    <BookOpen size={14} />
                    <span>{c.level}</span>
                  </div>
                </div>
                <button className="w-full py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                  Ver curso
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6: Acciones rápidas */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-blue-600" size={20} />
            <h2 className="text-gray-900">Acciones rápidas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              onClick={onSeeRecommendations}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Target size={18} />
              Ver detalles del análisis
            </button>
            <button
              onClick={onImproveProfile}
              className="bg-white border border-blue-600 text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              <TrendingUp size={18} />
              Mejorar mi perfil
            </button>
            <button
              onClick={onSeeAllVacancies}
              className="bg-white border border-purple-600 text-purple-600 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Briefcase size={18} />
              Explorar vacantes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
