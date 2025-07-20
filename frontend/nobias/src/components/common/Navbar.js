import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ type }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(
    type?.startsWith && type.startsWith("admin")
  );

  useEffect(() => {
    setIsAdmin(type?.startsWith && type.startsWith("admin"));
  }, [type]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const renderLinks = () => {
    if (isAdmin) {
      return (
        <>
          <Link
            to="/admin/dashboard"
            className={isActive("/admin/dashboard") ? "active" : ""}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/reports"
            className={isActive("/admin/reports") ? "active" : ""}
          >
            Reports
          </Link>
          <Link
            to="/admin/users"
            className={isActive("/admin/users") ? "active" : ""}
          >
            Users
          </Link>
          <Link
            to="/admin/discrimination-types"
            className={isActive("/admin/discrimination-types") ? "active" : ""}
          >
            Discrimination Types
          </Link>
          <Link
            to="/admin/discriminations"
            className={isActive("/admin/discriminations") ? "active" : ""}
          >
            Discriminations
          </Link>
          <Link
            to="/admin/gender-types"
            className={isActive("/admin/gender-types") ? "active" : ""}
          >
            Gender Types
          </Link>
          <Link
            to="/admin/countries"
            className={isActive("/admin/countries") ? "active" : ""}
          >
            Countries
          </Link>
          <Link
            to="/admin/states"
            className={isActive("/admin/states") ? "active" : ""}
          >
            States
          </Link>
          <Link
            to="/admin/cities"
            className={isActive("/admin/cities") ? "active" : ""}
          >
            Cities
          </Link>
          <Link
            to="/admin/report-approval"
            className={isActive("/admin/report-approval") ? "active" : ""}
          >
            Approvals
          </Link>
          <Link
            to="/admin/reports-table"
            className={isActive("/admin/reports-table") ? "active" : ""}
          >
            Reports Table
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      );
    } else {
      switch (type) {
        case "public":
          return (
            <>
              <Link to="/" className={isActive("/") ? "active" : ""}>
                Home
              </Link>
              <Link
                to="/view-reports"
                className={isActive("/view-reports") ? "active" : ""}
              >
                View Reports
              </Link>
              <Link to="/login" className={isActive("/login") ? "active" : ""}>
                Login
              </Link>
              <Link
                to="/register"
                className={isActive("/register") ? "active" : ""}
              >
                Register
              </Link>
            </>
          );
        case "login":
          return (
            <>
              <Link to="/" className={isActive("/") ? "active" : ""}>
                Home
              </Link>
              <Link
                to="/register"
                className={isActive("/register") ? "active" : ""}
              >
                Register
              </Link>
            </>
          );
        case "register":
          return (
            <>
              <Link to="/" className={isActive("/") ? "active" : ""}>
                Home
              </Link>
              <Link to="/login" className={isActive("/login") ? "active" : ""}>
                Login
              </Link>
            </>
          );
        case "profile":
          return (
            <>
              <Link to="/" className={isActive("/") ? "active" : ""}>
                Home
              </Link>
              <Link
                to="/user/report"
                className={isActive("/user/report") ? "active" : ""}
              >
                Report Discrimination
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          );
        case "report":
          return (
            <>
              <Link to="/" className={isActive("/") ? "active" : ""}>
                Home
              </Link>
              <Link
                to="/user/approvals"
                className={isActive("/user/approve-reports") ? "active" : ""}
              >
                Approve Reports
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          );
        default:
          return null;
      }
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to={isAdmin ? "/admin/dashboard" : "/"}>
            {isAdmin ? "NoBias Admin" : "NoBias"}
          </Link>
        </div>
        <div className="navbar-links">{renderLinks()}</div>
      </nav>

      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 30px;
          background: rgba(0,0,0,0.95);
          box-shadow: 0 2px 10px rgba(0,0,0,0.4);
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
          flex-wrap: wrap;
        }

        .navbar-brand a {
          font-size: 1.8rem;
          font-weight: bold;
          letter-spacing: 1px;
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-decoration: none;
        }

        .navbar-links {
          display: flex;
          gap: 20px;
          align-items: center;
          flex-wrap: wrap;
        }

        .navbar-links a, .navbar-links button {
          color: #fff;
          text-decoration: none;
          font-size: 1rem;
        }

        .navbar-links a:hover, .navbar-links button:hover {
          color: #ff4d97;
        }

        .navbar-links button {
          background: linear-gradient(45deg, #9d00ff, #ff4d97);
          border: none;
          border-radius: 20px;
          padding: 8px 20px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .navbar-links button:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 10px rgba(255, 77, 151, 0.4);
        }

        @media (max-width: 768px) {
          .navbar {
            flex-direction: column;
            align-items: flex-start;
          }
          .navbar-links {
            flex-direction: column;
            width: 100%;
          }
          .navbar-links a, .navbar-links button {
            width: 100%;
            text-align: left;
            padding: 8px 0;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
