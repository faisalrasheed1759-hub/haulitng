"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function PaymentPage() {
  const params = useParams();
  const ref = params?.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref) return;
    fetch(`/api/payment?ref=${ref.toUpperCase()}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [ref]);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Loading...</div>;
  if (!data || !data.booking) return <div style={{ padding: 40, textAlign: "center" }}><h2>Not found</h2></div>;

  const { booking, payments, balance } = data;
  const depositPaid = payments?.filter((p) => p.type === "deposit" && p.status === "confirmed").reduce((s, p) => s + p.amount, 0) || 0;
  const finalPaid = payments?.filter((p) => p.type === "final" && p.status === "confirmed").reduce((s, p) => s + p.amount, 0) || 0;
  const totalPaid = depositPaid + finalPaid;

  const statusColors = {
    quoted: { bg: "#eef2ff", color: "#4f46e5" },
    deposit_paid: { bg: "#fef3c7", color: "#d97706" },
    paid_in_full: { bg: "#d1fae5", color: "#059669" },
  };
  const sc = statusColors[booking.paymentStatus] || { bg: "#f3f4f6", color: "#6b7280" };

  return (
    <div style={{ padding: "24px", maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ fontSize: "48px" }}>📄</div>
        <h1 style={{ margin: "8px 0" }}>Invoice — {booking.reference}</h1>
        <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>HaulitNG — Heavy Equipment & Haulage Logistics</p>
      </div>

      {/* Payment Terms Banner */}
      <div style={{
        background: "#1a1a2e", color: "white", borderRadius: "12px",
        padding: "20px", marginBottom: "20px", textAlign: "center",
      }}>
        <div style={{ fontSize: "14px", opacity: 0.8, marginBottom: "8px" }}>Payment Terms</div>
        <div style={{ display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap" }}>
          <div><div style={{ fontSize: "24px", fontWeight: 800, color: "#fbbf24" }}>80%</div><div style={{ fontSize: "12px", opacity: 0.7 }}>Due Before Trip</div></div>
          <div style={{ fontSize: "32px", opacity: 0.3, display: "flex", alignItems: "center" }}>+</div>
          <div><div style={{ fontSize: "24px", fontWeight: 800, color: "#34d399" }}>20%</div><div style={{ fontSize: "12px", opacity: 0.7 }}>Due On Delivery</div></div>
        </div>
      </div>

      {/* Booking Summary */}
      <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: "16px" }}>Booking Summary</h3>
        <div style={{ display: "grid", gap: "6px", fontSize: "14px" }}>
          <div><strong>Service:</strong> {booking.serviceType}</div>
          {booking.pickup && <div><strong>Pickup:</strong> {booking.pickup}</div>}
          {booking.destination && <div><strong>Destination:</strong> {booking.destination}</div>}
          {booking.name && <div><strong>Customer:</strong> {booking.name}</div>}
          <div><strong>Status:</strong> <span style={{ background: sc.bg, color: sc.color, padding: "2px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: 600 }}>{booking.paymentStatus?.replace(/_/g, " ")}</span></div>
        </div>
      </div>

      {/* Price Breakdown */}
      {booking.quoteAmount && (
        <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "16px" }}>Payment Breakdown</h3>
          <div style={{ display: "grid", gap: "8px", fontSize: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <span>Total Quote</span>
              <span style={{ fontWeight: 700 }}>₦{Number(booking.quoteAmount).toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <span>Deposit (80%) — <span style={{ color: "#d97706" }}>Due before trip</span></span>
              <span style={{ fontWeight: 700, color: "#d97706" }}>₦{Number(booking.depositAmount || booking.quoteAmount * 0.8).toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <span>Final Payment (20%) — <span style={{ color: "#059669" }}>Due on delivery</span></span>
              <span style={{ fontWeight: 700, color: "#059669" }}>₦{Number(booking.finalAmount || booking.quoteAmount * 0.2).toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
              <span>Total Paid</span>
              <span style={{ fontWeight: 700, color: totalPaid >= booking.quoteAmount ? "#059669" : "#d97706" }}>₦{totalPaid.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Payment History */}
      {payments && payments.length > 0 && (
        <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "16px" }}>Payment History</h3>
          {payments.map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee", fontSize: "13px" }}>
              <div>
                <span style={{ fontWeight: 600, textTransform: "capitalize" }}>{p.type}</span>
                <span style={{ color: "#888", marginLeft: "8px" }}>{new Date(p.confirmedAt || p.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>₦{Number(p.amount).toLocaleString()}</span>
                <span style={{ color: "#059669", marginLeft: "8px", fontSize: "12px" }}>✓ Confirmed</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bank Transfer Details */}
      <div style={{ background: "#fef3c7", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: "16px" }}>🏦 Bank Transfer Details</h3>
        <p style={{ fontSize: "13px", color: "#92400e", margin: "0 0 12px" }}>
          Transfer to the account below and send confirmation to <strong>0912 076 4728</strong> (WhatsApp).
          We'll confirm your payment within 1 hour.
        </p>
        <div style={{ background: "white", borderRadius: "8px", padding: "16px", fontSize: "14px" }}>
          <div style={{ display: "grid", gap: "6px" }}>
            <div><strong>Bank:</strong> GTBank</div>
            <div><strong>Account Name:</strong> HaulitNG Logistics</div>
            <div><strong>Account Number:</strong> 0123 456 7890</div>
            <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "8px 0" }} />
            <div style={{ fontSize: "12px", color: "#888" }}>
              <strong>Reference:</strong> Use your booking code <strong>{booking.reference}</strong> as payment description
            </div>
          </div>
        </div>
        <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
          <a href={`https://wa.me/2349120764728?text=I%20have%20paid%20for%20${booking.reference}`}
            target="_blank"
            style={{
              flex: 1, textAlign: "center", padding: "12px", background: "#25D366", color: "white",
              textDecoration: "none", borderRadius: "8px", fontWeight: 600, fontSize: "14px",
            }}>
            💬 Confirm via WhatsApp
          </a>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "24px", fontSize: "12px", color: "#888" }}>
        HaulitNG — Port Harcourt • Onne • Nationwide
      </div>
    </div>
  );
}
