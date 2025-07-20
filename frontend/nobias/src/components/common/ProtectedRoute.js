import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setLoading } from "../../redux/actions/authActions";

const ProtectedRoute = ({ children, role }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const verifyAuth = () => {
      dispatch(setLoading(true));
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          dispatch(
            setUser({
              user: parsedUser,
              token,
            })
          );
        } catch (e) {
          console.error("Error parsing user data:", e);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      dispatch(setLoading(false));
    };

    verifyAuth();
  }, [dispatch, location.pathname]);

  if (loading) return <div className="loader">Loading...</div>;

  const hasValidToken = localStorage.getItem("token") && isAuthenticated;
  if (!hasValidToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Ensure profile is completed
  if (
    isAuthenticated &&
    user?.role?.toLowerCase() === "user" &&
    location.pathname !== "/complete-profile"
  ) {
    if (!user.profileCompleted) {
      return <Navigate to="/complete-profile" replace />;
    }
  }

  // ✅ Check for role mismatch
  if (role && user?.role?.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
