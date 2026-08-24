"""Pydantic models for database connection requests and responses."""

from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class DatabaseType(str, Enum):
    SQL_SERVER = "sql_server"
    SNOWFLAKE = "snowflake"
    POSTGRESQL = "postgresql"
    MYSQL = "mysql"
    ORACLE = "oracle"
    DATABRICKS = "databricks"
    REDSHIFT = "redshift"


class SQLServerConnectionRequest(BaseModel):
    """SQL Server connection parameters."""
    server: str = Field(..., description="Server hostname or IP")
    port: int = Field(1433, description="Port number")
    database: Optional[str] = Field(None, description="Database name")
    username: str = Field(..., description="Login username")
    password: str = Field(..., description="Login password")
    driver: str = Field("ODBC Driver 17 for SQL Server", description="ODBC driver name")
    trust_server_certificate: bool = Field(True, description="Trust server certificate")
    connection_timeout: int = Field(30, description="Connection timeout in seconds")


class SnowflakeConnectionRequest(BaseModel):
    """Snowflake connection parameters."""
    account: str = Field(..., description="Snowflake account identifier")
    username: str = Field(..., description="Login username")
    password: str = Field(..., description="Login password")
    warehouse: Optional[str] = Field(None, description="Warehouse name")
    database: Optional[str] = Field(None, description="Database name")
    schema_name: Optional[str] = Field(None, description="Schema name")
    role: Optional[str] = Field(None, description="Role name")
    authenticator: Optional[str] = Field("snowflake", description="Authenticator (snowflake, externalbrowser, oauth, etc.)")
    connection_timeout: int = Field(60, description="Connection timeout in seconds (60s+ recommended for Duo MFA)")


class GenericConnectionRequest(BaseModel):
    """Dynamic connection parameters for any supported database engine."""
    role: str = Field("source", description="'source' or 'target'")
    database_type: DatabaseType = Field(DatabaseType.SQL_SERVER, description="Database engine type")
    
    # Generic host / account
    server: Optional[str] = Field(None, description="Server host, IP, or Snowflake account")
    account: Optional[str] = Field(None, description="Snowflake account identifier")
    port: Optional[int] = Field(None, description="Port number")
    
    # Auth
    username: str = Field("", description="Login username")
    password: str = Field("", description="Login password")
    authenticator: Optional[str] = Field("snowflake", description="Snowflake authenticator (snowflake, externalbrowser)")
    
    # Snowflake / Specifics
    warehouse: Optional[str] = Field(None, description="Warehouse name")
    database: Optional[str] = Field(None, description="Database name")
    schema_name: Optional[str] = Field(None, description="Schema name")
    role_name: Optional[str] = Field(None, description="Role name")
    
    # SQL Server specifics
    driver: Optional[str] = Field("ODBC Driver 17 for SQL Server", description="ODBC driver name")
    trust_server_certificate: bool = Field(True, description="Trust server certificate")
    connection_timeout: int = Field(60, description="Connection timeout in seconds")


class ConnectionTestResult(BaseModel):
    """Result of a connection test."""
    success: bool
    message: str
    database_type: DatabaseType
    role: Optional[str] = None
    server_version: Optional[str] = None
    databases: list[str] = Field(default_factory=list)


class ConnectionStatus(BaseModel):
    """Current connection status for a database."""
    connected: bool = False
    database_type: Optional[DatabaseType] = None
    server: Optional[str] = None
    database: Optional[str] = None
    schema_name: Optional[str] = None
