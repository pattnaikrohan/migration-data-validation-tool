"""
SQL Server Connector
====================
Handles SQL Server connections, metadata queries, and schema discovery.
"""

import pyodbc
from typing import Optional
from models.connection import SQLServerConnectionRequest, ConnectionTestResult, DatabaseType
from models.discovery import TableMetadata, ColumnMetadata, SchemaInfo, DatabaseInfo


class SQLServerConnector:
    """Manages SQL Server database connections and metadata queries."""
    
    def __init__(self):
        self.connection: Optional[pyodbc.Connection] = None
        self.connection_string: Optional[str] = None
    
    def _build_connection_string(self, request: SQLServerConnectionRequest) -> str:
        """Build ODBC connection string from request parameters."""
        parts = [
            f"DRIVER={{{request.driver}}}",
            f"SERVER={request.server},{request.port}",
            f"UID={request.username}",
            f"PWD={request.password}",
            f"TrustServerCertificate={'yes' if request.trust_server_certificate else 'no'}",
            f"Connection Timeout={request.connection_timeout}",
        ]
        if request.database:
            parts.append(f"DATABASE={request.database}")
        return ";".join(parts)
    
    def test_connection(self, request: SQLServerConnectionRequest) -> ConnectionTestResult:
        """Test a SQL Server connection and return available databases."""
        try:
            conn_str = self._build_connection_string(request)
            conn = pyodbc.connect(conn_str, timeout=request.connection_timeout)
            
            # Get server version
            cursor = conn.cursor()
            cursor.execute("SELECT @@VERSION")
            version = cursor.fetchone()[0].split("\n")[0]
            
            # Get databases
            cursor.execute("SELECT name FROM sys.databases WHERE state_desc = 'ONLINE' ORDER BY name")
            databases = [row[0] for row in cursor.fetchall()]
            
            conn.close()
            
            return ConnectionTestResult(
                success=True,
                message="Connected successfully to SQL Server",
                database_type=DatabaseType.SQL_SERVER,
                server_version=version,
                databases=databases,
            )
        except Exception as e:
            return ConnectionTestResult(
                success=False,
                message=f"Connection failed: {str(e)}",
                database_type=DatabaseType.SQL_SERVER,
            )
    
    def connect(self, request: SQLServerConnectionRequest) -> bool:
        """Establish a persistent connection."""
        try:
            self.connection_string = self._build_connection_string(request)
            self.connection = pyodbc.connect(self.connection_string, timeout=request.connection_timeout)
            return True
        except Exception:
            return False
    
    def get_schemas(self, database: str) -> list[SchemaInfo]:
        """Get all schemas in a database."""
        if not self.connection:
            return []
        try:
            cursor = self.connection.cursor()
            cursor.execute(f"USE [{database}]")
            cursor.execute("""
                SELECT s.name, COUNT(t.name) as table_count
                FROM sys.schemas s
                LEFT JOIN sys.tables t ON t.schema_id = s.schema_id
                WHERE s.name NOT IN ('sys', 'INFORMATION_SCHEMA', 'guest')
                GROUP BY s.name
                ORDER BY s.name
            """)
            return [
                SchemaInfo(schema_name=row[0], table_count=row[1])
                for row in cursor.fetchall()
            ]
        except Exception:
            return []
    
    def get_tables(self, database: str, schema: str) -> list[TableMetadata]:
        """Get all tables with metadata in a schema."""
        if not self.connection:
            return []
        try:
            cursor = self.connection.cursor()
            cursor.execute(f"USE [{database}]")
            
            # Get tables with row counts
            cursor.execute(f"""
                SELECT 
                    t.name AS table_name,
                    s.name AS schema_name,
                    t.type_desc AS table_type,
                    p.rows AS row_count
                FROM sys.tables t
                INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
                LEFT JOIN sys.partitions p ON t.object_id = p.object_id AND p.index_id IN (0, 1)
                WHERE s.name = ?
                ORDER BY t.name
            """, schema)
            
            tables = []
            for row in cursor.fetchall():
                table = TableMetadata(
                    table_name=row[0],
                    schema_name=row[1],
                    table_type=row[2] or "BASE TABLE",
                    row_count=row[3],
                )
                
                # Get columns
                table.columns = self._get_columns(cursor, database, schema, row[0])
                
                # Get primary keys
                table.primary_keys = self._get_primary_keys(cursor, schema, row[0])
                
                tables.append(table)
            
            return tables
        except Exception as e:
            print(f"Error getting tables: {e}")
            return []
    
    def _get_columns(self, cursor, database: str, schema: str, table: str) -> list[ColumnMetadata]:
        """Get column metadata for a table."""
        cursor.execute(f"""
            SELECT 
                c.COLUMN_NAME,
                c.DATA_TYPE,
                c.CHARACTER_MAXIMUM_LENGTH,
                c.NUMERIC_PRECISION,
                c.NUMERIC_SCALE,
                c.IS_NULLABLE,
                c.ORDINAL_POSITION,
                c.COLUMN_DEFAULT
            FROM [{database}].INFORMATION_SCHEMA.COLUMNS c
            WHERE c.TABLE_SCHEMA = ? AND c.TABLE_NAME = ?
            ORDER BY c.ORDINAL_POSITION
        """, schema, table)
        
        return [
            ColumnMetadata(
                column_name=row[0],
                data_type=row[1].upper(),
                max_length=row[2],
                numeric_precision=row[3],
                numeric_scale=row[4],
                is_nullable=row[5] == "YES",
                ordinal_position=row[6],
                column_default=row[7],
            )
            for row in cursor.fetchall()
        ]
    
    def _get_primary_keys(self, cursor, schema: str, table: str) -> list[str]:
        """Get primary key columns for a table."""
        cursor.execute("""
            SELECT c.COLUMN_NAME
            FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
            JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE c 
                ON tc.CONSTRAINT_NAME = c.CONSTRAINT_NAME
                AND tc.TABLE_SCHEMA = c.TABLE_SCHEMA
            WHERE tc.TABLE_SCHEMA = ? AND tc.TABLE_NAME = ?
                AND tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
            ORDER BY c.ORDINAL_POSITION
        """, schema, table)
        return [row[0] for row in cursor.fetchall()]
    
    def disconnect(self):
        """Close the connection."""
        if self.connection:
            try:
                self.connection.close()
            except Exception:
                pass
            self.connection = None
