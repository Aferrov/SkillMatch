import { Loader2 } from 'lucide-react';

/**
 * Pantalla puente mientras se valida la sesión guardada.
 * Evita el parpadeo de mostrar el login a un usuario que sí está autenticado.
 */
export function SessionLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
        <img
          src="/logo_skillmatch.png"
          alt="SkillMatch"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <Loader2 size={18} className="animate-spin" />
        <span>Restaurando tu sesión...</span>
      </div>
    </div>
  );
}
