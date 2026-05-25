const express = require("express");

const router = express.Router();

const {
  applyJob,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  scheduleInterview,
} = require("../controllers/applicationController");

const { protect } = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

//candidate apply job
router.post("/apply", protect, authorizeRoles("Candidate"), applyJob);

//Get applications
router.get("/", protect, getApplications);

//Get application by id
router.get("/:id", protect, getApplicationById);

//Update application status
router.put(
  "/:id/status",
  protect,
  authorizeRoles("Admin", "Recruiter"),
  updateApplicationStatus,
);

//Schedule interviews
router.put(
  "/:id/schedule",
  protect,
  authorizeRoles("Admin", "Recruiter"),
  scheduleInterview,
);

module.exports = router;
