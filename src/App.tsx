import { useState } from 'react';
import { Home } from './components/Home';
import { RegisterPricing } from './components/RegisterPricing';
import { UploadCV } from './components/UploadCV';
import { PreferencesForm } from './components/PreferencesForm';
import { AnalysisProcess } from './components/AnalysisProcess';
import { Recommendations } from './components/Recommendations';
import { UserDashboard } from './components/UserDashboard';

type Screen = 'home' | 'register' | 'upload' | 'preferences' | 'analyzing' | 'recommendations' | 'dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  return (
    <div>
      {currentScreen === 'home' && (
        <Home onNavigate={() => setCurrentScreen('register')} />
      )}
      
      {currentScreen === 'register' && (
        <RegisterPricing 
          onContinue={() => setCurrentScreen('upload')} 
          onBack={() => setCurrentScreen('home')} 
        />
      )}
      
      {currentScreen === 'upload' && (
        <UploadCV 
          onUpload={() => setCurrentScreen('preferences')} 
          onBack={() => setCurrentScreen('register')} 
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
