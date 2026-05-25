const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

//Admin access route
router.get("/admin-only", protect, authorizeRoles("Admin"), (req, res) => {
  res.json({
    message: "Welcome Admin",
  });
});

module.exports = router;
