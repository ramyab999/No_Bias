// controllers/discriminationTypeController.js

const DiscriminationType = require("../models/DiscriminationType"); // Adjust model path as per your structure

// ✅ Create a discrimination type
exports.createDiscriminationType = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate input
    if (!name || name.trim() === "") {
      console.log("Discrimination type name missing in request body");
      return res
        .status(400)
        .json({ message: "Discrimination type name is required" });
    }

    // Check for duplicate
    const existing = await DiscriminationType.findOne({ name: name.trim() });
    if (existing) {
      console.log(`Discrimination type '${name}' already exists`);
      return res
        .status(409)
        .json({ message: "Discrimination type already exists" });
    }

    // Create and save
    const newType = new DiscriminationType({ name: name.trim() });
    await newType.save();

    console.log(`Discrimination type '${name}' created successfully`);
    res.status(201).json({
      message: "Discrimination type created successfully",
      type: newType,
    });
  } catch (error) {
    console.error("Error creating discrimination type:", error.message);
    res.status(500).json({
      message: "Error creating discrimination type",
      error: error.message,
    });
  }
};

// ✅ Get all discrimination types
exports.getAllDiscriminationTypes = async (req, res) => {
  try {
    const types = await DiscriminationType.find().sort({ name: 1 }); // Sorted alphabetically
    console.log(`Fetched ${types.length} discrimination types`);
    res.status(200).json(types);
  } catch (error) {
    console.error("Error fetching discrimination types:", error.message);
    res.status(500).json({
      message: "Error fetching discrimination types",
      error: error.message,
    });
  }
};

// ✅ Update discrimination type
exports.updateDiscriminationType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Validate input
    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ message: "Discrimination type name is required" });
    }

    // Check if type exists
    const type = await DiscriminationType.findById(id);
    if (!type) {
      return res.status(404).json({ message: "Discrimination type not found" });
    }

    // Check for duplicate name
    const existing = await DiscriminationType.findOne({
      name: name.trim(),
      _id: { $ne: id },
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Another discrimination type with same name exists" });
    }

    // Update and save
    type.name = name.trim();
    await type.save();

    console.log(`Discrimination type '${id}' updated successfully`);
    res
      .status(200)
      .json({ message: "Discrimination type updated successfully", type });
  } catch (error) {
    console.error("Error updating discrimination type:", error.message);
    res.status(500).json({
      message: "Error updating discrimination type",
      error: error.message,
    });
  }
};

// ✅ Delete discrimination type
exports.deleteDiscriminationType = async (req, res) => {
  try {
    const { id } = req.params;

    const type = await DiscriminationType.findByIdAndDelete(id);

    if (!type) {
      return res.status(404).json({ message: "Discrimination type not found" });
    }

    console.log(`Discrimination type '${type.name}' deleted successfully`);
    res
      .status(200)
      .json({ message: "Discrimination type deleted successfully" });
  } catch (error) {
    console.error("Error deleting discrimination type:", error.message);
    res.status(500).json({
      message: "Error deleting discrimination type",
      error: error.message,
    });
  }
};
