const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
      },
    ],
    department: {
      type: String,
    },
    location: {
      type: String,
    },
    jobTpye: {
      type: String,
      enum: ["full-time", "part-time", "contract"],
      default: "full-time",
    },

    salary: {
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Job", jobSchema);
