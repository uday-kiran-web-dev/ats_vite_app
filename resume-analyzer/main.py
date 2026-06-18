from fastapi import FastAPI, UploadFile, File, Form
import shutil
import os

from resume_parser import extract_resume_text

from skill_matcher import (
    extract_skills,
    match_skills,
)

app = FastAPI()


UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    requirements: str = Form(...)
):

    # Save file
    file_path = f"{UPLOAD_FOLDER}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text
    resume_text = extract_resume_text(file_path)

    # Parse requirements
    job_requirements = [
        skill.strip().lower()
        for skill in requirements.split(",")
        if skill.strip()
    ]

    # Extract skills only from the provided requirements
    candidate_skills = extract_skills(
        resume_text,
        required_skills=job_requirements,
    )

    # Match
    result = match_skills(
        candidate_skills,
        job_requirements,
    )

    result["candidateSkills"] = candidate_skills

    return result