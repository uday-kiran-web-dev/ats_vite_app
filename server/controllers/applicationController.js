const axios = require("axios");

const FormData = require("form-data");

const fs = require("fs");

const Profile = require("../models/Profile");
const Application = require("../models/Application");
const Job = require("../models/Job");
const calculateMatch = require("../services/matchingService");
const {
  sendEmail,
  applicationSubmittedTemplate,
  recruiterNewApplicationTemplate,
  applicationStatusUpdateTemplate,
  interviewScheduledTemplate,
} = require("../services/emailService");

//Applying for a job
const applyJob = async (req, res) => {
  try {
    const { jobId, resume, coverLetter, skills } = req.body || {};

    if (!jobId) {
      return res.status(400).json({
        message: "jobId is required",
      });
    }

    // Checking if job exists
    const job = await Job.findById(jobId).populate(
      "recruiterId",
      "firstName lastName email",
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Get candidate profile
    const profile = await Profile.findOne({
      userId: req.user._id,
      profileId: req.body._id,
    });

    if (!profile || !profile.resume) {
      return res.status(400).json({
        message: "Resume not uploaded",
      });
    }

    // Create form data
    const formData = new FormData();

    formData.append("file", fs.createReadStream(profile.resume));

    formData.append("requirements", job.requirements.join(","));

    // Call Python analyzer
    const analysisResponse = await axios.post(
      `${process.env.FILE_UPLOAD_PATH}`,
      formData,
      {
        headers: formData.getHeaders(),
      },
    );

    const analysis = analysisResponse.data;

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
    // const application = await Application.create({
    //   jobId,
    //   candidateId: req.user._id,
    //   resume,
    //   coverLetter,

    //   matchScore: matchResult.matchScore,
    //   matchReport: {
    //     skillsMatch: matchResult.skillsMatch,
    //     missingSkills: matchResult.missingSkills,
    //     overallFit: matchResult.overallFit,
    //   },
    // });
    const application = await Application.create({
      jobId,
      candidateId: req.user._id,
      resume: profile.resume,
      profileId: profile._id,
      coverLetter,

      matchScore: analysis.matchScore,

      matchReport: {
        skillsMatch: analysis.matchedSkills,
        missingSkills: analysis.missingSkills,
        overallFit: analysis.recommendation,
      },
    });

    try {
      const candidateMail = applicationSubmittedTemplate(req.user, job);
      await sendEmail({
        to: req.user.email,
        subject: candidateMail.subject,
        html: candidateMail.html,
        text: candidateMail.text,
      });
    } catch (emailError) {
      console.error("Candidate application email failed", emailError);
    }

    if (job.recruiterId?.email) {
      try {
        const recruiterMail = recruiterNewApplicationTemplate(
          job.recruiterId,
          req.user,
          job,
        );
        await sendEmail({
          to: job.recruiterId.email,
          subject: recruiterMail.subject,
          html: recruiterMail.html,
          text: recruiterMail.text,
        });
      } catch (emailError) {
        console.error("Recruiter notification email failed", emailError);
      }
    }

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

    if (req.user.role === "Candidate") {
      applications = await Application.find({
        candidateId: req.user._id,
      })
        .populate("jobId")
        .populate("candidateId", "firstName lastName email phone");
    } else if (req.user.role === "Recruiter") {
      const jobs = await Job.find({ recruiterId: req.user._id }, "_id");
      const jobIds = jobs.map((job) => job._id);

      applications = await Application.find({
        jobId: { $in: jobIds },
      })
        .populate("jobId")
        .populate("candidateId", "firstName lastName email phone");
    } else {
      applications = await Application.find()
        .populate("jobId")
        .populate("candidateId", "firstName lastName email phone");
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
      .populate("candidateId", "firstName lastName email phone");

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
    const application = await Application.findById(req.params.id)
      .populate("candidateId", "firstName lastName email")
      .populate("jobId", "title");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    application.status = req.body.status || application.status;
    application.feedback = req.body.feedback ?? application.feedback;

    await application.save();

    if (application.candidateId?.email) {
      try {
        const mail = applicationStatusUpdateTemplate(
          application.candidateId,
          application,
          application.status,
        );
        await sendEmail({
          to: application.candidateId.email,
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
        });
      } catch (emailError) {
        console.error("Application status email failed", emailError);
      }
    }

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
    const application = await Application.findById(req.params.id)
      .populate("candidateId", "firstName lastName email phone")
      .populate("jobId", "title");

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

    if (application.candidateId?.email) {
      try {
        const mail = interviewScheduledTemplate(
          application.candidateId,
          application,
        );
        await sendEmail({
          to: application.candidateId.email,
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
        });
      } catch (emailError) {
        console.error("Interview scheduled email failed", emailError);
      }
    }

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
