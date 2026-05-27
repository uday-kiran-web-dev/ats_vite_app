const connectDB = require("../config/db");
const Application = require("../models/Application");

(async () => {
  try {
    await connectDB();

    const applications = await Application.find({
      matchScore: { $exists: false },
    });

    for (const app of applications) {
      const skillsMatch =
        app.matchReport?.skillsMatch || app.matchReport?.matchedSkills || [];
      const missing = app.matchReport?.missingSkills || [];

      const total = skillsMatch.length + missing.length;

      if (total === 0) {
        console.log(`Skipping ${app._id} — no skill data`);
        continue;
      }

      const score = Math.round((skillsMatch.length / total) * 100);

      let overallFit = "Poor Fit";

      if (score >= 80) overallFit = "Excellent Fit";
      else if (score >= 60) overallFit = "Good Fit";
      else if (score >= 40) overallFit = "Average Fit";

      app.matchScore = score;
      app.matchReport = Object.assign({}, app.matchReport, {
        missingSkills: missing,
        overallFit,
      });

      await app.save();

      console.log(`Updated application ${app._id} — score ${score}`);
    }

    console.log("Done backfilling applications.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
