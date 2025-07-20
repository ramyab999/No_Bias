import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/common/Navbar";

const AdminUserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>Loading users...</p>
    );
  }

  return (
    <>
      <Navbar type="adminUsers" />
      <div className="user-manager-page">
        <h1>User Management</h1>

        {users.length === 0 ? (
          <p className="no-users">No users found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Mobile</th>
                  <th>Country</th>
                  <th>State</th>
                  <th>City</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.email}</td>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.gender || "-"}</td>
                    <td>{user.mobile}</td>
                    <td>{user.country?.name || "-"}</td>
                    <td>{user.state?.name || "-"}</td>
                    <td>{user.city?.name || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CSS styles */}
      <style>{`
        .user-manager-page {
          background: #0f0f0f;
          min-height: 100vh;
          padding: 40px 20px;
          color: #fff;
        }

        .user-manager-page h1 {
          text-align: center;
          margin-bottom: 30px;
          font-size: 2rem;
          background: linear-gradient(to right, #ff4d97, #ff6f61, #ff9800);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .no-users {
          text-align: center;
          color: #ccc;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: #1c1c1c;
          border-radius: 8px;
          overflow: hidden;
        }

        th, td {
          padding: 12px 15px;
          text-align: left;
        }

        th {
          background: #292929;
          color: #ff4d97;
        }

        tr:nth-child(even) {
          background: #222;
        }

        tr:hover {
          background: #333;
        }

        @media(max-width: 768px) {
          th, td {
            padding: 10px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  );
};

export default AdminUserManager;
