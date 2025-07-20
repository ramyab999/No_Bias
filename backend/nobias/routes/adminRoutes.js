const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, verifyUser, admin } = require("../middlewares/authMiddleware");

// ============= AUTH ============= //
router.post("/register", adminController.registerAdmin);
router.post("/login", adminController.adminLogin);

// ============= DISCRIMINATION TYPES ============= //
router.post(
  "/discrimination-types",
  verifyUser,
  admin,
  adminController.createDiscriminationType
);
router.get(
  "/discriminations/by-type/:typeId",
  protect,
  adminController.getDiscriminationsByType
);
// ============= DISCRIMINATIONS ============= //
router.post(
  "/discriminations",
  verifyUser,
  admin,
  adminController.createDiscrimination
);
router.get("/discriminations", adminController.getAllDiscriminations);

// ============= GENDER TYPES ============= //
router.post(
  "/gender-types",
  verifyUser,
  admin,
  adminController.createGenderType
);
router.get("/gender-types", adminController.getAllGenderTypes);
router.put(
  "/gender-types/:id",
  verifyUser,
  admin,
  adminController.updateGenderType
);
router.delete(
  "/gender-types/:id",
  verifyUser,
  admin,
  adminController.deleteGenderType
);

// ============= REPORTS ============= //
router.get("/reports/pending", verifyUser, adminController.getPendingReports);
router.get(
  "/reports",
  verifyUser,
  admin,
  adminController.getAllReportsWithFilters
);
router.put(
  "/reports/:id/approve",
  verifyUser,
  admin,
  adminController.approveReport
);
router.put(
  "/reports/:id/reject",
  verifyUser,
  admin,
  adminController.rejectReport
);

// ============= TOTAL USERS ============= //
router.get("/total-users", verifyUser, admin, adminController.getTotalUsers);

// ============= FILTERS ============= //
router.get("/filters", verifyUser, admin, adminController.getAllFilterData);

// ============= FILTERED REPORTS ============= //
router.get(
  "/filtered-reports",
  verifyUser,
  admin,
  adminController.getFilteredReports
);

// ============= USERS ============= //
router.get("/users", verifyUser, admin, adminController.getAllUsers);

module.exports = router;
