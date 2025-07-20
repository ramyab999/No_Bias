const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const { verifyUser, admin } = require("../middlewares/authMiddleware");

// ✅ CREATE (Admin only)
router.post("/countries", verifyUser, admin, locationController.createCountry);
router.post("/states", verifyUser, admin, locationController.createState);
router.post("/cities", verifyUser, admin, locationController.createCity);

// ✅ GET (for frontend dropdowns)
router.get("/countries", locationController.getCountries);
router.get("/states/:countryId", locationController.getStatesByCountry);
router.get("/cities/:stateId", locationController.getCitiesByState);

// ✅ DELETE (Admin only)
router.delete(
  "/countries/:id",
  verifyUser,
  admin,
  locationController.deleteCountry
);
router.delete("/states/:id", verifyUser, admin, locationController.deleteState);
router.delete("/cities/:id", verifyUser, admin, locationController.deleteCity);

module.exports = router;
