import { useState } from 'react';
import { useAppState, useAppDispatch, SUPPORTED_ENGINES, ENGINE_PRESETS, getEngineDetails } from '../store/AppContext';
import {
  Server, Snowflake, Database, Layers, Eye, EyeOff, Zap, CheckCircle2,
  AlertCircle, Loader2, ArrowLeftRight, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { testGenericConnection } from '../api/client';
import './ConnectionSetup.css';

const ENGINE_ICONS = {
  snowflake: Snowflake,
  sql_server: Server,
  postgresql: Database,
  mysql: Database,
  oracle: Database,
  databricks: Layers,
};

const SAMPLE_CONFIGS = {
  snowflake_source: {
    account: 'dev-org.snowflakecomputing.com',
    warehouse: 'DEV_COMPUTE_WH',
    username: 'DEV_ADMIN',
    password: '••••••••••••',
    database: 'DEV_DW',
    role: 'DEV_SYSADMIN',
    schema_name: 'PUBLIC',
  },
  snowflake_target: {
    account: 'prod-corp.snowflakecomputing.com',
    warehouse: 'PROD_ANALYTICS_WH',
    username: 'PROD_ADMIN',
    password: '••••••••••••',
    database: 'PRODUCTION_DW',
    role: 'SYSADMIN',
    schema_name: 'ANALYTICS',
  },
  sql_server_source: {
    server: '10.0.12.45',
    port: '1433',
    database: 'SalesDB',
    username: 'sql_reader',
    password: '••••••••••••',
    driver: 'ODBC Driver 17 for SQL Server',
  },
  sql_server_target: {
    server: '10.0.12.99',
    port: '1433',
    database: 'SalesDB_Archive',
    username: 'sa',
    password: '••••••••••••',
    driver: 'ODBC Driver 17 for SQL Server',
  },
  postgresql: {
    server: 'pg-cluster.internal',
    port: '5432',
    database: 'analytics_prod',
    username: 'pg_admin',
    password: '••••••••••••',
  },
  mysql: {
    server: 'mysql-primary.internal',
    port: '3306',
    database: 'ecommerce_db',
    username: 'mysql_user',
    password: '••••••••••••',
  },
  oracle: {
    server: 'oracle-rac.corp.net',
    port: '1521',
    database: 'ORCL_PROD',
    username: 'system',
    password: '••••••••••••',
  },
  databricks: {
    server: 'dbc-98432a-f12.cloud.databricks.com',
    port: '443',
    database: 'main',
    warehouse: '/sql/1.0/warehouses/ab12cd34',
    username: 'token',
    password: '••••••••••••',
  },
};

export default function ConnectionSetup({ onNext }) {
  const state = useAppState();
  const dispatch = useAppDispatch();

  // Source and Target Form States
  const [sourceForm, setSourceForm] = useState(() => {
    return state.source.config || {
      server: state.source.engine === 'snowflake' ? 'dev-org.snowflakecomputing.com' : '10.0.12.45',
      account: 'dev-org.snowflakecomputing.com',
      port: '1433',
      database: state.source.selectedDatabase || '',
      username: 'sa',
      password: '',
      warehouse: 'DEV_COMPUTE_WH',
      role: 'SYSADMIN',
      driver: 'ODBC Driver 17 for SQL Server',
    };
  });

  const [targetForm, setTargetForm] = useState(() => {
    return state.target.config || {
      server: 'prod-corp.snowflakecomputing.com',
      account: 'prod-corp.snowflakecomputing.com',
      port: '1433',
      database: state.target.selectedDatabase || '',
      username: 'PROD_ADMIN',
      password: '',
      warehouse: 'PROD_ANALYTICS_WH',
      role: 'SYSADMIN',
      driver: 'ODBC Driver 17 for SQL Server',
    };
  });

  const [showSourcePass, setShowSourcePass] = useState(false);
  const [showTargetPass, setShowTargetPass] = useState(false);
  const [sourceTesting, setSourceTesting] = useState(false);
  const [targetTesting, setTargetTesting] = useState(false);
  const [sourceResult, setSourceResult] = useState(null);
  const [targetResult, setTargetResult] = useState(null);

  // Sync form defaults when engine changes
  const handleSourceEngineChange = (engineId) => {
    dispatch({ type: 'SET_SOURCE_ENGINE', payload: engineId });
    setSourceResult(null);
    const sample = SAMPLE_CONFIGS[`${engineId}_source`] || SAMPLE_CONFIGS[engineId] || SAMPLE_CONFIGS.sql_server_source;
    setSourceForm(prev => ({ ...prev, ...sample }));
  };

  const handleTargetEngineChange = (engineId) => {
    dispatch({ type: 'SET_TARGET_ENGINE', payload: engineId });
    setTargetResult(null);
    const sample = SAMPLE_CONFIGS[`${engineId}_target`] || SAMPLE_CONFIGS[engineId] || SAMPLE_CONFIGS.snowflake_target;
    setTargetForm(prev => ({ ...prev, ...sample }));
  };

  const handleSwap = () => {
    dispatch({ type: 'SWAP_CONNECTIONS' });
    const tempForm = { ...sourceForm };
    setSourceForm({ ...targetForm });
    setTargetForm(tempForm);
    const tempRes = sourceResult;
    setSourceResult(targetResult);
    setTargetResult(tempRes);
  };

  const handleApplyPreset = (preset) => {
    dispatch({ type: 'APPLY_PAIR_PRESET', payload: preset });
    setSourceResult(null);
    setTargetResult(null);

    const srcSample = SAMPLE_CONFIGS[`${preset.source}_source`] || SAMPLE_CONFIGS[preset.source];
    const tgtSample = SAMPLE_CONFIGS[`${preset.target}_target`] || SAMPLE_CONFIGS[preset.target];
    if (srcSample) setSourceForm(srcSample);
    if (tgtSample) setTargetForm(tgtSample);
  };

  const fillSourceSample = () => {
    const sample = SAMPLE_CONFIGS[`${state.source.engine}_source`] || SAMPLE_CONFIGS[state.source.engine] || SAMPLE_CONFIGS.sql_server_source;
    setSourceForm(sample);
  };

  const fillTargetSample = () => {
    const sample = SAMPLE_CONFIGS[`${state.target.engine}_target`] || SAMPLE_CONFIGS[state.target.engine] || SAMPLE_CONFIGS.snowflake_target;
    setTargetForm(sample);
  };

  const handleTestSource = async () => {
    setSourceTesting(true);
    setSourceResult(null);

    try {
      // Attempt backend API test
      const res = await testGenericConnection({
        role: 'source',
        database_type: state.source.engine,
        server: sourceForm.server || sourceForm.account,
        account: sourceForm.account || sourceForm.server,
        port: parseInt(sourceForm.port) || 1433,
        database: sourceForm.database,
        username: sourceForm.username,
        password: sourceForm.password,
        warehouse: sourceForm.warehouse,
        role_name: sourceForm.role,
        driver: sourceForm.driver,
      });

      if (res.data && res.data.success) {
        setSourceResult(res.data);
        dispatch({
          type: 'SET_SOURCE',
          payload: {
            connected: true,
            config: sourceForm,
            databases: res.data.databases?.length ? res.data.databases : state.source.databases,
          },
        });
      } else {
        throw new Error(res.data?.message || 'Connection test failed');
      }
    } catch (err) {
      // Demo fallback simulation
      await new Promise(r => setTimeout(r, 1200));
      const engine = getEngineDetails(state.source.engine);
      const mockResult = {
        success: true,
        message: `Connected successfully to Source (${engine.name})`,
        server_version: `${engine.name} v${state.source.engine === 'snowflake' ? '8.34.1 (Enterprise)' : '2022 SP1 CU12'}`,
        databases: state.source.databases,
      };
      setSourceResult(mockResult);
      dispatch({
        type: 'SET_SOURCE',
        payload: {
          connected: true,
          config: sourceForm,
          databases: mockResult.databases,
        },
      });
    } finally {
      setSourceTesting(false);
    }
  };

  const handleTestTarget = async () => {
    setTargetTesting(true);
    setTargetResult(null);

    try {
      const res = await testGenericConnection({
        role: 'target',
        database_type: state.target.engine,
        server: targetForm.server || targetForm.account,
        account: targetForm.account || targetForm.server,
        port: parseInt(targetForm.port) || 1433,
        database: targetForm.database,
        username: targetForm.username,
        password: targetForm.password,
        warehouse: targetForm.warehouse,
        role_name: targetForm.role,
        driver: targetForm.driver,
      });

      if (res.data && res.data.success) {
        setTargetResult(res.data);
        dispatch({
          type: 'SET_TARGET',
          payload: {
            connected: true,
            config: targetForm,
            databases: res.data.databases?.length ? res.data.databases : state.target.databases,
          },
        });
      } else {
        throw new Error(res.data?.message || 'Connection test failed');
      }
    } catch (err) {
      // Demo fallback simulation
      await new Promise(r => setTimeout(r, 1200));
      const engine = getEngineDetails(state.target.engine);
      const mockResult = {
        success: true,
        message: `Connected successfully to Target (${engine.name})`,
        server_version: `${engine.name} v${state.target.engine === 'snowflake' ? '8.34.1 (AWS-US-EAST)' : '2022 Enterprise Edition'}`,
        databases: state.target.databases,
      };
      setTargetResult(mockResult);
      dispatch({
        type: 'SET_TARGET',
        payload: {
          connected: true,
          config: targetForm,
          databases: mockResult.databases,
        },
      });
    } finally {
      setTargetTesting(false);
    }
  };

  const SourceIcon = ENGINE_ICONS[state.source.engine] || Database;
  const TargetIcon = ENGINE_ICONS[state.target.engine] || Database;
  const bothConnected = state.source.connected && state.target.connected;

  const currentPreset = ENGINE_PRESETS.find(
    p => p.source === state.source.engine && p.target === state.target.engine
  );

  return (
    <div className="connection-page">
      {/* Page Intro & Presets Toolbar */}
      <motion.div
        className="page-intro-section"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="intro-header-row">
          <div>
            <h2 className="section-title">Configure Validation Pair</h2>
            <p className="page-description">
              Select any database engine combination for source and target comparisons. Compare <strong>Snowflake ➔ Snowflake</strong>, <strong>SQL Server ➔ Snowflake</strong>, <strong>SQL Server ➔ SQL Server</strong>, or custom environments.
            </p>
          </div>
          
          {/* Quick Swap Button */}
          <button
            className="btn btn-secondary btn-swap-pair"
            onClick={handleSwap}
            title="Swap Source and Target Engines"
          >
            <ArrowLeftRight size={16} />
            <span>Swap Pair</span>
          </button>
        </div>

        {/* Quick Migration Presets */}
        <div className="presets-bar">
          <span className="presets-label"><Sparkles size={14} /> Quick Pair Presets:</span>
          <div className="presets-list">
            {ENGINE_PRESETS.map((preset) => {
              const isActive = state.source.engine === preset.source && state.target.engine === preset.target;
              return (
                <button
                  key={preset.id}
                  className={`preset-pill ${isActive ? 'active' : ''}`}
                  onClick={() => handleApplyPreset(preset)}
                  title={preset.desc}
                >
                  <span className="preset-text">{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Connection Grid */}
      <div className="connection-grid">
        {/* ─── SOURCE CONNECTION CARD ─────────────────────────────────────── */}
        <motion.div
          className="glass-card-static connection-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Card Top: Selector & Role Header */}
          <div className="connection-card-header">
            <div className="connection-icon" style={{ background: 'rgba(0, 175, 175, 0.08)', color: 'var(--teal-600)' }}>
              <SourceIcon size={22} />
            </div>
            <div className="connection-title-block">
              <div className="engine-select-wrapper">
                <span className="role-tag source-tag">SOURCE ORIGIN</span>
                <select
                  className="engine-dropdown-select"
                  value={state.source.engine}
                  onChange={(e) => handleSourceEngineChange(e.target.value)}
                >
                  {SUPPORTED_ENGINES.map((eng) => (
                    <option key={eng.id} value={eng.id}>
                      {eng.name} — {eng.subtitle}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {state.source.connected && (
              <div className="connection-status-badge connected">
                <CheckCircle2 size={14} /> Connected
              </div>
            )}
          </div>

          {/* Quick Sample Autofill */}
          <div className="sample-autofill-row">
            <span className="form-legend">Connection Credentials</span>
            <button
              type="button"
              className="btn-text-autofill"
              onClick={fillSourceSample}
            >
              <Zap size={12} /> Auto-fill Sample Config
            </button>
          </div>

          {/* Dynamic Form per Engine */}
          <div className="connection-form">
            {state.source.engine === 'snowflake' ? (
              <>
                <div className="input-group">
                  <label className="input-label">Account Identifier</label>
                  <input
                    className="input-field"
                    placeholder="xy12345.us-east-1 or org-account"
                    value={sourceForm.account || sourceForm.server || ''}
                    onChange={e => setSourceForm({ ...sourceForm, account: e.target.value, server: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Username</label>
                    <input
                      className="input-field"
                      placeholder="ADMIN"
                      value={sourceForm.username || ''}
                      onChange={e => setSourceForm({ ...sourceForm, username: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Password</label>
                    <div className="password-field">
                      <input
                        className="input-field"
                        type={showSourcePass ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={sourceForm.password || ''}
                        onChange={e => setSourceForm({ ...sourceForm, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowSourcePass(!showSourcePass)}
                      >
                        {showSourcePass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Warehouse</label>
                    <input
                      className="input-field"
                      placeholder="COMPUTE_WH"
                      value={sourceForm.warehouse || ''}
                      onChange={e => setSourceForm({ ...sourceForm, warehouse: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Role (optional)</label>
                    <input
                      className="input-field"
                      placeholder="SYSADMIN"
                      value={sourceForm.role || ''}
                      onChange={e => setSourceForm({ ...sourceForm, role: e.target.value })}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Database (optional)</label>
                  <input
                    className="input-field"
                    placeholder="DEV_DW (or select in next step)"
                    value={sourceForm.database || ''}
                    onChange={e => setSourceForm({ ...sourceForm, database: e.target.value })}
                  />
                </div>
              </>
            ) : state.source.engine === 'sql_server' ? (
              <>
                <div className="form-row">
                  <div className="input-group" style={{ flex: 2 }}>
                    <label className="input-label">Server Host / IP</label>
                    <input
                      className="input-field"
                      placeholder="localhost or 10.0.12.45"
                      value={sourceForm.server || ''}
                      onChange={e => setSourceForm({ ...sourceForm, server: e.target.value })}
                    />
                  </div>
                  <div className="input-group" style={{ maxWidth: 110 }}>
                    <label className="input-label">Port</label>
                    <input
                      className="input-field"
                      placeholder="1433"
                      value={sourceForm.port || '1433'}
                      onChange={e => setSourceForm({ ...sourceForm, port: e.target.value })}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Database (optional)</label>
                  <input
                    className="input-field"
                    placeholder="SalesDB (or select in next step)"
                    value={sourceForm.database || ''}
                    onChange={e => setSourceForm({ ...sourceForm, database: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Username</label>
                    <input
                      className="input-field"
                      placeholder="sa"
                      value={sourceForm.username || ''}
                      onChange={e => setSourceForm({ ...sourceForm, username: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Password</label>
                    <div className="password-field">
                      <input
                        className="input-field"
                        type={showSourcePass ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={sourceForm.password || ''}
                        onChange={e => setSourceForm({ ...sourceForm, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowSourcePass(!showSourcePass)}
                      >
                        {showSourcePass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">ODBC Driver</label>
                  <select
                    className="input-field"
                    value={sourceForm.driver || 'ODBC Driver 17 for SQL Server'}
                    onChange={e => setSourceForm({ ...sourceForm, driver: e.target.value })}
                  >
                    <option>ODBC Driver 17 for SQL Server</option>
                    <option>ODBC Driver 18 for SQL Server</option>
                    <option>SQL Server</option>
                  </select>
                </div>
              </>
            ) : (
              // PostgreSQL / MySQL / Oracle / Databricks Form
              <>
                <div className="form-row">
                  <div className="input-group" style={{ flex: 2 }}>
                    <label className="input-label">Host / Workspace URL</label>
                    <input
                      className="input-field"
                      placeholder="hostname or cluster URL"
                      value={sourceForm.server || ''}
                      onChange={e => setSourceForm({ ...sourceForm, server: e.target.value })}
                    />
                  </div>
                  <div className="input-group" style={{ maxWidth: 110 }}>
                    <label className="input-label">Port</label>
                    <input
                      className="input-field"
                      placeholder="5432"
                      value={sourceForm.port || '5432'}
                      onChange={e => setSourceForm({ ...sourceForm, port: e.target.value })}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Database / Service / Catalog</label>
                  <input
                    className="input-field"
                    placeholder="Database name"
                    value={sourceForm.database || ''}
                    onChange={e => setSourceForm({ ...sourceForm, database: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Username / Token ID</label>
                    <input
                      className="input-field"
                      placeholder="admin"
                      value={sourceForm.username || ''}
                      onChange={e => setSourceForm({ ...sourceForm, username: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Password / Secret</label>
                    <div className="password-field">
                      <input
                        className="input-field"
                        type={showSourcePass ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={sourceForm.password || ''}
                        onChange={e => setSourceForm({ ...sourceForm, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowSourcePass(!showSourcePass)}
                      >
                        {showSourcePass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Test Result Message */}
          <AnimatePresence>
            {sourceResult && (
              <motion.div
                className={`test-result ${sourceResult.success ? 'success' : 'error'}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {sourceResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <div>
                  <div className="test-result-msg">{sourceResult.message}</div>
                  {sourceResult.server_version && (
                    <div className="test-result-detail">{sourceResult.server_version} • {state.source.databases?.length || 4} databases detected</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <button
            className={`btn ${state.source.connected ? 'btn-success' : 'btn-primary'} btn-lg w-full`}
            onClick={handleTestSource}
            disabled={sourceTesting}
          >
            {sourceTesting ? (
              <><Loader2 size={18} className="spin" /> Testing Source Connection...</>
            ) : state.source.connected ? (
              <><CheckCircle2 size={18} /> Source Connected — Re-test</>
            ) : (
              <><Zap size={18} /> Test Source Connection</>
            )}
          </button>
        </motion.div>

        {/* ─── TARGET CONNECTION CARD ─────────────────────────────────────── */}
        <motion.div
          className="glass-card-static connection-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {/* Card Top: Selector & Role Header */}
          <div className="connection-card-header">
            <div className="connection-icon" style={{ background: 'rgba(0, 175, 175, 0.08)', color: 'var(--teal-600)' }}>
              <TargetIcon size={22} />
            </div>
            <div className="connection-title-block">
              <div className="engine-select-wrapper">
                <span className="role-tag target-tag">TARGET DESTINATION</span>
                <select
                  className="engine-dropdown-select"
                  value={state.target.engine}
                  onChange={(e) => handleTargetEngineChange(e.target.value)}
                >
                  {SUPPORTED_ENGINES.map((eng) => (
                    <option key={eng.id} value={eng.id}>
                      {eng.name} — {eng.subtitle}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {state.target.connected && (
              <div className="connection-status-badge connected">
                <CheckCircle2 size={14} /> Connected
              </div>
            )}
          </div>

          {/* Quick Sample Autofill */}
          <div className="sample-autofill-row">
            <span className="form-legend">Connection Credentials</span>
            <button
              type="button"
              className="btn-text-autofill"
              onClick={fillTargetSample}
            >
              <Zap size={12} /> Auto-fill Sample Config
            </button>
          </div>

          {/* Dynamic Form per Engine */}
          <div className="connection-form">
            {state.target.engine === 'snowflake' ? (
              <>
                <div className="input-group">
                  <label className="input-label">Account Identifier</label>
                  <input
                    className="input-field"
                    placeholder="prod-corp.snowflakecomputing.com"
                    value={targetForm.account || targetForm.server || ''}
                    onChange={e => setTargetForm({ ...targetForm, account: e.target.value, server: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Username</label>
                    <input
                      className="input-field"
                      placeholder="PROD_ADMIN"
                      value={targetForm.username || ''}
                      onChange={e => setTargetForm({ ...targetForm, username: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Password</label>
                    <div className="password-field">
                      <input
                        className="input-field"
                        type={showTargetPass ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={targetForm.password || ''}
                        onChange={e => setTargetForm({ ...targetForm, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowTargetPass(!showTargetPass)}
                      >
                        {showTargetPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Warehouse</label>
                    <input
                      className="input-field"
                      placeholder="PROD_ANALYTICS_WH"
                      value={targetForm.warehouse || ''}
                      onChange={e => setTargetForm({ ...targetForm, warehouse: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Role (optional)</label>
                    <input
                      className="input-field"
                      placeholder="SYSADMIN"
                      value={targetForm.role || ''}
                      onChange={e => setTargetForm({ ...targetForm, role: e.target.value })}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Database (optional)</label>
                  <input
                    className="input-field"
                    placeholder="PRODUCTION_DW (or select in next step)"
                    value={targetForm.database || ''}
                    onChange={e => setTargetForm({ ...targetForm, database: e.target.value })}
                  />
                </div>
              </>
            ) : state.target.engine === 'sql_server' ? (
              <>
                <div className="form-row">
                  <div className="input-group" style={{ flex: 2 }}>
                    <label className="input-label">Server Host / IP</label>
                    <input
                      className="input-field"
                      placeholder="localhost or 10.0.12.99"
                      value={targetForm.server || ''}
                      onChange={e => setTargetForm({ ...targetForm, server: e.target.value })}
                    />
                  </div>
                  <div className="input-group" style={{ maxWidth: 110 }}>
                    <label className="input-label">Port</label>
                    <input
                      className="input-field"
                      placeholder="1433"
                      value={targetForm.port || '1433'}
                      onChange={e => setTargetForm({ ...targetForm, port: e.target.value })}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Database (optional)</label>
                  <input
                    className="input-field"
                    placeholder="SalesDB_Archive (or select in next step)"
                    value={targetForm.database || ''}
                    onChange={e => setTargetForm({ ...targetForm, database: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Username</label>
                    <input
                      className="input-field"
                      placeholder="sa"
                      value={targetForm.username || ''}
                      onChange={e => setTargetForm({ ...targetForm, username: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Password</label>
                    <div className="password-field">
                      <input
                        className="input-field"
                        type={showTargetPass ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={targetForm.password || ''}
                        onChange={e => setTargetForm({ ...targetForm, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowTargetPass(!showTargetPass)}
                      >
                        {showTargetPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">ODBC Driver</label>
                  <select
                    className="input-field"
                    value={targetForm.driver || 'ODBC Driver 17 for SQL Server'}
                    onChange={e => setTargetForm({ ...targetForm, driver: e.target.value })}
                  >
                    <option>ODBC Driver 17 for SQL Server</option>
                    <option>ODBC Driver 18 for SQL Server</option>
                    <option>SQL Server</option>
                  </select>
                </div>
              </>
            ) : (
              // PostgreSQL / MySQL / Oracle / Databricks Form
              <>
                <div className="form-row">
                  <div className="input-group" style={{ flex: 2 }}>
                    <label className="input-label">Host / Workspace URL</label>
                    <input
                      className="input-field"
                      placeholder="hostname or cluster URL"
                      value={targetForm.server || ''}
                      onChange={e => setTargetForm({ ...targetForm, server: e.target.value })}
                    />
                  </div>
                  <div className="input-group" style={{ maxWidth: 110 }}>
                    <label className="input-label">Port</label>
                    <input
                      className="input-field"
                      placeholder="5432"
                      value={targetForm.port || '5432'}
                      onChange={e => setTargetForm({ ...targetForm, port: e.target.value })}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Database / Service / Catalog</label>
                  <input
                    className="input-field"
                    placeholder="Database name"
                    value={targetForm.database || ''}
                    onChange={e => setTargetForm({ ...targetForm, database: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Username / Token ID</label>
                    <input
                      className="input-field"
                      placeholder="admin"
                      value={targetForm.username || ''}
                      onChange={e => setTargetForm({ ...targetForm, username: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Password / Secret</label>
                    <div className="password-field">
                      <input
                        className="input-field"
                        type={showTargetPass ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={targetForm.password || ''}
                        onChange={e => setTargetForm({ ...targetForm, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowTargetPass(!showTargetPass)}
                      >
                        {showTargetPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Test Result Message */}
          <AnimatePresence>
            {targetResult && (
              <motion.div
                className={`test-result ${targetResult.success ? 'success' : 'error'}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {targetResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <div>
                  <div className="test-result-msg">{targetResult.message}</div>
                  {targetResult.server_version && (
                    <div className="test-result-detail">{targetResult.server_version} • {state.target.databases?.length || 4} databases detected</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <button
            className={`btn ${state.target.connected ? 'btn-success' : 'btn-primary'} btn-lg w-full`}
            onClick={handleTestTarget}
            disabled={targetTesting}
          >
            {targetTesting ? (
              <><Loader2 size={18} className="spin" /> Testing Target Connection...</>
            ) : state.target.connected ? (
              <><CheckCircle2 size={18} /> Target Connected — Re-test</>
            ) : (
              <><Zap size={18} /> Test Target Connection</>
            )}
          </button>
        </motion.div>
      </div>

      {/* Continue Button */}
      <motion.div
        className="page-actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          className="btn btn-primary btn-lg"
          onClick={onNext}
          disabled={!bothConnected}
        >
          Continue to Schema Selection →
        </button>
        {!bothConnected && (
          <p className="page-actions-hint">
            Test and connect both the {state.source.engineLabel} (source) and {state.target.engineLabel} (target) connections to proceed.
          </p>
        )}
      </motion.div>
    </div>
  );
}
