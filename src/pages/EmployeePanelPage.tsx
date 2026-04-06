import { motion } from "framer-motion";
import { BriefcaseBusiness, ShieldCheck, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function EmployeePanelPage() {
  const cards = [
    { icon: UserRound, title: "My Profile", description: "Update your personal information, phone number, and bio." },
    { icon: BriefcaseBusiness, title: "Open Jobs", description: "Browse open roles that employees can view internally." },
    { icon: ShieldCheck, title: "Secure Access", description: "Your account only exposes your own profile and approved views." },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-2">
        <h1 className="page-header">Employee Dashboard</h1>
        <p className="page-subheader">A focused view for personal profile access and role-appropriate job visibility.</p>
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
