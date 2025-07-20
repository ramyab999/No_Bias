const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email format",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    mobile: {
      type: String,
      validate: {
        validator: (v) => !v || /^\d{10}$/.test(v),
        message: "Mobile must be 10 digits",
      },
    },
    country: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    state: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    isVerified: { type: Boolean, default: false },
    profileCompleted: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiresAt: {
      type: Date,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.otp;
        delete ret.otpExpiresAt;
      },
    },
  }
);

module.exports = mongoose.model("User", userSchema);
