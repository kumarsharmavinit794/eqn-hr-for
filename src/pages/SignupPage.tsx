import { ArrowRight, Building2, CheckCircle2, Loader2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  AuthField,
  AuthInput,
  AuthPanel,
  AuthShell,
  PasswordStrengthMeter,
} from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { createWorkspacePreview, demoOtp, fileToDataUrl, industryOptions, companySizeOptions, savePendingCompanyRegistration } from "@/lib/workspace";

const validateEmail = (email: string) => /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email);

export default function SignupPage() {
  const navigate = useNavigate();
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState({
    companyName: "",
    companyEmail: "",
    industry: "",
    size: "",
    password: "",
    confirmPassword: "",
    logoUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const previewWorkspace = createWorkspacePreview({
    companyName: form.companyName || "Your Company Workspace",
    companyEmail: form.companyEmail || "workspace@yourcompany.com",
    industry: form.industry || "Your industry",
    size: form.size || "Team size",
    logoUrl: form.logoUrl || undefined,
  });

  const setField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.companyName.trim()) {
      nextErrors.companyName = "Company name is required.";
    }
    if (!validateEmail(form.companyEmail)) {
      nextErrors.companyEmail = "Enter a valid company email.";
    }
    if (!form.industry) {
      nextErrors.industry = "Select your industry.";
    }
    if (!form.size) {
      nextErrors.size = "Select company size.";
    }
    if (form.password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }
    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords must match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const logoUrl = await fileToDataUrl(file);
      setField("logoUrl", logoUrl);
    } catch {
      toast.error("Could not read that logo file.");
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please complete the highlighted company details.");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    savePendingCompanyRegistration({
      companyName: form.companyName.trim(),
      companyEmail: form.companyEmail.trim().toLowerCase(),
      industry: form.industry,
      size: form.size,
      logoUrl: form.logoUrl || undefined,
    });
    setLoading(false);
    toast.success(`Workspace created. Verify with demo OTP ${demoOtp}.`);
    navigate("/verify-otp");
  };

  return (
    <AuthShell
      eyebrow="Company Registration"
      title="Create your Nexa HR company workspace"
      description="Company registration is the entry point. The company email becomes the primary workspace identity, the first user becomes the owner admin, and that company branding flows into documents, payslips, and onboarding."
      workspace={previewWorkspace}
    >
      <div className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[1.08fr,0.92fr]">
          <AuthPanel>
            <div className="flex flex-wrap items-center gap-2">
              {["1. Company details", "2. OTP verification", "3. Admin setup"].map((item) => (
                <span key={item} className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <AuthField error={errors.companyName} label="Company Name">
                <AuthInput
                  onChange={(event) => setField("companyName", event.target.value)}
                  placeholder="Nexa HR"
                  value={form.companyName}
                />
              </AuthField>

              <AuthField error={errors.companyEmail} hint="Unique identity" label="Company Email">
                <AuthInput
                  onChange={(event) => setField("companyEmail", event.target.value.toLowerCase())}
                  placeholder="workspace@company.com"
                  type="email"
                  value={form.companyEmail}
                />
              </AuthField>

              <AuthField error={errors.industry} label="Industry">
                <Select onValueChange={(value) => setField("industry", value)} value={form.industry}>
                  <SelectTrigger className="h-12 rounded-2xl border-border/70 bg-background/70 px-4">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AuthField>

              <AuthField error={errors.size} label="Company Size">
                <Select onValueChange={(value) => setField("size", value)} value={form.size}>
                  <SelectTrigger className="h-12 rounded-2xl border-border/70 bg-background/70 px-4">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizeOptions.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AuthField>
            </div>

            <div className="mt-4 rounded-[26px] border border-border/70 bg-background/50 p-4">
              <div className="flex items-start gap-4">
                <button
                  className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-dashed border-border/80 bg-background/80"
                  onClick={() => logoInputRef.current?.click()}
                  type="button"
                >
                  {form.logoUrl ? (
                    <img alt="Company logo preview" className="h-full w-full object-cover" src={form.logoUrl} />
                  ) : (
                    <UploadCloud className="h-6 w-6 text-muted-foreground" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">Company Logo Upload</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Optional, but recommended. This logo persists across login, offer letters, HR documents, and payslips.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Button className="rounded-xl" onClick={() => logoInputRef.current?.click()} type="button" variant="outline">
                      Upload Logo
                    </Button>
                    {form.logoUrl ? (
                      <Button className="rounded-xl" onClick={() => setField("logoUrl", "")} type="button" variant="ghost">
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
              <input accept="image/*" className="hidden" onChange={handleLogoUpload} ref={logoInputRef} type="file" />
            </div>
          </AuthPanel>

          <AuthPanel>
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-foreground">Secure the workspace</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  The creator automatically becomes the owner admin after verification.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <AuthField error={errors.password} label="Password">
                <AuthInput
                  onChange={(event) => setField("password", event.target.value)}
                  placeholder="Create a strong password"
                  type="password"
                  value={form.password}
                />
              </AuthField>

              <PasswordStrengthMeter password={form.password} />

              <AuthField error={errors.confirmPassword} label="Confirm Password">
                <AuthInput
                  onChange={(event) => setField("confirmPassword", event.target.value)}
                  placeholder="Repeat your password"
                  type="password"
                  value={form.confirmPassword}
                />
              </AuthField>
            </div>

            <div className="mt-6 rounded-[24px] border border-emerald-500/20 bg-emerald-500/8 p-4">
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                First user becomes Admin (Owner role)
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                That admin can invite HR and Employee accounts later. Users never self-select their role randomly.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <Button className="h-12 w-full rounded-2xl text-sm font-semibold" disabled={loading} onClick={handleSubmit}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Create Company Workspace
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </Button>
              <Button asChild className="h-12 w-full rounded-2xl" variant="ghost">
                <Link to="/login">Already have a workspace? Sign in</Link>
              </Button>
            </div>
          </AuthPanel>
        </div>
      </div>
    </AuthShell>
  );
}
