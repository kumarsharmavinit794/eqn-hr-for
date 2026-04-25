import { motion } from "framer-motion";
import { Building2, FileBadge2, Files, MoonStar, ShieldCheck, Sparkles, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import type { ComponentProps, ReactNode } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type WorkspaceMembership } from "@/lib/workspace";
import { CompanyIdentityCard } from "@/components/workspace/WorkspacePrimitives";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  workspace,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  workspace?: WorkspaceMembership | null;
  aside?: ReactNode;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,163,127,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_28%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(255,255,255,0.18))] dark:bg-[linear-gradient(135deg,rgba(2,6,23,0.8),rgba(15,23,42,0.55))]" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#10A37F,#34D399)] text-white shadow-[0_20px_50px_rgba(16,163,127,0.3)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.24em] text-foreground">Nexa HR</p>
              <p className="text-xs text-muted-foreground">Company-first authentication</p>
            </div>
          </Link>

          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-full border-white/20 bg-card/70 backdrop-blur-xl"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </Button>
        </header>

        <div className="mt-8 grid flex-1 gap-6 xl:grid-cols-[1.05fr,0.95fr]">
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="hidden overflow-hidden rounded-[32px] border border-white/10 bg-slate-950 px-6 py-7 text-white shadow-[0_30px_120px_rgba(2,6,23,0.45)] xl:flex xl:flex-col"
          >
            {aside || <DefaultShowcase workspace={workspace} />}
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.04 }}
            className="flex items-center justify-center"
          >
            <div className="w-full max-w-2xl rounded-[32px] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0.72))] p-5 shadow-[0_30px_120px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.82))] sm:p-7">
              <div className="mb-6">
                <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
                <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-[2.4rem]">
                  {title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
              </div>
              {children}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

function DefaultShowcase({ workspace }: { workspace?: WorkspaceMembership | null }) {
  return (
    <>
      <div>
        <p className="font-display text-xs font-semibold uppercase tracking-[0.32em] text-emerald-300">Workspace Graph</p>
        <h2 className="mt-3 max-w-xl font-display text-[2.2rem] font-semibold leading-tight text-white">
          One company identity flowing through every employee touchpoint.
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
          Nexa HR keeps your company logo, workspace email, and operating identity anchored across onboarding, payroll,
          documents, and daily session context.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <ShowcaseStat icon={Building2} label="Company-first" value="Every user belongs to a workspace" />
        <ShowcaseStat icon={ShieldCheck} label="Persistent session" value="ChatGPT-style workspace memory" />
        <ShowcaseStat icon={Files} label="Brand reuse" value="Offer letters, docs, payslips" />
      </div>

      <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
        <div className="grid gap-4 lg:grid-cols-[1fr,0.88fr]">
          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/80">Company identity</p>
              <p className="mt-2 text-sm text-slate-200">
                The selected company stays visible at the top and side so users always know which workspace they are
                editing for.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">Workspace switching</p>
              <p className="mt-2 text-sm text-slate-200">
                Consultants, shared services teams, and group admins can move between companies without losing context.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-amber-200/80">Role-aware access</p>
              <p className="mt-2 text-sm text-slate-200">
                Admin, HR, and Employee permissions are reflected visually before each user lands in their dashboard.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,163,127,0.2),rgba(15,23,42,0.55))] p-4">
            {workspace ? (
              <CompanyIdentityCard className="border-white/10 bg-white/[0.08] shadow-none" inverted workspace={workspace} />
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/20 bg-black/15 p-5">
                <p className="font-display text-lg font-semibold text-white">Premium company-aware login</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Try `aarav@nexahr.ai` for a direct workspace match or `riya@sharedworkspace.com` to preview multi-company
                  switching.
                </p>
              </div>
            )}

            <div className="mt-4 rounded-[24px] border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-3 text-sm text-white">
                <FileBadge2 className="h-4 w-4 text-emerald-300" />
                Offer letters inherit company branding automatically
              </div>
              <div className="mt-3 flex items-center gap-3 text-sm text-white">
                <Files className="h-4 w-4 text-sky-300" />
                Payroll docs stay scoped to the selected workspace
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ShowcaseStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
        <Icon className="h-5 w-5 text-emerald-300" />
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-200">{value}</p>
    </div>
  );
}

export function AuthPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("rounded-[28px] border border-border/70 bg-card/70 p-5 shadow-sm backdrop-blur-xl", className)}>{children}</div>;
}

export function AuthField({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </span>
      {children}
      {error ? <span className="block text-xs text-red-500">{error}</span> : null}
    </label>
  );
}

export function AuthInput(props: ComponentProps<typeof Input>) {
  return (
    <Input
      {...props}
      className={cn(
        "h-12 rounded-2xl border-border/70 bg-background/70 px-4 shadow-[0_0_0_0_rgba(16,163,127,0)] transition-all focus-visible:border-primary/50 focus-visible:ring-primary/30",
        props.className,
      )}
    />
  );
}

export function PasswordStrengthMeter({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const label = score >= 5 ? "Excellent" : score >= 4 ? "Strong" : score >= 3 ? "Fair" : password ? "Weak" : "Waiting";

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((segment) => (
          <div
            key={segment}
            className={cn(
              "h-2 flex-1 rounded-full bg-muted",
              score > segment
                ? score >= 4
                  ? "bg-emerald-500"
                  : score === 3
                    ? "bg-amber-500"
                    : "bg-rose-500"
                : "bg-muted",
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-muted-foreground">Password strength</span>
        <span className="font-medium text-foreground">{label}</span>
      </div>
    </div>
  );
}

export function OtpPinInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <InputOTP maxLength={6} value={value} onChange={onChange}>
      <InputOTPGroup className="w-full justify-between gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <InputOTPSlot
            key={index}
            index={index}
            className="h-14 w-12 rounded-2xl border border-border/70 bg-background/80 text-lg font-semibold shadow-sm first:rounded-2xl first:border-r last:rounded-2xl"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
