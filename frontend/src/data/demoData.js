/**
 * Demo data for UI development and demonstration.
 * DDL Migration tables: DimDate, DimIncoTerm, DimPaymentTerm, DimTime
 */

export const DEMO_SOURCE_TABLES = [
  { table_name: 'DimDate', schema_name: 'dbo', row_count: 3652, columns: [
    { column_name: 'DateKey', data_type: 'INT', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'FullDate', data_type: 'DATE', is_nullable: false, ordinal_position: 2 },
    { column_name: 'DayOfWeek', data_type: 'TINYINT', is_nullable: false, ordinal_position: 3 },
    { column_name: 'DayName', data_type: 'VARCHAR', max_length: 10, is_nullable: false, ordinal_position: 4 },
    { column_name: 'DayOfMonth', data_type: 'TINYINT', is_nullable: false, ordinal_position: 5 },
    { column_name: 'DayOfYear', data_type: 'SMALLINT', is_nullable: false, ordinal_position: 6 },
    { column_name: 'MonthNumber', data_type: 'TINYINT', is_nullable: false, ordinal_position: 7 },
    { column_name: 'MonthName', data_type: 'VARCHAR', max_length: 10, is_nullable: false, ordinal_position: 8 },
    { column_name: 'Quarter', data_type: 'TINYINT', is_nullable: false, ordinal_position: 9 },
    { column_name: 'Year', data_type: 'SMALLINT', is_nullable: false, ordinal_position: 10 },
    { column_name: 'IsWeekend', data_type: 'BIT', is_nullable: false, ordinal_position: 11 },
    { column_name: 'IsHoliday', data_type: 'BIT', is_nullable: false, ordinal_position: 12 },
  ], primary_keys: ['DateKey'] },

  { table_name: 'DimIncoTerm', schema_name: 'dbo', row_count: 11, columns: [
    { column_name: 'IncoTermKey', data_type: 'INT', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'IncoTermCode', data_type: 'VARCHAR', max_length: 10, is_nullable: false, ordinal_position: 2 },
    { column_name: 'IncoTermDescription', data_type: 'NVARCHAR', max_length: 200, is_nullable: false, ordinal_position: 3 },
    { column_name: 'ResponsibilityTransfer', data_type: 'VARCHAR', max_length: 100, is_nullable: true, ordinal_position: 4 },
    { column_name: 'FreightResponsibility', data_type: 'VARCHAR', max_length: 50, is_nullable: true, ordinal_position: 5 },
    { column_name: 'InsuranceRequired', data_type: 'BIT', is_nullable: false, ordinal_position: 6 },
  ], primary_keys: ['IncoTermKey'] },

  { table_name: 'DimPaymentTerm', schema_name: 'dbo', row_count: 15, columns: [
    { column_name: 'PaymentTermKey', data_type: 'INT', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'PaymentTermCode', data_type: 'VARCHAR', max_length: 20, is_nullable: false, ordinal_position: 2 },
    { column_name: 'PaymentTermDescription', data_type: 'NVARCHAR', max_length: 200, is_nullable: false, ordinal_position: 3 },
    { column_name: 'DueDays', data_type: 'INT', is_nullable: false, ordinal_position: 4 },
    { column_name: 'DiscountPercent', data_type: 'DECIMAL', numeric_precision: 5, numeric_scale: 2, is_nullable: true, ordinal_position: 5 },
    { column_name: 'DiscountDays', data_type: 'INT', is_nullable: true, ordinal_position: 6 },
    { column_name: 'IsActive', data_type: 'BIT', is_nullable: false, ordinal_position: 7 },
  ], primary_keys: ['PaymentTermKey'] },

  { table_name: 'DimTime', schema_name: 'dbo', row_count: 1440, columns: [
    { column_name: 'TimeKey', data_type: 'INT', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'Hour24', data_type: 'TINYINT', is_nullable: false, ordinal_position: 2 },
    { column_name: 'Hour12', data_type: 'TINYINT', is_nullable: false, ordinal_position: 3 },
    { column_name: 'Minute', data_type: 'TINYINT', is_nullable: false, ordinal_position: 4 },
    { column_name: 'Second', data_type: 'TINYINT', is_nullable: false, ordinal_position: 5 },
    { column_name: 'AMPMIndicator', data_type: 'CHAR', max_length: 2, is_nullable: false, ordinal_position: 6 },
    { column_name: 'TimeOfDay', data_type: 'VARCHAR', max_length: 20, is_nullable: false, ordinal_position: 7 },
  ], primary_keys: ['TimeKey'] },
];

