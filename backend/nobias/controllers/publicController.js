const Report = require("../models/Report");

exports.getAllPublicReports = async (req, res) => {
  try {
    const reports = await Report.find({ status: "approved" }).sort({
      createdAt: -1,
    });
    res.json(reports);
  } catch (error) {
    console.error("Error fetching public reports:", error);
    res.status(500).json({ message: "Error fetching public reports", error });
  }
};
