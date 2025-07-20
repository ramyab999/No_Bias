import React, { useEffect, useState } from "react";
import {
  getPendingReports,
  approveReport,
  rejectReport,
} from "../../api/adminService";
import Navbar from "../common/Navbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const ReportApprovalPanel = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPendingReports();
      if (Array.isArray(data)) {
        setReports(data);
      } else {
        console.warn("Pending reports data is not an array", data);
        setReports([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch reports");
    }
    setLoading(false);
  };

  const handleAction = async (id, action) => {
    setLoading(true);
    setError("");
    try {
      if (action === "approve") {
        await approveReport(id);
        console.log(`Report ${id} approved`);
      } else {
        await rejectReport(id);
        console.log(`Report ${id} rejected`);
      }
      await fetchReports();
    } catch (err) {
      console.error(`Failed to ${action} report:`, err);
      setError(`Failed to ${action} report.`);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <>
      <Navbar type="adminReports" />

      <div className="approval-page">
        <h3>Pending Reports</h3>

        {loading && <p className="info-text">Loading reports...</p>}
        {error && <p className="error-text">{error}</p>}

        {reports.length > 0 ? (
          <ul className="report-list">
            {reports.map((report, index) => (
              <li key={report._id} className="report-item">
                <div className="report-header">
                  <span className="report-index">#{index + 1}</span>
                  <strong className="report-info">{report.info}</strong>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={() => handleAction(report._id, "approve")}
                    className="approve-btn"
                  >
                    <CheckCircleIcon style={{ marginRight: "5px" }} /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(report._id, "reject")}
                    className="reject-btn"
                  >
                    <CancelIcon style={{ marginRight: "5px" }} /> Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p className="info-text">No pending reports found.</p>
        )}
      </div>

      <style>{`
        .approval-page {
          background: #0f0f0f;
          min-height: 100vh;
          padding: 80px 20px 40px;
          color: #fff;
        }

        .approval-page h3 {
          text-align: center;
          margin-bottom: 30px;
          font-size: 2rem;
          background: linear-gradient(to right, #ff4d97, #ff6f61, #ff9800);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .info-text {
          text-align: center;
          color: #ccc;
        }

        .error-text {
          text-align: center;
          color: red;
        }

        .report-list {
          list-style: none;
          padding: 0;
          max-width: 800px;
          margin: 0 auto;
        }

        .report-item {
          background: #1e1e1e;
          padding: 15px 20px;
          margin-bottom: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .report-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .report-index {
          font-weight: bold;
          color: #ff4d97;
        }

        .report-info {
          flex: 1;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          flex-wrap: wrap;
        }

        .approve-btn, .reject-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
        }

        .approve-btn {
          background: #4caf50;
          color: white;
        }

        .reject-btn {
          background: #f44336;
          color: white;
        }

        .approve-btn:hover {
          background: #45a049;
        }

        .reject-btn:hover {
          background: #e53935;
        }

        @media(max-width: 600px) {
          .approval-page h3 {
            font-size: 1.5rem;
          }

          .action-buttons {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </>
  );
};

export default ReportApprovalPanel;
