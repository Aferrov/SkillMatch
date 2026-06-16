import { useMemo, useState } from 'react';
import { Home } from './components/Home';
import { UploadCV } from './components/UploadCV';
import { AnalysisProcess } from './components/AnalysisProcess';
import { CVAnalysisReview } from './components/CVAnalysisReview';
import { ResultsDashboard } from './components/ResultsDashboard';
import { JobRecommendations } from './components/JobRecommendations';
import { VacancyList } from './components/VacancyList';
import { SkillGapAnalysis } from './components/SkillGapAnalysis';
import { CourseRecommendations } from './components/CourseRecommendations';
import { ProfilePage } from './components/ProfilePage';
import { UserDashboard } from './components/UserDashboard';
import { MOCK_USER_PROFILE, type UserProfile } from './data/userProfile';

type Screen =
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

interface AnalysisResult {
  name?: string;
  career?: string;
  career_scores?: Record<string, number>;
  match?: unknown;
  found_skills?: string[];
  missing_skills?: string[];
  jobs?: unknown[];
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const analysisProfile = useMemo<UserProfile>(() => {
    if (!analysisResult) return MOCK_USER_PROFILE;

    return {
      ...MOCK_USER_PROFILE,
      name: analysisResult.name || MOCK_USER_PROFILE.name,
      headline: analysisResult.career
        ? `${analysisResult.career} detectada`
        : MOCK_USER_PROFILE.headline,
      technicalSkills: analysisResult.found_skills ?? [],
      softSkills: [],
      interests: analysisResult.missing_skills ?? [],
    };
  }, [analysisResult]);

  return (
    <div>
      {currentScreen === 'home' && (
        <Home onNavigate={() => setCurrentScreen('upload')} />
      )}

      {currentScreen === 'upload' && (
        <UploadCV
          onUpload={(data) => {
            setAnalysisResult(data);
            setCurrentScreen('analyzing');
          }}
          onBack={() => setCurrentScreen('home')}
          onManualEntry={() => setCurrentScreen('manualProfile')}
        />
      )}

      {currentScreen === 'manualProfile' && (
        <ManualProfile
          onComplete={() => setCurrentScreen('preferences')}
          onBack={() => setCurrentScreen('upload')}
        />
      )}

      {/*
      {currentScreen === 'preferences' && (
        <PreferencesForm
          onComplete={() => setCurrentScreen('analyzing')}
          onBack={() => setCurrentScreen('upload')}
        />
      )}
      */}

      {currentScreen === 'analyzing' && (
        <AnalysisProcess onComplete={() => setCurrentScreen('cvReview')} />
      )}

      {currentScreen === 'cvReview' && (
        <CVAnalysisReview
          analysisResult={analysisResult}
          onContinue={() => setCurrentScreen('results')}
          onBack={() => setCurrentScreen('analyzing')}
        />
      )}

      {currentScreen === 'results' && (
        <ResultsDashboard
          profile={analysisProfile}
          onBack={() => setCurrentScreen('cvReview')}
          onSeeRecommendations={() => setCurrentScreen('recommendations')}
          onSeeAllVacancies={() => setCurrentScreen('vacancies')}
          onImproveProfile={() => setCurrentScreen('cvReview')}
          onSeeSkillGap={() => setCurrentScreen('skillGap')}
          onSeeCourses={() => setCurrentScreen('courses')}
        />
      )}

      {currentScreen === 'skillGap' && (
        <SkillGapAnalysis
          onBack={() => setCurrentScreen('results')}
          onSeeVacancies={() => setCurrentScreen('vacancies')}
          onSeeCourses={() => setCurrentScreen('courses')}
        />
      )}

      {currentScreen === 'courses' && (
        <CourseRecommendations
          profile={analysisProfile}
          onBack={() => setCurrentScreen('results')}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfilePage onBack={() => setCurrentScreen('dashboard')} />
      )}

      {currentScreen === 'recommendations' && (
        <JobRecommendations
          profile={analysisProfile}
          onBack={() => setCurrentScreen('results')}
          onSeeAllVacancies={() => setCurrentScreen('vacancies')}
        />
      )}

      {currentScreen === 'vacancies' && (
        <VacancyList onBack={() => setCurrentScreen('results')} />
      )}

      {currentScreen === 'dashboard' && (
        <UserDashboard onNavigate={(screen) => setCurrentScreen(screen as Screen)} />
      )}
    </div>
  );
}
