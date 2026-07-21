/**
 * Contexto de autenticación.
 *
 * Al montar, rehidrata la sesión desde el navegador y la valida contra el
 * backend. Mientras esa comprobación está en curso el estado es 'checking',
 * de modo que la app no redirige al login antes de saber si hay sesión
 * (ése era el motivo por el que recargar expulsaba al usuario).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as authService from '../services/auth';
import type { AuthUser } from '../services/auth';

type AuthStatus = 'checking' | 'authenticated' | 'guest';

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    remember: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    plan?: 'Free' | 'Premium'
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('checking');

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const stored = authService.loadSession();

      if (!stored) {
        if (!cancelled) setStatus('guest');
        return;
      }

      // Se muestra al usuario de inmediato con los datos locales y se
      // revalida contra el backend en segundo plano.
      if (!cancelled) {
        setUser(stored.user);
        setStatus('authenticated');
      }

      const fresh = await authService.fetchCurrentUser();
      if (cancelled) return;

      if (fresh) {
        setUser(fresh);
      } else if (!authService.loadSession()) {
        // El backend rechazó el token (401) y la sesión ya se limpió
        setUser(null);
        setStatus('guest');
      }
      // Si `fresh` es null pero la sesión sigue en disco, el backend está
      // caído: se mantiene la sesión local en lugar de expulsar al usuario.
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string, remember: boolean) => {
      const result = await authService.login(email, password, remember);
      if (result.success && result.session) {
        setUser(result.session.user);
        setStatus('authenticated');
        return { success: true };
      }
      return { success: false, error: result.error };
    },
    []
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      plan: 'Free' | 'Premium' = 'Free'
    ) => {
      const result = await authService.register(name, email, password, plan);
      if (result.success && result.session) {
        setUser(result.session.user);
        setStatus('authenticated');
        return { success: true };
      }
      return { success: false, error: result.error };
    },
    []
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setStatus('guest');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      login,
      register,
      logout,
    }),
    [user, status, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return context;
}
