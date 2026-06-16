import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Wrench,
  Briefcase,
  GraduationCap,
  Heart,
  Target as TargetIcon,
  X,
  Plus,
  ArrowRight,
  Sparkles,
  Building2,
  Calendar,
  Edit3,
} from 'lucide-react';

interface CVAnalysisReviewProps {
  analysisResult: {
    career?: string;
    found_skills?: string[];
    missing_skills?: string[];
    experience?: ExperienceItem[];
    education?: EducationItem[];
    jobs?: unknown[];
  } | null;
  onContinue: () => void;
  onBack: () => void;
}

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

interface EducationItem {
  id: string;
  title: string;
  institution: string;
  period: string;
  kind: 'studies' | 'certificate';
}

export function CVAnalysisReview({ analysisResult, onContinue, onBack }: CVAnalysisReviewProps) {
  const apiTechSkills = analysisResult?.found_skills ?? [];
  const apiMissingSkills = analysisResult?.missing_skills ?? [];
  const apiExperience = analysisResult?.experience ?? [];
  const apiEducation = analysisResult?.education ?? [];
  const apiCareer = analysisResult?.career ?? 'Perfil profesional';

  const [techSkills, setTechSkills] = useState<string[]>(apiTechSkills);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>(apiMissingSkills);
  const [experience, setExperience] = useState<ExperienceItem[]>(apiExperience);
  const [education, setEducation] = useState<EducationItem[]>(apiEducation);

  useEffect(() => {
    setTechSkills(apiTechSkills);
    setInterests(apiMissingSkills);
    setExperience(apiExperience);
    setEducation(apiEducation);
  }, [apiTechSkills, apiMissingSkills, apiExperience, apiEducation]);

  const [techInput, setTechInput] = useState('');
  const [softInput, setSoftInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  const addChip = (
    list: string[],
    setList: (next: string[]) => void,
    value: string,
    clear: () => void
  ) => {
    const cleaned = value.trim();
    if (!cleaned) return;
    if (list.includes(cleaned)) {
      clear();
      return;
    }
    setList([...list, cleaned]);
    clear();
  };

  const removeChip = (
    list: string[],
    setList: (next: string[]) => void,
    value: string
  ) => {
    setList(list.filter((v) => v !== value));
  };

  const totalDetected =
    techSkills.length +
    softSkills.length +
    interests.length +
    experience.length +
    education.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <img
                src="/logo_skillmatch.png"
                alt="SkillMatch"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-gray-900 font-semibold text-lg">SkillMatch</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full mb-4">
            <CheckCircle2 size={16} />
            <span className="text-sm">Análisis completado</span>
          </div>
          <h1
            className="text-gray-900 mb-3"
            style={{ fontSize: '32px', fontWeight: 700 }}
          >
            Esto es lo que encontramos en tu CV
          </h1>
          <p className="text-blue-700 font-semibold mb-4">
            Carrera detectada: {apiCareer}
          </p>
          <p className="text-gray-600">
            Revisa la información extraída y ajusta lo que necesites antes de
            recibir tus recomendaciones.
          </p>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Sparkles size={28} />
              <div>
                <p className="text-blue-100 text-sm">Elementos detectados</p>
                <p style={{ fontSize: '28px', fontWeight: 700 }}>
                  {totalDetected}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div>
                <p style={{ fontSize: '20px', fontWeight: 600 }}>
                  {techSkills.length}
                </p>
                <p className="text-blue-100 text-xs">Técnicas</p>
              </div>
              <div>
                <p style={{ fontSize: '20px', fontWeight: 600 }}>
                  {experience.length}
                </p>
                <p className="text-blue-100 text-xs">Experiencias</p>
              </div>
              <div>
                <p style={{ fontSize: '20px', fontWeight: 600 }}>
                  {education.length}
                </p>
                <p className="text-blue-100 text-xs">Estudios</p>
              </div>
              <div>
                <p style={{ fontSize: '20px', fontWeight: 600 }}>
                  {softSkills.length}
                </p>
                <p className="text-blue-100 text-xs">Soft skills</p>
              </div>
              <div>
                <p style={{ fontSize: '20px', fontWeight: 600 }}>
                  {interests.length}
                </p>
                <p className="text-blue-100 text-xs">Áreas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Habilidades técnicas */}
        <Section
          icon={Wrench}
          color="blue"
          title="Habilidades técnicas"
          subtitle="Lenguajes, frameworks y herramientas"
        >
          <ChipList
            chips={techSkills}
            chipColor="blue"
            onRemove={(v) => removeChip(techSkills, setTechSkills, v)}
          />
          <AddChipInput
            value={techInput}
            onChange={setTechInput}
            onAdd={() =>
              addChip(techSkills, setTechSkills, techInput, () => setTechInput(''))
            }
            placeholder="Ej: SQL, Python, AWS..."
          />
        </Section>

        {/* Experiencia */}
        <Section
          icon={Briefcase}
          color="purple"
          title="Experiencia laboral"
          subtitle="Puestos, prácticas y proyectos"
        >
          {experience.length === 0 ? (
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-6 text-center">
              <p className="text-gray-700 text-sm mb-2">
                Aún no se ha extraído experiencia real del CV.
              </p>
              <p className="text-gray-500 text-xs">
                El analizador actual detecta habilidades, pero no extrae detalles de experiencias y estudios.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {experience.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex items-start gap-3"
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="text-purple-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{exp.role}</p>
                    <p className="text-gray-700 text-sm">{exp.company}</p>
                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                      <Calendar size={14} />
                      {exp.period}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setExperience(experience.filter((e) => e.id !== exp.id))
                    }
                    className="text-gray-400 hover:text-gray-900 flex-shrink-0"
                    aria-label={`Quitar ${exp.role}`}
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Educación */}
        <Section
          icon={GraduationCap}
          color="green"
          title="Educación y certificaciones"
          subtitle="Carrera, cursos y certificaciones"
        >
          {education.length === 0 ? (
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-6 text-center">
              <p className="text-gray-700 text-sm mb-2">
                Aún no se han extraído estudios reales del CV.
              </p>
              <p className="text-gray-500 text-xs">
                Esta sección solo mostrará datos reales cuando el backend los extraiga del contenido del PDF.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex items-start gap-3"
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="text-green-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-gray-900">{edu.title}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          edu.kind === 'studies'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {edu.kind === 'studies' ? 'Estudios' : 'Certificación'}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{edu.institution}</p>
                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                      <Calendar size={14} />
                      {edu.period}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setEducation(education.filter((e) => e.id !== edu.id))
                    }
                    className="text-gray-400 hover:text-gray-900 flex-shrink-0"
                    aria-label={`Quitar ${edu.title}`}
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Soft skills */}
        <Section
          icon={Heart}
          color="orange"
          title="Soft skills"
          subtitle="Habilidades blandas detectadas en tu CV"
        >
          <ChipList
            chips={softSkills}
            chipColor="orange"
            onRemove={(v) => removeChip(softSkills, setSoftSkills, v)}
          />
          <AddChipInput
            value={softInput}
            onChange={setSoftInput}
            onAdd={() =>
              addChip(softSkills, setSoftSkills, softInput, () => setSoftInput(''))
            }
            placeholder="Ej: Empatía, Creatividad..."
          />
        </Section>

        {/* Habilidades faltantes */}
        <Section
          icon={TargetIcon}
          color="purple"
          title="Habilidades faltantes"
          subtitle="Competencias esperadas para tu carrera"
        >
          <ChipList
            chips={interests.length > 0 ? interests : ['No se detectaron habilidades faltantes']}
            chipColor="purple"
            onRemove={(v) => removeChip(interests, setInterests, v)}
          />
          <AddChipInput
            value={interestInput}
            onChange={setInterestInput}
            onAdd={() =>
              addChip(interests, setInterests, interestInput, () =>
                setInterestInput('')
              )
            }
            placeholder="Añade otras habilidades o ideas de mejora"
          />
        </Section>

        {/* Edit hint */}
        <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3 mb-8">
          <Edit3 className="text-blue-600 flex-shrink-0" size={20} />
          <p className="text-gray-700 text-sm">
            Puedes ajustar cualquier elemento ahora. Después podrás editar todo
            tu perfil desde el panel de usuario.
          </p>
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
            type="button"
            onClick={onContinue}
            className="flex-1 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2"
          >
            Ver mis recomendaciones
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Reusable subcomponents ----------

interface SectionProps {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: 'blue' | 'purple' | 'green' | 'orange';
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

function Section({ icon: Icon, color, title, subtitle, children }: SectionProps) {
  const bg = {
    blue: 'bg-blue-100',
    purple: 'bg-purple-100',
    green: 'bg-green-100',
    orange: 'bg-orange-100',
  }[color];
  const text = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
  }[color];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center`}>
          <Icon className={text} size={24} />
        </div>
        <div>
          <h2 className="text-gray-900">{title}</h2>
          <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

interface ChipListProps {
  chips: string[];
  chipColor: 'blue' | 'purple' | 'orange';
  onRemove: (chip: string) => void;
}

function ChipList({ chips, chipColor, onRemove }: ChipListProps) {
  if (chips.length === 0) {
    return (
      <p className="text-gray-500 text-sm mb-4">
        No detectamos elementos. Puedes añadirlos abajo.
      </p>
    );
  }

  const classes = {
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
  }[chipColor];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map((chip) => (
        <span
          key={chip}
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${classes}`}
        >
          {chip}
          <button
            type="button"
            onClick={() => onRemove(chip)}
            className="hover:text-gray-900"
            aria-label={`Quitar ${chip}`}
          >
            <X size={14} />
          </button>
        </span>
      ))}
    </div>
  );
}

interface AddChipInputProps {
  value: string;
  onChange: (next: string) => void;
  onAdd: () => void;
  placeholder: string;
}

function AddChipInput({ value, onChange, onAdd, placeholder }: AddChipInputProps) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            onAdd();
          }
        }}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={onAdd}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-1"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">Añadir</span>
      </button>
    </div>
  );
}
