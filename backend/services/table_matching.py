"""
Table Matching Engine (§8-14)
=============================
Multi-stage table matching with hybrid scoring: name similarity,
token similarity, fuzzy matching, and column-aware scoring.
"""

from fuzzywuzzy import fuzz
from typing import Optional
from models.discovery import TableMetadata
from models.matching import (
    TableMatchResult, MatchConfidence, MatchDecision,
    MatchExplanation, AlternativeCandidate, TableMatchingSummary,
)
from services.name_normalizer import normalize_name, tokenize_name, ngram_similarity
from config import TABLE_MATCH_WEIGHTS, CONFIDENCE_TIERS


def match_tables(
    source_tables: list[TableMetadata],
    target_tables: list[TableMetadata],
    weights: dict = None,
) -> TableMatchingSummary:
    """
    Perform automatic table matching between source and target schemas.
    Uses a two-stage candidate-generation and scoring model (§37).
    """
    if weights is None:
        weights = TABLE_MATCH_WEIGHTS
    
    matches: list[TableMatchResult] = []
    assigned_targets: set[str] = set()
    
    # Stage 1: Score all source-target pairs
    all_scores: list[tuple[str, str, float, MatchExplanation]] = []
    
    for src in source_tables:
        src_normalized = normalize_name(src.table_name)
        src_tokens = tokenize_name(src.table_name)
        
        for tgt in target_tables:
            tgt_normalized = normalize_name(tgt.table_name)
            tgt_tokens = tokenize_name(tgt.table_name)
            
            # Calculate component scores
            name_sim = _name_similarity(src_normalized, tgt_normalized)
            token_sim = _token_similarity(src_tokens, tgt_tokens)
            fuzzy_sim = _fuzzy_similarity(src_normalized, tgt_normalized)
            col_sim, matched_cols, matched_pct, conflicts = _column_similarity(src, tgt)
            
            # Weighted score
            score = (
                weights["name_similarity"] * name_sim +
                weights["token_similarity"] * token_sim +
                weights["fuzzy_similarity"] * fuzzy_sim +
                weights["column_similarity"] * col_sim
            ) * 100  # Convert to percentage
            
            explanation = MatchExplanation(
                overall_score=round(score, 1),
                name_similarity=round(name_sim * 100, 1),
                token_similarity=round(token_sim * 100, 1),
                fuzzy_similarity=round(fuzzy_sim * 100, 1),
                column_similarity=round(col_sim * 100, 1),
                matched_columns_count=matched_cols,
                matched_columns_pct=round(matched_pct, 1),
                conflicting_columns=conflicts,
                normalized_source_name=src_normalized,
                normalized_target_name=tgt_normalized,
            )
            
            all_scores.append((src.table_name, tgt.table_name, score, explanation))
    
    # Stage 2: Greedy best-match assignment (§14 one-to-one rules)
    all_scores.sort(key=lambda x: x[2], reverse=True)
    
    source_matched: set[str] = set()
    
    for src_name, tgt_name, score, explanation in all_scores:
        if src_name in source_matched or tgt_name in assigned_targets:
            continue
        
        if score < 50:  # Minimum threshold
            continue
        
        confidence = _classify_confidence(score)
        decision = _default_decision(confidence)
        
        # Find alternatives
        alternatives = _get_alternatives(
            src_name, tgt_name, all_scores, assigned_targets
        )
        
        src_meta = next(s for s in source_tables if s.table_name == src_name)
        tgt_meta = next(t for t in target_tables if t.table_name == tgt_name)
        
        match = TableMatchResult(
            source_table=src_name,
            source_schema=src_meta.schema_name,
            target_table=tgt_name,
            target_schema=tgt_meta.schema_name,
            score=round(score, 1),
            confidence=confidence,
            decision=decision,
            explanation=explanation,
            alternatives=alternatives,
            source_row_count=src_meta.row_count,
            target_row_count=tgt_meta.row_count,
            source_column_count=len(src_meta.columns),
            target_column_count=len(tgt_meta.columns),
        )
        
        matches.append(match)
        source_matched.add(src_name)
        assigned_targets.add(tgt_name)
    
    # Handle unmatched source tables
    for src in source_tables:
        if src.table_name not in source_matched:
            matches.append(TableMatchResult(
                source_table=src.table_name,
                source_schema=src.schema_name,
                score=0.0,
                confidence=MatchConfidence.VERY_LOW,
                decision=MatchDecision.PENDING,
                source_row_count=src.row_count,
                source_column_count=len(src.columns),
            ))
    
    # Build summary
    unmatched_targets = [
        t.table_name for t in target_tables
        if t.table_name not in assigned_targets
    ]
    
    auto_matched = sum(1 for m in matches if m.decision == MatchDecision.AUTO_MATCHED)
    needs_review = sum(1 for m in matches if m.decision == MatchDecision.PENDING and m.score > 0)
    unmatched_src = sum(1 for m in matches if m.score == 0)
    
    return TableMatchingSummary(
        total_source_tables=len(source_tables),
        total_target_tables=len(target_tables),
        auto_matched=auto_matched,
        needs_review=needs_review,
        unmatched_source=unmatched_src,
        unmatched_target=len(unmatched_targets),
        matches=matches,
        unmatched_source_tables=[m.source_table for m in matches if m.score == 0],
        unmatched_target_tables=unmatched_targets,
    )


