const Location = require("../models/Location");

// ✅ Create Country
exports.createCountry = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Country name is required" });

    const existing = await Location.findOne({ name, type: "country" });
    if (existing)
      return res.status(400).json({ message: "Country already exists" });

    const country = new Location({ name, type: "country" });
    await country.save();
    console.log("Created country:", country);
    res.status(201).json(country);
  } catch (error) {
    console.error("Error creating country:", error);
    res.status(500).json({ message: "Error creating country", error });
  }
};

// ✅ Create State
exports.createState = async (req, res) => {
  try {
    const { name, countryId } = req.body;
    if (!name || !countryId)
      return res
        .status(400)
        .json({ message: "Name and countryId are required" });

    const country = await Location.findById(countryId);
    if (!country || country.type !== "country")
      return res.status(400).json({ message: "Invalid countryId" });

    const state = new Location({ name, type: "state", country: countryId });
    await state.save();
    console.log("Created state:", state);
    res.status(201).json(state);
  } catch (error) {
    console.error("Error creating state:", error);
    res.status(500).json({ message: "Error creating state", error });
  }
};

// ✅ Create City
exports.createCity = async (req, res) => {
  try {
    const { name, stateId } = req.body;
    if (!name || !stateId)
      return res.status(400).json({ message: "Name and stateId are required" });

    const state = await Location.findById(stateId);
    if (!state || state.type !== "state")
      return res.status(400).json({ message: "Invalid stateId" });

    const city = new Location({ name, type: "city", state: stateId });
    await city.save();
    console.log("Created city:", city);
    res.status(201).json(city);
  } catch (error) {
    console.error("Error creating city:", error);
    res.status(500).json({ message: "Error creating city", error });
  }
};

// ✅ Get All Countries
exports.getCountries = async (req, res) => {
  try {
    const countries = await Location.find({ type: "country" });
    console.log("Fetched countries:", countries);
    res.json(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ message: "Error fetching countries", error });
  }
};

// ✅ Get States by Country ID
exports.getStatesByCountry = async (req, res) => {
  try {
    const { countryId } = req.params;
    console.log("Fetching states for countryId:", countryId);

    const states = await Location.find({
      type: "state",
      country: countryId,
    });

    console.log("Found states:", states);
    res.status(200).json(states);
  } catch (error) {
    console.error("Error fetching states by country:", error);
    res
      .status(500)
      .json({ message: "Error fetching states by country", error });
  }
};

// ✅ Get Cities by State ID
exports.getCitiesByState = async (req, res) => {
  try {
    const { stateId } = req.params;
    console.log("Fetching cities for stateId:", stateId);

    const cities = await Location.find({
      type: "city",
      state: stateId,
    });

    console.log("Found cities:", cities);
    res.status(200).json(cities);
  } catch (error) {
    console.error("Error fetching cities by state:", error);
    res.status(500).json({ message: "Error fetching cities by state", error });
  }
};

// ✅ Delete Country
exports.deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;
    await Location.findByIdAndDelete(id);
    console.log("Deleted country with id:", id);
    res.json({ message: "Country deleted successfully" });
  } catch (error) {
    console.error("Error deleting country:", error);
    res.status(500).json({ message: "Error deleting country", error });
  }
};

// ✅ Delete State
exports.deleteState = async (req, res) => {
  try {
    const { id } = req.params;
    await Location.findByIdAndDelete(id);
    console.log("Deleted state with id:", id);
    res.json({ message: "State deleted successfully" });
  } catch (error) {
    console.error("Error deleting state:", error);
    res.status(500).json({ message: "Error deleting state", error });
  }
};

// ✅ Delete City
exports.deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    await Location.findByIdAndDelete(id);
    console.log("Deleted city with id:", id);
    res.json({ message: "City deleted successfully" });
  } catch (error) {
    console.error("Error deleting city:", error);
    res.status(500).json({ message: "Error deleting city", error });
  }
};
