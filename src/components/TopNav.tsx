import {
  Bell, CheckCheck, ChevronRight, Search, Moon, Sun, MoreVertical, X, Settings, UserCircle,
  LayoutDashboard, Briefcase, UserSearch, UserPlus, Users, Clock,
  DollarSign, BarChart3, GraduationCap, Heart, Shield, FileText,
  Monitor, PieChart, UserMinus, Globe, MessageSquare, Video, Brain, Sparkles
} from "lucide-react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDefaultRoute, getStoredRole } from "@/lib/auth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNotifications } from "@/context/NotificationsContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

/* ================= MENU DATA ================= */

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
  { label: "AI Interview", icon: Video, path: "/ai/interview" },
  { label: "Resume ATS", icon: Brain, path: "/ai/ats" },
  { label: "AI Insights", icon: Sparkles, path: "/ai/insights" },
];

/* ================= COMPONENT ================= */

interface TopNavProps {
  onMenuClick?: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { recentNotifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const storedName = localStorage.getItem("name")?.trim();
  const storedEmail = localStorage.getItem("email")?.trim();
  const role = getStoredRole();
  const mobileModules = role === "employee"
    ? [{ label: "Dashboard", icon: LayoutDashboard, path: getDefaultRoute(role) }, { label: "Profile", icon: UserCircle, path: "/profile" }, { label: "Jobs", icon: Briefcase, path: "/jobs-browser" }]
    : modules;
  const mobileHrModules = role === "employee" ? [] : hrModules;
  const mobileAiFeatures = role === "employee" ? [] : aiFeatures;

  const fallbackName = storedEmail
    ? storedEmail.split("@")[0]
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
    : "User";

  const displayName = storedName || fallbackName;
  const avatarInitials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/75 px-3 backdrop-blur-xl sm:px-4 md:px-6">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          {/* MOBILE MENU BUTTON */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full lg:hidden"
            onClick={() => {
              if (onMenuClick) {
                onMenuClick();
                return;
              }

              setMenuOpen(true);
            }}
          >
            <MoreVertical className="h-5 w-5" />
          </Button>

          {/* SEARCH */}
          <div className="relative hidden min-[480px]:block w-40 sm:w-56 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 bg-secondary/50 border-0" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          {/* DARK MODE */}
          <Button variant="ghost" size="icon" onClick={() => setDark(!dark)}>
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* NOTIFICATION */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[min(92vw,360px)] rounded-xl border-border/70 p-0">
              <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Notifications</p>
                  <p className="text-xs text-muted-foreground">{unreadCount} unread updates</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={markAllAsRead}>
                  <CheckCheck className="mr-1 h-4 w-4" />
                  Mark all
                </Button>
              </div>

              <div className="max-h-[320px] overflow-y-auto p-2">
                {recentNotifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => markAsRead(notification.id)}
                    className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                      notification.read ? "hover:bg-muted/50" : "bg-primary/8 hover:bg-primary/12"
                    }`}
                  >
                    <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${notification.read ? "bg-muted" : "bg-primary"}`} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-medium">{notification.title}</span>
                        <span className="shrink-0 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                          {notification.time}
                        </span>
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        {notification.description}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              <DropdownMenuSeparator className="my-0" />
              <DropdownMenuItem onClick={() => navigate("/notifications")} className="justify-between px-4 py-3">
                View all notifications
                <ChevronRight className="h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* PROFILE */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 gap-2 rounded-full px-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback>{avatarInitials}</AvatarFallback>
                </Avatar>
                <span className="hidden max-w-[120px] truncate sm:inline text-sm">{displayName}</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/profile")} className="gap-2">
                <UserCircle className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")} className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("refresh_token");
                  localStorage.removeItem("name");
                  localStorage.removeItem("email");
                  localStorage.removeItem("role");
                  navigate("/login");
                }}
                className="text-red-500"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </header>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">

          <div className="absolute right-0 top-0 h-full w-[86vw] max-w-sm overflow-y-auto border-l border-border bg-card p-4 shadow-lg">

            {/* HEADER */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Menu</h2>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => setMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* MENU */}
            <div className="flex flex-col gap-6 text-sm">

              {/* MODULES */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Modules</p>
                {mobileModules.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-muted"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* HR */}
              {mobileHrModules.length > 0 && <div>
                <p className="text-xs text-muted-foreground mb-2">HR Tools</p>
                {mobileHrModules.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-muted"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>}

              {/* AI */}
              {mobileAiFeatures.length > 0 && <div>
                <p className="text-xs text-muted-foreground mb-2">AI Features</p>
                {mobileAiFeatures.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-muted"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>}

            </div>

          </div>
        </div>
      )}
    </>
  );
}
