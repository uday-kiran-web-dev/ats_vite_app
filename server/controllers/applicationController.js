const axios = require("axios");

const FormData = require("form-data");

const fs = require("fs");
const path = require("path");

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

const analyzerEndpoint =
  process.env.FILE_UPLOAD_PATH?.trim() ||
  (process.env.NODE_ENV !== "production"
    ? "http://127.0.0.1:8000/analyze-resume"
    : "");

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
    const profile = await Profile.findOne({ userId: req.user._id });

    if (!profile || !profile.resume) {
      return res.status(400).json({
        message: "Resume not uploaded",
      });
    }

    const requirements = Array.isArray(job.requirements)
      ? job.requirements.join(",")
      : job.requirements || "";

    // Call Python analyzer (resilient)
    let analysis = {
      matchScore: 0,
      matchedSkills: [],
      missingSkills: [],
      recommendation: "No analysis",
    };

    if (!analyzerEndpoint) {
      console.warn(
        "Resume analyzer endpoint is not configured. Set FILE_UPLOAD_PATH in env to enable analysis.",
      );
    } else {
      try {
        const resumeFilename = profile.resume.startsWith("http")
          ? path.basename(new URL(profile.resume).pathname)
          : path.basename(profile.resume);

        const resumeStream = profile.resume.startsWith("http")
          ? (await axios.get(profile.resume, { responseType: "stream" })).data
          : fs.createReadStream(path.join(__dirname, "..", profile.resume));

        const formData = new FormData();
        formData.append("file", resumeStream, { filename: resumeFilename });
        formData.append("requirements", requirements);

        const analysisResponse = await axios.post(analyzerEndpoint, formData, {
          headers: formData.getHeaders(),
          timeout: 15000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });

        if (analysisResponse && analysisResponse.data) {
          analysis = analysisResponse.data;
        } else {
          console.warn(
            "Resume analyzer returned empty response data:",
            analysisResponse?.status,
          );
        }
      } catch (err) {
        console.error("Resume analyzer failed:", {
          message: err.message,
          code: err.code,
          responseStatus: err.response?.status,
          responseData: err.response?.data,
          endpoint: analyzerEndpoint,
        });
        // proceed without analysis result (use defaults above)
      }
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

    res.status(201).json(application);

    const sendApplicationNotifications = async () => {
      try {
        const candidateMail = applicationSubmittedTemplate(req.user, job);
        const emailPromises = [
          sendEmail({
            to: req.user.email,
            subject: candidateMail.subject,
            html: candidateMail.html,
            text: candidateMail.text,
          }),
        ];

        if (job.recruiterId?.email) {
          const recruiterMail = recruiterNewApplicationTemplate(
            job.recruiterId,
            req.user,
            job,
          );
          emailPromises.push(
            sendEmail({
              to: job.recruiterId.email,
              subject: recruiterMail.subject,
              html: recruiterMail.html,
              text: recruiterMail.text,
            }),
          );
        }

        await Promise.allSettled(emailPromises);
      } catch (emailError) {
        console.error("Application email notification failed", emailError);
      }
    };

    sendApplicationNotifications();
    return;
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
