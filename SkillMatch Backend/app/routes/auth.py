"""
Endpoints de autenticación y persistencia de sesión.

POST   /api/auth/register   — Crea una cuenta y devuelve un token
POST   /api/auth/login      — Inicia sesión y devuelve un token
GET    /api/auth/me         — Datos del usuario del token actual
POST   /api/auth/logout     — Cierra sesión (el token es stateless)
GET    /api/auth/session    — Recupera el último análisis/perfil guardado
PUT    /api/auth/session    — Guarda el estado de la sesión del usuario
"""

import json
import re
from datetime import datetime
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field, field_validator

from app.services.auth import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)

router = APIRouter()
bearer_scheme = HTTPBearer(auto_error=False)


# ─── Schemas ────────────────────────────────────────────────────────

# Validación de email sin depender de `email-validator` (EmailStr)
EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]{2,}$")


def _validate_email(value: str) -> str:
    normalized = value.lower().strip()
    if not EMAIL_REGEX.match(normalized):
        raise ValueError("El correo electrónico no es válido")
    return normalized


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: str
    password: str = Field(min_length=8, max_length=128)
    plan: str = "Free"

    _normalize_email = field_validator("email")(_validate_email)


class LoginRequest(BaseModel):
    email: str
    password: str
    remember: bool = False

    _normalize_email = field_validator("email")(_validate_email)


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    plan: str


class AuthResponse(BaseModel):
    token: str
    expires_in: int
    user: UserResponse


class SessionStateRequest(BaseModel):
    analysis: Optional[Any] = None
    profile: Optional[Any] = None
    prefs: Optional[Any] = None
    # Metadatos del análisis, para el historial del panel
    score: Optional[int] = None
    source: Optional[str] = None


# ─── Dependencia de usuario autenticado ─────────────────────────────

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
):
    """Resuelve el usuario a partir del token Bearer, o lanza 401."""
    from backend.database import Session, User

    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No autenticado",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sesión expirada o token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )

    session = Session()
    try:
        user = session.query(User).filter(User.id == int(payload["sub"])).first()
        if user is None:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")
        # Se devuelve un dict para no arrastrar una entidad ligada a la sesión cerrada
        return {"id": user.id, "name": user.name, "email": user.email, "plan": user.plan}
    finally:
        session.close()


# ─── Endpoints ──────────────────────────────────────────────────────

@router.post("/register", response_model=AuthResponse, status_code=201)
async def register(body: RegisterRequest):
    """Crea una cuenta nueva. El email debe ser único."""
    from backend.database import Session, User

    session = Session()
    try:
        email = body.email.lower().strip()

        if session.query(User).filter(User.email == email).first():
            raise HTTPException(
                status_code=409,
                detail="Ya existe una cuenta con este correo electrónico",
            )

        user = User(
            name=body.name.strip(),
            email=email,
            password_hash=hash_password(body.password),
            plan=body.plan if body.plan in ("Free", "Premium") else "Free",
            last_login_at=datetime.now(),
        )
        session.add(user)
        session.commit()
        session.refresh(user)

        token, expires_in = create_access_token(user.id, user.email, remember=True)
        return {
            "token": token,
            "expires_in": expires_in,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "plan": user.plan,
            },
        }
    finally:
        session.close()


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest):
    """Valida credenciales y devuelve un token de sesión."""
    from backend.database import Session, User

    session = Session()
    try:
        user = (
            session.query(User)
            .filter(User.email == body.email.lower().strip())
            .first()
        )

        # Mismo mensaje para email inexistente y contraseña incorrecta:
        # así no se filtra qué correos están registrados.
        if user is None or not verify_password(body.password, user.password_hash):
            raise HTTPException(
                status_code=401, detail="Correo o contraseña incorrectos"
            )

        user.last_login_at = datetime.now()
        session.commit()

        token, expires_in = create_access_token(
            user.id, user.email, remember=body.remember
        )
        return {
            "token": token,
            "expires_in": expires_in,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "plan": user.plan,
            },
        }
    finally:
        session.close()


@router.get("/me", response_model=UserResponse)
async def me(current_user: dict = Depends(get_current_user)):
    """Verifica el token guardado por el frontend al recargar la página."""
    return current_user


