import React, { useEffect, useState } from "react";
import { getTotalUsers } from "../../services/adminService";

const TotalUsers = () => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const total = await getTotalUsers();
        setCount(total);
      } catch (err) {
        console.error("Error fetching total users:", err);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchCount();
  }, []);

  return (
    <div className="total-users-container">
      {loading ? (
        <p className="loading-text">Loading total users...</p>
      ) : (
        <h3>
          Total Registered Users: <span className="gradient-text">{count}</span>
        </h3>
      )}

      <style>{`
        .total-users-container {
          background: #121212;
          color: #fff;
          text-align: center;
          padding: 30px 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
        }

        .loading-text {
          color: #ccc;
        }

        h3 {
          font-size: 1.8rem;
        }

        .gradient-text {
          background: linear-gradient(to right, #ff4d97, #ff6f61, #ff9800);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default TotalUsers;
