import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock3, Loader2, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthField, AuthInput, AuthPanel, AuthShell, OtpPinInput } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { CompanyIdentityCard } from "@/components/workspace/WorkspacePrimitives";
import { demoOtp, findWorkspacesForEmail, getLastWorkspace, setResetEmail } from "@/lib/workspace";

const validateEmail = (email: string) => /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email);

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(30);

  const matches = email ? findWorkspacesForEmail(email) : [];
  const workspace = matches[0] || getLastWorkspace();

  useEffect(() => {
    if (step !== "otp" || !resendIn) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendIn((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendIn, step]);

  const handleContinue = async () => {
    if (step === "email") {
      if (!validateEmail(email)) {
        toast.error("Enter the email linked to your company workspace.");
        return;
      }

      if (!matches.length) {
        toast.error("We could not find a workspace for that email.");
        return;
      }

      setLoading(true);
      await new Promise((resolve) => window.setTimeout(resolve, 700));
      setLoading(false);
      setStep("otp");
      setResendIn(30);
      toast.success(`Password reset OTP sent. Use demo code ${demoOtp}.`);
      return;
    }

    if (otp !== demoOtp) {
      toast.error("Use the six-digit demo OTP to continue.");
      return;
    }

    setResetEmail(email);
    toast.success("OTP verified. Set a new password.");
    navigate("/reset-password");
  };

  return (
    <AuthShell
      eyebrow="Forgot Password"
      title="Recover your company-linked password"
      description="Reset flows stay workspace-aware too. We use your email to find the correct company tenant before issuing the OTP and new password screen."
      workspace={workspace}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr,0.9fr]">
        <AuthPanel>
          <div className="flex flex-wrap items-center gap-2">
            {["1. Enter email", "2. Verify OTP", "3. Reset password", "4. Success"].map((item, index) => (
              <span
                key={item}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  (step === "email" && index === 0) || (step === "otp" && index === 1)
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border/70 bg-background/60 text-muted-foreground"
                }`}
              >
                {item}
              </span>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 space-y-4"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
            >
              {step === "email" ? (
                <>
                  <AuthField label="Work Email">
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <AuthInput
                        className="pl-11"
                        onChange={(event) => setEmail(event.target.value.trim().toLowerCase())}
                        placeholder="you@company.com"
                        type="email"
                        value={email}
                      />
                    </div>
                  </AuthField>
                  {matches[0] ? <CompanyIdentityCard compact workspace={matches[0]} /> : null}
                </>
              ) : (
                <>
                  <AuthField hint={`Demo code ${demoOtp}`} label="Email OTP">
                    <OtpPinInput onChange={setOtp} value={otp} />
                  </AuthField>
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-primary" />
                      <span>{resendIn > 0 ? `Resend in ${resendIn}s` : "Resend available now"}</span>
                    </div>
                    <button
                      className="font-medium text-primary disabled:text-muted-foreground"
                      disabled={resendIn > 0}
                      onClick={() => {
                        setResendIn(30);
                        setOtp("");
                        toast.success(`Fresh OTP sent. Use ${demoOtp}.`);
                      }}
                      type="button"
                    >
                      Resend
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <Button className="mt-6 h-12 w-full rounded-2xl text-sm font-semibold" disabled={loading} onClick={handleContinue}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {step === "email" ? "Send Reset OTP" : "Verify OTP"}
            {!loading ? <ArrowRight className="h-4 w-4" /> : null}
          </Button>
        </AuthPanel>

        <AuthPanel>
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-foreground">Secure recovery flow</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Password recovery still keeps the user attached to a company before the reset step.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {[
              "Email identifies the correct company workspace.",
              "OTP verifies access before any password reset is shown.",
              "Company branding remains visible during recovery so users trust the flow.",
            ].map((item) => (
              <div key={item} className="rounded-[22px] border border-border/70 bg-background/60 px-4 py-4 text-sm leading-6 text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
        </AuthPanel>
      </div>
    </AuthShell>
  );
}
