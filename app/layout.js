import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { config } from "@/lib/config";

const ChatWidget = dynamic(() => import("@/components/ChatWidget"));

export const metadata = {
  metadataBase: new URL('https://haulit.ng'),
  title: "HaulitNG — Heavy Equipment Sales, Leasing & Haulage Logistics",
  description: "Nigeria's trusted partner for cranes, excavators, bulldozers, graders, swamp buggies. Nationwide delivery, fleet tracking, and equipment leasing.",
  openGraph: {
    title: "HaulitNG — Heavy Equipment Sales, Leasing & Haulage",
    description: "Nigeria's trusted partner for cranes, excavators, bulldozers, graders, swamp buggies.",
    url: "https://haulit.ng",
    siteName: "HaulitNG",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HaulitNG",
    description: "Heavy equipment sales, leasing, and haulage logistics across Nigeria",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      </head>
      <body style={{
        margin: 0,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: "#f5f5f5",
        color: "#1a1a1a",
      }}>
        <Navbar />
        <main id="main-content">{children}</main>
        <footer style={{
          textAlign: "center", padding: "20px", fontSize: "13px",
          background: "#1a1a2e", color: "#4a5568",
        }}>
          <p style={{ margin: "4px 0" }}>HaulitNG — Port Harcourt • Onne • Nationwide</p>
          <p style={{ margin: "4px 0", fontSize: "12px" }}>Heavy equipment sales, leasing, and haulage logistics across Nigeria</p>
          <p style={{ margin: "4px 0", fontSize: "11px" }}>Contact: {config.phone} | {config.email}</p>
          <p style={{ margin: "8px 0 0", fontSize: "12px" }}>
            <a href="/privacy" style={{ color: "#718096", textDecoration: "underline" }}>Privacy Policy</a>
          </p>
        </footer>
        <ChatWidget />
      </body>
    </html>
  );
}
