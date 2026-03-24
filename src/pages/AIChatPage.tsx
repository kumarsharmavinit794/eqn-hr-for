import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const suggestedPrompts = [
  "Analyze top performer this quarter",
  "Why was candidate #4 rejected?",
  "Show attrition risk employees",
  "Generate job description for React dev",
  "Recommend training for skill gaps",
];

const fakeResponses: Record<string, string> = {
  default: "I've analyzed the data across your HR system. Based on current metrics, here are my findings:\n\n**Key Insights:**\n- Employee engagement is trending upward at 87%\n- The Engineering department shows the highest retention rate\n- 3 employees are flagged for attrition risk based on behavioral patterns\n\nWould you like me to drill deeper into any of these areas?",
};

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", content: "Hello! I'm your AI HR assistant powered by RAG. I can analyze employee data, review candidates, predict attrition, and answer any HR-related questions. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const botMsg: Message = { id: Date.now() + 1, role: "assistant", content: fakeResponses.default };
      setMessages(prev => [...prev, botMsg]);
      setLoading(false);
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[calc(100vh-7rem)]">
      <div className="mb-4">
        <h1 className="page-header">AI HR Assistant</h1>
        <p className="page-subheader">RAG-powered insights across your entire HR ecosystem</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <div className={`max-w-[70%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "glass-card"
              }`}>
                {msg.content.split("\n").map((line, i) => (
                  <p key={i} className={i > 0 ? "mt-2" : ""}>
                    {line.replace(/\*\*(.*?)\*\*/g, "").includes("**") ? line : line.split("**").map((part, j) =>
                      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                    )}
                  </p>
                ))}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="glass-card rounded-xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Processing with RAG...</span>
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 py-3">
          {suggestedPrompts.map(prompt => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-muted-foreground hover:text-foreground"
            >
              <Sparkles className="w-3 h-3 inline mr-1" />{prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask anything about your HR data..."
          className="flex-1"
        />
        <Button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
