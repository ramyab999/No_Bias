const Report = require("../models/Report");
const path = require("path");

// ✅ Create Report
const createReport = async (req, res) => {
  try {
    const { discriminationId, name, country, state, city, info } = req.body;
    const filename = req.file ? req.file.filename : null;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    // ✅ Create new report
    const newReport = new Report({
      user: req.user.id,
      discriminationId,
      name,
      country,
      state,
      city,
      info,
      media: filename ? [filename] : [],
      status: "pending",
    });

    await newReport.save();

    // ✅ Populate for response
    const populatedReport = await Report.findById(newReport._id)
      .populate("discriminationId", "name")
      .populate("user", "firstName lastName email")
      .populate("country", "name")
      .populate("state", "name")
      .populate("city", "name");

    res.status(201).json({
      message: "Report created successfully",
      report: populatedReport,
    });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({
      message: "Error creating report",
      error: error.message,
    });
  }
};

// ✅ Get Approved Reports (Public)
const getApprovedReports = async (req, res) => {
  try {
    const { country, state, type } = req.query;
    const filter = { status: "approved" };

    if (country) filter.country = country;
    if (state) filter.state = state;
    if (type) filter.discriminationId = type;

    const reports = await Report.find(filter)
      .populate("discriminationId", "name")
      .populate("user", "firstName lastName email")
      .populate("country", "name")
      .populate("state", "name")
      .populate("city", "name");

    res.status(200).json({
      message: "Approved reports fetched successfully",
      reports,
    });
  } catch (error) {
    console.error("Error fetching approved reports:", error);
    res.status(500).json({
      message: "Error fetching approved reports",
      error: error.message,
    });
  }
};

// ✅ Get All Reports (Admin)
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("discriminationId", "name")
      .populate("user", "firstName lastName email")
      .populate("country", "name")
      .populate("state", "name")
      .populate("city", "name");

    res.status(200).json({
      message: "All reports fetched successfully",
      reports,
    });
  } catch (error) {
    console.error("Error fetching all reports:", error);
    res.status(500).json({
      message: "Error fetching all reports",
      error: error.message,
    });
  }
};

// ✅ Get Report by ID
const getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId)
      .populate("discriminationId", "name")
      .populate("user", "firstName lastName email")
      .populate("country", "name")
      .populate("state", "name")
      .populate("city", "name");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({
      message: "Report fetched successfully",
      report,
    });
  } catch (error) {
    console.error("Error fetching report by ID:", error);
    res.status(500).json({
      message: "Error fetching report by ID",
      error: error.message,
    });
  }
};

module.exports = {
  createReport,
  getApprovedReports,
  getAllReports,
  getReportById,
};
