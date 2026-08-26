import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Clock, Loader2, Play, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import './ValidationDashboard.css';

const PHASES = [
  { key: 'connection', label: 'Connection Validation', duration: 0.8 },
  { key: 'schema', label: 'Schema Validation', duration: 1.2 },
  { key: 'table_matching', label: 'Table Matching Finalized', duration: 0.5 },
  { key: 'column_matching', label: 'Column Matching Finalized', duration: 0.5 },
  { key: 'data_type', label: 'Data Type Validation', duration: 1.5 },
  { key: 'primary_key', label: 'Primary Key Validation', duration: 2.0 },
  { key: 'row_count', label: 'Row Count Validation', duration: 1.0 },
  { key: 'record_level', label: 'Record-Level Matching', duration: 4.0 },
  { key: 'hash_comparison', label: 'Hash Comparison', duration: 3.0 },
  { key: 'cell_validation', label: 'Cell-to-Cell Validation', duration: 6.0 },
  { key: 'statistics', label: 'Statistics Calculation', duration: 0.8 },
  { key: 'report', label: 'Report Generation', duration: 1.0 },
];

export default function ValidationDashboard({ onNext, onPrev }) {
  const [running, setRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(-1);
  const [phaseStatuses, setPhaseStatuses] = useState({});
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  const startValidation = () => {
    setRunning(true);
    setCompleted(false);
    setCurrentPhase(0);
    setPhaseStatuses({});
    setProgress(0);
  };

  useEffect(() => {
    if (!running || currentPhase < 0) return;
    if (currentPhase >= PHASES.length) {
      setRunning(false);
      setCompleted(true);
      setProgress(100);
      return;
    }

    const phase = PHASES[currentPhase];
    setPhaseStatuses(prev => ({ ...prev, [phase.key]: 'running' }));

    const timer = setTimeout(() => {
      const status = 'pass';
      setPhaseStatuses(prev => ({ ...prev, [phase.key]: status }));
      setProgress(((currentPhase + 1) / PHASES.length) * 100);
      setCurrentPhase(prev => prev + 1);
    }, phase.duration * 500);

    return () => clearTimeout(timer);
  }, [running, currentPhase]);

  return (
    <div className="validation-page">
      <motion.p className="page-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Execute the full validation pipeline. Each phase runs sequentially, validating structure, 
        counts, records, and cell-level data.
      </motion.p>

      {/* Run Controls */}
      <motion.div
        className="glass-card-static validation-control"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="validation-control-header">
          <div className="validation-run-info">
            <ShieldCheck size={24} className="run-icon" />
            <div>
              <h3>Validation Run</h3>
              <span className="run-id">
                {completed ? 'Run ID: VR-3A8F21B0 • Completed' : running ? 'Running...' : 'Ready to start'}
              </span>
            </div>
          </div>
          {!running && !completed && (
            <button className="btn btn-primary btn-lg" onClick={startValidation}>
              <Play size={18} /> Start Validation
            </button>
          )}
          {completed && (
            <div className="validation-complete-badge">
              <CheckCircle2 size={18} /> Validation Complete
            </div>
          )}
        </div>

        {/* Progress */}
        {(running || completed) && (
          <div className="validation-progress">
            <div className="progress-bar" style={{ height: 8 }}>
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-text">{Math.round(progress)}%</span>
          </div>
        )}
      </motion.div>

      {/* Phase List */}
      <div className="phase-list">
        {PHASES.map((phase, i) => {
          const status = phaseStatuses[phase.key];
          const isActive = running && currentPhase === i;
          
          return (
            <motion.div
              key={phase.key}
              className={`glass-card-static phase-item ${status || ''} ${isActive ? 'active' : ''}`}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="phase-status-icon">
                {status === 'pass' && <CheckCircle2 size={18} className="phase-pass" />}
                {status === 'warning' && <AlertTriangle size={18} className="phase-warning" />}
                {status === 'fail' && <XCircle size={18} className="phase-fail" />}
                {status === 'running' && <Loader2 size={18} className="phase-running spin" />}
                {!status && <div className="phase-pending-dot" />}
              </div>
              <div className="phase-info">
                <span className="phase-label">{phase.label}</span>
                {isActive && <span className="phase-active-text">Processing...</span>}
                {status === 'pass' && <span className="phase-done-text">Completed</span>}
                {status === 'warning' && <span className="phase-warn-text">Completed with warnings</span>}
              </div>
              <span className="phase-number">Phase {i + 1}/{PHASES.length}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="page-actions">
        <div className="page-actions-row">
          <button className="btn btn-ghost" onClick={onPrev}>← Back</button>
          <button className="btn btn-primary btn-lg" onClick={onNext} disabled={!completed}>
            View Results →
          </button>
        </div>
      </div>
    </div>
  );
}
