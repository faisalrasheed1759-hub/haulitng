"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPayments() {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [confirmAmount, setConfirmAmount] = useState("");
  const [confirmType, setConfirmType] = useState("deposit");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const fetchData = async () => {
    try {
      const [bRes, pRes] = await Promise.all([
        fetch("/api/book"),
        fetch("/api/payments"),
      ]);
      const bData = await bRes.json();
      const pData = await pRes.json();
      setBookings(Array.isArray(bData) ? bData : bData.bookings || []);
      setPayments(pData.payments || []);
    } catch {
      setError("Failed to load data. Please try again.");
    }
  };

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, []);

  const setQuote = async (ref) => {
    if (!quoteAmount) return;
    setError(null);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set-quote", bookingRef: ref, quoteAmount: Number(quoteAmount) }),
      });
      if (!res.ok) { setError("Failed to set quote"); return; }
      setQuoteAmount("");
      setMsg(`Quote set for ${ref}`);
      await fetchData();
    } catch {
      setError("Network error setting quote");
    }
  };

  const confirmPayment = async (ref) => {
    if (!confirmAmount) return;
    if (!window.confirm(`Confirm ₦${Number(confirmAmount).toLocaleString()} payment for ${ref}?`)) return;
    setError(null);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirm-payment", bookingRef: ref, amount: Number(confirmAmount), type: confirmType }),
      });
      if (!res.ok) { setError("Failed to confirm payment"); return; }
      setConfirmAmount("");
      setMsg(`Payment confirmed for ${ref}`);
      await fetchData();
    } catch {
      setError("Network error confirming payment");
    }
  };

  const refresh = async () => {
    setError(null);
    await fetchData();
  };

  const allPayments = payments.reduce((acc, p) => {
    if (!acc[p.bookingRef]) acc[p.bookingRef] = [];
    acc[p.bookingRef].push(p);
    return acc;
  }, {});

  const totalCollected = payments.filter((p) => p.status === "confirmed").reduce((s, p) => s + p.amount, 0);
  const pendingBookings = bookings.filter((b) => !b.paymentStatus || b.paymentStatus === "pending" || b.paymentStatus === "quoted");
  const activeBookings = bookings.filter((b) => b.paymentStatus === "deposit_paid");
  const settledBookings = bookings.filter((b) => b.paymentStatus === "paid_in_full");

  if (loading) return <div style={{ padding: 24, textAlign: "center", color: "#888" }}>Loading...</div>;

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontSize: "22px" }}>💰 Payment Management</h1>
        <div style={{ fontSize: "13px", color: "#888" }}>
          Total Collected: <strong style={{ color: "#059669" }}>₦{totalCollected.toLocaleString()}</strong>
        </div>
      </div>

      {error && (
        <div style={{ background: "#fef2f2", color: "#b91c1c", padding: "10px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
          {error}
          <button onClick={() => setError(null)} style={{ float: "right", background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}>×</button>
        </div>
      )}

      {msg && (
        <div style={{ background: "#d1fae5", color: "#065f46", padding: "10px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
          {msg}
          <button onClick={() => setMsg("")} style={{ float: "right", background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}>×</button>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "20px" }}>
        <div style={{ background: "#fef3c7", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "#d97706" }}>{pendingBookings.length}</div>
          <div style={{ fontSize: "12px", color: "#92400e" }}>Needs Quote</div>
        </div>
        <div style={{ background: "#dbeafe", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "#2563eb" }}>{activeBookings.length}</div>
          <div style={{ fontSize: "12px", color: "#1e40af" }}>Awaiting Delivery</div>
        </div>
        <div style={{ background: "#d1fae5", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "#059669" }}>{settledBookings.length}</div>
          <div style={{ fontSize: "12px", color: "#065f46" }}>Settled</div>
        </div>
        <div style={{ background: "#f3f4f6", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: 700 }}>{bookings.length}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>Total Bookings</div>
        </div>
      </div>

      {/* All Bookings */}
      <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ padding: "16px", borderBottom: "1px solid #eee", background: "#f8f9fa" }}>
          <h3 style={{ margin: 0, fontSize: "15px" }}>All Bookings</h3>
        </div>
        {bookings.length === 0 ? (
          <div style={{ padding: "24px", textAlign: "center", color: "#888" }}>No bookings yet</div>
        ) : isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "12px" }}>
            {bookings.map((b) => {
              const bp = allPayments[b.reference] || [];
              const depPaid = bp.filter((p) => p.type === "deposit" && p.status === "confirmed").reduce((s, p) => s + p.amount, 0);
              const finPaid = bp.filter((p) => p.type === "final" && p.status === "confirmed").reduce((s, p) => s + p.amount, 0);
              const statusBg = b.paymentStatus === "paid_in_full" ? "#d1fae5" : b.paymentStatus === "deposit_paid" ? "#fef3c7" : "#f3f4f6";
              const statusColor = b.paymentStatus === "paid_in_full" ? "#059669" : b.paymentStatus === "deposit_paid" ? "#d97706" : "#6b7280";
              return (
                <div key={b.reference} style={{ border: "1px solid #eee", borderRadius: "8px", padding: "12px", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <strong>{b.reference}</strong>
                    <span style={{ background: statusBg, color: statusColor, padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 600 }}>
                      {b.paymentStatus?.replace(/_/g, " ") || "pending"}
                    </span>
                  </div>
                  <div style={{ display: "grid", gap: "4px", marginBottom: "8px" }}>
                    <div><strong>Customer:</strong> {b.name}</div>
                    <div><strong>Service:</strong> {b.serviceType}</div>
                    <div><strong>Amount:</strong> {b.quoteAmount ? `₦${Number(b.quoteAmount).toLocaleString()}` : "—"}</div>
                    <div><strong>Deposit:</strong> ₦{(b.depositAmount || 0).toLocaleString()} {depPaid > 0 && <span style={{ color: "#059669" }}>✓</span>}</div>
                    <div><strong>Final:</strong> ₦{(b.finalAmount || 0).toLocaleString()} {finPaid > 0 && <span style={{ color: "#059669" }}>✓</span>}</div>
                  </div>
                  {selected === b.reference ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {!b.quoteAmount ? (
                        <div style={{ display: "flex", gap: "4px" }}>
                          <input type="number" placeholder="Quote (₦)" value={quoteAmount} onChange={(e) => setQuoteAmount(e.target.value)}
                            style={{ flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "12px", minHeight: "44px" }} />
                          <button onClick={() => setQuote(b.reference)} style={{ ...btnBase, background: "#2c3e50" }}>Set</button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          <select value={confirmType} onChange={(e) => setConfirmType(e.target.value)}
                            style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "12px", minHeight: "44px" }}>
                            <option value="deposit">80% Deposit</option>
                            <option value="final">20% Final</option>
                          </select>
                          <input type="number" placeholder="Amount" value={confirmAmount} onChange={(e) => setConfirmAmount(e.target.value)}
                            style={{ flex: 1, minWidth: "80px", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "12px", minHeight: "44px" }} />
                          <button onClick={() => confirmPayment(b.reference)} style={{ ...btnBase, background: "#2c3e50" }}>✓</button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <button onClick={() => setSelected(b.reference)} style={{ ...btnBase, background: "#2c3e50" }}>Manage</button>
                      <Link href={`/payment/${b.reference}`} style={{ ...btnBase, background: "#d97706", color: "white", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>Invoice</Link>
                      <Link href={`/track/${b.reference}`} style={{ ...btnBase, background: "#27ae60", color: "white", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>Track</Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th style={th}>Ref</th>
                  <th style={th}>Customer</th>
                  <th style={th}>Service</th>
                  <th style={th}>Amount</th>
                  <th style={th}>Deposit (80%)</th>
                  <th style={th}>Final (20%)</th>
                  <th style={th}>Status</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const bp = allPayments[b.reference] || [];
                  const depPaid = bp.filter((p) => p.type === "deposit" && p.status === "confirmed").reduce((s, p) => s + p.amount, 0);
                  const finPaid = bp.filter((p) => p.type === "final" && p.status === "confirmed").reduce((s, p) => s + p.amount, 0);
                  return (
                    <tr key={b.reference} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={td}><strong>{b.reference}</strong></td>
                      <td style={td}>{b.name}</td>
                      <td style={td}>{b.serviceType}</td>
                      <td style={td}>{b.quoteAmount ? `₦${Number(b.quoteAmount).toLocaleString()}` : "—"}</td>
                      <td style={td}>
                        <span style={{ color: depPaid > 0 ? "#059669" : "#d97706" }}>
                          ₦{(b.depositAmount || 0).toLocaleString()}
                        </span>
                        {depPaid > 0 && <span style={{ color: "#059669", marginLeft: "4px" }}>✓</span>}
                      </td>
                      <td style={td}>
                        <span style={{ color: finPaid > 0 ? "#059669" : "#888" }}>
                          ₦{(b.finalAmount || 0).toLocaleString()}
                        </span>
                        {finPaid > 0 && <span style={{ color: "#059669", marginLeft: "4px" }}>✓</span>}
                      </td>
                      <td style={td}>
                        <span style={{
                          background: b.paymentStatus === "paid_in_full" ? "#d1fae5" :
                            b.paymentStatus === "deposit_paid" ? "#fef3c7" : "#f3f4f6",
                          color: b.paymentStatus === "paid_in_full" ? "#059669" :
                            b.paymentStatus === "deposit_paid" ? "#d97706" : "#6b7280",
                          padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 600,
                        }}>
                          {b.paymentStatus?.replace(/_/g, " ") || "pending"}
                        </span>
                      </td>
                      <td style={td}>
                        {selected === b.reference ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {!b.quoteAmount ? (
                              <div style={{ display: "flex", gap: "4px" }}>
                                <input type="number" placeholder="Quote (₦)" value={quoteAmount} onChange={(e) => setQuoteAmount(e.target.value)}
                                  style={{ width: "100px", padding: "6px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "12px" }} />
                                <button onClick={() => setQuote(b.reference)} style={smBtn}>Set</button>
                              </div>
                            ) : (
                              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                                <select value={confirmType} onChange={(e) => setConfirmType(e.target.value)} style={{ padding: "6px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "12px" }}>
                                  <option value="deposit">80% Deposit</option>
                                  <option value="final">20% Final</option>
                                </select>
                                <input type="number" placeholder="Amount" value={confirmAmount} onChange={(e) => setConfirmAmount(e.target.value)}
                                  style={{ width: "80px", padding: "6px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "12px" }} />
                                <button onClick={() => confirmPayment(b.reference)} style={smBtn}>✓</button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ display: "flex", gap: "4px" }}>
                            <button onClick={() => setSelected(b.reference)} style={smBtn}>Manage</button>
                            <Link href={`/payment/${b.reference}`} style={{ ...smBtn, textDecoration: "none", background: "#d97706", color: "white" }}>Invoice</Link>
                            <Link href={`/track/${b.reference}`} style={{ ...smBtn, textDecoration: "none", background: "#27ae60", color: "white" }}>Track</Link>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const th = { padding: "10px 12px", textAlign: "left", fontWeight: 600, fontSize: "12px", color: "#555", borderBottom: "2px solid #ddd" };
const td = { padding: "10px 12px", fontSize: "13px" };
const smBtn = {
  display: "inline-block", padding: "6px 12px", background: "#2c3e50", color: "white",
  border: "none", borderRadius: "4px", fontSize: "11px", fontWeight: 600, cursor: "pointer",
};
const btnBase = {
  padding: "10px 16px", border: "none", borderRadius: "4px", fontSize: "12px",
  fontWeight: 600, cursor: "pointer", color: "white", minHeight: "44px",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
};
