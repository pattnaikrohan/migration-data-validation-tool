"""API routes for schema and table discovery supporting source/target roles and any database engine."""

from fastapi import APIRouter, HTTPException
from routes.connections import role_connectors, sql_connector, sf_connector
from services.sql_server_connector import SQLServerConnector
from services.snowflake_connector import SnowflakeConnector

router = APIRouter()


def _resolve_connector(role_or_type: str):
    """Resolve the appropriate connector instance from role ('source'/'target') or type."""
    key = role_or_type.lower()
    
    if key in ("source", "target"):
        conn = role_connectors.get(key)
        if conn and conn.connection:
            return conn
        # Legacy fallback
        if key == "source" and sql_connector.connection:
            return sql_connector
        if key == "target" and sf_connector.connection:
            return sf_connector
        if conn:
            return conn
            
    if key == "sql_server":
        if role_connectors.get("source") and isinstance(role_connectors["source"], SQLServerConnector):
            return role_connectors["source"]
        if role_connectors.get("target") and isinstance(role_connectors["target"], SQLServerConnector):
            return role_connectors["target"]
        return sql_connector
        
    if key == "snowflake":
        if role_connectors.get("target") and isinstance(role_connectors["target"], SnowflakeConnector):
            return role_connectors["target"]
        if role_connectors.get("source") and isinstance(role_connectors["source"], SnowflakeConnector):
            return role_connectors["source"]
        return sf_connector
        
    return None


@router.get("/databases/{role_or_type}")
async def get_databases(role_or_type: str):
    """Get available databases for a connection by role ('source'/'target') or engine type."""
    connector = _resolve_connector(role_or_type)
    if not connector or not connector.connection:
        raise HTTPException(
            status_code=400,
            detail=f"Database for '{role_or_type}' is not connected"
        )
    
    cursor = connector.connection.cursor()
    if isinstance(connector, SQLServerConnector):
        cursor.execute("SELECT name FROM sys.databases WHERE state_desc = 'ONLINE' ORDER BY name")
        return {"databases": [row[0] for row in cursor.fetchall()]}
    else:
        cursor.execute("SHOW DATABASES")
        return {"databases": [row[1] for row in cursor.fetchall()]}


@router.get("/schemas/{role_or_type}/{database}")
async def get_schemas(role_or_type: str, database: str):
    """Get schemas in a database by role ('source'/'target') or engine type."""
    connector = _resolve_connector(role_or_type)
    if not connector or not connector.connection:
        raise HTTPException(
            status_code=400,
            detail=f"Database for '{role_or_type}' is not connected"
        )
    
    schemas = connector.get_schemas(database)
    return {"schemas": [s.model_dump() for s in schemas]}


@router.get("/tables/{role_or_type}/{database}/{schema}")
async def get_tables(role_or_type: str, database: str, schema: str):
    """Get all tables with metadata in a schema by role ('source'/'target') or engine type."""
    connector = _resolve_connector(role_or_type)
    if not connector or not connector.connection:
        raise HTTPException(
            status_code=400,
            detail=f"Database for '{role_or_type}' is not connected"
        )
    
    tables = connector.get_tables(database, schema)
    return {
        "tables": [t.model_dump() for t in tables],
        "total": len(tables),
    }
