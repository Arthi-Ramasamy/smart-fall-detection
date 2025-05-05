import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import "../Dashboard.css";

const DoorUnlock = () => {
  const [lastAction, setLastAction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "doorUnlock"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          setLastAction(change.doc.data());
        }
      });
    });
    return () => unsubscribe();
  }, []);

  const handleUnlockDoor = async () => {
    setShowModal(true);
  };

  const confirmUnlock = async () => {
    const passcode = Math.random().toString(36).slice(-6);
    await addDoc(collection(db, "doorUnlock"), {
      deviceId: "ESP32_001",
      passcode,
      timestamp: serverTimestamp(),
      status: "unlocked",
    });
    setShowModal(false);
    alert(`Door unlocked with passcode: ${passcode}`);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Remote Door Unlock</h1>
      <div className="card">
        <h2>Door Control</h2>
        <p>
          Status: {lastAction ? "Unlocked" : "Locked"}
          {lastAction && (
            <span className="last-action">
              {" "}
              (Last Action: {lastAction.timestamp?.toDate().toLocaleString()})
            </span>
          )}
        </p>
        <button onClick={handleUnlockDoor} className="unlock-button" aria-label="Unlock door">
          Unlock Door
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Door Unlock</h3>
            <p>Are you sure you want to unlock the door? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button onClick={confirmUnlock} className="confirm-button">
                Yes, Unlock
              </button>
              <button onClick={() => setShowModal(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoorUnlock;