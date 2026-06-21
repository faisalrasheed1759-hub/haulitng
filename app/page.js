import Link from "next/link";
import { readFileSync, existsSync } from "fs";
import path from "path";

function getStats() {
  try {
    const fp = path.join(process.cwd(), "data", "bookings.json");
    if (!existsSync(fp)) return { total: 0, pending: 0, active: 0, completed: 0 };
    const b = JSON.parse(readFileSync(fp, "utf-8"));
    return {
      total: b.length,
      pending: b.filter((x) => x.status === "pending").length,
      active: b.filter((x) => x.status === "active").length,
      completed: b.filter((x) => x.status === "completed").length,
    };
  } catch {
    return { total: 0, pending: 0, active: 0, completed: 0 };
  }
}

export default function HomePage() {
  const stats = getStats();

  return (
    <>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        color: "white", padding: "80px 24px 60px", textAlign: "center",
      }}>
        <div style={{ fontSize: "72px", marginBottom: "8px" }}>🚛</div>
        <h1 style={{ fontSize: "40px", margin: "0 0 8px", fontWeight: 800 }}>HaulitNG</h1>
        <p style={{ fontSize: "18px", color: "#a0aec0", maxWidth: "600px", margin: "0 auto 32px", lineHeight: 1.6 }}>
          Heavy equipment sales, leasing, and haulage logistics across Nigeria
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/book" style={btnPrimary}>📋 Request Quote</Link>
          <Link href="/equipment" style={btnSecondary}>🏗️ Browse Equipment</Link>
          <a href="tel:09120764728" style={btnSecondary}>📞 Call Us</a>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "60px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "28px", marginBottom: "40px" }}>How It Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
          {[
            { step: "1", icon: "📝", title: "Tell Us What You Need", desc: "Fill our simple form — equipment type, pickup, destination, or which machine you want to buy or lease." },
            { step: "2", icon: "🔍", title: "We Give You a Quote", desc: "We respond with pricing, availability, and schedule within 24 hours — no obligation." },
            { step: "3", icon: "🚛", title: "We Deliver", desc: "We dispatch the right truck, equipment, or lowbed trailer to your site anywhere in Nigeria." },
            { step: "4", icon: "📍", title: "Track Live", desc: "Follow your delivery in real-time via your unique tracking link — no app download needed." },
          ].map((f) => (
            <div key={f.step} style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", position: "relative" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%", background: "#2c3e50",
                color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "14px", marginBottom: "12px",
              }}>{f.step}</div>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{f.icon}</div>
              <h3 style={{ margin: "0 0 8px", fontSize: "16px" }}>{f.title}</h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#666", lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "40px 24px", background: "#1a1a2e", color: "white" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "24px", textAlign: "center" }}>
          <div><div style={{ fontSize: "28px", fontWeight: 800 }}>{stats.total}</div><div style={{ fontSize: "13px", color: "#a0aec0" }}>Bookings</div></div>
          <div><div style={{ fontSize: "28px", fontWeight: 800, color: "#e67e22" }}>{stats.active}</div><div style={{ fontSize: "13px", color: "#a0aec0" }}>Active</div></div>
          <div><div style={{ fontSize: "28px", fontWeight: 800, color: "#27ae60" }}>{stats.completed}</div><div style={{ fontSize: "13px", color: "#a0aec0" }}>Delivered</div></div>
          <div><div style={{ fontSize: "28px", fontWeight: 800 }}>7</div><div style={{ fontSize: "13px", color: "#a0aec0" }}>Equipment Categories</div></div>
          <div><div style={{ fontSize: "28px", fontWeight: 800 }}>24</div><div style={{ fontSize: "13px", color: "#a0aec0" }}>Machines Available</div></div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: "60px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "28px", marginBottom: "40px" }}>Our Services</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {[
            {
              icon: "🏗️", title: "Heavy Equipment Sales",
              desc: "Cranes (7.5t–60t), excavators, bulldozers, graders, swamp buggies, forklifts, lowbed trailers. Buy outright with nationwide delivery.",
              link: "/equipment", cta: "View Inventory",
            },
            {
              icon: "📋", title: "Equipment Leasing",
              desc: "Short-term and long-term lease options on all equipment categories. Daily or monthly rates — flexible terms.",
              link: "/equipment", cta: "See Lease Options",
            },
            {
              icon: "🚛", title: "Haulage & Logistics",
              desc: "Lowbed trailer haulage for heavy equipment, oversize loads, and project cargo. Permits, escorts, and route planning included.",
              link: "/book", cta: "Book Haulage",
            },
          ].map((s) => (
            <div key={s.title} style={{ background: "white", borderRadius: "12px", padding: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>{s.icon}</div>
              <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>{s.title}</h3>
              <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.6, marginBottom: "16px" }}>{s.desc}</p>
              <Link href={s.link} style={{ color: "#2c3e50", fontWeight: 600, fontSize: "14px", textDecoration: "underline" }}>{s.cta} →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section style={{ padding: "60px 24px", background: "#f0f4ff" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "32px" }}>Why HaulitNG?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", textAlign: "left" }}>
            {[
              { icon: "📍", title: "Real-Time Tracking", desc: "Share a live tracking link with your client — no app needed" },
              { icon: "🔧", title: "End-to-End Service", desc: "From equipment selection to delivery and setup — we handle it all" },
              { icon: "💰", title: "Buy or Lease", desc: "Purchase outright or lease with flexible daily/monthly rates" },
              { icon: "📞", title: "24h Response", desc: "Quote requests answered within 24 hours — often same day" },
              { icon: "🗺️", title: "Nationwide Coverage", desc: "Port Harcourt, Onne, Lagos, Abuja, Warri — we deliver anywhere" },
              { icon: "🛡️", title: "Insured & Permitted", desc: "All loads fully insured with proper permits and escorts" },
            ].map((f) => (
              <div key={f.title}>
                <div style={{ fontSize: "24px", marginBottom: "4px" }}>{f.icon}</div>
                <h4 style={{ margin: "0 0 4px", fontSize: "14px" }}>{f.title}</h4>
                <p style={{ margin: 0, fontSize: "12px", color: "#666", lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "60px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>Ready to move?</h2>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>Contact us today — we'll get you a quote within 24 hours</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/book" style={btnPrimary}>📋 Request Quote</Link>
          <a href="https://wa.me/2349120764728" target="_blank" style={{ ...btnSecondary, background: "#25D366", border: "none", color: "white" }}>💬 WhatsApp</a>
        </div>
      </section>

      {/* Admin links */}
      <div style={{ textAlign: "center", padding: "20px", fontSize: "12px", color: "#888" }}>
        <Link href="/dashboard" style={{ color: "#888" }}>Fleet Dashboard</Link>
        <span style={{ margin: "0 8px" }}>|</span>
        <Link href="/admin/chats" style={{ color: "#888" }}>Admin Chat</Link>
        <span style={{ margin: "0 8px" }}>|</span>
        <Link href="/driver" style={{ color: "#888" }}>Driver Check-in</Link>
      </div>
    </>
  );
}

const btnPrimary = {
  display: "inline-block", padding: "14px 32px", background: "#27ae60",
  color: "white", textDecoration: "none", borderRadius: "10px",
  fontSize: "16px", fontWeight: 600, border: "none", cursor: "pointer",
};
const btnSecondary = {
  display: "inline-block", padding: "14px 32px", background: "transparent",
  color: "white", textDecoration: "none", borderRadius: "10px",
  fontSize: "16px", fontWeight: 600, border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer",
};
