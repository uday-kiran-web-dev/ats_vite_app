import asyncio
import httpx
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, Form
import shutil
import os
import uvicorn

from resume_parser import extract_resume_text

from skill_matcher import (
    extract_skills,
    match_skills,
)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

RENDER_APP_URL = "https://ats-resume-analyzer-1njj.onrender.com/ping"

async def keep_alive():
    await asyncio.sleep(10)
    async with httpx.AsyncClient() as client:
        while True:
            try:
                await client.get(RENDER_APP_URL)
            except Exception:
                pass
            await asyncio.sleep(840)

@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(keep_alive())
    yield

app = FastAPI(lifespan=lifespan)

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

# @app.get("/ping")
# def ping():
#     return "Pong!"

# if __name__ == "__main__":
#     uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
