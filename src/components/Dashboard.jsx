import React from "react";
import { Link } from "react-router-dom";
import "../Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Smart Elderly Care Dashboard</h1>
      <div className="card welcome-box">
        <h2>Welcome</h2>
        <p>Quick tips to get started:</p>
        <ul>
          <li>
            <strong>Emergency Contacts:</strong> Add or manage contacts for emergencies.
          </li>
          <li>
            <strong>Map:</strong> Track the elderly person's real-time location.
          </li>
          <li>
            <strong>Incident Log:</strong> Review past incidents like falls.
          </li>
          <li>
            <strong>Door Unlock:</strong> Remotely unlock the door in emergencies.
          </li>
        </ul>
      </div>
      <div className="dashboard-grid">
        <Link to="/emergency-contacts" className="dashboard-card">
          <div className="card">
            <i className="fas fa-address-book"></i>
            <h3>Emergency Contacts</h3>
            <p>Add or manage emergency contacts.</p>
          </div>
        </Link>
        <Link to="/map" className="dashboard-card">
          <div className="card">
            <i className="fas fa-map-marker-alt"></i>
            <h3>Map</h3>
            <p>Track the elderly person's location.</p>
          </div>
        </Link>
        <Link to="/incidents" className="dashboard-card">
          <div className="card">
            <i className="fas fa-history"></i>
            <h3>Incident Log</h3>
            <p>View past incidents.</p>
          </div>
        </Link>
        <Link to="/door-unlock" className="dashboard-card">
          <div className="card">
            <i className="fas fa-lock-open"></i>
            <h3>Door Unlock</h3>
            <p>Remotely unlock the door.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;