import {
  Target,
  User,
  FileText,
  TrendingUp,
  Award,
  Settings,
  Bell,
  Search,
  Calendar,
  Briefcase,
  BookOpen,
  MapPin,
  Clock,
  DollarSign,
  CreditCard,
  Edit,
} from "lucide-react";

interface UserDashboardProps {
  onNavigate: (
    screen:
      | "home"
      | "upload"
      | "analyzing"
      | "recommendations"
      | "dashboard",
  ) => void;
}

export function UserDashboard({ onNavigate }: UserDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Logo */}
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img
                  src="/logo_skillmatch.png"
                  alt="SkillMatch Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-gray-900 font-semibold text-lg">
                SkillMatch
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-900 hidden md:block">
                <Search size={20} />
              </button>
              <button className="relative text-gray-600 hover:text-gray-900">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <Settings size={20} />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">¡Bienvenido de nuevo, María!</h1>
          <p className="text-gray-600">
            Aquí tienes un resumen de tu progreso profesional
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Puntuación CV */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Puntuación CV</span>
              <TrendingUp className="text-blue-600" size={20} />
            </div>

            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-700 text-xl font-semibold">85</span>
            </div>

            <p className="text-green-600 text-center">+5 pts esta semana</p>
          </div>

          {/* Análisis Realizados */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Análisis Realizados</span>
              <FileText className="text-purple-600" size={20} />
            </div>

            <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-700 text-xl font-semibold">3</span>
            </div>

            <p className="text-gray-500 text-center">Último: Hace 2 días</p>
          </div>

          {/* Cursos Sugeridos */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Cursos Sugeridos</span>
              <BookOpen className="text-green-600" size={20} />
            </div>

            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
              <span className="text-green-700 text-xl font-semibold">8</span>
            </div>

            <p className="text-gray-500 text-center">2 completados</p>
          </div>

          {/* Ofertas Compatibles */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Ofertas Compatibles</span>
              <Briefcase className="text-orange-600" size={20} />
            </div>

            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-2">
              <span className="text-orange-700 text-xl font-semibold">12</span>
            </div>

            <p className="text-gray-500 text-center">3 nuevas hoy</p>
          </div>
        </div>

        {/* Subscription Plan */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CreditCard size={24} />
              <div>
                <h2 className="text-white mb-1">Plan Mensual</h2>
                <p className="text-blue-100">
                  S/ 9.00/mes • Renovación: 15 de Diciembre
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors">
              Gestionar Plan
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white border-opacity-20">
            <div>
              <p className="text-blue-100 mb-1">Análisis</p>
              <p className="text-white">Ilimitados</p>
            </div>
            <div>
              <p className="text-blue-100 mb-1">Estado</p>
              <p className="text-white">Activo</p>
            </div>
            <div>
              <p className="text-blue-100 mb-1">Desde</p>
              <p className="text-white">Nov 2024</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Skills */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Resumen de Perfil</h2>
                <button
                  onClick={() => onNavigate("upload")}
                  className="text-blue-600 hover:underline"
                >
                  Actualizar CV
                </button>
              </div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="text-white" size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">María González</h3>
                  <p className="text-gray-600 mb-2">Analista de Datos | Tecnología</p>
                  <p className="text-gray-500">Arequipa, Perú • 5 años de experiencia</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-600 mb-4">Principales Habilidades:</p>
                <div className="flex flex-wrap gap-2">
                  {["Gestión de Proyectos", "Liderazgo", "Agile/Scrum", "Comunicación", "Estrategia", "Innovación"].map(
                    (skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Mis Preferencias Laborales</h2>
                <button className="text-blue-600 hover:underline inline-flex items-center gap-1">
                  <Edit size={16} />
                  Editar
                </button>
              </div>

              <div className="space-y-6">
                {/* Job Areas */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="text-blue-600" size={20} />
                    <h3 className="text-gray-900">Áreas de Interés</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Tecnología", "Marketing", "Consultoría"].map((area) => (
                      <span
                        key={area}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Work Details */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="text-green-600" size={18} />
                      <h3 className="text-gray-900">Ubicación</h3>
                    </div>
                    <p className="text-gray-600">Arequipa, Perú</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="text-orange-600" size={18} />
                      <h3 className="text-gray-900">Tipo de Empleo</h3>
                    </div>
                    <p className="text-gray-600">Tiempo Completo</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="text-blue-600" size={18} />
                      <h3 className="text-gray-900">Salario Esperado</h3>
                    </div>
                    <p className="text-gray-600">S/ 3,500 - S/ 5,000</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="text-purple-600" size={18} />
                      <h3 className="text-gray-900">Modalidad</h3>
                    </div>
                    <p className="text-gray-600">Híbrido, Remoto</p>
                  </div>
                </div>

                {/* Career Goals */}
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-gray-900 mb-2">Objetivos Profesionales</h3>
                  <p className="text-gray-600">
                    Busco crecer como líder de proyectos tecnológicos y desarrollar habilidades en gestión de equipos grandes. Me interesa trabajar en empresas innovadoras del sector tech en Arequipa.
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-gray-900 mb-4">Actividad Reciente</h2>
              <div className="space-y-4">
                {[
                  {
                    icon: FileText,
                    text: "Nuevo análisis de CV completado",
                    time: "Hace 2 días",
                    color: "blue",
                  },
                  {
                    icon: Award,
                    text: 'Completaste el curso "Agile Fundamentals"',
                    time: "Hace 5 días",
                    color: "green",
                  },
                  {
                    icon: Briefcase,
                    text: "Guardaste 3 ofertas de empleo",
                    time: "Hace 1 semana",
                    color: "purple",
                  },
                  {
                    icon: TrendingUp,
                    text: "Tu puntuación aumentó a 85/100",
                    time: "Hace 1 semana",
                    color: "orange",
                  },
                ].map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div
                        className={`w-10 h-10 bg-${activity.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`text-${activity.color}-600`} size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">{activity.text}</p>
                        <p className="text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Recommendations & Next Steps */}
          <div className="space-y-6">
            {/* Next Steps */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
              <h2 className="text-white mb-4">Próximos Pasos</h2>
              <div className="space-y-3">
                {[
                  "Completa tu perfil de LinkedIn",
                  "Obtén certificación Scrum Master",
                  "Actualiza tus proyectos recientes",
                  "Practica inglés técnico",
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white">{index + 1}</span>
                    </div>
                    <p className="text-white">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Courses */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-gray-900 mb-4">Cursos Recomendados</h2>
              <div className="space-y-4">
                {[
                  { title: "Advanced Project Management", duration: "6 semanas", level: "Avanzado" },
                  { title: "Leadership Skills", duration: "4 semanas", level: "Intermedio" },
                  { title: "Data Analytics Basics", duration: "3 semanas", level: "Básico" },
                ].map((course, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
                    <h3 className="text-gray-900 mb-2">{course.title}</h3>
                    <div className="flex items-center justify-between text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {course.duration}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">{course.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-gray-900 mb-4">Acciones Rápidas</h2>
              <div className="space-y-2">
                <button
                  onClick={() => onNavigate("upload")}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Nuevo Análisis
                </button>
                <button
                  onClick={() => onNavigate("recommendations")}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Ver Recomendaciones
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
