from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
import os

load_dotenv(dotenv_path=Path(__file__).parent.parent.parent / ".env")

db_url = os.getenv("DATABASE_URL", "sqlite:///skillmatch.db")
if db_url.startswith("sqlite:///") and not db_url.startswith("sqlite:////"):
    db_path = Path(__file__).parent.parent.parent / db_url.replace("sqlite:///", "")
    db_url = f"sqlite:///{db_path}"

engine = create_engine(db_url)

# Mapeo de palabras clave del título → carrera real
CAREER_MAPPING = {
    "Tecnología": ["software", "developer", "engineer", "backend", "frontend", "fullstack",
                   "devops", "programmer", "data", "analytics", "machine learning", "ai",
                   "cloud", "architect", "python", "java", "react", "node", "fastapi"],
    "Ciberseguridad": ["cybersecurity", "cyber", "security", "soc", "pentesting",
                       "networking", "network", "firewall", "infraestructura"],
    "Marketing": ["marketing", "content", "social media", "seo", "branding",
                  "digital", "growth", "community", "publicidad"],
    "Administración": ["administrator", "business", "operations", "sales",
                       "hr", "human resources", "administrative", "gestor"],
    "Contabilidad": ["accountant", "contable", "finanzas", "finance",
                     "contador", "bookkeeper", "tesorería"],
    "Salud": ["nurse", "doctor", "médico", "enfermera", "pharmacist",
              "psicólogo", "psychologist", "ocupacional", "health"],
    "Ingeniería": ["civil", "mechanical", "electrical", "industrial",
                   "ingeniero", "engineer"],
    "Educación": ["teacher", "professor", "docente", "instructor",
                  "tutor", "educador", "k-12"],
    "Diseño": ["designer", "graphic", "ux", "ui", "diseñador",
               "creative", "visual", "pixel"],
    "Legal": ["lawyer", "legal", "abogado", "juridico", "paralegal"],
}

# Sinónimos de skills para mejor detección
SKILL_SYNONYMS = {
    "machine learning": ["aprendizaje automático", "ml", "deep learning"],
    "python": ["python3", "py"],
    "javascript": ["js", "typescript", "ts"],
    "base de datos": ["bases de datos", "database", "bd", "db"],
    "aws": ["amazon web services", "cloud aws", "ec2", "s3", "lambda"],
    "sql": ["mysql", "postgresql", "sqlite", "pl/sql", "sql server"],
    "docker": ["contenedores", "container", "kubernetes", "k8s"],
    "git": ["github", "gitlab", "control de versiones"],
    "react": ["reactjs", "react.js"],
    "node": ["nodejs", "node.js"],
    "fastapi": ["fast api", "api rest", "rest api"],
    "scrum": ["agile", "metodologías ágiles", "kanban", "sprint"],
    "liderazgo": ["líder", "team lead", "gestión de equipos"],
    "comunicación": ["comunicación efectiva", "habilidades comunicativas"],
    "análisis de datos": ["data analytics", "analista de datos", "análisis"],
    "power bi": ["powerbi", "bi", "business intelligence"],
    "tableau": ["visualización de datos", "data visualization"],
    "pytorch": ["torch", "deep learning framework"],
    "scikit-learn": ["sklearn", "machine learning library"],
    "nlp": ["procesamiento de lenguaje natural", "natural language processing"],
}

def normalize_title_to_career(title: str) -> str:
    """Convierte un título de trabajo en una carrera normalizada"""
    title_lower = title.lower()
    for career, keywords in CAREER_MAPPING.items():
        if any(kw in title_lower for kw in keywords):
            return career
    return "Otros"

def get_all_careers() -> dict:
    """Construye MARKET_SKILLS dinámicamente con carreras normalizadas"""
    with engine.connect() as conn:
        rows = conn.execute(text("""
            SELECT DISTINCT j.title, sr.skill_name
            FROM jobs j
            JOIN skills_required sr ON sr.job_id = j.id
            WHERE j.title IS NOT NULL AND sr.skill_name IS NOT NULL
        """)).fetchall()

    careers = {}
    for title, skill in rows:
        if not title or not skill:
            continue
        category = normalize_title_to_career(title)
        if category not in careers:
            careers[category] = []
        skill_lower = skill.lower().strip()
        if skill_lower and skill_lower not in careers[category]:
            careers[category].append(skill_lower)

    return careers

def get_jobs_by_career(career: str) -> list:
    """Trae trabajos reales desde la BD por carrera normalizada"""
    keywords = CAREER_MAPPING.get(career, [career.lower()])
    conditions = " OR ".join([f"LOWER(j.title) LIKE '%{kw}%'" for kw in keywords[:5]])

    with engine.connect() as conn:
        rows = conn.execute(text(f"""
            SELECT DISTINCT j.title, j.company, j.url
            FROM jobs j
            WHERE {conditions}
            LIMIT 10
        """)).fetchall()
    return [{"title": row[0], "company": row[1], "url": row[2]} for row in rows]

def expand_skills_with_synonyms(text: str) -> str:
    """Expande el texto del CV agregando sinónimos de skills"""
    text_lower = text.lower()
    extra = []
    for canonical, synonyms in SKILL_SYNONYMS.items():
        # Si el CV menciona cualquier sinónimo, agregar el término canónico
        if any(syn in text_lower for syn in synonyms) or canonical in text_lower:
            extra.append(canonical)
            extra.extend(synonyms)
    return text_lower + " " + " ".join(extra)

MARKET_SKILLS = get_all_careers()
MARKET_JOBS = {}