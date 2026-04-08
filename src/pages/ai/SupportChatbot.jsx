import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  CalendarClock,
  Download,
  Headphones,
  History,
  Mail,
  Mic,
  PhoneCall,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const storageKey = "hrCopilotMessages";
const quickReplies = ["Leave policy", "Payroll help", "Onboarding checklist", "HR contacts", "Company policy"];

const knowledgeBase = {
  leave: "Employees can submit casual, sick, and earned leave from the HR portal. Manager approval is required for planned leave longer than 2 days.",
  payroll: "Payroll is processed on the last working day of each month. Payslips are available in the employee self-service portal under Payroll.",
  onboarding: "New joiners should complete profile setup, document upload, policy acknowledgement, and tool access activation in their first week.",
  policy: "Company policies covering attendance, leave, code of conduct, and reimbursements are available in the HR knowledge hub.",
  contact: "For live support, reach People Operations at hr@company.com or extension 204 between 9:00 AM and 6:00 PM.",
};

function buildBotReply(message) {
  const value = message.toLowerCase();
  if (value.includes("leave")) return knowledgeBase.leave;
  if (value.includes("salary") || value.includes("pay") || value.includes("payroll")) return knowledgeBase.payroll;
  if (value.includes("onboard")) return knowledgeBase.onboarding;
  if (value.includes("policy") || value.includes("handbook")) return knowledgeBase.policy;
  if (value.includes("contact") || value.includes("hr") || value.includes("support")) return knowledgeBase.contact;
  return "I can help with leave policy, payroll, onboarding guidance, HR contacts, and company policy questions. Try one of the quick replies to get started.";
}

function buildTimestamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function SupportChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [activeTab, setActiveTab] = useState("copilot");
  const endRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          text: "Welcome to HR Copilot. Ask me about leave policy, payroll timelines, onboarding steps, or HR contacts.",
          timestamp: buildTimestamp(),
          category: "General",
        },
      ]);
    }
    setVoiceSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const analytics = useMemo(() => {
    const userMessages = messages.filter((item) => item.role === "user");
    const categories = userMessages.reduce((acc, item) => {
      const key = item.category || "General";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const topQuestion = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || "Leave Policy";
    return [
      { label: "Total Queries Handled", value: userMessages.length || 48 },
      { label: "Most Common Topic", value: topQuestion },
      { label: "Response Success Rate", value: "96%" },
    ];
  }, [messages]);

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;
    const category =
      text.toLowerCase().includes("leave") ? "Leave Policy" :
      text.toLowerCase().includes("pay") || text.toLowerCase().includes("salary") ? "Payroll" :
      text.toLowerCase().includes("onboard") ? "Onboarding" :
      text.toLowerCase().includes("policy") ? "Policy" : "HR Support";

    const userMessage = {
      id: Date.now(),
      role: "user",
      text,
      timestamp: buildTimestamp(),
      category,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    const assistantMessage = {
      id: Date.now() + 1,
      role: "assistant",
      text: buildBotReply(text),
      timestamp: buildTimestamp(),
      category,
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setTyping(false);
  };

  const clearChat = () => {
    const resetMessage = {
      id: Date.now(),
      role: "assistant",
      text: "Conversation reset. I’m ready to help with HR questions again.",
      timestamp: buildTimestamp(),
      category: "General",
    };
    setMessages([resetMessage]);
  };

  const exportChat = () => {
    const payload = messages.map((item) => `[${item.timestamp}] ${item.role.toUpperCase()}: ${item.text}`).join("\n\n");
    const blob = new Blob([payload], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hr-copilot-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event) => setInput(event.results[0][0].transcript);
    recognition.start();
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="relative overflow-hidden px-6 py-8 sm:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_35%),radial-gradient(circle_at_right,_rgba(14,165,233,0.14),_transparent_32%)]" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <Badge variant="outline" className="mb-3 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                  AI HR Copilot
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">AI HR Support Assistant</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Enterprise HR guidance for leave policy, payroll support, onboarding, company policy, and HR contact routing in one shared copilot experience.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={clearChat}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Chat
                </Button>
                <Button onClick={exportChat}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Chat
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-3">
          {analytics.map((item) => (
            <Card key={item.label} className="dark:border-slate-700 dark:bg-slate-900">
              <CardContent className="p-5">
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="copilot">Copilot</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="copilot" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Conversation Workspace</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-[520px] space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user" ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"}`}>
                            <div className="mb-1 flex items-center gap-2 text-xs opacity-80">
                              {message.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                              <span>{message.role === "user" ? "You" : "HR Copilot"}</span>
                              <span>•</span>
                              <span>{message.timestamp}</span>
                            </div>
                            <p className="text-sm leading-6">{message.text}</p>
                          </div>
                        </motion.div>
                      ))}
                      {typing && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                            HR Copilot is typing...
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div ref={endRef} />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((item) => (
                      <button key={item} type="button" onClick={() => sendMessage(item)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                        {item}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void sendMessage();
                        }
                      }}
                      rows={2}
                      placeholder="Ask about leave policy, payroll, onboarding, HR contacts, or company policy..."
                    />
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="icon" onClick={startVoiceInput} disabled={!voiceSupported}>
                        <Mic className="h-4 w-4" />
                      </Button>
                      <Button size="icon" onClick={() => sendMessage()} disabled={!input.trim() || typing}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Knowledge Assistant</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: "Leave Policy Guidance", text: knowledgeBase.leave, icon: CalendarClock },
                    { title: "Payroll Assistance", text: knowledgeBase.payroll, icon: Wallet },
                    { title: "Onboarding Guidance", text: knowledgeBase.onboarding, icon: ShieldCheck },
                    { title: "HR Contact Support", text: knowledgeBase.contact, icon: Headphones },
                  ].map((item) => (
                    <div key={item.title} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        <item.icon className="h-4 w-4 text-blue-500" />
                        {item.title}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{item.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card className="dark:border-slate-700 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-base">Conversation History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {messages.filter((item) => item.role === "user").length ? (
                  messages.filter((item) => item.role === "user").map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.text}</p>
                        <p className="text-xs text-slate-500">{item.category} • {item.timestamp}</p>
                      </div>
                      <Badge variant="outline">Handled</Badge>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">
                    No conversation history yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                { title: "People Ops Inbox", value: "hr@company.com", icon: Mail },
                { title: "HR Hotline", value: "+91 80 4000 2040", icon: PhoneCall },
                { title: "Policy Hub", value: "Company Handbook", icon: Search },
              ].map((item) => (
                <Card key={item.title} className="dark:border-slate-700 dark:bg-slate-900">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500">{item.title}</p>
                        <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
                      </div>
                      <item.icon className="h-5 w-5 text-slate-500" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <History className="mr-2 h-4 w-4" />
                    Open HR Copilot Tips
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Using HR Copilot</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <p>Use quick replies for common topics like leave, payroll, and onboarding.</p>
                    <p>Voice input is available on supported browsers for hands-free HR questions.</p>
                    <p>Export chat to share escalated conversations with your HR operations team.</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default SupportChatbot;

