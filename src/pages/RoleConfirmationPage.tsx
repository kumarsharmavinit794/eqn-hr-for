import { ArrowRight, BadgeCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AuthPanel, AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { RoleBadge } from "@/components/workspace/WorkspacePrimitives";
import { getDefaultRoute } from "@/lib/auth";
import { getActiveWorkspace, markRoleConfirmation } from "@/lib/workspace";

export default function RoleConfirmationPage() {
  const navigate = useNavigate();
  const workspace = getActiveWorkspace();

  if (!workspace) {
    return (
      <AuthShell
        eyebrow="Role Confirmation"
        title="No workspace session found"
        description="Sign in again to confirm your role and continue."
      >
        <AuthPanel>
          <Button className="rounded-2xl" onClick={() => navigate("/login")}>
            Return to Login
          </Button>
        </AuthPanel>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Assigned Role"
      title={`Your role: ${workspace.role === "hr" ? "HR" : "Employee"}`}
      description="Roles are assigned by your company admin. Confirm the role below before you enter your company workspace."
      workspace={workspace}
    >
      <div className="grid gap-4 lg:grid-cols-[0.95fr,1.05fr]">
        <AuthPanel>
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-foreground">Role assigned by admin</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your company controls access and workspace visibility centrally.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-border/70 bg-background/60 p-5">
            <p className="text-sm text-muted-foreground">Company</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{workspace.companyName}</p>
            <div className="mt-4 flex items-center gap-3">
              <RoleBadge role={workspace.role} />
              <span className="text-sm text-muted-foreground">{workspace.userEmail}</span>
            </div>
          </div>

          <Button
            className="mt-6 h-12 w-full rounded-2xl text-sm font-semibold"
            onClick={() => {
              markRoleConfirmation(workspace.id);
              toast.success(`Role confirmed for ${workspace.companyName}.`);
              navigate(getDefaultRoute(workspace.role));
            }}
          >
            Continue to Workspace
            <ArrowRight className="h-4 w-4" />
          </Button>
        </AuthPanel>

        <AuthPanel>
          <p className="font-display text-lg font-semibold text-foreground">What your role unlocks</p>
          <div className="mt-5 space-y-3">
            {(workspace.role === "hr"
              ? [
                  "HR can manage employee lifecycle flows, onboarding, payroll handoffs, and company documents.",
                  "Company branding remains pinned while you create offer letters or policy documents.",
                  "Admins can still invite more users and change workspace settings above your access level.",
                ]
              : [
                  "Employees get a focused experience for personal dashboard, profile, jobs, and company-owned records.",
                  "Company identity remains visible so payslips and letters always show the correct employer context.",
                  "Admins and HR teams manage your role assignment centrally.",
                ]).map((item) => (
              <div key={item} className="rounded-[22px] border border-border/70 bg-background/60 px-4 py-4 text-sm leading-6 text-muted-foreground">
                {item}
              </div>
            ))}
            <div className="rounded-[22px] border border-primary/15 bg-primary/8 p-4">
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                <Users className="h-4 w-4 text-primary" />
                Every user belongs to the same company workspace
              </div>
            </div>
          </div>
        </AuthPanel>
      </div>
    </AuthShell>
  );
}
