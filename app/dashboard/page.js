import { getTrucks, getTrips } from "@/lib/store";

export default function Dashboard() {
  const trucks = getTrucks();
  const trips = getTrips();

  const statusColor = (status) => {
    const colors = { delivering: "#e67e22", loading: "#3498db", available: "#27ae60", maintenance: "#e74c3c" };
    return colors[status] || "#95a5a6";
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px" }}>🚛 HaulitNG Fleet</h1>
          <p style={{ margin: "4px 0 0", color: "#666" }}>AI-Powered Real-Time Tracking</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <a href="/driver" style={btnStyle}>Driver Check-in</a>
          <a href="/" style={{ ...btnStyle, background: "#2c3e50" }}>Home</a>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        {trucks.map((truck) => (
          <div key={truck.id} style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            borderLeft: `4px solid ${statusColor(truck.status)}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <strong style={{ fontSize: "16px" }}>{truck.id}</strong>
              <span style={{
                background: statusColor(truck.status),
                color: "white",
                padding: "2px 10px",
                borderRadius: "12px",
                fontSize: "12px",
                textTransform: "capitalize",
              }}>{truck.status}</span>
            </div>
            <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.8" }}>
              <div>🚛 {truck.plate}</div>
              <div>👤 {truck.driver}</div>
              <div>📞 {truck.phone}</div>
              <div>📍 {truck.currentLat?.toFixed(4)}, {truck.currentLng?.toFixed(4)}</div>
              <div style={{ fontSize: "11px", color: "#999" }}>
                Updated: {new Date(truck.lastUpdate).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {trips.length > 0 && (
        <>
          <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>Active Trips</h2>
          <div style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                  <th style={thStyle}>Trip ID</th>
                  <th style={thStyle}>Truck</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Destination</th>
                  <th style={thStyle}>ETD</th>
                  <th style={thStyle}>Check-ins</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={tdStyle}>{trip.id}</td>
                    <td style={tdStyle}>{trip.truckId}</td>
                    <td style={tdStyle}>{trip.customerName}</td>
                    <td style={tdStyle}>{trip.destination}</td>
                    <td style={tdStyle}>{new Date(trip.estimatedDelivery).toLocaleDateString()}</td>
                    <td style={tdStyle}>{trip.checkins?.length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {trips.length === 0 && (
        <div style={{
          background: "white",
          borderRadius: "12px",
          padding: "40px",
          textAlign: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          color: "#666",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📋</div>
          <h3>No Active Trips</h3>
          <p>Use the API to create trips and track deliveries in real-time.</p>
        </div>
      )}

      <div style={{ marginTop: "32px", background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h3 style={{ marginTop: 0 }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <a href="/driver" style={btnStyle}>📍 Driver Check-in Link</a>
          <a href="/track/TRIP-001" style={{ ...btnStyle, background: "#8e44ad" }}>🔗 Customer Tracking Page</a>
        </div>
        <p style={{ fontSize: "13px", color: "#888", marginTop: "16px" }}>
          Share the driver check-in link with your drivers. Share the tracking link with customers.
        </p>
      </div>
    </div>
  );
}

const btnStyle = {
  display: "inline-block",
  padding: "10px 20px",
  background: "#2c3e50",
  color: "white",
  textDecoration: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 500,
};

const thStyle = { padding: "12px 16px", borderBottom: "2px solid #dee2e6" };
const tdStyle = { padding: "12px 16px" };
