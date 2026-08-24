import { useState, useEffect } from 'react';
import { WORKFLOW_STEPS } from '../../data/demoData';
import { useAppState } from '../../store/AppContext';
import { healthCheck } from '../../api/client';
import { PanelLeft, Server, Snowflake, Database, Layers, Activity, RefreshCw } from 'lucide-react';
import './Header.css';

const ENGINE_ICONS = {
  snowflake: Snowflake,
  sql_server: Server,
  postgresql: Database,
  mysql: Database,
  oracle: Database,
  databricks: Layers,
};

export default function Header({ currentStep, sidebarCollapsed, onToggleSidebar }) {
  const state = useAppState();
  const step = WORKFLOW_STEPS[currentStep];

  const SourceIcon = ENGINE_ICONS[state.source.engine] || Database;
  const TargetIcon = ENGINE_ICONS[state.target.engine] || Database;

  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [backendVersion, setBackendVersion] = useState('');

  const checkHealth = async () => {
    setBackendStatus('checking');
    try {
      const res = await healthCheck();
      if (res && res.data && res.data.status === 'healthy') {
        setBackendStatus('online');
        setBackendVersion(res.data.version || '1.0.0');
      } else {
        setBackendStatus('offline');
      }
    } catch {
      setBackendStatus('offline');
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          {sidebarCollapsed && (
            <button
              className="sidebar-quick-toggle"
              onClick={onToggleSidebar}
              title="Expand Sidebar"
            >
              <PanelLeft size={18} />
            </button>
          )}
          <div>
            <div className="header-breadcrumb">
              <span className="breadcrumb-step">Step {currentStep + 1} of {WORKFLOW_STEPS.length}</span>
              <span className="breadcrumb-divider">/</span>
              <span className="breadcrumb-label">{step?.label}</span>
            </div>
            <h1 className="header-title">{step?.label} — {step?.description}</h1>
          </div>
        </div>
        <div className="header-right">
          {/* Live Cloud Backend Status Badge */}
          <button
            className={`api-status-badge ${backendStatus}`}
            onClick={checkHealth}
            title={backendStatus === 'online' ? `FastAPI Backend Online (v${backendVersion}) — Click to re-check` : 'Backend API is connecting or in standalone demo mode — Click to re-check'}
          >
            <Activity size={13} className={backendStatus === 'checking' ? 'spin-icon' : ''} />
            <span className="api-status-dot" />
            <span className="api-status-text">
              {backendStatus === 'online' ? `Cloud API: Online (v${backendVersion})` : backendStatus === 'checking' ? 'Checking API...' : 'API: Offline (Demo Mode)'}
            </span>
          </button>

          <div className="header-connections">
            <div className={`connection-indicator ${state.source.connected ? 'connected' : 'disconnected'}`}>
              <SourceIcon size={14} />
              <div className={`glow-dot ${state.source.connected ? 'glow-dot-success' : 'glow-dot-neutral'}`} />
              <span>Src: {state.source.engineLabel}</span>
            </div>
            <div className={`connection-indicator ${state.target.connected ? 'connected' : 'disconnected'}`}>
              <TargetIcon size={14} />
              <div className={`glow-dot ${state.target.connected ? 'glow-dot-success' : 'glow-dot-neutral'}`} />
              <span>Tgt: {state.target.engineLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="header-progress">
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentStep + 1) / WORKFLOW_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </header>
  );
}
