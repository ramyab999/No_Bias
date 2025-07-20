export const capitalize = (str) =>
  typeof str === "string"
    ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    : "";

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .join("");
};
