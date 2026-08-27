/**
 * Demo data for UI development and demonstration.
 * DDL Migration tables: DimDate, DimIncoTerm, DimPaymentTerm, DimTime,
 *                       FactSalesOrder, DimCurrency, FactInventory
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

  { table_name: 'FactSalesOrder', schema_name: 'dbo', row_count: 248350, columns: [
    { column_name: 'SalesOrderKey', data_type: 'BIGINT', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'OrderDateKey', data_type: 'INT', is_nullable: false, ordinal_position: 2 },
    { column_name: 'ShipDateKey', data_type: 'INT', is_nullable: true, ordinal_position: 3 },
    { column_name: 'CustomerKey', data_type: 'INT', is_nullable: false, ordinal_position: 4 },
    { column_name: 'ProductKey', data_type: 'INT', is_nullable: false, ordinal_position: 5 },
    { column_name: 'OrderQuantity', data_type: 'INT', is_nullable: false, ordinal_position: 6 },
    { column_name: 'UnitPrice', data_type: 'DECIMAL', numeric_precision: 19, numeric_scale: 4, is_nullable: false, ordinal_position: 7 },
    { column_name: 'ExtendedAmount', data_type: 'DECIMAL', numeric_precision: 19, numeric_scale: 4, is_nullable: false, ordinal_position: 8 },
    { column_name: 'DiscountAmount', data_type: 'DECIMAL', numeric_precision: 19, numeric_scale: 4, is_nullable: true, ordinal_position: 9 },
    { column_name: 'TaxAmount', data_type: 'DECIMAL', numeric_precision: 19, numeric_scale: 4, is_nullable: false, ordinal_position: 10 },
    { column_name: 'FreightCost', data_type: 'DECIMAL', numeric_precision: 19, numeric_scale: 4, is_nullable: true, ordinal_position: 11 },
    { column_name: 'TotalDue', data_type: 'DECIMAL', numeric_precision: 19, numeric_scale: 4, is_nullable: false, ordinal_position: 12 },
    { column_name: 'SalesChannel', data_type: 'VARCHAR', max_length: 20, is_nullable: true, ordinal_position: 13 },
    { column_name: 'WarehouseCode', data_type: 'VARCHAR', max_length: 10, is_nullable: true, ordinal_position: 14 },
  ], primary_keys: ['SalesOrderKey'] },

  { table_name: 'DimCurrency', schema_name: 'dbo', row_count: 105, columns: [
    { column_name: 'CurrencyKey', data_type: 'INT', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'CurrencyCode', data_type: 'CHAR', max_length: 3, is_nullable: false, ordinal_position: 2 },
    { column_name: 'CurrencyName', data_type: 'NVARCHAR', max_length: 100, is_nullable: false, ordinal_position: 3 },
    { column_name: 'ExchangeRateToUSD', data_type: 'DECIMAL', numeric_precision: 18, numeric_scale: 6, is_nullable: false, ordinal_position: 4 },
    { column_name: 'ExchangeRateDate', data_type: 'DATETIME', is_nullable: false, ordinal_position: 5 },
    { column_name: 'IsActive', data_type: 'BIT', is_nullable: false, ordinal_position: 6 },
    { column_name: 'DecimalPlaces', data_type: 'TINYINT', is_nullable: false, ordinal_position: 7 },
    { column_name: 'Symbol', data_type: 'NVARCHAR', max_length: 5, is_nullable: true, ordinal_position: 8 },
  ], primary_keys: ['CurrencyKey'] },

  { table_name: 'FactInventory', schema_name: 'dbo', row_count: 1034820, columns: [
    { column_name: 'InventoryKey', data_type: 'BIGINT', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'DateKey', data_type: 'INT', is_nullable: false, ordinal_position: 2 },
    { column_name: 'ProductKey', data_type: 'INT', is_nullable: false, ordinal_position: 3 },
    { column_name: 'WarehouseKey', data_type: 'INT', is_nullable: false, ordinal_position: 4 },
    { column_name: 'QuantityOnHand', data_type: 'INT', is_nullable: false, ordinal_position: 5 },
    { column_name: 'QuantityOnOrder', data_type: 'INT', is_nullable: true, ordinal_position: 6 },
    { column_name: 'SafetyStockLevel', data_type: 'INT', is_nullable: true, ordinal_position: 7 },
    { column_name: 'ReorderPoint', data_type: 'INT', is_nullable: true, ordinal_position: 8 },
    { column_name: 'UnitCost', data_type: 'DECIMAL', numeric_precision: 19, numeric_scale: 4, is_nullable: false, ordinal_position: 9 },
    { column_name: 'InventoryValue', data_type: 'DECIMAL', numeric_precision: 19, numeric_scale: 4, is_nullable: false, ordinal_position: 10 },
    { column_name: 'LastCountDate', data_type: 'DATETIME', is_nullable: true, ordinal_position: 11 },
    { column_name: 'StockStatus', data_type: 'VARCHAR', max_length: 20, is_nullable: false, ordinal_position: 12 },
  ], primary_keys: ['InventoryKey'] },
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

  /* FactSalesOrder target — missing 2 columns (SalesChannel, WarehouseCode dropped during migration) */
  { table_name: 'FACT_SALES_ORDER', schema_name: 'PUBLIC', row_count: 245892, columns: [
    { column_name: 'SALES_ORDER_KEY', data_type: 'NUMBER', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'ORDER_DATE_KEY', data_type: 'NUMBER', is_nullable: false, ordinal_position: 2 },
    { column_name: 'SHIP_DATE_KEY', data_type: 'NUMBER', is_nullable: true, ordinal_position: 3 },
    { column_name: 'CUSTOMER_KEY', data_type: 'NUMBER', is_nullable: false, ordinal_position: 4 },
    { column_name: 'PRODUCT_KEY', data_type: 'NUMBER', is_nullable: false, ordinal_position: 5 },
    { column_name: 'ORDER_QUANTITY', data_type: 'NUMBER', is_nullable: false, ordinal_position: 6 },
    { column_name: 'UNIT_PRICE', data_type: 'NUMBER', numeric_precision: 19, numeric_scale: 4, is_nullable: false, ordinal_position: 7 },
    { column_name: 'EXTENDED_AMOUNT', data_type: 'NUMBER', numeric_precision: 19, numeric_scale: 4, is_nullable: false, ordinal_position: 8 },
    { column_name: 'DISCOUNT_AMOUNT', data_type: 'NUMBER', numeric_precision: 19, numeric_scale: 4, is_nullable: true, ordinal_position: 9 },
    { column_name: 'TAX_AMOUNT', data_type: 'NUMBER', numeric_precision: 19, numeric_scale: 4, is_nullable: false, ordinal_position: 10 },
    { column_name: 'FREIGHT_COST', data_type: 'NUMBER', numeric_precision: 19, numeric_scale: 4, is_nullable: true, ordinal_position: 11 },
    { column_name: 'TOTAL_DUE', data_type: 'NUMBER', numeric_precision: 19, numeric_scale: 4, is_nullable: false, ordinal_position: 12 },
  ], primary_keys: ['SALES_ORDER_KEY'] },

  /* DimCurrency target — precision loss on exchange rate (6 → 2 decimal places), nullable mismatch on Symbol */
  { table_name: 'DIM_CURRENCY', schema_name: 'PUBLIC', row_count: 105, columns: [
    { column_name: 'CURRENCY_KEY', data_type: 'INTEGER', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'CURRENCY_CODE', data_type: 'VARCHAR', max_length: 3, is_nullable: false, ordinal_position: 2 },
    { column_name: 'CURRENCY_NAME', data_type: 'VARCHAR', max_length: 100, is_nullable: false, ordinal_position: 3 },
    { column_name: 'EXCHANGE_RATE_TO_USD', data_type: 'NUMBER', numeric_precision: 18, numeric_scale: 2, is_nullable: false, ordinal_position: 4 },
    { column_name: 'EXCHANGE_RATE_DATE', data_type: 'TIMESTAMP_NTZ', is_nullable: false, ordinal_position: 5 },
    { column_name: 'IS_ACTIVE', data_type: 'BOOLEAN', is_nullable: false, ordinal_position: 6 },
    { column_name: 'DECIMAL_PLACES', data_type: 'NUMBER', is_nullable: false, ordinal_position: 7 },
    { column_name: 'SYMBOL', data_type: 'VARCHAR', max_length: 5, is_nullable: false, ordinal_position: 8 },
  ], primary_keys: ['CURRENCY_KEY'] },

  /* FactInventory target — ETL pipeline broke, only partial load, missing columns */
  { table_name: 'FACT_INVENTORY', schema_name: 'PUBLIC', row_count: 412006, columns: [
    { column_name: 'INVENTORY_KEY', data_type: 'NUMBER', is_primary_key: true, is_nullable: false, ordinal_position: 1 },
    { column_name: 'DATE_KEY', data_type: 'NUMBER', is_nullable: false, ordinal_position: 2 },
    { column_name: 'PRODUCT_KEY', data_type: 'NUMBER', is_nullable: false, ordinal_position: 3 },
    { column_name: 'WAREHOUSE_KEY', data_type: 'NUMBER', is_nullable: false, ordinal_position: 4 },
    { column_name: 'QUANTITY_ON_HAND', data_type: 'NUMBER', is_nullable: false, ordinal_position: 5 },
    { column_name: 'QUANTITY_ON_ORDER', data_type: 'NUMBER', is_nullable: true, ordinal_position: 6 },
    { column_name: 'UNIT_COST', data_type: 'NUMBER', numeric_precision: 19, numeric_scale: 4, is_nullable: false, ordinal_position: 7 },
    { column_name: 'INVENTORY_VALUE', data_type: 'NUMBER', numeric_precision: 19, numeric_scale: 4, is_nullable: false, ordinal_position: 8 },
    { column_name: 'LAST_COUNT_DATE', data_type: 'TIMESTAMP_NTZ', is_nullable: true, ordinal_position: 9 },
    { column_name: 'STOCK_STATUS', data_type: 'VARCHAR', max_length: 20, is_nullable: false, ordinal_position: 10 },
  ], primary_keys: ['INVENTORY_KEY'] },
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
  { source_table: 'FactSalesOrder', target_table: 'FACT_SALES_ORDER', score: 92, confidence: 'high', decision: 'auto_matched', source_row_count: 248350, target_row_count: 245892, source_column_count: 14, target_column_count: 12,
    explanation: { overall_score: 92, name_similarity: 100, token_similarity: 100, fuzzy_similarity: 100, column_similarity: 85.7, matched_columns_count: 12, matched_columns_pct: 85.7, normalized_source_name: 'fact sales order', normalized_target_name: 'fact sales order' } },
  { source_table: 'DimCurrency', target_table: 'DIM_CURRENCY', score: 97, confidence: 'very_high', decision: 'auto_matched', source_row_count: 105, target_row_count: 105, source_column_count: 8, target_column_count: 8,
    explanation: { overall_score: 97, name_similarity: 100, token_similarity: 100, fuzzy_similarity: 100, column_similarity: 100, matched_columns_count: 8, matched_columns_pct: 100, normalized_source_name: 'dim currency', normalized_target_name: 'dim currency' } },
  { source_table: 'FactInventory', target_table: 'FACT_INVENTORY', score: 88, confidence: 'high', decision: 'auto_matched', source_row_count: 1034820, target_row_count: 412006, source_column_count: 12, target_column_count: 10,
    explanation: { overall_score: 88, name_similarity: 100, token_similarity: 100, fuzzy_similarity: 100, column_similarity: 83.3, matched_columns_count: 10, matched_columns_pct: 83.3, normalized_source_name: 'fact inventory', normalized_target_name: 'fact inventory' } },
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
      { type: 'info', message: 'Data type conversion: BIT -> BOOLEAN applied for IsWeekend, IsHoliday (lossless).' },
      { type: 'info', message: 'Data type conversion: TINYINT/SMALLINT -> NUMBER applied (lossless).' },
    ],
  },
  {
    source_table: 'DimIncoTerm', target_table: 'DIM_INCO_TERM',
    schema_match: 'PASS',
    data_type_status: 'PASS',
    source_count: 11, target_count: 11,
    missing_records: 0, additional_records: 0,
    data_match_percentage: 100,
    overall_status: 'PASS',
    details: [
      { type: 'success', message: 'All 11 records matched successfully between source and target.' },
      { type: 'success', message: 'All 6 columns validated — schema fully compatible.' },
      { type: 'info', message: 'Data type conversion: NVARCHAR(200) -> VARCHAR(200) for column IncoTermDescription (lossless).' },
      { type: 'info', message: 'Data type conversion: BIT -> BOOLEAN applied for InsuranceRequired (lossless).' },
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
      { type: 'info', message: 'Data type conversion: DECIMAL(5,2) -> NUMBER(5,2) for DiscountPercent (lossless).' },
      { type: 'info', message: 'Data type conversion: BIT -> BOOLEAN applied for IsActive (lossless).' },
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
      { type: 'info', message: 'Data type conversion: CHAR(2) -> VARCHAR(2) for AMPMIndicator (lossless).' },
      { type: 'info', message: 'Data type conversion: TINYINT -> NUMBER applied for Hour24, Hour12, Minute, Second (lossless).' },
    ],
  },

  /* ─── FAIL: FactSalesOrder ─────────────────────────────────────────────
   * Reasoning: 2,458 records missing (likely filtered out by a WHERE clause
   * in the ETL that excluded cancelled/voided orders). Two columns
   * (SalesChannel, WarehouseCode) were dropped during migration, breaking
   * schema compatibility. Data match is only 98.3% because 4,217 rows
   * have truncated UNIT_PRICE values.
   */
  {
    source_table: 'FactSalesOrder', target_table: 'FACT_SALES_ORDER',
    schema_match: 'FAIL',
    data_type_status: 'FAIL',
    source_count: 248350, target_count: 245892,
    missing_records: 2458, additional_records: 0,
    data_match_percentage: 98.3,
    overall_status: 'FAIL',
    details: [
      { type: 'error', message: '2,458 records missing in target — source has 248,350 rows but target only contains 245,892. Likely caused by an ETL filter excluding cancelled/voided orders during migration.' },
      { type: 'error', message: 'Schema mismatch: 2 columns missing in target — SalesChannel (VARCHAR 20) and WarehouseCode (VARCHAR 10) were not migrated. These columns may have been intentionally excluded, but this breaks full schema compatibility.' },
      { type: 'error', message: 'Data truncation detected: 4,217 rows have UnitPrice values truncated from DECIMAL(19,4) to NUMBER(19,2), causing rounding errors up to ±$0.005 per row.' },
      { type: 'warning', message: 'Row count delta of 0.99% exceeds the 0.1% threshold — manual investigation recommended to confirm whether excluded records are intentional.' },
      { type: 'info', message: 'Data type conversion: BIGINT -> NUMBER applied for SalesOrderKey (lossless).' },
      { type: 'info', message: 'Primary key integrity verified — no duplicate SALES_ORDER_KEY values in target.' },
    ],
  },

  /* ─── WARNING: DimCurrency ─────────────────────────────────────────────
   * Reasoning: All 105 rows migrated, but ExchangeRateToUSD lost precision
   * (scale 6 → scale 2), which silently rounds rates like 1.234567 to 1.23.
   * Also, Symbol column changed from NULLABLE to NOT NULL, which will
   * reject future inserts with NULL symbols. Row counts match, so no
   * data loss, but precision and constraint changes may cause downstream
   * calculation errors.
   */
  {
    source_table: 'DimCurrency', target_table: 'DIM_CURRENCY',
    schema_match: 'PASS',
    data_type_status: 'WARNING',
    source_count: 105, target_count: 105,
    missing_records: 0, additional_records: 0,
    data_match_percentage: 99.8,
    overall_status: 'WARNING',
    details: [
      { type: 'success', message: 'All 105 records present in target — no missing or additional rows.' },
      { type: 'warning', message: 'Precision loss: ExchangeRateToUSD converted from DECIMAL(18,6) to NUMBER(18,2). This reduces precision from 6 to 2 decimal places, silently rounding values like 1.234567 → 1.23. Affects 87 of 105 currency rates and may cause downstream FX calculation drift.' },
      { type: 'warning', message: 'Nullable constraint mismatch: Symbol column changed from NULLABLE (source) to NOT NULL (target). 3 source rows have NULL symbols (for cryptocurrencies BTC, ETH, XRP) — these were migrated as empty strings. Future inserts with NULL will be rejected.' },
      { type: 'warning', message: 'Data match is 99.8% — the 0.2% delta is caused by the exchange rate rounding in 87 rows, not by missing data.' },
      { type: 'info', message: 'Data type conversion: NVARCHAR(100) -> VARCHAR(100) for CurrencyName (lossless).' },
      { type: 'info', message: 'Data type conversion: DATETIME -> TIMESTAMP_NTZ for ExchangeRateDate (lossless — timezone-naive).' },
      { type: 'info', message: 'Data type conversion: CHAR(3) -> VARCHAR(3) for CurrencyCode (lossless).' },
    ],
  },

  /* ─── FAIL: FactInventory ──────────────────────────────────────────────
   * Reasoning: Massive row count mismatch — only 412,006 of 1,034,820 rows
   * loaded (39.8%). This indicates the ETL pipeline broke mid-load (likely
   * a timeout or memory issue on the large fact table). Additionally,
   * 2 columns (SafetyStockLevel, ReorderPoint) are missing in target,
   * and the schema is incompatible.
   */
  {
    source_table: 'FactInventory', target_table: 'FACT_INVENTORY',
    schema_match: 'FAIL',
    data_type_status: 'FAIL',
    source_count: 1034820, target_count: 412006,
    missing_records: 622814, additional_records: 0,
    data_match_percentage: 39.8,
    overall_status: 'FAIL',
    details: [
      { type: 'error', message: 'Critical: Only 412,006 of 1,034,820 rows loaded (39.8%). 622,814 records are missing — the ETL pipeline likely failed mid-load due to a timeout, memory exhaustion, or network interruption during the bulk COPY INTO operation.' },
      { type: 'error', message: 'Schema mismatch: 2 columns missing in target — SafetyStockLevel (INT) and ReorderPoint (INT) were not created in the target DDL. This is a DDL migration gap that must be resolved before re-running the data load.' },
      { type: 'error', message: 'Data integrity risk: The 412,006 loaded rows appear to be from DateKey range 20210101–20230615 only. Records from 20230616 onward are entirely absent, suggesting a partition-based load that was interrupted.' },
      { type: 'warning', message: 'The loaded records (39.8%) that do exist show 100% value match for the columns that were migrated — the issue is completeness, not accuracy.' },
      { type: 'warning', message: 'Target table has no foreign key constraints on PRODUCT_KEY and WAREHOUSE_KEY — referential integrity cannot be verified until dimension tables are fully validated.' },
      { type: 'info', message: 'Data type conversion: BIGINT -> NUMBER applied for InventoryKey (lossless).' },
      { type: 'info', message: 'Data type conversion: DATETIME -> TIMESTAMP_NTZ for LastCountDate (lossless).' },
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
