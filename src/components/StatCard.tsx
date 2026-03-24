import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon, iconColor }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="stat-card glass-card-hover rounded-xl"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${iconColor || "bg-primary/10"}`}>
          <Icon className={`w-5 h-5 ${iconColor ? "text-primary-foreground" : "text-primary"}`} />
        </div>
      </div>
      {change && (
        <p className={`text-xs font-medium ${
          changeType === "up" ? "text-success" : changeType === "down" ? "text-destructive" : "text-muted-foreground"
        }`}>
          {change}
        </p>
      )}
    </motion.div>
  );
}
