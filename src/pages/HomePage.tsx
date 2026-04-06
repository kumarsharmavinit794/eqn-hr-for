import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  LockKeyhole,
  ScanSearch,
  Sparkles,
  UserCog,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import { MarketingFooter } from "@/components/MarketingFooter";
import { MarketingNavbar } from "@/components/MarketingNavbar";
import { Button } from "@/components/ui/button";

const features = [
  { icon: ScanSearch, title: "AI Resume Screening", text: "Parse and rank resumes automatically with structured candidate intelligence." },
  { icon: UsersRound, title: "Candidate Matching", text: "Surface high-fit applicants instantly using AI scoring and role alignment." },
  { icon: UserCog, title: "Role-Based Dashboard", text: "Tailored experiences for admins, HR operators, and employees." },
  { icon: Sparkles, title: "Job Management", text: "Create, publish, and track job pipelines from one clean command center." },
  { icon: LockKeyhole, title: "Secure Authentication", text: "JWT auth, refresh tokens, and protected role-aware workflows." },
  { icon: BarChart3, title: "Analytics", text: "Track hiring velocity, funnel health, and operational performance in real time." },
];

const testimonials = [
  { quote: "We cut first-pass screening time by 72% without sacrificing hiring quality.", name: "Riya Sharma", role: "Head of Talent, LunarStack" },
  { quote: "The OpenAI-style simplicity helped our HR team adopt the system in a single day.", name: "Marcus Lee", role: "People Ops Lead, NorthGrid" },
  { quote: "Candidates feel the experience is faster, cleaner, and far more professional.", name: "Nina Thomas", role: "Recruiting Manager, VantaWorks" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.15),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.12),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.04),_transparent_35%)]">
      <MarketingNavbar />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-[420px] max-w-6xl rounded-full bg-primary/10 blur-3xl" />
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:px-8 lg:pb-24 lg:pt-24">
            <div className="space-y-8">
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/60 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-primary shadow-lg shadow-primary/5 backdrop-blur-xl">
                <BrainCircuit className="h-4 w-4" />
                Built for modern hiring teams
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="space-y-5">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  AI-Powered Recruitment System
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                  Hire smarter, faster, and better with AI. Build structured pipelines, automate screening, and give your team a premium recruitment workspace.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full px-7 shadow-xl shadow-primary/20">
                  <Link to="/login">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full border-white/20 bg-card/60 px-7 backdrop-blur-xl">
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid gap-4 sm:grid-cols-3">
                {[
                  { value: "10x", label: "faster shortlisting" },
                  { value: "98%", label: "pipeline visibility" },
                  { value: "24/7", label: "AI-assisted screening" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-border/60 bg-card/60 p-5 backdrop-blur-xl">
                    <p className="text-3xl font-semibold">{item.value}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="relative">
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-2xl" />
              <div className="relative rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))] p-4 shadow-[0_32px_90px_rgba(15,23,42,0.16)] backdrop-blur-2xl sm:p-6">
                <div className="flex items-center justify-between rounded-[24px] border border-white/10 bg-background/70 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Hiring Command Center</p>
                    <p className="text-xs text-muted-foreground">Real-time AI recruitment pipeline</p>
                  </div>
                  <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Live</div>
                </div>

                <div className="mt-6 grid gap-4">
                  <div className="rounded-[26px] border border-white/10 bg-card/80 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Top Candidate Match</p>
                        <p className="mt-2 text-xl font-semibold">Priya Malhotra</p>
                      </div>
                      <div className="rounded-2xl bg-primary/10 px-4 py-3 text-right">
                        <p className="text-xs text-primary">AI score</p>
                        <p className="text-2xl font-semibold text-primary">96%</p>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {["React", "FastAPI", "Team Lead"].map((tag) => (
                        <div key={tag} className="rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-muted-foreground">
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[24px] border border-white/10 bg-card/80 p-5">
                      <p className="text-sm text-muted-foreground">This week</p>
                      <p className="mt-3 text-3xl font-semibold">148</p>
                      <p className="mt-2 text-sm text-muted-foreground">candidates screened automatically</p>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-card/80 p-5">
                      <p className="text-sm text-muted-foreground">Open roles</p>
                      <p className="mt-3 text-3xl font-semibold">12</p>
                      <p className="mt-2 text-sm text-muted-foreground">managed across admin and HR dashboards</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Features</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Premium workflows for every hiring stage</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-[28px] border border-border/70 bg-card/70 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl"
              >
                <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">How it works</p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">A simpler path from resume to best-fit shortlist</h2>
              <p className="text-base leading-8 text-muted-foreground">
                Remove manual review bottlenecks and give your hiring team instant signal across every incoming profile.
              </p>
            </div>
            <div className="grid gap-4">
              {[
                ["01", "Upload Resume", "Add candidate resumes securely through a clean drag-and-drop experience."],
                ["02", "AI analyzes candidates", "The platform extracts skills, experience, and role relevance automatically."],
                ["03", "Get best matches instantly", "Shortlist and route top candidates into interviews with confidence."],
              ].map(([step, title, text]) => (
                <motion.div key={step} whileHover={{ x: 6 }} className="flex gap-4 rounded-[26px] border border-border/70 bg-card/70 p-5 backdrop-blur-xl">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-mono text-sm font-semibold text-primary">
                    {step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.88),rgba(17,24,39,0.68))] p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.26)] sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.2em] text-white/60">Dashboard Preview</p>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">A command center that feels as smart as your hiring team</h2>
                <p className="text-sm leading-7 text-white/70 sm:text-base">
                  OpenAI-inspired clarity, role-based views, and premium operational detail across every candidate, job, and activity stream.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                    <div className="rounded-[22px] bg-white/6 p-5">
                      <p className="text-sm text-white/60">Pipeline Overview</p>
                      <div className="mt-4 h-40 rounded-[18px] bg-[linear-gradient(180deg,rgba(16,185,129,0.24),rgba(99,102,241,0.10))] p-4">
                        <div className="flex h-full items-end gap-3">
                          {[58, 94, 74, 120, 90, 142].map((height, index) => (
                            <motion.div
                              key={index}
                              initial={{ height: 0 }}
                              whileInView={{ height }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.06, duration: 0.45 }}
                              className="w-full rounded-full bg-gradient-to-t from-primary to-emerald-300/80"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-[22px] bg-white/6 p-5">
                        <p className="text-sm text-white/60">Shortlisted</p>
                        <p className="mt-3 text-4xl font-semibold">42</p>
                      </div>
                      <div className="rounded-[22px] bg-white/6 p-5">
                        <p className="text-sm text-white/60">Time to fill</p>
                        <p className="mt-3 text-4xl font-semibold">11d</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[22px] bg-white/6 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-white/60">Activity Stream</p>
                        <p className="mt-1 text-lg font-medium">Hiring updates in real time</p>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">Synced across Admin + HR</span>
                    </div>
                    <div className="mt-4 grid gap-3">
                      {["Resume uploaded for Product Designer", "AI matched 9 candidates to Senior Frontend Engineer", "Interview moved to Final Review"].map((item) => (
                        <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Testimonials</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Loved by fast-moving teams</h2>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.06 }}
                className="rounded-[28px] border border-border/70 bg-card/75 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl"
              >
                <p className="text-base leading-8 text-foreground/90">“{testimonial.quote}”</p>
                <div className="mt-6">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pb-28">
          <div className="rounded-[34px] border border-primary/20 bg-gradient-to-br from-primary/12 via-card/90 to-accent/10 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:p-10 lg:p-14">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Start hiring smarter today</h2>
                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  Launch a premium AI recruitment workflow with secure infrastructure, role-aware experiences, and clean operations from day one.
                </p>
              </div>
              <Button asChild size="lg" className="rounded-full px-7 shadow-xl shadow-primary/20">
                <Link to="/login">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
