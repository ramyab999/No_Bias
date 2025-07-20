const express = require("express");
const router = express.Router();
const discriminationTypeController = require("../controllers/discriminationtypecontroller");

// ✅ Public routes for frontend
router.post("/", discriminationTypeController.createDiscriminationType);
router.get("/", discriminationTypeController.getAllDiscriminationTypes);
router.put("/:id", discriminationTypeController.updateDiscriminationType);
router.delete("/:id", discriminationTypeController.deleteDiscriminationType);

module.exports = router;
