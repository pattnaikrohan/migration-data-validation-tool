import { WORKFLOW_STEPS } from '../../data/demoData';
import cozentusEmblem from '../../assets/cozentus-emblem-transparent.png';
import {
  Plug, Database, Search, GitCompareArrows, Columns3,
  ShieldCheck, BarChart3, CheckCircle2,
  ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import './Sidebar.css';

const ICONS = {
  Plug,
  Database,
  Search,
  GitCompare: GitCompareArrows,
  Columns3,
  ShieldCheck,
  BarChart3,
};

export default function Sidebar({
  currentStep,
  completedSteps,
  onStepChange,
  collapsed = false,
  onToggleCollapse,
}) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-logo">
        <div className="logo-badge" title="CozMatch by Cozentus">
          <img src={cozentusEmblem} alt="CozMatch" className="logo-emblem-img" />
        </div>
        {!collapsed && (
          <div className="logo-text">
            <div className="logo-title-row">
              <span className="logo-title">CozMatch</span>
              <Sparkles size={14} className="logo-sparkle" />
            </div>
            <span className="logo-subtitle">DATA INTELLIGENCE</span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {WORKFLOW_STEPS.map((step, index) => {
          const Icon = ICONS[step.icon] || Database;
          const isActive = currentStep === index;
          const isCompleted = completedSteps.has(index);
          const isAccessible = index <= Math.max(currentStep, ...[...completedSteps, 0]);

          return (
            <button
              key={step.id}
              className={`sidebar-nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isAccessible ? 'accessible' : ''}`}
              onClick={() => isAccessible && onStepChange(index)}
              disabled={!isAccessible}
              title={collapsed ? `${step.label} — ${step.description}` : undefined}
            >
              <div className="nav-item-icon">
                {isCompleted && !isActive ? (
                  <CheckCircle2 size={20} className="completed-check" />
                ) : (
                  <Icon size={20} />
                )}
              </div>
              {!collapsed && (
                <div className="nav-item-content">
                  <span className="nav-item-label">{step.label}</span>
                  <span className="nav-item-desc">{step.description}</span>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse / Expand Toggle Button & Footer */}
      <div className="sidebar-bottom">
        <button
          className="sidebar-collapse-btn"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : (
            <>
              <ChevronLeft size={18} />
              <span className="collapse-text">Collapse Menu</span>
            </>
          )}
        </button>

        {!collapsed && (
          <div className="sidebar-footer">
            <span>Cozentus Validation Suite • v1.2</span>
          </div>
        )}
      </div>
    </aside>
  );
}
