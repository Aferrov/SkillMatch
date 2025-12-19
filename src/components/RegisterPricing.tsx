import { useState } from 'react';
import { Target, Check, ArrowLeft, Shield, Lock, CreditCard } from 'lucide-react';

interface RegisterPricingProps {
  onContinue: () => void;
  onBack: () => void;
}

export function RegisterPricing({ onContinue, onBack }: RegisterPricingProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (acceptedTerms && formData.name && formData.email && formData.password) {
      onContinue();
    }
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

          {/* 👉 LOGO nuevo */}
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <img 
              src="/logo_skillmatch.png"   // Asegúrate de ponerlo en /public
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-gray-900 mb-4">Comienza tu Viaje Profesional</h1>
          <p className="text-gray-600">
            Crea tu cuenta y accede a oportunidades laborales personalizadas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pricing Plans */}
          <div className="space-y-6">
            <h2 className="text-gray-900">Elige tu Plan</h2>
            
            {/* Monthly Plan */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`bg-white rounded-xl shadow-sm p-6 border-2 cursor-pointer transition-all ${
                selectedPlan === 'monthly' ? 'border-blue-600 ring-4 ring-blue-100' : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-gray-900 mb-1">Plan Mensual</h3>
                  <p className="text-gray-600">Acceso completo, cancela cuando quieras</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === 'monthly' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                }`}>
                  {selectedPlan === 'monthly' && <Check className="text-white" size={16} />}
                </div>
              </div>
              <div className="mb-4 flex items-end gap-1">
  <span style={{ fontSize: '32px', fontWeight: '700' }} className="text-gray-900">
    S/ 9.00
  </span>
  <span style={{ fontSize: '32px' }} className="text-gray-500 mb-1">/mes</span>
</div>


              <ul className="space-y-2">
                {[
                  'Análisis ilimitados de CV',
                  'Acceso a empleos locales en Arequipa',
                  'Recomendaciones personalizadas',
                  'Cursos sugeridos según tu perfil',
                  'Actualizaciones semanales',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600">
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
    Ahorra 17%
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
      {selectedPlan === 'annual' && <Check className="text-white" size={16} />}
    </div>
  </div>

  <div className="mb-4 flex items-end gap-2">
    <span style={{ fontSize: '32px', fontWeight: '700' }} className="text-gray-900">
      S/ 90.00
    </span>
    <span style={{ fontSize: '32px' }} className="text-gray-500 mb-1">/año</span>
    <span style={{ fontSize: '20px' }} className="text-purple-600 font-medium">(S/ 7.50/mes)</span>
  </div>

  <ul className="space-y-2">
    {[
      'Todo lo del plan mensual',
      'Prioridad en nuevas ofertas',
      '2 asesorías por año',
      'Certificados de cursos',
      'Soporte rápido',
    ].map((feature, index) => (
      <li key={index} className="flex items-center gap-2 text-gray-600">
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
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-gray-900 mb-6">Crear Cuenta</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="María González"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="maria@ejemplo.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mínimo 8 caracteres"
                  required
                />
              </div>

              {/* Payment Method Preview */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 mb-3">Método de Pago</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <CreditCard size={20} className="text-gray-600" />
                  </div>
                  <span className="text-gray-600">Tarjeta de crédito/débito</span>
                </div>
                <p className="text-gray-500 text-sm">
                  El cargo se realizará después de completar tu perfil
                </p>
              </div>

              {/* Terms Checkbox */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-600">
                    Acepto los{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      términos y condiciones
                    </a>{' '}
                    y la{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      política de privacidad
                    </a>
                    . Entiendo que el servicio tiene un costo de{' '}
                    <strong>
                      {selectedPlan === 'monthly' ? 'S/ 9.00/mes' : 'S/ 90.00/año'}
                    </strong>{' '}
                    y puedo cancelar en cualquier momento.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!acceptedTerms || !formData.name || !formData.email || !formData.password}
                className={`w-full py-4 rounded-lg transition-colors ${
                  acceptedTerms && formData.name && formData.email && formData.password
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continuar a Carga de CV
              </button>

              <p className="text-center text-gray-500 text-sm">
                ¿Ya tienes cuenta?{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Inicia sesión
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
