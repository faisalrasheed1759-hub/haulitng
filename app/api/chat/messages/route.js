import { addMessage, addAutoReply } from "@/lib/chat";

import { auth } from "@/lib/auth";

export async function POST(request) {
  try {
    const session = await auth();
    const body = await request.json();
    const { sessionId, name, text, isVisitor } = body;
    if (!sessionId || !text) {
      return Response.json({ error: "Missing sessionId or text" }, { status: 400 });
    }
    const visitor = isVisitor !== false && !session;
    const msg = addMessage(sessionId, name, text, visitor);
    const autoReply = visitor ? addAutoReply(sessionId) : null;
    return Response.json({ message: msg, autoReply }, { status: 201 });
  } catch (e) {
    console.error(e); return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await auth();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const since = searchParams.get("since");
    if (!sessionId) {
      return Response.json({ error: "Missing sessionId" }, { status: 400 });
    }
    const { getMessages } = await import("@/lib/chat");
    const messages = getMessages(sessionId, since);
    return Response.json({ messages });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
