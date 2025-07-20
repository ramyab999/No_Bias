const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// User registration
router.post("/register", authController.register);

// User login
router.post("/login", authController.login);

// OTP verification for user email
router.post("/verify-otp", authController.verifyOtp);

router.post("/send-otp", authController.sendOTP);

module.exports = router;
