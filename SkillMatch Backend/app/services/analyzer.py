from app.services.nlp_spacy import detect_career_spacy, calculate_match_spacy
from app.services.market_data import get_jobs_by_career
from app.services.parser import extract_experience_and_education, extract_name_from_cv


def analyze_cv(text: str, raw_text: str | None = None):
    """Pipeline principal usando spaCy + BD real"""

    raw_text = raw_text or text

    # 1. Extraer nombre
    name = extract_name_from_cv(raw_text)

    # 2. Detectar carrera
    career, scores = detect_career_spacy(text)

    # 3. Calcular match con skills reales
    result = calculate_match_spacy(text, career)

    # 4. Extraer experiencia y educación del texto
    experience, education = extract_experience_and_education(raw_text)

    # 5. Traer trabajos reales de la BD
    jobs = get_jobs_by_career(career)

    # 6. Respuesta final
    return {
        "name":           name,
        "career":         career,
        "career_scores":  scores,
        "match":          result["match"],
        "found_skills":   result["found"],
        "missing_skills": result["missing"],
        "experience":     experience,
        "education":      education,
        "jobs":           jobs,
    }
