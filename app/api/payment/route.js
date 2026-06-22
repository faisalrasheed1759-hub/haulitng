import { getBooking, updateBooking, addPayment, getPaymentsByBooking, updateBalance, getBalance } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function POST(req) {
  const authorized = await requireAdmin();
  if (!authorized) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await req.json();
    const { action, bookingRef } = data;

    const booking = getBooking(bookingRef);
    if (!booking) return Response.json({ error: "Booking not found" }, { status: 404 });

    const { paymentStatus } = booking;

    if (paymentStatus === "paid_in_full") {
      return Response.json({ error: "Booking already fully paid" }, { status: 400 });
    }

    if (action === "confirm-payment") {
      const { amount, type } = data;
      if (!amount || !type) return Response.json({ error: "Amount and type required" }, { status: 400 });

      if (type !== "deposit" && type !== "final") {
        return Response.json({ error: "Type must be 'deposit' or 'final'" }, { status: 400 });
      }

      if (typeof amount !== "number" || amount <= 0) {
        return Response.json({ error: "Amount must be greater than 0" }, { status: 400 });
      }

      if (paymentStatus === "pending") {
        return Response.json({ error: "Cannot confirm payment before quote is set" }, { status: 400 });
      }

      if (paymentStatus === "quoted" && type !== "deposit") {
        return Response.json({ error: "Only deposit payment allowed in quoted state" }, { status: 400 });
      }

      if (paymentStatus === "deposit_paid" && type !== "final") {
        return Response.json({ error: "Only final payment allowed after deposit" }, { status: 400 });
      }

      if (type === "deposit" && amount < (booking.depositAmount || 0)) {
        return Response.json({ error: `Deposit amount must be at least ${booking.depositAmount}` }, { status: 400 });
      }

      if (type === "final" && amount < (booking.finalAmount || 0)) {
        return Response.json({ error: `Final amount must be at least ${booking.finalAmount}` }, { status: 400 });
      }

      const existingPayments = getPaymentsByBooking(bookingRef);
      const alreadyConfirmed = existingPayments.find(p => p.type === type && p.status === "confirmed");
      if (alreadyConfirmed) {
        return Response.json({ error: "Payment already confirmed for this type" }, { status: 400 });
      }

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
        const totalAmount = booking.quoteAmount || 0;
        const balanceOwed = totalAmount - amount;
        updateBalance(bookingRef, {
          totalAmount,
          depositPaid: amount,
          balanceOwed,
          dueOnDelivery: true,
          status: "awaiting_final",
        });
        import("@/lib/notifications").then(({ notifyDepositConfirmed }) => {
          notifyDepositConfirmed(getBooking(bookingRef), payment);
        });
      } else if (type === "final") {
        updateBooking(bookingRef, { paymentStatus: "paid_in_full", status: "completed" });
        updateBalance(bookingRef, {
          finalPaid: amount,
          balanceOwed: 0,
          dueOnDelivery: false,
          status: "settled",
        });
        import("@/lib/notifications").then(({ notifyFinalConfirmed }) => {
          notifyFinalConfirmed(getBooking(bookingRef), payment);
        });
      }

      return Response.json({ payment, booking: getBooking(bookingRef) });
    }

    if (action === "set-quote") {
      if (paymentStatus !== "pending") {
        return Response.json({ error: "Cannot change quote after payment has been made" }, { status: 400 });
      }
      const { quoteAmount } = data;
      const deposit = Math.round(quoteAmount * 0.8);
      const final = quoteAmount - deposit;
      updateBooking(bookingRef, { quoteAmount, depositAmount: deposit, finalAmount: final, paymentStatus: "quoted" });
      updateBalance(bookingRef, { totalAmount: quoteAmount, depositAmount: deposit, finalAmount: final, balanceOwed: final, status: "quoted" });
      import("@/lib/notifications").then(({ notifyQuoteSet }) => {
        notifyQuoteSet(getBooking(bookingRef));
      });
      return Response.json({ booking: getBooking(bookingRef) });
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req) {
  const authorized = await requireAdmin();
  if (!authorized) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get("ref");
    if (!ref) return Response.json({ error: "Booking reference required" }, { status: 400 });

    const booking = getBooking(ref);
    if (!booking) return Response.json({ error: "Not found" }, { status: 404 });

    const payments = getPaymentsByBooking(ref);
    const balance = getBalance(ref);

    return Response.json({ booking, payments, balance });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
