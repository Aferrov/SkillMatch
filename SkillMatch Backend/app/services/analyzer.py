from app.services.nlp_spacy import detect_career_spacy, calculate_match_spacy
from app.services.market_data import get_jobs_by_career
from app.services.parser import extract_experience_and_education


def analyze_cv(text: str, raw_text: str | None = None):
    """Pipeline principal usando spaCy + BD real"""

    raw_text = raw_text or text

    # 1. Detectar carrera
    career, scores = detect_career_spacy(text)

    # 2. Calcular match con skills reales
    result = calculate_match_spacy(text, career)

    # 3. Extraer experiencia y educación del texto
    experience, education = extract_experience_and_education(raw_text)

    # 4. Traer trabajos reales de la BD
    jobs = get_jobs_by_career(career)

    # 5. Respuesta final
    return {
        "career":         career,
        "career_scores":  scores,
        "match":          result["match"],
        "found_skills":   result["found"],
        "missing_skills": result["missing"],
        "experience":     experience,
        "education":      education,
        "jobs":           jobs,
    }
