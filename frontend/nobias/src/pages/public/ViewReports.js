import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${API_URL}/api/reports/approved`);
        setReports(response.data.reports || response.data);
      } catch (err) {
        console.error("Failed to fetch approved reports:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to load reports"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [API_URL]);

  return (
    <div className="report-container">
      <h2 className="report-title">Public Discrimination Reports</h2>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && reports.length === 0 && (
        <p className="no-reports">No approved reports available.</p>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Reporter</th>
                <th>Location</th>
                <th>Info</th>
                <th>Media</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td>{report.discriminationId?.name || "N/A"}</td>
                  <td>{report.name || "Anonymous"}</td>
                  <td>
                    {[
                      report.city?.name,
                      report.state?.name,
                      report.country?.name,
                    ]
                      .filter(Boolean)
                      .join(", ") || "N/A"}
                  </td>
                  <td>{report.info || "No information provided"}</td>
                  <td>
                    {report.media?.length > 0
                      ? report.media.map((file, idx) => (
                          <div key={idx}>
                            <a
                              href={`${API_URL}/uploads/${file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View File {idx + 1}
                            </a>
                          </div>
                        ))
                      : "No files"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CSS Styles */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .report-container {
          padding: 100px 30px 50px 30px;
          background: #0f0f0f;
          color: #fff;
          min-height: 100vh;
        }

        .report-title {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 40px;
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: bold;
        }

        .loading-text, .error-text, .no-reports {
          text-align: center;
          font-size: 1.2rem;
          margin-top: 20px;
        }

        .error-text {
          color: #ff4d97;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .report-table {
          width: 100%;
          border-collapse: collapse;
          margin: 0 auto;
        }

        .report-table th, .report-table td {
          border: 1px solid #444;
          padding: 12px 15px;
          text-align: left;
        }

        .report-table th {
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          color: #fff;
        }

        .report-table tr:nth-child(even) {
          background: #1c1c1c;
        }

        .report-table tr:nth-child(odd) {
          background: #2a2a2a;
        }

        .report-table a {
          color: #ff4d97;
          text-decoration: none;
          font-weight: 600;
        }

        .report-table a:hover {
          text-decoration: underline;
        }

        @media(max-width: 768px) {
          .report-title {
            font-size: 2rem;
          }

          .report-table th, .report-table td {
            font-size: 0.9rem;
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewReports;
