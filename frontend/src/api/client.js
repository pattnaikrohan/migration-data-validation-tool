import axios from 'axios';

const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`;
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8000/api';
  }
  return '/api';
};

const API_BASE = getApiBase();

const api = axios.create({
  baseURL: API_BASE,
  timeout: 45000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Connection APIs ──────────────────────────────────────────────────────────
export const testGenericConnection = (data) => api.post('/connections/test', data);
export const connectGeneric = (data) => api.post('/connections/connect', data);

export const testSQLServer = (data) => api.post('/connections/test/sql-server', data);
export const testSnowflake = (data) => api.post('/connections/test/snowflake', data);
export const connectSQLServer = (data) => api.post('/connections/connect/sql-server', data);
export const connectSnowflake = (data) => api.post('/connections/connect/snowflake', data);
export const getConnectionStatus = () => api.get('/connections/status');
export const disconnect = (roleOrType) => api.post(`/connections/disconnect/${roleOrType}`);

// ─── Discovery APIs ──────────────────────────────────────────────────────────
export const getDatabases = (roleOrType) => api.get(`/discovery/databases/${roleOrType}`);
export const getSchemas = (roleOrType, database) => api.get(`/discovery/schemas/${roleOrType}/${database}`);
export const getTables = (roleOrType, database, schema) => api.get(`/discovery/tables/${roleOrType}/${database}/${schema}`);

// ─── Matching APIs ───────────────────────────────────────────────────────────
export const runTableMatching = (data) => api.post('/matching/tables', data);
export const updateTableDecisions = (decisions) => api.put('/matching/tables/decisions', decisions);
export const runColumnMatching = (sourceTable, targetTable) => api.post(`/matching/columns/${sourceTable}/${targetTable}`);

// ─── Validation APIs ─────────────────────────────────────────────────────────
export const startValidation = (data) => api.post('/validation/run', data);
export const getValidationStatus = (runId) => api.get(`/validation/status/${runId}`);
export const getValidationResults = (runId) => api.get(`/validation/results/${runId}`);
export const getAllRuns = () => api.get('/validation/runs');

// ─── Report APIs ─────────────────────────────────────────────────────────────
export const downloadExcel = (runId) => api.get(`/reports/${runId}/excel`);
export const downloadPDF = (runId) => api.get(`/reports/${runId}/pdf`);

// ─── Health ──────────────────────────────────────────────────────────────────
export const healthCheck = () => api.get('/health');

export default api;
