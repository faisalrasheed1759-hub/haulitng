import fs from "fs";
import path from "path";

// In-memory fallback for Vercel serverless (read-only filesystem)
const memoryCache = {};

function readJSON(file) {
  const fp = path.join(process.cwd(), "data", file);
  try {
    if (fs.existsSync(fp)) {
      return JSON.parse(fs.readFileSync(fp, "utf-8"));
    }
  } catch {}
  return memoryCache[file] || [];
}

function writeJSON(file, data) {
  memoryCache[file] = data;
  try {
    const dir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, file), JSON.stringify(data, null, 2));
  } catch {
    // Vercel serverless: FS is read-only — in-memory cache used instead
  }
}

// Bookings
export function getBookings() {
  return readJSON("bookings.json");
}

export function addBooking(data) {
  const bookings = getBookings();
  const booking = {
    id: `BK-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    reference: `HLT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
    status: "pending",
    trackingUrl: null,
    createdAt: new Date().toISOString(),
    ...data,
  };
  bookings.push(booking);
  writeJSON("bookings.json", bookings);
  return booking;
}

export function getBooking(ref) {
  const bookings = getBookings();
  return bookings.find((b) => b.reference === ref || b.id === ref);
}

export function updateBooking(ref, updates) {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.reference === ref || b.id === ref);
  if (idx === -1) return null;
  bookings[idx] = { ...bookings[idx], ...updates };
  writeJSON("bookings.json", bookings);
  return bookings[idx];
}

export function getBookingStats() {
  const bookings = getBookings();
  return {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    active: bookings.filter((b) => b.status === "active").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };
}

// Quotes
export function getQuotes() {
  return readJSON("quotes.json");
}

export function addQuote(data) {
  const quotes = getQuotes();
  const quote = {
    id: `QT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    reference: `QTE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
    status: "new",
    createdAt: new Date().toISOString(),
    ...data,
  };
  quotes.push(quote);
  writeJSON("quotes.json", quotes);
  return quote;
}

// Chat persistence
export function saveConversations(conversations) {
  writeJSON("conversations.json", conversations);
}

export function loadConversations() {
  return readJSON("conversations.json");
}

// Inquiries
export function saveInquiries(inquiries) {
  writeJSON("inquiries.json", inquiries);
}

export function loadInquiries() {
  return readJSON("inquiries.json");
}

// Payments
export function getPayments() {
  return readJSON("payments.json");
}

export function addPayment(data) {
  const payments = getPayments();
  const payment = {
    id: `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    ...data,
  };
  payments.push(payment);
  writeJSON("payments.json", payments);
  return payment;
}

export function getPaymentsByBooking(ref) {
  return getPayments().filter((p) => p.bookingRef === ref);
}

export function getPaymentStats() {
  const payments = getPayments();
  const totalCollected = payments
    .filter((p) => p.status === "confirmed")
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  return {
    total: payments.length,
    pending: payments.filter((p) => p.status === "pending").length,
    confirmed: payments.filter((p) => p.status === "confirmed").length,
    totalCollected,
  };
}

// Pending balances to track 20% outstanding after delivery
export function getBalances() {
  return readJSON("balances.json");
}

export function updateBalance(ref, data) {
  const balances = getBalances();
  const idx = balances.findIndex((b) => b.bookingRef === ref);
  if (idx === -1) {
    balances.push({ bookingRef: ref, createdAt: new Date().toISOString(), ...data });
  } else {
    balances[idx] = { ...balances[idx], ...data };
  }
  writeJSON("balances.json", balances);
  return balances.find((b) => b.bookingRef === ref);
}

export function getBalance(ref) {
  return getBalances().find((b) => b.bookingRef === ref);
}
