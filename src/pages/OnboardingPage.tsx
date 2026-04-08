import { useState, useRef, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { UserCheck, FileText, Shield, CheckCircle2, Circle, Clock, Upload, MessageSquare, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

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

const mockHires: Hire[] = [
  { id: 1, avatar: "PS", name: "Priya Sharma", role: "Frontend Engineer", joinDate: "15 Apr 2026", progress: 75 },
  { id: 2, avatar: "RK", name: "Rahul Kumar", role: "Product Manager", joinDate: "18 Apr 2026", progress: 40 },
  { id: 3, avatar: "AM", name: "Anjali Mehta", role: "UI/UX Designer", joinDate: "20 Apr 2026", progress: 60 },
];

const mockDocs: Doc[] = [
  { id: 1, name: "Aadhaar Card", type: "Identity Proof", status: "verified" },
  { id: 2, name: "PAN Card", type: "Tax Document", status: "uploaded" },
  { id: 3, name: "Degree Certificate", type: "Education Proof", status: "pending" },
  { id: 4, name: "Offer Letter Signed", type: "Employment", status: "verified" },
  { id: 5, name: "Bank Details Form", type: "Payroll", status: "pending" },
];

function getBotReply(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes("leave")) return "Our leave policy includes 12 casual leaves, 12 sick leaves, and 15 earned leaves per year. Leaves can be applied via the HR portal.";
  if (msg.includes("work hour") || msg.includes("timing")) return "Standard work hours are 9:30 AM to 6:30 PM, Monday to Friday. Flexible timing is available with manager approval.";
  if (msg.includes("dress") || msg.includes("code")) return "We follow a smart-casual dress code on weekdays. Fridays are casual. Client-facing meetings require formal attire.";
  if (msg.includes("remote") || msg.includes("wfh") || msg.includes("work from home")) return "Remote work is allowed up to 2 days per week after the probation period of 3 months. Full remote requires VP approval.";
  if (msg.includes("salary") || msg.includes("pay") || msg.includes("payroll")) return "Salaries are credited on the last working day of each month. Payslips are available in the HR portal.";
  if (msg.includes("probation")) return "The probation period is 3 months from the date of joining. Performance review happens at the end of probation.";
  return `Thank you for your question about "${message}". Please reach out to HR at hr@company.com for detailed information on this topic.`;
}

export default function OnboardingPage() {
  const [hires] = useState<Hire[]>(mockHires);
  const [docs, setDocs] = useState<Doc[]>(mockDocs);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadContext, setUploadContext] = useState<{ name: string; type: string } | null>(null);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Welcome! I can help you understand company policies, leave rules, code of conduct, and more. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages([
      ...newMessages,
      { sender: "bot", text: getBotReply(input) }
    ]);
    setInput("");
  };

  const openFilePicker = (context?: { name: string; type: string }) => {
    setUploadContext(context || null);
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (uploadContext?.name) {
      setDocs((prev) =>
        prev.map((d) =>
          d.name === uploadContext.name ? { ...d, status: "uploaded" } : d
        )
      );
    } else {
      const nextId = docs.length > 0 ? Math.max(...docs.map((doc) => doc.id)) + 1 : 1;
      setDocs((prev) => [
        {
          id: nextId,
          name: file.name,
          type: "General Document",
          status: "uploaded",
        },
        ...prev,
      ]);
    }

    setUploadSuccess("Document uploaded successfully ✅");
    setTimeout(() => setUploadSuccess(null), 3000);
    event.target.value = "";
    setUploadContext(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {uploadSuccess && (
        <div className="fixed top-4 right-4 z-[9999] flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 text-success px-4 py-3 text-sm font-medium shadow-xl backdrop-blur-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}
      <div>
        <h1 className="page-header">Employee Onboarding</h1>
        <p className="page-subheader">Streamlined onboarding with automated verification & checklists</p>
      </div>
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
            <CardHeader className="pb-2"><CardTitle className="text-base">Onboarding Checklist - Priya Sharma</CardTitle></CardHeader>
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
