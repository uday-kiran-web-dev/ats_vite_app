const { hash } = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Recruiter", "Candidate"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    lastLogin: {
      type: Date,
    },
    loginHistory: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        ip: String,
        userAgent: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
