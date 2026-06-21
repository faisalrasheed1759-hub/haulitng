"use client";
import { useState } from "react";
import Link from "next/link";

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

  const update = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const submit = async () => {
    setSending(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setSubmitted(data.booking);
    } catch {}
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
            <input placeholder="Full name *" value={form.name} onChange={(e) => update("name", e.target.value)} style={input} />
            <input placeholder="Phone number *" value={form.phone} onChange={(e) => update("phone", e.target.value)} style={input} />
            <input placeholder="Email (optional)" value={form.email} onChange={(e) => update("email", e.target.value)} style={input} />
            <select value={form.serviceType} onChange={(e) => update("serviceType", e.target.value)} style={input}>
              <option value="">What do you need? *</option>
              <option value="haulage">Heavy equipment haulage (lowbed/trailer)</option>
              <option value="buy">Buy equipment</option>
              <option value="lease">Lease/rent equipment</option>
              <option value="both">Buy + transport</option>
              <option value="other">Other logistics</option>
            </select>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => { if (form.name && form.phone && form.serviceType) setStep(2); else alert("Fill required fields"); }} style={btnStyle}>Next →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "grid", gap: "16px" }}>
            <h3 style={{ margin: 0 }}>Service Details</h3>
            {form.serviceType === "haulage" || form.serviceType === "both" || form.serviceType === "other" ? (
              <>
                <input placeholder="Pickup location *" value={form.pickup} onChange={(e) => update("pickup", e.target.value)} style={input} />
                <input placeholder="Destination *" value={form.destination} onChange={(e) => update("destination", e.target.value)} style={input} />
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
                <select value={form.equipmentType} onChange={(e) => update("equipmentType", e.target.value)} style={input}>
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
                <input placeholder="Location for delivery" value={form.destination} onChange={(e) => update("destination", e.target.value)} style={input} />
              </>
            )}
            <textarea placeholder="Additional details or special requirements" value={form.message} onChange={(e) => update("message", e.target.value)} rows="3" style={{ ...input, resize: "vertical" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setStep(1)} style={{ ...btnStyle, background: "#95a5a6" }}>← Back</button>
              <button onClick={submit} disabled={sending} style={{ ...btnStyle, opacity: sending ? 0.7 : 1 }}>
                {sending ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: "24px", padding: "16px", background: "#eef2ff", borderRadius: "8px", fontSize: "13px", color: "#555" }}>
        <strong>Need faster service?</strong> Call or WhatsApp <strong>0912 076 4728</strong> for immediate assistance.
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
