export async function POST(request) {
  try {
    const body = await request.json();
    const { tripId, lat, lng, photo, note } = body;
    if (!tripId || lat === undefined || lng === undefined) {
      return Response.json({ error: "Missing tripId, lat, or lng" }, { status: 400 });
    }
    if (typeof lat !== "number" || lat < -90 || lat > 90) {
      return Response.json({ error: "Invalid latitude: must be between -90 and 90" }, { status: 400 });
    }
    if (typeof lng !== "number" || lng < -180 || lng > 180) {
      return Response.json({ error: "Invalid longitude: must be between -180 and 180" }, { status: 400 });
    }
    const { getTrip, addCheckin, updateTruckLocation, updateTruckStatus } = await import("@/lib/store");
    const trip = getTrip(tripId);
    if (!trip) {
      return Response.json({ error: "Trip not found" }, { status: 404 });
    }
    const checkin = addCheckin(tripId, lat, lng, photo, note);
    updateTruckLocation(trip.truckId, lat, lng);
    if (note && note.toLowerCase().includes("delivered")) {
      updateTruckStatus(trip.truckId, "available");
    }
    return Response.json({ checkin, message: "Check-in recorded" }, { status: 201 });
  } catch (e) {
    console.error(e); return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
