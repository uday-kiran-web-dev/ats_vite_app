const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const profileRoutes = require("./routes/profileRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://ats-vite-app.onrender.com"],
//     credentials: true,
//   }),
// );
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api/profiles", profileRoutes);

app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("ATS Server is running");
});

app.get("/api/email-test", async (req, res) => {
  const to = req.query.to;

  if (!to) {
    return res.status(400).json({
      success: false,
      message: "Missing recipient email. Provide ?to=you@example.com.",
    });
  }

  const { sendEmail } = require("./services/emailService");

  const isSent = await sendEmail({
    to,
    subject: "ATS Email Test",
    text: "This is a test email from your ATS server.",
    html: "<p>This is a test email from your ATS server.</p>",
  });

  if (isSent) {
    return res.json({ success: true, message: `Test email sent to ${to}` });
  }

  return res.status(500).json({
    success: false,
    message:
      "Unable to send test email. Check server logs for SMTP or Brevo API errors.",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on: ${PORT}`);
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date(),
  });
});
