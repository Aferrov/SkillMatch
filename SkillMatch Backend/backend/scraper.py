import requests
import os
from pathlib import Path
from dotenv import load_dotenv
import time

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

# Lista de búsquedas por carrera/área
JOB_QUERIES = [
    # Tecnología
    "software developer",
    "data analyst",
    "cybersecurity",
    "network engineer",
    # Administración y negocios
    "business administrator",
    "marketing manager",
    "accountant",
    "human resources",
    # Salud
    "nurse",
    "doctor",
    "pharmacist",
    "psychologist",
    # Ingeniería
    "civil engineer",
    "mechanical engineer",
    "electrical engineer",
    "industrial engineer",
    # Educación
    "teacher",
    "professor",
    # Diseño
    "graphic designer",
    "UX designer",
    # Legal
    "lawyer",
    "legal assistant",
]

def fetch_jobs_by_query(query: str, country="pe"):
    url = "https://jsearch.p.rapidapi.com/search"
    headers = {
        "X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY"),
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }
    params = {
        "query": query,
        "page": "1",
        "num_pages": "1",
        "country": country,
        "language": "es"
    }

    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        data = response.json()
        jobs = []
        for item in data.get("data", []):
            jobs.append({
                "source":      "jsearch",
                "title":       item.get("job_title"),
                "company":     item.get("employer_name"),
                "location":    item.get("job_city") or item.get("job_country"),
                "description": item.get("job_description"),
                "url":         item.get("job_apply_link"),
                "category":    query,
            })
        return jobs
    except Exception as e:
        print(f"   ⚠ Error en '{query}': {e}")
        return []

def fetch_all_jobs():
    all_jobs = []

    for query in JOB_QUERIES:
        print(f"🔍 Buscando: {query}...")
        jobs = fetch_jobs_by_query(query)
        print(f"   → {len(jobs)} trabajos encontrados")
        all_jobs.extend(jobs)
        time.sleep(2)  # Espera 2 segundos entre requests para no exceder el límite

    print(f"\n📦 Total trabajos obtenidos: {len(all_jobs)}")
    return all_jobs