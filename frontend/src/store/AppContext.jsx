import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext(null);
const AppDispatchContext = createContext(null);
const LOCAL_STORAGE_KEY = 'cozmatch_app_data_v2';

export const SUPPORTED_ENGINES = [
  { id: 'snowflake', name: 'Snowflake', subtitle: 'Cloud Data Warehouse', icon: 'Snowflake', color: '#00afaf' },
  { id: 'sql_server', name: 'SQL Server', subtitle: 'Microsoft SQL / Azure SQL', icon: 'Server', color: '#008b8b' },
  { id: 'postgresql', name: 'PostgreSQL', subtitle: 'Relational Database', icon: 'Database', color: '#336791' },
  { id: 'mysql', name: 'MySQL', subtitle: 'Relational Database Service', icon: 'Database', color: '#00758f' },
  { id: 'oracle', name: 'Oracle DB', subtitle: 'Enterprise Database', icon: 'Database', color: '#f80000' },
  { id: 'databricks', name: 'Databricks', subtitle: 'Lakehouse Platform', icon: 'Layers', color: '#ff3621' },
];

export const ENGINE_PRESETS = [
  {
    id: 'sf_to_sf',
    label: 'Snowflake ➔ Snowflake',
    source: 'snowflake',
    target: 'snowflake',
    desc: 'Cross-Env / Cross-DB Validation (Dev/Stage ➔ Prod)',
  },
  {
    id: 'sql_to_sf',
    label: 'SQL Server ➔ Snowflake',
    source: 'sql_server',
    target: 'snowflake',
    desc: 'Cloud Data Warehouse Modernization Migration',
  },
  {
    id: 'sql_to_sql',
    label: 'SQL Server ➔ SQL Server',
    source: 'sql_server',
    target: 'sql_server',
    desc: 'Server-to-Server / Replica / DR Validation',
  },
  {
    id: 'sf_to_sql',
    label: 'Snowflake ➔ SQL Server',
    source: 'snowflake',
    target: 'sql_server',
    desc: 'Reverse Sync / Downstream Consumer Validation',
  },
];

const DEFAULT_DATABASES = {
  snowflake: ['PRODUCTION_DW', 'ANALYTICS_DB', 'RAW_DATA', 'STAGING', 'DEV_DW'],
  sql_server: ['AdventureWorks', 'SalesDB', 'HR_Database', 'FinanceDB', 'OperationsDB'],
  postgresql: ['postgres', 'analytics_prod', 'app_db', 'audit_store'],
  mysql: ['sys', 'ecommerce_db', 'customer_repo', 'inventory_v2'],
  oracle: ['ORCL_PROD', 'SALES_ERP', 'FIN_LEDGER', 'DATA_STAGE'],
  databricks: ['main', 'hive_metastore', 'lakehouse_silver', 'gold_analytics'],
};

const DEFAULT_SCHEMAS = {
  snowflake: ['PUBLIC', 'ANALYTICS', 'RAW', 'STAGING', 'MARTS'],
  sql_server: ['dbo', 'sales', 'hr', 'production', 'finance'],
  postgresql: ['public', 'analytics', 'audit', 'staging'],
  mysql: ['default', 'sales', 'warehouse', 'billing'],
  oracle: ['SCOTT', 'HR', 'SALES', 'FINANCE'],
  databricks: ['default', 'silver', 'gold', 'curated'],
};

export const getEngineDetails = (engineId) => {
  return SUPPORTED_ENGINES.find(e => e.id === engineId) || SUPPORTED_ENGINES[0];
};

export const getDefaultDatabases = (engineId) => DEFAULT_DATABASES[engineId] || DEFAULT_DATABASES.snowflake;
export const getDefaultSchemas = (engineId) => DEFAULT_SCHEMAS[engineId] || DEFAULT_SCHEMAS.snowflake;

const loadState = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) return undefined;
    const parsed = JSON.parse(saved);
    // Ensure source and target are properly structured
    if (!parsed.source || !parsed.target) return undefined;
    return parsed;
  } catch (err) {
    return undefined;
  }
};

