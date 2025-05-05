import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Map from "./Map";
import "../Dashboard.css";

const MapPage = () => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "locations"), (snapshot) => {
      snapshot.forEach((doc) => {
        setLocation(doc.data());
      });
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Elderly Location</h1>
      <div className="card">
        <h2>Real-Time Location</h2>
        <Map latitude={location.latitude} longitude={location.longitude} />
      </div>
    </div>
  );
};

export default MapPage;