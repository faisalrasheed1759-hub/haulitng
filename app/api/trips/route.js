import { getTrips } from "@/lib/store";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const authorized = await requireAdmin();
    if (!authorized) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const customer = searchParams.get("customer");
    const allTrips = getTrips();
    if (customer) {
      const filtered = allTrips.filter((t) =>
        t.customerName.toLowerCase().includes(customer.toLowerCase())
      );
      return Response.json({ trips: filtered });
    }
    return Response.json({ trips: allTrips });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  const authorized = await requireAdmin();
  if (!authorized) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const { truckId, customerName, destination, estimatedDelivery } = body;
    if (!truckId || !customerName || !destination || !estimatedDelivery) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }
    const { getTruck, createTrip } = await import("@/lib/store");
    const truck = getTruck(truckId);
    if (!truck) {
      return Response.json({ error: "Truck not found" }, { status: 404 });
    }
    const trip = createTrip(truckId, customerName, destination, estimatedDelivery);
    return Response.json({ trip, message: "Trip created" }, { status: 201 });
  } catch (e) {
    console.error(e); return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
