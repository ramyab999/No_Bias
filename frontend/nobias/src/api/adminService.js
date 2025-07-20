import api from "./api";

/**
 * ===========================
 * Discrimination Types
 * ===========================
 */

export const getDiscriminationTypes = () =>
  api.get("/api/discrimination-types");

export const createDiscriminationType = (data) =>
  api.post("/api/discrimination-types", data);

export const updateDiscriminationType = (id, data) =>
  api.put(`/api/discrimination-types/${id}`, data);

export const deleteDiscriminationType = (id) =>
  api.delete(`/api/discrimination-types/${id}`);

/**
 * ===========================
 * Discriminations
 * ===========================
 */

export const getDiscriminations = () => api.get("/api/admin/discriminations");

export const createDiscrimination = (data) =>
  api.post("/api/admin/discriminations", data);

export const deleteDiscrimination = (id) =>
  api.delete(`/api/admin/discriminations/${id}`);

/**
 * ===========================
 * Localization
 * ===========================
 */

export const getCountries = () => api.get("/api/locations/countries");

export const createCountry = (data) =>
  api.post("/api/locations/countries", data);

export const deleteCountry = (id) =>
  api.delete(`/api/locations/countries/${id}`);

export const getStatesByCountry = (countryId) =>
  api.get(`/api/locations/states/${countryId}`);

export const createState = (data) => api.post("/api/locations/states", data);

export const deleteState = (id) => api.delete(`/api/locations/states/${id}`);

export const getCitiesByState = (stateId) =>
  api.get(`/api/locations/cities/${stateId}`);

export const createCity = (data) => api.post("/api/locations/cities", data);

export const deleteCity = (id) => api.delete(`/api/locations/cities/${id}`);

/**
 * ===========================
 * Gender Types
 * ===========================
 */

export const getGenderTypes = () => api.get("/api/admin/gender-types");

export const createGenderType = (data) =>
  api.post("/api/admin/gender-types", data);

export const updateGenderType = (id, data) =>
  api.put(`/api/admin/gender-types/${id}`, data);

export const deleteGenderType = (id) =>
  api.delete(`/api/admin/gender-types/${id}`);

/**
 * ===========================
 * Reports
 * ===========================
 */

export const getAllReports = (filters = {}) =>
  api.get("/api/admin/reports", { params: filters });

export const getPendingReports = async () => {
  const res = await api.get("/api/admin/reports/pending");
  return res.data; // only the array
};

export const approveReport = (id) =>
  api.put(`/api/admin/reports/${id}/approve`);

export const rejectReport = (id) => api.put(`/api/admin/reports/${id}/reject`);

/**
 * ===========================
 * Users
 * ===========================
 */

export const getTotalUsers = () => api.get("/api/admin/total-users");

export const getAllUsers = () => api.get("/api/admin/users");
