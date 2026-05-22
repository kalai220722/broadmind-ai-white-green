"use client";

import { useState } from "react";
import { Send, Mic, Paperclip, Camera, Sparkles } from "lucide-react";

interface ChatInterfaceProps {
  placeholder?: string;
  showCamera?: boolean;
  showMic?: boolean;
  showAttach?: boolean;
  accentColor?: string;
  welcomeMessage?: string;
  suggestions?: string[];
}

export default function ChatInterface({
  placeholder = "Ask anything...",
  showCamera = false,
  showMic = true,
  showAttach = true,
  accentColor = "#8B5CF6",
  welcomeMessage = "How can I help you learn today?",
  suggestions = [],
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { id: number; role: "user" | "assistant"; content: string }[]
  >([]);

  const handleSend = () => {
    if (!message.trim()) return;
    const userMsg = { id: Date.now(), role: "user" as const, content: message };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant" as const,
          content:
            "I understand your question! Let me break this down step by step with an analogy that matches your learning style...\n\nThink of it like this: imagine you're pushing an auto-rickshaw. The force you apply is like the effort needed to change the state of motion.",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col h-[500px]">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <Sparkles size={24} style={{ color: accentColor }} />
            </div>
            <p className="text-white font-medium mb-2">{welcomeMessage}</p>
            {suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-3 max-w-md">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setMessage(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-violet-600 text-white"
                    : "bg-slate-800 text-slate-200"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-slate-800 p-3">
        <div className="flex items-center gap-2">
          {showAttach && (
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Paperclip size={18} />
            </button>
          )}
          {showCamera && (
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Camera size={18} />
            </button>
          )}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={placeholder}
            className="flex-1 bg-slate-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none placeholder-slate-500 border border-slate-700 focus:border-violet-500"
          />
          {showMic && (
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Mic size={18} />
            </button>
          )}
          <button
            onClick={handleSend}
            className="p-2.5 rounded-lg transition-colors"
            style={{ backgroundColor: accentColor, color: "white" }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
