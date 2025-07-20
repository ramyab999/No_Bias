import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/common/Navbar";
import "react-toastify/dist/ReactToastify.css";

// ✅ Public pages
import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ViewReports from "./pages/public/ViewReports";

// ✅ User pages
import ProfileForm from "./pages/user/ProfileForm";
import ReportForm from "./pages/user/ReportForm";
import ApprovedReports from "./pages/public/ApprovedReports";

// ✅ Admin pages
import Dashboard from "./pages/Admin/Dashboard";
import ManageReports from "./pages/Admin/ManageReports";
import AdminUserManager from "./pages/Admin/AdminUserManager";
import DiscriminationTypes from "./components/admin/DiscrimanationTypeManager";
import DiscriminationManager from "./components/admin/DiscriminationManger";
import GenderTypes from "./components/admin/GenderTypeManager";
import ReportApprovalPanel from "./components/admin/ReportAppprovalPanel";
import ReportsTableWithFilters from "./components/admin/ReportTableWithFilters";

// ✅ Location management components
import CountryManager from "./components/admin/LocalizationManager/countryManager";
import StateManager from "./components/admin/LocalizationManager/stateManager";
import CityManager from "./components/admin/LocalizationManager/cityManager";

// ✅ Common components
import ProtectedRoute from "./components/common/ProtectedRoute";

const AppContent = () => {
  const location = useLocation();
  const path = location.pathname;
  let navbarType = null;

  if (path.startsWith("/admin")) {
    navbarType = null;
  } else if (path.startsWith("/user") || path === "/complete-profile") {
    navbarType = "profile";
  } else if (
    path !== "/login" &&
    path !== "/register" &&
    path !== "/verify-otp"
  ) {
    navbarType = "public";
  }

  return (
    <>
      {/* ✅ Global Navbar (only for public/user, not admin) */}
      {navbarType && <Navbar type={navbarType} />}

      <div className="main-content">
        <Routes>
          {/* ✅ Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/view-reports" element={<ViewReports />} />

          {/* ✅ User routes */}
          <Route
            path="/complete-profile"
            element={
              <ProtectedRoute role="User">
                <ProfileForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute role="User">
                <ProfileForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/report"
            element={
              <ProtectedRoute role="User">
                <ReportForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/report/:reportId/edit"
            element={
              <ProtectedRoute role="User">
                <ReportForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approved-reports"
            element={
              <ProtectedRoute role="User">
                <ApprovedReports />
              </ProtectedRoute>
            }
          />

          {/* ✅ Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="Admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute role="Admin">
                <ManageReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="Admin">
                <AdminUserManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/discrimination-types"
            element={
              <ProtectedRoute role="Admin">
                <DiscriminationTypes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/discriminations"
            element={
              <ProtectedRoute role="Admin">
                <DiscriminationManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gender-types"
            element={
              <ProtectedRoute role="Admin">
                <GenderTypes />
              </ProtectedRoute>
            }
          />

          {/* ✅ Location management routes */}
          <Route
            path="/admin/countries"
            element={
              <ProtectedRoute role="Admin">
                <CountryManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/states"
            element={
              <ProtectedRoute role="Admin">
                <StateManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cities"
            element={
              <ProtectedRoute role="Admin">
                <CityManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/report-approval"
            element={
              <ProtectedRoute role="Admin">
                <ReportApprovalPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports-table"
            element={
              <ProtectedRoute role="Admin">
                <ReportsTableWithFilters />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
