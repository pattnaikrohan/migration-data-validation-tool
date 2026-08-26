import { useState } from 'react';
import { useAppState } from '../store/AppContext';
import { DEMO_SOURCE_TABLES, DEMO_TARGET_TABLES, DEMO_TABLE_MATCHES } from '../data/demoData';
import { Columns3, Check, X, ArrowRight, ChevronDown, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './ColumnMatching.css';

const demoColumnMatches = {
  DimDate: [
    { source: 'DateKey', target: 'DATE_KEY', score: 100, sType: 'INT', tType: 'INTEGER', status: 'PASS' },
    { source: 'FullDate', target: 'FULL_DATE', score: 100, sType: 'DATE', tType: 'DATE', status: 'PASS' },
    { source: 'DayOfWeek', target: 'DAY_OF_WEEK', score: 100, sType: 'TINYINT', tType: 'NUMBER', status: 'COMPATIBLE' },
    { source: 'DayName', target: 'DAY_NAME', score: 100, sType: 'VARCHAR', tType: 'VARCHAR', status: 'PASS' },
    { source: 'DayOfMonth', target: 'DAY_OF_MONTH', score: 100, sType: 'TINYINT', tType: 'NUMBER', status: 'COMPATIBLE' },
    { source: 'DayOfYear', target: 'DAY_OF_YEAR', score: 100, sType: 'SMALLINT', tType: 'NUMBER', status: 'COMPATIBLE' },
    { source: 'MonthNumber', target: 'MONTH_NUMBER', score: 100, sType: 'TINYINT', tType: 'NUMBER', status: 'COMPATIBLE' },
    { source: 'MonthName', target: 'MONTH_NAME', score: 100, sType: 'VARCHAR', tType: 'VARCHAR', status: 'PASS' },
    { source: 'Quarter', target: 'QUARTER', score: 100, sType: 'TINYINT', tType: 'NUMBER', status: 'COMPATIBLE' },
    { source: 'Year', target: 'YEAR', score: 100, sType: 'SMALLINT', tType: 'NUMBER', status: 'COMPATIBLE' },
    { source: 'IsWeekend', target: 'IS_WEEKEND', score: 100, sType: 'BIT', tType: 'BOOLEAN', status: 'COMPATIBLE' },
    { source: 'IsHoliday', target: 'IS_HOLIDAY', score: 100, sType: 'BIT', tType: 'BOOLEAN', status: 'COMPATIBLE' },
  ],
  DimIncoTerm: [
    { source: 'IncoTermKey', target: 'INCO_TERM_KEY', score: 100, sType: 'INT', tType: 'INTEGER', status: 'PASS' },
    { source: 'IncoTermCode', target: 'INCO_TERM_CODE', score: 100, sType: 'VARCHAR', tType: 'VARCHAR', status: 'PASS' },
    { source: 'IncoTermDescription', target: 'INCO_TERM_DESCRIPTION', score: 100, sType: 'NVARCHAR', tType: 'VARCHAR', status: 'COMPATIBLE' },
    { source: 'ResponsibilityTransfer', target: 'RESPONSIBILITY_TRANSFER', score: 100, sType: 'VARCHAR', tType: 'VARCHAR', status: 'PASS' },
    { source: 'FreightResponsibility', target: 'FREIGHT_RESPONSIBILITY', score: 100, sType: 'VARCHAR', tType: 'VARCHAR', status: 'PASS' },
    { source: 'InsuranceRequired', target: 'INSURANCE_REQUIRED', score: 100, sType: 'BIT', tType: 'BOOLEAN', status: 'COMPATIBLE' },
  ],
  DimPaymentTerm: [
    { source: 'PaymentTermKey', target: 'PAYMENT_TERM_KEY', score: 100, sType: 'INT', tType: 'INTEGER', status: 'PASS' },
    { source: 'PaymentTermCode', target: 'PAYMENT_TERM_CODE', score: 100, sType: 'VARCHAR', tType: 'VARCHAR', status: 'PASS' },
    { source: 'PaymentTermDescription', target: 'PAYMENT_TERM_DESCRIPTION', score: 100, sType: 'NVARCHAR', tType: 'VARCHAR', status: 'COMPATIBLE' },
    { source: 'DueDays', target: 'DUE_DAYS', score: 100, sType: 'INT', tType: 'NUMBER', status: 'COMPATIBLE' },
    { source: 'DiscountPercent', target: 'DISCOUNT_PERCENT', score: 100, sType: 'DECIMAL', tType: 'NUMBER', status: 'COMPATIBLE' },
    { source: 'DiscountDays', target: 'DISCOUNT_DAYS', score: 100, sType: 'INT', tType: 'NUMBER', status: 'COMPATIBLE' },
    { source: 'IsActive', target: 'IS_ACTIVE', score: 100, sType: 'BIT', tType: 'BOOLEAN', status: 'COMPATIBLE' },
  ],
  DimTime: [
    { source: 'TimeKey', target: 'TIME_KEY', score: 100, sType: 'INT', tType: 'INTEGER', status: 'PASS' },
    { source: 'Hour24', target: 'HOUR_24', score: 100, sType: 'TINYINT', tType: 'NUMBER', status: 'COMPATIBLE' },
    { source: 'Hour12', target: 'HOUR_12', score: 100, sType: 'TINYINT', tType: 'NUMBER', status: 'COMPATIBLE' },
    { source: 'Minute', target: 'MINUTE', score: 100, sType: 'TINYINT', tType: 'NUMBER', status: 'COMPATIBLE' },
    { source: 'Second', target: 'SECOND', score: 100, sType: 'TINYINT', tType: 'NUMBER', status: 'COMPATIBLE' },
    { source: 'AMPMIndicator', target: 'AMPM_INDICATOR', score: 100, sType: 'CHAR', tType: 'VARCHAR', status: 'COMPATIBLE' },
    { source: 'TimeOfDay', target: 'TIME_OF_DAY', score: 100, sType: 'VARCHAR', tType: 'VARCHAR', status: 'PASS' },
  ],
};

function getColumnsForTable(sourceTable, targetTable) {
  if (demoColumnMatches[sourceTable]) {
    return demoColumnMatches[sourceTable];
  }
  const sTableObj = DEMO_SOURCE_TABLES.find(t => t.table_name === sourceTable);
  const tTableObj = DEMO_TARGET_TABLES.find(t => t.table_name === targetTable);
  if (!sTableObj || !tTableObj) return [];

  return sTableObj.columns.map((sc, idx) => {
    const tc = tTableObj.columns[idx] || tTableObj.columns[0];
    return {
      source: sc.column_name,
      target: tc ? tc.column_name : 'UNMAPPED',
      score: tc ? 100 : 0,
      sType: sc.data_type,
      tType: tc ? tc.data_type : 'N/A',
      status: 'COMPATIBLE',
    };
  });
}

const confidenceColors = {
  very_high: 'var(--confidence-very-high)',
  high: 'var(--confidence-high)',
  medium: 'var(--confidence-medium)',
  low: 'var(--confidence-low)',
};

function getConfidence(score) {
  if (score >= 95) return 'very_high';
  if (score >= 90) return 'high';
  if (score >= 80) return 'medium';
  return 'low';
}

export default function ColumnMatching({ onNext, onPrev }) {
  const state = useAppState();
  const [expandedTable, setExpandedTable] = useState('DimDate');
  const [columnDecisions, setColumnDecisions] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const matchedTables = DEMO_TABLE_MATCHES.filter(m => m.target_table && m.score > 0);

  const handleDecision = (tableName, colSource, decision) => {
    setColumnDecisions(prev => {
      const tableDecisions = prev[tableName] || {};
      const current = tableDecisions[colSource];
      const newDecision = current === decision ? null : decision;
      return {
        ...prev,
        [tableName]: {
          ...tableDecisions,
          [colSource]: newDecision,
        },
      };
    });

    if (decision === 'approved') {
      showToast(`Column '${colSource}' approved.`);
    } else {
      showToast(`Column '${colSource}' excluded from validation.`);
    }
  };

  const handleApproveAll = (tableName, columns) => {
    setColumnDecisions(prev => {
      const newTable = {};
      columns.forEach(c => {
        newTable[c.source] = 'approved';
      });
      return {
        ...prev,
        [tableName]: newTable,
      };
    });
    showToast(`All ${columns.length} columns in '${tableName}' approved.`);
  };

  const handleResetAll = (tableName) => {
    setColumnDecisions(prev => {
      const copy = { ...prev };
      delete copy[tableName];
      return copy;
    });
    showToast(`Column decisions in '${tableName}' reset.`);
  };

  return (
    <div className="column-page">
      {/* Toast message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className="column-toast"
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
        Columns have been automatically matched between <strong>{state.source.engineLabel}</strong> and <strong>{state.target.engineLabel}</strong> for each approved table pair. Click any table row to expand 
        and review individual column mappings, data type compatibility, and match scores. You can click <strong>✓</strong> to approve or <strong>✕</strong> to exclude any column.
      </motion.p>

      <div className="column-table-list">
        {matchedTables.map((table, i) => {
          const isExpanded = expandedTable === table.source_table;
          const columns = getColumnsForTable(table.source_table, table.target_table);
          const tableDecs = columnDecisions[table.source_table] || {};
          const approvedCount = columns.filter(c => tableDecs[c.source] === 'approved').length;
          const rejectedCount = columns.filter(c => tableDecs[c.source] === 'rejected').length;
          const allApproved = approvedCount === columns.length && columns.length > 0;
          const displayScore = allApproved ? 100 : (columns.length > 0 ? (columns.reduce((s, c) => s + c.score, 0) / columns.length).toFixed(1) : 0);

          return (
            <motion.div
              key={table.source_table}
              className="glass-card-static column-table-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <button
                className="column-table-header"
                onClick={() => setExpandedTable(isExpanded ? null : table.source_table)}
              >
                <div className="column-table-info">
                  {isExpanded ? <ChevronDown size={18} className="chevron-icon" /> : <ChevronRight size={18} className="chevron-icon" />}
                  <Columns3 size={16} className="col-icon" />
                  <div className="column-table-names">
                    <span className="table-name-cell">{table.source_table}</span>
                    <ArrowRight size={12} className="arrow-icon" />
                    <span className="table-name-cell">{table.target_table}</span>
                  </div>
                </div>
                <div className="column-table-meta">
                  {approvedCount > 0 && (
                    <span className="badge badge-pass">{approvedCount} approved</span>
                  )}
                  {rejectedCount > 0 && (
                    <span className="badge badge-fail">{rejectedCount} excluded</span>
                  )}
                  <span className={`badge ${allApproved ? 'badge-pass' : `badge-${table.confidence.replace('_', '-')}`}`}>
                    {displayScore}%
                  </span>
                  <span className="col-count">
                    {columns.length} columns
                  </span>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="column-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Table-level quick actions toolbar */}
                    <div className="column-details-toolbar">
                      <span className="toolbar-info">
                        Reviewing {columns.length} column mappings for <strong>{table.source_table}</strong>
                      </span>
                      <div className="toolbar-actions">
                        <button
                          className="btn-toolbar-action btn-toolbar-approve"
                          onClick={() => handleApproveAll(table.source_table, columns)}
                          title="Approve all columns for this table"
                        >
                          <Check size={13} /> Approve All ({columns.length})
                        </button>
                        <button
                          className="btn-toolbar-action btn-toolbar-reset"
                          onClick={() => handleResetAll(table.source_table)}
                          title="Reset decisions for this table"
                        >
                          <RotateCcw size={12} /> Reset
                        </button>
                      </div>
                    </div>

                    <table className="data-table column-match-table">
                      <thead>
                        <tr>
                          <th>Source Column ({state.source.engineLabel})</th>
                          <th>Target Column ({state.target.engineLabel})</th>
                          <th>Match Score</th>
                          <th>Source Type</th>
                          <th>Target Type</th>
                          <th>Type Compatibility</th>
                          <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {columns.map((col, j) => {
                          const conf = getConfidence(col.score);
                          const dec = tableDecs[col.source];
                          const isApproved = dec === 'approved';
                          const isRejected = dec === 'rejected';

                          return (
                            <motion.tr
                              key={col.source}
                              className={`col-row ${isRejected ? 'col-row-rejected' : isApproved ? 'col-row-approved' : ''}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: j * 0.02 }}
                            >
                              <td>
                                <span className={`table-name-cell ${isRejected ? 'cell-dimmed' : ''}`}>{col.source}</span>
                              </td>
                              <td>
                                <span className={`table-name-cell ${isRejected ? 'cell-dimmed' : ''}`}>{col.target}</span>
                              </td>
                              <td>
                                <div className="score-bar compact">
                                  <div className="score-bar-track">
                                    <div className="score-bar-fill" style={{
                                      width: `${col.score}%`,
                                      background: isRejected ? '#94a3b8' : `linear-gradient(90deg, #008b8b, ${confidenceColors[conf]})`,
                                    }} />
                                  </div>
                                  <span className="score-bar-value" style={{ color: isRejected ? '#94a3b8' : confidenceColors[conf] }}>
                                    {col.score}%
                                  </span>
                                </div>
                              </td>
                              <td><span className="dtype-chip">{col.sType}</span></td>
                              <td><span className="dtype-chip">{col.tType}</span></td>
                              <td>
                                {isApproved ? (
                                  <span className="badge badge-pass">
                                    <Check size={11} /> APPROVED
                                  </span>
                                ) : isRejected ? (
                                  <span className="badge badge-fail">
                                    <X size={11} /> EXCLUDED
                                  </span>
                                ) : (
                                  <span className={`badge ${col.status === 'PASS' ? 'badge-pass' : col.status === 'COMPATIBLE' ? 'badge-info' : 'badge-warning'}`}>
                                    {col.status}
                                  </span>
                                )}
                              </td>
                              <td>
                                <div className="match-actions" style={{ justifyContent: 'center' }}>
                                  <button
                                    className={`col-action-btn col-btn-approve ${isApproved ? 'is-active' : ''}`}
                                    onClick={() => handleDecision(table.source_table, col.source, 'approved')}
                                    title={isApproved ? 'Approved — Click to toggle' : 'Approve column mapping'}
                                    aria-label="Approve"
                                  >
                                    <Check size={14} />
                                  </button>
                                  <button
                                    className={`col-action-btn col-btn-reject ${isRejected ? 'is-active' : ''}`}
                                    onClick={() => handleDecision(table.source_table, col.source, 'rejected')}
                                    title={isRejected ? 'Excluded — Click to toggle' : 'Exclude column from validation'}
                                    aria-label="Exclude"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="page-actions">
        <div className="page-actions-row">
          <button className="btn btn-ghost" onClick={onPrev}>← Back</button>
          <button className="btn btn-primary btn-lg" onClick={onNext}>
            Run Validation →
          </button>
        </div>
      </div>
    </div>
  );
}
