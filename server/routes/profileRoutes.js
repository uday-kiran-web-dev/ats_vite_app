const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const upload = require("../middleware/uploadMiddleware");
const {
  createOrUpdateProfile,
  getMyProfile,
  getAllProfiles,
} = require("../controllers/profileController");

// Candidate create/update profile
router.post(
  "/",
  protect,
  authorizeRoles("Candidate"),
  upload.single("resume"),
  createOrUpdateProfile,
);

// Candidate get own profile
router.get("/me", protect, authorizeRoles("Candidate"), getMyProfile);

// Recruiter/Admin view all profiles
router.get("/", protect, authorizeRoles("Admin", "Recruiter"), getAllProfiles);

module.exports = router;
