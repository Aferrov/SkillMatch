import { useState } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  Lock,
  Mail,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
  onGoToRegister: () => void;
}

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function Login({ onLogin, onBack, onGoToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailInvalid = touched.email && !EMAIL_REGEX.test(email.trim());
  const passwordInvalid = touched.password && password.length > 0 && password.length < 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!email.trim() || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError('El correo electrónico no es válido.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setError('');
    onLogin();
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
              aria-label="Volver al inicio"
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
              <span className="text-gray-900 font-semibold text-lg">SkillMatch</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Marketing column */}
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
              <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded-full mb-6">
                <Sparkles size={16} />
                <span className="text-sm">Bienvenido de nuevo</span>
              </div>

              <h2
                className="text-white mb-4"
                style={{ fontSize: '32px', lineHeight: '1.2', fontWeight: 700 }}
              >
                Continúa con tu crecimiento profesional
              </h2>

              <p className="text-blue-100 mb-8">
                Accede a tu panel para ver tus análisis, ofertas compatibles
                y los cursos recomendados según tu perfil.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-white mb-1">Análisis actualizados</h3>
                    <p className="text-blue-100 text-sm">
                      Revisa el avance de tu CV y nuevas sugerencias.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-white mb-1">Nuevas ofertas en Perú</h3>
                    <p className="text-blue-100 text-sm">
                      Empresas en Arequipa, Lima y otras regiones esperan tu perfil.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-white mb-1">Tus datos seguros</h3>
                    <p className="text-blue-100 text-sm">
                      Cifrado y confidencialidad garantizadas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div>
            <div className="text-center mb-6">
              <h1
                className="text-gray-900 mb-2"
                style={{ fontSize: '28px', fontWeight: 700 }}
              >
                Iniciar Sesión
              </h1>
              <p className="text-gray-600">
                Ingresa con tu cuenta para continuar
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error */}
                {error && (
                  <div className="bg-red-100 text-red-700 rounded-lg p-4 flex items-center gap-2">
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu@ejemplo.com"
                    autoComplete="email"
                    required
                  />
                  {emailInvalid && (
                    <p className="text-red-600 text-sm mt-1">
                      Ingresa un correo válido.
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-gray-700">Contraseña</label>
                    <a href="#" className="text-blue-600 hover:underline text-sm">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu contraseña"
                    autoComplete="current-password"
                    required
                  />
                  {passwordInvalid && (
                    <p className="text-red-600 text-sm mt-1">
                      Debe tener al menos 8 caracteres.
                    </p>
                  )}
                </div>

                {/* Remember */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-600 text-sm">
                    Recordarme en este dispositivo
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Lock size={18} />
                  Iniciar Sesión
                </button>

                {/* Trust */}
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                  <ShieldCheck size={14} className="text-green-600" />
                  <span>Conexión segura</span>
                </div>
              </form>
            </div>

            {/* Switch to register */}
            <p className="text-center text-gray-600 mt-6">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={onGoToRegister}
                className="text-blue-600 hover:underline"
              >
                Regístrate gratis
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
