/**
 * Demo data for UI development and demonstration.
 * Provides realistic-looking mock data for all workflow stages.
 */

export const DEMO_SOURCE_TABLES = [
  { table_name: 'customer_master', schema_name: 'dbo', row_count: 1250000, columns: [
    { column_name: 'customer_id', data_type: 'INT', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'customer_name', data_type: 'NVARCHAR', max_length: 200, is_nullable: false, ordinal_position: 2 },
    { column_name: 'customer_type', data_type: 'VARCHAR', max_length: 50, is_nullable: true, ordinal_position: 3 },
    { column_name: 'email', data_type: 'NVARCHAR', max_length: 255, is_nullable: true, ordinal_position: 4 },
    { column_name: 'phone', data_type: 'VARCHAR', max_length: 20, is_nullable: true, ordinal_position: 5 },
    { column_name: 'created_date', data_type: 'DATETIME', is_nullable: false, ordinal_position: 6 },
    { column_name: 'modified_date', data_type: 'DATETIME', is_nullable: true, ordinal_position: 7 },
    { column_name: 'status_cd', data_type: 'VARCHAR', max_length: 10, is_nullable: false, ordinal_position: 8 },
  ], primary_keys: ['customer_id'] },
  { table_name: 'shipment_hdr', schema_name: 'dbo', row_count: 900000, columns: [
    { column_name: 'shipment_id', data_type: 'INT', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'order_id', data_type: 'INT', is_nullable: false, ordinal_position: 2 },
    { column_name: 'ship_date', data_type: 'DATETIME', is_nullable: false, ordinal_position: 3 },
    { column_name: 'carrier_cd', data_type: 'VARCHAR', max_length: 20, is_nullable: true, ordinal_position: 4 },
    { column_name: 'tracking_no', data_type: 'VARCHAR', max_length: 100, is_nullable: true, ordinal_position: 5 },
    { column_name: 'ship_addr', data_type: 'NVARCHAR', max_length: 500, is_nullable: true, ordinal_position: 6 },
  ], primary_keys: ['shipment_id'] },
  { table_name: 'invoice_dtl', schema_name: 'dbo', row_count: 4500000, columns: [
    { column_name: 'invoice_id', data_type: 'INT', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'line_no', data_type: 'INT', is_primary_key: true, is_nullable: false, ordinal_position: 2 },
    { column_name: 'product_cd', data_type: 'VARCHAR', max_length: 50, is_nullable: false, ordinal_position: 3 },
    { column_name: 'qty', data_type: 'DECIMAL', numeric_precision: 18, numeric_scale: 4, is_nullable: false, ordinal_position: 4 },
    { column_name: 'unit_price', data_type: 'MONEY', is_nullable: false, ordinal_position: 5 },
    { column_name: 'line_amt', data_type: 'MONEY', is_nullable: false, ordinal_position: 6 },
    { column_name: 'tax_amt', data_type: 'MONEY', is_nullable: true, ordinal_position: 7 },
  ], primary_keys: ['invoice_id', 'line_no'] },
  { table_name: 'sales_orders', schema_name: 'dbo', row_count: 2100000, columns: [
    { column_name: 'order_id', data_type: 'INT', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'cust_id', data_type: 'INT', is_nullable: false, ordinal_position: 2 },
    { column_name: 'order_dt', data_type: 'DATETIME', is_nullable: false, ordinal_position: 3 },
    { column_name: 'total_amt', data_type: 'MONEY', is_nullable: false, ordinal_position: 4 },
    { column_name: 'status', data_type: 'VARCHAR', max_length: 20, is_nullable: false, ordinal_position: 5 },
  ], primary_keys: ['order_id'] },
  { table_name: 'employee_master', schema_name: 'dbo', row_count: 15000, columns: [
    { column_name: 'emp_id', data_type: 'INT', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'emp_name', data_type: 'NVARCHAR', max_length: 150, is_nullable: false, ordinal_position: 2 },
    { column_name: 'dept_cd', data_type: 'VARCHAR', max_length: 10, is_nullable: true, ordinal_position: 3 },
    { column_name: 'hire_dt', data_type: 'DATE', is_nullable: false, ordinal_position: 4 },
    { column_name: 'mgr_id', data_type: 'INT', is_nullable: true, ordinal_position: 5 },
    { column_name: 'salary', data_type: 'DECIMAL', numeric_precision: 18, numeric_scale: 2, is_nullable: false, ordinal_position: 6 },
  ], primary_keys: ['emp_id'] },
  { table_name: 'product_catalog', schema_name: 'dbo', row_count: 85000, columns: [
    { column_name: 'product_id', data_type: 'INT', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'product_name', data_type: 'NVARCHAR', max_length: 300, is_nullable: false, ordinal_position: 2 },
    { column_name: 'category', data_type: 'VARCHAR', max_length: 50, is_nullable: true, ordinal_position: 3 },
    { column_name: 'list_price', data_type: 'MONEY', is_nullable: false, ordinal_position: 4 },
    { column_name: 'active_flg', data_type: 'BIT', is_nullable: false, ordinal_position: 5 },
  ], primary_keys: ['product_id'] },
  { table_name: 'order_history', schema_name: 'dbo', row_count: 8500000, columns: [
    { column_name: 'history_id', data_type: 'BIGINT', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'order_id', data_type: 'INT', is_nullable: false, ordinal_position: 2 },
    { column_name: 'event_type', data_type: 'VARCHAR', max_length: 30, is_nullable: false, ordinal_position: 3 },
    { column_name: 'event_dt', data_type: 'DATETIME2', is_nullable: false, ordinal_position: 4 },
  ], primary_keys: ['history_id'] },
  { table_name: 'payment_txn', schema_name: 'dbo', row_count: 3200000, columns: [
    { column_name: 'txn_id', data_type: 'INT', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'order_id', data_type: 'INT', is_nullable: false, ordinal_position: 2 },
    { column_name: 'txn_amt', data_type: 'MONEY', is_nullable: false, ordinal_position: 3 },
    { column_name: 'txn_dt', data_type: 'DATETIME', is_nullable: false, ordinal_position: 4 },
    { column_name: 'payment_method', data_type: 'VARCHAR', max_length: 30, is_nullable: true, ordinal_position: 5 },
  ], primary_keys: ['txn_id'] },
];