def _name_similarity(name1: str, name2: str) -> float:
    """Calculate normalized name similarity using n-gram overlap."""
    if name1 == name2:
        return 1.0
    return ngram_similarity(name1, name2, n=3)


def _token_similarity(tokens1: list[str], tokens2: list[str]) -> float:
    """Calculate token-level Jaccard similarity."""
    if not tokens1 or not tokens2:
        return 0.0
    set1 = set(tokens1)
    set2 = set(tokens2)
    intersection = set1 & set2
    union = set1 | set2
    return len(intersection) / len(union) if union else 0.0


def _fuzzy_similarity(name1: str, name2: str) -> float:
    """Calculate fuzzy string similarity using token_sort_ratio."""
    return fuzz.token_sort_ratio(name1, name2) / 100.0


def _column_similarity(
    src: TableMetadata, tgt: TableMetadata
) -> tuple[float, int, float, list[str]]:
    """
    Calculate column-based similarity between two tables.
    Returns: (similarity, matched_count, matched_pct, conflicting_columns)
    """
    if not src.columns or not tgt.columns:
        return 0.0, 0, 0.0, []
    
    src_cols = {normalize_name(c.column_name) for c in src.columns}
    tgt_cols = {normalize_name(c.column_name) for c in tgt.columns}
    
    matched = src_cols & tgt_cols
    matched_count = len(matched)
    matched_pct = (matched_count / len(src_cols)) * 100 if src_cols else 0.0
    
    # Fuzzy match remaining
    unmatched_src = src_cols - matched
    unmatched_tgt = tgt_cols - matched
    fuzzy_matched = 0
    
    for sc in unmatched_src:
        best_score = 0
        for tc in unmatched_tgt:
            score = fuzz.ratio(sc, tc) / 100.0
            if score > best_score:
                best_score = score
        if best_score >= 0.8:
            fuzzy_matched += 1
    
    total_matched = matched_count + fuzzy_matched
    total_pct = (total_matched / len(src_cols)) * 100 if src_cols else 0.0
    similarity = total_pct / 100.0
    
    conflicts = list(unmatched_src - {sc for sc in unmatched_src})[:5]
    
    return similarity, total_matched, total_pct, conflicts


def _classify_confidence(score: float) -> MatchConfidence:
    """Classify a score into a confidence tier (§11)."""
    for tier_key, tier in CONFIDENCE_TIERS.items():
        if tier["min"] <= score <= tier["max"]:
            return MatchConfidence(tier_key)
    return MatchConfidence.VERY_LOW


def _default_decision(confidence: MatchConfidence) -> MatchDecision:
    """Determine default decision based on confidence."""
    if confidence in (MatchConfidence.VERY_HIGH, MatchConfidence.HIGH):
        return MatchDecision.AUTO_MATCHED
    return MatchDecision.PENDING


def _get_alternatives(
    src_name: str,
    current_target: str,
    all_scores: list,
    assigned_targets: set,
) -> list[AlternativeCandidate]:
    """Get top alternative target candidates for a source table."""
    alternatives = []
    for s_name, t_name, score, _ in all_scores:
        if s_name == src_name and t_name != current_target and t_name not in assigned_targets:
            if score >= 50:
                alternatives.append(AlternativeCandidate(
                    target_table=t_name,
                    score=round(score, 1),
                    confidence=_classify_confidence(score),
                ))
    return alternatives[:5]
