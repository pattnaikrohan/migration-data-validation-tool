"""
Snowflake Connector
===================
Handles Snowflake connections, metadata queries, and schema discovery.
"""

import snowflake.connector
from typing import Optional
from models.connection import SnowflakeConnectionRequest, ConnectionTestResult, DatabaseType
from models.discovery import TableMetadata, ColumnMetadata, SchemaInfo


class SnowflakeConnector:
    """Manages Snowflake database connections and metadata queries."""
    
    def __init__(self):
        self.connection: Optional[snowflake.connector.SnowflakeConnection] = None
    
    def test_connection(self, request: SnowflakeConnectionRequest) -> ConnectionTestResult:
        """Test a Snowflake connection and return available databases."""
        try:
            conn = snowflake.connector.connect(
                account=request.account,
                user=request.username,
                password=request.password,
                warehouse=request.warehouse,
                database=request.database,
                schema=request.schema_name,
                role=request.role,
                login_timeout=request.connection_timeout,
            )
            
            cursor = conn.cursor()
            cursor.execute("SELECT CURRENT_VERSION()")
            version = cursor.fetchone()[0]
            
            cursor.execute("SHOW DATABASES")
            databases = [row[1] for row in cursor.fetchall()]
            
            conn.close()
            
            return ConnectionTestResult(
                success=True,
                message="Connected successfully to Snowflake",
                database_type=DatabaseType.SNOWFLAKE,
                server_version=f"Snowflake {version}",
                databases=databases,
            )
        except Exception as e:
            return ConnectionTestResult(
                success=False,
                message=f"Connection failed: {str(e)}",
                database_type=DatabaseType.SNOWFLAKE,
            )
    
    def connect(self, request: SnowflakeConnectionRequest) -> bool:
        """Establish a persistent connection."""
        try:
            self.connection = snowflake.connector.connect(
                account=request.account,
                user=request.username,
                password=request.password,
                warehouse=request.warehouse,
                database=request.database,
                schema=request.schema_name,
                role=request.role,
                login_timeout=request.connection_timeout,
            )
            return True
        except Exception:
            return False
    
    def get_schemas(self, database: str) -> list[SchemaInfo]:
        """Get all schemas in a database."""
        if not self.connection:
            return []
        try:
            cursor = self.connection.cursor()
            cursor.execute(f"USE DATABASE \"{database}\"")
            cursor.execute("""
                SELECT SCHEMA_NAME, 
                       (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES t 
                        WHERE t.TABLE_SCHEMA = s.SCHEMA_NAME AND t.TABLE_TYPE = 'BASE TABLE') as table_count
                FROM INFORMATION_SCHEMA.SCHEMATA s
                WHERE SCHEMA_NAME NOT IN ('INFORMATION_SCHEMA')
                ORDER BY SCHEMA_NAME
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
            cursor.execute(f'USE DATABASE "{database}"')
            cursor.execute(f'USE SCHEMA "{schema}"')
            
            cursor.execute(f"""
                SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_TYPE, ROW_COUNT
                FROM "{database}".INFORMATION_SCHEMA.TABLES
                WHERE TABLE_SCHEMA = '{schema}' AND TABLE_TYPE = 'BASE TABLE'
                ORDER BY TABLE_NAME
            """)
            
            tables = []
            for row in cursor.fetchall():
                table = TableMetadata(
                    table_name=row[0],
                    schema_name=row[1],
                    table_type=row[2],
                    row_count=row[3],
                )
                table.columns = self._get_columns(cursor, database, schema, row[0])
                table.primary_keys = self._get_primary_keys(cursor, database, schema, row[0])
                tables.append(table)
            
            return tables
        except Exception as e:
            print(f"Error getting tables: {e}")
            return []
    
    def _get_columns(self, cursor, database: str, schema: str, table: str) -> list[ColumnMetadata]:
        """Get column metadata for a table."""
        cursor.execute(f"""
            SELECT 
                COLUMN_NAME,
                DATA_TYPE,
                CHARACTER_MAXIMUM_LENGTH,
                NUMERIC_PRECISION,
                NUMERIC_SCALE,
                IS_NULLABLE,
                ORDINAL_POSITION,
                COLUMN_DEFAULT
            FROM "{database}".INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = '{schema}' AND TABLE_NAME = '{table}'
            ORDER BY ORDINAL_POSITION
        """)
        
        return [
            ColumnMetadata(
                column_name=row[0],
                data_type=row[1].upper() if row[1] else "UNKNOWN",
                max_length=row[2],
                numeric_precision=row[3],
                numeric_scale=row[4],
                is_nullable=row[5] == "YES",
                ordinal_position=row[6],
                column_default=row[7],
            )
            for row in cursor.fetchall()
        ]
    
    def _get_primary_keys(self, cursor, database: str, schema: str, table: str) -> list[str]:
        """Get primary key columns for a table."""
        try:
            cursor.execute(f"""
                SHOW PRIMARY KEYS IN "{database}"."{schema}"."{table}"
            """)
            rows = cursor.fetchall()
            return [row[4] for row in rows]  # Column name is at index 4
        except Exception:
            return []
    
    def disconnect(self):
        """Close the connection."""
        if self.connection:
            try:
                self.connection.close()
            except Exception:
                pass
            self.connection = None
