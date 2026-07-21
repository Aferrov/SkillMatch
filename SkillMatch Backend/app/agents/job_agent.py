"""
JobAgent — Agente de scraping de ofertas de trabajo.

Scrapea trabajos de JSearch (RapidAPI), extrae skills con Groq (LLaMA 3.3),
y los guarda en la BD SQLite con deduplicación por URL.

Refactorización del pipeline monolítico original en backend/scraper.py + parser.py.
"""

import os
import time
import json
import requests
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
from groq import Groq

from app.agents.base import BaseAgent

load_dotenv(dotenv_path=Path(__file__).parent.parent.parent / ".env")


# Queries por área profesional — configurables
DEFAULT_JOB_QUERIES = [
    # Tecnología
    "software developer", "data analyst", "cybersecurity",
    "network engineer", "backend developer", "frontend developer",
    # Administración y negocios
    "business administrator", "marketing manager", "accountant",
    "human resources",
    # Salud
    "nurse", "doctor", "pharmacist", "psychologist",
    # Ingeniería
    "civil engineer", "mechanical engineer", "electrical engineer",
    "industrial engineer",
    # Educación
    "teacher", "professor",
    # Diseño
    "graphic designer", "UX designer",
    # Legal
    "lawyer", "legal assistant",
]


class JobAgent(BaseAgent):
    """
    Agente que scrapea ofertas de trabajo de JSearch (RapidAPI)
    y extrae skills con IA (Groq).
    """

    name = "job_agent"

    def __init__(
        self,
        queries: list[str] | None = None,
        country: str = "pe",
        num_pages: int = 1,
        delay_seconds: float = 2.0,
    ):
        self.queries = queries or DEFAULT_JOB_QUERIES
        self.country = country
        self.num_pages = num_pages
        self.delay_seconds = delay_seconds

        self.rapidapi_key = os.getenv("RAPIDAPI_KEY", "")
        self.groq_client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))

        if not self.rapidapi_key:
            print("   ⚠ RAPIDAPI_KEY no configurada — el scraper no podrá funcionar")

    # ── Paso 1: Scrape ──────────────────────────────────────────────────

    def scrape(self) -> list[dict]:
        """Busca trabajos en JSearch para cada query configurada."""
        all_jobs = []

        for query in self.queries:
            print(f"   🔍 Buscando: {query}...")
            jobs = self._fetch_jobs(query)
            print(f"      → {len(jobs)} trabajos encontrados")
            all_jobs.extend(jobs)

            if self.delay_seconds > 0:
                time.sleep(self.delay_seconds)

        return all_jobs

    def _fetch_jobs(self, query: str) -> list[dict]:
        """Hace la request a JSearch API."""
        url = "https://jsearch.p.rapidapi.com/search"
        headers = {
            "X-RapidAPI-Key": self.rapidapi_key,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        }
        params = {
            "query": query,
            "page": "1",
            "num_pages": str(self.num_pages),
            "country": self.country,
            "language": "es",
        }

        try:
            response = requests.get(url, headers=headers, params=params, timeout=15)
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
            print(f"      ⚠ Error en '{query}': {e}")
            return []

    # ── Paso 2: Parse (extraer skills con IA) ───────────────────────────

    def parse(self, raw_items: list[dict]) -> list[dict]:
        """Enriquece cada trabajo extrayendo skills con Groq/LLaMA."""
        parsed = []

        for i, job in enumerate(raw_items):
            description = job.get("description", "")
            if not description:
                job["skills"] = self._empty_skills()
                parsed.append(job)
                continue

            print(f"   🧠 Extrayendo skills [{i+1}/{len(raw_items)}]: "
                  f"{job.get('title', '?')[:50]}")

            skills = self._extract_skills(description)
            job["skills"] = skills
            parsed.append(job)

        return parsed

    def _extract_skills(self, description: str) -> dict:
        """Llama a Groq para extraer skills de una descripción de trabajo."""
        prompt = f"""Analiza esta descripción de trabajo y extrae los requisitos.
Responde SOLO con JSON válido, sin markdown ni texto extra:

{{
  "skills_hard": ["habilidades técnicas"],
  "skills_soft": ["habilidades blandas"],
  "tools": ["herramientas"],
  "experience_years": null,
  "languages": ["idiomas"]
}}

Descripción:
{description[:2000]}"""

        try:
            response = self.groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=500,
            )

            text = response.choices[0].message.content
            text = (text.strip()
                    .removeprefix("```json")
                    .removeprefix("```")
                    .removesuffix("```")
                    .strip())
            result = json.loads(text)

            return {
                "skills_hard":      result.get("skills_hard") or [],
                "skills_soft":      result.get("skills_soft") or [],
                "tools":            result.get("tools") or [],
                "languages":        result.get("languages") or [],
                "experience_years": result.get("experience_years"),
            }

        except Exception as e:
            print(f"      ⚠ Error extrayendo skills: {e}")
            return self._empty_skills()

    @staticmethod
    def _empty_skills() -> dict:
        return {
            "skills_hard": [], "skills_soft": [],
            "tools": [], "languages": [],
            "experience_years": None,
        }

    # ── Paso 3: Store ───────────────────────────────────────────────────

    def store(self, parsed_items: list[dict]) -> int:
        """Guarda trabajos en la BD con deduplicación por URL."""
        # Importar aquí para evitar circular imports con el módulo de BD
        from backend.database import Session, Job, SkillRequired

        session = Session()
        saved = 0

        try:
            for job in parsed_items:
                url = job.get("url")
                if not url:
                    continue

                # Deduplicar por URL
                exists = session.query(Job).filter_by(url=url).first()
                if exists:
                    continue

                new_job = Job(
                    source=job.get("source", "jsearch"),
                    title=job.get("title"),
                    company=job.get("company"),
                    location=job.get("location"),
                    description=job.get("description"),
                    url=url,
                )
                session.add(new_job)
                session.flush()  # Para obtener el ID

                # Guardar skills asociadas
                skills = job.get("skills", {})
                for skill in skills.get("skills_hard", []):
                    session.add(SkillRequired(
                        job_id=new_job.id, skill_name=skill, skill_type="hard"
                    ))
                for skill in skills.get("tools", []):
                    session.add(SkillRequired(
                        job_id=new_job.id, skill_name=skill, skill_type="tool"
                    ))
                for skill in skills.get("skills_soft", []):
                    session.add(SkillRequired(
                        job_id=new_job.id, skill_name=skill, skill_type="soft"
                    ))

                session.commit()
                saved += 1

        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()

        return saved
