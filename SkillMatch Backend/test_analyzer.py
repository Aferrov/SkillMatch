from app.services.parser import extract_text_from_pdf
from app.services.analyzer import analyze_cv

# Ruta a tu CV
CV_PATH = "cv_cs_harvard_es.pdf"

with open(CV_PATH, "rb") as f:
    texto = extract_text_from_pdf(f)

print("=== TEXTO EXTRAÍDO (primeras 300 letras) ===")
print(texto[:300])
print("\n=== ANÁLISIS ===")

resultado = analyze_cv(texto)

print(f"Carrera detectada:  {resultado['career']}")
print(f"Match:              {resultado['match']}%")
print(f"Skills encontradas: {resultado['found_skills']}")
print(f"Skills faltantes:   {resultado['missing_skills'][:5]}")
print(f"Trabajos sugeridos: {len(resultado['jobs'])}")
for job in resultado['jobs'][:5]:
    print(f"  → {job['title']} — {job['company']}")