export const DEMO_TARGET_TABLES = [
  { table_name: 'DIM_DATE', schema_name: 'PUBLIC', row_count: 3652, columns: [
    { column_name: 'DATE_KEY', data_type: 'INTEGER', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'FULL_DATE', data_type: 'DATE', is_nullable: false, ordinal_position: 2 },
    { column_name: 'DAY_OF_WEEK', data_type: 'NUMBER', is_nullable: false, ordinal_position: 3 },
    { column_name: 'DAY_NAME', data_type: 'VARCHAR', max_length: 10, is_nullable: false, ordinal_position: 4 },
    { column_name: 'DAY_OF_MONTH', data_type: 'NUMBER', is_nullable: false, ordinal_position: 5 },
    { column_name: 'DAY_OF_YEAR', data_type: 'NUMBER', is_nullable: false, ordinal_position: 6 },
    { column_name: 'MONTH_NUMBER', data_type: 'NUMBER', is_nullable: false, ordinal_position: 7 },
    { column_name: 'MONTH_NAME', data_type: 'VARCHAR', max_length: 10, is_nullable: false, ordinal_position: 8 },
    { column_name: 'QUARTER', data_type: 'NUMBER', is_nullable: false, ordinal_position: 9 },
    { column_name: 'YEAR', data_type: 'NUMBER', is_nullable: false, ordinal_position: 10 },
    { column_name: 'IS_WEEKEND', data_type: 'BOOLEAN', is_nullable: false, ordinal_position: 11 },
    { column_name: 'IS_HOLIDAY', data_type: 'BOOLEAN', is_nullable: false, ordinal_position: 12 },
  ], primary_keys: ['DATE_KEY'] },

  { table_name: 'DIM_INCO_TERM', schema_name: 'PUBLIC', row_count: 11, columns: [
    { column_name: 'INCO_TERM_KEY', data_type: 'INTEGER', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'INCO_TERM_CODE', data_type: 'VARCHAR', max_length: 10, is_nullable: false, ordinal_position: 2 },
    { column_name: 'INCO_TERM_DESCRIPTION', data_type: 'VARCHAR', max_length: 200, is_nullable: false, ordinal_position: 3 },
    { column_name: 'RESPONSIBILITY_TRANSFER', data_type: 'VARCHAR', max_length: 100, is_nullable: true, ordinal_position: 4 },
    { column_name: 'FREIGHT_RESPONSIBILITY', data_type: 'VARCHAR', max_length: 50, is_nullable: true, ordinal_position: 5 },
    { column_name: 'INSURANCE_REQUIRED', data_type: 'BOOLEAN', is_nullable: false, ordinal_position: 6 },
  ], primary_keys: ['INCO_TERM_KEY'] },

  { table_name: 'DIM_PAYMENT_TERM', schema_name: 'PUBLIC', row_count: 15, columns: [
    { column_name: 'PAYMENT_TERM_KEY', data_type: 'INTEGER', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'PAYMENT_TERM_CODE', data_type: 'VARCHAR', max_length: 20, is_nullable: false, ordinal_position: 2 },
    { column_name: 'PAYMENT_TERM_DESCRIPTION', data_type: 'VARCHAR', max_length: 200, is_nullable: false, ordinal_position: 3 },
    { column_name: 'DUE_DAYS', data_type: 'NUMBER', is_nullable: false, ordinal_position: 4 },
    { column_name: 'DISCOUNT_PERCENT', data_type: 'NUMBER', numeric_precision: 5, numeric_scale: 2, is_nullable: true, ordinal_position: 5 },
    { column_name: 'DISCOUNT_DAYS', data_type: 'NUMBER', is_nullable: true, ordinal_position: 6 },
    { column_name: 'IS_ACTIVE', data_type: 'BOOLEAN', is_nullable: false, ordinal_position: 7 },
  ], primary_keys: ['PAYMENT_TERM_KEY'] },

  { table_name: 'DIM_TIME', schema_name: 'PUBLIC', row_count: 1440, columns: [
    { column_name: 'TIME_KEY', data_type: 'INTEGER', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'HOUR_24', data_type: 'NUMBER', is_nullable: false, ordinal_position: 2 },
    { column_name: 'HOUR_12', data_type: 'NUMBER', is_nullable: false, ordinal_position: 3 },
    { column_name: 'MINUTE', data_type: 'NUMBER', is_nullable: false, ordinal_position: 4 },
    { column_name: 'SECOND', data_type: 'NUMBER', is_nullable: false, ordinal_position: 5 },
    { column_name: 'AMPM_INDICATOR', data_type: 'VARCHAR', max_length: 2, is_nullable: false, ordinal_position: 6 },
    { column_name: 'TIME_OF_DAY', data_type: 'VARCHAR', max_length: 20, is_nullable: false, ordinal_position: 7 },
  ], primary_keys: ['TIME_KEY'] },
];

