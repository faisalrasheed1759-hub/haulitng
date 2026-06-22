"use client";
import { useState, useEffect, useRef, useCallback } from "react";

function generateId() {
  if (typeof window !== "undefined") {
    let id = localStorage.getItem("haulitng_chat_session");
    if (!id) {
      id = "chat-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
      localStorage.setItem("haulitng_chat_session", id);
    }
    return id;
  }
  return "chat-" + Date.now();
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    setSessionId(generateId());
    const saved = localStorage.getItem("haulitng_chat_name");
    if (saved) setName(saved);
  }, []);

  const scrollBottom = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollBottom(); }, [messages]);

  const fetchNew = useCallback(async () => {
    if (!sessionId) return;
    const since = messages.length > 0 ? messages[messages.length - 1].timestamp : null;
    try {
      const url = `/api/chat/messages?sessionId=${sessionId}` + (since ? `&since=${encodeURIComponent(since)}` : "");
      const res = await fetch(url);
      const data = await res.json();
      if (data.messages && data.messages.length > 0) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMsgs = data.messages.filter((m) => !existingIds.has(m.id));
          return newMsgs.length > 0 ? [...prev, ...newMsgs] : prev;
        });
      }
    } catch (e) { console.error("Chat fetch error:", e); }
  }, [sessionId, messages]);

  useEffect(() => {
    if (!open || !sessionId) return;
    fetchNew();
    pollRef.current = setInterval(fetchNew, 3000);
    return () => clearInterval(pollRef.current);
  }, [open, sessionId, fetchNew]);

  const send = async () => {
    if (!text.trim()) return;
    const txt = text.trim();
    setText("");
    setLoading(true);
    const n = name.trim() || "Visitor";
    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, name: n, text: txt }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
        if (data.autoReply) {
          setTimeout(() => {
            setMessages((prev) => [...prev, data.autoReply]);
          }, 500);
        }
      }
      if (n !== "Visitor") {
        localStorage.setItem("haulitng_chat_name", n);
        setName(n);
      }
    } catch (e) { console.error("Chat send error:", e); }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: "20px", right: "20px", zIndex: 9999,
          width: "56px", height: "56px", borderRadius: "50%",
          background: open ? "#e74c3c" : "#2c3e50",
          color: "white", border: "none", cursor: "pointer",
          fontSize: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
        }}
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div style={{
          position: "fixed", bottom: "84px", right: "20px", zIndex: 9999,
          width: "340px", height: "460px", background: "white",
          borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}>
          <div style={{
            padding: "14px 16px", background: "#2c3e50", color: "white",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <strong>HaulitNG Chat</strong>
              <div style={{ fontSize: "11px", opacity: 0.8 }}>We typically reply in seconds</div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "12px", background: "#f5f5f5" }}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", color: "#999", fontSize: "13px", padding: "40px 0" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>👋</div>
                <div>Ask us anything about our equipment or haulage services!</div>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} style={{
                display: "flex", justifyContent: msg.isVisitor ? "flex-end" : "flex-start",
                marginBottom: "8px",
              }}>
                <div style={{
                  maxWidth: "80%", padding: "10px 14px", borderRadius: "12px",
                  fontSize: "13px", lineHeight: "1.5",
                  background: msg.isVisitor ? "#2c3e50" : "white",
                  color: msg.isVisitor ? "white" : "#333",
                  borderBottomRightRadius: msg.isVisitor ? "4px" : "12px",
                  borderBottomLeftRadius: msg.isVisitor ? "12px" : "4px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}>
                  {msg.text}
                  <div style={{
                    fontSize: "10px", opacity: 0.6, marginTop: "4px",
                    textAlign: msg.isVisitor ? "right" : "left",
                  }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {!name && (
            <div style={{ padding: "8px 12px", borderTop: "1px solid #eee" }}>
              <input
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => { if (name.trim()) localStorage.setItem("haulitng_chat_name", name.trim()); }}
                style={{
                  width: "100%", padding: "8px 10px", border: "1px solid #ddd",
                  borderRadius: "6px", fontSize: "13px", boxSizing: "border-box",
                }}
              />
            </div>
          )}

          <div style={{ padding: "8px 12px", borderTop: "1px solid #eee", display: "flex", gap: "8px" }}>
            <input
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              style={{
                flex: 1, padding: "10px 12px", border: "1px solid #ddd",
                borderRadius: "8px", fontSize: "13px",
              }}
            />
            <button
              onClick={send}
              disabled={loading || !text.trim()}
              style={{
                padding: "10px 16px", background: text.trim() ? "#2c3e50" : "#ccc",
                color: "white", border: "none", borderRadius: "8px",
                cursor: text.trim() ? "pointer" : "default", fontSize: "16px",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
