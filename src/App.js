import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useLocation } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Dashboard from "./components/Dashboard";
import LoginSignup from "./components/LoginSignup";
import EmergencyContacts from "./components/EmergencyContacts";
import MapPage from "./components/MapPage";
import IncidentLog from "./components/IncidentLog";
import DoorUnlock from "./components/DoorUnlock";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState({ fallDetected: false });

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Listen for real-time status updates
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "status"), (snapshot) => {
      snapshot.forEach((doc) => {
        setStatus(doc.data());
      });
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <Router>
      <div className="app-container">
        {/* Side Navigation */}
        {user && (
          <nav className="side-nav">
            <div className="live-status">
              <span
                className={`status-badge ${
                  status.fallDetected ? "status-emergency" : "status-safe"
                }`}
              >
                Live Status: {status.fallDetected ? "Emergency" : "Safe"}
              </span>
            </div>
            <ul>
              <li>
                <Link to="/dashboard" className="nav-link">
                  <i className="fas fa-home"></i> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/emergency-contacts" className="nav-link">
                  <i className="fas fa-address-book"></i> Emergency Contacts
                </Link>
              </li>
              <li>
                <Link to="/map" className="nav-link">
                  <i className="fas fa-map-marker-alt"></i> Map
                </Link>
              </li>
              <li>
                <Link to="/incidents" className="nav-link">
                  <i className="fas fa-history"></i> Incident Log
                </Link>
              </li>
              <li>
                <Link to="/door-unlock" className="nav-link">
                  <i className="fas fa-lock-open"></i> Door Unlock
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-button">
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </li>
            </ul>
          </nav>
        )}
        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" /> : <LoginSignup />}
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/emergency-contacts"
              element={user ? <EmergencyContacts /> : <Navigate to="/login" />}
            />
            <Route
              path="/map"
              element={user ? <MapPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/incidents"
              element={user ? <IncidentLog /> : <Navigate to="/login" />}
            />
            <Route
              path="/door-unlock"
              element={user ? <DoorUnlock /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;