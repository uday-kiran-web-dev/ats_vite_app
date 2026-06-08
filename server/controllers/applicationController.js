const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const Profile = require("../models/Profile");
const Application = require("../models/Application");
const Job = require("../models/Job");
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

// Helper: Send application emails asynchronously
const sendApplicationEmails = (
  candidateEmail,
  recruiterEmail,
  candidateTemplate,
  recruiterTemplate,
) => {
  setImmediate(async () => {
    try {
      const emailPromises = [
        sendEmail({
          to: candidateEmail,
          subject: candidateTemplate.subject,
          html: candidateTemplate.html,
          text: candidateTemplate.text,
        }),
      ];

      if (recruiterEmail && recruiterTemplate) {
        emailPromises.push(
          sendEmail({
            to: recruiterEmail,
            subject: recruiterTemplate.subject,
            html: recruiterTemplate.html,
            text: recruiterTemplate.text,
          }),
        );
      }

      const results = await Promise.allSettled(emailPromises);
      console.log(
        "Email notification results:",
        results.map((r) => r.status),
      );
    } catch (err) {
      console.error("Email notification error:", err);
    }
  });
};

// Helper: Get applications with role-based filtering
const getApplicationsByRole = async (userId, userRole) => {
  if (userRole === "Candidate") {
    return Application.find({ candidateId: userId })
      .populate("jobId")
      .populate("candidateId", "firstName lastName email phone");
  } else if (userRole === "Recruiter") {
    const jobs = await Job.find({ recruiterId: userId }, "_id");
    return Application.find({ jobId: { $in: jobs.map((j) => j._id) } })
      .populate("jobId")
      .populate("candidateId", "firstName lastName email phone");
  }
  return Application.find()
    .populate("jobId")
    .populate("candidateId", "firstName lastName email phone");
};

//Applying for a job
const applyJob = async (req, res) => {
  try {
    const { jobId, coverLetter, skills } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "jobId is required" });
    }

    const job = await Job.findById(jobId).populate(
      "recruiterId",
      "firstName lastName email",
    );
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile?.resume) {
      return res.status(400).json({ message: "Resume not uploaded" });
    }

    // Check if already applied
    if (
      await Application.findOne({
        jobId,
        candidateId: req.user._id,
      })
    ) {
      return res.status(409).json({ message: "Already applied for this job" });
    }

    // Analyze resume with Python service
    let analysis = {
      matchScore: 0,
      matchedSkills: [],
      missingSkills: [],
      recommendation: "No analysis",
    };

    if (analyzerEndpoint) {
      try {
        const resumeFilename = profile.resume.startsWith("http")
          ? path.basename(new URL(profile.resume).pathname)
          : path.basename(profile.resume);

        const resumeStream = profile.resume.startsWith("http")
          ? (await axios.get(profile.resume, { responseType: "stream" })).data
          : fs.createReadStream(path.join(__dirname, "..", profile.resume));

        const requirements = Array.isArray(job.requirements)
          ? job.requirements.join(",")
          : job.requirements || "";

        const formData = new FormData();
        formData.append("file", resumeStream, { filename: resumeFilename });
        formData.append("requirements", requirements);

        const { data } = await axios.post(analyzerEndpoint, formData, {
          headers: formData.getHeaders(),
          timeout: 15000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });

        if (data) analysis = data;
      } catch (err) {
        console.error("Resume analyzer error:", err.message);
      }
    }

    // Create application
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

    // Send async notifications
    const candidateMail = applicationSubmittedTemplate(req.user, job);
    const recruiterMail = job.recruiterId?.email
      ? recruiterNewApplicationTemplate(job.recruiterId, req.user, job)
      : null;

    sendApplicationEmails(
      req.user.email,
      job.recruiterId?.email,
      candidateMail,
      recruiterMail,
    );
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//Get applications
const getApplications = async (req, res) => {
  try {
    const applications = await getApplicationsByRole(
      req.user._id,
      req.user.role,
    );
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
    const application = await Application.findById(req.params.id).populate(
      "candidateId",
      "firstName lastName email",
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = req.body.status || application.status;
    application.feedback = req.body.feedback ?? application.feedback;
    await application.save();

    // Send status update email
    if (application.candidateId?.email) {
      setImmediate(async () => {
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
        } catch (err) {
          console.error("Status email failed:", err.message);
        }
      });
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
    const application = await Application.findById(req.params.id).populate(
      "candidateId",
      "firstName lastName email phone",
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.interviewSchedule = {
      date: req.body.date,
      time: req.body.time,
      type: req.body.type,
      notes: req.body.notes,
    };

    await application.save();

    // Send interview scheduled email
    if (application.candidateId?.email) {
      setImmediate(async () => {
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
        } catch (err) {
          console.error("Interview email failed:", err.message);
        }
      });
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
