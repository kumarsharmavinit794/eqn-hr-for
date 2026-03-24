import { motion } from "framer-motion";
import { Brain, FileSearch, Wand2, Calendar, UserPlus, ScanFace, CalendarOff, Calculator, MessageCircle, Heart, TrendingDown, BookOpen, Shield, DoorOpen } from "lucide-react";

const features = [
  { icon: FileSearch, label: "Resume ATS Scoring", desc: "AI-powered applicant tracking score for every resume" },
  { icon: TrendingDown, label: "Candidate Ranking", desc: "Auto-rank candidates based on role compatibility" },
  { icon: Wand2, label: "JD Auto-Generator", desc: "Generate job descriptions from minimal input" },
  { icon: Calendar, label: "AI Interview Scheduling", desc: "Smart scheduling based on availability patterns" },
  { icon: UserPlus, label: "Onboarding Automation", desc: "Automated workflows for new employee setup" },
  { icon: ScanFace, label: "OCR Document Verification", desc: "Instant document scanning and validation" },
  { icon: ScanFace, label: "Face Attendance", desc: "Camera-based attendance verification" },
  { icon: CalendarOff, label: "Leave Prediction", desc: "Predict leave patterns using historical data" },
  { icon: Calculator, label: "Salary & Tax Calculator", desc: "Automated tax computation and salary structuring" },
  { icon: MessageCircle, label: "Support Chatbot", desc: "AI-powered employee complaint resolution" },
  { icon: Heart, label: "Mental Health Bot", desc: "Confidential wellbeing check-ins and resources" },
  { icon: TrendingDown, label: "Attrition Prediction", desc: "Identify flight-risk employees early" },
  { icon: BookOpen, label: "Skill Gap Analysis", desc: "Recommend courses based on competency gaps" },
  { icon: Shield, label: "Compliance Tracking", desc: "Monitor regulatory compliance across departments" },
  { icon: DoorOpen, label: "Exit Interview Bot", desc: "AI-conducted exit interviews with sentiment analysis" },
];

export default function AIInsightsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">AI Features & Insights</h1>
        <p className="page-subheader">Advanced AI-powered HR capabilities — coming soon</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass-card-hover rounded-xl p-5 group cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{f.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">Coming Soon</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
