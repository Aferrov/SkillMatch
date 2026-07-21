/**
 * Router mínimo sobre la History API — sin dependencias externas.
 *
 * Da URLs reales a cada pantalla (/resultados, /vacantes, ...) para que:
 *   - el botón "atrás" del navegador funcione,
 *   - recargar la página mantenga al usuario donde estaba,
 *   - se puedan compartir/marcar enlaces internos.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export type Screen =
  | 'home'
  | 'login'
  | 'register'
  | 'upload'
  | 'manualProfile'
  | 'preferences'
  | 'analyzing'
  | 'cvReview'
  | 'results'
  | 'recommendations'
  | 'vacancies'
  | 'skillGap'
  | 'courses'
  | 'profile'
  | 'dashboard';

/** Ruta canónica de cada pantalla. */
export const SCREEN_PATHS: Record<Screen, string> = {
  home: '/',
  login: '/login',
  register: '/registro',
  upload: '/subir-cv',
  manualProfile: '/perfil-manual',
  preferences: '/preferencias',
  analyzing: '/analizando',
  cvReview: '/revision-cv',
  results: '/resultados',
  recommendations: '/recomendaciones',
  vacancies: '/vacantes',
  skillGap: '/brecha-habilidades',
  courses: '/cursos',
  profile: '/perfil',
  dashboard: '/panel',
};

const PATH_TO_SCREEN = Object.entries(SCREEN_PATHS).reduce<Record<string, Screen>>(
  (acc, [screen, path]) => {
    acc[path] = screen as Screen;
    return acc;
  },
  {}
);

/** Convierte una URL en pantalla; las rutas desconocidas caen en 'home'. */
export function pathToScreen(pathname: string): Screen {
  const normalized =
    pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return PATH_TO_SCREEN[normalized] ?? 'home';
}

export interface NavigateOptions {
  /** Sustituye la entrada actual del historial en vez de apilar una nueva. */
  replace?: boolean;
  /** Query string a añadir, p. ej. { next: '/resultados' }. */
  query?: Record<string, string>;
}

export interface Router {
  screen: Screen;
  path: string;
  search: string;
  navigate: (screen: Screen, options?: NavigateOptions) => void;
  /**
   * Vuelve a la pantalla anterior. Si el usuario entró directo por URL y no
   * hay historial propio, va a `fallback` en lugar de salirse del sitio.
   */
  back: (fallback?: Screen) => void;
  /** Lee un parámetro de la query string actual. */
  getParam: (key: string) => string | null;
}

export function useRouter(): Router {
  const [location, setLocation] = useState(() => ({
    path: window.location.pathname,
    search: window.location.search,
  }));

  // Posición dentro del historial *propio* de la app. Si es 0 significa que
  // el usuario entró directo por URL: un history.back() lo sacaría de
  // SkillMatch (o lo dejaría en una pestaña en blanco).
  const historyIndex = useRef<number>(
    (window.history.state as { idx?: number } | null)?.idx ?? 0
  );

  // Marca la entrada inicial para que el índice sobreviva a las recargas
  useEffect(() => {
    if ((window.history.state as { idx?: number } | null)?.idx === undefined) {
      window.history.replaceState(
        { ...window.history.state, idx: 0 },
        '',
        `${window.location.pathname}${window.location.search}`
      );
    }
  }, []);

  // El botón atrás/adelante del navegador dispara popstate
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      historyIndex.current = (event.state as { idx?: number } | null)?.idx ?? 0;
      setLocation({
        path: window.location.pathname,
        search: window.location.search,
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((screen: Screen, options: NavigateOptions = {}) => {
    const query = options.query
      ? `?${new URLSearchParams(options.query).toString()}`
      : '';
    const url = `${SCREEN_PATHS[screen]}${query}`;

    // Evita apilar la misma URL dos veces seguidas (p. ej. doble click)
    if (url === `${window.location.pathname}${window.location.search}`) return;

    if (options.replace) {
      window.history.replaceState({ screen, idx: historyIndex.current }, '', url);
    } else {
      historyIndex.current += 1;
      window.history.pushState({ screen, idx: historyIndex.current }, '', url);
    }

    setLocation({ path: SCREEN_PATHS[screen], search: query });
    window.scrollTo(0, 0);
  }, []);

  const back = useCallback(
    (fallback: Screen = 'home') => {
      if (historyIndex.current > 0) {
        window.history.back();
      } else {
        navigate(fallback, { replace: true });
      }
    },
    [navigate]
  );

  const getParam = useCallback(
    (key: string) => new URLSearchParams(location.search).get(key),
    [location.search]
  );

  return {
    screen: pathToScreen(location.path),
    path: location.path,
    search: location.search,
    navigate,
    back,
    getParam,
  };
}
