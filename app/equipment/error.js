"use client";
import Link from "next/link";
export default function EquipmentError({ error, reset }) {
  return (
    <div style={{ padding: "60px 24px", textAlign: "center", maxWidth: "500px", margin: "0 auto" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚜</div>
      <h1 style={{ fontSize: "20px", margin: "0 0 8px" }}>Unable to load equipment</h1>
      <p style={{ color: "#666", fontSize: "14px", margin: "0 0 24px" }}>Something went wrong loading this page.</p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button onClick={() => reset()} style={{
          padding: "10px 24px", background: "#2c3e50", color: "white",
          border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px",
        }}>Try again</button>
        <Link href="/equipment" style={{
          padding: "10px 24px", background: "#eee", color: "#333",
          textDecoration: "none", borderRadius: "8px", fontSize: "14px",
        }}>Browse all</Link>
      </div>
    </div>
  );
}
