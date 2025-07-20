import axios from "axios";

// Update user profile
export const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios.put("/api/users/profile", profileData, config);
};