export const DEMO_TARGET_TABLES = [
  { table_name: 'CUSTOMER', schema_name: 'PUBLIC', row_count: 1250000, columns: [
    { column_name: 'CUSTOMER_ID', data_type: 'INTEGER', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'CUSTOMER_NAME', data_type: 'VARCHAR', max_length: 200, is_nullable: false, ordinal_position: 2 },
    { column_name: 'CUSTOMER_TYPE', data_type: 'VARCHAR', max_length: 50, is_nullable: true, ordinal_position: 3 },
    { column_name: 'EMAIL_ADDRESS', data_type: 'VARCHAR', max_length: 255, is_nullable: true, ordinal_position: 4 },
    { column_name: 'PHONE_NUMBER', data_type: 'VARCHAR', max_length: 20, is_nullable: true, ordinal_position: 5 },
    { column_name: 'CREATED_TIMESTAMP', data_type: 'TIMESTAMP_NTZ', is_nullable: false, ordinal_position: 6 },
    { column_name: 'MODIFIED_TIMESTAMP', data_type: 'TIMESTAMP_NTZ', is_nullable: true, ordinal_position: 7 },
    { column_name: 'STATUS_CODE', data_type: 'VARCHAR', max_length: 10, is_nullable: false, ordinal_position: 8 },
  ], primary_keys: ['CUSTOMER_ID'] },
  { table_name: 'SHIPMENT_HEADER', schema_name: 'PUBLIC', row_count: 899850, columns: [
    { column_name: 'SHIPMENT_ID', data_type: 'INTEGER', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'ORDER_ID', data_type: 'INTEGER', is_nullable: false, ordinal_position: 2 },
    { column_name: 'SHIP_DATE', data_type: 'TIMESTAMP_NTZ', is_nullable: false, ordinal_position: 3 },
    { column_name: 'CARRIER_CODE', data_type: 'VARCHAR', max_length: 20, is_nullable: true, ordinal_position: 4 },
    { column_name: 'TRACKING_NUMBER', data_type: 'VARCHAR', max_length: 100, is_nullable: true, ordinal_position: 5 },
    { column_name: 'SHIPPING_ADDRESS', data_type: 'VARCHAR', max_length: 500, is_nullable: true, ordinal_position: 6 },
  ], primary_keys: ['SHIPMENT_ID'] },
  { table_name: 'INVOICE_DETAIL', schema_name: 'PUBLIC', row_count: 4500000, columns: [
    { column_name: 'INVOICE_ID', data_type: 'INTEGER', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'LINE_NUMBER', data_type: 'INTEGER', is_primary_key: true, is_nullable: false, ordinal_position: 2 },
    { column_name: 'PRODUCT_CODE', data_type: 'VARCHAR', max_length: 50, is_nullable: false, ordinal_position: 3 },
    { column_name: 'QUANTITY', data_type: 'NUMBER', numeric_precision: 18, numeric_scale: 4, is_nullable: false, ordinal_position: 4 },
    { column_name: 'UNIT_PRICE', data_type: 'NUMBER', numeric_precision: 18, numeric_scale: 2, is_nullable: false, ordinal_position: 5 },
    { column_name: 'LINE_AMOUNT', data_type: 'NUMBER', numeric_precision: 18, numeric_scale: 2, is_nullable: false, ordinal_position: 6 },
    { column_name: 'TAX_AMOUNT', data_type: 'NUMBER', numeric_precision: 18, numeric_scale: 2, is_nullable: true, ordinal_position: 7 },
  ], primary_keys: ['INVOICE_ID', 'LINE_NUMBER'] },
  { table_name: 'SALES_ORDER', schema_name: 'PUBLIC', row_count: 2100000, columns: [
    { column_name: 'ORDER_ID', data_type: 'INTEGER', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'CUSTOMER_ID', data_type: 'INTEGER', is_nullable: false, ordinal_position: 2 },
    { column_name: 'ORDER_DATE', data_type: 'TIMESTAMP_NTZ', is_nullable: false, ordinal_position: 3 },
    { column_name: 'TOTAL_AMOUNT', data_type: 'NUMBER', numeric_precision: 18, numeric_scale: 2, is_nullable: false, ordinal_position: 4 },
    { column_name: 'ORDER_STATUS', data_type: 'VARCHAR', max_length: 20, is_nullable: false, ordinal_position: 5 },
  ], primary_keys: ['ORDER_ID'] },
  { table_name: 'EMPLOYEE', schema_name: 'PUBLIC', row_count: 15000, columns: [
    { column_name: 'EMPLOYEE_ID', data_type: 'INTEGER', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'EMPLOYEE_NAME', data_type: 'VARCHAR', max_length: 150, is_nullable: false, ordinal_position: 2 },
    { column_name: 'DEPARTMENT_CODE', data_type: 'VARCHAR', max_length: 10, is_nullable: true, ordinal_position: 3 },
    { column_name: 'HIRE_DATE', data_type: 'DATE', is_nullable: false, ordinal_position: 4 },
    { column_name: 'MANAGER_ID', data_type: 'INTEGER', is_nullable: true, ordinal_position: 5 },
    { column_name: 'SALARY', data_type: 'NUMBER', numeric_precision: 18, numeric_scale: 2, is_nullable: false, ordinal_position: 6 },
  ], primary_keys: ['EMPLOYEE_ID'] },
  { table_name: 'PRODUCT', schema_name: 'PUBLIC', row_count: 85000, columns: [
    { column_name: 'PRODUCT_ID', data_type: 'INTEGER', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'PRODUCT_NAME', data_type: 'VARCHAR', max_length: 300, is_nullable: false, ordinal_position: 2 },
    { column_name: 'CATEGORY', data_type: 'VARCHAR', max_length: 50, is_nullable: true, ordinal_position: 3 },
    { column_name: 'LIST_PRICE', data_type: 'NUMBER', numeric_precision: 18, numeric_scale: 2, is_nullable: false, ordinal_position: 4 },
    { column_name: 'IS_ACTIVE', data_type: 'BOOLEAN', is_nullable: false, ordinal_position: 5 },
  ], primary_keys: ['PRODUCT_ID'] },
  { table_name: 'PAYMENT_TRANSACTION', schema_name: 'PUBLIC', row_count: 3200000, columns: [
    { column_name: 'TRANSACTION_ID', data_type: 'INTEGER', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'ORDER_ID', data_type: 'INTEGER', is_nullable: false, ordinal_position: 2 },
    { column_name: 'TRANSACTION_AMOUNT', data_type: 'NUMBER', numeric_precision: 18, numeric_scale: 2, is_nullable: false, ordinal_position: 3 },
    { column_name: 'TRANSACTION_DATE', data_type: 'TIMESTAMP_NTZ', is_nullable: false, ordinal_position: 4 },
    { column_name: 'PAYMENT_METHOD', data_type: 'VARCHAR', max_length: 30, is_nullable: true, ordinal_position: 5 },
  ], primary_keys: ['TRANSACTION_ID'] },
  { table_name: 'INVENTORY_SNAPSHOT', schema_name: 'PUBLIC', row_count: 450000, columns: [
    { column_name: 'SNAPSHOT_ID', data_type: 'INTEGER', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'PRODUCT_ID', data_type: 'INTEGER', is_nullable: false, ordinal_position: 2 },
    { column_name: 'WAREHOUSE_ID', data_type: 'INTEGER', is_nullable: false, ordinal_position: 3 },
    { column_name: 'QUANTITY_ON_HAND', data_type: 'INTEGER', is_nullable: false, ordinal_position: 4 },
  ], primary_keys: ['SNAPSHOT_ID'] },
];

