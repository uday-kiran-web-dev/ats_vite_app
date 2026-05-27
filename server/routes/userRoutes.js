const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

//Admin-only test route
router.get("/admin-only", protect, authorizeRoles("Admin"), (req, res) => {
  res.json({
    message: "Welcome Admin",
  });
});

router.use(protect, authorizeRoles("Admin"));

router.get("/", getUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
