import { CheckCircle2, LockKeyhole, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  AuthField,
  AuthInput,
  AuthPanel,
  AuthShell,
  PasswordStrengthMeter,
} from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { clearResetEmail, findWorkspacesForEmail, getLastWorkspace, getResetEmail } from "@/lib/workspace";

export default function ResetPasswordPage() {
  const resetEmail = getResetEmail();
  const workspace = (resetEmail ? findWorkspacesForEmail(resetEmail)[0] : null) || getLastWorkspace();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (password.length < 8) {
      toast.error("Use at least 8 characters for the new password.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords must match.");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 800));
    setLoading(false);
    setSuccess(true);
    clearResetEmail();
    toast.success("Password updated successfully.");
  };

  return (
    <AuthShell
      eyebrow="Reset Password"
      title={success ? "Password reset complete" : "Set a new password"}
      description={
        success
          ? "Your company-linked password has been updated. Return to login and continue into the correct workspace."
          : "Create a fresh password for your company account. The workspace context remains attached throughout the reset flow."
      }
      workspace={workspace}
    >
      <AuthPanel className="mx-auto max-w-xl">
        {success ? (
          <div className="space-y-5 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-foreground">Password updated</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                You can sign in again and Nexa HR will restore your company-aware workspace context.
              </p>
            </div>
            <Button asChild className="h-12 w-full rounded-2xl text-sm font-semibold">
              <Link to="/login">Return to Login</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <AuthField hint={resetEmail || "Company-linked user"} label="Account">
              <div className="rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm text-muted-foreground">
                {resetEmail || "Reset email not found. Continue with a new password for your active workspace account."}
              </div>
            </AuthField>

            <AuthField label="New Password">
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <AuthInput
                  className="pl-11"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a strong new password"
                  type="password"
                  value={password}
                />
              </div>
            </AuthField>

            <PasswordStrengthMeter password={password} />

            <AuthField label="Confirm Password">
              <AuthInput
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat your new password"
                type="password"
                value={confirmPassword}
              />
            </AuthField>

            <Button className="h-12 w-full rounded-2xl text-sm font-semibold" disabled={loading} onClick={handleSubmit}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Update Password
            </Button>
          </div>
        )}
      </AuthPanel>
    </AuthShell>
  );
}
