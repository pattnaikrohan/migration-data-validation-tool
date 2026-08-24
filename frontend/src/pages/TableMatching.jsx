import { useState } from 'react';
import { useAppState } from '../store/AppContext';
import { DEMO_TABLE_MATCHES, DEMO_TARGET_TABLES } from '../data/demoData';
import {
  Check, X, ArrowRightLeft, Eye,
  ChevronUp, Edit3, CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './TableMatching.css';

const confidenceColors = {
  very_high: 'var(--confidence-very-high)',
  high: 'var(--confidence-high)',
  medium: 'var(--confidence-medium)',
  low: 'var(--confidence-low)',
  very_low: 'var(--confidence-very-low)',
};

const confidenceLabels = {
  very_high: 'Very High',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  very_low: 'Very Low',
};

function formatNumber(n) {
  if (n == null) return '—';
  return n.toLocaleString();
}

function MatchExplanation({ explanation }) {
  if (!explanation) return null;
  const items = [
    { label: 'Name Similarity', value: explanation.name_similarity, weight: '40%' },
    { label: 'Token Similarity', value: explanation.token_similarity, weight: '25%' },
    { label: 'Fuzzy Similarity', value: explanation.fuzzy_similarity, weight: '15%' },
    { label: 'Column Similarity', value: explanation.column_similarity, weight: '20%' },
  ];

  return (
    <motion.div
      className="match-explanation"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="explanation-header">
        <span className="explanation-title">Match Explanation</span>
        <span className="explanation-normalized">
          "{explanation.normalized_source_name}" → "{explanation.normalized_target_name}"
        </span>
      </div>
      <div className="explanation-scores">
        {items.map(item => (
          <div key={item.label} className="explanation-score-row">
            <span className="score-label">{item.label} <span className="score-weight">({item.weight})</span></span>
            <div className="score-bar">
              <div className="score-bar-track">
                <div
                  className="score-bar-fill"
                  style={{
                    width: `${item.value}%`,
                    background: `linear-gradient(90deg, #008b8b, ${item.value >= 90 ? 'var(--confidence-very-high)' : item.value >= 80 ? 'var(--teal-600)' : 'var(--confidence-medium)'})`,
                  }}
                />
              </div>
              <span className="score-bar-value" style={{ color: confidenceColors[item.value >= 95 ? 'very_high' : item.value >= 90 ? 'high' : item.value >= 80 ? 'medium' : 'low'] }}>
                {item.value}%
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="explanation-footer">
        <span>Columns matched: {explanation.matched_columns_count} ({explanation.matched_columns_pct}%)</span>
      </div>
    </motion.div>
  );
}

export default function TableMatching({ onNext, onPrev }) {
  const state = useAppState();
  const [matches, setMatches] = useState(DEMO_TABLE_MATCHES);
  const [editingSource, setEditingSource] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [filter, setFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filtered = matches.filter(m => {
    if (filter === 'auto') return m.decision === 'auto_matched';
    if (filter === 'review') return (m.decision === 'pending' && m.score > 0) || m.decision === 'overridden';
    if (filter === 'unmatched') return m.score === 0 || !m.target_table;
    return true;
  });

  const handleDecision = (sourceTable, decision) => {
    setMatches(prev => prev.map(m =>
      m.source_table === sourceTable ? { ...m, decision } : m
    ));
    showToast(`Table match for '${sourceTable}' ${decision === 'approved' ? 'approved' : 'rejected'}.`);
  };

  const startEditing = (match) => {
    setEditingSource(match.source_table);
    setSelectedTarget(match.target_table || '');
  };

  const cancelEditing = () => {
    setEditingSource(null);
    setSelectedTarget('');
  };

  const saveRemap = (sourceTable) => {
    if (!selectedTarget) {
      // Unmap / clear
      setMatches(prev => prev.map(m => {
        if (m.source_table === sourceTable) {
          return {
            ...m,
            target_table: null,
            score: 0,
            confidence: 'very_low',
            decision: 'pending',
            target_row_count: null,
            target_column_count: 0,
            explanation: null,
          };
        }
        return m;
      }));
      showToast(`Unmapped '${sourceTable}'.`);
    } else {
      const targetObj = DEMO_TARGET_TABLES.find(t => t.table_name === selectedTarget);
      setMatches(prev => prev.map(m => {
        if (m.source_table === sourceTable) {
          return {
            ...m,
            target_table: selectedTarget,
            score: 100,
            confidence: 'very_high',
            decision: 'overridden',
            target_row_count: targetObj ? targetObj.row_count : null,
            target_column_count: targetObj ? targetObj.columns.length : 0,
            explanation: {
              overall_score: 100,
              name_similarity: 100,
              token_similarity: 100,
              fuzzy_similarity: 100,
              column_similarity: 100,
              matched_columns_count: targetObj ? targetObj.columns.length : 0,
              matched_columns_pct: 100,
              normalized_source_name: sourceTable,
              normalized_target_name: selectedTarget,
            },
          };
        }
        return m;
      }));
      showToast(`Successfully remapped '${sourceTable}' → '${selectedTarget}'!`);
    }
    setEditingSource(null);
  };

  const autoCount = matches.filter(m => m.decision === 'auto_matched').length;
  const reviewCount = matches.filter(m => (m.decision === 'pending' && m.score > 0) || m.decision === 'overridden').length;
  const unmatchedCount = matches.filter(m => m.score === 0 || !m.target_table).length;
  const approvedCount = matches.filter(m => m.decision === 'approved').length;

  return (
    <div className="matching-page">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className="results-toast"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p className="page-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Review the automatic table pairings between <strong>{state.source.engineLabel}</strong> and <strong>{state.target.engineLabel}</strong>. If any table is matched incorrectly or unmatched, 
        click <strong>Remap</strong> to select the target table from the dropdown.
      </motion.p>

      {/* Summary Stats */}
      <motion.div className="matching-stats" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="glass-card-static stat-card clickable" onClick={() => setFilter('all')}>
          <div className="counter-value">{matches.length}</div>
          <div className="counter-label">Total Pairs</div>
        </div>
        <div className="glass-card-static stat-card clickable" onClick={() => setFilter('auto')}>
          <div className="counter-value" style={{ color: 'var(--status-pass)' }}>{autoCount + approvedCount}</div>
          <div className="counter-label">Auto / Approved</div>
        </div>
        <div className="glass-card-static stat-card clickable" onClick={() => setFilter('review')}>
          <div className="counter-value" style={{ color: 'var(--status-warning)' }}>{reviewCount}</div>
          <div className="counter-label">Needs Review / Overrides</div>
        </div>
        <div className="glass-card-static stat-card clickable" onClick={() => setFilter('unmatched')}>
          <div className="counter-value" style={{ color: 'var(--status-fail)' }}>{unmatchedCount}</div>
          <div className="counter-label">Unmatched</div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="tabs">
        {[
          { key: 'all', label: `All (${matches.length})` },
          { key: 'auto', label: `Auto Matched (${autoCount})` },
          { key: 'review', label: `Review & Overrides (${reviewCount})` },
          { key: 'unmatched', label: `Unmatched (${unmatchedCount})` },
        ].map(t => (
          <button key={t.key} className={`tab ${filter === t.key ? 'active' : ''}`} onClick={() => setFilter(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Match Table */}
      <motion.div className="glass-card-static matching-table-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <table className="data-table matching-table">
          <thead>
            <tr>
              <th>Source Table ({state.source.engineLabel})</th>
              <th>Target Table ({state.target.engineLabel})</th>
              <th>Score</th>
              <th>Confidence</th>
              <th>Rows (S / T)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((match, i) => {
              const isEditing = editingSource === match.source_table;

              return (
                <motion.tr
                  key={match.source_table}
                  className={isEditing ? 'row-editing' : ''}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  {/* Source Table */}
                  <td>
                    <span className="table-name-cell">{match.source_table}</span>
                  </td>

                  {/* Target Table or Inline Dropdown */}
                  <td>
                    {isEditing ? (
                      <div className="inline-remap-box">
                        <select
                          className="input-field input-remap-select"
                          value={selectedTarget}
                          onChange={e => setSelectedTarget(e.target.value)}
                          autoFocus
                        >
                          <option value="">-- Unmapped / No match --</option>
                          {DEMO_TARGET_TABLES.map(t => (
                            <option key={t.table_name} value={t.table_name}>
                              {t.table_name} ({formatNumber(t.row_count)} rows)
                            </option>
                          ))}
                        </select>
                        <button
                          className="btn btn-success btn-sm btn-icon-only"
                          onClick={() => saveRemap(match.source_table)}
                          title="Save mapping"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm btn-icon-only"
                          onClick={cancelEditing}
                          title="Cancel"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="target-table-cell-wrapper">
                        {match.target_table ? (
                          <span className="table-name-cell">{match.target_table}</span>
                        ) : (
                          <span className="no-match-text">No match found</span>
                        )}
                        <button
                          className="btn-remap-trigger"
                          onClick={() => startEditing(match)}
                          title="Remap / Change Target Table"
                        >
                          <Edit3 size={12} />
                          <span>Remap</span>
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Score */}
                  <td>
                    {match.score > 0 ? (
                      <div className="score-bar compact">
                        <div className="score-bar-track">
                          <div
                            className="score-bar-fill"
                            style={{
                              width: `${match.score}%`,
                              background: `linear-gradient(90deg, #008b8b, ${confidenceColors[match.confidence]})`,
                            }}
                          />
                        </div>
                        <span className="score-bar-value" style={{ color: confidenceColors[match.confidence] }}>
                          {match.score}%
                        </span>
                      </div>
                    ) : (
                      <span className="no-match-text">—</span>
                    )}
                  </td>

                  {/* Confidence */}
                  <td>
                    <span className={`badge badge-${match.confidence.replace('_', '-')}`}>
                      {confidenceLabels[match.confidence]}
                    </span>
                  </td>

                  {/* Row Counts */}
                  <td>
                    <span className="rows-cell">
                      {formatNumber(match.source_row_count)}
                      {match.target_row_count != null && (
                        <> <span className="row-separator">/</span> {formatNumber(match.target_row_count)}</>
                      )}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td>
                    {match.decision === 'auto_matched' && <span className="badge badge-pass">Auto Matched</span>}
                    {match.decision === 'approved' && <span className="badge badge-pass">Approved</span>}
                    {match.decision === 'rejected' && <span className="badge badge-fail">Rejected</span>}
                    {match.decision === 'overridden' && <span className="badge badge-info">Manually Remapped</span>}
                    {match.decision === 'pending' && match.score > 0 && <span className="badge badge-warning">Needs Review</span>}
                    {match.decision === 'pending' && match.score === 0 && <span className="badge badge-neutral">Unmatched</span>}
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="match-actions">
                      {!isEditing && (
                        <>
                          {match.decision !== 'approved' && match.decision !== 'auto_matched' && match.target_table && (
                            <button className="btn btn-success btn-sm" onClick={() => handleDecision(match.source_table, 'approved')} title="Approve Mapping">
                              <Check size={14} />
                            </button>
                          )}
                          {match.decision !== 'rejected' && match.target_table && (
                            <button className="btn btn-danger btn-sm" onClick={() => handleDecision(match.source_table, 'rejected')} title="Reject Match">
                              <X size={14} />
                            </button>
                          )}
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => startEditing(match)}
                            title="Change Target Table"
                          >
                            <ArrowRightLeft size={13} />
                          </button>
                          {match.explanation && (
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => setExpandedRow(expandedRow === match.source_table ? null : match.source_table)}
                              title="View match explanation"
                            >
                              {expandedRow === match.source_table ? <ChevronUp size={14} /> : <Eye size={14} />}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {/* Expanded Explanation */}
        <AnimatePresence>
          {expandedRow && (
            <MatchExplanation
              explanation={matches.find(m => m.source_table === expandedRow)?.explanation}
            />
          )}
        </AnimatePresence>
      </motion.div>

      <div className="page-actions">
        <div className="page-actions-row">
          <button className="btn btn-ghost" onClick={onPrev}>← Back</button>
          <button className="btn btn-primary btn-lg" onClick={onNext}>
            Continue to Column Mapping →
          </button>
        </div>
      </div>
    </div>
  );
}
