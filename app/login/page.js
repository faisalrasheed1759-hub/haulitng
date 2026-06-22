"use client";
import { Suspense } from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("callbackUrl") || "/admin/payments";
  const callbackUrl = raw.startsWith("/") ? raw : "/admin/payments";
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
          <div style={{ fontSize: "40px" }}>🚛</div>
          <h1 style={{ margin: "8px 0 4px", fontSize: "20px" }}>HaulitNG Admin</h1>
          <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>Sign in to manage your fleet</p>
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
