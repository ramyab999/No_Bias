const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicController");

// Anyone can view all reported discriminations
router.get("/discriminations", publicController.getAllPublicReports);

module.exports = router;
