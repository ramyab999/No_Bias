const mongoose = require("mongoose");
const User = require("../models/User");
const Location = require("../models/Location");

// ✅ Get User Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -otp -otpExpiresAt")
      .populate("country")
      .populate("state")
      .populate("city");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Fetched profile data:", user);

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      mobile: user.mobile,
      country: user.country
        ? { _id: user.country._id, name: user.country.name }
        : null,
      state: user.state ? { _id: user.state._id, name: user.state.name } : null,
      city: user.city ? { _id: user.city._id, name: user.city.name } : null,
      profileCompleted: user.profileCompleted,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update User Profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, gender, mobile, country, state, city } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(country)) {
      return res.status(400).json({ message: "Invalid country ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(state)) {
      return res.status(400).json({ message: "Invalid state ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(city)) {
      return res.status(400).json({ message: "Invalid city ID" });
    }

    // ✅ Verify IDs exist in Location collection with correct type and linkage

    const countryDoc = await Location.findOne({
      _id: country,
      type: "country",
    });
    if (!countryDoc) {
      return res.status(400).json({ message: "Country not found" });
    }

    const stateDoc = await Location.findOne({
      _id: state,
      type: "state",
      country: country,
    });
    if (!stateDoc) {
      return res
        .status(400)
        .json({ message: "State not found under selected country" });
    }

    const cityDoc = await Location.findOne({
      _id: city,
      type: "city",
      state: state,
    });
    if (!cityDoc) {
      return res
        .status(400)
        .json({ message: "City not found under selected state" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        firstName,
        lastName,
        gender,
        mobile,
        country,
        state,
        city,
        profileCompleted: true,
      },
      { new: true }
    )
      .populate("country")
      .populate("state")
      .populate("city")
      .select("-password -otp -otpExpiresAt");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Profile updated successfully:", updatedUser);

    res.json({
      message: "Profile updated successfully",
      profile: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        gender: updatedUser.gender,
        mobile: updatedUser.mobile,
        country: updatedUser.country
          ? { _id: updatedUser.country._id, name: updatedUser.country.name }
          : null,
        state: updatedUser.state
          ? { _id: updatedUser.state._id, name: updatedUser.state.name }
          : null,
        city: updatedUser.city
          ? { _id: updatedUser.city._id, name: updatedUser.city.name }
          : null,
        profileCompleted: updatedUser.profileCompleted,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