export const DEMO_TABLE_MATCHES = [
  { source_table: 'DimDate', target_table: 'DIM_DATE', score: 100, confidence: 'very_high', decision: 'auto_matched', source_row_count: 3652, target_row_count: 3652, source_column_count: 12, target_column_count: 12,
    explanation: { overall_score: 100, name_similarity: 100, token_similarity: 100, fuzzy_similarity: 100, column_similarity: 100, matched_columns_count: 12, matched_columns_pct: 100, normalized_source_name: 'dim date', normalized_target_name: 'dim date' } },
  { source_table: 'DimIncoTerm', target_table: 'DIM_INCO_TERM', score: 100, confidence: 'very_high', decision: 'auto_matched', source_row_count: 11, target_row_count: 11, source_column_count: 6, target_column_count: 6,
    explanation: { overall_score: 100, name_similarity: 100, token_similarity: 100, fuzzy_similarity: 100, column_similarity: 100, matched_columns_count: 6, matched_columns_pct: 100, normalized_source_name: 'dim inco term', normalized_target_name: 'dim inco term' } },
  { source_table: 'DimPaymentTerm', target_table: 'DIM_PAYMENT_TERM', score: 100, confidence: 'very_high', decision: 'auto_matched', source_row_count: 15, target_row_count: 15, source_column_count: 7, target_column_count: 7,
    explanation: { overall_score: 100, name_similarity: 100, token_similarity: 100, fuzzy_similarity: 100, column_similarity: 100, matched_columns_count: 7, matched_columns_pct: 100, normalized_source_name: 'dim payment term', normalized_target_name: 'dim payment term' } },
  { source_table: 'DimTime', target_table: 'DIM_TIME', score: 100, confidence: 'very_high', decision: 'auto_matched', source_row_count: 1440, target_row_count: 1440, source_column_count: 7, target_column_count: 7,
    explanation: { overall_score: 100, name_similarity: 100, token_similarity: 100, fuzzy_similarity: 100, column_similarity: 100, matched_columns_count: 7, matched_columns_pct: 100, normalized_source_name: 'dim time', normalized_target_name: 'dim time' } },
];

export const DEMO_VALIDATION_RESULTS = [
  {
    source_table: 'DimDate', target_table: 'DIM_DATE',
    schema_match: 'PASS',
    data_type_status: 'PASS',
    source_count: 3652, target_count: 3652,
    missing_records: 0, additional_records: 0,
    data_match_percentage: 100,
    overall_status: 'PASS',
    details: [
      { type: 'success', message: 'All 3,652 records matched successfully between source and target.' },
      { type: 'success', message: 'All 12 columns validated — schema fully compatible.' },
      { type: 'info', message: 'Data type conversion: BIT → BOOLEAN applied for IsWeekend, IsHoliday (lossless).' },
      { type: 'info', message: 'Data type conversion: TINYINT/SMALLINT → NUMBER applied (lossless).' },
    ],
  },
  {
    source_table: 'DimIncoTerm', target_table: 'DIM_INCO_TERM',
    schema_match: 'PASS',
    data_type_status: 'WARNING',
    source_count: 11, target_count: 11,
    missing_records: 0, additional_records: 0,
    data_match_percentage: 100,
    overall_status: 'WARNING',
    details: [
      { type: 'warning', message: 'Data type narrowing detected: NVARCHAR(200) → VARCHAR(200) for column IncoTermDescription. Unicode characters may be affected.' },
      { type: 'success', message: 'All 11 records matched — row counts are identical.' },
      { type: 'info', message: 'Data type conversion: BIT → BOOLEAN applied for InsuranceRequired (lossless).' },
      { type: 'info', message: 'All 6 column mappings approved and validated.' },
    ],
  },
  {
    source_table: 'DimPaymentTerm', target_table: 'DIM_PAYMENT_TERM',
    schema_match: 'PASS',
    data_type_status: 'PASS',
    source_count: 15, target_count: 15,
    missing_records: 0, additional_records: 0,
    data_match_percentage: 100,
    overall_status: 'PASS',
    details: [
      { type: 'success', message: 'All 15 records matched successfully between source and target.' },
      { type: 'success', message: 'All 7 columns validated — schema fully compatible.' },
      { type: 'info', message: 'Data type conversion: DECIMAL(5,2) → NUMBER(5,2) for DiscountPercent (lossless).' },
      { type: 'info', message: 'Data type conversion: BIT → BOOLEAN applied for IsActive (lossless).' },
    ],
  },
  {
    source_table: 'DimTime', target_table: 'DIM_TIME',
    schema_match: 'PASS',
    data_type_status: 'PASS',
    source_count: 1440, target_count: 1440,
    missing_records: 0, additional_records: 0,
    data_match_percentage: 100,
    overall_status: 'PASS',
    details: [
      { type: 'success', message: 'All 1,440 records matched successfully between source and target.' },
      { type: 'success', message: 'All 7 columns validated — schema fully compatible.' },
      { type: 'info', message: 'Data type conversion: CHAR(2) → VARCHAR(2) for AMPMIndicator (lossless).' },
      { type: 'info', message: 'Data type conversion: TINYINT → NUMBER applied for Hour24, Hour12, Minute, Second (lossless).' },
    ],
  },
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
