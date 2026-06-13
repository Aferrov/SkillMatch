import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { VACANCIES, formatSalary } from '../data/vacancies';
import { MOCK_USER_PROFILE } from '../data/userProfile';
import {
  calculateAllMatches,
  matchBadgeClasses,
  matchBucket,
  matchLabel,
  type MatchResult,
} from '../data/matching';

interface JobRecommendationsProps {
  onBack: () => void;
  onSeeAllVacancies: () => void;
}

type SortMode = 'match' | 'salary';

const BUCKET_META: Record<
  'excellent' | 'good' | 'fair',
  { title: string; subtitle: string; icon: typeof Target; color: string }
> = {
  excellent: {
    title: 'Match excelente',
    subtitle: 'Coinciden plenamente con tu perfil',
    icon: Sparkles,
    color: 'text-green-600',
  },
  good: {
    title: 'Buen match',
    subtitle: 'Encaje sólido, vale la pena postular',
    icon: Target,
    color: 'text-blue-600',
  },
  fair: {
    title: 'Match parcial',
    subtitle: 'Hay brechas, pero pueden ser opciones de crecimiento',
    icon: TrendingUp,
    color: 'text-purple-600',
  },
};

export function JobRecommendations({
  onBack,
  onSeeAllVacancies,
}: JobRecommendationsProps) {
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('match');
  const [onlyPreferredMode, setOnlyPreferredMode] = useState(false);

  const recommendations = useMemo(() => {
    const all = calculateAllMatches(MOCK_USER_PROFILE, VACANCIES);
    let list = all.filter((m) => m.score >= 55);
    if (onlyPreferredMode) {
      list = list.filter((m) =>
        MOCK_USER_PROFILE.preferredModalidades.includes(m.vacancy.modalidad),
      );
    }
    if (sortMode === 'salary') {
      return [...list].sort(
        (a, b) =>
          (b.vacancy.salary?.max ?? 0) - (a.vacancy.salary?.max ?? 0),
      );
    }
    return list;
  }, [sortMode, onlyPreferredMode]);

  const grouped = useMemo(() => {
    const buckets: Record<'excellent' | 'good' | 'fair', MatchResult[]> = {
      excellent: [],
      good: [],
      fair: [],
    };
    for (const m of recommendations) {
      const b = matchBucket(m.score);
      if (b === 'low') continue;
      buckets[b].push(m);
    }
    return buckets;
  }, [recommendations]);

  const avgMatch =
    recommendations.length === 0
      ? 0
      : Math.round(
          recommendations.reduce((s, m) => s + m.score, 0) /
            recommendations.length,
        );

  const toggleApply = (id: string) => {
    setAppliedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
            <Briefcase size={18} />
            <span>Empleos recomendados</span>
          </div>
          <h1
            className="text-gray-900 mb-2"
            style={{ fontSize: '28px', fontWeight: 700 }}
          >
            Vacantes pensadas para ti, {MOCK_USER_PROFILE.name.split(' ')[0]}
          </h1>
          <p className="text-gray-600">
            Seleccionadas según tu perfil, tu experiencia y tus preferencias de modalidad y ubicación.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-600">
            <p className="text-gray-600 mb-1">Recomendaciones</p>
            <p
              className="text-gray-900"
              style={{ fontSize: '32px', fontWeight: 700 }}
            >
              {recommendations.length}
            </p>
            <p className="text-gray-500 text-sm">
              vacantes con match ≥ 55%
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-600">
            <p className="text-gray-600 mb-1">Match promedio</p>
            <p
              className="text-gray-900"
              style={{ fontSize: '32px', fontWeight: 700 }}
            >
              {avgMatch}%
            </p>
            <p className="text-gray-500 text-sm">en tus recomendaciones</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-600">
            <p className="text-gray-600 mb-1">Postulaciones</p>
            <p
              className="text-gray-900"
              style={{ fontSize: '32px', fontWeight: 700 }}
            >
              {appliedIds.size}
            </p>
            <p className="text-gray-500 text-sm">
              {appliedIds.size === 0
                ? 'aún no postulas a ninguna'
                : 'aplicaciones enviadas'}
            </p>
          </div>
        </div>

        {/* Sort + filter mini bar */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex border border-gray-200 rounded-lg overflow-hidden text-sm">
            <button
              onClick={() => setSortMode('match')}
              className={`px-3 py-1 transition-colors ${
                sortMode === 'match'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Mejor match
            </button>
            <button
              onClick={() => setSortMode('salary')}
              className={`px-3 py-1 transition-colors ${
                sortMode === 'salary'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Mayor salario
            </button>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyPreferredMode}
              onChange={(e) => setOnlyPreferredMode(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-gray-700 text-sm">
              Solo {MOCK_USER_PROFILE.preferredModalidades.join(' / ')}
            </span>
          </label>
          <button
            onClick={onSeeAllVacancies}
            className="text-blue-600 hover:underline text-sm"
          >
            Ver todas las vacantes →
          </button>
        </div>

        {/* Grouped results */}
        {recommendations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Briefcase className="text-gray-400 mx-auto mb-4" size={40} />
            <h3 className="text-gray-900 mb-2">Sin recomendaciones</h3>
            <p className="text-gray-600">
              No encontramos vacantes con el match que pediste. Prueba quitando filtros.
            </p>
          </div>
        ) : (
          (['excellent', 'good', 'fair'] as const).map((bucket) => {
            const list = grouped[bucket];
            if (list.length === 0) return null;
            const meta = BUCKET_META[bucket];
            const Icon = meta.icon;
            return (
              <div key={bucket} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className={meta.color} size={22} />
                  <div>
                    <h2 className="text-gray-900">
                      {meta.title} · {list.length}
                    </h2>
                    <p className="text-gray-600 text-sm">{meta.subtitle}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {list.map((m) => {
                    const v = m.vacancy;
                    const isExpanded = expandedId === v.id;
                    const isApplied = appliedIds.has(v.id);
                    return (
                      <div
                        key={v.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-500 transition-colors"
                      >
                        {/* Top row: title + match */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="text-gray-900 mb-1">{v.title}</h3>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Building2 size={16} />
                              <span>{v.company}</span>
                            </div>
                          </div>
                          <div
                            className={`text-center px-3 py-2 rounded-lg ${matchBadgeClasses(m.score)}`}
                          >
                            <div className="font-semibold">{m.score}%</div>
                            <div className="text-xs">Match</div>
                          </div>
                        </div>

                        {/* Modalidad + ubicación + salario + contrato */}
                        <div className="flex flex-wrap gap-3 text-gray-600 mb-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                              v.modalidad === 'Remoto'
                                ? 'bg-green-100 text-green-700'
                                : v.modalidad === 'Híbrido'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}
                          >
                            <Clock size={12} />
                            {v.modalidad}
                          </span>
                          <div className="inline-flex items-center gap-1 text-sm">
                            <MapPin size={14} />
                            <span>{v.location}</span>
                          </div>
                          <div className="inline-flex items-center gap-1 text-sm">
                            <DollarSign size={14} />
                            <span>{formatSalary(v.salary)}</span>
                          </div>
                        </div>

                        {/* Habilidades requeridas (breve) */}
                        <div className="mb-4">
                          <p className="text-gray-600 text-sm mb-2">
                            Habilidades requeridas
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {v.requiredSkills.slice(0, 4).map((s) => {
                              const isMatched =
                                m.matchedRequiredSkills.includes(s);
                              return (
                                <span
                                  key={s}
                                  className={`px-3 py-1 rounded-full text-sm ${
                                    isMatched
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {s}
                                </span>
                              );
                            })}
                            {v.requiredSkills.length > 4 && (
                              <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-sm">
                                +{v.requiredSkills.length - 4} más
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Expandable details */}
                        {isExpanded && (
                          <div className="border-t border-gray-100 pt-4 mb-4 space-y-3">
                            <div>
                              <p className="text-gray-600 text-sm mb-1">
                                Diagnóstico
                              </p>
                              <p className="text-gray-900">
                                {matchLabel(m.score)} · cubres{' '}
                                {m.matchedRequiredSkills.length} de{' '}
                                {v.requiredSkills.length} habilidades requeridas
                                · experiencia mínima{' '}
                                {v.experienciaMinimaAnios === 0
                                  ? 'no requerida'
                                  : `${v.experienciaMinimaAnios}+ años`}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 text-sm mb-1">
                                Descripción
                              </p>
                              <p className="text-gray-900">{v.description}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 text-sm mb-2">
                                Responsabilidades
                              </p>
                              <ul className="space-y-1">
                                {v.responsibilities.map((r, i) => (
                                  <li
                                    key={i}
                                    className="text-gray-900 flex items-start gap-2"
                                  >
                                    <span className="text-blue-600">·</span>
                                    <span>{r}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {m.missingRequiredSkills.length > 0 && (
                              <div>
                                <p className="text-gray-600 text-sm mb-2">
                                  Brechas para postular
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {m.missingRequiredSkills.map((s) => (
                                    <span
                                      key={s}
                                      className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
                                    >
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() =>
                              setExpandedId(isExpanded ? null : v.id)
                            }
                            className="py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center justify-center gap-1"
                          >
                            {isExpanded ? (
                              <>
                                Ocultar <ChevronUp size={16} />
                              </>
                            ) : (
                              <>
                                Ver detalles <ChevronDown size={16} />
                              </>
                            )}
                          </button>
                          {isApplied ? (
                            <button
                              onClick={() => toggleApply(v.id)}
                              className="py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-100 inline-flex items-center justify-center gap-1"
                            >
                              <CheckCircle2 size={16} />
                              Postulación enviada
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleApply(v.id)}
                              className="py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-1"
                            >
                              Postular
                              <Send size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
