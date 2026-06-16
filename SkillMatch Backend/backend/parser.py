from groq import Groq
import json, os
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_skills(description: str) -> dict:
    if not description:
        return {}

    prompt = f"""Analiza esta descripción de trabajo y extrae los requisitos.
Responde SOLO con JSON válido, sin markdown ni texto extra:

{{
  "skills_hard": ["habilidades técnicas"],
  "skills_soft": ["habilidades blandas"],
  "tools": ["herramientas"],
  "experience_years": null,
  "languages": ["idiomas"]
}}

Descripción:
{description[:2000]}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=500,
    )

    try:
        text = response.choices[0].message.content
        text = text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        result = json.loads(text)
        # Garantizar que siempre devuelve un dict con listas
        return {
            "skills_hard": result.get("skills_hard") or [],
            "skills_soft": result.get("skills_soft") or [],
            "tools":       result.get("tools") or [],
            "languages":   result.get("languages") or [],
            "experience_years": result.get("experience_years"),
        }
    except Exception as e:
        print(f"   ⚠ Error al parsear skills: {e}")
        return {
            "skills_hard": [],
            "skills_soft": [],
            "tools":       [],
            "languages":   [],
            "experience_years": None,
        }