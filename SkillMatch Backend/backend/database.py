from sqlalchemy import create_engine, Column, Integer, Text, Float, Boolean, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///skillmatch.db")

# Resolve relative sqlite paths to be relative to this file's parent dir
if DATABASE_URL.startswith("sqlite:///") and not DATABASE_URL.startswith("sqlite:////"):
    db_path = Path(__file__).parent / DATABASE_URL.replace("sqlite:///", "")
    DATABASE_URL = f"sqlite:///{db_path}"

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
Base = declarative_base()


class Job(Base):
    __tablename__ = "jobs"
    id          = Column(Integer, primary_key=True)
    source      = Column(Text)
    title       = Column(Text)
    company     = Column(Text)
    location    = Column(Text)
    description = Column(Text)
    url         = Column(Text, unique=True)
    scraped_at  = Column(DateTime, default=datetime.now)


class SkillRequired(Base):
    __tablename__ = "skills_required"
    id         = Column(Integer, primary_key=True)
    job_id     = Column(Integer)
    skill_name = Column(Text)
    skill_type = Column(Text)


class Course(Base):
    """Cursos scrapeados de plataformas externas."""
    __tablename__ = "courses"
    id               = Column(Integer, primary_key=True)
    source           = Column(Text)           # "coursera", "udemy", "platzi", "static"
    name             = Column(Text)
    platform         = Column(Text)           # Nombre visible de la plataforma
    skill            = Column(Text)           # Skill principal que enseña
    level            = Column(Text)           # "Básico", "Intermedio", "Avanzado"
    url              = Column(Text, unique=True)
    duration         = Column(Text)
    rating           = Column(Float, nullable=True)
    is_free          = Column(Boolean, default=False)
    is_certification = Column(Boolean, default=False)
    scraped_at       = Column(DateTime, default=datetime.now)


class CourseSkill(Base):
    """Skills asociadas a un curso (relación 1-N)."""
    __tablename__ = "course_skills"
    id         = Column(Integer, primary_key=True)
    course_id  = Column(Integer)
    skill_name = Column(Text)


class User(Base):
    """Usuario registrado en SkillMatch."""
    __tablename__ = "users"
    id            = Column(Integer, primary_key=True)
    name          = Column(Text, nullable=False)
    email         = Column(Text, unique=True, nullable=False, index=True)
    password_hash = Column(Text, nullable=False)   # pbkdf2_sha256$iteraciones$salt$hash
    plan          = Column(Text, default="Free")   # "Free" | "Premium"
    created_at    = Column(DateTime, default=datetime.now)
    last_login_at = Column(DateTime, nullable=True)


class UserProfile(Base):
    """
    Estado persistido de la sesión de un usuario: último análisis de CV,
    perfil editado y preferencias. Se guarda como JSON para que el frontend
    pueda restaurar la sesión tal cual la dejó, incluso en otro dispositivo.
    """
    __tablename__ = "user_profiles"
    id            = Column(Integer, primary_key=True)
    user_id       = Column(Integer, unique=True, index=True)
    analysis_json = Column(Text, nullable=True)    # resultado crudo de /api/cv/analyze
    profile_json  = Column(Text, nullable=True)    # UserProfile editado en el frontend
    prefs_json    = Column(Text, nullable=True)    # preferencias laborales
    updated_at    = Column(DateTime, default=datetime.now, onupdate=datetime.now)


class AnalysisRun(Base):
    """
    Un registro por cada análisis de CV que hace el usuario. Permite mostrar
    en el panel datos reales (cuántos análisis lleva, cuándo fue el último,
    cómo evoluciona su puntuación) en vez de cifras fijas.
    """
    __tablename__ = "analysis_runs"
    id             = Column(Integer, primary_key=True)
    user_id        = Column(Integer, index=True)
    career         = Column(Text, nullable=True)
    score          = Column(Integer, nullable=True)
    skills_found   = Column(Integer, default=0)
    skills_missing = Column(Integer, default=0)
    source         = Column(Text, default="cv")   # "cv" | "linkedin" | "manual"
    created_at     = Column(DateTime, default=datetime.now)


class AgentRun(Base):
    """Registro de cada ejecución de un agente."""
    __tablename__ = "agent_runs"
    id           = Column(Integer, primary_key=True)
    agent_name   = Column(Text)         # "job_agent", "course_agent"
    status       = Column(Text)         # "running", "completed", "failed"
    items_found  = Column(Integer, default=0)
    items_saved  = Column(Integer, default=0)
    errors       = Column(Integer, default=0)
    error_detail = Column(Text, nullable=True)
    started_at   = Column(DateTime, default=datetime.now)
    finished_at  = Column(DateTime, nullable=True)


def init_db():
    Base.metadata.create_all(engine)
    print("✓ Base de datos lista (jobs, courses, agent_runs, users)")