"use client";
import { useState } from "react";
import { getEquipmentItem } from "@/lib/equipment";
import Link from "next/link";
import EquipmentImage from "@/components/EquipmentImage";

const formatPrice = (p) => "₦" + p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default function EquipmentDetail({ params }) {
  const item = getEquipmentItem(params.id);
  const [submitted, setSubmitted] = useState(false);

  if (!item) {
    return (
      <div style={{ padding: "40px", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔍</div>
        <h2>Equipment not found</h2>
        <Link href="/equipment" style={{
          display: "inline-block", padding: "10px 20px", background: "#2c3e50",
          color: "white", textDecoration: "none", borderRadius: "8px",
        }}>Browse all equipment</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "16px" }}>
        <Link href="/equipment" style={{ color: "#666", textDecoration: "none", fontSize: "14px" }}>← Back to equipment</Link>
      </div>

      <div style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <EquipmentImage category={item.category} image={item.images?.[0]} height={240} fontSize="96px" />

        <div style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "22px" }}>{item.brand} {item.model}</h1>
              <p style={{ margin: "4px 0", color: "#666", fontSize: "14px" }}>{item.type} — {item.year}</p>
            </div>
            <span style={{
              padding: "6px 16px", borderRadius: "12px", fontSize: "13px", fontWeight: 600, color: "white",
              background: item.condition === "Excellent" ? "#27ae60" : item.condition === "Good" ? "#e67e22" : "#e74c3c",
            }}>{item.condition}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginBottom: "20px", padding: "14px", background: "#f8f9fa", borderRadius: "8px", fontSize: "13px" }}>
            <div><strong>Hours:</strong> {item.hours > 0 ? item.hours.toLocaleString() : "New"}</div>
            <div><strong>Weight:</strong> {(item.weight_kg / 1000).toFixed(1)} tons</div>
            <div><strong>Location:</strong> {item.location}</div>
            <div><strong>Status:</strong> <span style={{ color: "#27ae60" }}>Available</span></div>
          </div>

          {/* Pricing Section */}
          <div style={{
            marginBottom: "24px", padding: "16px", borderRadius: "8px",
            background: item.mode === "both" ? "#f0fdf4" : item.mode === "sale" ? "#fef2f2" : "#eef2ff",
          }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "16px" }}>💰 Pricing Options</h3>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {(item.mode === "sale" || item.mode === "both") && (
                <div>
                  <div style={{ fontSize: "12px", color: "#888" }}>Purchase Price</div>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: "#166534" }}>{formatPrice(item.price)}</div>
                </div>
              )}
              {(item.mode === "lease" || item.mode === "both") && (
                <div>
                  <div style={{ fontSize: "12px", color: "#888" }}>Lease Rates</div>
                  <div style={{ display: "flex", gap: "16px", marginTop: "4px" }}>
                    <div><span style={{ fontSize: "18px", fontWeight: 700, color: "#2c3e50" }}>{formatPrice(item.leaseDaily)}</span><span style={{ fontSize: "12px", color: "#888" }}> /day</span></div>
                    <div><span style={{ fontSize: "18px", fontWeight: 700, color: "#2c3e50" }}>{formatPrice(item.leaseMonthly)}</span><span style={{ fontSize: "12px", color: "#888" }}> /month</span></div>
                  </div>
                </div>
              )}
            </div>
            {item.mode === "both" && (
              <div style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>
                Available for both purchase and short/long-term lease
              </div>
            )}
          </div>

          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "16px" }}>Description</h3>
            <p style={{ color: "#555", lineHeight: "1.7", fontSize: "14px" }}>{item.description}</p>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "16px" }}>Features</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "6px" }}>
              {item.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#555" }}>
                  <span style={{ color: "#27ae60" }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>

          {item.transport_needed && (
            <div style={{ padding: "14px", background: "#eef2ff", borderRadius: "8px", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "18px" }}>🚛</span>
                <strong style={{ fontSize: "14px" }}>Need transport for this {(item.weight_kg / 1000).toFixed(1)}-ton {item.type.toLowerCase()}?</strong>
              </div>
              <p style={{ margin: 0, fontSize: "13px", color: "#555" }}>
                HaulitNG delivers nationwide. Lowbed trailers available — flat rate or per-km pricing.
              </p>
            </div>
          )}

          <div style={{ padding: "16px", background: "#f8f9fa", borderRadius: "8px" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "16px" }}>
              {(item.mode === "lease" || item.mode === "both") ? "📅 Enquire to Buy or Lease" : "📩 Enquire"}
            </h3>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "12px", color: "#166534", fontWeight: 600 }}>
                ✅ Enquiry submitted! We'll contact you shortly.
              </div>
            ) : (
              <form onSubmit={async (e) => { e.preventDefault(); const fd = new FormData(e.target); await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(fd)) }); setSubmitted(true); }} style={{ display: "grid", gap: "10px" }}>
                <input type="hidden" name="equipmentId" value={item.id} />
                <input placeholder="Your full name" name="name" required style={inputStyle} />
                <input placeholder="Phone number" name="phone" required style={inputStyle} />
                <select name="interest" style={inputStyle} defaultValue="">
                  <option value="" disabled>I&apos;m interested in...</option>
                  <option value="purchase">Purchasing</option>
                  {(item.mode === "lease" || item.mode === "both") && <option value="lease">Leasing / Rent</option>}
                  {(item.mode === "both") && <option value="both">Both — explore options</option>}
                  <option value="transport">Only need transport</option>
                </select>
                <textarea placeholder="Message" name="message" rows="2" style={{ ...inputStyle, resize: "vertical" }}></textarea>
                <button type="submit" style={{
                  padding: "12px", background: "#2c3e50", color: "white", border: "none",
                  borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer",
                }}>Send enquiry</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 12px", border: "1px solid #ddd",
  borderRadius: "6px", fontSize: "13px", boxSizing: "border-box",
};
