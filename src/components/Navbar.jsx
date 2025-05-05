import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Import auth from firebase.js
import { signOut } from "firebase/auth";
import "../Navbar.css";

const Navbar = ({ user, status }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar-status">
        <p className={status.fallDetected ? "status-fall" : "status-safe"}>
          Live Status: {status.fallDetected ? "Fall Detected!" : "Safe"}
        </p>
      </div>
      {user && (
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/emergency-contacts">Emergency Contacts</Link>
          <Link to="/map">Map</Link>
          <Link to="/incidents">Incident Log</Link>
          <Link to="/door-unlock">Door Unlock</Link>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;