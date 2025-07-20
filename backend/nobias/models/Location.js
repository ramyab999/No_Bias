const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["country", "state", "city"], required: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: "Location" }, // only for states
  state: { type: mongoose.Schema.Types.ObjectId, ref: "Location" }, // only for cities
});

module.exports = mongoose.model("Location", locationSchema);
