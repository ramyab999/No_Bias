const mongoose = require("mongoose");

const genderTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("GenderType", genderTypeSchema);
