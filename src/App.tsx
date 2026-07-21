import { useCallback, useEffect, useMemo } from 'react';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { RegisterPricing } from './components/RegisterPricing';
import { UploadCV } from './components/UploadCV';
import { ManualProfile, type ManualProfileData } from './components/ManualProfile';
import { PreferencesForm, type PreferencesData } from './components/PreferencesForm';
import { AnalysisProcess } from './components/AnalysisProcess';
import { CVAnalysisReview } from './components/CVAnalysisReview';
import { ResultsDashboard } from './components/ResultsDashboard';
import { JobRecommendations } from './components/JobRecommendations';
import { VacancyList } from './components/VacancyList';
import { SkillGapAnalysis } from './components/SkillGapAnalysis';
import { CourseRecommendations } from './components/CourseRecommendations';
import { ProfilePage } from './components/ProfilePage';
import { UserDashboard } from './components/UserDashboard';
import { SessionLoading } from './components/SessionLoading';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useRouter, pathToScreen, type Screen } from './hooks/useRouter';
import { useAnalysisSession, type AnalysisResult } from './hooks/useAnalysisSession';
import { useDashboardData } from './hooks/useDashboardData';
import { MOCK_USER_PROFILE, type UserProfile } from './data/userProfile';
import { VACANCIES } from './data/vacancies';
import { calculateAllMatches, calculateProfileScore } from './data/matching';

/** Pantallas accesibles sin haber iniciado sesión. */
const PUBLIC_SCREENS = new Set<Screen>(['home', 'login', 'register']);

/**
 * Pantallas que no tienen sentido sin un análisis de CV: si se entra por URL
 * directa sin datos, se redirige a subir el CV en lugar de mostrar la pantalla
 * vacía o con datos de ejemplo.
 */
const ANALYSIS_REQUIRED = new Set<Screen>([
  'analyzing',
  'cvReview',
  'results',
  'recommendations',
  'skillGap',
  'courses',
]);

/**
 * Construye el perfil del usuario a partir de sus datos reales.
 *
 * Prioridad: lo que editó a mano en «Mi perfil» > lo detectado en su análisis
 * de CV > la plantilla de ejemplo (solo aporta el esqueleto de campos que
 * todavía no sabemos rellenar, como la educación).
 */
function buildProfile(
  user: { name: string; email: string; plan: 'Free' | 'Premium' } | null,
  analysisResult: AnalysisResult | null,
  savedProfile: Record<string, unknown> | null
): UserProfile {
  const base: UserProfile = {
    ...MOCK_USER_PROFILE,
    name: user?.name ?? MOCK_USER_PROFILE.name,
    email: user?.email ?? MOCK_USER_PROFILE.email,
    plan: user?.plan ?? MOCK_USER_PROFILE.plan,
    headline: 'Perfil sin analizar',
    technicalSkills: [],
    softSkills: [],
    interests: [],
    cvFile: undefined,
  };

  const fromAnalysis: UserProfile = analysisResult
    ? {
        ...base,
        name: analysisResult.name || base.name,
        headline: analysisResult.career
          ? `${analysisResult.career} detectada`
          : base.headline,
        technicalSkills: analysisResult.found_skills ?? [],
        interests: analysisResult.missing_skills ?? [],
      }
    : base;

  return savedProfile
    ? { ...fromAnalysis, ...(savedProfile as Partial<UserProfile>) }
    : fromAnalysis;
}

/** Puntuación del perfil, para dejarla registrada en el historial. */
function scoreFor(profile: UserProfile): number {
  return calculateProfileScore(profile, calculateAllMatches(profile, VACANCIES))
    .total;
}

/** Convierte el formulario manual al mismo formato que devuelve el backend. */
function analysisFromManualProfile(data: ManualProfileData): AnalysisResult {
  return {
    name: data.fullName,
    career: data.jobTitle,
    found_skills: data.skills,
    missing_skills: [],
    experience: [],
    education: data.institution
      ? [
          {
            id: 'edu-manual-1',
            title: data.educationLevel || 'Formación',
            institution: data.institution,
            period: '',
            kind: 'studies',
          },
        ]
      : [],
  };
}

