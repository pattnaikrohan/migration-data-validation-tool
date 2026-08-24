import { useState, useEffect } from 'react';
import { AppProvider } from './store/AppContext';

const UI_STORAGE_KEY = 'cozmatch_ui_state';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ConnectionSetup from './pages/ConnectionSetup';
import SchemaSelection from './pages/SchemaSelection';
import TableDiscovery from './pages/TableDiscovery';
import TableMatching from './pages/TableMatching';
import ColumnMatching from './pages/ColumnMatching';
import ValidationDashboard from './pages/ValidationDashboard';
import ResultsSummary from './pages/ResultsSummary';
import './App.css';

const PAGES = [
  ConnectionSetup,
  SchemaSelection,
  TableDiscovery,
  TableMatching,
  ColumnMatching,
  ValidationDashboard,
  ResultsSummary,
];

function AppContent() {
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem(UI_STORAGE_KEY);
    return saved ? JSON.parse(saved).currentStep : 0;
  });
  
  const [completedSteps, setCompletedSteps] = useState(() => {
    const saved = localStorage.getItem(UI_STORAGE_KEY);
    return saved && JSON.parse(saved).completedSteps ? new Set(JSON.parse(saved).completedSteps) : new Set();
  });
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem(UI_STORAGE_KEY);
    return saved ? JSON.parse(saved).sidebarCollapsed : false;
  });

  useEffect(() => {
    localStorage.setItem(UI_STORAGE_KEY, JSON.stringify({
      currentStep,
      completedSteps: Array.from(completedSteps),
      sidebarCollapsed
    }));
  }, [currentStep, completedSteps, sidebarCollapsed]);

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  const handleNextStep = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    setCurrentStep(prev => Math.min(prev + 1, PAGES.length - 1));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleToggleCollapse = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const CurrentPage = PAGES[currentStep];

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
      <Sidebar
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepChange={handleStepChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <div className={`app-main ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Header
          currentStep={currentStep}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={handleToggleCollapse}
        />
        <main className="app-content">
          <CurrentPage
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            currentStep={currentStep}
          />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
