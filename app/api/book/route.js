import { addBooking, getBooking, getBookings, addQuote } from "@/lib/db";

export async function POST(req) {
  const data = await req.json();
  const { name, phone, email, serviceType, equipmentType, pickup, destination, message } = data;

  if (!name || !phone || !serviceType) {
    return Response.json({ error: "Name, phone, and service type required" }, { status: 400 });
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

  return Response.json({ booking, type: "booking" });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref");
  if (ref) {
    const booking = getBooking(ref);
    if (!booking) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ booking });
  }
  const bookings = getBookings();
  return Response.json(bookings);
}
