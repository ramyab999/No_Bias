// Helper function to format the date in a readable format
const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
};

// Helper function to check if a value is empty
const isEmpty = (value) => {
  return value === null || value === undefined || value === "";
};

// Helper function to generate a random string for token
const generateToken = () => {
  return Math.random().toString(36).substring(2, 15); // Generates a random alphanumeric string
};

module.exports = { formatDate, isEmpty, generateToken };
