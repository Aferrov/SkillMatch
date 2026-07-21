/**
 * Servicio de autenticación y persistencia de sesión.
 *
 * El token vive en `localStorage` cuando el usuario marca "Recordarme"
 * (sobrevive a cerrar el navegador) y en `sessionStorage` cuando no
 * (se borra al cerrar la pestaña). Al arrancar la app se lee de ambos,
 * de modo que recargar la página nunca devuelve al login.
 */

import { getApiBaseUrl } from './api';

const API_BASE_URL = getApiBaseUrl();
const STORAGE_KEY = 'skillmatch.session';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  plan: 'Free' | 'Premium';
}

export interface StoredSession {
  token: string;
  /** Timestamp en ms en el que el token deja de ser válido. */
  expiresAt: number;
  user: AuthUser;
  remember: boolean;
}

export interface AuthResult {
  success: boolean;
  session?: StoredSession;
  error?: string;
}

/** Estado de sesión que se persiste entre recargas y dispositivos. */
export interface SessionState {
  analysis?: unknown;
  profile?: unknown;
  prefs?: unknown;
  /** Puntuación del análisis, para el historial del panel. */
  score?: number;
  source?: string;
  updated_at?: string | null;
}

export interface AnalysisHistoryEntry {
  id: number;
  career: string | null;
  score: number | null;
  skills_found: number;
  skills_missing: number;
  source: string;
  created_at: string | null;
}

/** Métricas reales del usuario, calculadas en el backend. */
export interface UserStats {
  analysis_count: number;
  last_analysis_at: string | null;
  current_score: number | null;
  score_delta: number | null;
  member_since: string | null;
  last_login_at: string | null;
  plan: 'Free' | 'Premium';
  history: AnalysisHistoryEntry[];
}

// ─── Almacenamiento local del token ─────────────────────────────────

function safeStorage(remember: boolean): Storage | null {
  try {
    return remember ? window.localStorage : window.sessionStorage;
  } catch {
    // Navegación privada con almacenamiento bloqueado
    return null;
  }
}

export function saveSession(session: StoredSession): void {
  const serialized = JSON.stringify(session);
  try {
    // Se limpia el otro almacén para no dejar dos sesiones desincronizadas
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
    safeStorage(session.remember)?.setItem(STORAGE_KEY, serialized);
  } catch {
    console.warn('No se pudo guardar la sesión en el navegador');
  }
}

export function loadSession(): StoredSession | null {
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as StoredSession;
    if (!session?.token || !session?.user) return null;

    // Token caducado: se descarta sin molestar al backend
    if (typeof session.expiresAt === 'number' && session.expiresAt < Date.now()) {
      clearSession();
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* almacenamiento no disponible */
  }
}

export function getToken(): string | null {
  return loadSession()?.token ?? null;
}

// ─── Llamadas al backend ────────────────────────────────────────────

async function postAuth(
  path: string,
  body: unknown,
  remember: boolean
): Promise<AuthResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { success: false, error: parseError(data, response.status) };
    }

    const session: StoredSession = {
      token: data.token,
      expiresAt: Date.now() + (data.expires_in ?? 43200) * 1000,
      user: data.user,
      remember,
    };
    saveSession(session);
    return { success: true, session };
  } catch {
    return {
      success: false,
      error:
        'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.',
    };
  }
}

/** Extrae un mensaje legible de una respuesta de error de FastAPI. */
function parseError(data: any, status: number): string {
  if (typeof data?.detail === 'string') return data.detail;
  if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
    return String(data.detail[0].msg).replace(/^Value error,\s*/, '');
  }
  return `Error del servidor (${status})`;
}

export function login(
  email: string,
  password: string,
  remember: boolean
): Promise<AuthResult> {
  return postAuth('login', { email, password, remember }, remember);
}

export function register(
  name: string,
  email: string,
  password: string,
  plan: 'Free' | 'Premium' = 'Free'
): Promise<AuthResult> {
  return postAuth('register', { name, email, password, plan }, true);
}

/**
 * Valida el token guardado contra el backend.
 * Devuelve el usuario, o null si el token ya no sirve.
 */
export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 401) {
      clearSession();
      return null;
    }
    if (!response.ok) return null;

    return (await response.json()) as AuthUser;
  } catch {
    // Backend caído: se mantiene la sesión local para no expulsar al usuario
    return null;
  }
}

export async function logout(): Promise<void> {
  const token = getToken();
  clearSession();
  if (!token) return;

  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    /* cerrar sesión local ya es suficiente */
  }
}

// ─── Estado de sesión en el servidor ────────────────────────────────

/** Recupera el último análisis/perfil guardado del usuario. */
export async function fetchSessionState(): Promise<SessionState | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    return (await response.json()) as SessionState;
  } catch {
    return null;
  }
}

/** Métricas reales del usuario (nº de análisis, evolución del score...). */
export async function fetchStats(): Promise<UserStats | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    return (await response.json()) as UserStats;
  } catch {
    return null;
  }
}

/** Guarda el estado de sesión. Los campos omitidos conservan su valor. */
export async function saveSessionState(state: SessionState): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(state),
    });
    return response.ok;
  } catch {
    return false;
  }
}
