import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, UserSearch, Clock, DollarSign, BarChart3, MessageSquare,
  ChevronLeft, Sparkles, Brain, Briefcase, UserPlus, GraduationCap, Heart,
  Shield, FileText, Monitor, PieChart, UserMinus, Globe, Video, Camera
} from "lucide-react";
import { getStoredRole } from "@/lib/auth";

/* ================= NAV ITEMS ================= */

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Hiring & Planning", icon: Briefcase, path: "/hiring" },
  { label: "Recruitment", icon: UserSearch, path: "/recruitment" },
  { label: "Onboarding", icon: UserPlus, path: "/onboarding" },

  // 🔥 NEW FEATURE ADDED
  { label: "Face Attendance", icon: Camera, path: "/face-attendance" },

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
  { label: "AI Interview", icon: Video, path: "/ai/interview" },
  { label: "Resume ATS", icon: Brain, path: "/ai/ats" },
  { label: "AI Insights", icon: Sparkles, path: "/ai/insights" },
];

/* ================= COMPONENT ================= */

interface Props {
  open: boolean;
  onToggle: () => void;
}

export function AppSidebar({ open, onToggle }: Props) {
  const location = useLocation();
  const role = getStoredRole();
  const employeeCore = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/employee" },
    { label: "Profile", icon: Users, path: "/profile" },
    { label: "Jobs", icon: Briefcase, path: "/jobs-browser" },
  ];
  const sidebarCore = role === "employee" ? employeeCore : navItems;
  const sidebarHrModules = role === "employee" ? [] : hrModules;
  const sidebarAiFeatures = role === "employee" ? [] : aiFeatures;

  return (
    <motion.aside
      animate={{ width: open ? 260 : 72 }}
      transition={{ duration: 0.25 }}
      className="flex h-[100dvh] w-[88vw] max-w-[260px] shrink-0 flex-col overflow-hidden border-r border-border bg-card text-card-foreground shadow-sm lg:w-auto lg:max-w-none"
    >
      {/* LOGO */}
      <div className="flex h-16 items-center border-b border-border px-4">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>

        <AnimatePresence>
          {open && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="ml-3 font-bold text-lg"
            >
              NexaHR
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* NAV */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin">

        <SectionLabel open={open}>Core</SectionLabel>
        {sidebarCore.map((item) => (
          <SidebarLink
            key={item.path}
            item={item}
            open={open}
            active={location.pathname === item.path}
          />
        ))}

        {sidebarHrModules.length > 0 && <div className="my-2 h-px bg-border" />}

        {sidebarHrModules.length > 0 && <SectionLabel open={open}>HR Modules</SectionLabel>}
        {sidebarHrModules.map((item) => (
          <SidebarLink
            key={item.path}
            item={item}
            open={open}
            active={location.pathname === item.path}
          />
        ))}

        {sidebarAiFeatures.length > 0 && <div className="my-2 h-px bg-border" />}

        {sidebarAiFeatures.length > 0 && <SectionLabel open={open}>AI Features</SectionLabel>}
        {sidebarAiFeatures.map((item) => (
          <SidebarLink
            key={item.path}
            item={item}
            open={open}
            active={location.pathname === item.path}
          />
        ))}

      </nav>

      {/* COLLAPSE BUTTON */}
      <div
        onClick={onToggle}
        className="hidden h-12 cursor-pointer items-center justify-center border-t border-border hover:bg-muted/60 lg:flex"
      >
        <ChevronLeft
          className={`w-5 h-5 transition-transform ${
            open ? "" : "rotate-180"
          }`}
        />
      </div>
    </motion.aside>
  );
}

/* ================= SUB COMPONENTS ================= */

function SectionLabel({ open, children }: any) {
  if (!open) return null;
  return (
    <p className="mt-3 mb-1 px-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
      {children}
    </p>
  );
}

function SidebarLink({ item, open, active }: any) {
  return (
    <NavLink
      to={item.path}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-primary/12 text-primary"
          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
      }`}
    >
      <item.icon className="h-4 w-4 shrink-0" />

      {open && (
        <span className="truncate">
          {item.label}
        </span>
      )}
    </NavLink>
  );
}
