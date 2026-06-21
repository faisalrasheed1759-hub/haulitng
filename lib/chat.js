import { loadConversations, saveConversations } from "./db";
let conversations = loadConversations();
if (Object.keys(conversations).length === 0) conversations = {};

function persist() {
  try { saveConversations(conversations); } catch {}
}

const autoReplies = {
  "hello": "Hello! Welcome to HaulitNG. How can I help you today? 😊",
  "hi": "Hi there! Welcome to HaulitNG. Feel free to ask about our equipment or haulage services.",
  "price": "Prices are listed on each equipment page. For the best deal, let me know which item you're interested in and I'll connect you with our sales team.",
  "lease": "Yes, most of our equipment is available for lease. Daily and monthly rates are shown on each equipment page.",
  "transport": "We offer nationwide haulage for all equipment. Lowbed trailers available. Get a quick quote by sending us a message!",
  "location": "We're based in Port Harcourt and serve nationwide. Equipment is located across PH, Lagos, Abuja, Warri, and Onne.",
  "thanks": "You're welcome! Don't hesitate to reach out if you need anything else.",
  "thank": "You're welcome! Don't hesitate to reach out if you need anything else.",
  "default": "Thanks for your message. Our team will get back to you shortly. Meanwhile, browse our equipment catalog or tell us more about what you need.",
};

function getAutoReply(text) {
  const lower = text.toLowerCase();
  for (const [key, reply] of Object.entries(autoReplies)) {
    if (lower.includes(key)) return reply;
  }
  return autoReplies.default;
}

export function addMessage(sessionId, name, text, isVisitor = true) {
  if (!conversations[sessionId]) {
    conversations[sessionId] = { name: name || "Visitor", messages: [], createdAt: new Date().toISOString() };
  }
  const msg = { id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, text, isVisitor, timestamp: new Date().toISOString() };
  conversations[sessionId].messages.push(msg);
  if (name) conversations[sessionId].name = name;
  persist();
  return msg;
}

export function addAutoReply(sessionId) {
  const conv = conversations[sessionId];
  if (!conv || conv.messages.length === 0) return null;
  const lastVisitorMsg = [...conv.messages].reverse().find((m) => m.isVisitor);
  if (!lastVisitorMsg) return null;
  const reply = getAutoReply(lastVisitorMsg.text);
  const msg = { id: `msg-${Date.now()}-auto`, text: reply, isVisitor: false, timestamp: new Date().toISOString() };
  conv.messages.push(msg);
  persist();
  return msg;
}

export function getMessages(sessionId, since = null) {
  const conv = conversations[sessionId];
  if (!conv) return [];
  if (since) {
    return conv.messages.filter((m) => new Date(m.timestamp) > new Date(since));
  }
  return conv.messages;
}

export function getAllConversations() {
  return Object.entries(conversations).map(([sessionId, conv]) => ({
    sessionId,
    name: conv.name,
    messageCount: conv.messages.length,
    lastMessage: conv.messages[conv.messages.length - 1] || null,
    createdAt: conv.createdAt,
  }));
}
