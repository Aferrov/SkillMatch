import { useEffect, useState } from 'react';
import { Target, CheckCircle2, Loader2 } from 'lucide-react';

interface AnalysisProcessProps {
  onComplete: () => void;
}

export function AnalysisProcess({ onComplete }: AnalysisProcessProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Extrayendo información', completed: false },
    { label: 'Analizando habilidades', completed: false },
    { label: 'Evaluando experiencia', completed: false },
    { label: 'Generando recomendaciones', completed: false },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => onComplete(), 1000);
          return prev;
        }
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🔵 HEADER — ahora arriba siempre */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            {/* 👉 Nuevo logo */}
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <img
              src="/logo_skillmatch.png"   // Asegúrate de tener esta imagen en /public
              alt="SkillMatch Logo"
              className="w-full h-full object-cover"
            />
          </div>
            <span className="text-gray-900 text-lg font-semibold">SkillMatch</span>
          </div>
        </div>
      </header>

      {/* 🔻 Contenedor del contenido (separado con mt-6 para que no quede pegado) */}
      <div className="flex items-center justify-center px-4 mt-6">
        <div className="max-w-2xl w-full">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="text-white" size={40} />
            </div>
            <h1 className="text-gray-900 mb-2">Analizando tu CV</h1>
            <p className="text-gray-600">
              Estamos procesando tu información, esto tomará solo unos momentos
            </p>
          </div>

          {/* Progress Steps */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      index < currentStep
                        ? 'bg-green-100'
                        : index === currentStep
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle2 className="text-green-600" size={24} />
                    ) : index === currentStep ? (
                      <Loader2 className="text-blue-600 animate-spin" size={24} />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`transition-colors ${
                        index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>

        </div>
      </div>
    </div>
  );
}
