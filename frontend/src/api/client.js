import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
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
