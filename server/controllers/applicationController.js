const Application = require("../models/Application");
const Job = require("../models/Job");
const calculateMatch = require("../services/matchingService");

//Applying for a job
const applyJob = async (req, res) => {
  try {
    const { jobId, resume, coverLetter, skills } = req.body;

    if (!jobId) {
      return res.status(400).json({
        message: "jobId is required",
      });
    }

    // Checking if job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    //Check if candidate is already applied for this Job
    const existingApplication = await Application.findOne({
      jobId,
      candidateId: req.user._id,
    });

    if (existingApplication) {
      return res.status(404).json({
        message: "Already applied for this Job",
      });
    }

    //Skills matching
    const matchResult = calculateMatch(job.requirements, skills || []);

    //Create application
    const application = await Application.create({
      jobId,
      candidateId: req.user._id,
      resume,
      coverLetter,

      matchScore: matchResult.matchScore,
      matchReport: {
        skillsMatch: matchResult.skillsMatch,
        missingSkills: matchResult.missingSkills,
        overallFit: matchResult.overallFit,
      },
    });

    return res.status(201).json(application);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//Get applications
const getApplications = async (req, res) => {
  try {
    let applications;

    //Candidate sees own applications
    if (req.user.role === "Candidate") {
      applications = await Application.find({
        candidateId: req.user._id,
      })
        .populate("jobId")
        .populate("candidateId", "firstName lastName email");
    } else {
      //Recruiter/Admin can see all applications
      applications = await Application.find()
        .populate("jobId")
        .populate("candidateId", "firstName lastName email");
    }

    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//Get a single application
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("jobId")
      .populate("candidateId", "firstName lastName email");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }
    return res.json(application);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }
    application.status = req.body.status || application.status;

    await application.save();

    return res.json(application);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//Schedule interviews
const scheduleInterview = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application is not found",
      });
    }

    application.interviewSchedule = {
      date: req.body.date,
      time: req.body.time,
      type: req.body.type,
      notes: req.body.notes,
    };

    await application.save();

    return res.json(application);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  applyJob,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  scheduleInterview,
};
