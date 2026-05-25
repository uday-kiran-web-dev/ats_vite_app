const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

// OVERVIEW ANALYTICS
const getOverviewAnalytics = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();

    // Total candidates
    const totalCandidates = await User.countDocuments({
      role: "Candidate",
    });

    // Total recruiters
    const totalRecruiters = await User.countDocuments({
      role: "Recruiter",
    });

    // Total jobs
    const totalJobs = await Job.countDocuments();

    // Active jobs
    const activeJobs = await Job.countDocuments({
      status: "active",
    });

    // Total applications
    const totalApplications = await Application.countDocuments();

    // Hired candidates
    const hiredCandidates = await Application.countDocuments({
      status: "hired",
    });

    res.json({
      totalUsers,
      totalCandidates,
      totalRecruiters,
      totalJobs,
      activeJobs,
      totalApplications,
      hiredCandidates,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// PIPELINE ANALYTICS
const getPipelineAnalytics = async (req, res) => {
  try {
    const applied = await Application.countDocuments({
      status: "applied",
    });

    const screened = await Application.countDocuments({
      status: "screened",
    });

    const interviewed = await Application.countDocuments({
      status: "interviewed",
    });

    const offered = await Application.countDocuments({
      status: "offered",
    });

    const hired = await Application.countDocuments({
      status: "hired",
    });

    const rejected = await Application.countDocuments({
      status: "rejected",
    });

    res.json({
      applied,
      screened,
      interviewed,
      offered,
      hired,
      rejected,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// EXPORT ANALYTICS DATA
const exportAnalytics = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("jobId", "title")
      .populate("candidateId", "firstName lastName email");

    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getOverviewAnalytics,
  getPipelineAnalytics,
  exportAnalytics,
};
