import api from "./api";
export const updateUserProfile = (data) => api.put("/users/profile", data);
