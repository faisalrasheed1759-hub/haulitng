"use client";
import { useState } from "react";

export default function DriverCheckin() {
  const [tripId, setTripId] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  const getLocation = () => {
    if (!tripId.trim()) {
      setStatus("Please enter a Trip ID");
      return;
    }
    setSending(true);
    setStatus("Getting location...");

    if (!navigator.geolocation) {
      setStatus("GPS not available on this device");
      setSending(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch("/api/checkin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tripId: tripId.trim().toUpperCase(),
              lat: latitude,
              lng: longitude,
              note: note.trim(),
            }),
          });
          const data = await res.json();
          if (res.ok) {
            const time = new Date().toLocaleTimeString();
            setStatus(`✅ Check-in recorded at ${time}. Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            setNote("");
          } else {
            setStatus(`❌ Error: ${data.error}`);
          }
        } catch {
          setStatus("❌ Network error. Check your connection.");
        }
        setSending(false);
      },
      () => {
        setStatus("❌ Could not get GPS. Enable location services.");
        setSending(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "40px",
        maxWidth: "420px",
        width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "48px" }}>🚛</div>
          <h2 style={{ margin: "8px 0 4px" }}>HaulitNG Check-in</h2>
          <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>Tap the button to record your location</p>
        </div>

        <input
          placeholder="Trip ID (e.g., TRIP-001)"
          value={tripId}
          onChange={(e) => setTripId(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Note (optional — e.g., 'delivered to client')"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={getLocation}
          disabled={sending}
          style={{
            ...btnStyle,
            opacity: sending ? 0.7 : 1,
          }}
        >
          {sending ? "📍 Getting GPS..." : "📍 Check In Now"}
        </button>

        {status && (
          <div style={{
            marginTop: "16px",
            padding: "12px",
            borderRadius: "8px",
            background: status.startsWith("✅") ? "#d4edda" : status.startsWith("❌") ? "#f8d7da" : "#fff3cd",
            color: status.startsWith("✅") ? "#155724" : status.startsWith("❌") ? "#721c24" : "#856404",
            fontSize: "13px",
            textAlign: "center",
          }}>
            {status}
          </div>
        )}

        <div style={{ marginTop: "20px", fontSize: "11px", color: "#aaa", textAlign: "center" }}>
          Your GPS coordinates are sent securely to HaulitNG
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  marginBottom: "12px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box",
};

const btnStyle = {
  width: "100%",
  padding: "14px",
  background: "#2c3e50",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: 600,
  cursor: "pointer",
};
