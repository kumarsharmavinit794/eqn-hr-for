import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthField, AuthInput, AuthPanel, AuthShell, OtpPinInput } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import {
  CompanyIdentityCard,
  EmptyWorkspaceState,
  WorkspaceSwitcherMenu,
} from "@/components/workspace/WorkspacePrimitives";
import { getDefaultRoute } from "@/lib/auth";
import {
  applyWorkspaceSession,
  demoOtp,
  findWorkspacesForEmail,
  getEmailSuggestions,
  getLastWorkspace,
  getWorkspaceUpdateEventName,
  hasRoleConfirmation,
  setActiveWorkspace,
} from "@/lib/workspace";

const validateEmail = (email) => /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email);

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loginMethod, setLoginMethod] = useState("password");
  const [otpRequested, setOtpRequested] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [lastWorkspace, setLastWorkspace] = useState(() => getLastWorkspace());

  const matches = email ? findWorkspacesForEmail(email) : [];
  const selectedWorkspace =
    matches.find((workspace) => workspace.id === selectedWorkspaceId) || matches[0] || (!email ? lastWorkspace : null);
  const workspaceEventName = getWorkspaceUpdateEventName();

  useEffect(() => {
    const syncWorkspace = () => setLastWorkspace(getLastWorkspace());
    window.addEventListener(workspaceEventName, syncWorkspace);
    return () => window.removeEventListener(workspaceEventName, syncWorkspace);
  }, [workspaceEventName]);

  useEffect(() => {
    if (!matches.length) {
      if (email) {
        setSelectedWorkspaceId("");
      }
      return;
    }

    if (!matches.some((workspace) => workspace.id === selectedWorkspaceId)) {
      const preferredWorkspace = matches.find((workspace) => workspace.id === lastWorkspace?.id) || matches[0];
      setSelectedWorkspaceId(preferredWorkspace.id);
    }
  }, [email, lastWorkspace?.id, matches, selectedWorkspaceId]);

  useEffect(() => {
    if (!resendIn) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendIn((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendIn]);

  const handleContinue = async () => {
    if (!validateEmail(email)) {
      toast.error("Enter your company-linked email to continue.");
      return;
    }

    if (!selectedWorkspace) {
      toast.error("We could not find a company workspace for that email.");
      return;
    }

    if (loginMethod === "password" && !password.trim()) {
      toast.error("Enter your password to continue.");
      return;
    }

    if (loginMethod === "otp" && !otpRequested) {
      setOtpRequested(true);
      setResendIn(30);
      toast.success(`Email OTP sent. Use demo code ${demoOtp}.`);
      return;
    }

    if (loginMethod === "otp" && otp !== demoOtp) {
      toast.error("Use the six-digit demo OTP shown on screen.");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 850));
    setActiveWorkspace(selectedWorkspace);
    applyWorkspaceSession(selectedWorkspace, rememberMe);
    setLoading(false);

    if (selectedWorkspace.role !== "admin" && !hasRoleConfirmation(selectedWorkspace.id)) {
      toast.success(`Workspace ready for ${selectedWorkspace.companyName}.`);
      navigate("/role-confirmation");
      return;
    }

    toast.success(`Welcome back to ${selectedWorkspace.companyName}.`);
    navigate(getDefaultRoute(selectedWorkspace.role));
  };

  const companyAwareLabel =
    matches.length > 1
      ? `You have access to ${matches.length} companies. Switch the active workspace before continuing.`
      : matches.length === 1
        ? `You are logging into ${matches[0].companyName}.`
        : email
          ? "We will detect your company workspace as soon as your email matches an invited tenant."
          : "Enter your company email and Nexa HR will identify the workspace automatically.";

  return (
    <AuthShell
      eyebrow="Workspace Login"
      title="Sign in to your company workspace"
      description="Every Nexa HR user signs into a company-owned tenant. Your email helps us identify the right workspace, preserve company branding, and route you into the correct role experience."
      workspace={selectedWorkspace}
    >
      <div className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[1.15fr,0.85fr]">
          <AuthPanel>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-lg font-semibold text-foreground">Work email first</p>
                <p className="mt-1 text-sm text-muted-foreground">{companyAwareLabel}</p>
              </div>
              <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Smart company match
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <AuthField label="Email" hint="Company aware">
                <AuthInput
                  autoComplete="email"
                  list="workspace-email-suggestions"
                  onChange={(event) => {
                    setEmail(event.target.value.trim().toLowerCase());
                    setOtp("");
                    setOtpRequested(false);
                  }}
                  placeholder="you@company.com"
                  value={email}
                />
                <datalist id="workspace-email-suggestions">
                  {getEmailSuggestions().map((suggestion) => (
                    <option key={suggestion} value={suggestion} />
                  ))}
                </datalist>
              </AuthField>

              {matches.length > 1 && selectedWorkspace ? (
                <div className="rounded-[24px] border border-border/70 bg-background/50 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Switch Workspace</p>
                      <p className="text-xs text-muted-foreground">ChatGPT-style tenant switcher for shared users</p>
                    </div>
                    <WorkspaceSwitcherMenu
                      activeWorkspace={selectedWorkspace}
                      onSelect={(workspace) => setSelectedWorkspaceId(workspace.id)}
                      workspaces={matches}
                    />
                  </div>
                </div>
              ) : null}

              {matches.length === 1 && selectedWorkspace ? (
                <CompanyIdentityCard compact workspace={selectedWorkspace} />
              ) : null}

              {!matches.length && email && validateEmail(email) ? <EmptyWorkspaceState /> : null}

              {!email && lastWorkspace ? (
                <div className="rounded-[24px] border border-border/70 bg-background/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Last logged-in company</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Resume the previous workspace without re-selecting it.
                      </p>
                    </div>
                    <Button
                      className="rounded-xl"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEmail(lastWorkspace.userEmail);
                        setSelectedWorkspaceId(lastWorkspace.id);
                      }}
                    >
                      Use recent
                    </Button>
                  </div>
                  <CompanyIdentityCard className="mt-4" compact workspace={lastWorkspace} />
                </div>
              ) : null}
            </div>
          </AuthPanel>

          <AuthPanel className="flex flex-col justify-between">
            <div>
              <p className="font-display text-lg font-semibold text-foreground">Login method</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Use your password or switch to email OTP for fast, company-aware access.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2 rounded-[22px] border border-border/70 bg-background/40 p-1">
                <button
                  className={`rounded-[18px] px-4 py-3 text-sm font-medium transition-all ${
                    loginMethod === "password"
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => {
                    setLoginMethod("password");
                    setOtpRequested(false);
                    setOtp("");
                  }}
                  type="button"
                >
                  Password
                </button>
                <button
                  className={`rounded-[18px] px-4 py-3 text-sm font-medium transition-all ${
                    loginMethod === "otp" ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => {
                    setLoginMethod("otp");
                    setPassword("");
                  }}
                  type="button"
                >
                  Email OTP
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={loginMethod === "password" ? "password" : otpRequested ? "otp-entry" : "otp-send"}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 space-y-4"
                  exit={{ opacity: 0, y: -8 }}
                  initial={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.22 }}
                >
                  {loginMethod === "password" ? (
                    <>
                      <AuthField label="Password">
                        <AuthInput
                          autoComplete="current-password"
                          onChange={(event) => setPassword(event.target.value)}
                          placeholder="Enter your password"
                          type="password"
                          value={password}
                        />
                      </AuthField>

                      <label className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/50 px-4 py-3">
                        <Checkbox checked={rememberMe} onCheckedChange={(checked) => setRememberMe(Boolean(checked))} />
                        <span className="text-sm text-muted-foreground">Remember me for a persistent session</span>
                      </label>
                    </>
                  ) : otpRequested ? (
                    <>
                      <AuthField label="Email OTP" hint={`Demo code ${demoOtp}`}>
                        <OtpPinInput onChange={setOtp} value={otp} />
                      </AuthField>
                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/50 px-4 py-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" />
                          <span>OTP sent to {email}</span>
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
                          {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend"}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-border/70 bg-background/40 p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Login via OTP</p>
                          <p className="text-xs text-muted-foreground">We will send a six-digit email code to your workspace identity.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 space-y-4">
              <Button className="h-12 w-full rounded-2xl text-sm font-semibold" disabled={loading} onClick={handleContinue}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loginMethod === "otp" ? (otpRequested ? "Verify OTP & Continue" : "Send Email OTP") : "Continue"}
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/70" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button asChild className="h-12 rounded-2xl" variant="outline">
                  <Link to="/signup">Create Company Workspace</Link>
                </Button>
                <Button asChild className="h-12 rounded-2xl" variant="ghost">
                  <Link to="/forgot-password">Forgot Password</Link>
                </Button>
              </div>
            </div>
          </AuthPanel>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]">
          <AuthPanel>
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Why company-first?</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Company identity stays visible throughout authentication so document templates, payroll artifacts, and
                  offer letters always inherit the right branding.
                </p>
              </div>
            </div>
          </AuthPanel>

          <AuthPanel>
            <div className="flex flex-wrap items-center gap-2">
              {["Persistent login", "Workspace switching", "Role-aware routing", "Branding memory"].map((item) => (
                <span key={item} className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Try <span className="font-medium text-foreground">aarav@nexahr.ai</span> for a single workspace or{" "}
              <span className="font-medium text-foreground">riya@sharedworkspace.com</span> for multi-company switching.
            </div>
          </AuthPanel>
        </div>
      </div>
    </AuthShell>
  );
}
