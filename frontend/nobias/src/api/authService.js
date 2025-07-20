import axios from "axios";
import { API_URL } from "./api";

// ✅ Send OTP
export const sendOTP = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/register`, data);
    return res.data;
  } catch (error) {
    console.error(
      "❌ sendOTP API error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ Verify OTP
export const verifyOTP = async ({ email, otp }) => {
  try {
    const res = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    return res.data;
  } catch (error) {
    console.error(
      "❌ verifyOTP API error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ Login User
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { email, password },
      { headers: { "Content-Type": "application/json" }, timeout: 10000 }
    );

    if (response.data && response.data.token && response.data.user) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log("🔑 Token saved in localStorage:", response.data.token);

      return {
        data: {
          token: response.data.token,
          user: response.data.user,
        },
      };
    }

    throw new Error("Invalid response structure from server");
  } catch (error) {
    console.error("❌ Login API Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};
