"""
Endpoints API para gestionar agentes de scraping.

POST /api/agents/run           — Ejecutar agentes (todos o uno específico)
GET  /api/agents/status        — Estado actual de cada agente
GET  /api/agents/history       — Historial de ejecuciones
POST /api/agents/scheduler     — Activar/desactivar scheduler diario
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class RunRequest(BaseModel):
    agent: Optional[str] = None  # Si es None, ejecuta todos


class SchedulerRequest(BaseModel):
    action: str = "start"  # "start" | "stop"
    hour: int = 3
    minute: int = 0


@router.post("/run")
async def run_agents(body: RunRequest, background_tasks: BackgroundTasks):
    """
    Ejecuta agentes de scraping.
    Si body.agent es None, ejecuta todos. Si es un nombre, ejecuta solo ese.
    La ejecución se hace en background para no bloquear la API.
    """
    from app.agents.orchestrator import get_orchestrator
    orchestrator = get_orchestrator()

    if orchestrator.is_running:
        raise HTTPException(
            status_code=409,
            detail="Ya hay una ejecución en progreso. Espera a que termine."
        )

    if body.agent:
        if body.agent not in orchestrator.agent_names:
            raise HTTPException(
                status_code=404,
                detail=f"Agente '{body.agent}' no encontrado. "
                       f"Disponibles: {orchestrator.agent_names}"
            )
        background_tasks.add_task(orchestrator.run_agent, body.agent)
        return {
            "message": f"Agente '{body.agent}' iniciado en background",
            "agent": body.agent,
        }
    else:
        background_tasks.add_task(orchestrator.run_all)
        return {
            "message": f"Todos los agentes iniciados en background "
                       f"({len(orchestrator.agent_names)} agentes)",
            "agents": orchestrator.agent_names,
        }


@router.get("/status")
async def get_status():
    """Estado actual de todos los agentes registrados."""
    from app.agents.orchestrator import get_orchestrator
    orchestrator = get_orchestrator()
    return orchestrator.get_status()


@router.get("/history")
async def get_history(limit: int = 20):
    """Historial de las últimas ejecuciones."""
    from app.agents.orchestrator import get_orchestrator
    orchestrator = get_orchestrator()
    return {"runs": orchestrator.get_history(limit=limit)}


@router.post("/scheduler")
async def manage_scheduler(body: SchedulerRequest):
    """Activar o desactivar el scheduler diario."""
    from app.agents.orchestrator import get_orchestrator
    orchestrator = get_orchestrator()

    if body.action == "start":
        orchestrator.start_daily_scheduler(hour=body.hour, minute=body.minute)
        return {
            "message": f"Scheduler diario activado: {body.hour:02d}:{body.minute:02d}",
            "hour": body.hour,
            "minute": body.minute,
        }
    elif body.action == "stop":
        orchestrator.stop_scheduler()
        return {"message": "Scheduler detenido"}
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Acción '{body.action}' no válida. Usa 'start' o 'stop'."
        )