function AppRoutes() {
  const { screen, navigate, back, getParam } = useRouter();
  const { user, status, isAuthenticated, login, register, logout } = useAuth();
  const {
    analysisResult,
    prefs,
    savedProfile,
    isSyncing,
    setAnalysisResult,
    setPrefs,
    setSavedProfile,
    clear: clearAnalysis,
  } = useAnalysisSession(isAuthenticated);

  // ─── Guardas de navegación ────────────────────────────────────────
  useEffect(() => {
    // Aún no se sabe si hay sesión: no redirigir todavía. Ésta es la razón
    // por la que antes recargar una pantalla interna devolvía al login.
    if (status === 'checking') return;

    const isPublic = PUBLIC_SCREENS.has(screen);

    if (!isPublic && status === 'guest') {
      // Se recuerda a dónde quería ir para volver ahí tras el login
      navigate('login', {
        replace: true,
        query: { next: window.location.pathname },
      });
      return;
    }

    if (isAuthenticated && (screen === 'login' || screen === 'register')) {
      navigate('dashboard', { replace: true });
      return;
    }

    // Se espera a que termine la sincronización con el servidor antes de
    // decidir que el usuario no tiene ningún análisis guardado.
    if (
      isAuthenticated &&
      ANALYSIS_REQUIRED.has(screen) &&
      !analysisResult &&
      !isSyncing
    ) {
      navigate('upload', { replace: true });
    }
  }, [screen, status, isAuthenticated, analysisResult, isSyncing, navigate]);

  // ─── Handlers ─────────────────────────────────────────────────────

  /** Tras autenticarse, vuelve a donde el usuario quería ir. */
  const goToNextAfterAuth = useCallback(() => {
    const next = getParam('next');
    const target = next ? pathToScreen(next) : 'dashboard';
    // `replace` para que el botón atrás no devuelva a la pantalla de login
    navigate(PUBLIC_SCREENS.has(target) ? 'dashboard' : target, { replace: true });
  }, [getParam, navigate]);

  const handleLogin = useCallback(
    async (email: string, password: string, remember: boolean) => {
      const result = await login(email, password, remember);
      if (result.success) goToNextAfterAuth();
      return result;
    },
    [login, goToNextAfterAuth]
  );

  const handleRegister = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      plan: 'Free' | 'Premium';
    }) => {
      const result = await register(data.name, data.email, data.password, data.plan);
      // Una cuenta nueva no tiene análisis: el siguiente paso es subir el CV
      if (result.success) navigate('upload', { replace: true });
      return result;
    },
    [register, navigate]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    clearAnalysis();
    navigate('home', { replace: true });
  }, [logout, clearAnalysis, navigate]);

  const handleUpload = useCallback(
    (data?: AnalysisResult) => {
      const result = data ?? {};
      // Se registra la puntuación junto al análisis para que el panel pueda
      // mostrar la evolución real entre uno y otro.
      setAnalysisResult(result, {
        score: scoreFor(buildProfile(user, result, savedProfile)),
        source: 'cv',
      });
      navigate('analyzing');
    },
    [setAnalysisResult, navigate, user, savedProfile]
  );

  const handleManualProfile = useCallback(
    (data: ManualProfileData) => {
      const result = analysisFromManualProfile(data);
      setAnalysisResult(result, {
        score: scoreFor(buildProfile(user, result, savedProfile)),
        source: 'manual',
      });
      navigate('preferences');
    },
    [setAnalysisResult, navigate, user, savedProfile]
  );

  const handlePreferences = useCallback(
    (values: PreferencesData) => {
      setPrefs(values as unknown as Record<string, unknown>);
      navigate('analyzing');
    },
    [setPrefs, navigate]
  );

  // ─── Perfil real del usuario ──────────────────────────────────────
  const analysisProfile = useMemo<UserProfile>(
    () => buildProfile(user, analysisResult, savedProfile),
    [analysisResult, savedProfile, user]
  );

  const dashboardData = useDashboardData(
    analysisProfile,
    Boolean(analysisResult),
    isAuthenticated
  );

  // ─── Render ───────────────────────────────────────────────────────

  // Mientras se valida el token no se pinta nada que dependa de la sesión,
  // para evitar el parpadeo de "login → contenido".
  if (status === 'checking') {
    return <SessionLoading />;
  }

  switch (screen) {
    case 'login':
      return (
        <Login
          onLogin={handleLogin}
          onBack={() => back('home')}
          onGoToRegister={() => navigate('register')}
        />
      );

    case 'register':
      return (
        <RegisterPricing
          onContinue={handleRegister}
          onBack={() => back('home')}
          onGoToLogin={() => navigate('login')}
        />
      );

    case 'upload':
      return (
        <UploadCV
          onUpload={handleUpload}
          onBack={() => back('dashboard')}
          onManualEntry={() => navigate('manualProfile')}
        />
      );

    case 'manualProfile':
      return (
        <ManualProfile
          onComplete={handleManualProfile}
          onBack={() => back('upload')}
        />
      );

    case 'preferences':
      return (
        <PreferencesForm
          onComplete={handlePreferences}
          onBack={() => back('upload')}
          initialPrefs={(prefs as PreferencesData | null) ?? null}
        />
      );

    case 'analyzing':
      // `replace` para que volver atrás desde la revisión no relance el
      // análisis y deje al usuario en un bucle.
      return (
        <AnalysisProcess
          onComplete={() => navigate('cvReview', { replace: true })}
        />
      );

    case 'cvReview':
      return (
        <CVAnalysisReview
          analysisResult={analysisResult}
          onContinue={() => navigate('results')}
          onBack={() => back('upload')}
        />
      );

    case 'results':
      return (
        <ResultsDashboard
          profile={analysisProfile}
          onBack={() => back('dashboard')}
          onSeeRecommendations={() => navigate('recommendations')}
          onSeeAllVacancies={() => navigate('vacancies')}
          onImproveProfile={() => navigate('cvReview')}
          onSeeSkillGap={() => navigate('skillGap')}
          onSeeCourses={() => navigate('courses')}
        />
      );

    case 'skillGap':
      return (
        <SkillGapAnalysis
          onBack={() => back('results')}
          onSeeVacancies={() => navigate('vacancies')}
          onSeeCourses={() => navigate('courses')}
        />
      );

    case 'courses':
      return (
        <CourseRecommendations
          profile={analysisProfile}
          onBack={() => back('results')}
        />
      );

    case 'recommendations':
      return (
        <JobRecommendations
          profile={analysisProfile}
          onBack={() => back('results')}
          onSeeAllVacancies={() => navigate('vacancies')}
        />
      );

    case 'vacancies':
      return <VacancyList onBack={() => back('results')} />;

    case 'profile':
      return (
        <ProfilePage
          onBack={() => back('dashboard')}
          onNavigate={(target) => navigate(target)}
          onLogout={handleLogout}
          profile={analysisProfile}
          onSave={(next) => setSavedProfile(next as unknown as Record<string, unknown>)}
          notificationCenter={dashboardData.notificationCenter}
        />
      );

    case 'dashboard':
      return (
        <UserDashboard
          onNavigate={(target) => navigate(target)}
          onLogout={handleLogout}
          profile={analysisProfile}
          prefs={(prefs as PreferencesData | null) ?? null}
          hasAnalysis={Boolean(analysisResult)}
          data={dashboardData}
          notificationCenter={dashboardData.notificationCenter}
        />
      );

    case 'home':
    default:
      return (
        <Home
          onNavigate={(target) => navigate(target as Screen)}
          isAuthenticated={isAuthenticated}
          userName={user?.name}
        />
      );
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
