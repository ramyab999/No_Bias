const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  permissions: {
    manageUsers: { type: Boolean, default: false },
    manageReports: { type: Boolean, default: true },
    manageContent: { type: Boolean, default: true },
  },
  lastAccess: { type: Date },
});

module.exports = mongoose.model("Admin", AdminSchema);
