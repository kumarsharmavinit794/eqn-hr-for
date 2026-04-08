import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, KeyRound, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api, { isApiError } from "@/lib/api";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const [token, setToken] = useState(params.get("token") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const canSubmit = useMemo(() => token.trim() && password.length >= 8 && password === confirmPassword, [token, password, confirmPassword]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const response = await api.post("/auth/reset-password", { token, new_password: password });
      setMessage(response.data?.message || "Password updated successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (isApiError(error)) {
        setMessage(error.response?.data?.message || "Could not reset password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-3xl border border-border/60 bg-card p-6 shadow-xl sm:p-8">
        <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Reset password</h1>
          <p className="text-sm text-muted-foreground">Use the token from your email or backend logs and set a new strong password.</p>
        </div>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Reset token</label>
            <Input value={token} onChange={(event) => setToken(event.target.value)} placeholder="Paste reset token" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">New password</label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="password" className="pl-10" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Strong password" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm password</label>
            <Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat password" />
          </div>
          <Button className="w-full" disabled={loading || !canSubmit} onClick={handleSubmit}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Update password
          </Button>
          {message && <p className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">{message}</p>}
        </div>
      </motion.div>
    </div>
  );
}
