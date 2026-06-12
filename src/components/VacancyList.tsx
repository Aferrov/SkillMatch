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
} from 'lucide-react';
import {
  VACANCIES,
  formatSalary,
  getUniqueLocations,
  getUniqueModalidades,
  type Modalidad,
} from '../data/vacancies';

interface VacancyListProps {
  onBack: () => void;
}

export function VacancyList({ onBack }: VacancyListProps) {
  const [query, setQuery] = useState('');
  const [modalidadFilter, setModalidadFilter] = useState<Modalidad | 'Todas'>(
    'Todas',
  );
  const [locationFilter, setLocationFilter] = useState<string>('Todas');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const locations = useMemo(() => getUniqueLocations(), []);
  const modalidades = useMemo(() => getUniqueModalidades(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VACANCIES.filter((v) => {
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
  }, [query, modalidadFilter, locationFilter]);

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

          {hasFilters && (
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-gray-600 text-sm">
                {filtered.length} resultado{filtered.length === 1 ? '' : 's'}
              </span>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:underline text-sm"
              >
                Limpiar filtros
              </button>
            </div>
          )}
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
            {filtered.map((v) => {
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
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        v.modalidad === 'Remoto'
                          ? 'bg-green-100 text-green-700'
                          : v.modalidad === 'Híbrido'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {v.modalidad}
                    </span>
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
                      <span>{v.contractType}</span>
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

                  <div className="mb-4">
                    <p className="text-gray-600 text-sm mb-2">
                      Habilidades requeridas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {v.requiredSkills.map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-100 pt-4 mb-4 space-y-4">
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
                            Deseables
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {v.niceToHaveSkills.map((s) => (
                              <span
                                key={s}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                              >
                                {s}
                              </span>
                            ))}
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