export const DEMO_TABLE_MATCHES = [
  { source_table: 'customer_master', target_table: 'CUSTOMER', score: 98.4, confidence: 'very_high', decision: 'auto_matched', source_row_count: 1250000, target_row_count: 1250000, source_column_count: 8, target_column_count: 8,
    explanation: { overall_score: 98.4, name_similarity: 96.2, token_similarity: 100, fuzzy_similarity: 97.5, column_similarity: 100, matched_columns_count: 8, matched_columns_pct: 100, normalized_source_name: 'customer master', normalized_target_name: 'customer' } },
  { source_table: 'shipment_hdr', target_table: 'SHIPMENT_HEADER', score: 99.1, confidence: 'very_high', decision: 'auto_matched', source_row_count: 900000, target_row_count: 899850, source_column_count: 6, target_column_count: 6,
    explanation: { overall_score: 99.1, name_similarity: 98.5, token_similarity: 100, fuzzy_similarity: 99.2, column_similarity: 100, matched_columns_count: 6, matched_columns_pct: 100, normalized_source_name: 'shipment header', normalized_target_name: 'shipment header' } },
  { source_table: 'invoice_dtl', target_table: 'INVOICE_DETAIL', score: 97.8, confidence: 'very_high', decision: 'auto_matched', source_row_count: 4500000, target_row_count: 4500000, source_column_count: 7, target_column_count: 7,
    explanation: { overall_score: 97.8, name_similarity: 96.0, token_similarity: 100, fuzzy_similarity: 96.8, column_similarity: 100, matched_columns_count: 7, matched_columns_pct: 100, normalized_source_name: 'invoice detail', normalized_target_name: 'invoice detail' } },
  { source_table: 'sales_orders', target_table: 'SALES_ORDER', score: 96.5, confidence: 'very_high', decision: 'auto_matched', source_row_count: 2100000, target_row_count: 2100000, source_column_count: 5, target_column_count: 5,
    explanation: { overall_score: 96.5, name_similarity: 95.0, token_similarity: 100, fuzzy_similarity: 95.8, column_similarity: 100, matched_columns_count: 5, matched_columns_pct: 100, normalized_source_name: 'sale order', normalized_target_name: 'sale order' } },
  { source_table: 'employee_master', target_table: 'EMPLOYEE', score: 84.2, confidence: 'medium', decision: 'pending', source_row_count: 15000, target_row_count: 15000, source_column_count: 6, target_column_count: 6,
    explanation: { overall_score: 84.2, name_similarity: 78.5, token_similarity: 80, fuzzy_similarity: 82.1, column_similarity: 95, matched_columns_count: 5, matched_columns_pct: 83.3, normalized_source_name: 'employee master', normalized_target_name: 'employee' } },
  { source_table: 'product_catalog', target_table: 'PRODUCT', score: 82.1, confidence: 'medium', decision: 'pending', source_row_count: 85000, target_row_count: 85000, source_column_count: 5, target_column_count: 5,
    explanation: { overall_score: 82.1, name_similarity: 72.5, token_similarity: 75, fuzzy_similarity: 80.2, column_similarity: 100, matched_columns_count: 5, matched_columns_pct: 100, normalized_source_name: 'product catalog', normalized_target_name: 'product' } },
  { source_table: 'payment_txn', target_table: 'PAYMENT_TRANSACTION', score: 93.6, confidence: 'high', decision: 'auto_matched', source_row_count: 3200000, target_row_count: 3200000, source_column_count: 5, target_column_count: 5,
    explanation: { overall_score: 93.6, name_similarity: 90.5, token_similarity: 100, fuzzy_similarity: 91.2, column_similarity: 100, matched_columns_count: 5, matched_columns_pct: 100, normalized_source_name: 'payment transaction', normalized_target_name: 'payment transaction' } },
  { source_table: 'order_history', target_table: null, score: 0, confidence: 'very_low', decision: 'pending', source_row_count: 8500000, target_row_count: null, source_column_count: 4, target_column_count: 0,
    explanation: null },
];

