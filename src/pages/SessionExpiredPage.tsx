import { ArrowRight, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AuthPanel, AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { getLastWorkspace } from "@/lib/workspace";

export default function SessionExpiredPage() {
  const navigate = useNavigate();
  const workspace = getLastWorkspace();

  return (
    <AuthShell
      eyebrow="Session Recovery"
      title="Your session expired"
      description="Your workspace context is still remembered, so you can sign back into the right company without reconfiguring branding or tenant selection."
      workspace={workspace}
    >
      <AuthPanel>
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
            <Clock3 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-foreground">Workspace preserved</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in again to restore access to your company-aware dashboard session.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button className="h-12 rounded-2xl text-sm font-semibold" onClick={() => navigate("/login")}>
            Login Again
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button className="h-12 rounded-2xl" onClick={() => navigate("/signup")} variant="outline">
            Add New Company
          </Button>
        </div>
      </AuthPanel>
    </AuthShell>
  );
}
