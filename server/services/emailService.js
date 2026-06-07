const nodemailer = require("nodemailer");

const {
  EMAIL_HOST = "smtp-relay.brevo.com",
  EMAIL_PORT = 587,
  EMAIL_SECURE = "false",
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM = "ATS <no-reply@example.com>",
} = process.env;

const useSmtp = Boolean(EMAIL_USER && EMAIL_PASS);
let transporter;

if (useSmtp) {
  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: EMAIL_SECURE === "true",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error("Brevo SMTP transporter verification failed", error);
    } else {
      console.log("Brevo SMTP transporter is ready to send messages");
    }
  });
} else {
  console.error(
    "Brevo SMTP is not configured. Set EMAIL_USER and EMAIL_PASS to your Brevo SMTP credentials.",
  );
}

const wrapHtml = (title, body) => `
  <div style="font-family: Arial, sans-serif; background:#f4f5f7; padding:24px;">
    <div style="max-width:680px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e5e7eb;">
      <div style="background:#0f172a; color:#ffffff; padding:24px 32px; text-align:center;">
        <h1 style="margin:0; font-size:24px;">${title}</h1>
      </div>
      <div style="padding:32px; color:#0f172a; line-height:1.7;">
        ${body}
      </div>
      <div style="padding:24px 32px; background:#f8fafc; color:#64748b; font-size:14px;">
        <p style="margin:0;">Thanks for using the ATS. If you have questions, reply to this email.</p>
      </div>
    </div>
  </div>
`;

const sendEmail = async ({ to, subject, html, text }) => {
  if (!transporter) {
    console.error(
      "Brevo SMTP transporter is not available. Skipping email:",
      subject,
      "to",
      to,
    );
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });

    console.log(`Email sent via Brevo SMTP to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("Failed to send email via Brevo SMTP", error);
    return false;
  }
};

const welcomeTemplate = (user) => {
  const title = `Welcome to the ATS, ${user.firstName}!`;
  const body = `
    <p>Hi ${user.firstName},</p>
    <p>Thank you for registering as a <strong>${user.role}</strong> in our Applicant Tracking System.</p>
    <p>You can now log in and ${
      user.role === "Recruiter"
        ? "manage your job postings and review candidate applications."
        : "browse jobs and submit applications."
    }</p>
    <p>Best of luck!</p>
  `;

  return {
    subject: `Welcome to ATS, ${user.firstName}!`,
    html: wrapHtml(title, body),
    text: `Hi ${user.firstName},\n\nThank you for registering as a ${user.role} in our Applicant Tracking System.\n\nBest of luck!`,
  };
};

const applicationSubmittedTemplate = (candidate, job) => {
  const title = `Application Received for ${job.title}`;
  const body = `
    <p>Hi ${candidate.firstName},</p>
    <p>Your application for <strong>${job.title}</strong> has been successfully submitted.</p>
    <p>We'll keep you updated on the status of your application.</p>
  `;

  return {
    subject: `Application Submitted: ${job.title}`,
    html: wrapHtml(title, body),
    text: `Hi ${candidate.firstName},\n\nYour application for ${job.title} has been successfully submitted.\n\nWe'll keep you updated on the status of your application.`,
  };
};

const recruiterNewApplicationTemplate = (recruiter, candidate, job) => {
  const title = `New Application for ${job.title}`;
  const body = `
    <p>Hi ${recruiter.firstName},</p>
    <p><strong>${candidate.firstName} ${candidate.lastName}</strong> has applied for your job posting <strong>${job.title}</strong>.</p>
    <p>Open the ATS to review the candidate's application and take the next step.</p>
  `;

  return {
    subject: `New applicant for ${job.title}`,
    html: wrapHtml(title, body),
    text: `${candidate.firstName} ${candidate.lastName} has applied for your job posting ${job.title}. Open the ATS to review the application.`,
  };
};

const applicationStatusUpdateTemplate = (candidate, application, status) => {
  const title = `Application Status Updated: ${application.jobId?.title}`;
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);
  const body = `
    <p>Hi ${candidate.firstName},</p>
    <p>Your application for <strong>${application.jobId?.title}</strong> has been updated to <strong>${statusText}</strong>.</p>
    <p>${
      status === "hired"
        ? "Congratulations! The recruiter has marked you as hired. Please check your ATS dashboard for next steps."
        : status === "rejected"
          ? "Unfortunately, you were not selected at this time. We encourage you to continue applying to other roles."
          : `Current status: ${statusText}. Please check your ATS dashboard for any updates.`
    }</p>
  `;

  return {
    subject: `Application Status: ${statusText}`,
    html: wrapHtml(title, body),
    text: `Hi ${candidate.firstName},\n\nYour application for ${application.jobId?.title} has been updated to ${statusText}.`,
  };
};

const interviewScheduledTemplate = (candidate, application) => {
  const title = `Interview Scheduled for ${application.jobId?.title}`;
  const interview = application.interviewSchedule || {};
  const body = `
    <p>Hi ${candidate.firstName},</p>
    <p>An interview has been scheduled for your application to <strong>${application.jobId?.title}</strong>.</p>
    <p><strong>Date:</strong> ${new Date(interview.date).toLocaleDateString()}<br />
    <strong>Time:</strong> ${interview.time || "TBD"}<br />
    <strong>Type:</strong> ${interview.type || "TBD"}</p>
    <p>Notes: ${interview.notes || "No additional notes provided."}</p>
  `;

  return {
    subject: `Interview Scheduled: ${application.jobId?.title}`,
    html: wrapHtml(title, body),
    text: `Hi ${candidate.firstName},\n\nAn interview has been scheduled for your application to ${application.jobId?.title}. Date: ${new Date(interview.date).toLocaleDateString()}, Time: ${interview.time || "TBD"}.`,
  };
};

module.exports = {
  sendEmail,
  welcomeTemplate,
  applicationSubmittedTemplate,
  recruiterNewApplicationTemplate,
  applicationStatusUpdateTemplate,
  interviewScheduledTemplate,
};
