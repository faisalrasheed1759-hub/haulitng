import { addInquiry } from "@/lib/inquiries";

export async function POST(request) {
  try {
    const body = await request.json();
    const { equipmentId, name, phone, message } = body;
    if (!equipmentId || !name || !phone) {
      return Response.json({ error: "Missing equipmentId, name, or phone" }, { status: 400 });
    }
    const inquiry = addInquiry({ equipmentId, name, phone, message });
    import("@/lib/notifications").then(({ notifyInquiry }) => {
      notifyInquiry(inquiry);
    });
    return Response.json({ inquiry, message: "Inquiry submitted" }, { status: 201 });
  } catch (e) {
    console.error(e); return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
