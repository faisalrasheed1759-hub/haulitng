import { getBooking, updateBooking, addPayment, getPaymentsByBooking, updateBalance, getBalance } from "@/lib/db";

export async function POST(req) {
  const data = await req.json();
  const { action, bookingRef } = data;

  const booking = getBooking(bookingRef);
  if (!booking) return Response.json({ error: "Booking not found" }, { status: 404 });

  if (action === "confirm-payment") {
    const { amount, type } = data; // type: "deposit" (80%) or "final" (20%)
    if (!amount || !type) return Response.json({ error: "Amount and type required" }, { status: 400 });

    const payment = addPayment({
      bookingRef,
      amount,
      type,
      status: "confirmed",
      confirmedAt: new Date().toISOString(),
      note: data.note || "",
    });

    if (type === "deposit") {
      updateBooking(bookingRef, { paymentStatus: "deposit_paid", status: "active" });
      // Track the balance owed
      const totalAmount = booking.quoteAmount || 0;
      const balanceOwed = totalAmount - amount;
      updateBalance(bookingRef, {
        totalAmount,
        depositPaid: amount,
        balanceOwed,
        dueOnDelivery: true,
        status: "awaiting_final",
      });
    } else if (type === "final") {
      updateBooking(bookingRef, { paymentStatus: "paid_in_full", status: "completed" });
      updateBalance(bookingRef, {
        finalPaid: amount,
        balanceOwed: 0,
        dueOnDelivery: false,
        status: "settled",
      });
    }

    return Response.json({ payment, booking: getBooking(bookingRef) });
  }

  if (action === "set-quote") {
    const { quoteAmount } = data;
    const deposit = Math.round(quoteAmount * 0.8);
    const final = quoteAmount - deposit;
    updateBooking(bookingRef, { quoteAmount, depositAmount: deposit, finalAmount: final, paymentStatus: "quoted" });
    updateBalance(bookingRef, { totalAmount: quoteAmount, depositAmount: deposit, finalAmount: final, balanceOwed: final, status: "quoted" });
    return Response.json({ booking: getBooking(bookingRef) });
  }

  return Response.json({ error: "Unknown action" }, { status: 400 });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref");
  if (!ref) return Response.json({ error: "Booking reference required" }, { status: 400 });

  const booking = getBooking(ref);
  if (!booking) return Response.json({ error: "Not found" }, { status: 404 });

  const payments = getPaymentsByBooking(ref);
  const balance = getBalance(ref);

  return Response.json({ booking, payments, balance });
}
