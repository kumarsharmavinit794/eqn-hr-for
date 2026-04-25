import { Building2, Check, ChevronsUpDown, Plus, Settings, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getRoleLabel, type WorkspaceMembership } from "@/lib/workspace";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function RoleBadge({ role, className }: { role: WorkspaceMembership["role"]; className?: string }) {
  const tone =
    role === "admin"
      ? "border-emerald-500/25 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
      : role === "hr"
        ? "border-sky-500/25 bg-sky-500/12 text-sky-700 dark:text-sky-300"
        : "border-amber-500/25 bg-amber-500/12 text-amber-700 dark:text-amber-300";

  return (
    <Badge variant="outline" className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold", tone, className)}>
      {getRoleLabel(role)}
    </Badge>
  );
}

export function CompanyAvatar({
  workspace,
  className,
  size = "md",
}: {
  workspace: Pick<WorkspaceMembership, "companyName" | "logoUrl" | "accent">;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = size === "sm" ? "h-9 w-9 text-xs" : size === "lg" ? "h-14 w-14 text-base" : "h-11 w-11 text-sm";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl border border-white/15 text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)]",
        sizeClass,
        className,
      )}
      style={{
        backgroundImage: workspace.logoUrl ? undefined : `linear-gradient(135deg, ${workspace.accent[0]}, ${workspace.accent[1]})`,
        backgroundColor: workspace.logoUrl ? "rgba(255,255,255,0.08)" : undefined,
      }}
    >
      {workspace.logoUrl ? (
        <img alt={`${workspace.companyName} logo`} className="h-full w-full rounded-2xl object-cover" src={workspace.logoUrl} />
      ) : (
        <span className="font-semibold">{getInitials(workspace.companyName) || "WH"}</span>
      )}
    </div>
  );
}

export function CompanyIdentityCard({
  workspace,
  compact = false,
  showUsage = true,
  inverted = false,
  className,
}: {
  workspace: WorkspaceMembership;
  compact?: boolean;
  showUsage?: boolean;
  inverted?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-white/10 bg-white/70 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-white/[0.04]",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <CompanyAvatar workspace={workspace} size={compact ? "md" : "lg"} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className={cn("truncate text-sm font-semibold", inverted ? "text-white" : "text-foreground")}>{workspace.companyName}</p>
            <RoleBadge role={workspace.role} />
          </div>
          <p className={cn("truncate text-xs", inverted ? "text-slate-300" : "text-muted-foreground")}>{workspace.companyEmail}</p>
          <p className={cn("mt-2 text-xs", inverted ? "text-slate-300" : "text-muted-foreground")}>
            {workspace.industry} • {workspace.size}
          </p>
        </div>
      </div>

      {showUsage ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {workspace.documentUses.map((item) => (
            <span
              key={item}
              className={cn(
                "rounded-full border px-3 py-1 text-[11px] font-medium",
                inverted
                  ? "border-white/10 bg-black/20 text-slate-300"
                  : "border-border/70 bg-background/70 text-muted-foreground",
              )}
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function WorkspaceSwitcherMenu({
  workspaces,
  activeWorkspace,
  onSelect,
  collapsed = false,
  className,
}: {
  workspaces: WorkspaceMembership[];
  activeWorkspace: WorkspaceMembership | null;
  onSelect: (workspace: WorkspaceMembership) => void;
  collapsed?: boolean;
  className?: string;
}) {
  const navigate = useNavigate();

  if (!activeWorkspace) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "group flex w-full items-center gap-3 rounded-[22px] border border-white/10 bg-gradient-to-br from-card/90 via-card/80 to-card/60 p-2.5 text-left shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all hover:border-primary/25 hover:shadow-[0_18px_60px_rgba(16,163,127,0.15)]",
            collapsed && "justify-center rounded-2xl px-0 py-2.5",
            className,
          )}
          type="button"
        >
          <CompanyAvatar workspace={activeWorkspace} size="md" />
          {!collapsed ? (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{activeWorkspace.companyName}</p>
                <p className="truncate text-xs text-muted-foreground">{getRoleLabel(activeWorkspace.role)} workspace</p>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            </>
          ) : null}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-[320px] rounded-2xl border-border/70 p-2">
        <DropdownMenuLabel className="px-3 py-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Switch Workspace
        </DropdownMenuLabel>
        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            className="rounded-xl px-3 py-3 focus:bg-primary/8"
            onClick={() => onSelect(workspace)}
          >
            <div className="flex w-full items-center gap-3">
              <CompanyAvatar workspace={workspace} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{workspace.companyName}</p>
                  {workspace.id === activeWorkspace.id ? <Check className="h-4 w-4 text-primary" /> : null}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {workspace.userEmail} • {getRoleLabel(workspace.role)}
                </p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="rounded-xl px-3 py-3" onClick={() => navigate("/signup")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Company
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-xl px-3 py-3" onClick={() => navigate("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          Workspace Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ProfileWorkspaceCard({
  workspace,
  className,
}: {
  workspace: WorkspaceMembership;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-white/10 bg-gradient-to-br from-card/95 via-card/85 to-card/65 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <CompanyAvatar workspace={workspace} size="md" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{workspace.userName}</p>
          <p className="truncate text-xs text-muted-foreground">{workspace.userEmail}</p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-border/70 bg-background/60 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{workspace.companyName}</p>
            <p className="truncate text-xs text-muted-foreground">{workspace.lastActiveLabel}</p>
          </div>
          <RoleBadge role={workspace.role} />
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Persistent company branding enabled
        </div>
      </div>
    </div>
  );
}

export function EmptyWorkspaceState({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[24px] border border-dashed border-border/70 bg-card/70 p-5 text-sm text-muted-foreground", className)}>
      <div className="flex items-center gap-2 text-foreground">
        <Building2 className="h-4 w-4 text-primary" />
        <p className="font-medium">No company workspace selected</p>
      </div>
      <p className="mt-2 leading-6">
        Every Nexa HR user belongs to a company workspace. Create one first, or switch into an invited company to continue.
      </p>
      <Button asChild className="mt-4 rounded-xl">
        <a href="/signup">Create Company Workspace</a>
      </Button>
    </div>
  );
}
