import { useState, useEffect } from 'react';
import { useAppState, useAppDispatch } from '../store/AppContext';
import { Database, ArrowRight, Server, Snowflake, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import './SchemaSelection.css';

const ENGINE_ICONS = {
  snowflake: Snowflake,
  sql_server: Server,
  postgresql: Database,
  mysql: Database,
  oracle: Database,
  databricks: Layers,
};

export default function SchemaSelection({ onNext, onPrev }) {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const [sourceDb, setSourceDb] = useState(state.source.selectedDatabase || state.source.databases[0] || '');
  const [sourceSchema, setSourceSchema] = useState(state.source.selectedSchema || state.source.schemas[0] || '');

  const [targetDb, setTargetDb] = useState(state.target.selectedDatabase || state.target.databases[0] || '');
  const [targetSchema, setTargetSchema] = useState(state.target.selectedSchema || state.target.schemas[0] || '');

  const sourceDatabases = state.source.databases.length > 0 ? state.source.databases : ['AdventureWorks', 'SalesDB', 'HR_Database'];
  const targetDatabases = state.target.databases.length > 0 ? state.target.databases : ['PRODUCTION_DW', 'ANALYTICS_DB', 'RAW_DATA'];
  const sourceSchemas = state.source.schemas.length > 0 ? state.source.schemas : ['dbo', 'sales', 'hr', 'production'];
  const targetSchemas = state.target.schemas.length > 0 ? state.target.schemas : ['PUBLIC', 'ANALYTICS', 'RAW', 'STAGING'];

  useEffect(() => {
    if (!sourceDb && sourceDatabases.length > 0) setSourceDb(sourceDatabases[0]);
    if (!sourceSchema && sourceSchemas.length > 0) setSourceSchema(sourceSchemas[0]);
    if (!targetDb && targetDatabases.length > 0) setTargetDb(targetDatabases.length > 1 ? targetDatabases[1] : targetDatabases[0]);
    if (!targetSchema && targetSchemas.length > 0) setTargetSchema(targetSchemas[0]);
  }, [state.source.engine, state.target.engine]);

  const handleContinue = () => {
    dispatch({
      type: 'SET_SOURCE',
      payload: { selectedDatabase: sourceDb, selectedSchema: sourceSchema },
    });
    dispatch({
      type: 'SET_TARGET',
      payload: { selectedDatabase: targetDb, selectedSchema: targetSchema },
    });
    onNext();
  };

  const canContinue = sourceDb && sourceSchema && targetDb && targetSchema;

  const SourceIcon = ENGINE_ICONS[state.source.engine] || Database;
  const TargetIcon = ENGINE_ICONS[state.target.engine] || Database;

  return (
    <div className="schema-page">
      <motion.p
        className="page-description"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Select the source database and schema from <strong>{state.source.engineLabel}</strong>, and the target database and schema 
        from <strong>{state.target.engineLabel}</strong>. Tables will be automatically discovered from both catalogs.
      </motion.p>

      <div className="schema-selection-container">
        {/* Source Card */}
        <motion.div
          className="glass-card-static schema-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="schema-card-header">
            <div className="connection-icon" style={{ background: 'rgba(0, 175, 175, 0.08)', color: 'var(--teal-600)' }}>
              <SourceIcon size={20} />
            </div>
            <div>
              <h3>Source — {state.source.engineLabel}</h3>
              <span className="schema-card-sub">Select origin database & schema</span>
            </div>
          </div>
          <div className="schema-selectors">
            <div className="input-group">
              <label className="input-label">Database</label>
              <select className="input-field" value={sourceDb} onChange={e => setSourceDb(e.target.value)}>
                <option value="">Select database...</option>
                {sourceDatabases.map(db => <option key={db} value={db}>{db}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Schema</label>
              <select className="input-field" value={sourceSchema} onChange={e => setSourceSchema(e.target.value)} disabled={!sourceDb}>
                <option value="">Select schema...</option>
                {sourceSchemas.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {sourceDb && sourceSchema && (
            <motion.div className="schema-preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Database size={14} />
              <span>{sourceDb}.{sourceSchema}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Arrow */}
        <motion.div
          className="schema-arrow"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <ArrowRight size={24} />
        </motion.div>

        {/* Target Card */}
        <motion.div
          className="glass-card-static schema-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="schema-card-header">
            <div className="connection-icon" style={{ background: 'rgba(0, 175, 175, 0.08)', color: 'var(--teal-600)' }}>
              <TargetIcon size={20} />
            </div>
            <div>
              <h3>Target — {state.target.engineLabel}</h3>
              <span className="schema-card-sub">Select destination database & schema</span>
            </div>
          </div>
          <div className="schema-selectors">
            <div className="input-group">
              <label className="input-label">Database</label>
              <select className="input-field" value={targetDb} onChange={e => setTargetDb(e.target.value)}>
                <option value="">Select database...</option>
                {targetDatabases.map(db => <option key={db} value={db}>{db}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Schema</label>
              <select className="input-field" value={targetSchema} onChange={e => setTargetSchema(e.target.value)} disabled={!targetDb}>
                <option value="">Select schema...</option>
                {targetSchemas.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {targetDb && targetSchema && (
            <motion.div className="schema-preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Database size={14} />
              <span>{targetDb}.{targetSchema}</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="page-actions">
        <div className="page-actions-row">
          <button className="btn btn-ghost" onClick={onPrev}>← Back</button>
          <button className="btn btn-primary btn-lg" onClick={handleContinue} disabled={!canContinue}>
            Discover Tables →
          </button>
        </div>
      </div>
    </div>
  );
}
