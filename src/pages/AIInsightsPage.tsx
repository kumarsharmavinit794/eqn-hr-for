import { motion } from "framer-motion";
import {
  FileSearch, Wand2, Calendar, UserPlus, ScanFace,
  CalendarOff, Calculator, MessageCircle, Heart,
  TrendingDown, BookOpen, Shield, DoorOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  { icon: FileSearch, label: "Resume ATS Scoring", desc: "AI-powered applicant tracking score for every resume", path: "/ai/resume-ats" },
  { icon: TrendingDown, label: "Candidate Ranking", desc: "Auto-rank candidates based on role compatibility", path: "/ai/candidate-ranking" },
  { icon: Wand2, label: "JD Auto-Generator", desc: "Generate job descriptions from minimal input", path: "/ai/jd-generator" },
  { icon: Calendar, label: "AI Interview Scheduling", desc: "Smart scheduling based on availability patterns", path: "/ai/interview" },
  { icon: UserPlus, label: "Onboarding Automation", desc: "Automated workflows for new employee setup", path: "/ai/onboarding" },
  { icon: ScanFace, label: "OCR Document Verification", desc: "Instant document scanning and validation", path: "/ai/ocr" },

  { icon: ScanFace, label: "Face Attendance", desc: "Camera-based attendance verification", path: "/face-attendance" },

  { icon: CalendarOff, label: "Leave Prediction", desc: "Predict leave patterns using historical data", path: "/ai/leave" },
  { icon: Calculator, label: "Salary & Tax Calculator", desc: "Automated tax computation and salary structuring", path: "/ai/salary" },
  { icon: MessageCircle, label: "Support Chatbot", desc: "AI-powered employee complaint resolution", path: "/ai/support" },
  { icon: Heart, label: "Mental Health Bot", desc: "Confidential wellbeing check-ins and resources", path: "/ai/mental-health" },
  { icon: TrendingDown, label: "Attrition Prediction", desc: "Identify flight-risk employees early", path: "/ai/attrition" },
  { icon: BookOpen, label: "Skill Gap Analysis", desc: "Recommend courses based on competency gaps", path: "/ai/skill-gap" },
  { icon: Shield, label: "Compliance Tracking", desc: "Monitor regulatory compliance across departments", path: "/ai/compliance" },
  { icon: DoorOpen, label: "Exit Interview Bot", desc: "AI-conducted exit interviews with sentiment analysis", path: "/ai/exit" },
];

export default function AIInsightsPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 w-full"
    >
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">
          AI Features & Insights
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Advanced AI-powered HR capabilities
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}

            // ✅ CLICK ENABLED FOR ALL WITH PATH
            onClick={() => f.path && navigate(f.path)}

            className="glass-card-hover rounded-xl p-5 group cursor-pointer hover:shadow-lg transition-all"
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

            <div className="mt-3 flex items-center justify-between">
              
              {/* ✅ DYNAMIC STATUS */}
              {!f.path ? (
                <span className="text-[10px] uppercase tracking-wider font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
              ) : (
                <span className="text-xs text-primary font-medium">
                  Open →
                </span>
              )}

            </div>

          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}