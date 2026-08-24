import { useState, useEffect } from 'react';
import { useAppState, useAppDispatch } from '../store/AppContext';
import { DEMO_SOURCE_TABLES, DEMO_TARGET_TABLES } from '../data/demoData';
import { Table2, Columns3, Key, Hash, Search, Server, Snowflake, Database, Layers, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import './TableDiscovery.css';

const ENGINE_ICONS = {
  snowflake: Snowflake,
  sql_server: Server,
  postgresql: Database,
  mysql: Database,
  oracle: Database,
  databricks: Layers,
};

function formatNumber(n) {
  if (n == null) return '—';
  return n.toLocaleString();
}

function TableList({ tables, title, subtitle, icon: Icon, delay = 0 }) {
  const [search, setSearch] = useState('');
  const filtered = tables.filter(t =>
    t.table_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="glass-card-static discovery-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="discovery-panel-header">
        <div className="connection-icon" style={{ background: 'rgba(0, 175, 175, 0.08)', color: 'var(--teal-600)' }}>
          <Icon size={18} />
        </div>
        <div>
          <h3>{title}</h3>
          <span className="discovery-count">{subtitle || `${tables.length} tables discovered`}</span>
        </div>
      </div>

      <div className="search-container">
        <Search size={14} className="search-icon" />
        <input
          className="input-field"
          placeholder="Filter tables..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="discovery-table-list">
        {filtered.map((table, i) => (
          <motion.div
            key={table.table_name}
            className="discovery-table-item"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + i * 0.03 }}
          >
            <div className="table-item-header">
              <Table2 size={14} className="table-item-icon" />
              <span className="table-item-name">{table.table_name}</span>
            </div>
            <div className="table-item-meta">
              <span className="meta-chip">
                <Hash size={11} /> {formatNumber(table.row_count)} rows
              </span>
              <span className="meta-chip">
                <Columns3 size={11} /> {table.columns.length} cols
              </span>
              {table.primary_keys.length > 0 && (
                <span className="meta-chip pk">
                  <Key size={11} /> {table.primary_keys.join(', ')}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function TableDiscovery({ onNext, onPrev }) {
  const state = useAppState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch({ type: 'SET_SOURCE_TABLES', payload: DEMO_SOURCE_TABLES });
    dispatch({ type: 'SET_TARGET_TABLES', payload: DEMO_TARGET_TABLES });
  }, [dispatch]);

  const totalSourceRows = DEMO_SOURCE_TABLES.reduce((s, t) => s + (t.row_count || 0), 0);
  const totalTargetRows = DEMO_TARGET_TABLES.reduce((s, t) => s + (t.row_count || 0), 0);

  const SourceIcon = ENGINE_ICONS[state.source.engine] || Database;
  const TargetIcon = ENGINE_ICONS[state.target.engine] || Database;

  return (
    <div className="discovery-page">
      <motion.p className="page-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Both catalogs (<strong>{state.source.engineLabel}</strong>: <code>{state.source.selectedDatabase || 'DB'}.{state.source.selectedSchema || 'SCHEMA'}</code> and <strong>{state.target.engineLabel}</strong>: <code>{state.target.selectedDatabase || 'DB'}.{state.target.selectedSchema || 'SCHEMA'}</code>) have been scanned. Review the discovered tables below.
      </motion.p>

      {/* Stats */}
      <motion.div
        className="discovery-stats"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="glass-card-static stat-card">
          <div className="counter-value">{DEMO_SOURCE_TABLES.length}</div>
          <div className="counter-label">{state.source.engineLabel} Tables</div>
        </div>
        <div className="glass-card-static stat-card">
          <div className="counter-value">{DEMO_TARGET_TABLES.length}</div>
          <div className="counter-label">{state.target.engineLabel} Tables</div>
        </div>
        <div className="glass-card-static stat-card">
          <div className="counter-value">{formatNumber(totalSourceRows)}</div>
          <div className="counter-label">Source Rows</div>
        </div>
        <div className="glass-card-static stat-card">
          <div className="counter-value">{formatNumber(totalTargetRows)}</div>
          <div className="counter-label">Target Rows</div>
        </div>
      </motion.div>

      {/* Table Lists */}
      <div className="discovery-grid">
        <TableList
          tables={DEMO_SOURCE_TABLES}
          title={`${state.source.engineLabel} Tables`}
          subtitle={`${state.source.selectedDatabase || 'Source DB'}.${state.source.selectedSchema || 'schema'} • ${DEMO_SOURCE_TABLES.length} tables`}
          icon={SourceIcon}
          delay={0.2}
        />
        <div className="discovery-arrow"><ArrowRight size={24} /></div>
        <TableList
          tables={DEMO_TARGET_TABLES}
          title={`${state.target.engineLabel} Tables`}
          subtitle={`${state.target.selectedDatabase || 'Target DB'}.${state.target.selectedSchema || 'schema'} • ${DEMO_TARGET_TABLES.length} tables`}
          icon={TargetIcon}
          delay={0.3}
        />
      </div>

      <div className="page-actions">
        <div className="page-actions-row">
          <button className="btn btn-ghost" onClick={onPrev}>← Back</button>
          <button className="btn btn-primary btn-lg" onClick={onNext}>
            Run Automatic Matching →
          </button>
        </div>
      </div>
    </div>
  );
}
