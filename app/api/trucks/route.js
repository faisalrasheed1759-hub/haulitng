import { getTrucks } from "@/lib/store";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const authorized = await requireAdmin();
  if (!authorized) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const trucks = getTrucks();
  return Response.json({ trucks, timestamp: new Date().toISOString() });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, lat, lng } = body;
    if (!id || lat === undefined || lng === undefined) {
      return Response.json({ error: "Missing id, lat, or lng" }, { status: 400 });
    }
    const { getTruck, updateTruckLocation } = await import("@/lib/store");
    const truck = getTruck(id);
    if (!truck) {
      return Response.json({ error: "Truck not found" }, { status: 404 });
    }
    const updated = updateTruckLocation(id, lat, lng);
    return Response.json({ truck: updated, message: "Location updated" });
  } catch (e) {
    console.error(e); return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
