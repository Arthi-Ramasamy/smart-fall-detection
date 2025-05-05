import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import "../Dashboard.css";

const IncidentLog = () => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "incidents"), (snapshot) => {
      setIncidents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Incident Log</h1>
      <div className="card">
        <h2>Incident Timeline</h2>
        {incidents.length === 0 ? (
          <p>No incidents recorded yet.</p>
        ) : (
          <ul className="incident-timeline">
            {incidents.map((incident) => (
              <li key={incident.id} className="incident-item">
                <i className={`fas fa-exclamation-triangle ${incident.resolved ? "resolved" : "unresolved"}`}></i>
                <div className="incident-details">
                  <span className="incident-time">
                    {incident.timestamp?.toDate().toLocaleString()}
                  </span>
                  <span className="incident-type">{incident.type}</span>
                  <span className={`incident-status ${incident.resolved ? "resolved" : "unresolved"}`}>
                    {incident.resolved ? "Resolved" : "Unresolved"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default IncidentLog;