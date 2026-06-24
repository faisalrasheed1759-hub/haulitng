import { config } from "@/lib/config";

export const metadata = {
  title: "Privacy Policy — HaulitNG",
  description: "HaulitNG privacy policy — how we collect, use, and protect your personal data",
};

const sectionStyle = {
  maxWidth: "800px", margin: "0 auto", padding: "40px 20px",
  lineHeight: 1.7, fontSize: "14px", color: "#333",
};

export default function PrivacyPage() {
  return (
    <div style={sectionStyle}>
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Privacy Policy</h1>
      <p style={{ fontSize: "12px", color: "#888", marginBottom: "32px" }}>Last updated: June 2026</p>

      <h2>1. Introduction</h2>
      <p>HaulitNG ("we", "our", "us") respects your privacy. This policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>haulit.ng</strong> and use our services.</p>

      <h2>2. Information We Collect</h2>
      <p><strong>Personal Data:</strong> Name, phone number, email address, delivery/pickup locations, and any details you provide in booking forms, inquiries, or chat messages.</p>
      <p><strong>Usage Data:</strong> Pages visited, time spent, referring URLs, and browser type via cookies and analytics.</p>
      <p><strong>Device Data:</strong> IP address, browser type, operating system.</p>

      <h2>3. How We Use Your Information</h2>
      <p>We use your data to: process bookings and equipment inquiries; communicate trip updates, quotes, and payment confirmations; improve our website and services; respond to support requests via chat, email, or phone; comply with legal obligations.</p>

      <h2>4. Payment Processing</h2>
      <p>We collect payment details (bank transfer confirmations) manually. We do not store credit/debit card numbers. Online payment integration will be handled by PCI-compliant third-party processors.</p>

      <h2>5. Data Sharing</h2>
      <p>We do not sell your personal data. We may share information with: drivers and logistics partners (for trip coordination only); payment processors (when integrated); law enforcement if required by Nigerian law.</p>

      <h2>6. Data Retention</h2>
      <p>We retain personal data for as long as necessary to provide services and comply with legal obligations. Chat logs and booking records are kept for record-keeping and dispute resolution.</p>

      <h2>7. Your Rights</h2>
      <p>Under the Nigeria Data Protection Regulation (NDPR), you have the right to: request access to your data; request correction or deletion; withdraw consent at any time; lodge a complaint with NITDA. Contact us at <strong>{config.email}</strong> or <strong>{config.phone}</strong> to exercise these rights.</p>

      <h2>8. Cookies</h2>
      <p>We use minimal cookies for session management (authentication) and basic analytics. You can disable cookies in your browser settings, though some features may not function properly.</p>

      <h2>9. Third-Party Links</h2>
      <p>Our website may contain links to third-party sites. We are not responsible for their privacy practices. We use WhatsApp (via wa.me links) for customer communication — WhatsApp's privacy policy applies to those interactions.</p>

      <h2>10. Security</h2>
      <p>We implement HTTPS, security headers, and access controls to protect your data. However, no internet transmission is 100% secure.</p>

      <h2>11. Children&apos;s Privacy</h2>
      <p>Our services are not directed at individuals under 18. We do not knowingly collect data from children.</p>

      <h2>12. Changes to This Policy</h2>
      <p>We may update this policy from time to time. Changes will be posted on this page with an updated date.</p>

      <h2>13. Contact</h2>
      <p>For privacy-related inquiries:</p>
      <p>
        Email: {config.email}<br />
        Phone: {config.phone}<br />
        Address: Port Harcourt, Rivers State, Nigeria
      </p>
    </div>
  );
}
