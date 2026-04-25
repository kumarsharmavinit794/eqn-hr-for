import { ArrowRight, Clock3, Loader2, MailCheck, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthField, AuthPanel, AuthShell, OtpPinInput } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import {
  completePendingCompanyRegistration,
  createWorkspacePreview,
  demoOtp,
  getPendingCompanyRegistration,
} from "@/lib/workspace";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(30);

  const registration = getPendingCompanyRegistration();
  const previewWorkspace = registration ? createWorkspacePreview(registration) : null;

  useEffect(() => {
    if (!resendIn) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendIn((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendIn]);

  const handleVerify = async () => {
    if (!registration) {
      toast.error("Your company registration has expired. Start again.");
      navigate("/signup");
      return;
    }

    if (otp !== demoOtp) {
      toast.error("Use the six-digit demo OTP shown here.");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 850));
    const workspace = completePendingCompanyRegistration();
    setLoading(false);

    if (!workspace) {
      toast.error("We could not finalize that workspace.");
      return;
    }

    toast.success(`${workspace.companyName} verified successfully.`);
    navigate("/welcome-admin");
  };

  return (
    <AuthShell
      eyebrow="OTP Verification"
      title="Verify your company email"
      description="The company email anchors the workspace across the whole platform, so we verify it before onboarding the first admin."
      workspace={previewWorkspace}
    >
      {!registration ? (
        <AuthPanel>
          <p className="font-display text-lg font-semibold text-foreground">No pending company registration</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Start with company registration first, then come back to verify the workspace email.
          </p>
          <Button asChild className="mt-5 rounded-2xl">
            <Link to="/signup">Create Company Workspace</Link>
          </Button>
        </AuthPanel>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr,0.9fr]">
          <AuthPanel>
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MailCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-foreground">Enter the 6-digit code</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  We sent the OTP to <span className="font-medium text-foreground">{registration.companyEmail}</span>.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <AuthField hint={`Demo code ${demoOtp}`} label="Workspace OTP">
                <OtpPinInput onChange={setOtp} value={otp} />
              </AuthField>

              <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/50 px-4 py-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-primary" />
                  <span>{resendIn > 0 ? `Resend in ${resendIn}s` : "You can resend a new OTP now"}</span>
                </div>
                <Button
                  className="rounded-xl"
                  disabled={resendIn > 0}
                  onClick={() => {
                    setResendIn(30);
                    setOtp("");
                    toast.success(`New OTP sent. Use ${demoOtp}.`);
                  }}
                  size="sm"
                  variant="ghost"
                >
                  <RefreshCw className="h-4 w-4" />
                  Resend
                </Button>
              </div>

              <Button className="h-12 w-full rounded-2xl text-sm font-semibold" disabled={loading} onClick={handleVerify}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Verify Company Email
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </Button>
            </div>
          </AuthPanel>

          <AuthPanel>
            <p className="font-display text-lg font-semibold text-foreground">What unlocks next?</p>
            <div className="mt-5 space-y-3">
              {[
                "The workspace is created and saved as your primary company tenant.",
                "The first user is promoted to Admin (Owner role).",
                "Company branding becomes available for offers, payslips, and HR documentation.",
              ].map((item) => (
                <div key={item} className="rounded-[22px] border border-border/70 bg-background/60 px-4 py-4 text-sm leading-6 text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
          </AuthPanel>
        </div>
      )}
    </AuthShell>
  );
}
