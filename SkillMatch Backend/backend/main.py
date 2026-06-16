from database import init_db, Session, Job, SkillRequired
from scraper import fetch_all_jobs
from parser import extract_skills

def run():
    init_db()
    session = Session()

    print("🚀 Iniciando pipeline SkillMatch...\n")
    jobs = fetch_all_jobs()

    guardados = 0
    omitidos = 0

    for job in jobs:
        # Evitar duplicados
        if not job.get("url"):
            continue
        existe = session.query(Job).filter_by(url=job["url"]).first()
        if existe:
            omitidos += 1
            continue

        print(f"📄 {job['title']} — {job['company']}")

        # Extraer skills con IA
        skills = extract_skills(job.get("description", ""))

        # Guardar trabajo
        nuevo_job = Job(
            source=job["source"],
            title=job["title"],
            company=job["company"],
            location=job["location"],
            description=job["description"],
            url=job["url"],
        )
        session.add(nuevo_job)
        session.flush()

        # Guardar skills
        for skill in skills.get("skills_hard", []):
            session.add(SkillRequired(job_id=nuevo_job.id, skill_name=skill, skill_type="hard"))
        for skill in skills.get("tools", []):
            session.add(SkillRequired(job_id=nuevo_job.id, skill_name=skill, skill_type="tool"))
        for skill in skills.get("skills_soft", []):
            session.add(SkillRequired(job_id=nuevo_job.id, skill_name=skill, skill_type="soft"))

        session.commit()
        guardados += 1
        print(f"   ✓ {len(skills.get('skills_hard', []))} skills guardadas")

    session.close()
    print(f"\n✅ Listo — {guardados} trabajos nuevos guardados, {omitidos} duplicados omitidos")

if __name__ == "__main__":
    run()