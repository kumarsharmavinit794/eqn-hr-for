import { MessageSquarePlus, Sparkles } from "lucide-react";

import { useNexaHrApp } from "@/context/NexaHrAppContext";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const {
    activeSessionId,
    maxFreeLimit,
    messageCount,
    openUpgradeModal,
    plan,
    remainingFreeMessages,
    selectChat,
    sessions,
    startNewChat,
  } = useNexaHrApp();

  return (
    <aside className="w-full rounded-[32px] border border-zinc-200/70 bg-white/82 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.04] md:w-[320px]">
      <button
        type="button"
        onClick={startNewChat}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-zinc-950"
      >
        <MessageSquarePlus className="h-4 w-4" />
        New Chat
      </button>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
          Recent Chats
        </p>
        <div className="mt-3 space-y-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => selectChat(session.id)}
              className={cn(
                "w-full rounded-2xl border px-4 py-3 text-left transition-colors",
                activeSessionId === session.id
                  ? "border-emerald-400/40 bg-emerald-500/10"
                  : "border-zinc-200/70 bg-zinc-50/70 hover:bg-zinc-100 dark:border-white/8 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]",
              )}
            >
              <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                {session.title}
              </p>
              <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
                {session.preview}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-[28px] border border-zinc-200/70 bg-[linear-gradient(180deg,rgba(16,185,129,0.14),rgba(255,255,255,0.86))] p-5 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(16,185,129,0.14),rgba(255,255,255,0.04))]">
        <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
          <Sparkles className="h-4 w-4 text-emerald-500" />
          <p className="text-sm font-semibold">
            {plan === "free" ? "Free Trial" : `${plan.toUpperCase()} Plan`}
          </p>
        </div>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
          {plan === "free"
            ? `${remainingFreeMessages} of ${maxFreeLimit} daily messages remaining.`
            : "Unlimited access enabled with faster, premium workflows."}
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-200/80 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#22c55e,#0ea5e9)]"
            style={{
              width:
                plan === "free"
                  ? `${Math.min(100, (messageCount / maxFreeLimit) * 100)}%`
                  : "100%",
            }}
          />
        </div>
        {plan === "free" ? (
          <button
            type="button"
            onClick={openUpgradeModal}
            className="mt-4 w-full rounded-2xl border border-zinc-300/80 bg-white/90 px-4 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-white dark:border-white/12 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            Upgrade for Unlimited Access
          </button>
        ) : null}
      </div>
    </aside>
  );
}
