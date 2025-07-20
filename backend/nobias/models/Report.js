const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    // ✅ Reference to the reporting user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Discrimination type reference
    discriminationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discrimination",
      required: true,
    },

    // ✅ Name of reporter (can be real name or anonymous text input)
    name: {
      type: String,
      required: true,
    },

    // ✅ Location references
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },

    // ✅ Brief information about the report
    info: {
      type: String,
      required: true,
    },

    // ✅ Media files array (images/videos uploaded)
    media: [
      {
        type: String,
      },
    ],

    // ✅ Status field with enum
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // ✅ Error field to track report errors if any (optional)
    error: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
