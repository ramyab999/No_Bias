import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
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
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </li>
          <li>
            <Link to="/login" className="nav-link btn-outline">
              Login
            </Link>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>Raise Your Voice Against Discrimination</h1>
          <p>
            Together we can create a world free from bias by reporting incidents
            safely and anonymously.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
            <Link to="/view-reports" className="btn-secondary">
              View Reports
            </Link>
          </div>
          <div className="social-icons">
            <i className="fab fa-facebook-f icon"></i>
            <i className="fab fa-twitter icon"></i>
            <i className="fab fa-instagram icon"></i>
          </div>
        </div>
      </header>

      {/* CSS Styles */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .home-container {
          overflow-x: hidden;
          background: #0e0e0e;
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

        .btn-outline {
          border: 2px solid #ff4d97;
          border-radius: 25px;
          padding: 8px 20px;
          color: #ff4d97;
          font-weight: 600;
          transition: background 0.3s ease, color 0.3s ease;
        }

        .btn-outline:hover {
          background: #ff4d97;
          color: #fff;
        }

        .hero {
          background-image: url('/Background.avif');
          background-size: cover;
          background-position: center;
          text-align: left;
          padding: 180px 60px 100px 60px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          position: relative;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          z-index: 1;
        }

        .hero-content {
          max-width: 650px;
          position: relative;
          z-index: 2;
        }

        .hero-content h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 20px;
          line-height: 1.2;
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-content p {
          font-size: 1.2rem;
          margin-bottom: 40px;
          color: #e0e0e0;
          font-weight: 400;
        }

        .hero-buttons {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: linear-gradient(45deg, #9d00ff, #ff4d97, #ff9900);
          color: #fff;
          padding: 12px 30px;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          border: none;
          transition: transform 0.3s ease;
        }

        .btn-primary:hover {
          transform: scale(1.05);
        }

        .btn-secondary {
          border: 2px solid #ff4d97;
          color: #ff4d97;
          padding: 12px 30px;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          background: transparent;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #ff4d97;
          color: #fff;
        }

        .social-icons {
          margin-top: 30px;
        }

        .icon {
          font-size: 1.5rem;
          margin-right: 20px;
          cursor: pointer;
          transition: transform 0.3s ease, color 0.3s ease;
        }

        .icon:hover {
          transform: scale(1.2);
          color: #ff4d97;
        }

        @media(max-width: 768px){
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

          .hero {
            padding: 150px 30px 80px 30px;
            text-align: center;
          }

          .hero-content h1 {
            font-size: 2rem;
          }

          .hero-content p {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
