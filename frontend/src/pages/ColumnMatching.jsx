import { useState } from 'react';
import { useAppState } from '../store/AppContext';
import { DEMO_SOURCE_TABLES, DEMO_TARGET_TABLES, DEMO_TABLE_MATCHES } from '../data/demoData';
import { Columns3, Check, X, ArrowRight, ChevronDown, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './ColumnMatching.css';

const demoColumnMatches = {
  customer_master: [
    { source: 'customer_id', target: 'CUSTOMER_ID', score: 100, sType: 'INT', tType: 'INTEGER', status: 'PASS' },
    { source: 'customer_name', target: 'CUSTOMER_NAME', score: 100, sType: 'NVARCHAR', tType: 'VARCHAR', status: 'COMPATIBLE' },
    { source: 'customer_type', target: 'CUSTOMER_TYPE', score: 100, sType: 'VARCHAR', tType: 'VARCHAR', status: 'PASS' },
    { source: 'email', target: 'EMAIL_ADDRESS', score: 86.5, sType: 'NVARCHAR', tType: 'VARCHAR', status: 'COMPATIBLE' },
    { source: 'phone', target: 'PHONE_NUMBER', score: 82.3, sType: 'VARCHAR', tType: 'VARCHAR', status: 'PASS' },
    { source: 'created_date', target: 'CREATED_TIMESTAMP', score: 88.1, sType: 'DATETIME', tType: 'TIMESTAMP_NTZ', status: 'COMPATIBLE' },
    { source: 'modified_date', target: 'MODIFIED_TIMESTAMP', score: 87.4, sType: 'DATETIME', tType: 'TIMESTAMP_NTZ', status: 'COMPATIBLE' },
    { source: 'status_cd', target: 'STATUS_CODE', score: 91.2, sType: 'VARCHAR', tType: 'VARCHAR', status: 'PASS' },
  ],
  shipment_hdr: [
    { source: 'shipment_id', target: 'SHIPMENT_ID', score: 100, sType: 'INT', tType: 'INTEGER', status: 'PASS' },
    { source: 'order_id', target: 'ORDER_ID', score: 100, sType: 'INT', tType: 'INTEGER', status: 'PASS' },
    { source: 'ship_date', target: 'SHIP_DATE', score: 100, sType: 'DATETIME', tType: 'TIMESTAMP_NTZ', status: 'COMPATIBLE' },
    { source: 'carrier_cd', target: 'CARRIER_CODE', score: 92.5, sType: 'VARCHAR', tType: 'VARCHAR', status: 'PASS' },
    { source: 'tracking_no', target: 'TRACKING_NUMBER', score: 91.8, sType: 'VARCHAR', tType: 'VARCHAR', status: 'PASS' },
    { source: 'ship_addr', target: 'SHIPPING_ADDRESS', score: 85.3, sType: 'NVARCHAR', tType: 'VARCHAR', status: 'COMPATIBLE' },
  ],
  invoice_dtl: [
    { source: 'invoice_id', target: 'INVOICE_ID', score: 100, sType: 'INT', tType: 'INTEGER', status: 'PASS' },
    { source: 'line_no', target: 'LINE_NUMBER', score: 94.2, sType: 'INT', tType: 'INTEGER', status: 'PASS' },
    { source: 'product_cd', target: 'PRODUCT_CODE', score: 93.1, sType: 'VARCHAR', tType: 'VARCHAR', status: 'PASS' },
    { source: 'qty', target: 'QUANTITY', score: 91.5, sType: 'DECIMAL', tType: 'NUMBER', status: 'COMPATIBLE' },
    { source: 'unit_price', target: 'UNIT_PRICE', score: 100, sType: 'MONEY', tType: 'NUMBER', status: 'COMPATIBLE' },
    { source: 'line_amt', target: 'LINE_AMOUNT', score: 94.8, sType: 'MONEY', tType: 'NUMBER', status: 'COMPATIBLE' },
    { source: 'tax_amt', target: 'TAX_AMOUNT', score: 93.6, sType: 'MONEY', tType: 'NUMBER', status: 'COMPATIBLE' },
  ],
  sales_orders: [
    { source: 'order_id', target: 'ORDER_ID', score: 100, sType: 'INT', tType: 'INTEGER', status: 'PASS' },
    { source: 'cust_id', target: 'CUSTOMER_ID', score: 89.4, sType: 'INT', tType: 'INTEGER', status: 'PASS' },
    { source: 'order_dt', target: 'ORDER_DATE', score: 92.1, sType: 'DATETIME', tType: 'TIMESTAMP_NTZ', status: 'COMPATIBLE' },
    { source: 'total_amt', target: 'TOTAL_AMOUNT', score: 95.3, sType: 'MONEY', tType: 'NUMBER', status: 'COMPATIBLE' },
    { source: 'status', target: 'ORDER_STATUS', score: 88.5, sType: 'VARCHAR', tType: 'VARCHAR', status: 'PASS' },
  ],
  employee_master: [
    { source: 'emp_id', target: 'EMPLOYEE_ID', score: 91.3, sType: 'INT', tType: 'INTEGER', status: 'PASS' },
    { source: 'emp_name', target: 'EMPLOYEE_NAME', score: 92.6, sType: 'NVARCHAR', tType: 'VARCHAR', status: 'COMPATIBLE' },
    { source: 'dept_cd', target: 'DEPARTMENT_CODE', score: 90.1, sType: 'VARCHAR', tType: 'VARCHAR', status: 'PASS' },
    { source: 'hire_dt', target: 'HIRE_DATE', score: 93.4, sType: 'DATE', tType: 'DATE', status: 'PASS' },
    { source: 'mgr_id', target: 'MANAGER_ID', score: 88.7, sType: 'INT', tType: 'INTEGER', status: 'PASS' },
    { source: 'salary', target: 'SALARY', score: 100, sType: 'DECIMAL', tType: 'NUMBER', status: 'COMPATIBLE' },
  ],
  product_catalog: [
    { source: 'product_id', target: 'PRODUCT_ID', score: 100, sType: 'INT', tType: 'INTEGER', status: 'PASS' },
    { source: 'product_name', target: 'PRODUCT_NAME', score: 100, sType: 'NVARCHAR', tType: 'VARCHAR', status: 'COMPATIBLE' },
    { source: 'category', target: 'CATEGORY', score: 100, sType: 'VARCHAR', tType: 'VARCHAR', status: 'PASS' },
    { source: 'list_price', target: 'LIST_PRICE', score: 100, sType: 'MONEY', tType: 'NUMBER', status: 'COMPATIBLE' },
    { source: 'active_flg', target: 'IS_ACTIVE', score: 82.5, sType: 'BIT', tType: 'BOOLEAN', status: 'COMPATIBLE' },
  ],
  payment_txn: [
    { source: 'txn_id', target: 'PAYMENT_ID', score: 89.5, sType: 'INT', tType: 'INTEGER', status: 'PASS' },
    { source: 'order_id', target: 'ORDER_ID', score: 100, sType: 'INT', tType: 'INTEGER', status: 'PASS' },
    { source: 'txn_amt', target: 'AMOUNT', score: 88.2, sType: 'MONEY', tType: 'NUMBER', status: 'COMPATIBLE' },
    { source: 'txn_dt', target: 'TRANSACTION_DATE', score: 91.7, sType: 'DATETIME', tType: 'TIMESTAMP_NTZ', status: 'COMPATIBLE' },
    { source: 'payment_method', target: 'PAYMENT_METHOD', score: 100, sType: 'VARCHAR', tType: 'VARCHAR', status: 'PASS' },
  ],
  order_history: [
    { source: 'history_id', target: 'HISTORY_ID', score: 100, sType: 'BIGINT', tType: 'INTEGER', status: 'COMPATIBLE' },
    { source: 'order_id', target: 'ORDER_ID', score: 100, sType: 'INT', tType: 'INTEGER', status: 'PASS' },
    { source: 'event_type', target: 'EVENT_TYPE', score: 100, sType: 'VARCHAR', tType: 'VARCHAR', status: 'PASS' },
    { source: 'event_dt', target: 'EVENT_TIMESTAMP', score: 90.0, sType: 'DATETIME2', tType: 'TIMESTAMP_NTZ', status: 'COMPATIBLE' },
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
      score: tc ? 90 : 0,
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
  const [expandedTable, setExpandedTable] = useState('customer_master');
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
          const avgScore = columns.length > 0 ? (columns.reduce((s, c) => s + c.score, 0) / columns.length).toFixed(1) : 0;

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
                  <span className={`badge badge-${table.confidence.replace('_', '-')}`}>
                    {table.score}%
                  </span>
                  <span className="col-count">
                    {columns.length} columns
                  </span>
                  <span className="col-avg-score">Avg: {avgScore}%</span>
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
