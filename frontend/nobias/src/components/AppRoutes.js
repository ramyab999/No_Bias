import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import VerifyOTPPage from "../pages/VerifyOTPPage";
import AdminPage from "../pages/AdminPage";
import UserPage from "../pages/UserPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/verify-otp" element={<VerifyOTPPage />} />
    <Route path="/admin" element={<AdminPage />} />
    <Route path="/user" element={<UserPage />} />
  </Routes>
);

export default AppRoutes;
