import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, UserSearch, Clock, DollarSign, BarChart3, MessageSquare,
  ChevronLeft, Sparkles, Brain, Briefcase, UserPlus, GraduationCap, Heart,
  Shield, FileText, Monitor, PieChart, UserMinus, Globe, Video
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Hiring & Planning", icon: Briefcase, path: "/hiring" },
  { label: "Recruitment", icon: UserSearch, path: "/recruitment" },
  { label: "Onboarding", icon: UserPlus, path: "/onboarding" },
  { label: "Employees", icon: Users, path: "/employees" },
  { label: "Attendance", icon: Clock, path: "/attendance" },
  { label: "Payroll", icon: DollarSign, path: "/payroll" },
  { label: "Performance", icon: BarChart3, path: "/performance" },
];

const hrModules = [
  { label: "Training & Dev", icon: GraduationCap, path: "/training" },
  { label: "Engagement", icon: Heart, path: "/engagement" },
  { label: "Compliance", icon: Shield, path: "/compliance" },
  { label: "Documents", icon: FileText, path: "/documents" },
  { label: "IT & Access", icon: Monitor, path: "/it-access" },
  { label: "Analytics", icon: PieChart, path: "/analytics" },
  { label: "Exit Management", icon: UserMinus, path: "/exit" },
  { label: "Culture", icon: Globe, path: "/culture" },
];

const aiFeatures = [
  { label: "AI Chat", icon: MessageSquare, path: "/ai-chat" },
  { label: "AI Interview", icon: Brain, path: "/ai/interview" },
  { label: "Resume ATS", icon: Brain, path: "/ai/ats" },
  { label: "AI Insights", icon: Sparkles, path: "/ai/insights" },
];

interface Props {
  open: boolean;
  onToggle: () => void;
}

export function AppSidebar({ open, onToggle }: Props) {
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: open ? 260 : 72 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="h-screen flex flex-col border-r border-sidebar-border bg-sidebar overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {open && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-3 font-bold text-lg gradient-text whitespace-nowrap"
            >
              NexaHR
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        <SectionLabel open={open}>Core</SectionLabel>
        {navItems.map((item) => (
          <SidebarLink key={item.path} item={item} open={open} active={location.pathname === item.path} />
        ))}
        <div className="my-2 mx-2 h-px bg-sidebar-border" />
        <SectionLabel open={open}>HR Modules</SectionLabel>
        {hrModules.map((item) => (
          <SidebarLink key={item.path} item={item} open={open} active={location.pathname === item.path} />
        ))}
        <div className="my-2 mx-2 h-px bg-sidebar-border" />
        <SectionLabel open={open}>AI Features</SectionLabel>
        {aiFeatures.map((item) => (
          <SidebarLink key={item.path} item={item} open={open} active={location.pathname === item.path} />
        ))}
      </nav>

      {/* Collapse */}
      <button
        onClick={onToggle}
        className="h-12 flex items-center justify-center border-t border-sidebar-border text-sidebar-foreground hover:text-primary transition-colors"
      >
        <motion.div animate={{ rotate: open ? 0 : 180 }} transition={{ duration: 0.2 }}>
          <ChevronLeft className="w-5 h-5" />
        </motion.div>
      </button>
    </motion.aside>
  );
}

function SectionLabel({ open, children }: { open: boolean; children: React.ReactNode }) {
  if (!open) return null;
  return <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-1 mt-2">{children}</p>;
}

function SidebarLink({ item, open, active }: { item: { label: string; icon: any; path: string }; open: boolean; active: boolean }) {
  return (
    <NavLink
      to={item.path}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
        active
          ? "bg-sidebar-accent text-sidebar-primary"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      }`}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-primary" : ""}`} />
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="whitespace-nowrap text-[13px]"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );
}
