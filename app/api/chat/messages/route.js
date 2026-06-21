import { addMessage, addAutoReply } from "@/lib/chat";

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, name, text, isVisitor } = body;
    if (!sessionId || !text) {
      return Response.json({ error: "Missing sessionId or text" }, { status: 400 });
    }
    const visitor = isVisitor !== false;
    const msg = addMessage(sessionId, name, text, visitor);
    const autoReply = visitor ? addAutoReply(sessionId) : null;
    return Response.json({ message: msg, autoReply }, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");
  const since = searchParams.get("since");
  if (!sessionId) {
    return Response.json({ error: "Missing sessionId" }, { status: 400 });
  }
  const { getMessages } = await import("@/lib/chat");
  const messages = getMessages(sessionId, since);
  return Response.json({ messages });
}
