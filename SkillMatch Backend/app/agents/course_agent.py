"""
CourseAgent — Agente de scraping de cursos online.

Scrapea cursos de múltiples plataformas:
  - Coursera (API pública de catálogo)
  - Udemy (API de afiliados)

Busca cursos relevantes basándose en las skills más demandadas
en la BD de trabajos.

También puede cargar los cursos estáticos del frontend como baseline.
"""

import os
import requests
from pathlib import Path
from dotenv import load_dotenv

from app.agents.base import BaseAgent

load_dotenv(dotenv_path=Path(__file__).parent.parent.parent / ".env")


# Skills por defecto a buscar si no hay datos en la BD
DEFAULT_SKILLS_TO_SEARCH = [
    "python", "javascript", "react", "node.js", "sql", "docker",
    "aws", "kubernetes", "git", "power bi", "scrum", "figma",
    "typescript", "postgresql", "machine learning", "data analysis",
    "excel", "java", "c#", "angular", "vue.js", "mongodb",
    "terraform", "ci/cd", "selenium", "cypress", "tableau",
    "google ads", "seo", "marketing digital",
]

# Cursos estáticos base — los mismos del frontend para garantizar cobertura mínima
STATIC_COURSES = [
    {"name": "Curso de React.js", "platform": "Platzi", "skill": "React",
     "level": "Intermedio", "url": "https://platzi.com/cursos/react/",
     "duration": "12 horas", "rating": 4.8, "is_free": False, "is_certification": False},
    {"name": "Curso de TypeScript", "platform": "Platzi", "skill": "TypeScript",
     "level": "Intermedio", "url": "https://platzi.com/cursos/typescript/",
     "duration": "10 horas", "rating": 4.7, "is_free": False, "is_certification": False},
    {"name": "HTML, CSS, and Javascript for Web Developers", "platform": "Coursera",
     "skill": "CSS", "level": "Básico",
     "url": "https://www.coursera.org/learn/html-css-javascript-for-web-developers",
     "duration": "40 horas", "rating": 4.7, "is_free": True, "is_certification": False},
    {"name": "Curso de Node.js", "platform": "Platzi", "skill": "Node.js",
     "level": "Intermedio", "url": "https://platzi.com/cursos/nodejs/",
     "duration": "15 horas", "rating": 4.8, "is_free": False, "is_certification": False},
    {"name": "Python for Everybody Specialization", "platform": "Coursera",
     "skill": "Python", "level": "Básico",
     "url": "https://www.coursera.org/specializations/python",
     "duration": "80 horas", "rating": 4.8, "is_free": False, "is_certification": False},
    {"name": "Curso de Docker desde cero", "platform": "Platzi", "skill": "Docker",
     "level": "Básico", "url": "https://platzi.com/cursos/docker/",
     "duration": "12 horas", "rating": 4.8, "is_free": False, "is_certification": False},
    {"name": "AWS Certified Cloud Practitioner Essentials", "platform": "AWS Skill Builder",
     "skill": "AWS", "level": "Básico", "url": "https://skillbuilder.aws/",
     "duration": "30 horas", "rating": 4.6, "is_free": True, "is_certification": True},
    {"name": "Curso Profesional de Git y GitHub", "platform": "Platzi", "skill": "Git",
     "level": "Básico", "url": "https://platzi.com/cursos/git-github/",
     "duration": "8 horas", "rating": 4.9, "is_free": True, "is_certification": False},
    {"name": "Power BI desde cero", "platform": "Cibertec", "skill": "Power BI",
     "level": "Básico",
     "url": "https://www.cibertec.edu.pe/extension-profesional/cursos-cortos/power-bi/",
     "duration": "15 horas", "rating": 4.6, "is_free": False, "is_certification": False},
    {"name": "Data Visualization with Tableau", "platform": "Coursera",
     "skill": "Tableau", "level": "Intermedio",
     "url": "https://www.coursera.org/specializations/data-visualization",
     "duration": "40 horas", "rating": 4.7, "is_free": False, "is_certification": False},
    {"name": "Curso de SQL y MySQL", "platform": "Platzi", "skill": "SQL",
     "level": "Básico", "url": "https://platzi.com/cursos/sql-mysql/",
     "duration": "12 horas", "rating": 4.8, "is_free": False, "is_certification": False},
    {"name": "Professional Scrum Master I (PSM I)", "platform": "Scrum.org",
     "skill": "PSM I/II", "level": "Intermedio",
     "url": "https://www.scrum.org/professional-scrum-master-i-certification",
     "duration": "20 horas", "rating": 4.9, "is_free": False, "is_certification": True},
    {"name": "Project Management Professional (PMP)® Exam Prep", "platform": "PMI",
     "skill": "PMP", "level": "Avanzado",
     "url": "https://www.pmi.org/certifications/project-management-pmp",
     "duration": "60 horas", "rating": 4.8, "is_free": False, "is_certification": True},
    {"name": "Curso de Diseño UX con Figma", "platform": "Platzi", "skill": "Figma",
     "level": "Básico", "url": "https://platzi.com/cursos/figma/",
     "duration": "10 horas", "rating": 4.8, "is_free": False, "is_certification": False},
    {"name": "Certificación de Google Ads – Búsqueda", "platform": "Google Cloud Skills",
     "skill": "Google Ads", "level": "Intermedio",
     "url": "https://skillshop.exceedlms.com/student/path/18128",
     "duration": "8 horas", "rating": 4.7, "is_free": True, "is_certification": True},
    {"name": "Search Engine Optimization (SEO) Specialization", "platform": "Coursera",
     "skill": "SEO", "level": "Intermedio",
     "url": "https://www.coursera.org/specializations/seo",
     "duration": "50 horas", "rating": 4.6, "is_free": False, "is_certification": False},
    {"name": "ITIL 4 Foundation", "platform": "Coursera", "skill": "ITIL",
     "level": "Básico", "url": "https://www.coursera.org/learn/itil-4-foundation",
     "duration": "20 horas", "rating": 4.6, "is_free": False, "is_certification": True},
    {"name": "Curso de Terraform", "platform": "Platzi", "skill": "Terraform",
     "level": "Intermedio", "url": "https://platzi.com/cursos/terraform/",
     "duration": "14 horas", "rating": 4.7, "is_free": False, "is_certification": False},
    {"name": "Kubernetes for the Absolute Beginners", "platform": "Udemy",
     "skill": "Kubernetes", "level": "Intermedio",
     "url": "https://www.udemy.com/topic/kubernetes/",
     "duration": "20 horas", "rating": 4.7, "is_free": False, "is_certification": False},
    {"name": "Selenium WebDriver con Java", "platform": "Udemy", "skill": "Selenium",
     "level": "Intermedio",
     "url": "https://www.udemy.com/topic/selenium-webdriver/",
     "duration": "22 horas", "rating": 4.6, "is_free": False, "is_certification": False},
    {"name": "Curso de Cypress", "platform": "Platzi", "skill": "Cypress",
     "level": "Intermedio", "url": "https://platzi.com/cursos/cypress/",
     "duration": "7 horas", "rating": 4.7, "is_free": False, "is_certification": False},
    {"name": "Inglés para Profesionales", "platform": "Británico",
     "skill": "Inglés avanzado", "level": "Avanzado",
     "url": "https://www.britanico.edu.pe/cursos/ingles/adultos/",
     "duration": "40 horas", "rating": 4.7, "is_free": False, "is_certification": False},
    {"name": "Curso de Meta Ads", "platform": "Platzi", "skill": "Meta Ads",
     "level": "Intermedio", "url": "https://platzi.com/cursos/meta-ads/",
     "duration": "6 horas", "rating": 4.6, "is_free": False, "is_certification": False},
    {"name": "CCNA: Introduction to Networks", "platform": "edX", "skill": "CCNA",
     "level": "Intermedio", "url": "https://www.edx.org/learn/networking",
     "duration": "70 horas", "rating": 4.7, "is_free": False, "is_certification": True},
    {"name": "Lean Production", "platform": "edX", "skill": "Lean Manufacturing",
     "level": "Intermedio", "url": "https://www.edx.org/learn/lean-manufacturing",
     "duration": "30 horas", "rating": 4.7, "is_free": False, "is_certification": False},
    {"name": "Six Sigma Yellow Belt Specialization", "platform": "Coursera",
     "skill": "Six Sigma", "level": "Intermedio",
     "url": "https://www.coursera.org/specializations/six-sigma-yellow-belt",
     "duration": "50 horas", "rating": 4.6, "is_free": False, "is_certification": True},
]


