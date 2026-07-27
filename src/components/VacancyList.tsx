import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Search,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Database,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  VACANCIES,
  formatSalary,
  getUniqueLocations,
  getUniqueModalidades,
  type Modalidad,
} from '../data/vacancies';
import type { UserProfile } from '../data/userProfile';
import { calculateAllMatches, matchBadgeClasses, matchLabel } from '../data/matching';

interface VacancyListProps {
  profile: UserProfile;
  onBack: () => void;
}

type SortMode = 'match' | 'recent';

export function VacancyList({ profile, onBack }: VacancyListProps) {
  const [query, setQuery] = useState('');
  const [modalidadFilter, setModalidadFilter] = useState<Modalidad | 'Todas'>(
    'Todas',
  );
  const [locationFilter, setLocationFilter] = useState<string>('Todas');
  const [sortMode, setSortMode] = useState<SortMode>('match');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const locations = useMemo(() => getUniqueLocations(), []);
  const modalidades = useMemo(() => getUniqueModalidades(), []);
  const allMatches = useMemo(
    () => calculateAllMatches(profile, VACANCIES),
    [profile],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = allMatches.filter((m) => {
      const v = m.vacancy;
      if (modalidadFilter !== 'Todas' && v.modalidad !== modalidadFilter) {
        return false;
      }
      if (locationFilter !== 'Todas' && v.location !== locationFilter) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        v.title,
        v.company,
        v.industry,
        ...v.requiredSkills,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
    if (sortMode === 'match') {
      return base.sort((a, b) => b.score - a.score);
    }
    return [...base].sort(
      (a, b) =>
        new Date(b.vacancy.postedAt).getTime() -
        new Date(a.vacancy.postedAt).getTime(),
    );
  }, [allMatches, query, modalidadFilter, locationFilter, sortMode]);

  const clearFilters = () => {
    setQuery('');
    setModalidadFilter('Todas');
    setLocationFilter('Todas');
  };

  const hasFilters =
    query.trim() !== '' ||
    modalidadFilter !== 'Todas' ||
    locationFilter !== 'Todas';

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
            <Database size={18} />
            <span>Base de datos de vacantes</span>
          </div>
          <h1 className="text-gray-900 mb-2" style={{ fontSize: '28px', fontWeight: 700 }}>
            Explora ofertas reales y simuladas
          </h1>
          <p className="text-gray-600">
            {VACANCIES.length} vacantes registradas · sirven de base para comparar tu CV con el mercado.
          </p>
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
                placeholder="Buscar por puesto, empresa o habilidad…"
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
              <label className="block text-gray-600 mb-2 text-sm">
                Modalidad
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Todas', ...modalidades] as Array<Modalidad | 'Todas'>).map(
                  (m) => {
                    const active = modalidadFilter === m;
                    return (
                      <button
                        key={m}
                        onClick={() => setModalidadFilter(m)}
                        className={`px-3 py-1 rounded-full border transition-colors ${
                          active
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {m}
                      </button>
                    );
                  },
                )}
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-2 text-sm">
                Ubicación
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Todas', ...locations] as string[]).map((loc) => {
                  const active = locationFilter === loc;
                  return (
                    <button
                      key={loc}
                      onClick={() => setLocationFilter(loc)}
                      className={`px-3 py-1 rounded-full border transition-colors ${
                        active
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {loc}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 gap-3 flex-wrap">
            <span className="text-gray-600 text-sm">
              {filtered.length} resultado{filtered.length === 1 ? '' : 's'}
            </span>
            <div className="flex items-center gap-3">
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
                  onClick={() => setSortMode('recent')}
                  className={`px-3 py-1 transition-colors ${
                    sortMode === 'recent'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Más recientes
                </button>
              </div>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Search className="text-gray-400 mx-auto mb-4" size={40} />
            <h3 className="text-gray-900 mb-2">Sin coincidencias</h3>
            <p className="text-gray-600 mb-4">
              Prueba ajustando los filtros o usa otra palabra clave.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((m) => {
              const v = m.vacancy;
              const isExpanded = expandedId === v.id;
              return (
                <div
                  key={v.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">{v.title}</h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 size={16} />
                        <span>{v.company}</span>
                      </div>
                    </div>
                    <div className={`text-center px-3 py-2 rounded-lg ${matchBadgeClasses(m.score)}`}>
                      <div className="font-semibold">{m.score}%</div>
                      <div className="text-xs">Match</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-gray-600 mb-4">
                    <div className="inline-flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{v.location}</span>
                    </div>
                    <div className="inline-flex items-center gap-1">
                      <DollarSign size={16} />
                      <span>{formatSalary(v.salary)}</span>
                    </div>
                    <div className="inline-flex items-center gap-1">
                      <Clock size={16} />
                      <span>{v.modalidad} · {v.contractType}</span>
                    </div>
                    <div className="inline-flex items-center gap-1">
                      <Briefcase size={16} />
                      <span>
                        {v.experienciaMinimaAnios === 0
                          ? 'Sin experiencia'
                          : `${v.experienciaMinimaAnios}+ años`}{' '}
                        · {v.experienciaNivel}
                      </span>
                    </div>
                  </div>

                  {/* Match breakdown */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { label: 'Skills', value: m.breakdown.skillsScore },
                      { label: 'Exp.', value: m.breakdown.experienceScore },
                      { label: 'Modal.', value: m.breakdown.modalidadScore },
                      { label: 'Ubic.', value: m.breakdown.locationScore },
                    ].map((b) => (
                      <div
                        key={b.label}
                        className="bg-gray-50 rounded-lg px-2 py-2 text-center"
                      >
                        <div className="text-gray-900 text-sm font-semibold">
                          {b.value}%
                        </div>
                        <div className="text-gray-500 text-xs">{b.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600 text-sm mb-2">
                      Habilidades requeridas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {v.requiredSkills.map((s) => {
                        const isMatched = m.matchedRequiredSkills.includes(s);
                        return (
                          <span
                            key={s}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                              isMatched
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-50 text-orange-700'
                            }`}
                          >
                            {isMatched ? (
                              <CheckCircle2 size={12} />
                            ) : (
                              <AlertCircle size={12} />
                            )}
                            {s}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-100 pt-4 mb-4 space-y-4">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">
                          Diagnóstico de compatibilidad
                        </p>
                        <p className="text-gray-900">
                          {matchLabel(m.score)} · coincides en{' '}
                          {m.matchedRequiredSkills.length} de{' '}
                          {v.requiredSkills.length} skills requeridas
                          {m.missingRequiredSkills.length > 0 &&
                            ` · te faltan ${m.missingRequiredSkills.length}`}
                          .
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
                      {v.niceToHaveSkills && v.niceToHaveSkills.length > 0 && (
                        <div>
                          <p className="text-gray-600 text-sm mb-2">
                            Deseables ({m.matchedNiceToHaveSkills.length}/
                            {v.niceToHaveSkills.length} cubiertos)
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {v.niceToHaveSkills.map((s) => {
                              const isMatched =
                                m.matchedNiceToHaveSkills.includes(s);
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
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Industria: {v.industry}</span>
                        <span>Publicada: {v.postedAt}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : v.id)}
                    className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center justify-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        Ocultar detalles <ChevronUp size={16} />
                      </>
                    ) : (
                      <>
                        Ver detalles <ChevronDown size={16} />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
