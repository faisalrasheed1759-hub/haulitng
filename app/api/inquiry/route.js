import { addInquiry } from "@/lib/equipment";

export async function POST(request) {
  try {
    const body = await request.json();
    const { equipmentId, name, phone, message } = body;
    if (!equipmentId || !name || !phone) {
      return Response.json({ error: "Missing equipmentId, name, or phone" }, { status: 400 });
    }
    const inquiry = addInquiry({ equipmentId, name, phone, message });
    return Response.json({ inquiry, message: "Inquiry submitted" }, { status: 201 });
  } catch (e) {
    console.error(e); return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
