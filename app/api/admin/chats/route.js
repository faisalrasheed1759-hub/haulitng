import { getAllConversations } from "@/lib/chat";

export async function GET() {
  const chats = getAllConversations();
  return Response.json({ chats });
}