@router.post("/logout", status_code=204)
async def logout():
    """
    El token es stateless, así que cerrar sesión consiste en que el cliente
    lo descarte. El endpoint existe para que el frontend tenga un punto
    único donde registrar el cierre de sesión.
    """
    return None


@router.get("/session")
async def get_session_state(current_user: dict = Depends(get_current_user)):
    """Devuelve el último análisis, perfil y preferencias guardados."""
    from backend.database import Session, UserProfile

    session = Session()
    try:
        record = (
            session.query(UserProfile)
            .filter(UserProfile.user_id == current_user["id"])
            .first()
        )
        if record is None:
            return {"analysis": None, "profile": None, "prefs": None, "updated_at": None}

        return {
            "analysis": json.loads(record.analysis_json) if record.analysis_json else None,
            "profile": json.loads(record.profile_json) if record.profile_json else None,
            "prefs": json.loads(record.prefs_json) if record.prefs_json else None,
            "updated_at": record.updated_at.isoformat() if record.updated_at else None,
        }
    finally:
        session.close()


@router.put("/session")
async def save_session_state(
    body: SessionStateRequest, current_user: dict = Depends(get_current_user)
):
    """
    Guarda el estado de la sesión. Los campos omitidos (None) conservan su
    valor anterior, para poder actualizar solo el perfil sin perder el análisis.
    """
    from backend.database import AnalysisRun, Session, UserProfile

    session = Session()
    try:
        record = (
            session.query(UserProfile)
            .filter(UserProfile.user_id == current_user["id"])
            .first()
        )
        if record is None:
            record = UserProfile(user_id=current_user["id"])
            session.add(record)

        if body.analysis is not None:
            record.analysis_json = json.dumps(body.analysis, ensure_ascii=False)
            # Cada análisis guardado deja rastro en el historial del panel
            analysis = body.analysis if isinstance(body.analysis, dict) else {}
            session.add(
                AnalysisRun(
                    user_id=current_user["id"],
                    career=analysis.get("career"),
                    score=body.score,
                    skills_found=len(analysis.get("found_skills") or []),
                    skills_missing=len(analysis.get("missing_skills") or []),
                    source=body.source or "cv",
                )
            )
        if body.profile is not None:
            record.profile_json = json.dumps(body.profile, ensure_ascii=False)
        if body.prefs is not None:
            record.prefs_json = json.dumps(body.prefs, ensure_ascii=False)

        record.updated_at = datetime.now()
        session.commit()
        return {"saved": True, "updated_at": record.updated_at.isoformat()}
    finally:
        session.close()


@router.get("/stats")
async def get_stats(current_user: dict = Depends(get_current_user)):
    """
    Datos reales del usuario para el panel: cuántos análisis lleva, cuándo
    fue el último y cómo ha evolucionado su puntuación.
    """
    from backend.database import AnalysisRun, Session, User

    session = Session()
    try:
        user = session.query(User).filter(User.id == current_user["id"]).first()

        runs = (
            session.query(AnalysisRun)
            .filter(AnalysisRun.user_id == current_user["id"])
            .order_by(AnalysisRun.created_at.desc())
            .limit(10)
            .all()
        )
        total = (
            session.query(AnalysisRun)
            .filter(AnalysisRun.user_id == current_user["id"])
            .count()
        )

        history = [
            {
                "id": r.id,
                "career": r.career,
                "score": r.score,
                "skills_found": r.skills_found,
                "skills_missing": r.skills_missing,
                "source": r.source,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in runs
        ]

        # Variación de puntuación respecto al análisis anterior
        scored = [r["score"] for r in history if r["score"] is not None]
        score_delta = (
            scored[0] - scored[1] if len(scored) >= 2 else None
        )

        return {
            "analysis_count": total,
            "last_analysis_at": history[0]["created_at"] if history else None,
            "current_score": scored[0] if scored else None,
            "score_delta": score_delta,
            "member_since": user.created_at.isoformat() if user and user.created_at else None,
            "last_login_at": user.last_login_at.isoformat() if user and user.last_login_at else None,
            "plan": user.plan if user else "Free",
            "history": history,
        }
    finally:
        session.close()
