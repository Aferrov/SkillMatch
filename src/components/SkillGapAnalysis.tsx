import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  X,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { VACANCIES } from '../data/vacancies';
import { MOCK_USER_PROFILE } from '../data/userProfile';
import { analyzeSkillGap } from '../data/matching';

interface SkillGapAnalysisProps {
  onBack: () => void;
  onSeeVacancies: () => void;
  onSeeCourses?: () => void;
}

type Filter = 'all' | 'detected' | 'missing';

export function SkillGapAnalysis({
  onBack,
  onSeeVacancies,
  onSeeCourses,
}: SkillGapAnalysisProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const entries = useMemo(
    () => analyzeSkillGap(MOCK_USER_PROFILE, VACANCIES),
    [],
  );

  const detected = entries.filter((e) => e.status === 'Detectada').length;
  const missing = entries.filter((e) => e.status === 'Faltante').length;
  const coverage =
    entries.length === 0
      ? 0
      : Math.round((detected / entries.length) * 100);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (filter === 'detected' && e.status !== 'Detectada') return false;
      if (filter === 'missing' && e.status !== 'Faltante') return false;
      if (q && !e.skill.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [entries, filter, query]);

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
            <TrendingUp size={18} />
            <span>Análisis de brechas</span>
          </div>
          <h1
            className="text-gray-900 mb-2"
            style={{ fontSize: '28px', fontWeight: 700 }}
          >
            Habilidades del mercado vs tu perfil
          </h1>
          <p className="text-gray-600">
            Compara qué habilidades pide el mercado con las que ya tienes. Entiende por qué calificas o por qué no.
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Detectadas</span>
              <CheckCircle2 className="text-green-600" size={20} />
            </div>
            <p className="text-gray-900" style={{ fontSize: '32px', fontWeight: 700 }}>
              {detected}
            </p>
            <p className="text-gray-500 text-sm">
              habilidades cubiertas de {entries.length} en demanda
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Faltantes</span>
              <AlertCircle className="text-orange-600" size={20} />
            </div>
            <p className="text-gray-900" style={{ fontSize: '32px', fontWeight: 700 }}>
              {missing}
            </p>
            <p className="text-gray-500 text-sm">
              brechas para cerrar
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100">Cobertura del mercado</span>
              <TrendingUp className="text-white" size={20} />
            </div>
            <p className="text-white" style={{ fontSize: '32px', fontWeight: 700 }}>
              {coverage}%
            </p>
            <div className="bg-white/20 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-white h-full"
                style={{ width: `${coverage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter + search */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar habilidad…"
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
          <div className="flex flex-wrap gap-2">
            {([
              { id: 'all', label: `Todas (${entries.length})` },
              { id: 'detected', label: `Detectadas (${detected})` },
              { id: 'missing', label: `Faltantes (${missing})` },
            ] as { id: Filter; label: string }[]).map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    active
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table-like list */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          {/* Table header (only md+) */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
            <div className="col-span-4">Habilidad</div>
            <div className="col-span-2">Estado</div>
            <div className="col-span-2">Demanda</div>
            <div className="col-span-4">Ejemplo en vacantes</div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Search className="text-gray-400 mx-auto mb-4" size={40} />
              <p className="text-gray-600">No se encontraron habilidades con ese criterio.</p>
            </div>
          ) : (
            <div>
              {filtered.map((e) => (
                <div
                  key={e.skill}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="md:col-span-4 flex items-center gap-2">
                    {e.status === 'Detectada' ? (
                      <CheckCircle2 className="text-green-600 flex-shrink-0" size={18} />
                    ) : (
                      <AlertCircle className="text-orange-600 flex-shrink-0" size={18} />
                    )}
                    <span className="text-gray-900">{e.skill}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        e.status === 'Detectada'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {e.status}
                    </span>
                  </div>
                  <div className="md:col-span-2 text-gray-600 text-sm">
                    {e.requiredInCount > 0 && (
                      <span>{e.requiredInCount} requerida{e.requiredInCount === 1 ? '' : 's'}</span>
                    )}
                    {e.requiredInCount > 0 && e.niceToHaveInCount > 0 && <br />}
                    {e.niceToHaveInCount > 0 && (
                      <span className="text-gray-500">
                        {e.niceToHaveInCount} deseable{e.niceToHaveInCount === 1 ? '' : 's'}
                      </span>
                    )}
                  </div>
                  <div className="md:col-span-4 text-gray-600 text-sm">
                    {e.topVacancies.join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Why I qualify / don't qualify */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="text-green-600" size={20} />
              <h2 className="text-gray-900">Por qué calificas</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Estas son las habilidades del mercado que ya tienes y que te abren puertas:
            </p>
            <div className="flex flex-wrap gap-2">
              {entries
                .filter((e) => e.status === 'Detectada')
                .slice(0, 8)
                .map((e) => (
                  <span
                    key={e.skill}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {e.skill}
                  </span>
                ))}
            </div>
          </div>
          <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="text-orange-600" size={20} />
              <h2 className="text-gray-900">Por qué no calificas en algunas</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Estas habilidades aparecen en muchas vacantes pero no las tienes aún:
            </p>
            <div className="flex flex-wrap gap-2">
              {entries
                .filter((e) => e.status === 'Faltante')
                .slice(0, 8)
                .map((e) => (
                  <span
                    key={e.skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                  >
                    {e.skill}
                    <span className="text-orange-600">·{e.totalDemand}</span>
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
          <h2 className="text-gray-900 mb-4">¿Qué hacer ahora?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={onSeeVacancies}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Briefcase size={18} />
              Ver vacantes donde sí calificas
            </button>
            <button
              onClick={onSeeCourses}
              className="bg-white border border-purple-600 text-purple-600 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              <GraduationCap size={18} />
              Cubrir brechas con cursos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
