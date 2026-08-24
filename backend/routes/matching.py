"""API routes for table and column matching supporting any source and target database pair."""

from fastapi import APIRouter, HTTPException
from models.matching import TableMatchingRequest, MatchDecisionUpdate, TableMatchingSummary
from services.table_matching import match_tables
from services.column_matching import match_columns
from routes.connections import role_connectors, sql_connector, sf_connector

router = APIRouter()

# In-memory state for current matching session
_current_matching: dict = {}


@router.post("/tables", response_model=TableMatchingSummary)
async def run_table_matching(request: TableMatchingRequest):
    """Run automatic table matching between source and target schemas."""
    source_connector = role_connectors.get("source") or sql_connector
    target_connector = role_connectors.get("target") or sf_connector
    
    if not source_connector or not source_connector.connection:
        # If not connected in live mode, check if we have demo data or return error
        raise HTTPException(status_code=400, detail="Source database is not connected")
    if not target_connector or not target_connector.connection:
        raise HTTPException(status_code=400, detail="Target database is not connected")
    
    # Get tables from both sides
    source_tables = source_connector.get_tables(request.source_database, request.source_schema)
    target_tables = target_connector.get_tables(request.target_database, request.target_schema)
    
    if not source_tables:
        raise HTTPException(status_code=400, detail="No source tables found in the specified source schema")
    if not target_tables:
        raise HTTPException(status_code=400, detail="No target tables found in the specified target schema")
    
    summary = match_tables(source_tables, target_tables)
    
    # Store for later use
    _current_matching["summary"] = summary
    _current_matching["source_tables"] = {t.table_name: t for t in source_tables}
    _current_matching["target_tables"] = {t.table_name: t for t in target_tables}
    
    return summary


@router.put("/tables/decisions")
async def update_table_decisions(decisions: list[MatchDecisionUpdate]):
    """Update user decisions for table matches."""
    summary = _current_matching.get("summary")
    if not summary:
        raise HTTPException(status_code=400, detail="No matching session active")
    
    for decision in decisions:
        match = next(
            (m for m in summary.matches if m.source_table == decision.source_name),
            None,
        )
        if match:
            match.decision = decision.decision
            if decision.manual_target:
                match.target_table = decision.manual_target
    
    return {"success": True, "updated": len(decisions)}


@router.post("/columns/{source_table}/{target_table}")
async def run_column_matching(source_table: str, target_table: str):
    """Run automatic column matching for a table pair."""
    source_tables = _current_matching.get("source_tables", {})
    target_tables = _current_matching.get("target_tables", {})
    
    src = source_tables.get(source_table)
    tgt = target_tables.get(target_table)
    
    if not src or not tgt:
        raise HTTPException(status_code=404, detail="Table pair not found in active matching session")
    
    results = match_columns(src, tgt)
    return {"columns": [r.model_dump() for r in results]}
