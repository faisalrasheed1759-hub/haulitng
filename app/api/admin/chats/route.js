import { getAllConversations } from "@/lib/chat";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  try {
    const authorized = await requireAdmin();
    if (!authorized) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const chats = getAllConversations();
    return Response.json({ chats });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
