from sqlalchemy import create_engine, Column, Integer, Text, Float, Boolean, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///skillmatch.db")
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

def init_db():
    Base.metadata.create_all(engine)
    print("✓ Base de datos lista")