const User = require("../models/User");
const { sendOTPEmail } = require("../utils/emailService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/config");

// ✅ Register User
exports.register = async (req, res) => {
  const {
    email,
    password,
    role,
    firstName,
    lastName,
    gender,
    mobile,
    country,
    state,
    city,
  } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({
      email,
      password: hashedPassword,
      role: role || "user",
      firstName,
      lastName,
      gender,
      mobile,
      country,
      state,
      city,
      otp,
      otpExpiresAt,
    });

    await user.save();
    await sendOTPEmail(email, otp);

    console.log("✅ Registration successful for:", email);
    return res.json({
      success: true,
      message: "Registration successful. OTP sent.",
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    return res
      .status(500)
      .json({ message: "Server error during registration." });
  }
};

// ✅ Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("❌ Login attempt for non-existent user:", email);
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch for user:", email);
      return res.status(400).json({ message: "Invalid credentials." });
    }

    if (!user.isVerified) {
      console.log("❌ Unverified login attempt:", email);
      return res
        .status(400)
        .json({ message: "Please verify your email first." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      config.auth.jwtSecret,
      { expiresIn: "1y", algorithm: "HS256" }
    );

    const userData = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      mobile: user.mobile,
      country: user.country,
      state: user.state,
      city: user.city,
      role: user.role,
      isVerified: user.isVerified,
    };

    console.log("✅ Successful login:", email);
    return res.json({ token, user: userData });
  } catch (err) {
    console.error("❌ Login error details:", {
      error: err.message,
      stack: err.stack,
      input: { email },
    });
    return res.status(500).json({
      message: "Login failed. Please try again.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// ✅ Resend OTP
exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOTPEmail(email, otp);
    console.log("✅ OTP resent to:", email);
    res.json({ success: true, message: "OTP sent to email." });
  } catch (err) {
    console.error("❌ Send OTP error:", err);
    res.status(500).json({ message: "Server error while sending OTP." });
  }
};

// ✅ Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    console.log("🔍 Verify OTP payload:", { email, otp });

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found during OTP verification:", email);
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      console.log("✅ User already verified:", email);
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }

    if (!user.otp || String(user.otp) !== String(otp)) {
      console.log("❌ Incorrect OTP for:", email);
      return res.status(400).json({ success: false, message: "Incorrect OTP" });
    }

    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      console.log("❌ OTP expired for:", email);
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    console.log("✅ Email verified successfully for:", email);
    return res.json({ success: true, message: "Email verified successfully." });
  } catch (err) {
    console.error("❌ OTP verification error:", err);
    return res
      .status(500)
      .json({ message: "Server error during OTP verification." });
  }
};
