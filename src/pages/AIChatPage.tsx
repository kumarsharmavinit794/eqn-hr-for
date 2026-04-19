import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, Send, Sparkles, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { getHrBrainPromptSuggestions } from "@/lib/hr-intelligence";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  summary?: string;
  confidence?: number;
  task?: string;
  structuredJson?: unknown;
}

const suggestedPrompts = getHrBrainPromptSuggestions();

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content:
        "The HR intelligence brain is online. Ask for hiring, promotion, warning, attrition, team formation, work mode, or a full HR intelligence report, and I will return a human summary plus structured JSON.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const prompt = text.trim();
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", content: prompt }]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/ai/hr-brain", { message: prompt });
      const payload = response.data?.data;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: payload?.summary || "The analysis completed, but no summary was returned.",
          summary: payload?.summary,
          confidence: payload?.confidence,
          task: payload?.task,
          structuredJson: payload?.structuredJson,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "I couldn't complete the HR intelligence run. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5 text-primary">
              AI HR Brain
            </Badge>
            <h1 className="page-header">Structured HR Intelligence</h1>
            <p className="page-subheader mt-1">
              Run hiring, promotion, warning, attrition, team formation, work-mode, and complete workforce reports with JSON-first output.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">JSON + Summary</Badge>
            <Badge variant="secondary">Confidence Scores</Badge>
            <Badge variant="secondary">Actionable Recommendations</Badge>
          </div>
        </div>
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => void sendMessage(prompt)}
              className="rounded-full border border-border px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
            >
              <Sparkles className="mr-1 inline h-3 w-3" />
              {prompt.split("\n")[0]}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4 rounded-3xl border border-border/60 bg-card/50 p-4 md:p-5">
        <div className="max-h-[calc(100vh-22rem)] space-y-4 overflow-y-auto pr-2 scrollbar-thin">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
              >
                {message.role === "assistant" && (
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-bg">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}

                <div
                  className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm ${
                    message.role === "user" ? "bg-primary text-primary-foreground sm:max-w-[72%]" : "glass-card w-full"
                  }`}
                >
                  <p className="leading-6">{message.content}</p>

                  {message.role === "assistant" && (message.task || typeof message.confidence === "number") && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.task && (
                        <Badge variant="outline" className="capitalize">
                          {message.task.replace(/_/g, " ")}
                        </Badge>
                      )}
                      {typeof message.confidence === "number" && (
                        <Badge variant="outline">Confidence {message.confidence}%</Badge>
                      )}
                    </div>
                  )}

                  {message.role === "assistant" && message.structuredJson && (
                    <details className="mt-4 overflow-hidden rounded-2xl border border-border/60 bg-background/70" open>
                      <summary className="cursor-pointer px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Structured JSON Output
                      </summary>
                      <div className="overflow-x-auto border-t border-border/60">
                        <pre className="min-w-full whitespace-pre-wrap px-4 py-4 text-xs leading-6 text-foreground">
                          {JSON.stringify(message.structuredJson, null, 2)}
                        </pre>
                      </div>
                    </details>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-bg">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="glass-card rounded-2xl px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="mr-2 inline h-4 w-4 animate-spin text-primary" />
                Running HR intelligence analysis...
              </div>
            </motion.div>
          )}

          <div ref={endRef} />
        </div>

        <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                void sendMessage(input);
              }
            }}
            rows={4}
            placeholder="Ask for a hiring recommendation, promotion analysis, warning review, resignation risk scan, team formation plan, work mode recommendation, or a complete HR intelligence report..."
            className="min-h-[120px] resize-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">Use Ctrl+Enter to run the analysis.</p>
            <Button onClick={() => void sendMessage(input)} disabled={!input.trim() || loading}>
              <Send className="mr-2 h-4 w-4" />
              Analyze
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
