import React, { useEffect, useState } from "react";
import {
  getCountries,
  createCountry,
  deleteCountry,
} from "../../../api/adminService";
import Navbar from "../../common/Navbar";

const CountryManager = () => {
  const [countries, setCountries] = useState([]);
  const [newCountry, setNewCountry] = useState("");

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    const res = await getCountries();
    setCountries(res.data || []);
  };

  const handleAddCountry = async () => {
    if (!newCountry.trim()) return;
    await createCountry({ name: newCountry.trim() });
    setNewCountry("");
    loadCountries();
  };

  const handleDelete = async (id) => {
    await deleteCountry(id);
    loadCountries();
  };

  return (
    <>
      <Navbar type="adminLocations" />

      <div className="country-page">
        <div className="country-container">
          <h2>Country Manager</h2>

          <div className="country-form">
            <input
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              placeholder="Enter country name"
            />
            <button onClick={handleAddCountry}>Add Country</button>
          </div>

          <ul className="country-list">
            {countries.length === 0 ? (
              <li className="no-countries">No countries found.</li>
            ) : (
              countries.map((country, index) => (
                <li key={country._id}>
                  <span>
                    {index + 1}. {country.name}
                  </span>
                  <button onClick={() => handleDelete(country._id)}>
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <style>{`
        .country-page {
          background: #0f0f0f;
          min-height: 100vh;
          padding: 80px 20px 40px;
          color: #fff;
        }

        .country-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .country-container h2 {
          text-align: center;
          margin-bottom: 30px;
          font-size: 2rem;
          background: linear-gradient(to right, #ff4d97, #ff9800);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .country-form {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
        }

        .country-form input {
          flex: 1;
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #333;
          font-size: 16px;
          background: #2b2b2b;
          color: #fff;
        }

        .country-form input::placeholder {
          color: #bbb;
        }

        .country-form button {
          padding: 10px 20px;
          background: linear-gradient(to right, #ff4d97, #ff9800);
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          color: #fff;
          font-weight: 600;
        }

        .country-form button:hover {
          opacity: 0.9;
        }

        .country-list {
          list-style: none;
          padding: 0;
        }

        .country-list li {
          background: #1e1e1e;
          margin-bottom: 10px;
          padding: 10px 15px;
          border-radius: 5px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .country-list li button {
          background: #ff4d97;
          border: none;
          color: #fff;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
        }

        .country-list li button:hover {
          opacity: 0.9;
        }

        .no-countries {
          text-align: center;
          color: #bbb;
        }

        @media(max-width: 600px) {
          .country-form {
            flex-direction: column;
          }

          .country-form button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default CountryManager;
