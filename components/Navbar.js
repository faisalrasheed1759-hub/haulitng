"use client";
import { useState, useEffect } from "react";
import Logo from "./Logo";

const navStyle = {
  display: "flex", alignItems: "center", gap: "20px",
  background: "#1a1a2e", padding: "12px 24px", color: "white",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  position: "relative",
};

const navLink = { color: "#a0aec0", textDecoration: "none", fontSize: "14px", fontWeight: 500 };

const links = [
  { href: "/equipment", label: "Equipment" },
  { href: "/book", label: "Book Transport" },
  { href: "/track/HLT-0001", label: "Track" },
  { href: "/dashboard", label: "Fleet" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/chats", label: "Chat" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <nav style={navStyle}>
      <a href="/" style={{ color: "white", textDecoration: "none", marginRight: "24px" }}><Logo size={20} /></a>
      {isMobile ? (
        <>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            role="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "8px", color: "white", fontSize: "24px", lineHeight: 1,
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
          {menuOpen && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0,
              background: "#1a1a2e", display: "flex", flexDirection: "column",
              padding: "12px 24px", gap: "12px", zIndex: 1000,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}>
              {links.map((l) => (
                <a key={l.href} href={l.href} style={navLink} onClick={() => setMenuOpen(false)}>{l.label}</a>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {links.map((l) => (
            <a key={l.href} href={l.href} style={navLink}>{l.label}</a>
          ))}
          <div style={{ flex: 1 }} />
        </>
      )}
    </nav>
  );
}
