"use client";
import React from "react";
import { useParams } from "next/navigation";

async function getTripData(tripId) {
  try {
    const res = await fetch(`/api/trips`);
    const data = await res.json();
    const trip = data.trips.find((t) => t.id === tripId.toUpperCase());
    if (trip) return trip;
  } catch {}
  try {
    const res = await fetch(`/api/book?ref=${tripId.toUpperCase()}`);
    if (res.ok) {
      const data = await res.json();
      return { ...data.booking, id: data.booking.reference, isBooking: true };
    }
  } catch {}
  return null;
}

export default function TrackPage({ params }) {
  const [trip, setTrip] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    params.then((p) => {
      getTripData(p.id).then((data) => {
        setTrip(data);
        setLoading(false);
      });
    });
  }, [params]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
        <p style={{ color: "#888" }}>Loading tracking data...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔍</div>
          <h2>No tracking data found</h2>
          <p style={{ color: "#666" }}>Trip ID not found. Contact HaulitNG support.</p>
        </div>
      </div>
    );
  }

  const lastCheckin = trip.checkins?.[trip.checkins.length - 1];
  const checkinCount = trip.checkins?.length || 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f5f5",
      padding: "24px",
      display: "flex",
      justifyContent: "center",
    }}>
      <div style={{ maxWidth: "600px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "48px" }}>🚛</div>
          <h1 style={{ margin: "8px 0" }}>HaulitNG Tracking</h1>
          <p style={{ color: "#666", margin: 0 }}>Real-time delivery status for {trip.id}</p>
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "16px" }}>
          <h3 style={{ margin: "0 0 16px" }}>Trip Summary</h3>
          <div style={{ display: "grid", gap: "8px", fontSize: "14px" }}>
            <div><strong>Truck:</strong> {trip.truckId}</div>
            <div><strong>Customer:</strong> {trip.customerName}</div>
            <div><strong>Destination:</strong> {trip.destination}</div>
            <div><strong>Estimated Delivery:</strong> {new Date(trip.estimatedDelivery).toLocaleDateString()}</div>
            <div><strong>Status:</strong> <span style={{ color: "#27ae60", fontWeight: 600, textTransform: "capitalize" }}>{trip.status}</span></div>
            <div><strong>Check-ins:</strong> {checkinCount}</div>
          </div>
        </div>

        {lastCheckin && (
          <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "16px" }}>
            <h3 style={{ margin: "0 0 16px" }}>📍 Last Location Update</h3>
            <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
              <div><strong>Time:</strong> {new Date(lastCheckin.timestamp).toLocaleString()}</div>
              <div><strong>Coordinates:</strong> {lastCheckin.lat?.toFixed(4)}, {lastCheckin.lng?.toFixed(4)}</div>
              {lastCheckin.note && <div><strong>Note:</strong> {lastCheckin.note}</div>}
            </div>
          </div>
        )}

        {trip.checkins?.length > 1 && (
          <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 16px" }}>📍 Trip Timeline</h3>
            <div style={{ fontSize: "13px" }}>
              {[...trip.checkins].reverse().map((c, i) => (
                <div key={c.id} style={{
                  padding: "8px 0",
                  borderBottom: i < trip.checkins.length - 1 ? "1px solid #eee" : "none",
                  lineHeight: "1.6",
                }}>
                  <span style={{ color: "#2c3e50", fontWeight: 600 }}>{new Date(c.timestamp).toLocaleTimeString()}</span>
                  {" — "}{c.lat?.toFixed(4)}, {c.lng?.toFixed(4)}
                  {c.note && <span style={{ color: "#666" }}> — {c.note}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {checkinCount === 0 && (
          <div style={{ background: "white", borderRadius: "12px", padding: "40px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>⏳</div>
            <h3>Awaiting First Check-in</h3>
            <p style={{ color: "#666", fontSize: "14px" }}>The driver has not checked in yet. Updates will appear here automatically.</p>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "24px", color: "#999", fontSize: "12px" }}>
          Powered by HaulitNG — Smart Logistics for Nigeria
        </div>
      </div>
    </div>
  );
}
