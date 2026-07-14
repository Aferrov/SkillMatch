from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.linkedin import fetch_linkedin_profile, parse_linkedin_profile
from app.services.nlp_spacy import detect_career_spacy, calculate_match_spacy
from app.services.market_data import get_jobs_by_career
from app.utils.text_cleaner import clean_text

router = APIRouter()


class LinkedInRequest(BaseModel):
    url: str


@router.post("/analyze")
async def analyze_linkedin_endpoint(body: LinkedInRequest):
    """
    Analiza un perfil de LinkedIn dado su URL.
    Devuelve el mismo formato que /api/cv/analyze.
    """
    url = body.url.strip()

    # Validar URL
    if "linkedin.com/in/" not in url.lower():
        raise HTTPException(
            status_code=400,
            detail="La URL debe ser un perfil válido de LinkedIn (linkedin.com/in/usuario).",
        )

    try:
        # 1. Obtener datos del perfil desde RapidAPI
        raw_profile = fetch_linkedin_profile(url)

        # 2. Parsear y normalizar los datos
        profile = parse_linkedin_profile(raw_profile)

        # 3. Limpiar el texto virtual para el motor de matching
        clean = clean_text(profile["virtual_cv_text"])

        # 4. Detectar carrera
        career, scores = detect_career_spacy(clean)

        # 5. Calcular match con skills del mercado
        match_result = calculate_match_spacy(clean, career)

        # 6. Traer trabajos reales de la BD
        jobs = get_jobs_by_career(career)

        # 7. Respuesta en el mismo formato que /api/cv/analyze
        return {
            "name": profile["name"],
            "career": career,
            "career_scores": scores,
            "match": match_result["match"],
            "found_skills": match_result["found"],
            "missing_skills": match_result["missing"],
            "experience": profile["experience"],
            "education": profile["education"],
            "jobs": jobs,
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
