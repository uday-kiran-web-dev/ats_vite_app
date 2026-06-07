import re


def normalize_skill(skill):
    return skill.strip().lower()


def extract_skills(text, required_skills=None):
    text = text.lower()
    required_skills = required_skills or []

    found_skills = []
    for skill in required_skills:
        normalized = normalize_skill(skill)
        if not normalized:
            continue

        if re.search(r"(^|\W)" + re.escape(normalized) + r"($|\W)", text):
            found_skills.append(normalized)

    return sorted(set(found_skills))


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