const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "applied",
        "screening",
        "interviewed",
        "offered",
        "hired",
        "rejected",
      ],
      default: "applied",
    },
    resume: {
      type: String,
    },
    coverLetter: {
      type: String,
    },
    matchScore: {
      type: Number,
    },
    matchReport: {
      skillsMatch: [String],
      missingSkills: [String],
      overallFit: String,
    },
    interviewSchedule: new mongoose.Schema(
      {
        date: { type: Date },
        time: { type: String },
        type: { type: String },
        notes: { type: String },
      },
      { _id: false },
    ),

    feedback: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Application", applicationSchema);
