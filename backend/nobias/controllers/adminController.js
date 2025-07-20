const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const User = require("../models/User");
const Admin = require("../models/Admin");
const Discrimination = require("../models/Discrimination");
const DiscriminationType = require("../models/DiscriminationType");
const GenderType = require("../models/GenderType");
const Report = require("../models/Report");
const Location = require("../models/Location");

/**
 * ===================== ADMIN AUTH =====================
 */

const registerAdmin = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      mobile,
      country,
      state,
      city,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      mobile,
      country,
      state,
      city,
      role: "admin",
      isVerified: true,
      profileCompleted: true,
    });
    await newUser.save();

    const newAdmin = new Admin({
      user: newUser._id,
      permissions: {
        manageUsers: true,
        manageReports: true,
        manageContent: true,
      },
      lastAccess: new Date(),
    });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "admin" });
    if (!user) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const admin = await Admin.findOne({ user: user._id });
    if (!admin)
      return res.status(404).json({ message: "Admin profile not found" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.auth.jwtSecret,
      { expiresIn: config.auth.jwtExpiresIn }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * ===================== DISCRIMINATION TYPES =====================
 */

const createDiscriminationType = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }

    const exists = await DiscriminationType.findOne({ name: name.trim() });
    if (exists) {
      return res
        .status(409)
        .json({ message: "Discrimination type already exists" });
    }

    const newType = new DiscriminationType({ name: name.trim() });
    await newType.save();

    res
      .status(201)
      .json({ message: "Discrimination type created", type: newType });
  } catch (error) {
    res.status(500).json({
      message: "Error creating discrimination type",
      error: error.message,
    });
  }
};

const getAllDiscriminationTypes = async (req, res) => {
  try {
    const types = await DiscriminationType.find().sort({ name: 1 });
    res.status(200).json(types);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching discrimination types",
      error: error.message,
    });
  }
};

/**
 * ===================== DISCRIMINATIONS =====================
 */

const createDiscrimination = async (req, res) => {
  try {
    const { name, type, description } = req.body;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ message: "Discrimination name is required" });
    }
    if (!type) {
      return res
        .status(400)
        .json({ message: "Discrimination type is required" });
    }

    const typeExists = await DiscriminationType.findById(type);
    if (!typeExists) {
      return res
        .status(400)
        .json({ message: "Invalid discrimination type ID" });
    }

    const existing = await Discrimination.findOne({ name: name.trim(), type });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Discrimination already exists under this type" });
    }

    const discrimination = new Discrimination({
      name: name.trim(),
      type,
      description: description ? description.trim() : "",
    });

    await discrimination.save();

    console.log(`✅ Discrimination '${name}' created successfully`);

    res.status(201).json({
      message: "Discrimination created successfully",
      discrimination,
    });
  } catch (err) {
    console.error("❌ Error creating discrimination:", err.message);
    res
      .status(500)
      .json({ message: "Error creating discrimination", error: err.message });
  }
};

const getDiscriminationsByType = async (req, res) => {
  try {
    const { typeId } = req.params;
    const discriminations = await Discrimination.find({ type: typeId });
    res.status(200).json(discriminations);
  } catch (err) {
    console.error("❌ Error fetching discriminations:", err.message);
    res.status(500).json({ message: "Failed to fetch discriminations" });
  }
};

const getAllDiscriminations = async (req, res) => {
  try {
    const discriminations = await Discrimination.find().populate(
      "type",
      "name"
    );
    console.log("✅ Populated discriminations:", discriminations);
    res.status(200).json(discriminations);
  } catch (error) {
    console.error("❌ Error fetching discriminations:", error.message);
    res.status(500).json({
      message: "Error fetching discriminations",
      error: error.message,
    });
  }
};

/*
 * ===================== GENDER TYPES =====================
 */

const createGenderType = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }

    const existing = await GenderType.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Gender type already exists" });
    }

    const gender = new GenderType({ name: name.trim() });
    await gender.save();

    res.status(201).json(gender);
  } catch (error) {
    console.error("Error creating gender type:", error);
    res
      .status(500)
      .json({ message: "Error creating gender type", error: error.message });
  }
};

