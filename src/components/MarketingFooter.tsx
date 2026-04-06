import { Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Login", href: "/login" },
];

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/10 bg-background/70">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold tracking-[0.22em] text-primary/80">NEXAHR</p>
          <p className="max-w-md text-sm text-muted-foreground">
            AI-first recruitment infrastructure for modern hiring teams that want speed, control, and premium candidate experience.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {footerLinks.map((link) => (
            <Link key={link.href} to={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {socials.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card/50 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
            >
              <item.icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
