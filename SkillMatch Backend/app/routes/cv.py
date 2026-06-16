from io import BytesIO

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.parser import extract_text_from_pdf
from app.services.analyzer import analyze_cv
from app.utils.text_cleaner import clean_text

router = APIRouter()

@router.post("/analyze")
async def analyze_cv_endpoint(file: UploadFile = File(...)):
    """
    Endpoint principal para analizar CVs en PDF.
    """

    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Solo se permiten archivos PDF.")

    try:
        content = await file.read()
        raw_text = extract_text_from_pdf(BytesIO(content))
        clean = clean_text(raw_text)
        result = analyze_cv(clean, raw_text)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
