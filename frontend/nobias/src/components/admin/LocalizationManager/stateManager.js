import React, { useEffect, useState } from "react";
import {
  getCountries,
  getStatesByCountry,
  createState,
  deleteState,
} from "../../../api/adminService";
import Navbar from "../../common/Navbar";

const StateManager = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const [newState, setNewState] = useState("");

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      loadStates(selectedCountry);
    } else {
      setStates([]);
    }
  }, [selectedCountry]);

  const loadCountries = async () => {
    const res = await getCountries();
    setCountries(res.data || []);
  };

  const loadStates = async (countryId) => {
    const res = await getStatesByCountry(countryId);
    setStates(res.data || []);
  };

  const handleAddState = async () => {
    if (!newState.trim() || !selectedCountry) return;
    await createState({ name: newState.trim(), countryId: selectedCountry });
    setNewState("");
    loadStates(selectedCountry);
  };

  const handleDelete = async (id) => {
    await deleteState(id);
    loadStates(selectedCountry);
  };

  return (
    <>
      <Navbar type="adminLocations" />

      <div className="state-page">
        <div className="state-container">
          <h2>State Manager</h2>

          <div className="state-form">
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

            <input
              value={newState}
              onChange={(e) => setNewState(e.target.value)}
              placeholder="Enter state name"
            />
            <button onClick={handleAddState}>Add State</button>
          </div>

          <ul className="state-list">
            {states.length === 0 ? (
              <li className="no-states">No states found for this country.</li>
            ) : (
              states.map((s, index) => (
                <li key={s._id}>
                  <span>
                    {index + 1}. {s.name}
                  </span>
                  <button onClick={() => handleDelete(s._id)}>Delete</button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <style>{`
        .state-page {
          background: #0f0f0f;
          min-height: 100vh;
          padding: 80px 20px 40px;
          color: #fff;
        }

        .state-container {
          max-width: 700px;
          margin: 0 auto;
        }

        .state-container h2 {
          text-align: center;
          margin-bottom: 30px;
          font-size: 2rem;
          background: linear-gradient(to right, #ff4d97, #ff9800);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .state-form {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .state-form select,
        .state-form input {
          flex: 1;
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #333;
          font-size: 16px;
          background: #2b2b2b;
          color: #fff;
        }

        .state-form select option {
          background: #2b2b2b;
          color: #fff;
        }

        .state-form input::placeholder {
          color: #bbb;
        }

        .state-form button {
          padding: 10px 20px;
          background: linear-gradient(to right, #ff4d97, #ff9800);
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          color: #fff;
          font-weight: 600;
        }

        .state-form button:hover {
          opacity: 0.9;
        }

        .state-list {
          list-style: none;
          padding: 0;
        }

        .state-list li {
          background: #1e1e1e;
          margin-bottom: 10px;
          padding: 10px 15px;
          border-radius: 5px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .state-list li button {
          background: #ff4d97;
          border: none;
          color: #fff;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
        }

        .state-list li button:hover {
          opacity: 0.9;
        }

        .no-states {
          text-align: center;
          color: #bbb;
        }

        @media(max-width: 600px) {
          .state-form {
            flex-direction: column;
          }

          .state-form button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default StateManager;
