import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendOTP } from "../../api/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
    firstName: "",
    lastName: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await sendOTP(formData);
      if (response.message && response.message.includes("OTP sent")) {
        setSuccess(`Registration successful! OTP sent to ${formData.email}`);
        setTimeout(() => {
          navigate("/verify-otp", {
            state: { email: formData.email, role: formData.role },
          });
        }, 2000);
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Navbar */}
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

      {/* Registration Form */}
      <div className="register-container">
        <div className="register-card">
          <h2>Create Your Account</h2>
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">Register as User</option>
              <option value="admin">Register as Admin</option>
            </select>

            {formData.role === "admin" && (
              <>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Password input with eye icon */}
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Sending OTP..." : "Register & Send OTP"}
            </button>
          </form>

          <p className="login-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>

      {/* CSS Styles */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .register-page {
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

          .password-field {
          position: relative;
          margin: 10px 0;
        }

        .password-field input {
          width: 100%;
          padding: 12px 40px 12px 15px; /* space for eye icon */
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          background: #333;
          color: #fff;
        }

        .password-field .eye-icon {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #ccc;
          font-size: 1.1rem;
        }

        .password-field .eye-icon:hover {
          color: #ff4d97;
        }

        .register-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding-top: 120px;
          min-height: 100vh;
        }

        .register-card {
          background: #1c1c1c;
          padding: 40px 30px;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 450px;
          text-align: center;
        }

        .register-card h2 {
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

        form select, form input {
          width: 100%;
          padding: 12px 15px;
          margin: 10px 0;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          background: #333;
          color: #fff;
        }

        form select:focus, form input:focus {
          outline: none;
          border: 2px solid #ff4d97;
        }

        form select option {
          background: #333;
          color: #fff;
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

        .login-link {
          margin-top: 15px;
          font-size: 0.95rem;
        }

        .login-link a {
          color: #ff4d97;
          text-decoration: none;
          font-weight: 600;
        }

        .login-link a:hover {
          text-decoration: underline;
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

          .register-card {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
