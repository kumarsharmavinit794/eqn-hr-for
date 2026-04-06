import { motion } from "framer-motion";
import { Briefcase, FileUp, Users2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HRPanelPage() {
  const cards = [
    { icon: Users2, title: "Candidates", description: "Manage shortlisted, interview, and rejected candidates from one place." },
    { icon: FileUp, title: "Resume Uploads", description: "Securely upload resumes and auto-create candidate profiles with parsed skills." },
    { icon: Briefcase, title: "Jobs", description: "Create new roles, manage openings, and collaborate with hiring managers." },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-2">
        <h1 className="page-header">HR Workspace</h1>
        <p className="page-subheader">Day-to-day hiring operations, onboarding coordination, and employee activity visibility.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title} className="glass-card">
            <CardContent className="space-y-4 p-6">
              <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary"><card.icon className="h-5 w-5" /></div>
              <div>
                <h2 className="text-lg font-semibold">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
