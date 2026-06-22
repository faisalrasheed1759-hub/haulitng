"use client";
import { useState } from "react";
import Link from "next/link";
import { config } from "@/lib/config";

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    serviceType: "",
    equipmentType: "",
    pickup: "",
    destination: "",
    weight: "",
    date: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});

  const update = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const blur = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const step1Required = ["name", "phone", "serviceType"];
  const isHaulage = form.serviceType === "haulage" || form.serviceType === "both" || form.serviceType === "other";
  const step2Required = isHaulage ? ["pickup", "destination"] : ["equipmentType"];

  const validateStep1 = () => step1Required.every((f) => form[f]);
  const validateStep2 = () => step2Required.every((f) => form[f]);

  const submit = async () => {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.booking) { setError("Server error. Please try again."); setSending(false); return; }
      setSubmitted(data.booking);
    } catch {
      setError("Network error. Please check your connection and try again.");
    }
    setSending(false);
  };

  if (submitted) {
    return (
      <div style={{ padding: "40px 20px", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
        <h1>Request Submitted!</h1>
        <div style={{
          background: "white", borderRadius: "12px", padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginTop: "20px",
        }}>
          <p><strong>Reference:</strong> {submitted.reference}</p>
          <p style={{ fontSize: "14px", color: "#555" }}>We'll contact you within 24 hours with a quote and truck assignment.</p>
          <p style={{ fontSize: "14px", color: "#555" }}>Save your reference number to track your delivery status.</p>

          {/* Payment terms info */}
          <div style={{
            background: "#1a1a2e", color: "white", borderRadius: "8px",
            padding: "16px", margin: "16px 0", fontSize: "13px",
          }}>
            <div style={{ fontWeight: 600, marginBottom: "8px" }}>💰 Payment Terms</div>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
              <div><span style={{ color: "#fbbf24", fontWeight: 700 }}>80%</span> before trip</div>
              <div style={{ color: "#555" }}>+</div>
              <div><span style={{ color: "#34d399", fontWeight: 700 }}>20%</span> on delivery</div>
            </div>
          </div>

          <div style={{ marginTop: "16px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={`/payment/${submitted.reference}`} style={{ ...btn, background: "#d97706" }}>💰 View Invoice</Link>
            <Link href={`/track/${submitted.reference}`} style={{ ...btn, background: "#27ae60" }}>📍 Track Later</Link>
            <Link href="/equipment" style={btn}>Browse Equipment</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ margin: "0 0 8px" }}>🚛 Book Haulage or Request Quote</h1>
        <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
          Tell us what you need — we'll get back to you with a price and schedule within 24 hours
        </p>
      </div>

      {/* Steps indicator */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
        {["Details", "Service", "Submit"].map((label, i) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "6px 14px", borderRadius: "20px",
            background: step >= i + 1 ? "#2c3e50" : "#eee",
            color: step >= i + 1 ? "white" : "#888",
            fontSize: "13px", fontWeight: 500,
          }}>
            {i + 1}. {label}
          </div>
        ))}
      </div>

      <div style={{ background: "white", borderRadius: "12px", padding: "32px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        {step === 1 && (
          <div style={{ display: "grid", gap: "16px" }}>
            <h3 style={{ margin: 0 }}>Your Details</h3>
            <input placeholder="Full name *" value={form.name} onBlur={() => blur("name")} onChange={(e) => update("name", e.target.value)} style={{ ...input, borderColor: touched.name && !form.name ? "#e74c3c" : "#ddd" }} />
            {touched.name && !form.name && <span style={{ color: "#e74c3c", fontSize: "12px" }}>Full name is required</span>}
            <input placeholder="Phone number *" value={form.phone} onBlur={() => blur("phone")} onChange={(e) => update("phone", e.target.value)} style={{ ...input, borderColor: touched.phone && !form.phone ? "#e74c3c" : "#ddd" }} />
            {touched.phone && !form.phone && <span style={{ color: "#e74c3c", fontSize: "12px" }}>Phone number is required</span>}
            <input placeholder="Email (optional)" value={form.email} onChange={(e) => update("email", e.target.value)} style={input} />
            <select value={form.serviceType} onBlur={() => blur("serviceType")} onChange={(e) => update("serviceType", e.target.value)} style={{ ...input, borderColor: touched.serviceType && !form.serviceType ? "#e74c3c" : "#ddd" }}>
              <option value="">What do you need? *</option>
              <option value="haulage">Heavy equipment haulage (lowbed/trailer)</option>
              <option value="buy">Buy equipment</option>
              <option value="lease">Lease/rent equipment</option>
              <option value="both">Buy + transport</option>
              <option value="other">Other logistics</option>
            </select>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => { const all = ["name", "phone", "serviceType"]; all.forEach((f) => blur(f)); if (validateStep1()) setStep(2); }} style={btnStyle}>Next →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "grid", gap: "16px" }}>
            <h3 style={{ margin: 0 }}>Service Details</h3>
            {isHaulage ? (
              <>
                <input placeholder="Pickup location *" value={form.pickup} onBlur={() => blur("pickup")} onChange={(e) => update("pickup", e.target.value)} style={{ ...input, borderColor: touched.pickup && !form.pickup ? "#e74c3c" : "#ddd" }} />
                {touched.pickup && !form.pickup && <span style={{ color: "#e74c3c", fontSize: "12px" }}>Pickup location is required</span>}
                <input placeholder="Destination *" value={form.destination} onBlur={() => blur("destination")} onChange={(e) => update("destination", e.target.value)} style={{ ...input, borderColor: touched.destination && !form.destination ? "#e74c3c" : "#ddd" }} />
                {touched.destination && !form.destination && <span style={{ color: "#e74c3c", fontSize: "12px" }}>Destination is required</span>}
                <select value={form.weight} onChange={(e) => update("weight", e.target.value)} style={input}>
                  <option value="">Estimated weight</option>
                  <option value="<5">Under 5 tons</option>
                  <option value="5-15">5–15 tons</option>
                  <option value="15-30">15–30 tons</option>
                  <option value="30-50">30–50 tons</option>
                  <option value="50-80">50–80 tons</option>
                  <option value=">80">Over 80 tons</option>
                </select>
                <input placeholder="Equipment type (crane, excavator, etc.)" value={form.equipmentType} onChange={(e) => update("equipmentType", e.target.value)} style={input} />
                <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} style={input} />
              </>
            ) : (
              <>
                <select value={form.equipmentType} onBlur={() => blur("equipmentType")} onChange={(e) => update("equipmentType", e.target.value)} style={{ ...input, borderColor: touched.equipmentType && !form.equipmentType ? "#e74c3c" : "#ddd" }}>
                  <option value="">Equipment interested in *</option>
                  <option value="excavator">Excavator</option>
                  <option value="crane">Crane</option>
                  <option value="dozer">Bulldozer</option>
                  <option value="grader">Grader</option>
                  <option value="swamp-buggy">Swamp Buggy</option>
                  <option value="forklift">Forklift</option>
                  <option value="trailer">Lowbed Trailer</option>
                  <option value="other">Other</option>
                </select>
                {touched.equipmentType && !form.equipmentType && <span style={{ color: "#e74c3c", fontSize: "12px" }}>Equipment type is required</span>}
                <input placeholder="Location for delivery" value={form.destination} onChange={(e) => update("destination", e.target.value)} style={input} />
              </>
            )}
            <textarea placeholder="Additional details or special requirements" value={form.message} onChange={(e) => update("message", e.target.value)} rows="3" style={{ ...input, resize: "vertical" }} />
            {error && <div style={{ background: "#fef2f2", color: "#b91c1c", padding: "10px 16px", borderRadius: "8px", fontSize: "13px" }}>{error}</div>}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setStep(1)} style={{ ...btnStyle, background: "#95a5a6" }}>← Back</button>
              <button onClick={() => { step2Required.forEach((f) => blur(f)); if (validateStep2()) submit(); }} disabled={sending} style={{ ...btnStyle, opacity: sending ? 0.7 : 1 }}>
                {sending ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: "24px", padding: "16px", background: "#eef2ff", borderRadius: "8px", fontSize: "13px", color: "#555" }}>
        <strong>Need faster service?</strong> Call or WhatsApp <strong>{config.phone}</strong> for immediate assistance.
      </div>
    </div>
  );
}

const input = {
  width: "100%", padding: "12px 14px", border: "1px solid #ddd",
  borderRadius: "8px", fontSize: "14px", boxSizing: "border-box",
};
const btnStyle = {
  padding: "12px 28px", background: "#2c3e50", color: "white",
  border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer",
};
const btn = {
  display: "inline-block", padding: "10px 20px", background: "#2c3e50",
  color: "white", textDecoration: "none", borderRadius: "6px", fontSize: "14px",
};
