import { motion } from "framer-motion";
import { Brain, FileSearch } from "lucide-react";

export default function AIATSPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">Resume ATS Scoring</h1>
        <p className="page-subheader">Upload a resume to get an AI-powered ATS compatibility score</p>
      </div>

      <div className="glass-card rounded-xl p-10 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-lg font-semibold mb-2">AI Resume Analyzer</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Drop a resume to analyze skills, experience, education, and get a match score against any job description.
        </p>
        <div className="border-2 border-dashed border-border rounded-xl p-8 hover:border-primary/50 transition-colors cursor-pointer">
          <FileSearch className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Drag & drop resume or click to browse</p>
          <p className="text-xs text-muted-foreground mt-1">PDF, DOCX supported</p>
        </div>
      </div>
    </motion.div>
  );
}
