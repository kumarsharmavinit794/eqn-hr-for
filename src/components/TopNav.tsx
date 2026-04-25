import {
  Bell,
  BarChart3,
  Brain,
  Briefcase,
  CheckCheck,
  ChevronRight,
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
  Moon,
  MoreVertical,
  PieChart,
  Search,
  Settings,
  Shield,
  Sparkles,
  Sun,
  UserCircle,
  UserMinus,
  UserPlus,
  UserSearch,
  Users,
  Video,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CompanyAvatar, RoleBadge } from "@/components/workspace/WorkspacePrimitives";
import { useNotifications } from "@/context/NotificationsContext";
import { getDefaultRoute, getStoredAuthValue, getStoredRole } from "@/lib/auth";
import { getActiveWorkspace, getWorkspaceUpdateEventName, logoutWorkspaceSession } from "@/lib/workspace";

const modules = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
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
  { label: "Interview Lab", icon: Video, path: "/ai/interview-platform" },
  { label: "Resume ATS", icon: Brain, path: "/ai/ats" },
  { label: "AI Insights", icon: Sparkles, path: "/ai/insights" },
];

interface TopNavProps {
  onMenuClick?: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState(() => getActiveWorkspace());
  const navigate = useNavigate();
  const { recentNotifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const storedName = getStoredAuthValue("name")?.trim();
  const storedEmail = getStoredAuthValue("email")?.trim();
  const role = getStoredRole();
  const mobileModules =
    role === "employee"
      ? [
          { label: "Dashboard", icon: LayoutDashboard, path: getDefaultRoute(role) },
          { label: "Profile", icon: UserCircle, path: "/profile" },
          { label: "Jobs", icon: Briefcase, path: "/jobs-browser" },
        ]
      : modules;
  const mobileHrModules = role === "employee" ? [] : hrModules;
  const mobileAiFeatures = role === "employee" ? [] : aiFeatures;

  const fallbackName = storedEmail
    ? storedEmail
        .split("@")[0]
        .split(/[._-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "User";

  const displayName = storedName || activeWorkspace?.userName || fallbackName;
  const avatarInitials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const eventName = getWorkspaceUpdateEventName();
    const syncWorkspace = () => setActiveWorkspace(getActiveWorkspace());
    window.addEventListener(eventName, syncWorkspace);
    return () => window.removeEventListener(eventName, syncWorkspace);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/75 px-3 backdrop-blur-xl sm:px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            className="h-10 w-10 rounded-full lg:hidden"
            onClick={() => {
              if (onMenuClick) {
                onMenuClick();
                return;
              }

              setMenuOpen(true);
            }}
            size="icon"
            variant="ghost"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>

          <div className="relative hidden w-40 min-[480px]:block sm:w-56 md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="border-0 bg-secondary/50 pl-9" placeholder="Search..." />
          </div>

          {activeWorkspace ? (
            <div className="hidden items-center gap-3 rounded-full border border-border/70 bg-background/70 px-2.5 py-1.5 shadow-sm md:flex">
              <CompanyAvatar size="sm" workspace={activeWorkspace} />
              <div className="min-w-0">
                <p className="max-w-[160px] truncate text-xs font-semibold text-foreground">{activeWorkspace.companyName}</p>
                <p className="max-w-[160px] truncate text-[11px] text-muted-foreground">{activeWorkspace.industry}</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setDark(!dark)} size="icon" variant="ghost">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="relative" size="icon" variant="ghost">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {unreadCount}
                  </span>
                ) : null}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[min(92vw,360px)] rounded-xl border-border/70 p-0">
              <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Notifications</p>
                  <p className="text-xs text-muted-foreground">{unreadCount} unread updates</p>
                </div>
                <Button className="h-8 px-2 text-xs" onClick={markAllAsRead} size="sm" variant="ghost">
                  <CheckCheck className="mr-1 h-4 w-4" />
                  Mark all
                </Button>
              </div>

              <div className="max-h-[320px] overflow-y-auto p-2">
                {recentNotifications.map((notification) => (
                  <button
                    className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                      notification.read ? "hover:bg-muted/50" : "bg-primary/8 hover:bg-primary/12"
                    }`}
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    type="button"
                  >
                    <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${notification.read ? "bg-muted" : "bg-primary"}`} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-medium">{notification.title}</span>
                        <span className="shrink-0 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                          {notification.time}
                        </span>
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">{notification.description}</span>
                    </span>
                  </button>
                ))}
              </div>

              <DropdownMenuSeparator className="my-0" />
              <DropdownMenuItem className="justify-between px-4 py-3" onClick={() => navigate("/notifications")}>
                View all notifications
                <ChevronRight className="h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-10 gap-2 rounded-full px-2" variant="ghost">
                <Avatar className="h-7 w-7">
                  <AvatarFallback>{avatarInitials}</AvatarFallback>
                </Avatar>
                <span className="hidden max-w-[120px] truncate text-sm sm:inline">{displayName}</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {activeWorkspace ? (
                <>
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-semibold">{displayName}</p>
                    <p className="truncate text-xs text-muted-foreground">{storedEmail || activeWorkspace.userEmail}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <RoleBadge role={activeWorkspace.role} />
                      <span className="truncate text-xs text-muted-foreground">{activeWorkspace.companyName}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                </>
              ) : null}

              <DropdownMenuItem className="gap-2" onClick={() => navigate("/profile")}>
                <UserCircle className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onClick={() => navigate("/settings")}>
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500"
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
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-[86vw] max-w-sm overflow-y-auto border-l border-border bg-card p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Menu</h2>
              <Button className="h-10 w-10 rounded-full" onClick={() => setMenuOpen(false)} size="icon" variant="ghost">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {activeWorkspace ? (
              <div className="mb-5 rounded-[24px] border border-border/70 bg-background/60 p-4">
                <div className="flex items-center gap-3">
                  <CompanyAvatar size="sm" workspace={activeWorkspace} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{activeWorkspace.companyName}</p>
                    <p className="truncate text-xs text-muted-foreground">{activeWorkspace.userEmail}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <RoleBadge role={activeWorkspace.role} />
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-6 text-sm">
              <div>
                <p className="mb-2 text-xs text-muted-foreground">Modules</p>
                {mobileModules.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-muted"
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setMenuOpen(false);
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {mobileHrModules.length > 0 ? (
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">HR Tools</p>
                  {mobileHrModules.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-muted"
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setMenuOpen(false);
                        }}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {mobileAiFeatures.length > 0 ? (
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">AI Features</p>
                  {mobileAiFeatures.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-muted"
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setMenuOpen(false);
                        }}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
