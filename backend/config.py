"""
Application configuration: thresholds, abbreviation dictionary,
data type compatibility matrix, matching weights, and batch sizes.
"""

# ─── Abbreviation Dictionary (§8.1) ───────────────────────────────────────────
ABBREVIATION_MAP = {
    "hdr": "header",
    "dtl": "detail",
    "cust": "customer",
    "inv": "invoice",
    "shp": "shipment",
    "ord": "order",
    "addr": "address",
    "txn": "transaction",
    "no": "number",
    "num": "number",
    "qty": "quantity",
    "amt": "amount",
    "desc": "description",
    "dt": "date",
    "tm": "time",
    "ts": "timestamp",
    "cd": "code",
    "nm": "name",
    "typ": "type",
    "cat": "category",
    "stat": "status",
    "prd": "product",
    "emp": "employee",
    "dept": "department",
    "mgr": "manager",
    "acct": "account",
    "bal": "balance",
    "pmt": "payment",
    "ref": "reference",
    "seq": "sequence",
    "flg": "flag",
    "ind": "indicator",
    "cnt": "count",
    "tot": "total",
    "avg": "average",
    "min": "minimum",
    "max": "maximum",
    "src": "source",
    "tgt": "target",
    "orig": "original",
    "mod": "modified",
    "crt": "created",
    "upd": "updated",
    "del": "deleted",
    "eff": "effective",
    "exp": "expiry",
    "strt": "start",
    "end": "end",
    "curr": "current",
    "prev": "previous",
    "nxt": "next",
    "yr": "year",
    "mth": "month",
    "wk": "week",
    "dy": "day",
    "hr": "hour",
    "tbl": "table",
    "col": "column",
    "val": "value",
    "msg": "message",
    "err": "error",
    "wrn": "warning",
    "cfg": "configuration",
    "prm": "parameter",
    "lvl": "level",
    "grp": "group",
    "cls": "class",
    "seg": "segment",
    "rgn": "region",
    "loc": "location",
    "cty": "city",
    "st": "state",
    "ctry": "country",
    "zip": "zipcode",
    "phn": "phone",
    "fax": "fax",
    "eml": "email",
    "url": "url",
    "usr": "user",
    "pwd": "password",
    "auth": "authorization",
    "perm": "permission",
}

# ─── Table Matching Weights (§9) ──────────────────────────────────────────────
TABLE_MATCH_WEIGHTS = {
    "name_similarity": 0.40,   # Normalized table-name similarity
    "token_similarity": 0.25,  # Token-level comparison
    "fuzzy_similarity": 0.15,  # Fuzzy string similarity
    "column_similarity": 0.20, # Column structure comparison
}

# ─── Column Matching Weights (§17) ────────────────────────────────────────────
COLUMN_MATCH_WEIGHTS = {
    "name_similarity": 0.45,   # Primary matching signal
    "token_similarity": 0.20,  # Word-level comparison
    "fuzzy_similarity": 0.15,  # Spelling/name variation
    "dtype_compatibility": 0.15, # Logical type consistency
    "position_similarity": 0.05, # Weak supporting signal
}

# ─── Confidence Tiers (§11) ───────────────────────────────────────────────────
CONFIDENCE_TIERS = {
    "very_high": {"min": 95, "max": 100, "action": "auto_match", "label": "Very High"},
    "high":      {"min": 90, "max": 94,  "action": "auto_match_review", "label": "High"},
    "medium":    {"min": 80, "max": 89,  "action": "manual_required", "label": "Medium"},
    "low":       {"min": 70, "max": 79,  "action": "candidate_only", "label": "Low"},
    "very_low":  {"min": 0,  "max": 69,  "action": "no_match", "label": "Very Low"},
}

# ─── Data Type Compatibility Matrix (§18) ─────────────────────────────────────
# Maps (sql_server_type, snowflake_type) → compatibility status
DATA_TYPE_COMPATIBILITY = {
    # Exact matches
    ("INT", "INTEGER"): "PASS",
    ("INTEGER", "INTEGER"): "PASS",
    ("BIGINT", "BIGINT"): "PASS",
    ("SMALLINT", "SMALLINT"): "PASS",
    ("TINYINT", "TINYINT"): "PASS",
    ("FLOAT", "FLOAT"): "PASS",
    ("REAL", "REAL"): "PASS",
    ("DATE", "DATE"): "PASS",
    ("TIME", "TIME"): "PASS",
    ("VARCHAR", "VARCHAR"): "PASS",
    ("CHAR", "CHAR"): "PASS",
    ("TEXT", "VARCHAR"): "COMPATIBLE",
    ("BOOLEAN", "BOOLEAN"): "PASS",

    # Compatible mappings
    ("DECIMAL", "NUMBER"): "COMPATIBLE",
    ("NUMERIC", "NUMBER"): "COMPATIBLE",
    ("DECIMAL", "DECIMAL"): "PASS",
    ("NUMERIC", "NUMERIC"): "PASS",
    ("MONEY", "NUMBER"): "COMPATIBLE",
    ("SMALLMONEY", "NUMBER"): "COMPATIBLE",
    ("NVARCHAR", "VARCHAR"): "COMPATIBLE",
    ("NCHAR", "VARCHAR"): "COMPATIBLE",
    ("NTEXT", "VARCHAR"): "COMPATIBLE",
    ("BIT", "BOOLEAN"): "COMPATIBLE",
    ("DATETIME", "TIMESTAMP_NTZ"): "COMPATIBLE",
    ("DATETIME2", "TIMESTAMP_NTZ"): "COMPATIBLE",
    ("SMALLDATETIME", "TIMESTAMP_NTZ"): "COMPATIBLE",
    ("DATETIMEOFFSET", "TIMESTAMP_TZ"): "COMPATIBLE",
    ("TIMESTAMP", "BINARY"): "COMPATIBLE",
    ("UNIQUEIDENTIFIER", "VARCHAR"): "COMPATIBLE",
    ("XML", "VARIANT"): "COMPATIBLE",
    ("VARBINARY", "BINARY"): "COMPATIBLE",
    ("IMAGE", "BINARY"): "COMPATIBLE",
    ("SQL_VARIANT", "VARIANT"): "COMPATIBLE",

    # INT family cross-compatibility
    ("INT", "NUMBER"): "COMPATIBLE",
    ("BIGINT", "NUMBER"): "COMPATIBLE",
    ("SMALLINT", "NUMBER"): "COMPATIBLE",
    ("TINYINT", "NUMBER"): "COMPATIBLE",
    ("FLOAT", "DOUBLE"): "COMPATIBLE",
    ("FLOAT", "NUMBER"): "COMPATIBLE",
    ("REAL", "FLOAT"): "COMPATIBLE",
}

# ─── Validation Settings ──────────────────────────────────────────────────────
VALIDATION_CONFIG = {
    "batch_size": 10000,
    "max_sample_mismatches": 100,
    "string_trim": True,
    "case_sensitive": False,
    "numeric_tolerance": 0.0001,
    "datetime_precision_seconds": 1,
    "null_equals_empty": False,
    "hash_enabled": True,
    "hash_threshold_rows": 100000,
}

# ─── Exclusion Patterns ──────────────────────────────────────────────────────
TABLE_EXCLUSION_PATTERNS = [
    "^tmp_",
    "^temp_",
    "^stg_",
    "^staging_",
    "_bak$",
    "_backup$",
    "_old$",
    "_archive$",
    "^sys",
    "^dt_",
    "^audit_log",
    "^migration_",
    "^etl_",
]
