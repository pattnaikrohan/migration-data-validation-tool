"""API routes for report generation."""

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from services.excel_reporter import create_excel_validation_report
from services.pdf_reporter import create_pdf_validation_report

router = APIRouter()


@router.get("/{run_id}/excel/{filename}")
async def generate_excel_report(run_id: str, filename: str):
    """Generate and stream an Excel validation report workbook."""
    buffer = create_excel_validation_report(run_id=run_id)
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f'attachment; filename="CozMatch_Validation_Report_{run_id}.xlsx"',
            "Access-Control-Expose-Headers": "Content-Disposition",
        },
    )


@router.get("/{run_id}/pdf/{filename}")
async def generate_pdf_report(run_id: str, filename: str):
    """Generate and stream an executive PDF validation audit report."""
    buffer = create_pdf_validation_report(run_id=run_id)
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="CozMatch_Validation_Audit_{run_id}.pdf"',
            "Access-Control-Expose-Headers": "Content-Disposition",
        },
    )
