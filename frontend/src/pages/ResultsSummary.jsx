import { useState, useEffect } from 'react';
import { DEMO_VALIDATION_RESULTS } from '../data/demoData';
import {
  CheckCircle2, XCircle, AlertTriangle,
  FileSpreadsheet, FileText, TrendingUp, Database, Rows3,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import './ResultsSummary.css';

function AnimatedCounter({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.round(current * 10) / 10);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{typeof value === 'number' && value % 1 !== 0 ? count.toFixed(1) : Math.round(count).toLocaleString()}{suffix}</span>;
}

function formatNumber(n) {
  if (n == null) return '—';
  return n.toLocaleString();
}

const statusColors = {
  PASS: '#059669',
  FAIL: '#dc2626',
  WARNING: '#d97706',
};

const CHART_COLORS = ['#059669', '#dc2626', '#d97706', '#0284c7'];

export default function ResultsSummary({ onPrev }) {
  const results = DEMO_VALIDATION_RESULTS;
  const passed = results.filter(r => r.overall_status === 'PASS').length;
  const failed = results.filter(r => r.overall_status === 'FAIL').length;
  const warnings = results.filter(r => r.overall_status === 'WARNING').length;
  const successPct = ((passed / results.length) * 100).toFixed(1);

  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const pieData = [
    { name: 'Passed', value: passed },
    { name: 'Failed', value: failed },
    { name: 'Warning', value: warnings },
  ].filter(d => d.value > 0);

  const barData = results.map(r => ({
    name: r.source_table.replace('_', ' ').split(' ').map(w => w[0].toUpperCase()).join(''),
    fullName: r.source_table,
    matchPct: r.cell_match_percentage,
    score: r.table_match_score,
    status: r.overall_status,
  }));

  const totalSourceRows = results.reduce((s, r) => s + (r.source_count || 0), 0);
  const totalMissing = results.reduce((s, r) => s + r.missing_records, 0);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDownloadExcel = () => {
    setDownloadingExcel(true);
    showToast('Downloading Excel report (.xlsx)...');
    try {
      const filename = 'CozMatch_Validation_Report_VR-3A8F21B0.xlsx';
      const url = `/api/reports/VR-3A8F21B0/excel/${filename}`;
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Excel report (.xlsx) downloaded successfully!');
    } catch (err) {
      console.error('Error downloading Excel report:', err);
      showToast('Error downloading Excel report: ' + err.message);
    } finally {
      setTimeout(() => setDownloadingExcel(false), 500);
    }
  };

  const handleDownloadPDF = () => {
    setDownloadingPDF(true);
    showToast('Downloading PDF audit report (.pdf)...');
    try {
      const filename = 'CozMatch_Validation_Audit_VR-3A8F21B0.pdf';
      const url = `/api/reports/VR-3A8F21B0/pdf/${filename}`;
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Executive PDF audit report (.pdf) downloaded successfully!');
    } catch (err) {
      console.error('Error downloading PDF report:', err);
      showToast('Error downloading PDF report: ' + err.message);
    } finally {
      setTimeout(() => setDownloadingPDF(false), 500);
    }
  };

  return (
    <div className="results-page">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className="results-toast"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header & Download Action Bar */}
      <div className="results-header-bar">
        <div className="results-header-text">
          <p className="page-description">
            Validation run completed. Review the executive summary, table-level results, 
            and download audit reports.
          </p>
          <span className="results-run-badge">Run ID: VR-3A8F21B0</span>
        </div>
        <div className="results-header-actions">
          <button
            className="btn btn-secondary btn-md"
            onClick={handleDownloadExcel}
            disabled={downloadingExcel}
          >
            {downloadingExcel ? <Loader2 size={16} className="spin" /> : <FileSpreadsheet size={16} />}
            Download Excel (.xlsx)
          </button>
          <button
            className="btn btn-primary btn-md"
            onClick={handleDownloadPDF}
            disabled={downloadingPDF}
          >
            {downloadingPDF ? <Loader2 size={16} className="spin" /> : <FileText size={16} />}
            Download PDF Report (.pdf)
          </button>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <motion.div
        className="exec-summary"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="glass-card-static stat-card highlight-card">
          <div className="stat-icon"><TrendingUp size={18} /></div>
          <div className="counter-value"><AnimatedCounter value={parseFloat(successPct)} suffix="%" /></div>
          <div className="counter-label">Overall Success</div>
        </div>
        <div className="glass-card-static stat-card">
          <div className="stat-icon pass-icon"><CheckCircle2 size={18} /></div>
          <div className="counter-value" style={{ color: 'var(--status-pass)' }}><AnimatedCounter value={passed} /></div>
          <div className="counter-label">Tables Passed</div>
        </div>
        <div className="glass-card-static stat-card">
          <div className="stat-icon fail-icon"><XCircle size={18} /></div>
          <div className="counter-value" style={{ color: 'var(--status-fail)' }}><AnimatedCounter value={failed} /></div>
          <div className="counter-label">Tables Failed</div>
        </div>
        <div className="glass-card-static stat-card">
          <div className="stat-icon warn-icon"><AlertTriangle size={18} /></div>
          <div className="counter-value" style={{ color: 'var(--status-warning)' }}><AnimatedCounter value={warnings} /></div>
          <div className="counter-label">Warnings</div>
        </div>
        <div className="glass-card-static stat-card">
          <div className="stat-icon"><Rows3 size={18} /></div>
          <div className="counter-value"><AnimatedCounter value={totalSourceRows} /></div>
          <div className="counter-label">Rows Validated</div>
        </div>
        <div className="glass-card-static stat-card">
          <div className="stat-icon fail-icon"><Database size={18} /></div>
          <div className="counter-value" style={{ color: totalMissing > 0 ? 'var(--status-fail)' : 'var(--status-pass)' }}>
            <AnimatedCounter value={totalMissing} />
          </div>
          <div className="counter-label">Missing Records</div>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="charts-row">
        <motion.div
          className="glass-card-static chart-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4>Validation Distribution</h4>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={entry.name} fill={CHART_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#0f172a',
                    fontSize: '0.8rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              {pieData.map((entry, i) => (
                <div key={entry.name} className="legend-item">
                  <div className="legend-dot" style={{ background: CHART_COLORS[i] }} />
                  <span>{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card-static chart-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h4>Cell Match Percentage by Table</h4>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <YAxis domain={[99.5, 100.05]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#0f172a',
                    fontSize: '0.8rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  formatter={(value) => [`${value}%`, 'Match %']}
                  labelFormatter={(label) => barData.find(d => d.name === label)?.fullName || label}
                />
                <Bar dataKey="matchPct" radius={[4, 4, 0, 0]}>
                  {barData.map((entry) => (
                    <Cell key={entry.name} fill={statusColors[entry.status] || '#00afaf'} fillOpacity={0.9} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Detailed Table Results */}
      <motion.div
        className="glass-card-static results-table-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="results-table-header">
          <h4>Table-Level Results</h4>
        </div>
        <table className="data-table results-table">
          <thead>
            <tr>
              <th>Source Table</th>
              <th>Target Table</th>
              <th>Match Score</th>
              <th>Data Types</th>
              <th>Source Count</th>
              <th>Target Count</th>
              <th>Missing</th>
              <th>Cell Match %</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, i) => (
              <motion.tr
                key={row.source_table}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.04 }}
              >
                <td><span className="table-name-cell">{row.source_table}</span></td>
                <td><span className="table-name-cell">{row.target_table}</span></td>
                <td>
                  <div className="score-bar compact">
                    <div className="score-bar-track">
                      <div className="score-bar-fill" style={{
                        width: `${row.table_match_score}%`,
                        background: `linear-gradient(90deg, #008b8b, #00afaf)`,
                      }} />
                    </div>
                    <span className="score-bar-value">{row.table_match_score}%</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${row.data_type_status === 'PASS' ? 'badge-pass' : 'badge-warning'}`}>
                    {row.data_type_status}
                  </span>
                </td>
                <td className="mono-cell">{formatNumber(row.source_count)}</td>
                <td className="mono-cell">{formatNumber(row.target_count)}</td>
                <td>
                  <span className={row.missing_records > 0 ? 'text-fail' : 'text-pass'}>
                    {row.missing_records}
                  </span>
                </td>
                <td>
                  <span className="cell-match-value" style={{
                    color: row.cell_match_percentage === 100 ? 'var(--status-pass)' :
                           row.cell_match_percentage >= 99.9 ? 'var(--teal-700)' : 'var(--status-warning)',
                  }}>
                    {row.cell_match_percentage}%
                  </span>
                </td>
                <td>
                  <span className={`badge ${
                    row.overall_status === 'PASS' ? 'badge-pass' :
                    row.overall_status === 'FAIL' ? 'badge-fail' : 'badge-warning'
                  }`}>
                    {row.overall_status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Bottom Export Row */}
      <motion.div
        className="export-row"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          className="btn btn-secondary btn-lg"
          onClick={handleDownloadExcel}
          disabled={downloadingExcel}
        >
          {downloadingExcel ? <Loader2 size={18} className="spin" /> : <FileSpreadsheet size={18} />}
          Download Excel Report (.xlsx)
        </button>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleDownloadPDF}
          disabled={downloadingPDF}
        >
          {downloadingPDF ? <Loader2 size={18} className="spin" /> : <FileText size={18} />}
          Download PDF Audit Report (.pdf)
        </button>
      </motion.div>

      <div className="page-actions">
        <div className="page-actions-row">
          <button className="btn btn-ghost" onClick={onPrev}>← Back</button>
          <span className="results-run-id">Validation Run ID: VR-3A8F21B0</span>
        </div>
      </div>
    </div>
  );
}
