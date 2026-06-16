from pydantic import BaseModel
from typing import List

class CVResponse(BaseModel):
    career: str
    match: float
    missing_skills: List[str]
    jobs: List[str]