import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/common/Navbar";
import reportService from "../../api/reportService";

const ReportForm = () => {
  const navigate = useNavigate();
  const { reportId } = useParams();

  const [formData, setFormData] = useState({
    discriminationTypeId: "",
    discriminationId: "",
    name: "",
    countryId: "",
    stateId: "",
    cityId: "",
    info: "",
    media: null,
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [discriminationTypes, setDiscriminationTypes] = useState([]);
  const [discriminations, setDiscriminations] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in. Please login to continue.");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const [typeRes, countryRes] = await Promise.all([
          axios.get("http://localhost:5000/api/discrimination-types", config),
          axios.get("http://localhost:5000/api/locations/countries", config),
        ]);

        setDiscriminationTypes(typeRes.data);
        setCountries(countryRes.data);

        if (reportId) {
          const reportRes = await axios.get(
            `http://localhost:5000/api/reports/${reportId}`,
            config
          );
          const data = reportRes.data.report || reportRes.data;

          setFormData({
            discriminationTypeId: data.discriminationTypeId?._id || "",
            discriminationId: data.discriminationId?._id || "",
            name: data.name || "",
            countryId: data.country?._id || "",
            stateId: data.state?._id || "",
            cityId: data.city?._id || "",
            info: data.info || "",
            media: null,
          });

          if (data.discriminationTypeId?._id) {
            await fetchDiscriminations(data.discriminationTypeId._id, token);
          }
        }
      } catch (err) {
        console.error("❌ Error fetching initial data:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load initial data. Please refresh or login again."
        );
      }
    };

    fetchInitialData();
  }, [reportId]);

  const fetchDiscriminations = async (typeId, token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(
        `http://localhost:5000/api/admin/discriminations/by-type/${typeId}`,
        config
      );
      setDiscriminations(res.data);
    } catch (err) {
      console.error("❌ Error fetching discriminations:", err);
      setDiscriminations([]);
    }
  };

  useEffect(() => {
    const fetchStates = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (formData.countryId) {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/locations/states/${formData.countryId}`,
            config
          );
          setStates(res.data);
        } catch (err) {
          console.error("❌ Error fetching states:", err);
          setStates([]);
        }
      } else {
        setStates([]);
      }

      setFormData((prev) => ({ ...prev, stateId: "", cityId: "" }));
      setCities([]);
    };

    fetchStates();
  }, [formData.countryId]);

  useEffect(() => {
    const fetchCities = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (formData.stateId) {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/locations/cities/${formData.stateId}`,
            config
          );
          setCities(res.data);
        } catch (err) {
          console.error("❌ Error fetching cities:", err);
        }
      } else {
        setCities([]);
      }

      setFormData((prev) => ({ ...prev, cityId: "" }));
    };

    fetchCities();
  }, [formData.stateId]);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "discriminationTypeId") {
      const token = localStorage.getItem("token");
      setFormData((prev) => ({
        ...prev,
        discriminationTypeId: value,
        discriminationId: "",
      }));
      if (value) {
        await fetchDiscriminations(value, token);
      } else {
        setDiscriminations([]);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in. Please login to submit a report.");
      return;
    }

    try {
      const data = new FormData();
      data.append("discriminationTypeId", formData.discriminationTypeId);
      data.append("discriminationId", formData.discriminationId);
      data.append("name", formData.name);
      data.append("country", formData.countryId);
      data.append("state", formData.stateId);
      data.append("city", formData.cityId);
      data.append("info", formData.info);
      if (formData.media) data.append("media", formData.media);
      await reportService.submitReport(data, token);

      setSuccessMessage("Report submitted successfully!");
      setTimeout(() => navigate("/approved-reports"), 1500);
    } catch (err) {
      console.error("❌ Error submitting report:", err);
      setError(
        err.response?.data?.message ||
          "Failed to submit report. Please login again or check your input."
      );
    }
  };

  return (
    <>
      <Navbar type="report" />

      <div className="report-page">
        <div className="report-container">
          <h2>{reportId ? "Edit Report" : "Add New Report"}</h2>
          <form className="report-form" onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}
            {successMessage && (
              <div className="form-success">{successMessage}</div>
            )}

            <label>Discrimination Type</label>
            <select
              name="discriminationTypeId"
              value={formData.discriminationTypeId}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              {discriminationTypes.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>

            <label>Discrimination</label>
            <select
              name="discriminationId"
              value={formData.discriminationId}
              onChange={handleChange}
              required
            >
              <option value="">Select Discrimination</option>
              {discriminations.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>

            <label>Discriminated By (Name)</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Country</label>
            <select
              name="countryId"
              value={formData.countryId}
              onChange={handleChange}
              required
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <label>State</label>
            <select
              name="stateId"
              value={formData.stateId}
              onChange={handleChange}
              required
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <label>City</label>
            <select
              name="cityId"
              value={formData.cityId}
              onChange={handleChange}
              required
            >
              <option value="">Select City</option>
              {cities.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <label>Brief Info</label>
            <textarea
              name="info"
              value={formData.info}
              onChange={handleChange}
              required
            />

            <label>Upload Files (Images, Videos, Audio)</label>
            <input type="file" name="media" onChange={handleChange} />

            <button type="submit">
              {reportId ? "Update Report" : "Submit Report"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .report-page {
          background: #0f0f0f;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 50px 20px;
        }
        .report-form {
          background: #1c1c1c;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
        }
        .report-form h2 {
          text-align: center;
          margin-bottom: 20px;
          font-size: 2rem;
          background: linear-gradient(to right, #ff4d97, #ff6f61, #ff9800);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .report-form label {
          margin-bottom: 5px;
          color: #ddd;
          font-weight: 500;
        }
        .report-form input,
        .report-form select,
        .report-form textarea {
          margin-bottom: 15px;
          padding: 10px 12px;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          background: #333;
          color: #fff;
        }
        .report-form input:focus,
        .report-form select:focus,
        .report-form textarea:focus {
          outline: none;
          border: 2px solid #ff4d97;
        }
        .report-form textarea {
          resize: vertical;
          min-height: 80px;
        }
        .report-form button {
          padding: 12px;
          background: linear-gradient(to right, #ff4d97, #ff6f61, #ff9800);
          border: none;
          border-radius: 5px;
          color: #fff;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }
        .report-form button:hover {
          opacity: 0.9;
        }
        .form-error {
          color: red;
          margin-bottom: 10px;
          text-align: center;
        }
        .form-success {
          color: #4caf50;
          margin-bottom: 10px;
          text-align: center;
        }
        @media(max-width: 600px) {
          .report-form {
            padding: 20px;
          }
          .report-form h2 {
            font-size: 1.7rem;
          }
        }
      `}</style>
    </>
  );
};

export default ReportForm;
