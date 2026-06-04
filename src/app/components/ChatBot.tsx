"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, Send, Sparkles, RotateCcw, ChevronDown } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  "What products do you sell?",
  "Best soap for dry skin?",
  "How much is delivery?",
  "What are your ingredients?",
  "Products for mature skin?",
  "How do I place an order?",
];

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "model",
  content:
    "Hi there! 👋 I'm **Ariya**, your Aruk Beauty assistant.\n\nI can help you find the perfect organic skincare product, answer ingredient questions, or guide you through our catalogue. What can I help you with today? ✨",
  timestamp: new Date(),
};

// Simple markdown-like bold renderer
function RenderContent({ content }: { content: string }) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i} style={{ whiteSpace: "pre-wrap" }}>
            {part}
          </span>
        )
      )}
    </>
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasNewMessage(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setShowScrollBtn(!isNearBottom);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Build history excluding the welcome message (model only needs actual convo)
    const history = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: data.reply ?? data.error ?? "Something went wrong. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (!isOpen) {
        setHasNewMessage(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          content:
            "Oops! I couldn't connect. Please check your connection or reach us on WhatsApp at wa.me/2349044222531 💚",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleReset = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput("");
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open Ariya Chat"
        className={`fixed bottom-20 right-4 sm:bottom-28 sm:right-8 z-40 group transition-all duration-300 ${
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
        style={{ filter: "drop-shadow(0 8px 24px rgba(122,198,32,0.4))" }}
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-[#7AC620]/30 animate-ping" />
        
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#7AC620] to-[#5a9a18] flex items-center justify-center border-2 border-white/20 group-hover:scale-110 transition-transform duration-300 shadow-xl">
          {/* Chat icon */}
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.51 3.58 1.39 5.06L2 22l4.94-1.39C8.42 21.49 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 13H7v-2h4v2zm4 0h-2v-2h2v2zm0-4H7V9h8v2z"/>
          </svg>
          
          {/* Ariya label */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Ask Ariya ✨
          </span>
        </div>

        {/* New message dot */}
        {hasNewMessage && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-background animate-bounce" />
        )}
      </button>

      {/* Chat Panel — full-screen on mobile, fixed bottom-right panel on sm+ */}
      <div
        className={`fixed z-50 flex flex-col overflow-hidden shadow-2xl border border-border/40 transition-all duration-400 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-6 pointer-events-none"
        }
        inset-0 rounded-none
        sm:inset-auto sm:bottom-8 sm:right-8 sm:w-[380px] sm:max-w-[calc(100vw-24px)] sm:rounded-3xl sm:h-[560px]`}
        style={{
          background: "var(--background)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(122,198,32,0.15)",
          transformOrigin: "bottom right",
        }}
      >
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/40 bg-gradient-to-r from-[#0f1f06] to-[#1a3008] flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#7AC620]/50 flex-shrink-0">
              <Image src="/aruk_logo_4k.png" alt="Ariya" fill style={{ objectFit: "cover" }} />
              {/* Online dot */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#7AC620] rounded-full border border-[#0f1f06]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white">Ariya</span>
                <Sparkles className="w-3 h-3 text-[#7AC620]" />
              </div>
              <p className="text-[10px] text-[#b4e878] font-medium">
                Aruk Beauty Assistant · Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              title="Start new conversation"
              className="text-white/50 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/50 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── MESSAGES ── */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin"
        >
          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
              style={{
                animation: `fadeIn 0.4s cubic-bezier(0.16,1,0.3,1) ${idx < 2 ? 0 : 0.05}s both`,
              }}
            >
              {/* Avatar — AI only */}
              {msg.role === "model" && (
                <div className="w-7 h-7 rounded-full overflow-hidden border border-[#7AC620]/40 flex-shrink-0 mb-0.5">
                  <Image
                    src="/aruk_logo_4k.png"
                    alt="Ariya"
                    width={28}
                    height={28}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}

              {/* Bubble */}
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#7AC620] text-white rounded-br-sm font-medium"
                    : "bg-card border border-border/60 text-foreground rounded-bl-sm"
                }`}
              >
                <RenderContent content={msg.content} />
                <p
                  className={`text-[9px] mt-1 ${
                    msg.role === "user" ? "text-white/60 text-right" : "text-muted"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex items-end gap-2" style={{ animation: "fadeIn 0.3s ease both" }}>
              <div className="w-7 h-7 rounded-full overflow-hidden border border-[#7AC620]/40 flex-shrink-0">
                <Image src="/aruk_logo_4k.png" alt="Ariya" width={28} height={28} style={{ objectFit: "cover" }} />
              </div>
              <div className="bg-card border border-border/60 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                    style={{
                      animation: "loaderDotBounce 1.2s ease-in-out infinite",
                      animationDelay: `${i * 0.18}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-[72px] right-4 w-7 h-7 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-muted hover:text-foreground transition-all cursor-pointer"
            style={{ animation: "fadeIn 0.2s ease both" }}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}

        {/* ── QUICK QUESTIONS (only if 1 message) ── */}
        {messages.length === 1 && !isLoading && (
          <div className="px-4 pb-2 flex-shrink-0">
            <p className="text-[9px] uppercase tracking-wider text-muted mb-2 font-semibold">
              Quick questions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[10px] bg-accent/60 hover:bg-accent border border-border/60 hover:border-primary/40 text-foreground/80 hover:text-foreground px-2.5 py-1 rounded-full transition-all cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── INPUT ── */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-3 py-3 border-t border-border/40 flex-shrink-0 bg-card/40"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about products, ingredients…"
            disabled={isLoading}
            className="flex-1 bg-background border border-border/60 rounded-full px-4 py-2.5 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-[#7AC620]/60 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-9 h-9 rounded-full bg-[#7AC620] hover:bg-[#6ab31a] flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#7AC620]/30 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </form>

        {/* Powered by footer */}
        <div className="text-center pb-2 flex-shrink-0">
          <p className="text-[9px] text-muted/50">
            Powered by Genkit + Gemini · Aruk Beauty Line 🌿
          </p>
        </div>
      </div>

      {/* Keyframes for dots */}
      <style jsx>{`
        @keyframes loaderDotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </>
  );
}
