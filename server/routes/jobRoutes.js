const express = require("express");

const router = express.Router();

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const { protect } = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

//Public routes
router.get("/", getJobs);

router.get("/:id", getJobById);

//Protected routes
router.post(
  "/create-job",
  protect,
  authorizeRoles("Admin", "Recruiter"),
  createJob,
);

router.put(
  "/update-job/:id",
  protect,
  authorizeRoles("Admin", "Recruiter"),
  updateJob,
);

router.delete(
  "/delete-job/:id",
  protect,
  authorizeRoles("Admin", "Recruiter"),
  deleteJob,
);

module.exports = router;
