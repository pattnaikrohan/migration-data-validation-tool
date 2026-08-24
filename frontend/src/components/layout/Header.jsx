import { WORKFLOW_STEPS } from '../../data/demoData';
import { useAppState } from '../../store/AppContext';
import { PanelLeft, Server, Snowflake, Database, Layers } from 'lucide-react';
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
