import ChatWidget from "@/components/ChatWidget";

export const metadata = {
  title: "HaulitNG — Heavy Equipment Sales, Leasing & Haulage Logistics",
  description: "Nigeria's trusted partner for cranes, excavators, bulldozers, graders, swamp buggies. Nationwide delivery, fleet tracking, and equipment leasing.",
};

const navStyle = {
  display: "flex", alignItems: "center", gap: "20px",
  background: "#1a1a2e", padding: "12px 24px", color: "white",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const navLink = { color: "#a0aec0", textDecoration: "none", fontSize: "14px", fontWeight: 500 };
const navLinkActive = { color: "white", textDecoration: "none", fontSize: "14px", fontWeight: 600 };
const logoStyle = { fontSize: "20px", fontWeight: 800, color: "white", textDecoration: "none", marginRight: "24px" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚛</text></svg>" />
      </head>
      <body style={{
        margin: 0,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: "#f5f5f5",
        color: "#1a1a1a",
      }}>
        <nav style={navStyle}>
          <a href="/" style={logoStyle}>🚛 HaulitNG</a>
          <a href="/equipment" style={navLink}>Equipment</a>
          <a href="/book" style={navLink}>Book Transport</a>
          <a href="/track/HLT-0001" style={navLink}>Track</a>
          <div style={{ flex: 1 }} />
          <a href="/dashboard" style={navLink}>Fleet</a>
          <a href="/admin/payments" style={navLink}>Payments</a>
          <a href="/admin/chats" style={navLink}>Chat</a>
        </nav>
        {children}
        <footer style={{
          textAlign: "center", padding: "20px", fontSize: "13px", color: "#888",
          background: "#1a1a2e", color: "#4a5568",
        }}>
          <p style={{ margin: "4px 0" }}>🚛 HaulitNG — Port Harcourt • Onne • Nationwide</p>
          <p style={{ margin: "4px 0", fontSize: "12px" }}>Heavy equipment sales, leasing, and haulage logistics across Nigeria</p>
          <p style={{ margin: "4px 0", fontSize: "11px" }}>Contact: 0912 076 4728 | hello@haulitng.com</p>
        </footer>
        <ChatWidget />
      </body>
    </html>
  );
}
