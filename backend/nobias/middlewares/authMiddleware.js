// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log("🔑 Incoming authHeader:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided." });
    }

    const token = authHeader.split(" ")[1];
    // console.log("🔑 Extracted token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("✅ Decoded JWT payload:", decoded);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = user; // attach entire user object
    next();
  } catch (error) {
    console.error("verifyUser middleware error:", error.message);
    res
      .status(401)
      .json({ message: "Unauthorized. Invalid or expired token." });
  }
};

const admin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. No user found." });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // console.log("✅ Admin verified:", req.user.firstName);
    next();
  } catch (err) {
    console.error("Admin middleware error:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { protect, verifyUser, admin };
