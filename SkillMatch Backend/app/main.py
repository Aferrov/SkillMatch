from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import cv

app = FastAPI(title="SkillMatch API")

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


@app.get("/")
def root():
    return {"message": "SkillMatch API funcionando 🚀"}