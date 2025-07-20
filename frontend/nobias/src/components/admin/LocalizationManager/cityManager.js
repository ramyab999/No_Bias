import React, { useEffect, useState } from "react";
import {
  getCountries,
  getStatesByCountry,
  getCitiesByState,
  createCity,
  deleteCity,
} from "../../../api/adminService";
import Navbar from "../../common/Navbar";

const CityManager = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [newCity, setNewCity] = useState("");

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      loadStates(selectedCountry);
      setSelectedState("");
      setCities([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      loadCities(selectedState);
    }
  }, [selectedState]);

  const loadCountries = async () => {
    const res = await getCountries();
    setCountries(res.data || []);
  };

  const loadStates = async (countryId) => {
    const res = await getStatesByCountry(countryId);
    setStates(res.data || []);
  };

  const loadCities = async (stateId) => {
    const res = await getCitiesByState(stateId);
    setCities(res.data || []);
  };

  const handleAddCity = async () => {
    if (!newCity.trim() || !selectedState) return;
    await createCity({ name: newCity.trim(), stateId: selectedState });
    setNewCity("");
    loadCities(selectedState);
  };

  const handleDelete = async (id) => {
    await deleteCity(id);
    loadCities(selectedState);
  };

  return (
    <>
      <Navbar type="adminLocations" />

      <div className="city-page">
        <div className="city-container">
          <h2>City Manager</h2>

          <div className="city-form">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              disabled={!selectedCountry}
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <input
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder="Enter city name"
              disabled={!selectedState}
            />
            <button
              onClick={handleAddCity}
              disabled={!selectedState || !newCity}
            >
              Add City
            </button>
          </div>

          <ul className="city-list">
            {cities.length === 0 ? (
              <li className="no-cities">No cities found.</li>
            ) : (
              cities.map((c) => (
                <li key={c._id}>
                  {c.name}
                  <button onClick={() => handleDelete(c._id)}>Delete</button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <style>{`
        .city-page {
          background: #0f0f0f;
          min-height: 100vh;
          padding: 80px 20px 40px;
          color: #fff;
        }

        .city-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .city-container h2 {
          text-align: center;
          margin-bottom: 30px;
          font-size: 2rem;
          background: linear-gradient(to right, #ff4d97, #ff9800);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .city-form {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 30px;
        }

        .city-form select,
        .city-form input {
          flex: 1;
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #333;
          font-size: 16px;
          background: #2b2b2b;
          color: #fff;
        }

        .city-form select:disabled,
        .city-form input:disabled {
          background: #444;
          cursor: not-allowed;
        }

        .city-form button {
          padding: 10px 20px;
          background: linear-gradient(to right, #ff4d97, #ff9800);
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          color: #fff;
          font-weight: 600;
        }

        .city-form button:disabled {
          background: #555;
          cursor: not-allowed;
        }

        .city-list {
          list-style: none;
          padding: 0;
        }

        .city-list li {
          background: #1e1e1e;
          margin-bottom: 10px;
          padding: 10px 15px;
          border-radius: 5px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .city-list li button {
          background: #ff4d97;
          border: none;
          color: #fff;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
        }

        .city-list li button:hover {
          opacity: 0.9;
        }

        .no-cities {
          text-align: center;
          color: #bbb;
        }

        @media(max-width: 600px) {
          .city-form {
            flex-direction: column;
          }

          .city-form button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default CityManager;
