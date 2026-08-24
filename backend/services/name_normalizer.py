"""
Name Normalizer (§8.1)
======================
Normalizes table and column names for fuzzy matching.
Handles abbreviation expansion, tokenization, and cleanup.
"""

import re
from config import ABBREVIATION_MAP


def normalize_name(name: str, abbreviations: dict = None) -> str:
    """
    Normalize a table or column name for comparison.
    
    Steps:
    1. Convert to lowercase
    2. Remove schema/database prefixes
    3. Normalize separators (underscores, hyphens, spaces)
    4. Remove special characters
    5. Expand abbreviations
    6. Normalize plural/singular
    7. Return cleaned name
    """
    if abbreviations is None:
        abbreviations = ABBREVIATION_MAP
    
    # Step 1: Lowercase
    name = name.lower().strip()
    
    # Step 2: Remove schema/database prefix (e.g., "dbo.table" → "table")
    if "." in name:
        name = name.split(".")[-1]
    
    # Step 3: Normalize separators to spaces
    name = re.sub(r"[_\-\s]+", " ", name)
    
    # Step 4: Remove special characters (keep alphanumeric and spaces)
    name = re.sub(r"[^a-z0-9\s]", "", name)
    
    # Step 5: Tokenize
    tokens = name.split()
    
    # Step 6: Expand abbreviations
    expanded_tokens = []
    for token in tokens:
        expanded = abbreviations.get(token, token)
        expanded_tokens.append(expanded)
    
    # Step 7: Normalize plurals (simple s/es removal)
    final_tokens = []
    for token in expanded_tokens:
        singular = _singularize(token)
        final_tokens.append(singular)
    
    return " ".join(final_tokens)


def tokenize_name(name: str) -> list[str]:
    """Tokenize a normalized name into individual words."""
    normalized = normalize_name(name)
    return normalized.split()


def _singularize(word: str) -> str:
    """Simple English singularization."""
    if len(word) <= 2:
        return word
    
    # Don't singularize words that are already singular-looking
    exceptions = {"address", "business", "process", "access", "status", "class", "analysis"}
    if word in exceptions:
        return word
    
    if word.endswith("ies") and len(word) > 4:
        return word[:-3] + "y"
    if word.endswith("ses") and len(word) > 4:
        return word[:-2]
    if word.endswith("es") and word[-3] in "shxz":
        return word[:-2]
    if word.endswith("s") and not word.endswith("ss"):
        return word[:-1]
    
    return word


def get_ngrams(text: str, n: int = 3) -> set[str]:
    """Generate character n-grams from text."""
    text = text.replace(" ", "")
    if len(text) < n:
        return {text}
    return {text[i:i+n] for i in range(len(text) - n + 1)}


def ngram_similarity(text1: str, text2: str, n: int = 3) -> float:
    """Calculate n-gram similarity between two strings."""
    ngrams1 = get_ngrams(text1, n)
    ngrams2 = get_ngrams(text2, n)
    
    if not ngrams1 or not ngrams2:
        return 0.0
    
    intersection = ngrams1 & ngrams2
    union = ngrams1 | ngrams2
    
    return len(intersection) / len(union) if union else 0.0
