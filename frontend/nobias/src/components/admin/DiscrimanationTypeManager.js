import React, { useEffect, useState } from "react";
import {
  getDiscriminationTypes,
  createDiscriminationType,
  deleteDiscriminationType,
  updateDiscriminationType,
} from "../../api/adminService";
import Navbar from "../../components/common/Navbar";
import { ToastContainer, toast } from "react-toastify";

const DiscriminationTypeManager = () => {
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [editTypeId, setEditTypeId] = useState(null);
  const [editTypeName, setEditTypeName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const res = await getDiscriminationTypes();
      setTypes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching types:", error);
      toast.error("Failed to fetch discrimination types.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newType.trim()) {
      try {
        await createDiscriminationType({ name: newType.trim() });
        setNewType("");
        fetchTypes();
        toast.success("Discrimination type added successfully.");
      } catch (error) {
        console.error("Error creating type:", error);
        toast.error("Failed to create discrimination type.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this type?")) {
      try {
        await deleteDiscriminationType(id);
        fetchTypes();
        toast.success("Type deleted successfully.");
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete type.");
      }
    }
  };

  const handleEdit = (type) => {
    setEditTypeId(type._id);
    setEditTypeName(type.name);
  };

  const handleUpdate = async (id) => {
    if (editTypeName.trim()) {
      try {
        await updateDiscriminationType(id, { name: editTypeName.trim() });
        setEditTypeId(null);
        setEditTypeName("");
        fetchTypes();
        toast.success("Type updated successfully.");
      } catch (error) {
        console.error("Update error:", error);
        toast.error("Failed to update type.");
      }
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  return (
    <>
      <Navbar type="adminDiscriminationTypes" />
      <ToastContainer />

      <div className="dtm-wrapper">
        <div className="dtm-content">
          <h2>Discrimination Types</h2>

          <form onSubmit={handleSubmit} className="dtm-form">
            <input
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              placeholder="Enter new type"
              required
            />
            <button type="submit">Add</button>
          </form>

          {loading ? (
            <p className="dtm-status">Loading types...</p>
          ) : types.length === 0 ? (
            <p className="dtm-status">No discrimination types found.</p>
          ) : (
            <div className="dtm-table-container">
              <table className="dtm-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Type Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {types.map((type, index) => (
                    <tr key={type._id}>
                      <td>{index + 1}</td>
                      <td>
                        {editTypeId === type._id ? (
                          <input
                            value={editTypeName}
                            onChange={(e) => setEditTypeName(e.target.value)}
                            className="edit-input"
                          />
                        ) : (
                          type.name
                        )}
                      </td>
                      <td>
                        {editTypeId === type._id ? (
                          <button
                            onClick={() => handleUpdate(type._id)}
                            className="action-btn save"
                          >
                            💾
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(type)}
                            className="action-btn edit"
                          >
                            ✏️
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(type._id)}
                          className="action-btn delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .dtm-wrapper {
          background: #0f0f0f;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 20px 40px;
        }

        .dtm-content {
          background: #1a1a1a;
          border-radius: 10px;
          padding: 30px 25px;
          width: 100%;
          max-width: 750px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          color: #f0f0f0;
        }

        .dtm-content h2 {
          text-align: center;
          font-size: 1.8rem;
          margin-bottom: 25px;
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .dtm-form {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .dtm-form input {
          flex: 1;
          min-width: 200px;
          padding: 10px;
          border-radius: 5px;
          border: none;
          font-size: 16px;
          background: #2b2b2b;
          color: #fff;
        }

        .dtm-form input::placeholder {
          color: #bbb;
        }

        .dtm-form button {
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

        .dtm-form button:hover {
          opacity: 0.9;
        }

        .dtm-status {
          text-align: center;
          color: #ccc;
        }

        .dtm-table-container {
          overflow-x: auto;
        }

        .dtm-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          background: #2b2b2b;
          border-radius: 8px;
          overflow: hidden;
        }

        .dtm-table th,
        .dtm-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #444;
        }

        .dtm-table th {
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          color: #fff;
        }

        .dtm-table tr:hover {
          background: #3a3a3a;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          margin-right: 5px;
        }

        .edit-input {
          padding: 5px 8px;
          border-radius: 4px;
          border: none;
          background: #3a3a3a;
          color: #fff;
          font-size: 1rem;
        }

        @media(max-width: 600px) {
          .dtm-form {
            flex-direction: column;
          }
          .dtm-form button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default DiscriminationTypeManager;
