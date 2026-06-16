import re

def clean_text(text: str) -> str:
    """
    Limpia caracteres especiales y normaliza texto.
    """
    text = re.sub(r'[^a-zA-Z0-9áéíóúñ\s]', '', text)
    return text.lower()