/**
 * Estado del análisis de CV persistido entre recargas.
 *
 * Se guarda siempre en localStorage (respuesta instantánea al recargar) y,
 * si hay sesión iniciada, se replica en el backend para que el usuario
 * recupere su análisis también desde otro navegador o dispositivo.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchSessionState, saveSessionState } from '../services/auth';

const ANALYSIS_KEY = 'skillmatch.analysis';
const PREFS_KEY = 'skillmatch.prefs';
const PROFILE_KEY = 'skillmatch.profile';

export interface AnalysisResult {
  name?: string;
  career?: string;
  career_scores?: Record<string, number>;
  match?: unknown;
  found_skills?: string[];
  missing_skills?: string[];
  experience?: Array<{
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
  }>;
  education?: Array<{
    id: string;
    title: string;
    institution: string;
    period: string;
    /** Valores que emite el backend en app/services/parser.py */
    kind: 'studies' | 'certificate';
  }>;
  jobs?: unknown[];
}

function readLocal<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeLocal(key: string, value: unknown): void {
  try {
    if (value === null || value === undefined) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    console.warn(`No se pudo guardar "${key}" en el navegador`);
  }
}

export interface AnalysisSession {
  analysisResult: AnalysisResult | null;
  prefs: Record<string, unknown> | null;
  /** Perfil editado por el usuario en «Mi perfil», si lo hay. */
  savedProfile: Record<string, unknown> | null;
  /** true mientras se recupera el estado guardado en el servidor. */
  isSyncing: boolean;
  setAnalysisResult: (result: AnalysisResult | null, meta?: { score?: number; source?: string }) => void;
  setPrefs: (prefs: Record<string, unknown>) => void;
  setSavedProfile: (profile: Record<string, unknown>) => void;
  clear: () => void;
}

export function useAnalysisSession(isAuthenticated: boolean): AnalysisSession {
  // Lectura síncrona del almacenamiento local: sin parpadeo al recargar
  const [analysisResult, setAnalysisState] = useState<AnalysisResult | null>(() =>
    readLocal<AnalysisResult>(ANALYSIS_KEY)
  );
  const [prefs, setPrefsState] = useState<Record<string, unknown> | null>(() =>
    readLocal<Record<string, unknown>>(PREFS_KEY)
  );
  const [savedProfile, setSavedProfileState] = useState<Record<string, unknown> | null>(
    () => readLocal<Record<string, unknown>>(PROFILE_KEY)
  );
  const [isSyncing, setIsSyncing] = useState(false);

  // Evita re-descargar el estado del servidor en cada render
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      hasSyncedRef.current = false;
      return;
    }
    if (hasSyncedRef.current) return;
    hasSyncedRef.current = true;

    let cancelled = false;
    setIsSyncing(true);

    fetchSessionState()
      .then((remote) => {
        if (cancelled || !remote) return;

        // Lo local tiene prioridad: es lo que el usuario acaba de ver.
        // El servidor solo rellena lo que falte en este navegador.
        if (remote.analysis && !readLocal<AnalysisResult>(ANALYSIS_KEY)) {
          const restored = remote.analysis as AnalysisResult;
          writeLocal(ANALYSIS_KEY, restored);
          setAnalysisState(restored);
        }
        if (remote.prefs && !readLocal<Record<string, unknown>>(PREFS_KEY)) {
          const restored = remote.prefs as Record<string, unknown>;
          writeLocal(PREFS_KEY, restored);
          setPrefsState(restored);
        }
        if (remote.profile && !readLocal<Record<string, unknown>>(PROFILE_KEY)) {
          const restored = remote.profile as Record<string, unknown>;
          writeLocal(PROFILE_KEY, restored);
          setSavedProfileState(restored);
        }
      })
      .finally(() => {
        if (!cancelled) setIsSyncing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const setAnalysisResult = useCallback(
    (result: AnalysisResult | null, meta?: { score?: number; source?: string }) => {
      setAnalysisState(result);
      writeLocal(ANALYSIS_KEY, result);
      if (isAuthenticated && result) {
        // Fire-and-forget: no bloquea la navegación del usuario
        void saveSessionState({ analysis: result, ...meta });
      }
    },
    [isAuthenticated]
  );

  const setPrefs = useCallback(
    (next: Record<string, unknown>) => {
      setPrefsState(next);
      writeLocal(PREFS_KEY, next);
      if (isAuthenticated) {
        void saveSessionState({ prefs: next });
      }
    },
    [isAuthenticated]
  );

  const setSavedProfile = useCallback(
    (next: Record<string, unknown>) => {
      setSavedProfileState(next);
      writeLocal(PROFILE_KEY, next);
      if (isAuthenticated) {
        void saveSessionState({ profile: next });
      }
    },
    [isAuthenticated]
  );

  const clear = useCallback(() => {
    setAnalysisState(null);
    setPrefsState(null);
    setSavedProfileState(null);
    writeLocal(ANALYSIS_KEY, null);
    writeLocal(PREFS_KEY, null);
    writeLocal(PROFILE_KEY, null);
    hasSyncedRef.current = false;
  }, []);

  return {
    analysisResult,
    prefs,
    savedProfile,
    isSyncing,
    setAnalysisResult,
    setPrefs,
    setSavedProfile,
    clear,
  };
}
