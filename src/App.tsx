import { useState } from 'react';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { RegisterPricing } from './components/RegisterPricing';
import { UploadCV } from './components/UploadCV';
import { ManualProfile } from './components/ManualProfile';
import { PreferencesForm } from './components/PreferencesForm';
import { AnalysisProcess } from './components/AnalysisProcess';
import { Recommendations } from './components/Recommendations';
import { UserDashboard } from './components/UserDashboard';

type Screen =
  | 'home'
  | 'login'
  | 'register'
  | 'upload'
  | 'manualProfile'
  | 'preferences'
  | 'analyzing'
  | 'recommendations'
  | 'dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  return (
    <div>
      {currentScreen === 'home' && (
        <Home onNavigate={(screen) => setCurrentScreen(screen)} />
      )}

      {currentScreen === 'login' && (
        <Login
          onLogin={() => setCurrentScreen('dashboard')}
          onBack={() => setCurrentScreen('home')}
          onGoToRegister={() => setCurrentScreen('register')}
        />
      )}

      {currentScreen === 'register' && (
        <RegisterPricing
          onContinue={() => setCurrentScreen('upload')}
          onBack={() => setCurrentScreen('home')}
          onGoToLogin={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'upload' && (
        <UploadCV
          onUpload={() => setCurrentScreen('preferences')}
          onBack={() => setCurrentScreen('register')}
          onManualEntry={() => setCurrentScreen('manualProfile')}
        />
      )}

      {currentScreen === 'manualProfile' && (
        <ManualProfile
          onComplete={() => setCurrentScreen('preferences')}
          onBack={() => setCurrentScreen('upload')}
        />
      )}

      {currentScreen === 'preferences' && (
        <PreferencesForm
          onComplete={() => setCurrentScreen('analyzing')}
          onBack={() => setCurrentScreen('upload')}
        />
      )}

      {currentScreen === 'analyzing' && (
        <AnalysisProcess onComplete={() => setCurrentScreen('recommendations')} />
      )}

      {currentScreen === 'recommendations' && (
        <Recommendations onNavigate={() => setCurrentScreen('dashboard')} />
      )}

      {currentScreen === 'dashboard' && (
        <UserDashboard onNavigate={(screen) => setCurrentScreen(screen as Screen)} />
      )}
    </div>
  );
}
