import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, MoonStar, Sparkles, SunMedium, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Link, useLocation } from "react-router-dom";

import { useNexaHrApp } from "@/context/NexaHrAppContext";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar() {
  const location = useLocation();
  const { plan, remainingFreeMessages } = useNexaHrApp();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const isDark = resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/75 backdrop-blur-2xl dark:border-white/10 dark:bg-[#050816]/75">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4F46E5,#9333EA)] text-white shadow-[0_20px_50px_rgba(79,70,229,0.25)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-950 dark:text-white">
              Nexa HR
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              AI-Powered HR Assistant
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white",
                )}
                to={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="rounded-full border border-zinc-200/80 bg-zinc-50/80 px-4 py-2 text-xs text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
            {plan === "free"
              ? `${remainingFreeMessages} free messages left today`
              : `${plan.toUpperCase()} active`}
          </div>
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200/80 bg-white/70 text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </button>
          <Link
            className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
            to="/login"
          >
            Login
          </Link>
          <Link
            className="rounded-full bg-[linear-gradient(135deg,#4F46E5,#9333EA)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(79,70,229,0.2)] transition-transform hover:-translate-y-0.5"
            to="/signup"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200/80 bg-white/70 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 lg:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-zinc-200/70 px-4 py-4 dark:border-white/10 lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
                  to={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
              >
                Theme
                {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              </button>
              <Link
                className="rounded-2xl px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
                to="/login"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                className="rounded-2xl bg-[linear-gradient(135deg,#4F46E5,#9333EA)] px-4 py-3 text-sm font-semibold text-white"
                to="/signup"
                onClick={() => setOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
