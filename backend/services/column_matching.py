"""
Column Matching Engine (§16-17)
================================
Automatic column matching with multi-signal scoring.
"""

from fuzzywuzzy import fuzz
from models.discovery import TableMetadata, ColumnMetadata
from models.matching import ColumnMatchResult, MatchConfidence, MatchDecision
from services.name_normalizer import normalize_name, tokenize_name, ngram_similarity
from config import COLUMN_MATCH_WEIGHTS, DATA_TYPE_COMPATIBILITY, CONFIDENCE_TIERS


def match_columns(
    source_table: TableMetadata,
    target_table: TableMetadata,
    weights: dict = None,
) -> list[ColumnMatchResult]:
    """
    Match columns between a source and target table pair.
    Uses normalized names, token similarity, fuzzy matching,
    data type compatibility, and position as signals.
    """
    if weights is None:
        weights = COLUMN_MATCH_WEIGHTS
    
    results: list[ColumnMatchResult] = []
    assigned_targets: set[str] = set()
    
    # Score all pairs
    all_scores = []
    for src_col in source_table.columns:
        for tgt_col in target_table.columns:
            score, components = _score_column_pair(
                src_col, tgt_col,
                len(source_table.columns), len(target_table.columns),
                weights,
            )
            all_scores.append((src_col, tgt_col, score, components))
    
    # Greedy best-match
    all_scores.sort(key=lambda x: x[2], reverse=True)
    matched_sources: set[str] = set()
    
    for src_col, tgt_col, score, components in all_scores:
        if src_col.column_name in matched_sources or tgt_col.column_name in assigned_targets:
            continue
        
        if score < 40:
            continue
        
        confidence = _classify_confidence(score)
        decision = (
            MatchDecision.AUTO_MATCHED
            if confidence in (MatchConfidence.VERY_HIGH, MatchConfidence.HIGH)
            else MatchDecision.PENDING
        )
        
        dtype_status = _check_type_compatibility(src_col.data_type, tgt_col.data_type)
        
        results.append(ColumnMatchResult(
            source_column=src_col.column_name,
            target_column=tgt_col.column_name,
            score=round(score, 1),
            confidence=confidence,
            decision=decision,
            source_data_type=src_col.data_type,
            target_data_type=tgt_col.data_type,
            data_type_status=dtype_status,
            source_precision=src_col.numeric_precision,
            target_precision=tgt_col.numeric_precision,
            source_scale=src_col.numeric_scale,
            target_scale=tgt_col.numeric_scale,
            source_length=src_col.max_length,
            target_length=tgt_col.max_length,
        ))
        
        matched_sources.add(src_col.column_name)
        assigned_targets.add(tgt_col.column_name)
    
    # Unmatched source columns
    for src_col in source_table.columns:
        if src_col.column_name not in matched_sources:
            results.append(ColumnMatchResult(
                source_column=src_col.column_name,
                score=0.0,
                confidence=MatchConfidence.VERY_LOW,
                decision=MatchDecision.PENDING,
                source_data_type=src_col.data_type,
            ))
    
    return results


def _score_column_pair(
    src: ColumnMetadata,
    tgt: ColumnMetadata,
    total_src: int,
    total_tgt: int,
    weights: dict,
) -> tuple[float, dict]:
    """Score a single column pair across all signals."""
    src_norm = normalize_name(src.column_name)
    tgt_norm = normalize_name(tgt.column_name)
    
    src_tokens = tokenize_name(src.column_name)
    tgt_tokens = tokenize_name(tgt.column_name)
    
    # Name similarity (n-gram)
    name_sim = ngram_similarity(src_norm, tgt_norm)
    if src_norm == tgt_norm:
        name_sim = 1.0
    
    # Token similarity (Jaccard)
    if src_tokens and tgt_tokens:
        token_set1 = set(src_tokens)
        token_set2 = set(tgt_tokens)
        token_sim = len(token_set1 & token_set2) / len(token_set1 | token_set2)
    else:
        token_sim = 0.0
    
    # Fuzzy similarity
    fuzzy_sim = fuzz.token_sort_ratio(src_norm, tgt_norm) / 100.0
    
    # Data type compatibility
    dtype_compat = 1.0 if _check_type_compatibility(src.data_type, tgt.data_type) in ("PASS", "COMPATIBLE") else 0.0
    
    # Position similarity (weak signal)
    if total_src > 0 and total_tgt > 0:
        src_pos_ratio = src.ordinal_position / total_src
        tgt_pos_ratio = tgt.ordinal_position / total_tgt
        pos_sim = 1.0 - abs(src_pos_ratio - tgt_pos_ratio)
    else:
        pos_sim = 0.0
    
    score = (
        weights["name_similarity"] * name_sim +
        weights["token_similarity"] * token_sim +
        weights["fuzzy_similarity"] * fuzzy_sim +
        weights["dtype_compatibility"] * dtype_compat +
        weights["position_similarity"] * pos_sim
    ) * 100
    
    components = {
        "name_similarity": round(name_sim * 100, 1),
        "token_similarity": round(token_sim * 100, 1),
        "fuzzy_similarity": round(fuzzy_sim * 100, 1),
        "dtype_compatibility": round(dtype_compat * 100, 1),
        "position_similarity": round(pos_sim * 100, 1),
    }
    
    return score, components


def _check_type_compatibility(source_type: str, target_type: str) -> str:
    """Check data type compatibility using the compatibility matrix."""
    src = source_type.upper().strip()
    tgt = target_type.upper().strip()
    
    if src == tgt:
        return "PASS"
    
    result = DATA_TYPE_COMPATIBILITY.get((src, tgt))
    if result:
        return result
    
    # Try partial match (e.g., "DECIMAL(18,2)" → "DECIMAL")
    src_base = src.split("(")[0].strip()
    tgt_base = tgt.split("(")[0].strip()
    
    if src_base == tgt_base:
        return "PASS"
    
    result = DATA_TYPE_COMPATIBILITY.get((src_base, tgt_base))
    if result:
        return result
    
    return "INCOMPATIBLE"


def _classify_confidence(score: float) -> MatchConfidence:
    """Classify a score into a confidence tier."""
    for tier_key, tier in CONFIDENCE_TIERS.items():
        if tier["min"] <= score <= tier["max"]:
            return MatchConfidence(tier_key)
    return MatchConfidence.VERY_LOW
