"""API routes for validation execution and results."""

from fastapi import APIRouter, HTTPException
from models.validation import ValidationRunRequest, ValidationRun
from services.validation_orchestrator import (
    create_validation_run, get_validation_run,
    get_executive_summary, list_runs,
)

router = APIRouter()


@router.post("/run", response_model=ValidationRun)
async def start_validation(request: ValidationRunRequest):
    """Start a new validation run."""
    run = create_validation_run(request)
    return run


@router.get("/status/{run_id}")
async def get_run_status(run_id: str):
    """Get the current status of a validation run."""
    run = get_validation_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Validation run not found")
    return run


@router.get("/results/{run_id}")
async def get_run_results(run_id: str):
    """Get detailed results for a validation run."""
    run = get_validation_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Validation run not found")
    return {
        "run": run,
        "summary": get_executive_summary(run_id),
    }


@router.get("/runs")
async def get_all_runs():
    """List all validation runs."""
    return {"runs": list_runs()}
