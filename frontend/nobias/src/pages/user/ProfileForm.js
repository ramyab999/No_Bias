import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";

const ProfileForm = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    mobile: "",
    country: "",
    state: "",
    city: "",
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchStates = useCallback(async (countryId, selectedStateId = null) => {
    const res = await axios.get(
      `http://localhost:5000/api/locations/states/${countryId}`
    );
    setStates(res.data || []);
    setCities([]);
    setProfile((prev) => ({
      ...prev,
      state: selectedStateId || "",
      city: "",
    }));
  }, []);

  const fetchCities = useCallback(async (stateId, selectedCityId = null) => {
    const res = await axios.get(
      `http://localhost:5000/api/locations/cities/${stateId}`
    );
    setCities(res.data || []);
    setProfile((prev) => ({
      ...prev,
      city: selectedCityId || "",
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));

    if (name === "country") {
      if (value) {
        fetchStates(value);
      } else {
        setStates([]);
        setCities([]);
        setProfile((prev) => ({ ...prev, state: "", city: "" }));
      }
    }

    if (name === "state") {
      if (value) {
        fetchCities(value);
      } else {
        setCities([]);
        setProfile((prev) => ({ ...prev, city: "" }));
      }
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [profileRes, countriesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users/profile", config),
          axios.get(
            "http://localhost:5000/api/admin/locations/countries",
            config
          ),
        ]);
        const data = profileRes.data;

        setProfile({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          gender: data.gender || "",
          mobile: data.mobile || "",
          country: data.country?._id || "",
          state: data.state?._id || "",
          city: data.city?._id || "",
        });

        setCountries(countriesRes.data || []);

        // ✅ Always fetch states if country exists
        if (data.country?._id) {
          await fetchStates(data.country._id, data.state?._id);
        }

        // ✅ Always fetch cities if state exists
        if (data.state?._id) {
          await fetchCities(data.state._id, data.city?._id);
        }

        setIsProfileComplete(
          data.firstName &&
            data.lastName &&
            data.gender &&
            data.mobile &&
            data.country &&
            data.state &&
            data.city
        );
      } catch (error) {
        alert("Session expired. Please login again.");
        navigate("/login");
      }
    };

    if (token) fetchProfile();
    else navigate("/login");
  }, [token, navigate, fetchStates, fetchCities]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:5000/api/users/profile", profile, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Profile updated successfully!");
      setIsProfileComplete(true);
      setEditMode(false);
      navigate("/user/report");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update profile.");
    }
  };

  const getNameById = (array, id) =>
    array.find((item) => item._id === id)?.name || "N/A";

  return (
    <>
      <Navbar type="profile" />
      <div className="profile-page">
        <div className="profile-container">
          {!editMode && isProfileComplete ? (
            <div className="profile-view">
              <h2>Profile Details</h2>
              <div className="profile-detail">
                <strong>Name:</strong> {profile.firstName} {profile.lastName}
              </div>
              <div className="profile-detail">
                <strong>Gender:</strong> {profile.gender}
              </div>
              <div className="profile-detail">
                <strong>Mobile:</strong> {profile.mobile}
              </div>
              <div className="profile-detail">
                <strong>Country:</strong>{" "}
                {getNameById(countries, profile.country)}
              </div>
              <div className="profile-detail">
                <strong>State:</strong> {getNameById(states, profile.state)}
              </div>
              <div className="profile-detail">
                <strong>City:</strong> {getNameById(cities, profile.city)}
              </div>
              <div className="profile-buttons">
                <button className="edit-btn" onClick={() => setEditMode(true)}>
                  Edit Profile
                </button>
                <button
                  className="continue-btn"
                  onClick={() => navigate("/user/report")}
                >
                  Continue to Report
                </button>
              </div>
            </div>
          ) : (
            <form className="profile-form" onSubmit={handleSubmit}>
              <h2>
                {isProfileComplete ? "Edit Profile" : "Complete Your Profile"}
              </h2>

              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={profile.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={profile.lastName}
                onChange={handleChange}
                required
              />

              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                value={profile.mobile}
                onChange={handleChange}
                required
              />

              <select
                name="country"
                value={profile.country}
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

              <select
                name="state"
                value={profile.state}
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

              <select
                name="city"
                value={profile.city}
                onChange={handleChange}
                required
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>

              <button type="submit">
                {isProfileComplete ? "Update Profile" : "Save Profile"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* CSS Styles */}
      <style>{`
        .profile-page {
          background: #0f0f0f;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
        }
        .profile-container {
          background: #1c1c1c;
          padding: 30px;
          border-radius: 10px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          color: #fff;
        }
        .profile-form h2, .profile-view h2 {
          text-align: center;
          margin-bottom: 20px;
          background: linear-gradient(to right, #ff4d97, #ff6f61, #ff9800);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .profile-form input, .profile-form select {
          margin-bottom: 15px;
          padding: 12px 15px;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          background: #333;
          color: #fff;
        }
        .profile-form button {
          padding: 12px;
          background: linear-gradient(to right, #ff4d97, #ff6f61, #ff9800);
          border: none;
          border-radius: 5px;
          color: #fff;
          font-weight: bold;
          cursor: pointer;
        }
        .profile-view .profile-detail {
          margin-bottom: 10px;
          font-size: 1.1rem;
        }
        .profile-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
        .edit-btn, .continue-btn {
          flex: 1;
          margin: 0 5px;
          padding: 10px;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
        }
        .edit-btn { background: #ff4d97; color: #fff; }
        .continue-btn { background: #28a745; color: #fff; }
      `}</style>
    </>
  );
};

export default ProfileForm;
