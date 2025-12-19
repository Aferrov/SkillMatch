import { useState } from 'react';
import { Target, ArrowLeft, Briefcase, MapPin, DollarSign, Clock, GraduationCap, Heart } from 'lucide-react';

interface PreferencesFormProps {
  onComplete: () => void;
  onBack: () => void;
}

export function PreferencesForm({ onComplete, onBack }: PreferencesFormProps) {
  const [formData, setFormData] = useState({
    jobAreas: [] as string[],
    jobTypes: [] as string[],
    locations: [] as string[],
    salaryRange: '',
    availability: '',
    workModality: [] as string[],
    careerGoals: '',
    additionalSkills: '',
  });

  // -------------------------------
  // ÁREAS DE TRABAJO (PERÚ)
  // -------------------------------
  const jobAreasOptions = [
    'Tecnología / Sistemas',
    'Administración',
    'Marketing y Publicidad',
    'Ventas y Comercial',
    'Contabilidad y Finanzas',
    'Recursos Humanos',
    'Ingeniería',
    'Construcción y Minería',
    'Operaciones / Logística',
    'Educación',
    'Salud',
    'Diseño Gráfico / UX',
    'Atención al Cliente / Call Center',
  ];

  // -------------------------------
  // TIPOS DE EMPLEO (igual)
  // -------------------------------
  const jobTypesOptions = [
    'Tiempo Completo',
    'Medio Tiempo',
    'Freelance',
    'Contrato',
    'Prácticas',
    'Temporal',
  ];

  // -------------------------------
  // UBICACIONES (AREQUIPA – PERÚ)
  // -------------------------------
  const locationOptions = [
    'Arequipa – Cercado',
    'Cayma',
    'Yanahuara',
    'José Luis Bustamante y Rivero',
    'Paucarpata',
    'Cerro Colorado',
    'Miraflores',
    'Sachaca',
    'Hunter',
    'Majes',
    'Mollendo',
    'Camana',
    'Moquegua',
    'Tacna',
    'Cualquier ubicación',
  ];

  // -------------------------------
  // MODALIDAD
  // -------------------------------
  const modalityOptions = [
    'Presencial',
    'Remoto',
    'Híbrido',
  ];

  // Toggle para selecciones múltiples
  const toggleSelection = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter((i) => i !== item);
    } else {
      return [...array, item];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  const isFormValid = () => {
    return (
      formData.jobAreas.length > 0 &&
      formData.jobTypes.length > 0 &&
      formData.locations.length > 0 &&
      formData.salaryRange &&
      formData.availability &&
      formData.workModality.length > 0
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
                <ArrowLeft size={24} />
              </button>
              <div className="flex items-center gap-2">
                {/* 👉 Nuevo logo */}
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <img
              src="/logo_skillmatch.png"   // Asegúrate de tener esta imagen en /public
              alt="SkillMatch Logo"
              className="w-full h-full object-cover"
            />
          </div>
                <span className="text-gray-900">SkillMatch</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                ✓
              </div>
              <span className="text-gray-600 hidden sm:inline">CV Subido</span>
            </div>
            <div className="flex-1 h-1 bg-blue-600"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                2
              </div>
              <span className="text-gray-900 hidden sm:inline">Preferencias</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                3
              </div>
              <span className="text-gray-400 hidden sm:inline">Análisis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-gray-900 mb-4">Completa tu Perfil</h1>
          <p className="text-gray-600">
            Ayúdanos a conocer mejor tus preferencias para ofrecerte las mejores oportunidades
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Job Areas */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="text-blue-600" size={24} />
              <div>
                <h2 className="text-gray-900">Áreas de Interés</h2>
                <p className="text-gray-600">Selecciona las áreas donde te gustaría trabajar</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {jobAreasOptions.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      jobAreas: toggleSelection(formData.jobAreas, area),
                    })
                  }
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.jobAreas.includes(area)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Job Types */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-purple-600" size={24} />
              <div>
                <h2 className="text-gray-900">Tipo de Empleo</h2>
                <p className="text-gray-600">¿Qué tipo de contrato buscas?</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {jobTypesOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      jobTypes: toggleSelection(formData.jobTypes, type),
                    })
                  }
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.jobTypes.includes(type)
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-700 hover:border-purple-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Locations & Modality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Locations */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="text-green-600" size={24} />
                <div>
                  <h2 className="text-gray-900">Ubicaciones</h2>
                  <p className="text-gray-600">¿Dónde te gustaría trabajar?</p>
                </div>
              </div>
              <div className="space-y-2">
                {locationOptions.map((location) => (
                  <button
                    key={location}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        locations: toggleSelection(formData.locations, location),
                      })
                    }
                    className={`w-full px-4 py-2 rounded-lg border-2 transition-all text-left ${
                      formData.locations.includes(location)
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-200 text-gray-700 hover:border-green-300'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            {/* Work Modality */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="text-orange-600" size={24} />
                <div>
                  <h2 className="text-gray-900">Modalidad</h2>
                  <p className="text-gray-600">¿Cómo prefieres trabajar?</p>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                {modalityOptions.map((modality) => (
                  <button
                    key={modality}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        workModality: toggleSelection(formData.workModality, modality),
                      })
                    }
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.workModality.includes(modality)
                        ? 'border-orange-600 bg-orange-50 text-orange-700'
                        : 'border-gray-200 text-gray-700 hover:border-orange-300'
                    }`}
                  >
                    {modality}
                  </button>
                ))}
              </div>

              {/* Availability */}
              <div>
                <label className="block text-gray-700 mb-2">Disponibilidad</label>
                <select
                  value={formData.availability}
                  onChange={(e) =>
                    setFormData({ ...formData, availability: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecciona...</option>
                  <option value="immediate">Inmediata</option>
                  <option value="2weeks">En 2 semanas</option>
                  <option value="1month">En 1 mes</option>
                  <option value="3months">En 3 meses</option>
                </select>
              </div>
            </div>
          </div>

          {/* Salary Range */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="text-blue-600" size={24} />
              <div>
                <h2 className="text-gray-900">Expectativas Salariales</h2>
                <p className="text-gray-600">Rango salarial mensual (S/.)</p>
              </div>
            </div>
            <select
              value={formData.salaryRange}
              onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecciona un rango...</option>
              <option value="900-1200">S/ 900 – S/ 1200</option>
              <option value="1200-2000">S/ 1200 – S/ 2000</option>
              <option value="2000-3000">S/ 2000 – S/ 3000</option>
              <option value="3000-5000">S/ 3000 – S/ 5000</option>
              <option value="5000-8000">S/ 5000 – S/ 8000</option>
              <option value="8000+">Más de S/ 8000</option>
            </select>
          </div>

          {/* Career Goals */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="text-red-600" size={24} />
              <div>
                <h2 className="text-gray-900">Objetivos Profesionales</h2>
                <p className="text-gray-600">Cuéntanos qué buscas lograr en tu carrera</p>
              </div>
            </div>
            <textarea
              value={formData.careerGoals}
              onChange={(e) => setFormData({ ...formData, careerGoals: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Ejemplo: Quiero trabajar en empresas de Arequipa que me permitan crecer en mi área y obtener experiencia sólida en mi profesión..."
            />
          </div>

          {/* Additional Skills */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="text-purple-600" size={24} />
              <div>
                <h2 className="text-gray-900">Habilidades Adicionales</h2>
                <p className="text-gray-600">
                  Información relevante que no aparece en tu CV (opcional)
                </p>
              </div>
            </div>
            <textarea
              value={formData.additionalSkills}
              onChange={(e) =>
                setFormData({ ...formData, additionalSkills: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Ejemplo: Certificaciones, cursos, habilidades blandas, manejo de software, idiomas..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`flex-1 py-4 rounded-lg transition-colors ${
                isFormValid()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continuar al Análisis
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
