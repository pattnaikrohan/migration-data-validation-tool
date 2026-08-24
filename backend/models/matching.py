"""Pydantic models for table and column matching."""

from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class MatchConfidence(str, Enum):
    VERY_HIGH = "very_high"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    VERY_LOW = "very_low"


class MatchDecision(str, Enum):
    AUTO_MATCHED = "auto_matched"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXCLUDED = "excluded"
    MANUAL_MAPPED = "manual_mapped"
    PENDING = "pending"


class MatchExplanation(BaseModel):
    """Detailed explanation of why a match was proposed (§13)."""
    overall_score: float
    name_similarity: float
    token_similarity: float
    fuzzy_similarity: float
    column_similarity: float
    matched_columns_count: int = 0
    matched_columns_pct: float = 0.0
    conflicting_columns: list[str] = Field(default_factory=list)
    normalized_source_name: str = ""
    normalized_target_name: str = ""


class AlternativeCandidate(BaseModel):
    """An alternative target table candidate."""
    target_table: str
    score: float
    confidence: MatchConfidence


class TableMatchResult(BaseModel):
    """Result of matching a source table to a target table."""
    source_table: str
    source_schema: str
    target_table: Optional[str] = None
    target_schema: Optional[str] = None
    score: float = 0.0
    confidence: MatchConfidence = MatchConfidence.VERY_LOW
    decision: MatchDecision = MatchDecision.PENDING
    explanation: Optional[MatchExplanation] = None
    alternatives: list[AlternativeCandidate] = Field(default_factory=list)
    source_row_count: Optional[int] = None
    target_row_count: Optional[int] = None
    source_column_count: int = 0
    target_column_count: int = 0


class ColumnMatchResult(BaseModel):
    """Result of matching a source column to a target column."""
    source_column: str
    target_column: Optional[str] = None
    score: float = 0.0
    confidence: MatchConfidence = MatchConfidence.VERY_LOW
    decision: MatchDecision = MatchDecision.PENDING
    source_data_type: str = ""
    target_data_type: Optional[str] = None
    data_type_status: str = ""
    source_precision: Optional[int] = None
    target_precision: Optional[int] = None
    source_scale: Optional[int] = None
    target_scale: Optional[int] = None
    source_length: Optional[int] = None
    target_length: Optional[int] = None


class TableMatchingRequest(BaseModel):
    """Request to run automatic table matching."""
    source_database: str
    source_schema: str
    target_database: str
    target_schema: str


class MatchDecisionUpdate(BaseModel):
    """Update the decision for a table or column match."""
    source_name: str
    decision: MatchDecision
    manual_target: Optional[str] = None


class TableMatchingSummary(BaseModel):
    """Summary of table matching results."""
    total_source_tables: int = 0
    total_target_tables: int = 0
    auto_matched: int = 0
    needs_review: int = 0
    unmatched_source: int = 0
    unmatched_target: int = 0
    matches: list[TableMatchResult] = Field(default_factory=list)
    unmatched_source_tables: list[str] = Field(default_factory=list)
    unmatched_target_tables: list[str] = Field(default_factory=list)