const initialState = {
  // Current step in the workflow
  currentStep: 0,
  
  // Connection state
  source: {
    engine: 'sql_server',
    engineLabel: 'SQL Server',
    connected: false,
    config: null,
    databases: DEFAULT_DATABASES.sql_server,
    selectedDatabase: 'SalesDB',
    schemas: DEFAULT_SCHEMAS.sql_server,
    selectedSchema: 'dbo',
  },
  target: {
    engine: 'snowflake',
    engineLabel: 'Snowflake',
    connected: false,
    config: null,
    databases: DEFAULT_DATABASES.snowflake,
    selectedDatabase: 'PRODUCTION_DW',
    schemas: DEFAULT_SCHEMAS.snowflake,
    selectedSchema: 'PUBLIC',
  },
  
  // Legacy aliases
  sqlServer: {
    connected: false,
    config: null,
    databases: DEFAULT_DATABASES.sql_server,
    selectedDatabase: 'SalesDB',
    schemas: DEFAULT_SCHEMAS.sql_server,
    selectedSchema: 'dbo',
  },
  snowflake: {
    connected: false,
    config: null,
    databases: DEFAULT_DATABASES.snowflake,
    selectedDatabase: 'PRODUCTION_DW',
    schemas: DEFAULT_SCHEMAS.snowflake,
    selectedSchema: 'PUBLIC',
  },
  
  // Discovery state
  sourceTables: [],
  targetTables: [],
  
  // Matching state
  tableMatching: null,
  columnMatching: {},
  
  // Validation state
  validationRun: null,
  validationResults: null,
  
  // UI state
  isLoading: false,
  error: null,
  notification: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'SET_SOURCE_ENGINE': {
      const engineId = action.payload;
      const engine = getEngineDetails(engineId);
      const databases = DEFAULT_DATABASES[engineId] || [];
      const schemas = DEFAULT_SCHEMAS[engineId] || [];
      return {
        ...state,
        source: {
          ...state.source,
          engine: engineId,
          engineLabel: engine.name,
          connected: false,
          databases,
          selectedDatabase: databases[0] || '',
          schemas,
          selectedSchema: schemas[0] || '',
        },
      };
    }

    case 'SET_TARGET_ENGINE': {
      const engineId = action.payload;
      const engine = getEngineDetails(engineId);
      const databases = DEFAULT_DATABASES[engineId] || [];
      const schemas = DEFAULT_SCHEMAS[engineId] || [];
      return {
        ...state,
        target: {
          ...state.target,
          engine: engineId,
          engineLabel: engine.name,
          connected: false,
          databases,
          selectedDatabase: databases[0] || '',
          schemas,
          selectedSchema: schemas[0] || '',
        },
      };
    }

    case 'SET_SOURCE': {
      const updated = { ...state.source, ...action.payload };
      return {
        ...state,
        source: updated,
        sqlServer: updated.engine === 'sql_server' ? updated : state.sqlServer,
        snowflake: updated.engine === 'snowflake' ? updated : state.snowflake,
      };
    }

    case 'SET_TARGET': {
      const updated = { ...state.target, ...action.payload };
      return {
        ...state,
        target: updated,
        snowflake: updated.engine === 'snowflake' ? updated : state.snowflake,
        sqlServer: updated.engine === 'sql_server' ? updated : state.sqlServer,
      };
    }

    case 'SWAP_CONNECTIONS': {
      const oldSource = state.source;
      const oldTarget = state.target;
      return {
        ...state,
        source: { ...oldTarget },
        target: { ...oldSource },
        sourceTables: state.targetTables,
        targetTables: state.sourceTables,
      };
    }

    case 'APPLY_PAIR_PRESET': {
      const { source: srcEngineId, target: tgtEngineId } = action.payload;
      const srcEngine = getEngineDetails(srcEngineId);
      const tgtEngine = getEngineDetails(tgtEngineId);
      const srcDatabases = DEFAULT_DATABASES[srcEngineId] || [];
      const tgtDatabases = DEFAULT_DATABASES[tgtEngineId] || [];
      const srcSchemas = DEFAULT_SCHEMAS[srcEngineId] || [];
      const tgtSchemas = DEFAULT_SCHEMAS[tgtEngineId] || [];

      return {
        ...state,
        source: {
          engine: srcEngineId,
          engineLabel: srcEngine.name,
          connected: false,
          config: null,
          databases: srcDatabases,
          selectedDatabase: srcDatabases[0] || '',
          schemas: srcSchemas,
          selectedSchema: srcSchemas[0] || '',
        },
        target: {
          engine: tgtEngineId,
          engineLabel: tgtEngine.name,
          connected: false,
          config: null,
          databases: tgtDatabases,
          selectedDatabase: tgtDatabases.length > 1 ? tgtDatabases[1] : tgtDatabases[0] || '',
          schemas: tgtSchemas,
          selectedSchema: tgtSchemas.length > 1 ? tgtSchemas[1] : tgtSchemas[0] || '',
        },
      };
    }

    // Legacy actions
    case 'SET_SQL_SERVER': {
      const updated = { ...state.sqlServer, ...action.payload };
      const updateSource = state.source.engine === 'sql_server';
      const updateTarget = state.target.engine === 'sql_server';
      return {
        ...state,
        sqlServer: updated,
        source: updateSource ? { ...state.source, ...action.payload } : state.source,
        target: updateTarget && !updateSource ? { ...state.target, ...action.payload } : state.target,
      };
    }
    
    case 'SET_SNOWFLAKE': {
      const updated = { ...state.snowflake, ...action.payload };
      const updateTarget = state.target.engine === 'snowflake';
      const updateSource = state.source.engine === 'snowflake';
      return {
        ...state,
        snowflake: updated,
        target: updateTarget ? { ...state.target, ...action.payload } : state.target,
        source: updateSource && !updateTarget ? { ...state.source, ...action.payload } : state.source,
      };
    }
    
    case 'SET_SOURCE_TABLES':
      return { ...state, sourceTables: action.payload };
    
    case 'SET_TARGET_TABLES':
      return { ...state, targetTables: action.payload };
    
    case 'SET_TABLE_MATCHING':
      return { ...state, tableMatching: action.payload };
    
    case 'SET_COLUMN_MATCHING':
      return {
        ...state,
        columnMatching: { ...state.columnMatching, [action.payload.key]: action.payload.data },
      };
    
    case 'SET_VALIDATION_RUN':
      return { ...state, validationRun: action.payload };
    
    case 'SET_VALIDATION_RESULTS':
      return { ...state, validationResults: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_NOTIFICATION':
      return { ...state, notification: action.payload };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, loadState() || initialState);
  
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Could not save state", err);
    }
  }, [state]);

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppContext);
}

export function useAppDispatch() {
  return useContext(AppDispatchContext);
}
