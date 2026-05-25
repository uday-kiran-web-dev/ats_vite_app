const Job = require("../models/Job");

//Create job
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      department,
      location,
      jobType,
      salary,
      status,
    } = req.body;

    const job = await Job.create({
      title,
      description,
      requirements,
      department,
      location,
      jobType,
      salary,
      status,
      recruiterId: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "active" }).populate(
      "recruiterId",
      "firstName lastName email",
    );

    return res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//Get a single job
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "recruiterId",
      "firstName lastName email",
    );
    if (!job) {
      return res.status(404).json({
        message: "Job not found ..!",
      });
    }
    return res.json(job);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//Update job details
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        message: "Cannot update / Job not found",
      });
    }

    //User access check
    if (
      req.user.role !== "Admin" &&
      (!job.recruiterId ||
        job.recruiterId.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        message: "User Not authorized..!",
      });
    }

    //Update job
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });
    return res.json(updatedJob);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found ..!",
      });
    }

    //User access check
    if (
      req.user.role !== "Admin" &&
      (!job.recruiterId ||
        job.recruiterId.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        message: "User not authorized..!",
      });
    }

    //deleting job
    await job.deleteOne();

    return res.json({
      message: "Job deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
};
