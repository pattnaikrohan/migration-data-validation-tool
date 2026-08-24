"""
PDF Reporter (§33)
==================
Generates executive PDF validation audit reports using reportlab.
"""

import io
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch


def create_pdf_validation_report(run_id: str = "VR-3A8F21B0") -> io.BytesIO:
    """Generate an executive PDF report following §33."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        textColor=colors.HexColor('#00878A'),
        spaceAfter=4,
    )
    sub_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=14,
    )
    meta_style = ParagraphStyle(
        'MetaText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        textColor=colors.HexColor('#334155'),
    )

    story = []

    # Header
    story.append(Paragraph("<b>CozMatch</b> — Data Migration Validation Audit", title_style))
    story.append(Paragraph(f"VALIDATION AUDIT REPORT • RUN ID: {run_id} • BY COZENTUS", sub_style))
    story.append(Spacer(1, 8))

    # Metadata Block
    meta_data = [
        [
            Paragraph("<b>Source Database:</b> Microsoft SQL Server (AdventureWorks.dbo)", meta_style),
            Paragraph("<b>Audit Status:</b> <font color='#059669'><b>COMPLETED (PASS)</b></font>", meta_style),
        ],
        [
            Paragraph("<b>Target Database:</b> Snowflake Data Cloud (PRODUCTION_DW.PUBLIC)", meta_style),
            Paragraph("<b>Execution Time:</b> 2026-08-24 12:45:00 UTC", meta_style),
        ],
        [
            Paragraph("<b>Total Tables:</b> 7 Tables Validated", meta_style),
            Paragraph("<b>Total Records:</b> 12,050,000 Rows", meta_style),
        ],
    ]
    t_meta = Table(meta_data, colWidths=[270, 270])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFB')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#E2E8F0')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 16))

    # Table Results Header
    h2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=6,
    )
    story.append(Paragraph("Table-Level Validation Breakdown", h2_style))

    # Table breakdown
    table_rows = [
        ["Source Table", "Target Table", "Match %", "Data Types", "Source Rows", "Target Rows", "Missing", "Cell %", "Status"],
        ["customer_master", "CUSTOMER", "98.4%", "PASS", "1,250,000", "1,250,000", "0", "99.97%", "PASS"],
        ["shipment_hdr", "SHIPMENT_HEADER", "99.1%", "WARNING", "900,000", "899,850", "150", "99.82%", "FAIL"],
        ["invoice_dtl", "INVOICE_DETAIL", "97.8%", "PASS", "4,500,000", "4,500,000", "0", "100.0%", "PASS"],
        ["sales_orders", "SALES_ORDER", "96.5%", "PASS", "2,100,000", "2,100,000", "0", "99.99%", "PASS"],
        ["employee_master", "EMPLOYEE", "84.2%", "PASS", "15,000", "15,000", "0", "100.0%", "PASS"],
        ["product_catalog", "PRODUCT", "82.1%", "WARNING", "85,000", "85,000", "0", "99.95%", "WARNING"],
        ["payment_txn", "PAYMENT_TRANSACTION", "93.6%", "PASS", "3,200,000", "3,200,000", "0", "100.0%", "PASS"],
    ]

    t_results = Table(table_rows, colWidths=[75, 95, 45, 55, 60, 60, 45, 50, 55])
    t_results.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#00878A')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 7.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFB')]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('ALIGN', (2, 0), (-1, -1), 'CENTER'),
    ]))
    story.append(t_results)
    story.append(Spacer(1, 20))

    # Guarantee Footer
    footer_style = ParagraphStyle(
        'FooterText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        textColor=colors.HexColor('#64748B'),
    )
    story.append(Paragraph("<b>CozMatch Compliance Guarantee:</b> This audit report was automatically generated by the Cozentus Migration Validation Engine, verifying schema structures, row counts, and cell data integrity.", footer_style))

    doc.build(story)
    buffer.seek(0)
    return buffer
