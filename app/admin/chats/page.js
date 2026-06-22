"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { config } from "@/lib/config";

export default function AdminChats() {
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    fetch("/api/admin/chats")
      .then((r) => r.json())
      .then((d) => { setChats(d.chats || []); setLoading(false); })
      .catch(() => { setError("Failed to load conversations"); setLoading(false); });
  }, []);

  const loadMessages = useCallback(async (sessionId) => {
    try {
      const res = await fetch(`/api/chat/messages?sessionId=${sessionId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch {
      setError("Failed to load messages");
    }
  }, []);

  useEffect(() => {
    if (!selected) return;
    loadMessages(selected);
    const iv = setInterval(() => loadMessages(selected), 3000);
    return () => clearInterval(iv);
  }, [selected, loadMessages]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (messages.length > 0 && !messages[messages.length - 1].isVisitor && notifRef.current) {
      notifRef.current.play().catch(() => {});
    }
  }, [messages]);

  const sendReply = async () => {
    if (!reply.trim() || !selected) return;
    try {
      await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: selected, name: "HaulitNG Support", text: reply.trim(), isVisitor: false }),
      });
      setReply("");
      loadMessages(selected);
    } catch {
      setError("Failed to send reply");
    }
  };

  const wh = (text) => {
    const msg = encodeURIComponent(`Hi HaulitNG! I have a question: ${text}`);
    window.open(`https://wa.me/${config.whatsapp}?text=${msg}`, "_blank");
  };

  if (loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center", color: "#888" }}>
        Loading conversations...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px", textAlign: "center", color: "#b91c1c" }}>
        {error}
        <button onClick={() => { setError(null); setLoading(true); fetch("/api/admin/chats").then((r) => r.json()).then((d) => { setChats(d.chats || []); setLoading(false); }).catch(() => { setError("Failed to load conversations"); setLoading(false); }); }} style={{ display: "block", margin: "12px auto 0", padding: "8px 16px", background: "#2c3e50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, sans-serif" }}>
      <audio ref={notifRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAf39/f4B/f3+AgH9/f3+AgH9/f4B/f3+AgICAgH9/gH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AG5pY2sgSGVycmluZwA=" preload="auto" />

      {/* Sidebar */}
      <div style={{ width: "320px", borderRight: "1px solid #ddd", background: "#f8f9fa", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px", borderBottom: "1px solid #ddd", background: "#2c3e50", color: "white" }}>
          <h2 style={{ margin: 0, fontSize: "16px" }}>💬 Live Chat Admin</h2>
          <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.8 }}>{chats.length} conversations</p>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {chats.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#999", fontSize: "13px" }}>
              No conversations yet
            </div>
          ) : (
            chats.map((chat) => (
              <div key={chat.sessionId}
                onClick={() => setSelected(chat.sessionId)}
                style={{
                  padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid #eee",
                  background: selected === chat.sessionId ? "#eef2ff" : "transparent",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "14px" }}>{chat.name}</div>
                <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
                  {chat.messageCount} messages
                </div>
                {chat.lastMessage && (
                  <div style={{ fontSize: "12px", color: "#aaa", marginTop: "2px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                    {chat.lastMessage.text}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {!selected ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>💬</div>
              <div>Select a conversation to view messages</div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", background: "#f5f5f5" }}>
              {messages.length === 0 && (
                <div style={{ textAlign: "center", color: "#999", padding: "40px" }}>
                  No messages yet
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} style={{
                  display: "flex", justifyContent: msg.isVisitor ? "flex-end" : "flex-start",
                  marginBottom: "8px",
                }}>
                  <div style={{
                    maxWidth: "70%", padding: "10px 14px", borderRadius: "12px",
                    fontSize: "13px", lineHeight: "1.5",
                    background: msg.isVisitor ? "#2c3e50" : "white",
                    color: msg.isVisitor ? "white" : "#333",
                    borderBottomRightRadius: msg.isVisitor ? "4px" : "12px",
                    borderBottomLeftRadius: msg.isVisitor ? "12px" : "4px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}>
                    {msg.text}
                    <div style={{ fontSize: "10px", opacity: 0.6, marginTop: "4px", textAlign: "right" }}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div style={{ padding: "12px", borderTop: "1px solid #ddd", background: "white", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <input
                placeholder="Type your reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendReply(); }}
                style={{ flex: 1, padding: "10px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "13px", minWidth: "150px" }}
              />
              <button onClick={sendReply} disabled={!reply.trim()}
                style={{ padding: "10px 20px", background: reply.trim() ? "#2c3e50" : "#ccc", color: "white", border: "none", borderRadius: "8px", cursor: reply.trim() ? "pointer" : "default", fontSize: "13px", fontWeight: 600 }}>
                Send
              </button>
              <button onClick={() => wh(reply || "I'm interested in your equipment")}
                style={{ padding: "10px 14px", background: "#25D366", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
                WhatsApp ↗
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
