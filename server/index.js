const express = require("express");
const twilio = require("twilio");
const admin = require("firebase-admin");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = require("./service-account.json"); // Download from Firebase Console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Initialize Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

// Store for time-limited codes
const doorCodes = new Map();

// Listen for fall detection and send SMS
db.collection("status").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach(async (change) => {
    if (change.type === "modified" || change.type === "added") {
      const data = change.doc.data();
      if (data.fallDetected) {
        // Get emergency contacts
        const contactsSnapshot = await db.collection("emergencyContacts").get();
        const contacts = contactsSnapshot.docs.map((doc) => doc.data());

        // Generate a time-limited door code (valid for 10 minutes)
        const passcode = Math.random().toString(36).slice(-6);
        const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now
        doorCodes.set(passcode, { expiry, used: false });

        // Send SMS to each contact
        for (const contact of contacts) {
          if (contact.phone) {
            await twilioClient.messages.create({
              body: `Fall detected for elderly person! Get door code here (valid for 10 mins): http://localhost:5000/get-door-code?code=${passcode}`,
              from: process.env.TWILIO_PHONE_NUMBER,
              to: contact.phone,
            });
          }
        }

        // Log incident
        await db.collection("incidents").add({
          type: "Fall Detected",
          resolved: false,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }
  });
});

// Endpoint to get door code
app.get("/get-door-code", (req, res) => {
  const code = req.query.code;
  const codeData = doorCodes.get(code);

  if (!codeData) {
    return res.status(400).json({ error: "Invalid or expired code" });
  }

  if (Date.now() > codeData.expiry) {
    doorCodes.delete(code);
    return res.status(400).json({ error: "Code has expired" });
  }

  if (codeData.used) {
    return res.status(400).json({ error: "Code has already been used" });
  }

  codeData.used = true;
  res.json({ doorCode: code });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});