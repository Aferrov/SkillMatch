import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Loader2,
  FileText,
  Wrench,
  Briefcase,
  GraduationCap,
  Heart,
  Target as TargetIcon,
} from 'lucide-react';

interface AnalysisProcessProps {
  onComplete: () => void;
}

const STEPS = [
  {
    label: 'Leyendo el documento',
    detail: 'Extrayendo texto del CV',
    icon: FileText,
  },
  {
    label: 'Identificando habilidades técnicas',
    detail: 'Lenguajes, frameworks y herramientas',
    icon: Wrench,
  },
  {
    label: 'Analizando experiencia laboral',
    detail: 'Puestos, empresas y responsabilidades',
    icon: Briefcase,
  },
  {
    label: 'Procesando formación académica',
    detail: 'Estudios, cursos y certificaciones',
    icon: GraduationCap,
  },
  {
    label: 'Detectando soft skills',
    detail: 'Habilidades blandas y de liderazgo',
    icon: Heart,
  },
  {
    label: 'Inferenciando áreas de interés',
    detail: 'Rubros y perfiles laborales afines',
    icon: TargetIcon,
  },
];

export function AnalysisProcess({ onComplete }: AnalysisProcessProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        clearInterval(timer);
        setTimeout(() => onComplete(), 800);
        return prev;
      });
    }, 900);

    return () => clearInterval(timer);
  }, [onComplete]);

  const progressPct = ((currentStep + 1) / STEPS.length) * 100;

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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TargetIcon className="text-white" size={40} />
          </div>
          <h1
            className="text-gray-900 mb-2"
            style={{ fontSize: '28px', fontWeight: 700 }}
          >
            Analizando tu CV con IA
          </h1>
          <p className="text-gray-600">
            Nuestro motor de NLP está extrayendo tu información profesional.
            Esto tomará solo unos segundos.
          </p>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="space-y-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const done = index < currentStep;
              const active = index === currentStep;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                    active ? 'bg-blue-50' : ''
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      done
                        ? 'bg-green-100'
                        : active
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="text-green-600" size={20} />
                    ) : active ? (
                      <Loader2 className="text-blue-600 animate-spin" size={20} />
                    ) : (
                      <Icon className="text-gray-400" size={20} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`transition-colors ${
                        done
                          ? 'text-gray-900'
                          : active
                          ? 'text-gray-900'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`text-sm ${
                        done || active ? 'text-gray-600' : 'text-gray-400'
                      }`}
                    >
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden mb-3">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
        <p className="text-center text-gray-500 text-sm">
          {Math.round(progressPct)}% completado
        </p>
      </div>
    </div>
  );
}
