import {
  Target, TrendingUp, Briefcase, GraduationCap, ArrowRight, AlertCircle,
  CheckCircle2, Star, MapPin, Building2, DollarSign, Clock, BookOpen
} from 'lucide-react';
import { VACANCIES, formatSalary } from '../data/vacancies';
import { MOCK_USER_PROFILE } from '../data/userProfile';
import { calculateAllMatches, matchBadgeClasses } from '../data/matching';

interface RecommendationsProps {
  onNavigate: () => void;
  onSeeAllVacancies?: () => void;
}

export function Recommendations({ onNavigate, onSeeAllVacancies }: RecommendationsProps) {
  const allMatches = calculateAllMatches(MOCK_USER_PROFILE, VACANCIES);
  const topMatches = allMatches.slice(0, 4);
  const compatibleCount = allMatches.filter((m) => m.score >= 60).length;
  const avgMatch =
    topMatches.length === 0
      ? 0
      : Math.round(
          topMatches.reduce((sum, m) => sum + m.score, 0) / topMatches.length,
        );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
<header className="bg-white border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">

        {/* Logo nuevo */}
        <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
          <img 
            src="/logo_skillmatch.png"   // 👉 tu logo va en /public/logo.png
            alt="Logo"
            className="w-full h-full object-cover"
          />
        </div>

        <span className="text-gray-900 font-semibold text-lg">
          SkillMatch
        </span>
      </div>

      <button 
        onClick={onNavigate}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Ir al Panel
      </button>
    </div>
  </div>
</header>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
            <CheckCircle2 size={20} />
            <span>Análisis Completado</span>
          </div>
          <h1 className="text-gray-900 mb-2">Tu Perfil Match</h1>
          <p className="text-gray-600">
            Hemos encontrado oportunidades laborales y recursos para potenciar tu carrera en Perú
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 rounded-full mb-4">
                <span style={{
    color: 'black',
    fontWeight: '500',
    fontSize: '40px',
    lineHeight: '1',
  }}>{avgMatch}%</span>
              </div>
              <p className="text-blue-100">Match Promedio</p>
            </div>
<div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 rounded-full mb-4">
                <span style={{
    color: 'black',
    fontWeight: '500',
    fontSize: '40px',
    lineHeight: '1',
  }}>{compatibleCount}</span>
              </div>
              <p className="text-blue-100">Empleos Compatibles</p>
            </div>
                        <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 rounded-full mb-4">
                <span style={{
    color: 'black',
    fontWeight: '500',
    fontSize: '40px',
    lineHeight: '1',
  }}>5</span>
              </div>
              <p className="text-blue-100">Cursos Sugeridos</p>
            </div>
          </div>
        </div>

        {/* Job Matches Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-gray-900 mb-1">Empleos que Coinciden con tu Perfil</h2>
              <p className="text-gray-600">Oportunidades laborales disponibles en Arequipa y Perú</p>
            </div>
            <button
              onClick={onSeeAllVacancies}
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              Ver todos
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {topMatches.map((m) => {
              const job = m.vacancy;
              return (
                <div
                  key={job.id}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">{job.title}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Building2 size={16} />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign size={16} />
                          <span>{formatSalary(job.salary)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{job.modalidad}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase size={16} />
                          <span>
                            {job.experienciaMinimaAnios === 0
                              ? 'Sin experiencia'
                              : `${job.experienciaMinimaAnios}+ años`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className={`text-center px-4 py-2 rounded-lg ${matchBadgeClasses(m.score)}`}>
                        <div className="font-semibold">{m.score}%</div>
                        <div className="text-xs">Match</div>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown */}
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

                  {/* Skill chips with matched/missing */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {m.matchedRequiredSkills.slice(0, 4).map((skill) => (
                      <span
                        key={`m-${skill}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                      >
                        <CheckCircle2 size={12} />
                        {skill}
                      </span>
                    ))}
                    {m.missingRequiredSkills.slice(0, 2).map((skill) => (
                      <span
                        key={`x-${skill}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
                      >
                        <AlertCircle size={12} />
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Ver Detalles
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skills Gap & Courses Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Skills Gap */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-orange-600" size={24} />
              </div>
              <h2 className="text-gray-900">Carencias Detectadas</h2>
            </div>
            <div className="space-y-3">
              {[
                { skill: 'Certificación Scrum Master', gap: 'Alta prioridad' },
                { skill: 'Inglés avanzado', gap: 'Media prioridad' },
                { skill: 'Power BI / Tableau', gap: 'Media prioridad' },
                { skill: 'Gestión de Riesgos PMI', gap: 'Baja prioridad' },
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="pb-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-gray-900">{item.skill}</span>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    item.gap === 'Alta prioridad' ? 'bg-red-100 text-red-700' :
                    item.gap === 'Media prioridad' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.gap}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Courses */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-gray-900">Cursos Recomendados</h2>
                <p className="text-gray-600">
                  Instituciones con presencia en Perú
                </p>
              </div>
            </div>

            <div className="space-y-4">

              {[
                {
                  title: 'Scrum Master PSM I',
                  provider: 'Kanban & Agile Perú',
                  duration: '20 horas',
                  level: 'Intermedio',
                  rating: 4.8,
                  students: '10,200',
                  related: 'Scrum Master',
                },
                {
                  title: 'Inglés para Profesionales',
                  provider: 'Británico',
                  duration: '40 horas',
                  level: 'Avanzado',
                  rating: 4.7,
                  students: '18,350',
                  related: 'Inglés avanzado',
                },
                {
                  title: 'Power BI desde cero',
                  provider: 'Cibertec Perú',
                  duration: '15 horas',
                  level: 'Básico',
                  rating: 4.6,
                  students: '9,800',
                  related: 'Power BI / Tableau',
                },
              ].map((course, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">{course.title}</h3>
                      <p className="text-gray-600 mb-2">{course.provider}</p>
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs mb-2">
                        <AlertCircle size={12} />
                        Relacionado con: {course.related}
                      </div>
                    </div>

                    <div className="ml-4">
                      <div className="flex items-center gap-1 text-yellow-500 mb-1">
                        <Star size={16} fill="currentColor" />
                        <span className="text-gray-900">{course.rating}</span>
                      </div>
                      <p className="text-gray-500 text-xs">{course.students} estudiantes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen size={16} />
                      <span>{course.level}</span>
                    </div>
                  </div>

                  <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    Ver Curso
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
          <h2 className="text-gray-900 mb-6 text-center">Resumen de Oportunidades</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-blue-600 mb-2">{compatibleCount}</div>
              <p className="text-gray-600">Empleos Compatibles</p>
            </div>
            <div className="text-center">
              <div className="text-purple-600 mb-2">5</div>
              <p className="text-gray-600">Cursos Recomendados</p>
            </div>
            <div className="text-center">
              <div className="text-green-600 mb-2">{avgMatch}%</div>
              <p className="text-gray-600">Match Promedio</p>
            </div>
            <div className="text-center">
              <div className="text-orange-600 mb-2">4</div>
              <p className="text-gray-600">Áreas de Mejora</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button 
            onClick={onNavigate}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            Ir al Panel de Usuario
            <ArrowRight size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}
