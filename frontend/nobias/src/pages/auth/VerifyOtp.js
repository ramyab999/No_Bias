import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { verifyOTP } from "../../api/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await verifyOTP({ email, otp });

      if (response.success) {
        setSuccess("OTP verified successfully!");
        localStorage.setItem("verifiedEmail", email);
        navigate("/login");
      } else {
        setError("Invalid OTP or verification failed");
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="verify-page">
      <nav className="navbar">
        <div className="navbar-brand">NoBias</div>
        <ul className="navbar-links">
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </li>
        </ul>
      </nav>

      <div className="verify-container">
        <div className="verify-card">
          <h2>Verify OTP</h2>
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="otp-field">
              <input
                type={showOtp ? "text" : "password"}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <span className="eye-icon" onClick={() => setShowOtp(!showOtp)}>
                {showOtp ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button type="submit">Verify OTP</button>
          </form>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .verify-page {
          background: #0e0e0e;
          min-height: 100vh;
          color: #fff;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 50px;
          background: rgba(0,0,0,0.85);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 100;
        }

        .navbar-brand {
          font-size: 1.8rem;
          font-weight: bold;
          letter-spacing: 1px;
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .navbar-links {
          list-style: none;
          display: flex;
          gap: 25px;
        }

        .nav-link {
          color: #fff;
          text-decoration: none;
          font-size: 1.1rem;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #ff4d97;
        }

        .verify-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding-top: 120px;
          min-height: 100vh;
        }

        .verify-card {
          background: #1c1c1c;
          padding: 40px 30px;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        .verify-card h2 {
          margin-bottom: 20px;
          font-size: 2rem;
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 15px;
          font-size: 0.95rem;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 15px;
          font-size: 0.95rem;
        }

        .otp-field {
          position: relative;
          margin: 10px 0;
        }

        .otp-field input {
          width: 100%;
          padding: 12px 40px 12px 15px;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          background: #333;
          color: #fff;
        }

        .otp-field .eye-icon {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #ccc;
          font-size: 1.1rem;
        }

        .otp-field .eye-icon:hover {
          color: #ff4d97;
        }

        form input:focus {
          outline: none;
          border: 2px solid #ff4d97;
        }

        form button {
          width: 100%;
          padding: 12px;
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          border: none;
          border-radius: 5px;
          color: #fff;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        form button:hover {
          transform: scale(1.05);
        }

        @media(max-width: 600px){
          .navbar {
            flex-direction: column;
            align-items: flex-start;
            padding: 10px 20px;
          }

          .navbar-links {
            flex-direction: column;
            gap: 10px;
            width: 100%;
          }

          .verify-card {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default VerifyOtp;
