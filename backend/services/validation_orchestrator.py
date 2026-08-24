"""
Validation Orchestrator (§26)
=============================
Coordinates the full validation pipeline and manages state.
"""

import uuid
from datetime import datetime
from typing import Optional
from models.validation import (
    ValidationRun, ValidationPhase, ValidationStatus,
    PhaseResult, TableValidationResult, RowCountResult,
    ValidationRunRequest, ExecutiveSummary,
)
from models.matching import TableMatchingSummary, MatchDecision


# In-memory store for validation runs (would be a database in production)
_validation_runs: dict[str, ValidationRun] = {}


def create_validation_run(request: ValidationRunRequest) -> ValidationRun:
    """Create a new validation run."""
    run = ValidationRun(
        run_id=str(uuid.uuid4())[:8].upper(),
        started_at=datetime.now(),
        source_database=request.source_database,
        source_schema=request.source_schema,
        target_database=request.target_database,
        target_schema=request.target_schema,
        status=ValidationStatus.NOT_EXECUTED,
    )
    _validation_runs[run.run_id] = run
    return run


def get_validation_run(run_id: str) -> Optional[ValidationRun]:
    """Get a validation run by ID."""
    return _validation_runs.get(run_id)


def update_phase(run_id: str, phase: ValidationPhase, status: ValidationStatus, message: str = "", details: dict = None):
    """Update the current phase of a validation run."""
    run = _validation_runs.get(run_id)
    if not run:
        return
    
    run.current_phase = phase
    phase_result = PhaseResult(
        phase=phase,
        status=status,
        message=message,
        started_at=datetime.now(),
        details=details or {},
    )
    
    # Update or append phase
    existing = next((p for p in run.phases if p.phase == phase), None)
    if existing:
        idx = run.phases.index(existing)
        phase_result.started_at = existing.started_at
        phase_result.completed_at = datetime.now()
        if phase_result.started_at:
            phase_result.duration_seconds = (
                phase_result.completed_at - phase_result.started_at
            ).total_seconds()
        run.phases[idx] = phase_result
    else:
        run.phases.append(phase_result)


def add_table_result(run_id: str, result: TableValidationResult):
    """Add a table validation result."""
    run = _validation_runs.get(run_id)
    if run:
        run.table_results.append(result)


def finalize_run(run_id: str):
    """Calculate final statistics and finalize the run."""
    run = _validation_runs.get(run_id)
    if not run:
        return
    
    run.completed_at = datetime.now()
    
    passed = sum(1 for t in run.table_results if t.overall_status == ValidationStatus.PASS)
    failed = sum(1 for t in run.table_results if t.overall_status == ValidationStatus.FAIL)
    
    run.tables_passed = passed
    run.tables_failed = failed
    
    total = len(run.table_results)
    run.overall_success_pct = (passed / total * 100) if total > 0 else 0.0
    
    run.status = ValidationStatus.PASS if failed == 0 and total > 0 else ValidationStatus.FAIL


def get_executive_summary(run_id: str) -> Optional[ExecutiveSummary]:
    """Generate an executive summary for a validation run."""
    run = _validation_runs.get(run_id)
    if not run:
        return None
    
    return ExecutiveSummary(
        run_id=run.run_id,
        execution_start=run.started_at,
        execution_end=run.completed_at,
        source_schema=f"{run.source_database}.{run.source_schema}",
        target_schema=f"{run.target_database}.{run.target_schema}",
        total_source_tables=run.total_source_tables,
        total_target_tables=run.total_target_tables,
        tables_auto_matched=run.tables_matched,
        tables_requiring_review=run.tables_requiring_review,
        tables_unmatched=run.tables_unmatched,
        tables_passed=run.tables_passed,
        tables_failed=run.tables_failed,
        overall_success_pct=run.overall_success_pct,
    )


def list_runs() -> list[ValidationRun]:
    """List all validation runs."""
    return list(_validation_runs.values())
