"""
Servicio de autenticación: hashing de contraseñas y tokens de sesión.

Implementado únicamente con la librería estándar de Python (hashlib, hmac,
secrets, base64) para no añadir dependencias nuevas al proyecto:

  - Contraseñas: PBKDF2-HMAC-SHA256 con salt aleatorio por usuario.
  - Tokens:      JWT compacto firmado con HS256 (mismo formato que cualquier
                 librería JWT, así que se puede migrar a python-jose sin
                 cambiar el frontend).
"""

import base64
import hashlib
import hmac
import json
import os
import secrets
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).parent.parent.parent / ".env")

# ─── Configuración ──────────────────────────────────────────────────

PBKDF2_ITERATIONS = 260_000
TOKEN_ALGORITHM = "HS256"

# Duración del token según si el usuario marcó "Recordarme"
SESSION_HOURS = 12
REMEMBER_ME_DAYS = 30

_SECRET_FILE = Path(__file__).parent.parent.parent / ".auth_secret"


def _load_secret_key() -> str:
    """
    Clave para firmar los tokens. Prioriza la variable de entorno
    AUTH_SECRET_KEY; si no existe, genera una y la persiste en disco para
    que los tokens sobrevivan a un reinicio del servidor en desarrollo.
    """
    env_secret = os.getenv("AUTH_SECRET_KEY")
    if env_secret:
        return env_secret

    if _SECRET_FILE.exists():
        return _SECRET_FILE.read_text().strip()

    generated = secrets.token_hex(32)
    try:
        _SECRET_FILE.write_text(generated)
        _SECRET_FILE.chmod(0o600)
    except OSError:
        # Si el disco es de solo lectura seguimos funcionando en memoria;
        # los tokens se invalidarán al reiniciar.
        print("⚠️  No se pudo persistir .auth_secret; los tokens no sobrevivirán a un reinicio")
    return generated


SECRET_KEY = _load_secret_key()


# ─── Contraseñas ────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    """Devuelve 'pbkdf2_sha256$iteraciones$salt_b64$hash_b64'."""
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt, PBKDF2_ITERATIONS
    )
    return "$".join(
        [
            "pbkdf2_sha256",
            str(PBKDF2_ITERATIONS),
            base64.b64encode(salt).decode(),
            base64.b64encode(digest).decode(),
        ]
    )


def verify_password(password: str, stored: str) -> bool:
    """Comparación en tiempo constante contra el hash almacenado."""
    try:
        algorithm, iterations, salt_b64, hash_b64 = stored.split("$")
        if algorithm != "pbkdf2_sha256":
            return False
        digest = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            base64.b64decode(salt_b64),
            int(iterations),
        )
        return hmac.compare_digest(digest, base64.b64decode(hash_b64))
    except (ValueError, TypeError):
        return False


# ─── Tokens JWT (HS256) ─────────────────────────────────────────────

def _b64url_encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("ascii")


def _b64url_decode(segment: str) -> bytes:
    padding = "=" * (-len(segment) % 4)
    return base64.urlsafe_b64decode(segment + padding)


def _sign(message: bytes) -> bytes:
    return hmac.new(SECRET_KEY.encode("utf-8"), message, hashlib.sha256).digest()


def create_access_token(user_id: int, email: str, remember: bool = False) -> tuple[str, int]:
    """
    Crea un JWT firmado. Devuelve (token, segundos_de_vida) para que el
    frontend sepa cuándo caduca sin tener que decodificarlo.
    """
    lifetime = (
        timedelta(days=REMEMBER_ME_DAYS) if remember else timedelta(hours=SESSION_HOURS)
    )
    now = datetime.now(timezone.utc)
    expires_at = now + lifetime

    header = {"alg": TOKEN_ALGORITHM, "typ": "JWT"}
    payload = {
        "sub": str(user_id),
        "email": email,
        "iat": int(now.timestamp()),
        "exp": int(expires_at.timestamp()),
    }

    signing_input = ".".join(
        [
            _b64url_encode(json.dumps(header, separators=(",", ":")).encode()),
            _b64url_encode(json.dumps(payload, separators=(",", ":")).encode()),
        ]
    )
    token = f"{signing_input}.{_b64url_encode(_sign(signing_input.encode()))}"
    return token, int(lifetime.total_seconds())


def decode_access_token(token: str) -> Optional[dict]:
    """Valida firma y expiración. Devuelve el payload o None si es inválido."""
    try:
        header_b64, payload_b64, signature_b64 = token.split(".")
    except ValueError:
        return None

    expected = _sign(f"{header_b64}.{payload_b64}".encode())
    try:
        if not hmac.compare_digest(expected, _b64url_decode(signature_b64)):
            return None
        payload = json.loads(_b64url_decode(payload_b64))
    except (ValueError, TypeError, json.JSONDecodeError):
        return None

    if payload.get("exp", 0) < datetime.now(timezone.utc).timestamp():
        return None

    return payload
