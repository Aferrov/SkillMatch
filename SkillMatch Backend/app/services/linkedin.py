"""
Servicio para extraer datos de perfiles de LinkedIn usando RapidAPI.
Usa la API "Fresh LinkedIn Profile Data" (tier gratuito ~100 req/mes).
"""

import os
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).parent.parent.parent / ".env")

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "")
RAPIDAPI_HOST = os.getenv("RAPIDAPI_LINKEDIN_HOST", "linkedin-data-api.p.rapidapi.com")


def fetch_linkedin_profile(linkedin_url: str) -> dict:
    """
    Llama a RapidAPI para obtener los datos de un perfil de LinkedIn.
    Retorna el JSON crudo de la API.
    """
    if not RAPIDAPI_KEY:
        raise ValueError("RAPIDAPI_KEY no está configurada en el archivo .env")

    url = f"https://{RAPIDAPI_HOST}/get-profile-data"

    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
    }
    params = {"linkedin_url": linkedin_url}

    response = requests.get(url, headers=headers, params=params, timeout=30)

    if response.status_code != 200:
        raise Exception(
            f"Error de RapidAPI ({response.status_code}): {response.text}"
        )

    return response.json()


def parse_linkedin_profile(raw: dict) -> dict:
    """
    Normaliza la respuesta de RapidAPI al formato que espera el frontend.
    Extrae: nombre, skills, experiencia, educación.
    """
    data = raw.get("data", raw)

    # --- Nombre ---
    first = data.get("first_name", "")
    last = data.get("last_name", "")
    name = f"{first} {last}".strip() or data.get("full_name", "Candidato")

    # --- Skills ---
    skills = []
    # Algunas APIs devuelven skills como lista de strings
    raw_skills = data.get("skills", [])
    for s in raw_skills:
        if isinstance(s, str):
            skills.append(s.lower().strip())
        elif isinstance(s, dict):
            skills.append(s.get("name", "").lower().strip())

    # --- Experiencia ---
    experience = []
    raw_exp = data.get("experiences", data.get("experience", []))
    for idx, exp in enumerate(raw_exp, start=1):
        if isinstance(exp, dict):
            # Construir periodo
            starts = exp.get("starts_at") or {}
            ends = exp.get("ends_at") or {}
            start_year = starts.get("year", "")
            end_year = ends.get("year", "Presente")
            period = f"{start_year} - {end_year}" if start_year else ""

            experience.append({
                "id": f"exp{idx}",
                "role": exp.get("title", ""),
                "company": exp.get("company", exp.get("company_name", "")),
                "period": period,
                "description": exp.get("description", "") or "",
            })

    # --- Educación ---
    education = []
    raw_edu = data.get("education", [])
    for idx, edu in enumerate(raw_edu, start=1):
        if isinstance(edu, dict):
            starts = edu.get("starts_at") or {}
            ends = edu.get("ends_at") or {}
            start_year = starts.get("year", "")
            end_year = ends.get("year", "")
            period = f"{start_year} - {end_year}" if start_year else ""

            degree = edu.get("degree_name", edu.get("degree", ""))
            field = edu.get("field_of_study", "")
            title = f"{degree} - {field}".strip(" -") if degree or field else ""

            education.append({
                "id": f"edu{idx}",
                "title": title,
                "institution": edu.get("school", edu.get("school_name", "")),
                "period": period,
                "kind": "studies",
            })

    # --- Headline / Título profesional (usado para detectar carrera) ---
    headline = data.get("headline", data.get("occupation", ""))
    summary = data.get("summary", data.get("about", ""))

    # Construir un "texto virtual" para que el motor de matching lo procese
    # igual que haría con el texto de un CV
    skills_text = " ".join(skills)
    exp_text = " ".join(
        f"{e['role']} {e['company']} {e['description']}" for e in experience
    )
    edu_text = " ".join(
        f"{e['title']} {e['institution']}" for e in education
    )
    virtual_cv_text = f"{headline} {summary} {skills_text} {exp_text} {edu_text}"

    return {
        "name": name,
        "skills": skills,
        "experience": experience,
        "education": education,
        "virtual_cv_text": virtual_cv_text,
    }