class CourseAgent(BaseAgent):
    """
    Agente que scrapea cursos de múltiples plataformas.
    Estrategia:
      1. Cargar cursos estáticos base (garantiza cobertura mínima)
      2. Buscar cursos en Coursera API pública
      3. Buscar cursos en Udemy API
    """

    name = "course_agent"

    def __init__(self, skills_to_search: list[str] | None = None):
        self.skills_to_search = skills_to_search or self._get_demanded_skills()

    def _get_demanded_skills(self) -> list[str]:
        """
        Obtiene las skills más demandadas de la BD de trabajos.
        Si no hay datos, usa la lista por defecto.
        """
        try:
            from backend.database import Session, SkillRequired
            session = Session()
            rows = (session.query(SkillRequired.skill_name)
                    .group_by(SkillRequired.skill_name)
                    .order_by(SkillRequired.skill_name)
                    .limit(30)
                    .all())
            session.close()

            if rows:
                return [row[0].lower().strip() for row in rows if row[0]]
        except Exception:
            pass

        return DEFAULT_SKILLS_TO_SEARCH

    # ── Paso 1: Scrape ──────────────────────────────────────────────────

    def scrape(self) -> list[dict]:
        """Recopila cursos de múltiples fuentes."""
        all_courses = []

        # 1. Cursos estáticos base
        print("   📚 Cargando cursos estáticos base...")
        for course in STATIC_COURSES:
            course["source"] = "static"
            all_courses.append(course)
        print(f"      → {len(STATIC_COURSES)} cursos estáticos")

        # 2. Coursera API pública
        print("   🎓 Buscando en Coursera...")
        coursera_courses = self._scrape_coursera()
        all_courses.extend(coursera_courses)
        print(f"      → {len(coursera_courses)} cursos de Coursera")

        # 3. Udemy API
        print("   📖 Buscando en Udemy...")
        udemy_courses = self._scrape_udemy()
        all_courses.extend(udemy_courses)
        print(f"      → {len(udemy_courses)} cursos de Udemy")

        return all_courses

    def _scrape_coursera(self) -> list[dict]:
        """
        Usa la API pública de catálogo de Coursera.
        No requiere API key — es pública para consultas básicas.
        """
        courses = []
        search_skills = self.skills_to_search[:15]  # Limitar requests

        for skill in search_skills:
            try:
                url = "https://api.coursera.org/api/courses.v1"
                params = {
                    "q": "search",
                    "query": skill,
                    "limit": 3,
                    "fields": "name,slug,description,workload",
                }
                response = requests.get(url, params=params, timeout=10)

                if response.status_code != 200:
                    continue

                data = response.json()
                for item in data.get("elements", []):
                    slug = item.get("slug", "")
                    courses.append({
                        "source": "coursera",
                        "name": item.get("name", ""),
                        "platform": "Coursera",
                        "skill": skill.title(),
                        "level": "Intermedio",
                        "url": f"https://www.coursera.org/learn/{slug}",
                        "duration": item.get("workload", "20 horas"),
                        "rating": None,
                        "is_free": False,
                        "is_certification": False,
                    })

            except Exception as e:
                print(f"      ⚠ Error buscando '{skill}' en Coursera: {e}")

        return courses

    def _scrape_udemy(self) -> list[dict]:
        """
        Usa la API pública de Udemy para buscar cursos.
        Si no hay credenciales, retorna lista vacía sin error.
        """
        udemy_client_id = os.getenv("UDEMY_CLIENT_ID", "")
        udemy_client_secret = os.getenv("UDEMY_CLIENT_SECRET", "")

        # Si no hay credenciales de Udemy, saltar sin error
        if not udemy_client_id or not udemy_client_secret:
            print("      ℹ Credenciales de Udemy no configuradas, saltando...")
            return []

        courses = []
        search_skills = self.skills_to_search[:10]

        for skill in search_skills:
            try:
                url = "https://www.udemy.com/api-2.0/courses/"
                params = {
                    "search": skill,
                    "page_size": 3,
                    "ordering": "relevance",
                    "language": "es",
                }
                response = requests.get(
                    url,
                    params=params,
                    auth=(udemy_client_id, udemy_client_secret),
                    timeout=10,
                )

                if response.status_code != 200:
                    continue

                data = response.json()
                for item in data.get("results", []):
                    course_url = item.get("url", "")
                    if course_url and not course_url.startswith("http"):
                        course_url = f"https://www.udemy.com{course_url}"

                    courses.append({
                        "source": "udemy",
                        "name": item.get("title", ""),
                        "platform": "Udemy",
                        "skill": skill.title(),
                        "level": "Intermedio",
                        "url": course_url,
                        "duration": f"{item.get('content_info_short', '10 horas')}",
                        "rating": round(float(item.get("avg_rating", 0)), 1) or None,
                        "is_free": item.get("is_paid") is False,
                        "is_certification": False,
                    })

            except Exception as e:
                print(f"      ⚠ Error buscando '{skill}' en Udemy: {e}")

        return courses

    # ── Paso 2: Parse ───────────────────────────────────────────────────

    def parse(self, raw_items: list[dict]) -> list[dict]:
        """
        Normaliza los cursos scrapeados.
        - Limpia nombres y URLs
        - Normaliza niveles
        - Asegura campos requeridos
        """
        parsed = []

        for course in raw_items:
            # Saltar cursos sin URL o nombre
            if not course.get("url") or not course.get("name"):
                continue

            # Normalizar nivel
            level = course.get("level", "Intermedio")
            if level not in ("Básico", "Intermedio", "Avanzado"):
                level = "Intermedio"

            # Normalizar duración
            duration = course.get("duration", "")
            if not duration or duration == "None":
                duration = "Variable"

            parsed.append({
                "source": course.get("source", "unknown"),
                "name": course["name"].strip(),
                "platform": course.get("platform", "Otro"),
                "skill": course.get("skill", "General").strip(),
                "level": level,
                "url": course["url"].strip(),
                "duration": duration,
                "rating": course.get("rating"),
                "is_free": bool(course.get("is_free", False)),
                "is_certification": bool(course.get("is_certification", False)),
            })

        return parsed

    # ── Paso 3: Store ───────────────────────────────────────────────────

    def store(self, parsed_items: list[dict]) -> int:
        """Guarda cursos en la BD con deduplicación por URL."""
        from backend.database import Session, Course, CourseSkill

        session = Session()
        saved = 0

        try:
            for course in parsed_items:
                url = course.get("url")
                if not url:
                    continue

                # Deduplicar por URL
                exists = session.query(Course).filter_by(url=url).first()
                if exists:
                    continue

                new_course = Course(
                    source=course.get("source", "unknown"),
                    name=course["name"],
                    platform=course["platform"],
                    skill=course["skill"],
                    level=course["level"],
                    url=url,
                    duration=course.get("duration", "Variable"),
                    rating=course.get("rating"),
                    is_free=course.get("is_free", False),
                    is_certification=course.get("is_certification", False),
                )
                session.add(new_course)
                session.flush()

                # Asociar skill principal
                session.add(CourseSkill(
                    course_id=new_course.id,
                    skill_name=course["skill"].lower(),
                ))

                session.commit()
                saved += 1

        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()

        return saved
