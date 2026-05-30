const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const upload = require("../middleware/uploadMiddleware");
const {
  createOrUpdateProfile,
  getMyProfile,
  getAllProfiles,
  getProfileById,
  createCandidateByRecruiter,
  updateProfileById,
  updateCandidateActiveStatus,
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

// Recruiter/Admin create a candidate account
router.post(
  "/create-candidate",
  protect,
  authorizeRoles("Admin", "Recruiter"),
  upload.single("resume"),
  createCandidateByRecruiter,
);

// Recruiter/Admin view all profiles
router.get("/", protect, authorizeRoles("Admin", "Recruiter"), getAllProfiles);

// Recruiter/Admin update candidate profile
router.put(
  "/:id",
  protect,
  authorizeRoles("Admin", "Recruiter"),
  upload.single("resume"),
  updateProfileById,
);

// Recruiter/Admin toggle candidate active status
router.put(
  "/:id/active",
  protect,
  authorizeRoles("Admin", "Recruiter"),
  updateCandidateActiveStatus,
);

// Recruiter/Admin view a single profile
router.get(
  "/:id",
  protect,
  authorizeRoles("Admin", "Recruiter"),
  getProfileById,
);

module.exports = router;
