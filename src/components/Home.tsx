import {
  ArrowRight,
  FileText,
  Target,
  TrendingUp,
  Sparkles,
  MapPin,
  ShieldCheck,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomeProps {
  onNavigate: (screen: 'login' | 'register') => void;
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src="/logo_skillmatch.png"
                  alt="SkillMatch"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-gray-900 font-semibold text-lg">SkillMatch</span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="#como-funciona"
                className="hidden sm:inline text-gray-600 hover:text-gray-900"
              >
                ¿Cómo funciona?
              </a>
              <a
                href="#beneficios"
                className="hidden sm:inline text-gray-600 hover:text-gray-900"
              >
                Beneficios
              </a>
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-6">
              <Sparkles size={16} />
              <span className="text-sm">Análisis inteligente para tu carrera</span>
            </div>

            <h1
              className="text-gray-900 mb-6"
              style={{ fontSize: '40px', lineHeight: '1.15', fontWeight: 700 }}
            >
              Optimiza tu CV con Inteligencia Artificial
            </h1>

            <p
              className="text-gray-600 mb-8"
              style={{ fontSize: '18px', lineHeight: '1.6' }}
            >
              SkillMatch analiza tu currículum, detecta tus fortalezas y áreas de mejora,
              y te conecta con oportunidades laborales reales en Arequipa y el resto del Perú.
              Recibe recomendaciones personalizadas para destacar en el mercado laboral.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => onNavigate('register')}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Analizar mi CV
                <ArrowRight size={20} />
              </button>
              <a
                href="#como-funciona"
                className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ver cómo funciona
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-600" size={18} />
                <span className="text-sm">Sin compromiso</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-600" size={18} />
                <span className="text-sm">Datos protegidos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-600" size={18} />
                <span className="text-sm">Resultados en minutos</span>
              </div>
            </div>
          </div>

          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1758598307046-22f11e2a6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b3Jrc3BhY2UlMjBsYXB0b3B8ZW58MXx8fHwxNzY0MTg1NTU5fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Profesional revisando su CV"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features / Cómo funciona */}
      <section id="como-funciona" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-gray-900 mb-3"
              style={{ fontSize: '32px', fontWeight: 700 }}
            >
              ¿Cómo funciona?
            </h2>
            <p className="text-gray-600">
              Tres pasos simples para descubrir tu potencial profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Paso 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <FileText className="text-blue-600" size={32} />
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                  1
                </span>
              </div>
              <h3 className="text-gray-900 mb-2">Sube tu CV</h3>
              <p className="text-gray-600">
                Carga tu currículum en formato PDF o Word. El proceso es rápido y seguro.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <Target className="text-purple-600" size={32} />
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                  2
                </span>
              </div>
              <h3 className="text-gray-900 mb-2">Análisis Inteligente</h3>
              <p className="text-gray-600">
                Nuestra IA analiza tus habilidades, experiencia y áreas de mejora.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <TrendingUp className="text-green-600" size={32} />
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
                  3
                </span>
              </div>
              <h3 className="text-gray-900 mb-2">Recibe Recomendaciones</h3>
              <p className="text-gray-600">
                Empleos compatibles, cursos sugeridos y un plan de acción personalizado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="beneficios" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2
            className="text-gray-900 mb-3"
            style={{ fontSize: '32px', fontWeight: 700 }}
          >
            ¿Por qué elegir SkillMatch?
          </h2>
          <p className="text-gray-600">
            Una herramienta hecha para profesionales que buscan crecer en el mercado peruano.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:border-blue-500 transition-colors">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="text-blue-600" size={24} />
            </div>
            <h3 className="text-gray-900 mb-2">Empleos locales</h3>
            <p className="text-gray-600 text-sm">
              Ofertas reales en Arequipa, Lima y otras regiones del Perú.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:border-purple-300 transition-colors">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <GraduationCap className="text-purple-600" size={24} />
            </div>
            <h3 className="text-gray-900 mb-2">Cursos sugeridos</h3>
            <p className="text-gray-600 text-sm">
              Recomendaciones de instituciones reconocidas en Perú.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:border-orange-300 transition-colors">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="text-orange-600" size={24} />
            </div>
            <h3 className="text-gray-900 mb-2">100% personalizado</h3>
            <p className="text-gray-600 text-sm">
              Cada análisis es único según tu perfil y objetivos.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:border-green-300 transition-colors">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheck className="text-green-600" size={24} />
            </div>
            <h3 className="text-gray-900 mb-2">Datos seguros</h3>
            <p className="text-gray-600 text-sm">
              Tu información se trata con total confidencialidad.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
          <h2
            className="text-white mb-4"
            style={{ fontSize: '28px', fontWeight: 700 }}
          >
            ¿Listo para mejorar tu CV?
          </h2>
          <p className="text-blue-100 mb-8">
            Comienza ahora y descubre cómo destacar en el mercado laboral peruano.
            Solo necesitas unos minutos.
          </p>
          <button
            onClick={() => onNavigate('register')}
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Analizar mi CV
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img
                  src="/logo_skillmatch.png"
                  alt="SkillMatch"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-gray-900">SkillMatch</span>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} SkillMatch. Hecho en Arequipa, Perú.
            </p>
            <div className="flex gap-4 text-gray-500 text-sm">
              <a href="#" className="hover:text-gray-900">
                Términos
              </a>
              <a href="#" className="hover:text-gray-900">
                Privacidad
              </a>
              <a href="#" className="hover:text-gray-900">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
