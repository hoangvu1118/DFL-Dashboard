import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api"; // Spring Boot URL

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function TypingIndicator() {
  return (
    <div className="cs-typing">
      <div className="cs-typing-bubble">
        <span className="cs-typing-dot" />
        <span className="cs-typing-dot" />
        <span className="cs-typing-dot" />
      </div>
    </div>
  );
}

function ChatMessage({ msg }) {
  return (
    <div className={`cs-msg cs-msg--${msg.sender}`}>
      <div className="cs-bubble">{msg.text}</div>
      <span className="cs-meta">
        {msg.sender === "bootstrap" ? "⚡ Bootstrap" : "You"} · {formatTime(msg.ts)}
      </span>
    </div>
  );
}

export default function ChatSidebar() {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef(null);
  const textareaRef             = useRef(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { sender: "user", text, ts: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Auto-resize textarea back to minimum
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const resp = await axios.post(`${API_BASE}/bootstrap/predict`, {
        symptoms: text,
      });
      const diagnosis =
        resp.data?.diagnosis ||
        resp.data?.prediction ||
        JSON.stringify(resp.data);
      setMessages((prev) => [
        ...prev,
        { sender: "bootstrap", text: diagnosis, ts: new Date() },
      ]);
    } catch (err) {
      const errText =
        err.response?.data?.message ||
        "Bootstrap server is unreachable or returned an error.";
      setMessages((prev) => [
        ...prev,
        { sender: "error", text: `⚠ ${errText}`, ts: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const handleKeyDown = (e) => {
    // Send on Enter (not Shift+Enter)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    // Auto-resize textarea height
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
  };

  return (
    <div className="chat-sidebar">
      {/* Header */}
      <div className="cs-header">
        <div className="cs-header-info">
          <div className="cs-header-label">DFL Diagnosis</div>
          <div className="cs-header-title">Bootstrap Predict</div>
        </div>
        <div className="cs-status-dot" title="Bootstrap server connected" />
      </div>

      {/* Message area */}
      <div className="cs-messages">
        {messages.length === 0 && (
          <div className="cs-welcome">
            <div className="cs-welcome-icon">🏥</div>
            <div className="cs-welcome-text">
              <strong>Symptom Diagnosis</strong>
              Describe the patient's symptoms below. The federated bootstrap
              server will run inference and return a diagnosis.
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={i} msg={msg} />
        ))}

        {loading && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      {/* Input footer */}
      <div className="cs-input-area">
        <div className="cs-hint">Press Enter to send · Shift+Enter for new line</div>
        <div className="cs-input-row">
          <textarea
            ref={textareaRef}
            className="cs-textarea"
            placeholder="e.g. fever, cough, shortness of breath…"
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows={1}
          />
          <button
            className="cs-send-btn"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            aria-label="Send symptoms"
            title="Send"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
