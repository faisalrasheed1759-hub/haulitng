"use client";
import { Suspense } from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("callbackUrl") || "/dashboard";
  const callbackUrl = raw.startsWith("/") ? raw : "/dashboard";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError("Invalid credentials");
      setLoading(false);
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#1a1a2e",
    }}>
      <div style={{
        background: "white", borderRadius: "12px", padding: "40px",
        width: "100%", maxWidth: "400px", margin: "20px",
      }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <svg width="48" height="48" viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: "0 auto" }}>
            <rect x="2" y="10" width="22" height="6" rx="1" fill="#1a1a2e" opacity="0.9"/>
            <rect x="6" y="6" width="14" height="4" rx="1" fill="#1a1a2e" opacity="0.7"/>
            <circle cx="8" cy="17" r="2.5" fill="#1a1a2e" opacity="0.8"/>
            <circle cx="18" cy="17" r="2.5" fill="#1a1a2e" opacity="0.8"/>
            <rect x="24" y="11" width="4" height="5" rx="0.5" fill="#1a1a2e" opacity="0.6"/>
            <rect x="28" y="8" width="2" height="8" rx="0.5" fill="#1a1a2e" opacity="0.5"/>
            <rect x="30" y="5" width="1.5" height="11" rx="0.5" fill="#1a1a2e" opacity="0.4"/>
            <rect x="31.5" y="3" width="1" height="13" rx="0.5" fill="#1a1a2e" opacity="0.3"/>
          </svg>
          <h1 style={{ margin: "8px 0 4px", fontSize: "20px" }}>Sign In</h1>
          <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>Authorized personnel only</p>
        </div>
        <form onSubmit={submit} style={{ display: "grid", gap: "16px" }}>
          {error && (
            <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", textAlign: "center" }}>
              {error}
            </div>
          )}
          <input
            type="text" placeholder="Username" value={username}
            onChange={(e) => setUsername(e.target.value)}
            required autoFocus
            style={{ padding: "12px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px" }}
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "12px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px" }}
          />
          <button type="submit" disabled={loading} style={{
            padding: "12px", background: loading ? "#888" : "#2c3e50", color: "white",
            border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer",
          }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1a2e", color: "white" }}>
        <div>Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