const getAllGenderTypes = async (req, res) => {
  try {
    const genders = await GenderType.find().sort({ name: 1 });
    res.status(200).json(genders);
  } catch (error) {
    console.error("Error fetching gender types:", error);
    res
      .status(500)
      .json({ message: "Error fetching gender types", error: error.message });
  }
};

const updateGenderType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updated = await GenderType.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Gender type not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating gender type:", error);
    res
      .status(500)
      .json({ message: "Error updating gender type", error: error.message });
  }
};

const deleteGenderType = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await GenderType.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Gender type not found" });
    }

    res.status(200).json({ message: "Gender type deleted" });
  } catch (error) {
    console.error("Error deleting gender type:", error);
    res
      .status(500)
      .json({ message: "Error deleting gender type", error: error.message });
  }
};

/**
 * ===================== REPORTS =====================
 */

const approveReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = "approved";
    await report.save();

    res.status(200).json({ message: "Report approved successfully", report });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const rejectReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({ message: "Report rejected successfully", report });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error rejecting report", error: error.message });
  }
};
const getPendingReports = async (req, res) => {
  try {
    const reports = await Report.find({ status: "pending" })
      .populate("discriminationId", "name")
      .populate("user", "firstName lastName email")
      .populate("country", "name")
      .populate("state", "name")
      .populate("city", "name")
      .sort({ createdAt: -1 });

    console.log("✅ Sending pending reports:", reports);
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching pending reports:", error);
    res.status(500).json({
      message: "Error fetching pending reports",
      error: error.message,
    });
  }
};

const getAllReportsWithFilters = async (req, res) => {
  try {
    const filters = { status: "approved", ...req.query };

    Object.keys(filters).forEach(
      (key) =>
        (filters[key] === "" || filters[key] === "All") && delete filters[key]
    );

    const reports = await Report.find(filters)
      .populate("discriminationId", "name")
      .populate("user", "firstName lastName email")
      .populate("country", "name")
      .populate("state", "name")
      .populate("city", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching approved reports:", error);
    res.status(500).json({
      message: "Error fetching approved reports",
      error: error.message,
    });
  }
};

/**
 * ===================== UTILITIES =====================
 */

const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ totalUsers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching total users", error: error.message });
  }
};

const getAllFilterData = async (req, res) => {
  try {
    const countries = await Location.find({ type: "country" }).select("name");
    const states = await Location.find({ type: "state" })
      .select("name country")
      .populate("country", "name");
    const types = await DiscriminationType.find().select("name");

    res.status(200).json({ countries, states, types });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch filter data", error: err.message });
  }
};

const getFilteredReports = async (req, res) => {
  try {
    const { country, state, city, type } = req.query;

    let filter = { status: "approved" };
    if (country) filter["country"] = country;
    if (state) filter["state"] = state;
    if (city) filter["city"] = city;
    if (type) filter["discrimination"] = type;

    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .populate("discrimination", "name")
      .populate("country", "name")
      .populate("state", "name")
      .populate("city", "name");

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching filtered reports:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .populate("gender", "name")
      .populate("country", "name")
      .populate("state", "name")
      .populate("city", "name")
      .select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * ===================== EXPORTS =====================
 */

module.exports = {
  registerAdmin,
  adminLogin,

  // Discrimination Types
  createDiscriminationType,
  getAllDiscriminationTypes,

  // Discriminations
  createDiscrimination,
  getAllDiscriminations,
  getDiscriminationsByType,

  // Gender Types
  createGenderType,
  getAllGenderTypes,
  updateGenderType,
  deleteGenderType,

  // Reports
  approveReport,
  rejectReport,
  getPendingReports,
  getAllReportsWithFilters,

  // Utilities
  getTotalUsers,
  getAllFilterData,
  getFilteredReports,
  getAllUsers,
};
