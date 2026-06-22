import { config } from "@/lib/config";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "https://www.haulit.ng";

// ---------- WHATSAPP (always available via wa.me links) ----------

export function whatsAppLink(phone, message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function adminWhatsAppLink(message) {
  return whatsAppLink(config.whatsapp, message);
}

export function customerWhatsAppLink(phone, message) {
  const cleaned = phone.replace(/[^0-9]/g, "");
  const full = cleaned.startsWith("234") ? cleaned : `234${cleaned.replace(/^0?0?/, "")}`;
  return whatsAppLink(full, message);
}

// ---------- EMAIL (requires SMTP_* env vars) ----------

let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  const nodemailer = await import("nodemailer");
  transporter = nodemailer.default.createTransport({
    service: "gmail",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

export async function sendEmail(to, subject, html) {
  try {
    const t = await getTransporter();
    if (!t) return { sent: false, reason: "SMTP not configured" };
    await t.sendMail({ from: `"HaulitNG" <${process.env.SMTP_USER}>`, to, subject, html });
    return { sent: true };
  } catch (e) {
    console.error("Email send failed:", e);
    return { sent: false, reason: e.message };
  }
}

// ---------- SMS via Termii (requires TERMII_API_KEY) ----------

export async function sendSMS(to, message) {
  try {
    if (!process.env.TERMII_API_KEY) return { sent: false, reason: "Termii not configured" };
    const cleaned = to.replace(/[^0-9]/g, "").replace(/^0?0?/, "");
    const full = cleaned.startsWith("234") ? cleaned : "234" + cleaned;
    const res = await fetch("https://api.termii.com/api/sms/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.TERMII_API_KEY,
        to: full,
        from: "HaulitNG",
        sms: message,
        type: "plain",
        channel: "generic",
      }),
    });
    const data = await res.json();
    return { sent: data?.message?.status === "Success", raw: data };
  } catch (e) {
    console.error("SMS send failed:", e);
    return { sent: false, reason: e.message };
  }
}

// ---------- HIGH-LEVEL NOTIFICATION FUNCTIONS ----------

function bookingSummary(booking) {
  return `Ref: ${booking.reference}
Name: ${booking.name}
Phone: ${booking.phone}
Service: ${booking.serviceType}
Pickup: ${booking.pickup || "N/A"}
Destination: ${booking.destination || "N/A"}
Date: ${booking.scheduledDate || "N/A"}`;
}

export async function notifyBookingCreated(booking) {
  const subject = `New Booking ${booking.reference}`;
  const smsText = `New booking ${booking.reference} from ${booking.name} (${booking.serviceType}). Check admin → ${BASE}/admin/payments`;
  const emailHtml = `<h2>New Booking Received</h2><pre>${bookingSummary(booking)}</pre><p><a href="${BASE}/admin/payments">View in Admin</a></p>`;

  await Promise.allSettled([
    sendSMS(config.phone, smsText),
    sendEmail(config.email, subject, emailHtml),
  ]);

  const customerMsg = `Hi ${booking.name}, your booking ${booking.reference} has been received. We'll review and send a quote within 24 hours. Need help? ${config.phone}`;
  const waLink = customerWhatsAppLink(booking.phone, customerMsg);

  return { customerWhatsApp: waLink, customerMessage: customerMsg };
}

export async function notifyQuoteSet(booking) {
  const invoiceUrl = `${BASE}/payment/${booking.reference}`;
  const smsText = `Quote ready for ${booking.reference}: ₦${(booking.quoteAmount || 0).toLocaleString()} (80% deposit: ₦${(booking.depositAmount || 0).toLocaleString()}). View → ${invoiceUrl}`;
  const subject = `Quote Ready — ${booking.reference}`;
  const emailHtml = `<h2>Your Quote is Ready</h2><p>Booking: ${booking.reference}</p><p>Total: ₦${(booking.quoteAmount || 0).toLocaleString()}</p><p>Deposit (80%): ₦${(booking.depositAmount || 0).toLocaleString()}</p><p>Final (20%): ₦${(booking.finalAmount || 0).toLocaleString()}</p><p><a href="${invoiceUrl}">View Invoice & Pay</a></p>`;

  const results = await Promise.allSettled([
    sendSMS(booking.phone, smsText),
    sendEmail(booking.email, subject, emailHtml),
  ]);

  const customerMsg = `Your quote for ${booking.reference} is ready: ₦${(booking.quoteAmount || 0).toLocaleString()}. Pay 80% deposit to start. View invoice: ${invoiceUrl}`;
  const waLink = customerWhatsAppLink(booking.phone, customerMsg);

  return { customerWhatsApp: waLink, customerMessage: customerMsg, results };
}

export async function notifyDepositConfirmed(booking, payment) {
  const balance = (booking.finalAmount || 0);
  const smsText = `Deposit of ₦${(payment?.amount || 0).toLocaleString()} confirmed for ${booking.reference}. Balance of ₦${balance.toLocaleString()} due on delivery. Track trip: ${BASE}/track/${booking.reference}`;
  const subject = `Payment Confirmed — ${booking.reference}`;
  const emailHtml = `<h2>Deposit Received</h2><p>Booking: ${booking.reference}</p><p>Amount: ₦${(payment?.amount || 0).toLocaleString()}</p><p>Balance due on delivery: ₦${balance.toLocaleString()}</p><p><a href="${BASE}/track/${booking.reference}">Track Your Trip</a></p>`;

  const results = await Promise.allSettled([
    sendSMS(booking.phone, smsText),
    sendEmail(booking.email, subject, emailHtml),
  ]);

  const customerMsg = `Deposit confirmed for ${booking.reference}! Balance ₦${balance.toLocaleString()} due on delivery. Track: ${BASE}/track/${booking.reference}`;
  const waLink = customerWhatsAppLink(booking.phone, customerMsg);

  return { customerWhatsApp: waLink, customerMessage: customerMsg, results };
}

export async function notifyFinalConfirmed(booking, payment) {
  const smsText = `${booking.reference} fully paid! Thanks ${booking.name} for choosing HaulitNG. We'd love your feedback. Review us today.`;
  const subject = `Booking Complete — ${booking.reference}`;
  const emailHtml = `<h2>Booking Complete</h2><p>Booking ${booking.reference} has been fully paid and completed.</p><p>Thank you for choosing HaulitNG!</p>`;

  const results = await Promise.allSettled([
    sendSMS(booking.phone, smsText),
    sendEmail(booking.email, subject, emailHtml),
  ]);

  const customerMsg = `${booking.reference} fully paid and completed! Thanks for riding with HaulitNG 🚛`;
  const waLink = customerWhatsAppLink(booking.phone, customerMsg);

  return { customerWhatsApp: waLink, customerMessage: customerMsg, results };
}

export async function notifyInquiry(inquiry) {
  const smsText = `New inquiry from ${inquiry.name} about ${inquiry.equipmentId}. Phone: ${inquiry.phone}`;
  const subject = `New Equipment Inquiry — ${inquiry.equipmentId}`;
  const emailHtml = `<h2>New Equipment Inquiry</h2><p>Equipment: ${inquiry.equipmentId}</p><p>Name: ${inquiry.name}</p><p>Phone: ${inquiry.phone}</p><p>Message: ${inquiry.message || "N/A"}</p>`;

  await Promise.allSettled([
    sendSMS(config.phone, smsText),
    sendEmail(config.email, subject, emailHtml),
  ]);
}
