import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import "../Dashboard.css";

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "emergencyContacts"), (snapshot) => {
      setContacts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleAddContact = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "emergencyContacts"), {
      userId: "user1",
      name,
      phone,
      email,
    });
    setName("");
    setPhone("");
    setEmail("");
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      await deleteDoc(doc(db, "emergencyContacts", id));
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Emergency Contacts</h1>
      <div className="card">
        <h2>Add Emergency Contact</h2>
        <form onSubmit={handleAddContact} className="emergency-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-label="Contact Name"
          />
          <input
            type="tel"
            placeholder="Phone (e.g., +1234567890)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            aria-label="Contact Phone Number"
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Contact Email"
          />
          <button type="submit" className="add-button">
            Add Contact
          </button>
        </form>
      </div>
      <div className="card">
        <h2>Contact List</h2>
        {contacts.length === 0 ? (
          <p>No contacts added yet.</p>
        ) : (
          <ul className="emergency-list">
            {contacts.map((contact) => (
              <li key={contact.id} className="contact-item">
                <div className="contact-info">
                  <div className="profile-pic"></div>
                  <div>
                    <strong>{contact.name}</strong>
                    <p>{contact.phone}</p>
                    <p>{contact.email || "No email provided"}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="delete-button"
                  aria-label={`Delete contact ${contact.name}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EmergencyContacts;