import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  BookOpen,
  Briefcase,
  LogOut,
  Search,
  User,
  X,
} from 'lucide-react';
import { VACANCIES, formatSalary } from '../data/vacancies';
import { COURSES } from '../data/courses';
import type { AppNotification, NotificationCenter } from '../data/notifications';
import type { Screen } from '../hooks/useRouter';

export interface AppHeaderProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  notificationCenter: NotificationCenter;
}

interface SearchHit {
  id: string;
  kind: 'vacancy' | 'course';
  title: string;
  subtitle: string;
  target: Screen;
}

const MAX_HITS = 6;

/** Busca en vacantes y cursos a la vez. */
function search(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const vacancyHits: SearchHit[] = VACANCIES.filter(
    (v) =>
      v.title.toLowerCase().includes(q) ||
      v.company.toLowerCase().includes(q) ||
      v.location.toLowerCase().includes(q) ||
      v.industry.toLowerCase().includes(q) ||
      v.requiredSkills.some((s) => s.toLowerCase().includes(q))
  ).map((v) => ({
    id: `vacancy-${v.id}`,
    kind: 'vacancy',
    title: v.title,
    subtitle: `${v.company} · ${v.location} · ${formatSalary(v.salary)}`,
    target: 'vacancies',
  }));

  const courseHits: SearchHit[] = COURSES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.platform.toLowerCase().includes(q) ||
      c.skill.toLowerCase().includes(q)
  ).map((c) => ({
    id: `course-${c.id}`,
    kind: 'course',
    title: c.name,
    subtitle: `${c.platform} · ${c.level} · ${c.duration}`,
    target: 'courses',
  }));

  // Se intercalan para que ninguna de las dos fuentes acapare la lista
  const merged: SearchHit[] = [];
  for (let i = 0; i < Math.max(vacancyHits.length, courseHits.length); i++) {
    if (vacancyHits[i]) merged.push(vacancyHits[i]);
    if (courseHits[i]) merged.push(courseHits[i]);
  }
  return merged.slice(0, MAX_HITS);
}

export function AppHeader({
  onNavigate,
  onLogout,
  notificationCenter,
}: AppHeaderProps) {
  const { notifications, unreadIds, markRead, markAllRead } = notificationCenter;
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  const hits = useMemo(() => search(query), [query]);

  // Cerrar los desplegables al pulsar fuera o con Escape
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(target)) {
        setBellOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setBellOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const unreadCount = notifications.filter((n) => unreadIds.has(n.id)).length;

  const goToHit = (hit: SearchHit) => {
    setSearchOpen(false);
    setQuery('');
    onNavigate(hit.target);
  };

  const openNotification = (notification: AppNotification) => {
    markRead(notification.id);
    setBellOpen(false);
    onNavigate(notification.target);
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 flex-shrink-0"
            title="Ir al panel"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <img
                src="/logo_skillmatch.png"
                alt="SkillMatch"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-gray-900 font-semibold text-lg hidden sm:inline">
              SkillMatch
            </span>
          </button>

          {/* Buscador */}
          <div ref={searchRef} className="relative flex-1 max-w-md">
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Buscar vacantes o cursos…"
                className="flex-1 outline-none text-gray-900 min-w-0"
                aria-label="Buscar vacantes o cursos"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setSearchOpen(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {searchOpen && query.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                {hits.length === 0 ? (
                  <p className="px-4 py-3 text-gray-500 text-sm">
                    Sin resultados para «{query.trim()}».
                  </p>
                ) : (
                  hits.map((hit) => (
                    <button
                      key={hit.id}
                      onClick={() => goToHit(hit)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-start gap-3"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          hit.kind === 'vacancy' ? 'bg-blue-50' : 'bg-purple-50'
                        }`}
                      >
                        {hit.kind === 'vacancy' ? (
                          <Briefcase size={16} className="text-blue-600" />
                        ) : (
                          <BookOpen size={16} className="text-purple-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-900 truncate">{hit.title}</p>
                        <p className="text-gray-500 text-sm truncate">
                          {hit.subtitle}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Notificaciones */}
            <div ref={bellRef} className="relative">
              <button
                onClick={() => setBellOpen((open) => !open)}
                className="relative text-gray-600 hover:text-gray-900 p-1"
                aria-label={`Notificaciones${
                  unreadCount ? ` (${unreadCount} sin leer)` : ''
                }`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {bellOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="text-gray-900 font-medium">
                      Notificaciones
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Marcar todas
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-gray-500 text-sm text-center">
                      No tienes notificaciones.
                    </p>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => {
                        const unread = unreadIds.has(notification.id);
                        return (
                          <button
                            key={notification.id}
                            onClick={() => openNotification(notification)}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-start gap-3 ${
                              unread ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                unread ? 'bg-blue-600' : 'bg-transparent'
                              }`}
                            />
                            <div className="min-w-0">
                              <p className="text-gray-900 text-sm">
                                {notification.title}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {notification.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Perfil */}
            <button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center hover:opacity-90"
              title="Ver mi perfil"
              aria-label="Ver mi perfil"
            >
              <User className="text-white" size={20} />
            </button>

            {/* Salir */}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
              <span className="hidden md:inline text-sm">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
