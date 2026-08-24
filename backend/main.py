"""
SQL Server to Snowflake Migration Data Validation Tool
======================================================
FastAPI backend application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from routes.connections import router as connections_router
from routes.discovery import router as discovery_router
from routes.matching import router as matching_router
from routes.validation import router as validation_router
from routes.reports import router as reports_router

app = FastAPI(
    title="Migration Data Validation Tool",
    description="SQL Server to Snowflake automated data validation framework",
    version="1.0.0",
)

# CORS for React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(connections_router, prefix="/api/connections", tags=["Connections"])
app.include_router(discovery_router, prefix="/api/discovery", tags=["Discovery"])
app.include_router(matching_router, prefix="/api/matching", tags=["Matching"])
app.include_router(validation_router, prefix="/api/validation", tags=["Validation"])
app.include_router(reports_router, prefix="/api/reports", tags=["Reports"])


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
