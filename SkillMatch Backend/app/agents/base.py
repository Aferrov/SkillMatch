"""
BaseAgent — Clase abstracta para todos los agentes de scraping.

Cada agente sigue un pipeline de 3 pasos:
  1. scrape()  → Obtener datos crudos de fuentes externas
  2. parse()   → Transformar/enriquecer con IA
  3. store()   → Guardar en BD con deduplicación

El método run() orquesta el pipeline completo y registra métricas.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


@dataclass
class AgentReport:
    """Resultado de la ejecución de un agente."""
    agent_name: str
    status: str = "pending"           # "running", "completed", "failed"
    items_found: int = 0
    items_saved: int = 0
    items_skipped: int = 0
    errors: int = 0
    error_detail: str = ""
    started_at: datetime = field(default_factory=datetime.now)
    finished_at: datetime | None = None
    duration_seconds: float = 0.0

    def finish(self, status: str = "completed"):
        self.status = status
        self.finished_at = datetime.now()
        self.duration_seconds = (self.finished_at - self.started_at).total_seconds()
        self.items_skipped = self.items_found - self.items_saved

    def to_dict(self) -> dict:
        return {
            "agent_name": self.agent_name,
            "status": self.status,
            "items_found": self.items_found,
            "items_saved": self.items_saved,
            "items_skipped": self.items_skipped,
            "errors": self.errors,
            "error_detail": self.error_detail,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "finished_at": self.finished_at.isoformat() if self.finished_at else None,
            "duration_seconds": round(self.duration_seconds, 2),
        }


class BaseAgent(ABC):
    """Clase base abstracta para agentes de scraping."""

    name: str = "base_agent"

    @abstractmethod
    def scrape(self) -> list[dict]:
        """
        Obtiene datos crudos de la fuente externa.
        Retorna una lista de diccionarios con los datos sin procesar.
        """
        ...

    @abstractmethod
    def parse(self, raw_items: list[dict]) -> list[dict]:
        """
        Transforma y/o enriquece los datos crudos.
        Puede usar IA (Groq/LLaMA) para extraer skills, normalizar, etc.
        """
        ...

    @abstractmethod
    def store(self, parsed_items: list[dict]) -> int:
        """
        Guarda los items procesados en la BD con deduplicación.
        Retorna el número de items nuevos guardados.
        """
        ...

    def run(self) -> AgentReport:
        """
        Pipeline completo: scrape → parse → store.
        Registra métricas y maneja errores.
        """
        report = AgentReport(agent_name=self.name, status="running")
        print(f"\n{'='*50}")
        print(f"🤖 Agente [{self.name}] iniciando...")
        print(f"{'='*50}")

        try:
            # Paso 1: Scrape
            print(f"\n📡 Paso 1/3: Scrapeando datos...")
            raw_items = self.scrape()
            report.items_found = len(raw_items)
            print(f"   → {len(raw_items)} items encontrados")

            if not raw_items:
                print("   ⚠ No se encontraron items, finalizando")
                report.finish("completed")
                return report

            # Paso 2: Parse
            print(f"\n🔬 Paso 2/3: Procesando datos...")
            parsed_items = self.parse(raw_items)
            print(f"   → {len(parsed_items)} items procesados")

            # Paso 3: Store
            print(f"\n💾 Paso 3/3: Guardando en BD...")
            saved = self.store(parsed_items)
            report.items_saved = saved
            print(f"   → {saved} items nuevos guardados")
            print(f"   → {report.items_found - saved} duplicados omitidos")

            report.finish("completed")

        except Exception as e:
            report.errors += 1
            report.error_detail = str(e)
            report.finish("failed")
            print(f"\n❌ Error en agente [{self.name}]: {e}")

        print(f"\n✅ Agente [{self.name}] finalizado en {report.duration_seconds:.1f}s")
        return report
