import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/authService";
import { setUser } from "../../redux/actions/authActions";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        const isProfileComplete = [
          user.firstName,
          user.lastName,
          user.gender,
          user.mobile,
          user.country,
          user.state,
          user.city,
        ].every(Boolean);

        navigate(isProfileComplete ? "/user/profile" : "/complete-profile");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(email, passwordValue);
      const { token, user } = response.data;

      if (!user.isVerified) {
        setError("Please verify your email before logging in.");
        setLoading(false);
        return;
      }

      dispatch(setUser({ user, token }));

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        const isProfileComplete = [
          user.firstName,
          user.lastName,
          user.gender,
          user.mobile,
          user.country,
          user.state,
          user.city,
        ].every(Boolean);

        navigate(isProfileComplete ? "/user/profile" : "/complete-profile");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <nav className="navbar">
        <div className="navbar-brand">NoBias</div>
        <ul className="navbar-links">
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </li>
        </ul>
      </nav>

      <div className="login-container">
        <div className="login-card">
          <h2>Login</h2>
          <p className="sub-text">
            Please ensure your email is verified before login.
          </p>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                required
                disabled={loading}
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="register-link">
            Don’t have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .login-page {
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
          padding: 12px 40px 12px 15px;
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

        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding-top: 120px;
          min-height: 100vh;
        }

        .login-card {
          background: #1c1c1c;
          padding: 40px 30px;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        .login-card h2 {
          margin-bottom: 10px;
          font-size: 2rem;
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sub-text {
          color: #ccc;
          font-size: 0.95rem;
          margin-bottom: 20px;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 15px;
          font-size: 0.95rem;
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

        form input[type="email"] {
         width: 100%;
         padding: 12px 15px;
         border: 2px solid transparent;
         border-radius: 5px;
        font-size: 1rem;
        background: #333;
        color: #fff;
        transition: border 0.3s ease, box-shadow 0.3s ease;
       }

      form input[type="email"]:focus {
       outline: none;
      border: 2px solid #ff4d97;
      box-shadow: 0 0 5px rgba(255, 77, 151, 0.5);
      }
      
        .register-link {
          margin-top: 15px;
          font-size: 0.95rem;
        }

        .register-link a {
          color: #ff4d97;
          text-decoration: none;
          font-weight: 600;
        }

        .register-link a:hover {
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

          .login-card {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
