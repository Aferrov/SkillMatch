"""
AgentOrchestrator — Coordinador central de agentes de scraping.

Responsabilidades:
  - Registrar y gestionar agentes
  - Ejecutar agentes bajo demanda o programados
  - Guardar historial de ejecuciones en la BD
  - Programar ejecución diaria automática con APScheduler
"""

import threading
from datetime import datetime
from typing import Optional

from app.agents.base import BaseAgent, AgentReport


class AgentOrchestrator:
    """Orquestador de agentes de scraping."""

    def __init__(self):
        self._agents: dict[str, BaseAgent] = {}
        self._last_reports: dict[str, AgentReport] = {}
        self._history: list[AgentReport] = []
        self._is_running = False
        self._scheduler = None
        self._scheduler_thread = None

    def register(self, agent: BaseAgent):
        """Registra un agente en el orquestador."""
        self._agents[agent.name] = agent
        print(f"   📋 Agente registrado: {agent.name}")

    def get_agent(self, name: str) -> Optional[BaseAgent]:
        return self._agents.get(name)

    @property
    def agent_names(self) -> list[str]:
        return list(self._agents.keys())

    @property
    def is_running(self) -> bool:
        return self._is_running

    # ── Ejecución ────────────────────────────────────────────────────────

    def run_all(self) -> list[AgentReport]:
        """Ejecuta todos los agentes registrados secuencialmente."""
        if self._is_running:
            print("⚠ Ya hay una ejecución en progreso, omitiendo...")
            return []

        self._is_running = True
        reports = []

        print("\n" + "=" * 60)
        print(f"🚀 Orquestador: Ejecutando {len(self._agents)} agentes")
        print(f"   Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 60)

        try:
            for name, agent in self._agents.items():
                report = agent.run()
                reports.append(report)
                self._last_reports[name] = report
                self._history.append(report)
                self._save_report_to_db(report)

        finally:
            self._is_running = False

        # Resumen
        total_found = sum(r.items_found for r in reports)
        total_saved = sum(r.items_saved for r in reports)
        failed = sum(1 for r in reports if r.status == "failed")

        print("\n" + "=" * 60)
        print(f"📊 Resumen: {total_found} encontrados, {total_saved} guardados, "
              f"{failed} errores")
        print("=" * 60 + "\n")

        return reports

    def run_agent(self, agent_name: str) -> AgentReport:
        """Ejecuta un agente específico por nombre."""
        agent = self._agents.get(agent_name)
        if not agent:
            report = AgentReport(agent_name=agent_name, status="failed")
            report.error_detail = f"Agente '{agent_name}' no encontrado"
            report.finish("failed")
            return report

        report = agent.run()
        self._last_reports[agent_name] = report
        self._history.append(report)
        self._save_report_to_db(report)
        return report

    # ── Estado y Historial ───────────────────────────────────────────────

    def get_status(self) -> dict:
        """Estado actual de todos los agentes."""
        status = {
            "is_running": self._is_running,
            "registered_agents": self.agent_names,
            "scheduler_active": self._scheduler is not None and self._scheduler.running,
            "agents": {},
        }

        for name in self._agents:
            last = self._last_reports.get(name)
            if last:
                status["agents"][name] = last.to_dict()
            else:
                status["agents"][name] = {"status": "never_run"}

        return status

    def get_history(self, limit: int = 20) -> list[dict]:
        """Historial de ejecuciones recientes."""
        return [r.to_dict() for r in self._history[-limit:]]

    # ── Scheduler Diario ─────────────────────────────────────────────────

    def start_daily_scheduler(self, hour: int = 3, minute: int = 0):
        """
        Inicia el scheduler para ejecutar todos los agentes diariamente.
        Por defecto a las 3:00 AM.
        """
        try:
            from apscheduler.schedulers.background import BackgroundScheduler
            from apscheduler.triggers.cron import CronTrigger

            if self._scheduler and self._scheduler.running:
                print("⚠ El scheduler ya está corriendo")
                return

            self._scheduler = BackgroundScheduler()
            self._scheduler.add_job(
                func=self.run_all,
                trigger=CronTrigger(hour=hour, minute=minute),
                id="daily_scraping",
                name=f"Scraping diario ({hour:02d}:{minute:02d})",
                replace_existing=True,
            )
            self._scheduler.start()

            print(f"\n⏰ Scheduler diario activado: "
                  f"todos los días a las {hour:02d}:{minute:02d}")

        except ImportError:
            print("⚠ APScheduler no instalado. Instala con: pip install apscheduler")
            print("  El scraping diario no estará disponible, pero puedes ejecutar "
                  "manualmente con POST /api/agents/run")

    def stop_scheduler(self):
        """Detiene el scheduler diario."""
        if self._scheduler and self._scheduler.running:
            self._scheduler.shutdown(wait=False)
            print("⏹ Scheduler detenido")

    # ── Persistencia ─────────────────────────────────────────────────────

    @staticmethod
    def _save_report_to_db(report: AgentReport):
        """Guarda el reporte de ejecución en la tabla agent_runs."""
        try:
            from backend.database import Session, AgentRun

            session = Session()
            run = AgentRun(
                agent_name=report.agent_name,
                status=report.status,
                items_found=report.items_found,
                items_saved=report.items_saved,
                errors=report.errors,
                error_detail=report.error_detail or None,
                started_at=report.started_at,
                finished_at=report.finished_at,
            )
            session.add(run)
            session.commit()
            session.close()
        except Exception as e:
            print(f"   ⚠ No se pudo guardar reporte en BD: {e}")


# ── Singleton del orquestador ────────────────────────────────────────────

_orchestrator: Optional[AgentOrchestrator] = None


def get_orchestrator() -> AgentOrchestrator:
    """
    Retorna la instancia singleton del orquestador.
    Crea y configura los agentes en la primera llamada.
    """
    global _orchestrator

    if _orchestrator is None:
        _orchestrator = AgentOrchestrator()

        # Registrar agentes
        from app.agents.job_agent import JobAgent
        from app.agents.course_agent import CourseAgent

        _orchestrator.register(JobAgent())
        _orchestrator.register(CourseAgent())

        print("✓ Orquestador inicializado con agentes: "
              f"{', '.join(_orchestrator.agent_names)}")

    return _orchestrator