export const DEMO_VALIDATION_RESULTS = [
  { source_table: 'customer_master', target_table: 'CUSTOMER', table_match_score: 98.4, column_match_score: 96.5, data_type_status: 'PASS', source_count: 1250000, target_count: 1250000, missing_records: 0, additional_records: 0, cell_match_percentage: 99.97, overall_status: 'PASS' },
  { source_table: 'shipment_hdr', target_table: 'SHIPMENT_HEADER', table_match_score: 99.1, column_match_score: 98.2, data_type_status: 'WARNING', source_count: 900000, target_count: 899850, missing_records: 150, additional_records: 0, cell_match_percentage: 99.82, overall_status: 'FAIL' },
  { source_table: 'invoice_dtl', target_table: 'INVOICE_DETAIL', table_match_score: 97.8, column_match_score: 97.1, data_type_status: 'PASS', source_count: 4500000, target_count: 4500000, missing_records: 0, additional_records: 0, cell_match_percentage: 100, overall_status: 'PASS' },
  { source_table: 'sales_orders', target_table: 'SALES_ORDER', table_match_score: 96.5, column_match_score: 95.8, data_type_status: 'PASS', source_count: 2100000, target_count: 2100000, missing_records: 0, additional_records: 0, cell_match_percentage: 99.99, overall_status: 'PASS' },
  { source_table: 'employee_master', target_table: 'EMPLOYEE', table_match_score: 84.2, column_match_score: 91.4, data_type_status: 'PASS', source_count: 15000, target_count: 15000, missing_records: 0, additional_records: 0, cell_match_percentage: 100, overall_status: 'PASS' },
  { source_table: 'product_catalog', target_table: 'PRODUCT', table_match_score: 82.1, column_match_score: 89.3, data_type_status: 'WARNING', source_count: 85000, target_count: 85000, missing_records: 0, additional_records: 0, cell_match_percentage: 99.95, overall_status: 'WARNING' },
  { source_table: 'payment_txn', target_table: 'PAYMENT_TRANSACTION', table_match_score: 93.6, column_match_score: 94.7, data_type_status: 'PASS', source_count: 3200000, target_count: 3200000, missing_records: 0, additional_records: 0, cell_match_percentage: 100, overall_status: 'PASS' },
];

export const WORKFLOW_STEPS = [
  { id: 0, label: 'Connections', description: 'Source & Target DBs', icon: 'Plug' },
  { id: 1, label: 'Schema Selection', description: 'Databases & Schemas', icon: 'Database' },
  { id: 2, label: 'Table Discovery', description: 'Catalog & Metadata', icon: 'Search' },
  { id: 3, label: 'Table Matching', description: 'Intelligent Mapping', icon: 'GitCompare' },
  { id: 4, label: 'Column Mapping', description: 'Schema & Types', icon: 'Columns3' },
  { id: 5, label: 'Data Validation', description: 'Execution Pipeline', icon: 'ShieldCheck' },
  { id: 6, label: 'Summary & Reports', description: 'Audit & Export', icon: 'BarChart3' },
];

