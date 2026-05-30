const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getUsers,
  getUserById,
  getUserLogs,
  updateUser,
  updateCurrentUser,
  deleteUser,
  createUser,
} = require("../controllers/userController");

router.post("/add-user", protect, authorizeRoles("Admin"), createUser);
router.put("/me", protect, updateCurrentUser);

//Admin-only test route
router.get("/admin-only", protect, authorizeRoles("Admin"), (req, res) => {
  res.json({
    message: "Welcome Admin",
  });
});

router.use(protect, authorizeRoles("Admin"));

router.get("/", getUsers);
router.get("/logs", getUserLogs);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
