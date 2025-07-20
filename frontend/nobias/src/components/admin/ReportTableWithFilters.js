import React, { useEffect, useState } from "react";
import {
  getAllReports,
  getCountries,
  getStatesByCountry,
  getCitiesByState,
  getDiscriminationTypes,
} from "../../api/adminService";
import Navbar from "../common/Navbar";

const ReportsTableWithFilters = () => {
  const [filters, setFilters] = useState({
    country: "",
    state: "",
    city: "",
    discriminationType: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [discriminationTypes, setDiscriminationTypes] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch dropdown data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [countriesData, typesData] = await Promise.all([
          getCountries(),
          getDiscriminationTypes(),
        ]);

        setCountries(countriesData.data || []);
        setDiscriminationTypes(typesData.data || []);
      } catch (err) {
        console.error("❌ Error fetching initial data:", err);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (filters.country) {
        try {
          const data = await getStatesByCountry(filters.country);
          setStates(data.data || []);
        } catch (err) {
          console.error("❌ Error fetching states:", err);
        }
      } else {
        setStates([]);
        setFilters((prev) => ({ ...prev, state: "", city: "" }));
      }
    };

    fetchStates();
  }, [filters.country]);

  // Fetch cities when state changes
  useEffect(() => {
    const fetchCities = async () => {
      if (filters.state) {
        try {
          const data = await getCitiesByState(filters.state);
          setCities(data.data || []);
        } catch (err) {
          console.error("❌ Error fetching cities:", err);
        }
      } else {
        setCities([]);
        setFilters((prev) => ({ ...prev, city: "" }));
      }
    };

    fetchCities();
  }, [filters.state]);

  // Fetch reports when filters change
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getAllReports(filters);
        console.log("✅ All reports fetched:", data);

        if (Array.isArray(data)) {
          setReports(data);
        } else if (data && Array.isArray(data.data)) {
          setReports(data.data);
        } else {
          console.warn("⚠️ Unexpected reports data format:", data);
          setReports([]);
        }
      } catch (err) {
        console.error("❌ Error fetching reports:", err);
        setError("Failed to load reports");
      }

      setLoading(false);
    };

    fetchReports();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "country" && { state: "", city: "" }),
      ...(name === "state" && { city: "" }),
    }));
  };

  return (
    <>
      <Navbar type="adminReports" />

      <div className="reports-page">
        <h3>All Reports with Filters</h3>

        <div className="filters-container">
          <select
            name="country"
            value={filters.country}
            onChange={handleFilterChange}
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c._id} value={c._id} style={{ color: "#000" }}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
            disabled={!filters.country}
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s._id} value={s._id} style={{ color: "#000" }}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            disabled={!filters.state}
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c._id} value={c._id} style={{ color: "#000" }}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            name="discriminationType"
            value={filters.discriminationType}
            onChange={handleFilterChange}
          >
            <option value="">Select Discrimination Type</option>
            {discriminationTypes.map((d) => (
              <option key={d._id} value={d._id} style={{ color: "#000" }}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="info-text">Loading reports...</p>}
        {error && <p className="error-text">{error}</p>}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Discrimination</th>
                <th>Country</th>
                <th>State</th>
                <th>City</th>
                <th>Reported By</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0
                ? reports.map((r) => (
                    <tr key={r._id}>
                      <td style={{ color: "#fff" }}>
                        {r.discriminationId?.name || "N/A"}
                      </td>
                      <td style={{ color: "#fff" }}>
                        {r.country?.name || "N/A"}
                      </td>
                      <td style={{ color: "#fff" }}>
                        {r.state?.name || "N/A"}
                      </td>
                      <td style={{ color: "#fff" }}>{r.city?.name || "N/A"}</td>
                      <td style={{ color: "#fff" }}>
                        {r.user
                          ? `${r.user.firstName || ""} ${r.user.lastName || ""}`
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td colSpan="5" className="info-text">
                        No reports found.
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .reports-page {
          background: #0f0f0f;
          min-height: 100vh;
          padding: 100px 20px 40px;
          color: #fff;
        }

        .reports-page h3 {
          text-align: center;
          margin-bottom: 30px;
          font-size: 2rem;
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .filters-container {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          justify-content: center;
          margin-bottom: 30px;
        }

        .filters-container select {
          background: #2b2b2b;
          color: #fff;
          border: 1px solid #444;
          border-radius: 5px;
          padding: 8px 12px;
          min-width: 150px;
        }

        .info-text {
          text-align: center;
          color: #ccc;
        }

        .error-text {
          text-align: center;
          color: red;
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: #2b2b2b;
          border-radius: 8px;
          overflow: hidden;
        }

        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #333;
          color: #fff;
        }

        th {
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          color: #fff;
        }

        tr:hover {
          background: #3a3a3a;
        }

        @media(max-width: 768px) {
          .reports-page h3 {
            font-size: 1.5rem;
          }

          .filters-container {
            flex-direction: column;
            align-items: center;
          }

          th, td {
            padding: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default ReportsTableWithFilters;
