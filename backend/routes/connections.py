"""API routes for database connections supporting any database engine and source/target roles."""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, Optional
from models.connection import (
    SQLServerConnectionRequest, SnowflakeConnectionRequest,
    GenericConnectionRequest, ConnectionTestResult, ConnectionStatus, DatabaseType,
)
from services.sql_server_connector import SQLServerConnector
from services.snowflake_connector import SnowflakeConnector

router = APIRouter()

# Active connectors keyed by role ("source", "target")
role_connectors: Dict[str, Any] = {
    "source": None,
    "target": None,
}

# Legacy fallback singletons
sql_connector = SQLServerConnector()
sf_connector = SnowflakeConnector()


def create_connector_instance(db_type: DatabaseType):
    """Instantiate the appropriate connector for a given database type."""
    if db_type == DatabaseType.SQL_SERVER:
        return SQLServerConnector()
    elif db_type == DatabaseType.SNOWFLAKE:
        return SnowflakeConnector()
    else:
        # Fallback/mock support for extended types
        return SnowflakeConnector()


def get_connector_for_role(role: str = "source"):
    """Retrieve the active connector for a specific role ('source' or 'target')."""
    conn = role_connectors.get(role)
    if conn:
        return conn
    # Fallback to legacy singletons
    if role == "source":
        return sql_connector
    return sf_connector


@router.post("/test", response_model=ConnectionTestResult)
async def test_generic_connection(request: GenericConnectionRequest):
    """Test connection dynamically for any engine (Snowflake, SQL Server, etc.) and role."""
    connector = create_connector_instance(request.database_type)
    
    if request.database_type == DatabaseType.SQL_SERVER:
        sql_req = SQLServerConnectionRequest(
            server=request.server or request.account or "localhost",
            port=request.port or 1433,
            database=request.database,
            username=request.username,
            password=request.password,
            driver=request.driver or "ODBC Driver 17 for SQL Server",
            trust_server_certificate=request.trust_server_certificate,
            connection_timeout=request.connection_timeout,
        )
        res = connector.test_connection(sql_req)
    else:
        sf_req = SnowflakeConnectionRequest(
            account=request.account or request.server or "",
            username=request.username,
            password=request.password,
            warehouse=request.warehouse,
            database=request.database,
            schema_name=request.schema_name,
            role=request.role_name,
            connection_timeout=request.connection_timeout,
        )
        res = connector.test_connection(sf_req)
        
    res.role = request.role
    return res


@router.post("/connect")
async def connect_generic(request: GenericConnectionRequest):
    """Establish and store an active connection for a role ('source' or 'target')."""
    role = request.role.lower() if request.role else "source"
    connector = create_connector_instance(request.database_type)
    
    if request.database_type == DatabaseType.SQL_SERVER:
        sql_req = SQLServerConnectionRequest(
            server=request.server or request.account or "localhost",
            port=request.port or 1433,
            database=request.database,
            username=request.username,
            password=request.password,
            driver=request.driver or "ODBC Driver 17 for SQL Server",
            trust_server_certificate=request.trust_server_certificate,
            connection_timeout=request.connection_timeout,
        )
        success = connector.connect(sql_req)
    else:
        sf_req = SnowflakeConnectionRequest(
            account=request.account or request.server or "",
            username=request.username,
            password=request.password,
            warehouse=request.warehouse,
            database=request.database,
            schema_name=request.schema_name,
            role=request.role_name,
            connection_timeout=request.connection_timeout,
        )
        success = connector.connect(sf_req)
        
    if not success:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to connect to {request.database_type.value} for {role}"
        )
        
    role_connectors[role] = connector
    return {
        "success": True,
        "message": f"Connected {role} to {request.database_type.value}",
        "role": role,
        "database_type": request.database_type.value,
    }


# ─── Legacy Compatibility Endpoints ──────────────────────────────────────────

@router.post("/test/sql-server", response_model=ConnectionTestResult)
async def test_sql_server(request: SQLServerConnectionRequest):
    """Test a SQL Server connection (legacy endpoint)."""
    return sql_connector.test_connection(request)


@router.post("/test/snowflake", response_model=ConnectionTestResult)
async def test_snowflake(request: SnowflakeConnectionRequest):
    """Test a Snowflake connection (legacy endpoint)."""
    return sf_connector.test_connection(request)


@router.post("/connect/sql-server")
async def connect_sql_server(request: SQLServerConnectionRequest):
    """Establish a persistent SQL Server connection (legacy endpoint)."""
    success = sql_connector.connect(request)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to connect to SQL Server")
    role_connectors["source"] = sql_connector
    return {"success": True, "message": "Connected to SQL Server"}


@router.post("/connect/snowflake")
async def connect_snowflake(request: SnowflakeConnectionRequest):
    """Establish a persistent Snowflake connection (legacy endpoint)."""
    success = sf_connector.connect(request)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to connect to Snowflake")
    role_connectors["target"] = sf_connector
    return {"success": True, "message": "Connected to Snowflake"}


@router.get("/status")
async def get_connection_status():
    """Get current connection status for both source and target databases."""
    source_conn = role_connectors.get("source") or sql_connector
    target_conn = role_connectors.get("target") or sf_connector
    
    return {
        "source": ConnectionStatus(
            connected=source_conn.connection is not None if source_conn else False,
            database_type=DatabaseType.SQL_SERVER if isinstance(source_conn, SQLServerConnector) else DatabaseType.SNOWFLAKE,
        ),
        "target": ConnectionStatus(
            connected=target_conn.connection is not None if target_conn else False,
            database_type=DatabaseType.SNOWFLAKE if isinstance(target_conn, SnowflakeConnector) else DatabaseType.SQL_SERVER,
        ),
        # Legacy fields for backward compatibility
        "sql_server": ConnectionStatus(
            connected=sql_connector.connection is not None,
            database_type=DatabaseType.SQL_SERVER,
        ),
        "snowflake": ConnectionStatus(
            connected=sf_connector.connection is not None,
            database_type=DatabaseType.SNOWFLAKE,
        ),
    }


@router.post("/disconnect/{role_or_type}")
async def disconnect(role_or_type: str):
    """Disconnect from a database role or type."""
    key = role_or_type.lower()
    if key in role_connectors and role_connectors[key]:
        role_connectors[key].disconnect()
        role_connectors[key] = None
    elif key == "sql_server":
        sql_connector.disconnect()
    elif key == "snowflake":
        sf_connector.disconnect()
    else:
        raise HTTPException(status_code=400, detail="Invalid database role or type")
    return {"success": True, "message": f"Disconnected from {role_or_type}"}
