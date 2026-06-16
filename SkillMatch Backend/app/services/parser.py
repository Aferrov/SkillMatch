import re
import pdfplumber
from typing import Dict, List, Tuple

EXPERIENCE_HEADERS = [
    "experiencia laboral",
    "experiencia profesional",
    "historial profesional",
    "experiencia",
    "empleo",
    "trabajo",
]

EDUCATION_HEADERS = [
    "educación",
    "educacion",
    "formación académica",
    "formacion academica",
    "formación",
    "formacion",
    "estudios",
    "certificaciones",
    "certificación",
    "certificacion",
]

# CORRECCIÓN 1: Un solo escape para los caracteres de control de Regex
DATE_PATTERN = re.compile(
    r"\b\d{4}(?:\s*[–—-]\s*(?:\d{4}|presente|actual))?\b",
    re.IGNORECASE,
)

def extract_text_from_pdf(file) -> str:
    try:
        with pdfplumber.open(file) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() or ""
        if not text.strip():
            raise ValueError("El PDF no contiene texto legible.")
        return text
    except Exception as e:
        raise Exception(f"Error procesando el PDF: {str(e)}")

# CORRECCIÓN 2: Segmentación limpia basada en encontrar el siguiente encabezado real
def _extract_section(text: str, current_headers: List[str]) -> str:
    normalized = text.lower()
    start_pos = -1
    
    for header in current_headers:
        pattern = rf"(?:^|\n)\s*{re.escape(header)}\s*(?:\n|$)"
        match = re.search(pattern, normalized)
        if match:
            start_pos = match.end()
            break
            
    if start_pos == -1:
        return ""

    # Encontrar dónde empieza CUALQUIER otra sección para delimitar el final
    all_headers = EXPERIENCE_HEADERS + EDUCATION_HEADERS
    end_pos = len(text)
    
    for header in all_headers:
        if header in current_headers:
            continue
        pattern = rf"(?:^|\n)\s*{re.escape(header)}\s*(?:\n|$)"
        match = re.search(pattern, normalized[start_pos:])
        if match:
            candidate = start_pos + match.start()
            if candidate < end_pos:
                end_pos = candidate
                
    return text[start_pos:end_pos].strip()

# CORRECCIÓN 3: Agrupación inteligente por bloques (Detecta viñetas de texto)
def _parse_cv_blocks(section_text: str) -> List[List[str]]:
    lines = [line.strip() for line in section_text.splitlines() if line.strip()]
    blocks = []
    current_block = []
    
    for line in lines:
        # Si la línea contiene un año y no empieza con viñeta (• o -), es el inicio de un nuevo bloque
        if DATE_PATTERN.search(line) and not line.startswith(('•', '-', '*')):
            if current_block:
                blocks.append(current_block)
            current_block = [line]
        else:
            if current_block:
                current_block.append(line)
            else:
                current_block = [line]
                
    if current_block:
        blocks.append(current_block)
    return blocks

def _extract_experience_items(section_text: str) -> List[Dict[str, str]]:
    blocks = _parse_cv_blocks(section_text)
    items = []
    
    for index, block in enumerate(blocks, start=1):
        if not block:
            continue
        
        header_line = block[0]
        period = ""
        date_match = DATE_PATTERN.search(header_line)
        if date_match:
            period = date_match.group(0)
            header_line = header_line.replace(period, "").strip()
            
        # Intentar separar Cargo y Empresa por caracteres comunes (,|•|-)
        parts = re.split(r"[,•|–—-]", header_line, 1)
        role = parts[0].strip()
        company = parts[1].strip() if len(parts) > 1 else ""
        
        description = " ".join(block[1:]).strip()
        
        items.append({
            "id": f"exp{index}",
            "role": role,
            "company": company,
            "period": period,
            "description": description
        })
    return items

def _extract_education_items(section_text: str) -> List[Dict[str, str]]:
    blocks = _parse_cv_blocks(section_text)
    items = []
    
    certificate_keywords = re.compile(
        r"certificaci[oó]n|certificado|diplomado|curso|especializaci[oó]n|maestr[ií]a",
        re.IGNORECASE,
    )
    
    for index, block in enumerate(blocks, start=1):
        if not block:
            continue
            
        header_line = block[0]
        period = ""
        date_match = DATE_PATTERN.search(header_line)
        if date_match:
            period = date_match.group(0)
            header_line = header_line.replace(period, "").strip()
            
        parts = re.split(r"[,•|–—-]", header_line, 1)
        title = parts[0].strip()
        institution = parts[1].strip() if len(parts) > 1 else ""
        
        kind = "certificate" if certificate_keywords.search(" ".join(block)) else "studies"
        
        items.append({
            "id": f"edu{index}",
            "title": title,
            "institution": institution,
            "period": period,
            "kind": kind
        })
    return items

def extract_name_from_cv(text: str) -> str:
    """
    Extrae el nombre de la persona del CV.
    Asume que el nombre está en las primeras líneas no vacías del documento.
    """
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    if not lines:
        return "Candidato"
    
    # El nombre usualmente es la primera línea no vacía que no sea un header
    # Excluimos líneas que son muy largas (resumen) o contienen caracteres especiales
    for line in lines[:5]:  # Revisar las primeras 5 líneas
        # Ignorar líneas que parecen ser headers o descripciones
        if len(line) > 80 or line.lower().startswith(('email:', 'teléfono', 'tel:', 'linkedin:', 'https://', '+')):
            continue
        
        # Ignorar palabras clave de secciones
        if any(header in line.lower() for header in EXPERIENCE_HEADERS + EDUCATION_HEADERS):
            continue
        
        # Si es una línea corta, probablemente es el nombre
        if len(line) <= 60:
            return line
    
    return "Candidato"

def extract_experience_and_education(text: str):
    experience_section = _extract_section(text, EXPERIENCE_HEADERS)
    education_section = _extract_section(text, EDUCATION_HEADERS)

    experience = _extract_experience_items(experience_section) if experience_section else []
    education = _extract_education_items(education_section) if education_section else []

    return experience, education