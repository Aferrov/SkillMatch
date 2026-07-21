"""Paquete de agentes de scraping de SkillMatch."""

from app.agents.base import BaseAgent, AgentReport
from app.agents.job_agent import JobAgent
from app.agents.course_agent import CourseAgent
from app.agents.orchestrator import AgentOrchestrator

__all__ = [
    "BaseAgent",
    "AgentReport",
    "JobAgent",
    "CourseAgent",
    "AgentOrchestrator",
]
