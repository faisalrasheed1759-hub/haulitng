import { getAllConversations } from "@/lib/chat";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const authorized = await requireAdmin();
  if (!authorized) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const chats = getAllConversations();
  return Response.json({ chats });
}
