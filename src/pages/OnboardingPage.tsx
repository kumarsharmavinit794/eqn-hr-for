import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { UserCheck, FileText, Shield, CheckCircle2, Circle, Clock, Upload, MessageSquare, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

type Hire = {
  id: number;
  avatar: string;
  name: string;
  role: string;
  joinDate: string;
  progress: number;
};

type Doc = {
  id: number;
  name: string;
  type: string;
  status: "verified" | "uploaded" | "pending" | string;
  filePath?: string | null;
  uploadedAt?: string | null;
};

const checklist = [
  { task: "Background Verification", status: "done", icon: Shield },
  { task: "Document Upload (Aadhar, PAN)", status: "done", icon: FileText },
  { task: "Verification Status Confirmed", status: "done", icon: CheckCircle2 },
  { task: "Email & System Accounts Created", status: "pending", icon: UserCheck },
  { task: "Welcome Kit Assigned", status: "pending", icon: Package },
  { task: "Training Module Assigned", status: "pending", icon: Clock },
  { task: "Policy Acknowledged", status: "pending", icon: FileText },
];

const docStatusColors: Record<string, string> = {
  verified: "bg-success/10 text-success border-success/20",
  uploaded: "bg-info/10 text-info border-info/20",
  pending: "bg-warning/10 text-warning border-warning/20",
};

export default function OnboardingPage() {
  const [hires, setHires] = useState<Hire[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadContext, setUploadContext] = useState<{ name: string; type: string } | null>(null);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Welcome! I can help you understand company policies, leave rules, code of conduct, and more. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    setLoadError(null);

    api
      .get("/onboarding")
      .then((res) => {
        console.log("API RESPONSE: /onboarding", res.data);
        const next = res.data?.data;
        setHires(Array.isArray(next) ? next : []);
        if (!Array.isArray(next)) setLoadError("Invalid onboarding response format");
      })
      .catch((err) => {
        console.error("Error fetching onboarding data:", err);
        setHires([]);
        setLoadError("Failed to load onboarding data");
      });

    api
      .get("/documents")
      .then((res) => {
        console.log("API RESPONSE: /documents", res.data);
        const next = res.data?.data;
        setDocs(Array.isArray(next) ? next : []);
        if (!Array.isArray(next)) setLoadError("Invalid documents response format");
      })
      .catch((err) => {
        console.error("Error fetching documents data:", err);
        setDocs([]);
        setLoadError("Failed to load documents");
      });
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    // user message add
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const res = await api.post("/onboarding/chatbot", {
        message: input
      });

      setMessages([
        ...newMessages,
        { sender: "bot", text: res.data?.data?.reply || "No response available." }
      ]);
    } catch (err) {
      console.error("Error sending message to chatbot:", err);
      alert("Failed to get a response from the chatbot.");
    }
    setInput("");
  };

  const refreshDocs = async () => {
    const res = await api.get("/documents");
    const next = res.data?.data;
    setDocs(Array.isArray(next) ? next : []);
  };

  const openFilePicker = (context?: { name: string; type: string }) => {
    setUploadContext(context || null);
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    form.append("name", uploadContext?.name || file.name);
    form.append("type", uploadContext?.type || "");

    try {
      const res = await api.post("/onboarding/documents/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("API RESPONSE: /onboarding/documents/upload", res.data);
      alert("Document Uploaded ✅");
      await refreshDocs();
    } catch (err) {
      console.error("Error uploading document:", err);
      alert("Document Upload Failed ❌");
    } finally {
      event.target.value = "";
      setUploadContext(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">Employee Onboarding</h1>
        <p className="page-subheader">Streamlined onboarding with automated verification & checklists</p>
      </div>

      {!Array.isArray(hires) || !Array.isArray(docs) ? (
        <p className="text-sm text-destructive">Error loading onboarding data.</p>
      ) : null}
      {loadError ? <p className="text-sm text-destructive">{loadError}</p> : null}

      {/* New Hires */}
      <div className="grid sm:grid-cols-3 gap-4">
        {Array.isArray(hires) && hires.map((h) => (
          <Card key={h.id} className="glass-card-hover">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-primary-foreground text-sm font-semibold">{h.avatar}</div>
                <div>
                  <p className="font-semibold text-sm">{h.name}</p>
                  <p className="text-xs text-muted-foreground">{h.role}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Joining: {h.joinDate}</p>
              <div className="flex items-center gap-2">
                <Progress value={h.progress} className="h-2 flex-1" />
                <span className="text-xs font-medium">{h.progress}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="checklist">
        <TabsList>
          <TabsTrigger value="checklist">Joining Checklist</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="chatbot">Policy Chatbot</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">Onboarding Checklist — Priya Sharma</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {checklist.map((item) => (
                  <div key={item.task} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    {item.status === "done" ? (
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                    <span className={`text-sm flex-1 ${item.status === "done" ? "line-through text-muted-foreground" : ""}`}>{item.task}</span>
                    <Badge variant="outline" className={`text-xs ${item.status === "done" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Document Management</CardTitle>
              <div className="flex items-center gap-2">
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelected} />
                <Button size="sm" variant="outline" onClick={() => openFilePicker()}>
                  <Upload className="w-4 h-4 mr-1" /> Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.isArray(docs) && docs.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.type}</p>
                    </div>
                    <Badge variant="outline" className={`text-xs ${docStatusColors[doc.status]}`}>{doc.status}</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openFilePicker({ name: doc.name, type: doc.type })}
                    >
                      Upload
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">Background Verification</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { check: "Identity Verification", status: "Passed", color: "text-success" },
                  { check: "Criminal Record Check", status: "Passed", color: "text-success" },
                  { check: "Education Verification", status: "In Progress", color: "text-warning" },
                  { check: "Employment History", status: "In Progress", color: "text-warning" },
                  { check: "Reference Check", status: "Pending", color: "text-muted-foreground" },
                ].map((v) => (
                  <div key={v.check} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">{v.check}</span>
                    <span className={`text-sm font-medium ${v.color}`}>{v.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Policy Explanation Chatbot</CardTitle></CardHeader>
            <CardContent className="flex flex-col h-[400px]"> {/* Added a fixed height for better chat experience */}
              <div className="flex-1 space-y-3 overflow-y-auto mb-4 pr-2"> {/* Added pr-2 for scrollbar spacing */}
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-2 ${m.sender === "user" ? "justify-end" : ""}`}>
                    {m.sender === "bot" && (
                      <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center shrink-0">
                        <MessageSquare className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                    <div className={`${m.sender === "user" ? "bg-primary text-primary-foreground" : "glass-card"} rounded-xl px-3 py-2 text-sm max-w-[80%]`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSend();
                    }
                  }}
                  placeholder="Ask about company policies..."
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSend}>
                  Send
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Leave policy", "Work hours", "Dress code", "Remote work"].map((p) => (
                  <button key={p} onClick={() => setInput(p)} className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-muted-foreground">{p}</button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
