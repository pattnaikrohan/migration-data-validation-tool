"""Pydantic models for schema, table, and column discovery."""

from pydantic import BaseModel, Field
from typing import Optional


class ColumnMetadata(BaseModel):
    """Metadata for a single database column."""
    column_name: str
    data_type: str
    max_length: Optional[int] = None
    numeric_precision: Optional[int] = None
    numeric_scale: Optional[int] = None
    is_nullable: bool = True
    is_primary_key: bool = False
    ordinal_position: int = 0
    column_default: Optional[str] = None


class TableMetadata(BaseModel):
    """Metadata for a single database table."""
    table_name: str
    schema_name: str
    table_type: str = "BASE TABLE"
    row_count: Optional[int] = None
    columns: list[ColumnMetadata] = Field(default_factory=list)
    primary_keys: list[str] = Field(default_factory=list)


class SchemaInfo(BaseModel):
    """Schema information."""
    schema_name: str
    table_count: Optional[int] = None


class DatabaseInfo(BaseModel):
    """Database information."""
    database_name: str
    schemas: list[SchemaInfo] = Field(default_factory=list)


class DiscoveryResult(BaseModel):
    """Result of table discovery for a schema."""
    database_name: str
    schema_name: str
    tables: list[TableMetadata] = Field(default_factory=list)
    total_tables: int = 0
    excluded_tables: list[str] = Field(default_factory=list)
