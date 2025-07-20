import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/common/Navbar";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReports: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [usersRes, reportsRes, pendingRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/total-users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/reports", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/reports/pending", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const totalUsers = usersRes.data.totalUsers;
        const totalReports = reportsRes.data.length;
        const pendingApprovals = pendingRes.data.length;

        console.log("✅ Total Users:", totalUsers);
        console.log("✅ Total Reports:", totalReports);
        console.log("✅ Pending Approvals:", pendingApprovals);

        setStats({ totalUsers, totalReports, pendingApprovals });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [token]);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar
        type="adminDashboard"
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <div className={`dashboard-container ${isMenuOpen ? "menu-open" : ""}`}>
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtext">Welcome to the Admin Panel.</p>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon">👥</div>
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="dashboard-card">
            <div className="card-icon">📝</div>
            <h3>Total Reports</h3>
            <p>{stats.totalReports}</p>
          </div>
          <div className="dashboard-card">
            <div className="card-icon">⏳</div>
            <h3>Pending Approvals</h3>
            <p>{stats.pendingApprovals}</p>
          </div>
        </div>
      </div>

      <style>{`
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          background: #0f0f0f;
        }

        * {
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #0f0f0f;
          color: #fff;
        }

        .dashboard-container {
          min-height: 100vh;
          padding: 120px 0 50px;
          color: #fff;
          text-align: center;
          transition: margin-left 0.3s ease;
          background: #0f0f0f;
        }

        .menu-open {
          margin-left: 250px;
        }

        .dashboard-title {
          font-size: 2.5rem;
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .dashboard-subtext {
          font-size: 1.2rem;
          color: #ccc;
          margin-bottom: 40px;
        }

        .dashboard-cards {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .dashboard-card {
          background: #1c1c1c;
          padding: 30px 20px;
          border-radius: 15px;
          width: 280px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
          border: 1px solid #333;
        }

        .dashboard-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.4);
          border-color: #ff4d97;
        }

        .card-icon {
          font-size: 2.5rem;
          margin-bottom: 15px;
        }

        .dashboard-card h3 {
          font-size: 1.3rem;
          margin-bottom: 10px;
          color: #fff;
        }

        .dashboard-card p {
          font-size: 2rem;
          font-weight: bold;
          color: #ff4d97;
          margin-top: 10px;
        }

        @media (max-width: 992px) {
          .dashboard-card {
            width: 220px;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 100px 0 40px;
          }

          .dashboard-cards {
            gap: 20px;
            padding: 0 10px;
          }

          .dashboard-card {
            width: 100%;
            max-width: 300px;
          }

          .menu-open {
            margin-left: 0;
          }
        }

        @media (max-width: 576px) {
          .dashboard-title {
            font-size: 2rem;
          }

          .dashboard-subtext {
            font-size: 1rem;
          }

          .dashboard-card {
            padding: 20px 15px;
          }

          .card-icon {
            font-size: 2rem;
          }

          .dashboard-card h3 {
            font-size: 1.1rem;
          }

          .dashboard-card p {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default Dashboard;
