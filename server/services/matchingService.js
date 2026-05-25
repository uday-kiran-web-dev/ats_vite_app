const calculateMatch = (jobRequirements, candidateSkills) => {
  const matchedSkills = jobRequirements.filter((skill) =>
    candidateSkills.includes(skill),
  );

  const missingSkills = jobRequirements.filter(
    (skill) => !candidateSkills.includes(skill),
  );

  const matchScore = Math.round(
    (matchedSkills.length / jobRequirements.length) * 100,
  );

  let overallFit = "Poor Fit";

  if (matchScore >= 80) {
    overallFit = "Excellent Fit";
  } else if (matchScore >= 60) {
    overallFit = "Good Fit";
  } else if (matchScore >= 40) {
    overallFit = "Avarage Fit";
  }

  return {
    matchScore,
    skillsMatch: matchedSkills,
    missingSkills,
    overallFit,
  };
};

module.exports = calculateMatch;
