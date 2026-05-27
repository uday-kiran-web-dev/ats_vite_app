import re


COMMON_SKILLS = [
    "react",
    "javascript",
    "node.js",
    "mongodb",
    "python",
    "java",
    "docker",
    "aws",
    "sql",
    "html",
    "css",
    "typescript",
    "express",
    "git",
]


def extract_skills(text):

    text = text.lower()

    found_skills = []

    for skill in COMMON_SKILLS:
        if re.search(r"\b" + re.escape(skill) + r"\b", text):
            found_skills.append(skill)

    return list(set(found_skills))


def match_skills(
    candidate_skills,
    job_requirements
):

    matched = []

    missing = []

    for skill in job_requirements:

        skill = skill.lower()

        if skill in candidate_skills:
            matched.append(skill)
        else:
            missing.append(skill)

    score = 0

    if len(job_requirements) > 0:
        score = int(
            (len(matched) / len(job_requirements))
            * 100
        )

    recommendation = "Poor Match"

    if score >= 80:
        recommendation = "Strong Candidate"

    elif score >= 60:
        recommendation = "Good Candidate"

    elif score >= 40:
        recommendation = "Average Candidate"

    return {
        "matchScore": score,
        "matchedSkills": matched,
        "missingSkills": missing,
        "recommendation": recommendation,
    }