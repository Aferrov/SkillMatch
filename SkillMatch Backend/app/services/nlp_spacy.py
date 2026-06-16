import spacy
from app.services.market_data import get_all_careers, get_jobs_by_career, expand_skills_with_synonyms

nlp = spacy.load("es_core_news_md")

def detect_career_spacy(text: str):
    """Detecta carrera con carreras normalizadas y sinónimos"""
    MARKET_SKILLS = get_all_careers()
    text_expanded = expand_skills_with_synonyms(text)
    scores = {}

    for career, skills in MARKET_SKILLS.items():
        score = sum(1 for skill in skills if skill in text_expanded)
        scores[career] = score

    # Filtrar "Otros" de la detección principal
    scores_filtered = {k: v for k, v in scores.items() if k != "Otros"}

    if not scores_filtered or max(scores_filtered.values()) == 0:
        return "Tecnología", scores

    detected = max(scores_filtered, key=scores_filtered.get)
    return detected, scores_filtered

def calculate_match_spacy(text: str, career: str):
    """Calcula match con expansión de sinónimos"""
    MARKET_SKILLS = get_all_careers()
    text_expanded = expand_skills_with_synonyms(text)

    skills = MARKET_SKILLS.get(career, [])
    if not skills:
        return {"match": 0, "found": [], "missing": []}

    found   = [s for s in skills if s in text_expanded]
    missing = [s for s in skills if s not in text_expanded]
    match   = (len(found) / len(skills)) * 100

    return {
        "match":   round(match, 2),
        "found":   found,
        "missing": missing
    }