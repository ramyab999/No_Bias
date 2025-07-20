import React, { useEffect, useState } from "react";
import reportService from "../../services/reportService";

const PublicReportsList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await reportService.getAllPublicReports();
        setReports(res.data);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="public-reports-page">
      <h2>Reported Discriminations</h2>

      {loading ? (
        <p className="loading">Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="no-reports">No reports available.</p>
      ) : (
        <div className="reports-list">
          {reports.map((report) => (
            <div key={report._id} className="report-card">
              <h3>{report.discriminationType}</h3>
              <p>{report.briefInfo}</p>
              <small>
                Reported from: {report.city}, {report.state}, {report.country}
              </small>
            </div>
          ))}
        </div>
      )}

      {/* CSS styles */}
      <style>{`
        .public-reports-page {
          background: #0f0f0f;
          min-height: 100vh;
          padding: 40px 20px;
          color: #fff;
        }

        .public-reports-page h2 {
          text-align: center;
          margin-bottom: 30px;
          font-size: 2rem;
          background: linear-gradient(to right, #ff4d97, #ff6f61, #ff9800);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .loading, .no-reports {
          text-align: center;
          color: #ccc;
        }

        .reports-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .report-card {
          background: #1c1c1c;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .report-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        }

        .report-card h3 {
          color: #ff4d97;
          margin-bottom: 10px;
        }

        .report-card p {
          margin-bottom: 8px;
        }

        .report-card small {
          color: #aaa;
        }

        @media(max-width: 768px) {
          .public-reports-page h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PublicReportsList;
