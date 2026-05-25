const express = require("express");

const router = express.Router();

const {
  getOverviewAnalytics,
  getPipelineAnalytics,
  exportAnalytics,
} = require("../controllers/analyticsController");

const { protect } = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

// Overview analytics
router.get(
  "/overview",
  protect,
  authorizeRoles("Admin", "Recruiter"),
  getOverviewAnalytics,
);

// Pipeline analytics
router.get(
  "/pipeline",
  protect,
  authorizeRoles("Admin", "Recruiter"),
  getPipelineAnalytics,
);

// Export analytics
router.get("/export", protect, authorizeRoles("Admin"), exportAnalytics);

module.exports = router;
