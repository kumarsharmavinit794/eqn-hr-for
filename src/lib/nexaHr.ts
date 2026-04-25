export type NexaPlanId = "free" | "pro" | "enterprise";

export type NexaFeatureCard = {
  title: string;
  description: string;
  accent: string;
};

export type NexaPricingPlan = {
  id: NexaPlanId;
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
  badge?: string;
};

export type NexaMessageRole = "user" | "assistant";

export type NexaMessage = {
  id: string;
  role: NexaMessageRole;
  content: string;
  createdAt: number;
};

export type NexaChatSession = {
  id: string;
  title: string;
  preview: string;
  createdAt: number;
  updatedAt: number;
  messages: NexaMessage[];
};

export const NEXA_MAX_FREE_LIMIT = 20;

export const nexaFeatureCards: NexaFeatureCard[] = [
  {
    title: "AI Recruiting Copilot",
    description:
      "Draft job descriptions, screen candidates, and prepare interview plans from one prompt-first workspace.",
    accent: "from-emerald-400/30 via-emerald-300/10 to-transparent",
  },
  {
    title: "People Analytics",
    description:
      "Summarize attendance, engagement, and attrition signals with fast answers built for HR leaders.",
    accent: "from-sky-400/30 via-sky-300/10 to-transparent",
  },
  {
    title: "Employee Operations",
    description:
      "Handle onboarding, policies, payroll questions, and daily HR support through a clean assistant UI.",
    accent: "from-amber-400/30 via-orange-300/10 to-transparent",
  },
  {
    title: "Executive Ready",
    description:
      "Upgrade from free trial to Pro when your team needs unlimited usage, faster responses, and advanced tools.",
    accent: "from-fuchsia-400/30 via-violet-300/10 to-transparent",
  },
];

export const nexaPricingPlans: NexaPricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    cadence: "/month",
    tagline: "Limited Access",
    description:
      "Perfect for exploring Nexa HR and trying the assistant with a daily usage cap.",
    features: [
      "20 messages per day",
      "Core HR assistant prompts",
      "Landing page + chat workspace",
      "Basic pricing preview",
    ],
    cta: "Start Free Trial",
    badge: "Starter",
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹499",
    cadence: "/month",
    tagline: "Unlimited Access",
    description:
      "Best for active HR teams who want a premium assistant experience with no daily message cap.",
    features: [
      "Unlimited messages",
      "Faster responses",
      "Advanced HR workflows",
      "Priority feature access",
    ],
    cta: "Upgrade to Pro",
    featured: true,
    badge: "Most Popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    tagline: "Custom Plan",
    description:
      "For companies that need procurement support, tailored onboarding, and custom security reviews.",
    features: [
      "Custom deployment guidance",
      "Dedicated onboarding",
      "Advanced admin controls",
      "Contact sales support",
    ],
    cta: "Contact Sales",
    badge: "Scale",
  },
];

export const nexaStarterPrompts = [
  "Create a hiring plan for 15 engineering roles next quarter.",
  "Summarize employee attrition risks from this month's signals.",
  "Draft an onboarding checklist for new HR managers.",
  "Help me answer a payroll policy question for employees.",
];

export const buildAssistantGreeting = (): NexaMessage => ({
  id: "assistant-greeting",
  role: "assistant",
  content:
    "Hi, I’m Nexa HR. Ask about hiring, onboarding, employee policies, engagement, or workforce analytics and I’ll help you think it through.",
  createdAt: Date.now(),
});

export const createInitialChatSession = (): NexaChatSession => {
  const greeting = buildAssistantGreeting();
  return {
    id: "session-welcome",
    title: "Welcome to Nexa HR",
    preview: greeting.content,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [greeting],
  };
};

const trimPrompt = (value: string, max = 44) =>
  value.length > max ? `${value.slice(0, max - 1)}…` : value;

export const buildSessionTitleFromPrompt = (prompt: string) =>
  trimPrompt(prompt.trim() || "New chat", 32);

export const buildSessionPreviewFromPrompt = (prompt: string) =>
  trimPrompt(prompt.trim() || "Start a new chat", 64);

export const buildFakeHrResponse = (prompt: string): string => {
  const normalized = prompt.toLowerCase();

  if (normalized.includes("hiring") || normalized.includes("candidate")) {
    return "For hiring, I’d prioritize role intake clarity, a tighter shortlist rubric, and weekly funnel reviews. If you want, I can turn this into a role-by-role hiring plan with interview stages and expected timelines.";
  }

  if (
    normalized.includes("attrition") ||
    normalized.includes("retention") ||
    normalized.includes("burnout")
  ) {
    return "The strongest retention levers here are manager check-ins, workload balancing, and recognition. I’d start with a high-risk employee segment review, then pair that with a 30-day action plan for managers.";
  }

  if (
    normalized.includes("analytics") ||
    normalized.includes("report") ||
    normalized.includes("dashboard")
  ) {
    return "A strong HR analytics summary should combine headcount movement, hiring velocity, attendance trends, and engagement signals. I can help you turn this into a concise executive update or a deeper operational readout.";
  }

  if (
    normalized.includes("payroll") ||
    normalized.includes("policy") ||
    normalized.includes("leave")
  ) {
    return "For policy and employee operations questions, I’d answer with a simple explanation, eligibility criteria, and next steps for the employee. If you share the exact scenario, I can draft a ready-to-send response.";
  }

  if (
    normalized.includes("onboarding") ||
    normalized.includes("employee") ||
    normalized.includes("manager")
  ) {
    return "A smooth onboarding flow should cover documentation, systems access, manager expectations, and early feedback loops. I can help you map this into a day 1, week 1, and first 30 days checklist.";
  }

  return "I’d approach this by clarifying the HR objective, the audience, and the action you need next. Share a bit more context and I can turn it into a sharper recommendation, summary, or draft response.";
};
