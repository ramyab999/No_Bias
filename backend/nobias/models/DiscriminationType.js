// models/DiscriminationType.js
const mongoose = require("mongoose");

const discriminationTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DiscriminationType", discriminationTypeSchema);
