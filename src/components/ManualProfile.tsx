import { useState } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  X,
  Plus,
  CheckCircle2,
} from 'lucide-react';

export interface ManualProfileData {
  fullName: string;
  jobTitle: string;
  city: string;
  experience: string;
  educationLevel: string;
  institution: string;
  skills: string[];
  summary: string;
}

interface ManualProfileProps {
  onComplete: (data: ManualProfileData) => void;
  onBack: () => void;
}

const EXPERIENCE_OPTIONS = [
  { value: 'less1', label: 'Menos de 1 año' },
  { value: '1-3', label: '1 – 3 años' },
  { value: '3-5', label: '3 – 5 años' },
  { value: '5-10', label: '5 – 10 años' },
  { value: 'more10', label: 'Más de 10 años' },
];

const EDUCATION_OPTIONS = [
  { value: 'secundaria', label: 'Secundaria' },
  { value: 'tecnico', label: 'Técnico' },
  { value: 'universitario', label: 'Universitario' },
  { value: 'bachiller', label: 'Bachiller' },
  { value: 'titulado', label: 'Titulado' },
  { value: 'postgrado', label: 'Postgrado / Maestría' },
];

const SUGGESTED_SKILLS = [
  'JavaScript',
  'Python',
  'Excel',
  'Trabajo en equipo',
  'Inglés',
  'Liderazgo',
  'Scrum',
  'Atención al cliente',
];

export function ManualProfile({ onComplete, onBack }: ManualProfileProps) {
  const [formData, setFormData] = useState<ManualProfileData>({
    fullName: '',
    jobTitle: '',
    city: '',
    experience: '',
    educationLevel: '',
    institution: '',
    skills: [],
    summary: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [error, setError] = useState('');

  const nameOk = formData.fullName.trim().length >= 2;
  const titleOk = formData.jobTitle.trim().length >= 2;
  const experienceOk = formData.experience !== '';
  const skillsOk = formData.skills.length >= 1;

  const isValid = nameOk && titleOk && experienceOk && skillsOk;

  const addSkill = (skill: string) => {
    const cleaned = skill.trim();
    if (!cleaned) return;
    if (formData.skills.includes(cleaned)) {
      setSkillInput('');
      return;
    }
    setFormData({ ...formData, skills: [...formData.skills, cleaned] });
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameOk) {
      setError('Ingresa tu nombre completo.');
      return;
    }
    if (!titleOk) {
      setError('Ingresa tu título o cargo profesional.');
      return;
    }
    if (!experienceOk) {
      setError('Selecciona tus años de experiencia.');
      return;
    }
    if (!skillsOk) {
      setError('Agrega al menos una habilidad.');
      return;
    }

    setError('');
    onComplete(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Volver"
            >
              <ArrowLeft size={24} />
            </button>
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
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                ✓
              </div>
              <span className="text-gray-600 hidden sm:inline">
                Cuenta creada
              </span>
            </div>
            <div className="flex-1 h-1 bg-blue-600"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                2
              </div>
              <span className="text-gray-900 hidden sm:inline">Tu perfil</span>
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

      {/* Main */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full mb-4">
            <Sparkles size={16} />
            <span className="text-sm">Completar perfil manualmente</span>
          </div>
          <h1
            className="text-gray-900 mb-3"
            style={{ fontSize: '32px', fontWeight: 700 }}
          >
            Cuéntanos sobre ti
          </h1>
          <p className="text-gray-600">
            Con esta información podemos generar recomendaciones acertadas.
            Solo te tomará un par de minutos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {error && (
            <div className="bg-red-100 text-red-700 rounded-lg p-4 flex items-center gap-2">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Información personal */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-gray-900">Información personal</h2>
                <p className="text-gray-600 text-sm">
                  Datos básicos para tu perfil
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="María González"
                  autoComplete="name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Título o cargo profesional *
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Analista de Datos, Diseñador UX, Contador..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Ciudad</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Arequipa"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Años de experiencia *
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecciona…</option>
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Educación */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-green-600" size={24} />
              </div>
              <div>
                <h2 className="text-gray-900">Educación</h2>
                <p className="text-gray-600 text-sm">Tu formación académica</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  Nivel educativo
                </label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      educationLevel: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona…</option>
                  {EDUCATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Institución</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) =>
                    setFormData({ ...formData, institution: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="UNSA, UCSP, Tecsup..."
                />
              </div>
            </div>
          </div>

          {/* Habilidades */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Briefcase className="text-purple-600" size={24} />
              </div>
              <div>
                <h2 className="text-gray-900">Habilidades *</h2>
                <p className="text-gray-600 text-sm">
                  Agrega al menos una habilidad (presiona Enter o coma para
                  añadir)
                </p>
              </div>
            </div>

            {/* Input + Add button */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Excel, Comunicación, React..."
              />
              <button
                type="button"
                onClick={() => addSkill(skillInput)}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Añadir</span>
              </button>
            </div>

            {/* Selected skills */}
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-gray-900"
                      aria-label={`Quitar ${skill}`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Suggested skills */}
            <div>
              <p className="text-gray-500 text-sm mb-2">Sugerencias:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_SKILLS.filter(
                  (s) => !formData.skills.includes(s)
                ).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addSkill(suggestion)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-blue-50 transition-colors"
                  >
                    <Plus size={12} />
                    <span className="text-sm">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Sparkles className="text-orange-600" size={24} />
              </div>
              <div>
                <h2 className="text-gray-900">Resumen profesional</h2>
                <p className="text-gray-600 text-sm">Opcional, pero ayuda mucho</p>
              </div>
            </div>

            <textarea
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Cuéntanos en pocas líneas tu experiencia, logros y qué buscas a futuro."
            />
          </div>

          {/* Validation summary */}
          <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2
              className={`flex-shrink-0 ${
                isValid ? 'text-green-600' : 'text-gray-400'
              }`}
              size={20}
            />
            <div>
              <p className="text-gray-900 text-sm">
                {isValid
                  ? 'Tu perfil está listo para el análisis.'
                  : 'Completa los campos marcados con * para continuar.'}
              </p>
            </div>
          </div>

          {/* Actions */}
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
              disabled={!isValid}
              className={`flex-1 py-4 rounded-lg transition-colors ${
                isValid
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
