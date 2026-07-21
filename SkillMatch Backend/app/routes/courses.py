"""
Endpoints API para consultar cursos desde la BD.

GET  /api/courses             — Lista cursos con filtros opcionales
GET  /api/courses/recommend   — Cursos recomendados para brechas del usuario
GET  /api/courses/platforms   — Plataformas disponibles
GET  /api/courses/stats       — Estadísticas del catálogo
"""

from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter()


@router.get("")
async def list_courses(
    skill: Optional[str] = Query(None, description="Filtrar por skill"),
    platform: Optional[str] = Query(None, description="Filtrar por plataforma"),
    level: Optional[str] = Query(None, description="Filtrar por nivel"),
    is_free: Optional[bool] = Query(None, description="Solo gratuitos"),
    is_certification: Optional[bool] = Query(None, description="Solo certificaciones"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    """Lista cursos de la BD con filtros opcionales."""
    from backend.database import Session, Course

    session = Session()

    try:
        query = session.query(Course)

        if skill:
            query = query.filter(Course.skill.ilike(f"%{skill}%"))
        if platform:
            query = query.filter(Course.platform.ilike(f"%{platform}%"))
        if level:
            query = query.filter(Course.level == level)
        if is_free is not None:
            query = query.filter(Course.is_free == is_free)
        if is_certification is not None:
            query = query.filter(Course.is_certification == is_certification)

        total = query.count()
        courses = query.offset(offset).limit(limit).all()

        return {
            "total": total,
            "courses": [
                {
                    "id": c.id,
                    "name": c.name,
                    "platform": c.platform,
                    "skill": c.skill,
                    "level": c.level,
                    "url": c.url,
                    "duration": c.duration,
                    "rating": c.rating,
                    "is_free": c.is_free,
                    "is_certification": c.is_certification,
                    "source": c.source,
                }
                for c in courses
            ],
        }
    finally:
        session.close()


@router.get("/recommend")
async def recommend_courses(
    skills: str = Query(
        ...,
        description="Skills faltantes separadas por coma (ej: 'python,react,docker')"
    ),
    limit: int = Query(20, ge=1, le=50),
):
    """
    Recomienda cursos basados en una lista de skills faltantes.
    Busca cursos que cubran las skills indicadas.
    """
    from backend.database import Session, Course

    session = Session()
    skill_list = [s.strip().lower() for s in skills.split(",") if s.strip()]

    try:
        recommendations = []
        seen_urls = set()

        for skill in skill_list:
            courses = (session.query(Course)
                       .filter(Course.skill.ilike(f"%{skill}%"))
                       .limit(5)
                       .all())

            for c in courses:
                if c.url in seen_urls:
                    continue
                seen_urls.add(c.url)
                recommendations.append({
                    "course": {
                        "id": c.id,
                        "name": c.name,
                        "platform": c.platform,
                        "skill": c.skill,
                        "level": c.level,
                        "url": c.url,
                        "duration": c.duration,
                        "rating": c.rating,
                        "is_free": c.is_free,
                        "is_certification": c.is_certification,
                    },
                    "matched_skill": skill,
                    "reason": f"Para cubrir: {skill}",
                })

        return {
            "total": len(recommendations),
            "recommendations": recommendations[:limit],
        }
    finally:
        session.close()


@router.get("/platforms")
async def list_platforms():
    """Lista plataformas únicas disponibles en el catálogo."""
    from backend.database import Session, Course

    session = Session()
    try:
        rows = (session.query(Course.platform)
                .distinct()
                .order_by(Course.platform)
                .all())
        return {"platforms": [row[0] for row in rows if row[0]]}
    finally:
        session.close()


@router.get("/stats")
async def course_stats():
    """Estadísticas del catálogo de cursos."""
    from backend.database import Session, Course
    from sqlalchemy import func

    session = Session()
    try:
        total = session.query(Course).count()
        free_count = session.query(Course).filter(Course.is_free == True).count()
        cert_count = session.query(Course).filter(Course.is_certification == True).count()

        platforms = (session.query(Course.platform, func.count(Course.id))
                     .group_by(Course.platform)
                     .all())

        levels = (session.query(Course.level, func.count(Course.id))
                  .group_by(Course.level)
                  .all())

        return {
            "total": total,
            "free": free_count,
            "certifications": cert_count,
            "by_platform": {p: c for p, c in platforms},
            "by_level": {l: c for l, c in levels},
        }
    finally:
        session.close()
