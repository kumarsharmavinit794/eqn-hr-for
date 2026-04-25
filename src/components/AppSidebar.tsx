import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Brain,
  Briefcase,
  Camera,
  ChevronLeft,
  Clock,
  DollarSign,
  FileText,
  Globe,
  GraduationCap,
  Heart,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Monitor,
  PieChart,
  Settings2,
  Shield,
  Sparkles,
  UserMinus,
  UserPlus,
  UserSearch,
  Users,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDefaultRoute, getStoredRole } from "@/lib/auth";
import {
  applyWorkspaceSession,
  getActiveWorkspace,
  getAllWorkspaces,
  getWorkspaceUpdateEventName,
  logoutWorkspaceSession,
  type WorkspaceMembership,
} from "@/lib/workspace";
import { CompanyAvatar, ProfileWorkspaceCard, WorkspaceSwitcherMenu } from "@/components/workspace/WorkspacePrimitives";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Hiring & Planning", icon: Briefcase, path: "/hiring" },
  { label: "Recruitment", icon: UserSearch, path: "/recruitment" },
  { label: "Onboarding", icon: UserPlus, path: "/onboarding" },
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
  { label: "Interview Lab", icon: Video, path: "/ai/interview-platform" },
  { label: "Resume ATS", icon: Brain, path: "/ai/ats" },
  { label: "AI Insights", icon: Sparkles, path: "/ai/insights" },
];

interface Props {
  open: boolean;
  onToggle: () => void;
}

export function AppSidebar({ open, onToggle }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const role = getStoredRole();
  const [activeWorkspace, setActiveWorkspace] = useState(() => getActiveWorkspace());
  const [allWorkspaces, setAllWorkspaces] = useState(() => getAllWorkspaces());
  const employeeCore = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/employee" },
    { label: "Profile", icon: Users, path: "/profile" },
    { label: "Jobs", icon: Briefcase, path: "/jobs-browser" },
  ];

  const sidebarCore = role === "employee" ? employeeCore : navItems;
  const sidebarHrModules = role === "employee" ? [] : hrModules;
  const sidebarAiFeatures = role === "employee" ? [] : aiFeatures;

  useEffect(() => {
    const eventName = getWorkspaceUpdateEventName();
    const syncWorkspaceState = () => {
      setActiveWorkspace(getActiveWorkspace());
      setAllWorkspaces(getAllWorkspaces());
    };

    window.addEventListener(eventName, syncWorkspaceState);
    return () => window.removeEventListener(eventName, syncWorkspaceState);
  }, []);

  const handleWorkspaceSelect = (workspace: WorkspaceMembership) => {
    const persistSession = typeof window !== "undefined" ? Boolean(window.localStorage.getItem("token")) : true;
    applyWorkspaceSession(workspace, persistSession);
    navigate(getDefaultRoute(workspace.role));
  };

  return (
    <motion.aside
      animate={{ width: open ? 260 : 72 }}
      transition={{ duration: 0.25 }}
      className="flex h-[100dvh] w-[88vw] max-w-[260px] shrink-0 flex-col overflow-hidden border-r border-border bg-card text-card-foreground shadow-sm lg:w-auto lg:max-w-none"
    >
      <div className="border-b border-border px-3 py-3">
        <div className="flex items-center gap-3 px-1 pb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-green-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>

          <AnimatePresence>
            {open && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-w-0">
                <p className="font-display truncate text-sm font-semibold">Nexa HR</p>
                <p className="truncate text-xs text-muted-foreground">Multi-tenant HR workspace</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {activeWorkspace ? (
          <WorkspaceSwitcherMenu
            activeWorkspace={activeWorkspace}
            collapsed={!open}
            onSelect={handleWorkspaceSelect}
            workspaces={allWorkspaces}
          />
        ) : (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-border/70 px-3 py-3 text-xs text-muted-foreground">
            {open ? "Create or join a workspace" : <Sparkles className="h-4 w-4" />}
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin">
        <SectionLabel open={open}>Core</SectionLabel>
        {sidebarCore.map((item) => (
          <SidebarLink active={location.pathname === item.path} item={item} key={item.path} open={open} />
        ))}

        {sidebarHrModules.length > 0 ? <div className="my-2 h-px bg-border" /> : null}

        {sidebarHrModules.length > 0 ? <SectionLabel open={open}>HR Modules</SectionLabel> : null}
        {sidebarHrModules.map((item) => (
          <SidebarLink active={location.pathname === item.path} item={item} key={item.path} open={open} />
        ))}

        {sidebarAiFeatures.length > 0 ? <div className="my-2 h-px bg-border" /> : null}

        {sidebarAiFeatures.length > 0 ? <SectionLabel open={open}>AI Features</SectionLabel> : null}
        {sidebarAiFeatures.map((item) => (
          <SidebarLink active={location.pathname === item.path} item={item} key={item.path} open={open} />
        ))}
      </nav>

      <div className="border-t border-border p-2">
        {activeWorkspace ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="mb-2 w-full text-left" type="button">
                {open ? (
                  <ProfileWorkspaceCard workspace={activeWorkspace} />
                ) : (
                  <div className="flex justify-center rounded-2xl border border-border/70 bg-background/60 p-2.5">
                    <CompanyAvatar size="sm" workspace={activeWorkspace} />
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-[280px] rounded-2xl border-border/70 p-2">
              <div className="px-3 py-2">
                <p className="truncate text-sm font-semibold">{activeWorkspace.userName}</p>
                <p className="truncate text-xs text-muted-foreground">{activeWorkspace.userEmail}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {activeWorkspace.companyName} • {activeWorkspace.role === "hr" ? "HR" : activeWorkspace.role === "admin" ? "Admin" : "Employee"}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl px-3 py-3" onClick={() => navigate("/settings")}>
                <Settings2 className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-xl px-3 py-3 text-red-500 focus:text-red-500"
                onClick={() => {
                  logoutWorkspaceSession();
                  navigate("/login");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}

        <Button className="hidden h-11 w-full rounded-2xl lg:flex" onClick={onToggle} variant="ghost">
          <ChevronLeft className={`h-5 w-5 transition-transform ${open ? "" : "rotate-180"}`} />
        </Button>
      </div>
    </motion.aside>
  );
}

function SectionLabel({ open, children }: any) {
  if (!open) {
    return null;
  }

  return <p className="mb-1 mt-3 px-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">{children}</p>;
}

function SidebarLink({ item, open, active }: any) {
  return (
    <NavLink
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        active ? "bg-primary/12 text-primary" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
      }`}
      to={item.path}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {open ? <span className="truncate">{item.label}</span> : null}
    </NavLink>
  );
}
