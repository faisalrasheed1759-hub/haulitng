import { addBooking, getBooking, getBookings, addQuote } from "@/lib/db";

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, phone, email, serviceType, equipmentType, pickup, destination, message } = data;

    if (!name || !phone || !serviceType) {
      return Response.json({ error: "Name, phone, and service type required" }, { status: 400 });
    }

    if (phone && (phone.length < 7 || phone.length > 15)) {
      return Response.json({ error: "Phone number must be between 7 and 15 digits" }, { status: 400 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (serviceType === "buy" || serviceType === "lease") {
      const quote = addQuote({
        name, phone, email, serviceType,
        equipmentType: equipmentType || "not specified",
        location: data.destination || "not specified",
        message,
      });
      return Response.json({ booking: quote, type: "quote" });
    }

    const booking = addBooking({
      name, phone, email, serviceType,
      pickup: pickup || "not specified",
      destination: destination || "not specified",
      message,
      equipment: data.equipmentType || "",
      weight: data.weight || "",
      scheduledDate: data.date || "",
    });

    const { notifyBookingCreated } = await import("@/lib/notifications");
    notifyBookingCreated(booking).catch((e) => console.error("Booking notification failed:", e));

    return Response.json({ booking, type: "booking" });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { auth } = await import("@/lib/auth");
    const session = await auth();
    if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get("ref");
    if (ref) {
      const booking = getBooking(ref);
      if (!booking) return Response.json({ error: "Not found" }, { status: 404 });
      return Response.json({ booking });
    }
    const bookings = getBookings();
    return Response.json(bookings);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
