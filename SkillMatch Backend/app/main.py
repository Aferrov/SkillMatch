import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Asegurar que backend/ esté en el path para imports de database
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.routes import cv
from app.routes import linkedin
from app.routes import agents as agents_routes
from app.routes import courses as courses_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Al iniciar la app:
      1. Inicializar BD (crear tablas si no existen)
      2. Inicializar orquestador de agentes
      3. Activar scheduler diario (3:00 AM)
    """
    # Startup
    from backend.database import init_db
    init_db()

    from app.agents.orchestrator import get_orchestrator
    orchestrator = get_orchestrator()
    orchestrator.start_daily_scheduler(hour=3, minute=0)

    print("\n🚀 SkillMatch API lista con agentes de scraping")
    print("   📡 Endpoints de agentes: /api/agents/*")
    print("   📚 Endpoints de cursos:  /api/courses/*")
    print("   ⏰ Scraping diario:      03:00 AM\n")

    yield

    # Shutdown
    orchestrator.stop_scheduler()


app = FastAPI(title="SkillMatch API", lifespan=lifespan)

# CORS para frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas
app.include_router(cv.router, prefix="/api/cv", tags=["CV Analysis"])
app.include_router(linkedin.router, prefix="/api/linkedin", tags=["LinkedIn Analysis"])
app.include_router(agents_routes.router, prefix="/api/agents", tags=["Agents"])
app.include_router(courses_routes.router, prefix="/api/courses", tags=["Courses"])


@app.get("/")
def root():
    return {"message": "SkillMatch API funcionando 🚀", "version": "2.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)