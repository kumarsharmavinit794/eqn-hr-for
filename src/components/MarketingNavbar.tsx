import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Login", href: "/login" },
];

export function MarketingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/70 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-emerald-400 to-accent text-primary-foreground shadow-[0_14px_40px_rgba(13,148,136,0.28)]">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-primary/80">NEXAHR</p>
            <p className="text-xs text-muted-foreground">AI Recruitment Suite</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Button key={link.href} asChild variant="ghost" className="rounded-full px-4">
              <Link to={link.href}>{link.label}</Link>
            </Button>
          ))}
          <Button asChild className="ml-2 rounded-full px-5 shadow-lg shadow-primary/20">
            <Link to="/login">Get Started</Link>
          </Button>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="border-t border-white/10 bg-card/95 px-4 py-4 md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {navLinks.map((link) => (
                <Button key={link.href} asChild variant="ghost" className="justify-start rounded-2xl">
                  <Link to={link.href} onClick={() => setOpen(false)}>
                    {link.label}
                  </Link>
                </Button>
              ))}
              <Button asChild className="mt-2 rounded-2xl">
                <Link to="/login" onClick={() => setOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
