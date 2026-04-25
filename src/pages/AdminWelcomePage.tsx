import { ArrowRight, Building2, FileBadge2, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AuthPanel, AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { applyWorkspaceSession, getActiveWorkspace } from "@/lib/workspace";

export default function AdminWelcomePage() {
  const navigate = useNavigate();
  const workspace = getActiveWorkspace();

  if (!workspace) {
    return (
      <AuthShell
        eyebrow="Admin Setup"
        title="Start with company registration"
        description="We could not find an active workspace to finish onboarding."
      >
        <AuthPanel>
          <Button className="rounded-2xl" onClick={() => navigate("/signup")}>
            Create Company Workspace
          </Button>
        </AuthPanel>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Owner Admin"
      title={`You are the Admin of ${workspace.companyName}`}
      description="The company creator becomes the owner admin automatically. You can now continue to setup, invite HR and employee users, and carry your workspace branding into every document."
      workspace={workspace}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr,0.92fr]">
        <AuthPanel>
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-foreground">Owner privileges activated</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your workspace is verified and ready for onboarding.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {[
              `${workspace.companyName} is now your primary company tenant.`,
              "Admin is the top-level owner role for invitations, company settings, and workspace identity.",
              "Every future HR or Employee user will be linked back to this workspace.",
            ].map((item) => (
              <div key={item} className="rounded-[22px] border border-border/70 bg-background/60 px-4 py-4 text-sm leading-6 text-muted-foreground">
                {item}
              </div>
            ))}
          </div>

          <Button
            className="mt-6 h-12 w-full rounded-2xl text-sm font-semibold"
            onClick={() => {
              applyWorkspaceSession(workspace, true);
              toast.success(`${workspace.companyName} is ready for setup.`);
              navigate("/onboarding");
            }}
          >
            Continue to Setup
            <ArrowRight className="h-4 w-4" />
          </Button>
        </AuthPanel>

        <AuthPanel>
          <p className="font-display text-lg font-semibold text-foreground">Company data will be reused in:</p>
          <div className="mt-5 space-y-3">
            <div className="rounded-[22px] border border-border/70 bg-background/60 p-4">
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                <FileBadge2 className="h-4 w-4 text-primary" />
                Offer Letters
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Branded documents inherit company name, workspace email, and logo automatically.
              </p>
            </div>
            <div className="rounded-[22px] border border-border/70 bg-background/60 p-4">
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                <Building2 className="h-4 w-4 text-primary" />
                HR Documents
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Company identity stays visible in policy docs, onboarding letters, and templates.
              </p>
            </div>
            <div className="rounded-[22px] border border-border/70 bg-background/60 p-4">
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Payslips
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Payroll artifacts stay tenant-specific so users always know which company they are working inside.
              </p>
            </div>
          </div>
        </AuthPanel>
      </div>
    </AuthShell>
  );
}
