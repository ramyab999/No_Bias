import api from "./api";

export const submitReport = (formData, token) =>
  api.post("/api/reports", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

export const getUserReports = (userId) => api.get(`/reports/user/${userId}`);

export const getPublicReports = () => api.get("/public/reports");

const reportService = {
  submitReport,
  getUserReports,
  getPublicReports,
};

export default reportService;
