import { useState } from 'react';
import {
  Check,
  ArrowLeft,
  Shield,
  Lock,
  CreditCard,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface RegisterPricingProps {
  onContinue: () => void;
  onBack: () => void;
  onGoToLogin: () => void;
}

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function RegisterPricing({
  onContinue,
  onBack,
  onGoToLogin,
}: RegisterPricingProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });
  const [error, setError] = useState('');

  const nameOk = formData.name.trim().length >= 2;
  const emailOk = EMAIL_REGEX.test(formData.email.trim());
  const passwordOk = formData.password.length >= 8;
  const isValid = nameOk && emailOk && passwordOk && acceptedTerms;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });

    if (!nameOk) {
      setError('Ingresa tu nombre completo.');
      return;
    }
    if (!emailOk) {
      setError('El correo electrónico no es válido.');
      return;
    }
    if (!passwordOk) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (!acceptedTerms) {
      setError('Debes aceptar los términos y condiciones.');
      return;
    }

    setError('');
    onContinue();
  };

  const planLabel =
    selectedPlan === 'monthly' ? 'S/ 9.00 / mes' : 'S/ 90.00 / año';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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

            <button
              onClick={onGoToLogin}
              className="text-blue-600 hover:underline text-sm"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                1
              </div>
              <span className="text-gray-900 hidden sm:inline">Crear cuenta</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                2
              </div>
              <span className="text-gray-400 hidden sm:inline">Subir CV</span>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-4">
            <Sparkles size={16} />
            <span className="text-sm">Comienza tu viaje profesional</span>
          </div>
          <h1
            className="text-gray-900 mb-3"
            style={{ fontSize: '32px', fontWeight: 700 }}
          >
            Crea tu cuenta y elige tu plan
          </h1>
          <p className="text-gray-600">
            Accede a oportunidades laborales personalizadas en Arequipa y Perú
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pricing Plans */}
          <div className="space-y-6">
            <h2 className="text-gray-900" style={{ fontSize: '20px', fontWeight: 600 }}>
              1. Elige tu plan
            </h2>

            {/* Monthly Plan */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`bg-white rounded-xl shadow-sm p-6 border-2 cursor-pointer transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-blue-600 ring-4 ring-blue-100'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-gray-900 mb-1">Plan Mensual</h3>
                  <p className="text-gray-600">
                    Acceso completo, cancela cuando quieras
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === 'monthly'
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedPlan === 'monthly' && (
                    <Check className="text-white" size={16} />
                  )}
                </div>
              </div>

              <div className="mb-4 flex items-end gap-1">
                <span
                  style={{ fontSize: '32px', fontWeight: 700 }}
                  className="text-gray-900"
                >
                  S/ 9.00
                </span>
                <span style={{ fontSize: '20px' }} className="text-gray-500 mb-1">
                  /mes
                </span>
              </div>

              <ul className="space-y-2">
                {[
                  'Análisis ilimitados de CV',
                  'Acceso a empleos locales en Arequipa',
                  'Recomendaciones personalizadas',
                  'Cursos sugeridos según tu perfil',
                  'Actualizaciones semanales',
                ].map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <Check className="text-green-600 flex-shrink-0" size={18} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Annual Plan */}
            <div
              onClick={() => setSelectedPlan('annual')}
              className={`bg-white rounded-xl shadow-sm p-6 border-2 cursor-pointer transition-all relative ${
                selectedPlan === 'annual'
                  ? 'border-purple-600 ring-4 ring-purple-100'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="absolute -top-3 right-6 bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                Ahorra 17% · 2 meses gratis
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-gray-900 mb-1">Plan Anual</h3>
                  <p className="text-gray-600">La mejor relación calidad-precio</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === 'annual'
                      ? 'border-purple-600 bg-purple-600'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedPlan === 'annual' && (
                    <Check className="text-white" size={16} />
                  )}
                </div>
              </div>

              <div className="mb-1 flex items-end gap-2 flex-wrap">
                <span
                  style={{ fontSize: '32px', fontWeight: 700 }}
                  className="text-gray-900"
                >
                  S/ 90.00
                </span>
                <span style={{ fontSize: '20px' }} className="text-gray-500 mb-1">
                  /año
                </span>
              </div>
              <p className="text-purple-600 mb-4">
                Equivale a <strong>S/ 7.50/mes</strong>
              </p>

              <ul className="space-y-2">
                {[
                  'Todo lo del plan mensual',
                  'Prioridad en nuevas ofertas',
                  '2 asesorías por año',
                  'Certificados de cursos',
                  'Soporte rápido',
                ].map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <Check className="text-green-600 flex-shrink-0" size={18} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Badges */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Shield className="mx-auto text-blue-600 mb-2" size={24} />
                  <p className="text-gray-700 text-sm">Pago Seguro</p>
                </div>
                <div>
                  <Lock className="mx-auto text-blue-600 mb-2" size={24} />
                  <p className="text-gray-700 text-sm">Datos Protegidos</p>
                </div>
                <div>
                  <CreditCard className="mx-auto text-blue-600 mb-2" size={24} />
                  <p className="text-gray-700 text-sm">Sin Permanencia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2
                className="text-gray-900 mb-6"
                style={{ fontSize: '20px', fontWeight: 600 }}
              >
                2. Crea tu cuenta
              </h2>

              {/* Selected plan summary */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedPlan === 'monthly'
                        ? 'bg-blue-600'
                        : 'bg-purple-600'
                    }`}
                  >
                    <CheckCircle2 className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-900">
                      {selectedPlan === 'monthly' ? 'Plan Mensual' : 'Plan Anual'}
                    </p>
                    <p className="text-gray-600 text-sm">{planLabel}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedPlan(selectedPlan === 'monthly' ? 'annual' : 'monthly')
                  }
                  className="text-blue-600 hover:underline text-sm"
                >
                  Cambiar
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error */}
                {error && (
                  <div className="bg-red-100 text-red-700 rounded-lg p-4 flex items-center gap-2">
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* Nombre */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    onBlur={() =>
                      setTouched((t) => ({ ...t, name: true }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="María González"
                    autoComplete="name"
                    required
                  />
                  {touched.name && !nameOk && (
                    <p className="text-red-600 text-sm mt-1">
                      Ingresa al menos 2 caracteres.
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 mb-2">Correo electrónico</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    onBlur={() =>
                      setTouched((t) => ({ ...t, email: true }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="maria@ejemplo.com"
                    autoComplete="email"
                    required
                  />
                  {touched.email && !emailOk && formData.email && (
                    <p className="text-red-600 text-sm mt-1">
                      Ingresa un correo válido.
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-700 mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    onBlur={() =>
                      setTouched((t) => ({ ...t, password: true }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    required
                  />
                  {formData.password && (
                    <p
                      className={`text-sm mt-1 flex items-center gap-1 ${
                        passwordOk ? 'text-green-700' : 'text-gray-500'
                      }`}
                    >
                      {passwordOk ? (
                        <>
                          <CheckCircle2 size={14} />
                          <span>Contraseña válida</span>
                        </>
                      ) : (
                        <span>
                          Faltan {8 - formData.password.length} caracteres
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {/* Payment Method Preview */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 mb-3">Método de Pago</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <CreditCard size={20} className="text-gray-600" />
                    </div>
                    <span className="text-gray-600">
                      Tarjeta de crédito/débito
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">
                    El cargo de <strong>{planLabel}</strong> se realizará después
                    de completar tu perfil.
                  </p>
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-600 text-sm">
                    Acepto los{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      términos y condiciones
                    </a>{' '}
                    y la{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      política de privacidad
                    </a>
                    . Entiendo que el servicio tiene un costo de{' '}
                    <strong>{planLabel}</strong> y puedo cancelar en cualquier
                    momento.
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`w-full py-4 rounded-lg transition-colors ${
                    isValid
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Crear cuenta y continuar
                </button>

                <p className="text-center text-gray-500 text-sm">
                  ¿Ya tienes cuenta?{' '}
                  <button
                    type="button"
                    onClick={onGoToLogin}
                    className="text-blue-600 hover:underline"
                  >
                    Inicia sesión
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
