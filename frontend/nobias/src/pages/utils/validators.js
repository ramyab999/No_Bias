export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  // Minimum 6 characters, at least one letter and one number
  const regex = /^(?=.[A-Za-z])(?=.\d)[A-Za-z\d]{6,}$/;
  return regex.test(password);
};

export const validatePhoneNumber = (phone) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone);
};

export const isRequired = (value) =>
  value !== null && value !== undefined && value !== "";
