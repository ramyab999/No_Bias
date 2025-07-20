import React, { useEffect, useState } from "react";
import {
  getDiscriminations,
  createDiscrimination,
  getDiscriminationTypes,
} from "../../api/adminService";
import Navbar from "../../components/common/Navbar";

const DiscriminationManager = () => {
  const [discriminations, setDiscriminations] = useState([]);
  const [types, setTypes] = useState([]);
  const [newDiscrimination, setNewDiscrimination] = useState({
    name: "",
    type: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchTypes = async () => {
    try {
      const res = await getDiscriminationTypes();
      setTypes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching types:", error);
      setTypes([]);
    }
  };

  const fetchDiscriminations = async () => {
    try {
      const res = await getDiscriminations();
      setDiscriminations(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching discriminations:", error);
      setDiscriminations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, type } = newDiscrimination;

    if (name.trim() && type) {
      try {
        await createDiscrimination({ name: name.trim(), type });
        setNewDiscrimination({ name: "", type: "" });
        fetchDiscriminations();
      } catch (error) {
        console.error("Error creating discrimination:", error);
        alert("Failed to create discrimination. Check console for details.");
      }
    } else {
      alert("Please enter name and select type.");
    }
  };

  useEffect(() => {
    fetchTypes();
    fetchDiscriminations();
  }, []);

  return (
    <>
      <Navbar type="adminDiscriminations" />

      <div className="discrimination-page">
        <div className="content-wrapper">
          <h2>Manage Discriminations</h2>

          <form onSubmit={handleSubmit} className="form-add-discrimination">
            <input
              value={newDiscrimination.name}
              onChange={(e) =>
                setNewDiscrimination({
                  ...newDiscrimination,
                  name: e.target.value,
                })
              }
              placeholder="Enter discrimination name"
              required
            />

            <select
              value={newDiscrimination.type}
              onChange={(e) =>
                setNewDiscrimination({
                  ...newDiscrimination,
                  type: e.target.value,
                })
              }
              required
            >
              <option value="">Select type</option>
              {types.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>

            <button type="submit">Add</button>
          </form>

          {loading ? (
            <p className="status">Loading discriminations...</p>
          ) : discriminations.length === 0 ? (
            <p className="status">No discriminations found.</p>
          ) : (
            <div className="table-container">
              <table className="discrimination-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Discrimination Name</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {discriminations.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.type?.name || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        * {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
            Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          box-sizing: border-box;
        }

        .discrimination-page {
          background: #0f0f0f;
          min-height: 100vh;
          padding: 80px 20px 40px;
          color: #fff;
        }

        .content-wrapper {
          max-width: 800px;
          margin: 0 auto;
          background: #1a1a1a;
          padding: 30px 25px;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .content-wrapper h2 {
          text-align: center;
          font-size: 1.8rem;
          margin-bottom: 30px;
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .form-add-discrimination {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 30px;
          justify-content: center;
        }

        .form-add-discrimination input,
        .form-add-discrimination select {
          padding: 10px;
          border-radius: 5px;
          border: none;
          font-size: 16px;
          background: #2b2b2b;
          color: #fff;
          width: 220px;
        }

        .form-add-discrimination select {
          appearance: none;
        }

        .form-add-discrimination input::placeholder {
          color: #bbb;
        }

        .form-add-discrimination button {
          padding: 10px 20px;
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          color: #fff;
          font-weight: 500;
          transition: opacity 0.3s;
        }

        .form-add-discrimination button:hover {
          opacity: 0.9;
        }

        .status {
          text-align: center;
          color: #ccc;
        }

        .table-container {
          overflow-x: auto;
        }

        .discrimination-table {
          width: 100%;
          border-collapse: collapse;
          background: #2b2b2b;
          border-radius: 8px;
          overflow: hidden;
        }

        .discrimination-table th,
        .discrimination-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #444;
        }

        .discrimination-table th {
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          color: #fff;
        }

        .discrimination-table tr:hover {
          background: #3a3a3a;
        }

        @media(max-width: 600px) {
          .form-add-discrimination {
            flex-direction: column;
            align-items: center;
          }

          .form-add-discrimination input,
          .form-add-discrimination select,
          .form-add-discrimination button {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
    </>
  );
};

export default DiscriminationManager;
