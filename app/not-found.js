import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: "60px 24px", textAlign: "center", maxWidth: "500px", margin: "0 auto" }}>
      <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔍</div>
      <h1 style={{ fontSize: "24px", margin: "0 0 8px" }}>Page not found</h1>
      <p style={{ color: "#666", fontSize: "14px", margin: "0 0 24px" }}>The page you are looking for does not exist.</p>
      <Link href="/" style={{
        display: "inline-block", padding: "10px 24px", background: "#2c3e50",
        color: "white", textDecoration: "none", borderRadius: "8px", fontSize: "14px",
      }}>Go home</Link>
    </div>
  );
}
