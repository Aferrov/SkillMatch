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
    print("✓ Base de datos lista (jobs, courses, agent_runs)")