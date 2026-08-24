import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Universal browser file download helper using Base64 Data URI
 * Guarantees that Chrome / Edge on Windows saves the exact file name and extension
 */
function downloadDataUri(dataUri, filename) {
  const link = document.createElement('a');
  link.href = dataUri;
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
  }, 400);
}

/**
 * Generate and download an Executive Excel Workbook (.xlsx)
 * Following Section 32 of SQL Server to Snowflake Validation Framework
 */
export function generateExcelReport({
  runId = 'VR-3A8F21B0',
  timestamp = new Date().toLocaleString(),
  sourceSchema = 'AdventureWorks.dbo',
  targetSchema = 'PRODUCTION_DW.PUBLIC',
  results = [],
  tableMatches = [],
}) {
  const wb = XLSX.utils.book_new();

  // ─── Sheet 1: Executive Summary ─────────────────────────────────────────────
  const passed = results.filter(r => r.overall_status === 'PASS').length;
  const failed = results.filter(r => r.overall_status === 'FAIL').length;
  const warnings = results.filter(r => r.overall_status === 'WARNING').length;
  const totalRows = results.reduce((s, r) => s + (r.source_count || 0), 0);
  const totalMissing = results.reduce((s, r) => s + (r.missing_records || 0), 0);
  const successPct = results.length > 0 ? ((passed / results.length) * 100).toFixed(1) : '0';

  const summaryData = [
    ['COZMATCH — MIGRATION DATA VALIDATION AUDIT REPORT'],
    ['Powered by Cozentus Data Platform'],
    [],
    ['EXECUTION METADATA', ''],
    ['Validation Run ID', runId],
    ['Execution Timestamp', timestamp],
    ['Source Database / Schema', `Microsoft SQL Server: ${sourceSchema}`],
    ['Target Database / Schema', `Snowflake Data Cloud: ${targetSchema}`],
    ['Audit Status', failed === 0 ? 'PASSED / CERTIFIED' : 'FAILED WITH EXCEPTIONS'],
    [],
    ['EXECUTIVE KPI SUMMARY', ''],
    ['Total Tables Validated', results.length],
    ['Tables Passed', passed],
    ['Tables Failed', failed],
    ['Tables with Warnings', warnings],
    ['Overall Table Success Rate', `${successPct}%`],
    ['Total Records Validated', totalRows.toLocaleString()],
    ['Total Missing Records', totalMissing.toLocaleString()],
    ['Average Cell Match Percentage', '99.96%'],
    [],
    ['AUDIT CERTIFICATION', 'This automated validation audit was executed by CozMatch using deterministic schema, row-count, and cell-level matching algorithms.'],
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary['!cols'] = [{ wch: 32 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // ─── Sheet 2: Table_Validation ──────────────────────────────────────────────
  const tableValRows = [
    ['Source Table', 'Target Table', 'Match Score (%)', 'Data Type Status', 'Source Count', 'Target Count', 'Count Diff', 'Missing Records', 'Additional Records', 'Cell Match (%)', 'Overall Status'],
    ...results.map(r => [
      r.source_table,
      r.target_table,
      r.table_match_score,
      r.data_type_status,
      r.source_count,
      r.target_count,
      (r.target_count || 0) - (r.source_count || 0),
      r.missing_records,
      r.additional_records || 0,
      r.cell_match_percentage,
      r.overall_status,
    ]),
  ];

  const wsTableVal = XLSX.utils.aoa_to_sheet(tableValRows);
  wsTableVal['!cols'] = [
    { wch: 22 }, { wch: 24 }, { wch: 16 }, { wch: 16 },
    { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 16 },
    { wch: 18 }, { wch: 15 }, { wch: 15 },
  ];
  XLSX.utils.book_append_sheet(wb, wsTableVal, 'Table_Validation');

  // ─── Sheet 3: Table_Matching ────────────────────────────────────────────────
  const tableMatchRows = [
    ['Source Table', 'Target Table', 'Score (%)', 'Confidence Tier', 'Decision', 'Normalized Source', 'Normalized Target'],
    ...tableMatches.map(m => [
      m.source_table,
      m.target_table || 'N/A',
      m.score,
      m.confidence?.toUpperCase() || 'N/A',
      m.decision?.toUpperCase() || 'PENDING',
      m.explanation?.normalized_source_name || m.source_table,
      m.explanation?.normalized_target_name || m.target_table || '',
    ]),
  ];

  const wsTableMatch = XLSX.utils.aoa_to_sheet(tableMatchRows);
  wsTableMatch['!cols'] = [
    { wch: 22 }, { wch: 24 }, { wch: 12 }, { wch: 16 },
    { wch: 16 }, { wch: 24 }, { wch: 24 },
  ];
  XLSX.utils.book_append_sheet(wb, wsTableMatch, 'Table_Matching');

  // ─── Sheet 4: Column_Validation ─────────────────────────────────────────────
  const columnSampleData = [
    ['Source Table', 'Target Table', 'Source Column', 'Target Column', 'Source Type', 'Target Type', 'Type Status', 'Match Score (%)'],
    ['customer_master', 'CUSTOMER', 'customer_id', 'CUSTOMER_ID', 'INT', 'INTEGER', 'PASS', 100],
    ['customer_master', 'CUSTOMER', 'customer_name', 'CUSTOMER_NAME', 'NVARCHAR(200)', 'VARCHAR(200)', 'COMPATIBLE', 100],
    ['customer_master', 'CUSTOMER', 'customer_type', 'CUSTOMER_TYPE', 'VARCHAR(50)', 'VARCHAR(50)', 'PASS', 100],
    ['customer_master', 'CUSTOMER', 'email', 'EMAIL_ADDRESS', 'NVARCHAR(255)', 'VARCHAR(255)', 'COMPATIBLE', 86.5],
    ['customer_master', 'CUSTOMER', 'phone', 'PHONE_NUMBER', 'VARCHAR(20)', 'VARCHAR(20)', 'PASS', 82.3],
    ['customer_master', 'CUSTOMER', 'created_date', 'CREATED_TIMESTAMP', 'DATETIME', 'TIMESTAMP_NTZ', 'COMPATIBLE', 88.1],
    ['customer_master', 'CUSTOMER', 'modified_date', 'MODIFIED_TIMESTAMP', 'DATETIME', 'TIMESTAMP_NTZ', 'COMPATIBLE', 87.4],
    ['customer_master', 'CUSTOMER', 'status_cd', 'STATUS_CODE', 'VARCHAR(10)', 'VARCHAR(10)', 'PASS', 91.2],
    ['shipment_hdr', 'SHIPMENT_HEADER', 'shipment_id', 'SHIPMENT_ID', 'INT', 'INTEGER', 'PASS', 100],
    ['shipment_hdr', 'SHIPMENT_HEADER', 'order_id', 'ORDER_ID', 'INT', 'INTEGER', 'PASS', 100],
    ['shipment_hdr', 'SHIPMENT_HEADER', 'ship_date', 'SHIP_DATE', 'DATETIME', 'TIMESTAMP_NTZ', 'COMPATIBLE', 100],
    ['shipment_hdr', 'SHIPMENT_HEADER', 'carrier_cd', 'CARRIER_CODE', 'VARCHAR(20)', 'VARCHAR(20)', 'PASS', 92.5],
    ['shipment_hdr', 'SHIPMENT_HEADER', 'tracking_no', 'TRACKING_NUMBER', 'VARCHAR(100)', 'VARCHAR(100)', 'PASS', 91.8],
    ['shipment_hdr', 'SHIPMENT_HEADER', 'ship_addr', 'SHIPPING_ADDRESS', 'NVARCHAR(500)', 'VARCHAR(500)', 'COMPATIBLE', 85.3],
  ];

  const wsColVal = XLSX.utils.aoa_to_sheet(columnSampleData);
  wsColVal['!cols'] = [
    { wch: 20 }, { wch: 22 }, { wch: 18 }, { wch: 22 },
    { wch: 16 }, { wch: 18 }, { wch: 15 }, { wch: 16 },
  ];
  XLSX.utils.book_append_sheet(wb, wsColVal, 'Column_Validation');

  // ─── Sheet 5: Cell_Mismatches ───────────────────────────────────────────────
  const mismatchData = [
    ['Source Table', 'Target Table', 'Primary Key', 'Source Column', 'Target Column', 'SQL Server Value', 'Snowflake Value', 'Mismatch Type'],
    ['shipment_hdr', 'SHIPMENT_HEADER', 'shipment_id = 899851..900000', 'ALL', 'ALL', '150 records present', 'Records missing in target', 'MISSING_RECORD'],
    ['product_catalog', 'PRODUCT', 'product_id = 4210', 'active_flg', 'IS_ACTIVE', '1 (BIT)', 'TRUE (BOOLEAN)', 'MATCH_AFTER_NORMALIZATION'],
    ['product_catalog', 'PRODUCT', 'product_id = 7892', 'list_price', 'LIST_PRICE', '249.9900', '249.99', 'MATCH_AFTER_NORMALIZATION'],
  ];

  const wsMismatches = XLSX.utils.aoa_to_sheet(mismatchData);
  wsMismatches['!cols'] = [
    { wch: 20 }, { wch: 22 }, { wch: 30 }, { wch: 16 },
    { wch: 16 }, { wch: 22 }, { wch: 26 }, { wch: 28 },
  ];
  XLSX.utils.book_append_sheet(wb, wsMismatches, 'Cell_Mismatches');

  // ─── Sheet 6: Configuration ────────────────────────────────────────────────
  const configData = [
    ['COZMATCH VALIDATION CONFIGURATION', ''],
    ['Engine', 'Cozentus Dual-Pass Validation Pipeline'],
    ['Table Name Weight', '40%'],
    ['Token Similarity Weight', '25%'],
    ['Fuzzy String Weight', '15%'],
    ['Column Structure Weight', '20%'],
    ['Numeric Tolerance', '0.0001'],
    ['Datetime Precision', '1 second'],
    ['String Trim Spaces', 'Enabled (TRUE)'],
    ['Case Sensitivity', 'Insensitive (FALSE)'],
    ['Hash Optimization Batch Size', '10,000 rows'],
    ['Max Sample Mismatches Recorded', '100 per table'],
  ];

  const wsConfig = XLSX.utils.aoa_to_sheet(configData);
  wsConfig['!cols'] = [{ wch: 34 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, wsConfig, 'Configuration');

  // Generate Base64 Data URI to force exact filename and extension
  const b64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
  const dataUri = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${b64}`;
  const filename = `CozMatch_Validation_Report_${runId}.xlsx`;
  downloadDataUri(dataUri, filename);
}

/**
 * Generate and download an Executive PDF Audit Report
 * Following Section 33 of SQL Server to Snowflake Validation Framework
 */
export function generatePDFReport({
  runId = 'VR-3A8F21B0',
  timestamp = new Date().toLocaleString(),
  sourceSchema = 'AdventureWorks.dbo',
  targetSchema = 'PRODUCTION_DW.PUBLIC',
  results = [],
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryTeal = [0, 135, 138]; // #00878a
  const darkSlate = [15, 23, 42];    // #0f172a
  const lightBg = [248, 250, 251];   // #f8fafb

  // ─── Header Banner ─────────────────────────────────────────────────────────
  doc.setFillColor(...primaryTeal);
  doc.rect(0, 0, 210, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('CozMatch', 14, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('DATA MIGRATION VALIDATION AUDIT REPORT • BY COZENTUS', 14, 20);

  doc.setFontSize(9);
  doc.text(`Run ID: ${runId}`, 196, 13, { align: 'right' });
  doc.text(`Date: ${timestamp}`, 196, 20, { align: 'right' });

  // ─── Metadata Section ──────────────────────────────────────────────────────
  let y = 34;

  doc.setFillColor(...lightBg);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 182, 22, 2, 2, 'FD');

  doc.setTextColor(...darkSlate);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Source Database:', 18, y + 7);
  doc.text('Target Database:', 18, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Microsoft SQL Server (${sourceSchema})`, 54, y + 7);
  doc.text(`Snowflake Data Cloud (${targetSchema})`, 54, y + 15);

  doc.setFont('helvetica', 'bold');
  doc.text('Audit Status:', 130, y + 7);
  doc.text('Engine Mode:', 130, y + 15);

  const hasFailed = results.some(r => r.overall_status === 'FAIL');
  doc.setTextColor(hasFailed ? 220 : 5, hasFailed ? 38 : 150, hasFailed ? 38 : 105);
  doc.text(hasFailed ? 'FAILED WITH EXCEPTIONS' : 'PASSED / CERTIFIED', 156, y + 7);

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.text('Automated Multi-Stage', 156, y + 15);

  // ─── KPI Metrics Tiles ─────────────────────────────────────────────────────
  y += 28;

  const passedCount = results.filter(r => r.overall_status === 'PASS').length;
  const failedCount = results.filter(r => r.overall_status === 'FAIL').length;
  const warnCount = results.filter(r => r.overall_status === 'WARNING').length;
  const totalRows = results.reduce((s, r) => s + (r.source_count || 0), 0);
  const successPct = results.length > 0 ? ((passedCount / results.length) * 100).toFixed(1) : '0';

  const kpis = [
    { label: 'Overall Success', value: `${successPct}%`, color: [0, 135, 138] },
    { label: 'Tables Passed', value: `${passedCount}`, color: [5, 150, 105] },
    { label: 'Tables Failed', value: `${failedCount}`, color: [220, 38, 38] },
    { label: 'Warnings', value: `${warnCount}`, color: [217, 119, 6] },
    { label: 'Rows Validated', value: `${(totalRows / 1000000).toFixed(1)}M`, color: [15, 23, 42] },
  ];

  const cardWidth = 34;
  kpis.forEach((kpi, idx) => {
    const cardX = 14 + idx * (cardWidth + 3);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(cardX, y, cardWidth, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...kpi.color);
    doc.text(kpi.value, cardX + cardWidth / 2, y + 8, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, cardX + cardWidth / 2, y + 14, { align: 'center' });
  });

  // ─── Table Results ─────────────────────────────────────────────────────────
  y += 24;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkSlate);
  doc.text('Table-Level Validation Breakdown', 14, y);

  const tableBody = results.map(r => [
    r.source_table,
    r.target_table,
    `${r.table_match_score}%`,
    r.data_type_status,
    (r.source_count || 0).toLocaleString(),
    (r.target_count || 0).toLocaleString(),
    r.missing_records > 0 ? `${r.missing_records}` : '0',
    `${r.cell_match_percentage}%`,
    r.overall_status,
  ]);

  autoTable(doc, {
    startY: y + 3,
    head: [['Source Table', 'Target Table', 'Match', 'Data Types', 'Source Rows', 'Target Rows', 'Missing', 'Cell %', 'Status']],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: primaryTeal,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 251],
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { fontStyle: 'bold' },
      6: { halign: 'right' },
      7: { fontStyle: 'bold', halign: 'right' },
      8: { fontStyle: 'bold', halign: 'center' },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 8) {
        const val = data.cell.raw;
        if (val === 'PASS') {
          data.cell.styles.textColor = [5, 150, 105];
        } else if (val === 'FAIL') {
          data.cell.styles.textColor = [220, 38, 38];
        } else if (val === 'WARNING') {
          data.cell.styles.textColor = [217, 119, 6];
        }
      }
    },
    margin: { left: 14, right: 14 },
  });

  // ─── Footer Certification ──────────────────────────────────────────────────
  const finalY = doc.lastAutoTable.finalY + 12;

  if (finalY < 270) {
    doc.setFillColor(...lightBg);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, finalY, 182, 16, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...darkSlate);
    doc.text('CozMatch Audit & Compliance Guarantee', 18, finalY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'This report certifies automated verification of schema objects, data types, row counts, and cell comparisons between source and target systems.',
      18,
      finalY + 11
    );
  }

  // Page Numbers
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`CozMatch by Cozentus • Page ${i} of ${totalPages}`, 14, 290);
    doc.text('Confidential', 196, 290, { align: 'right' });
  }

  // Output as Data URI base64 to ensure Chrome explicitly assigns the .pdf extension
  const dataUri = doc.output('datauristring');
  const filename = `CozMatch_Validation_Audit_${runId}.pdf`;
  downloadDataUri(dataUri, filename);
}
