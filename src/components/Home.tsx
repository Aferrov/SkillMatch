import { ArrowRight, FileText, Target, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomeProps {
  onNavigate: () => void;
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen">
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
        Iniciar Sesión
      </button>
    </div>
  </div>
</header>


      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-gray-900 mb-6">
              Optimiza tu CV con Inteligencia Artificial
            </h1>
            <p className="text-gray-600 mb-8">
              SkillMatch analiza tu currículum y te brinda recomendaciones personalizadas para mejorar tus oportunidades laborales. Descubre qué habilidades destacar y cómo optimizar tu perfil profesional.
            </p>
            <button 
              onClick={onNavigate}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Analizar mi CV
              <ArrowRight size={20} />
            </button>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1758598307046-22f11e2a6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b3Jrc3BhY2UlMjBsYXB0b3B8ZW58MXx8fHwxNzY0MTg1NTU5fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Professional workspace"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-gray-900 mb-12">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-blue-600" size={32} />
              </div>
              <h3 className="text-gray-900 mb-2">1. Sube tu CV</h3>
              <p className="text-gray-600">
                Carga tu currículum en formato PDF o Word para comenzar el análisis
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-purple-600" size={32} />
              </div>
              <h3 className="text-gray-900 mb-2">2. Análisis Inteligente</h3>
              <p className="text-gray-600">
                Nuestra IA analiza tus habilidades, experiencia y áreas de mejora
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-green-600" size={32} />
              </div>
              <h3 className="text-gray-900 mb-2">3. Recibe Recomendaciones</h3>
              <p className="text-gray-600">
                Obtén sugerencias personalizadas para optimizar tu perfil profesional
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-white mb-4">
            ¿Listo para mejorar tu CV?
          </h2>
          <p className="text-blue-100 mb-8">
            Comienza ahora y descubre cómo destacar en el mercado laboral
          </p>
          <button 
            onClick={onNavigate}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Comenzar Ahora
          </button>
        </div>
      </section>
    </div>
  );
}
