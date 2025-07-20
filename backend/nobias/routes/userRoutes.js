const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middlewares/authMiddleware"); // ✅ correct import
const { getProfile, updateProfile } = require("../controllers/userController");

// ✅ Get user profile
router.get("/profile", verifyUser, getProfile);

// ✅ Update user profile
router.put("/profile", verifyUser, updateProfile);

module.exports = router;
