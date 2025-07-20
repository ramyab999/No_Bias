import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ApprovedReports = () => {
  const [reports, setReports] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [types, setTypes] = useState([]);
  const [filters, setFilters] = useState({
    country: "",
    state: "",
    type: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const [countryRes, typeRes] = await Promise.all([
          axios.get(`${API_URL}/api/admin/locations/countries`, config),
          user?.role === "admin"
            ? axios.get(`${API_URL}/api/admin/discrimination-types`, config)
            : Promise.resolve({ data: [] }),
        ]);

        setCountries(countryRes.data || []);
        setTypes(typeRes.data || []);
      } catch (err) {
        console.error("Error loading filter data:", err);
        setError("Failed to load filters.");
      }
    };

    fetchFilters();
  }, [API_URL, token, user?.role]);

  useEffect(() => {
    const fetchStates = async () => {
      if (!filters.country) {
        setStates([]);
        return;
      }
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const res = await axios.get(
          `${API_URL}/api/locations/states/${filters.country}`,
          config
        );
        setStates(res.data || []);
      } catch (err) {
        console.error("Error fetching states:", err);
        setStates([]);
      }
    };

    fetchStates();
  }, [API_URL, token, filters.country]);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError("");

      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const params = {};
        if (filters.country) params.country = filters.country;
        if (filters.state) params.state = filters.state;
        if (filters.type) params.type = filters.type;

        const res = await axios.get(`${API_URL}/api/reports/approved`, {
          params,
          ...config,
        });

        setReports(Array.isArray(res.data.reports) ? res.data.reports : []);
      } catch (err) {
        console.error("Error fetching approved reports:", err);
        setError("Failed to fetch approved reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [API_URL, token, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "country" ? { state: "" } : {}),
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="approved-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">NoBias</div>
        <ul className="navbar-links">
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/view-reports" className="nav-link">
              View Reports
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="nav-link logout-btn">
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <div className="content">
        <h2>Approved Discrimination Reports</h2>

        {/* Filters */}
        <div className="filters">
          <select
            name="country"
            value={filters.country}
            onChange={handleFilterChange}
          >
            <option value="">All Countries</option>
            {countries.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
            disabled={!states.length}
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          {user?.role === "admin" && (
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              {types.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Content */}
        {loading && <p className="status">Loading...</p>}
        {error && <p className="status error">{error}</p>}

        {!loading && !error && (
          <>
            {reports.length === 0 ? (
              <p className="status">No approved reports available.</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Name</th>
                      <th>Country</th>
                      <th>State</th>
                      <th>City</th>
                      <th>Brief Info</th>
                      <th>Files</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report._id}>
                        <td>{report.discriminationId?.name || "N/A"}</td>
                        <td>{report.name || "Anonymous"}</td>
                        <td>{report.country?.name || "N/A"}</td>
                        <td>{report.state?.name || "N/A"}</td>
                        <td>{report.city?.name || "N/A"}</td>
                        <td>{report.info || "N/A"}</td>
                        <td>
                          {report.media?.length > 0
                            ? report.media.map((file, idx) => (
                                <a
                                  key={idx}
                                  href={`${API_URL}/uploads/${file}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  File {idx + 1}
                                </a>
                              ))
                            : "No files"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* CSS */}
      <style>{`
        .approved-page {
          background: #0e0e0e;
          min-height: 100vh;
          color: #fff;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 50px;
          background: rgba(0,0,0,0.85);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 100;
        }

        .navbar-brand {
          font-size: 1.8rem;
          font-weight: bold;
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .navbar-links {
          list-style: none;
          display: flex;
          gap: 25px;
          align-items: center;
        }

        .nav-link {
          color: #fff;
          text-decoration: none;
          font-size: 1.1rem;
          transition: color 0.3s ease;
          cursor: pointer;
          background: none;
          border: none;
        }

        .nav-link:hover {
          color: #ff4d97;
        }

        .logout-btn {
          font-family: inherit;
        }

        .content {
          padding-top: 120px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 120px 20px 40px;
        }

        .content h2 {
          text-align: center;
          margin-bottom: 20px;
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .filters {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .filters select {
          padding: 10px;
          border-radius: 5px;
          border: none;
          background: #333;
          color: #fff;
        }

        .status {
          text-align: center;
          margin-top: 20px;
        }

        .status.error {
          color: red;
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 800px;
          border-collapse: collapse;
          background: #1c1c1c;
          color: #fff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }

        th, td {
          padding: 12px 15px;
          text-align: center;
          border-bottom: 1px solid #333;
        }

        th {
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          color: #fff;
        }

        tr:hover {
          background: #333;
        }

        a {
          color: #4a90e2;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        @media(max-width: 600px){
          .navbar {
            flex-direction: column;
            align-items: flex-start;
            padding: 10px 20px;
          }

          .navbar-links {
            flex-direction: column;
            gap: 10px;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ApprovedReports;
