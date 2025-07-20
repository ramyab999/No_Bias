import { SET_PROFILE, SET_LOADING, SET_ERROR } from "../types";

import { updateUserProfile } from "../../api/user";

export const setUser = (payload) => ({
  type: SET_PROFILE,
  payload: {
    user: payload.user,
    token: payload.token,
  },
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

export const setError = (message) => ({
  type: SET_ERROR,
  payload: message,
});

export const clearError = () => ({
  type: SET_ERROR,
  payload: null,
});

export const updateProfile = (profileData) => async (dispatch) => {
  try {
    dispatch(clearError());
    dispatch(setLoading(true));

    const response = await updateUserProfile(profileData);

    if (!response.data) {
      throw new Error("No data received from server");
    }

    const token = response.data.token || localStorage.getItem("token");

    // Save token to localStorage if it's new
    if (response.data.token) {
      localStorage.setItem("token", token);
    }

    dispatch(
      setUser({
        user: {
          ...response.data.user,
          profileCompleted: true,
        },
        token,
      })
    );

    return {
      success: true,
      user: response.data.user,
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Profile update failed";
    const errorDetails = error.response?.data?.errors || {};

    console.error("Update error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    dispatch(setError(errorMessage));

    return {
      success: false,
      error: errorMessage,
      errors: errorDetails,
    };
  } finally {
    dispatch(setLoading(false));
  }
};
