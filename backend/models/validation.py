"""Pydantic models for validation runs, results, and reporting."""

from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum
from datetime import datetime


class ValidationStatus(str, Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    WARNING = "WARNING"
    NOT_EXECUTED = "NOT_EXECUTED"
    ERROR = "ERROR"


class CellMismatchType(str, Enum):
    MATCH = "MATCH"
    MATCH_AFTER_NORMALIZATION = "MATCH_AFTER_NORMALIZATION"
    MISMATCH = "MISMATCH"
    SOURCE_NULL_TARGET_VALUE = "SOURCE_NULL_TARGET_VALUE"
    SOURCE_VALUE_TARGET_NULL = "SOURCE_VALUE_TARGET_NULL"
    MISSING_RECORD = "MISSING_RECORD"
    ADDITIONAL_RECORD = "ADDITIONAL_RECORD"
    NOT_COMPARED = "NOT_COMPARED"


class ValidationPhase(str, Enum):
    CONNECTION = "connection"
    SCHEMA = "schema"
    TABLE_DISCOVERY = "table_discovery"
    TABLE_MATCHING = "table_matching"
    USER_REVIEW = "user_review"
    COLUMN_MATCHING = "column_matching"
    COLUMN_REVIEW = "column_review"
    DATA_TYPE = "data_type"
    PRIMARY_KEY = "primary_key"
    ROW_COUNT = "row_count"
    RECORD_LEVEL = "record_level"
    HASH_COMPARISON = "hash_comparison"
    CELL_VALIDATION = "cell_validation"
    STATISTICS = "statistics"
    REPORT_GENERATION = "report_generation"


class ValidationRunRequest(BaseModel):
    """Request to start a validation run."""
    source_database: str
    source_schema: str
    target_database: str
    target_schema: str
    table_pairs: list[dict] = Field(default_factory=list)
    config_overrides: dict = Field(default_factory=dict)


class PhaseResult(BaseModel):
    """Result of a single validation phase."""
    phase: ValidationPhase
    status: ValidationStatus
    message: str = ""
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    duration_seconds: Optional[float] = None
    details: dict = Field(default_factory=dict)


class RowCountResult(BaseModel):
    """Row count comparison for a table pair."""
    source_table: str
    target_table: str
    source_count: int
    target_count: int
    difference: int
    status: ValidationStatus


class CellMismatch(BaseModel):
    """A single cell-level mismatch (§31.4)."""
    source_table: str
    target_table: str
    primary_key_values: dict
    source_column: str
    target_column: str
    source_value: Optional[str] = None
    target_value: Optional[str] = None
    normalized_source_value: Optional[str] = None
    normalized_target_value: Optional[str] = None
    difference: Optional[str] = None
    mismatch_type: CellMismatchType


class TableValidationResult(BaseModel):
    """Validation result for a single table pair (§31.2)."""
    source_table: str
    target_table: str
    table_match_score: float = 0.0
    column_match_score: float = 0.0
    data_type_status: ValidationStatus = ValidationStatus.NOT_EXECUTED
    source_count: Optional[int] = None
    target_count: Optional[int] = None
    missing_records: int = 0
    additional_records: int = 0
    cell_match_percentage: float = 0.0
    overall_status: ValidationStatus = ValidationStatus.NOT_EXECUTED
    column_results: list[dict] = Field(default_factory=list)
    mismatches: list[CellMismatch] = Field(default_factory=list)


class ValidationRun(BaseModel):
    """Complete validation run with all results."""
    run_id: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    source_database: str
    source_schema: str
    target_database: str
    target_schema: str
    total_source_tables: int = 0
    total_target_tables: int = 0
    tables_matched: int = 0
    tables_requiring_review: int = 0
    tables_unmatched: int = 0
    tables_passed: int = 0
    tables_failed: int = 0
    overall_success_pct: float = 0.0
    current_phase: Optional[ValidationPhase] = None
    phases: list[PhaseResult] = Field(default_factory=list)
    table_results: list[TableValidationResult] = Field(default_factory=list)
    status: ValidationStatus = ValidationStatus.NOT_EXECUTED


class ExecutiveSummary(BaseModel):
    """Executive summary for reporting (§31.1)."""
    run_id: str
    execution_start: datetime
    execution_end: Optional[datetime] = None
    source_schema: str
    target_schema: str
    total_source_tables: int
    total_target_tables: int
    tables_auto_matched: int
    tables_requiring_review: int
    tables_unmatched: int
    tables_passed: int
    tables_failed: int
    overall_success_pct: float
