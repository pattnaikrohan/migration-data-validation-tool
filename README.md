# 🔮 CozMatch — Migration Intelligence & Data Validation Suite

### Universal Multi-Database Automated Data Validation Framework
**Snowflake ↔ Snowflake • SQL Server ↔ Snowflake • SQL Server ↔ SQL Server • PostgreSQL • MySQL • Oracle • Databricks**

A full-stack, enterprise data validation platform that automatically discovers, matches, and validates data across heterogeneous or homogeneous databases. Built with a high-performance Python FastAPI backend and a modern React + Vite frontend with glassmorphism UI.

---

## ✨ Key Features

- **🔌 Universal Multi-Engine Database Connections** — Connect and validate any database combination:
  - **Snowflake ➔ Snowflake** (Cross-environment Dev/Stage ➔ Prod or cross-account validation)
  - **SQL Server ➔ Snowflake** (Cloud modernization migration)
  - **SQL Server ➔ SQL Server** (Instance replication & disaster recovery validation)
  - **Snowflake ➔ SQL Server** (Downstream consumer sync / repatriation)
  - **PostgreSQL, MySQL, Oracle, Databricks**
- **⚡ 1-Click Migration Presets & Swap** — Instant pair presets and 1-click source/target inversion.
- **🔍 Automatic Catalog & Table Discovery** — Scans catalogs, databases, and schemas across both endpoints.
- **🧠 Multi-Signal Table Matching Engine** — Uses normalized names, token Jaccard similarity, fuzzy Levenshtein distance, and column schema overlap.
- **📊 Confidence Scoring & Tiers** — Weighted scoring with 5 confidence levels (Very High ➔ Very Low).
- **🔗 Automatic Column Mapping** — Matches columns with comprehensive data type compatibility validation.
- **✅ Interactive Decision Review & Remap** — Approve, reject, override, remap, or unmap pairings directly in the UI.
- **🧪 12-Phase Validation Pipeline** — Automated pipeline covering schema integrity, row counts, record-level matching, and cell-level comparisons.
- **📈 Executive Reporting & Audit** — Summary dashboards, interactive charts, and downloadable Excel (.xlsx) & PDF reports.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      React + Vite                       │
│             CozMatch Glassmorphism Interface            │
│   Connections ➔ Schema ➔ Discovery ➔ Table Matching ➔   │
│         Column Mapping ➔ Validation ➔ Reports           │
└────────────────────────────┬────────────────────────────┘
                             │ REST API
┌────────────────────────────┴────────────────────────────┐
│                    Python FastAPI                       │
│  Role Connectors │ Catalog Discovery │ Matching Engine  │
│      Normalizer │ Pipeline Orchestrator │ Audit         │
└────────────────────────────┬────────────────────────────┘
                             │
     ┌───────────────────────┼───────────────────────┐
     ▼                       ▼                       ▼
Snowflake               SQL Server              PostgreSQL /
(Cloud DW)              (Microsoft)             MySQL / Oracle
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **ODBC Driver 17+ for SQL Server** (for SQL Server connectivity)

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python -u -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

- API Server: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

- Web UI: `http://localhost:5173`

---

## 📁 Project Structure

```
Migration Data Validation Tool/
├── backend/
│   ├── main.py                     # FastAPI entry point & CORS
│   ├── config.py                   # Matching weights & data type compatibility
│   ├── requirements.txt            # Python dependencies
│   ├── models/                     # Pydantic models
│   │   ├── connection.py           # Multi-engine connection models
│   │   ├── discovery.py            # Schema, table, column metadata
│   │   ├── matching.py             # Match results & explanations
│   │   └── validation.py           # Validation pipeline & runs
│   ├── services/                   # Business logic
│   │   ├── name_normalizer.py      # Tokenizer & abbreviation expansions
│   │   ├── sql_server_connector.py # SQL Server connector
│   │   ├── snowflake_connector.py  # Snowflake connector
│   │   ├── table_matching.py       # Table matching engine
│   │   ├── column_matching.py      # Column matching engine
│   │   ├── excel_reporter.py       # Excel (.xlsx) report generation
│   │   ├── pdf_reporter.py         # PDF audit report generation
│   │   └── validation_orchestrator.py # Pipeline orchestration
│   └── routes/                     # REST API routes
│       ├── connections.py          # /api/connections/*
│       ├── discovery.py            # /api/discovery/*
│       ├── matching.py             # /api/matching/*
│       ├── validation.py           # /api/validation/*
│       └── reports.py              # /api/reports/*
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Main layout & step orchestrator
│   │   ├── index.css               # Design system & tokens
│   │   ├── api/client.js           # API client
│   │   ├── store/AppContext.jsx    # Global state management
│   │   ├── data/demoData.js        # Mock data & workflow configs
│   │   ├── components/layout/      # Sidebar & Header
│   │   └── pages/                  # Workflow pages
│   │       ├── ConnectionSetup.jsx # Dynamic multi-engine connection UI
│   │       ├── SchemaSelection.jsx # Dynamic source & target schema pickers
│   │       ├── TableDiscovery.jsx  # Catalog table scanner
│   │       ├── TableMatching.jsx   # Intelligent matching & remap
│   │       ├── ColumnMatching.jsx  # Column mapping & type matrix
│   │       ├── ValidationDashboard.jsx # Pipeline execution
│   │       └── ResultsSummary.jsx  # Executive audit & export
│   └── package.json
└── README.md
```

---

## 📄 License

MIT License — Free to use, modify, and distribute.
