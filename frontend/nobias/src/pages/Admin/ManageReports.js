import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/common/Navbar";

const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/reports/${id}/approve`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReports(
        reports.map((r) => (r._id === id ? { ...r, status: "approved" } : r))
      );
    } catch (error) {
      console.error("Error approving report:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/reports/${id}/reject`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReports(
        reports.map((r) => (r._id === id ? { ...r, status: "rejected" } : r))
      );
    } catch (error) {
      console.error("Error rejecting report:", error);
    }
  };

  if (loading) {
    return <p>Loading reports...</p>;
  }

  return (
    <>
      <Navbar type="adminReports" />

      <div className="manage-reports-container">
        <h1 className="manage-reports-title">Manage Reports</h1>

        <div className="table-wrapper">
          <table className="manage-reports-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Type</th>
                <th>Location</th>
                <th>Info</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="6">No reports found.</td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report._id}>
                    <td>{report.user?.email || "-"}</td>
                    <td>{report.discriminationId?.name || "-"}</td>
                    <td>
                      {[
                        report.city?.name,
                        report.state?.name,
                        report.country?.name,
                      ]
                        .filter(Boolean)
                        .join(", ") || "-"}
                    </td>
                    <td>{report.info || "-"}</td>
                    <td>{report.status}</td>
                    <td>
                      {report.status !== "approved" && (
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(report._id)}
                        >
                          Approve
                        </button>
                      )}
                      {report.status !== "rejected" && (
                        <button
                          className="btn-reject"
                          onClick={() => handleReject(report._id)}
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSS Styles */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .manage-reports-container {
          background: #0f0f0f;
          min-height: 100vh;
          padding: 100px 30px 50px 30px;
          color: #fff;
        }

        .manage-reports-title {
          text-align: center;
          margin-bottom: 40px;
          font-size: 2.5rem;
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: bold;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .manage-reports-table {
          width: 100%;
          border-collapse: collapse;
          background: #1c1c1c;
          border-radius: 10px;
          overflow: hidden;
        }

        .manage-reports-table th,
        .manage-reports-table td {
          padding: 12px 15px;
          text-align: left;
        }

        .manage-reports-table th {
          background: #292929;
          color: #ff4d97;
        }

        .manage-reports-table tr:nth-child(even) {
          background: #2a2a2a;
        }

        .manage-reports-table tr:hover {
          background: #333;
        }

        .btn-approve,
        .btn-reject {
          padding: 8px 12px;
          border: none;
          border-radius: 5px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.3s ease;
          margin-right: 5px;
        }

        .btn-approve {
          background: #28a745;
          color: #fff;
        }

        .btn-reject {
          background: #dc3545;
          color: #fff;
        }

        .btn-approve:hover,
        .btn-reject:hover {
          opacity: 0.85;
        }

        @media(max-width: 768px) {
          .manage-reports-title {
            font-size: 2rem;
          }

          .manage-reports-table th,
          .manage-reports-table td {
            padding: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default ManageReports;
