"use client";
export default function Error({ error, reset }) {
  return (
    <div style={{ padding: "60px 24px", textAlign: "center", maxWidth: "500px", margin: "0 auto" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
      <h1 style={{ fontSize: "20px", margin: "0 0 8px" }}>Something went wrong</h1>
      <p style={{ color: "#666", fontSize: "14px", margin: "0 0 24px" }}>An unexpected error occurred. Please try again.</p>
      <button onClick={() => reset()} style={{
        padding: "10px 24px", background: "#2c3e50", color: "white",
        border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px",
      }}>Try again</button>
    </div>
  );
}
