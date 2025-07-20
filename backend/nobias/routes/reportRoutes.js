const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportcontroller");
const { verifyUser, admin } = require("../middlewares/authMiddleware");
const upload = require("../utils/fileUpload");

router.post(
  "/",
  verifyUser,
  upload.single("media"),
  reportController.createReport
);
router.get("/approved", reportController.getApprovedReports);
router.get("/", verifyUser, admin, reportController.getAllReports);
router.get("/:reportId", verifyUser, reportController.getReportById);

module.exports = router;
