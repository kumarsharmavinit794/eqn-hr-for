import { useEffect, useMemo, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Lock, Sparkles } from "lucide-react";

import { useNexaHrApp } from "@/context/NexaHrAppContext";
import { nexaStarterPrompts } from "@/lib/nexaHr";
import { cn } from "@/lib/utils";

import { MessageBubble } from "./MessageBubble";

export function ChatWindow() {
  const {
    canSendMessages,
    chatInputDisabled,
    isAssistantTyping,
    maxFreeLimit,
    messageCount,
    messages,
    openUpgradeModal,
    plan,
    remainingFreeMessages,
    sendMessage,
  } = useNexaHrApp();
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isAssistantTyping, messages]);

  useEffect(() => {
    if (chatInputDisabled) {
      openUpgradeModal();
    }
  }, [chatInputDisabled, openUpgradeModal]);

  const placeholder = useMemo(
    () =>
      chatInputDisabled
        ? "Free trial ended. Upgrade to continue chatting with Nexa HR."
        : "Ask Nexa HR anything...",
    [chatInputDisabled],
  );

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    await sendMessage(trimmed);
    setInput("");
  };

  return (
    <section className="flex min-h-[78dvh] flex-1 flex-col overflow-hidden rounded-[36px] border border-zinc-200/70 bg-white/88 shadow-[0_30px_90px_rgba(15,23,42,0.1)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#090d18]/88">
      <div className="border-b border-zinc-200/70 px-6 py-5 dark:border-white/10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              Nexa HR Assistant
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              AI workspace for people ops
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Get hiring guidance, employee operations help, and HR analytics summaries in one chat-first interface.
            </p>
          </div>

          <div className="rounded-full border border-zinc-200/80 bg-zinc-50/80 px-4 py-2 text-xs text-zinc-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-300">
            {plan === "free"
              ? `${remainingFreeMessages} messages left today`
              : `Unlimited ${plan.toUpperCase()} access`}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {messages.length <= 1 ? (
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
              Start with a prompt
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              What do you need help with today?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
              Ask about onboarding, hiring, policy responses, retention, or analytics and Nexa HR will guide the next step.
            </p>
            <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
              {nexaStarterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="rounded-[24px] border border-zinc-200/80 bg-white/90 p-4 text-left text-sm text-zinc-700 transition-colors hover:border-emerald-400/40 hover:bg-emerald-500/5 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.07]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-5">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </AnimatePresence>

            {isAssistantTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#22c55e,#0ea5e9)] text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="rounded-[28px] border border-zinc-200/70 bg-white/90 px-5 py-4 text-sm text-zinc-600 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-300">
                  Nexa HR is thinking
                  <span className="ml-2 inline-flex gap-1">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                        transition={{
                          duration: 1.1,
                          ease: "easeInOut",
                          repeat: Number.POSITIVE_INFINITY,
                          delay: dot * 0.16,
                        }}
                        className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                      />
                    ))}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="border-t border-zinc-200/70 px-4 py-4 sm:px-6 dark:border-white/10">
        <div
          className={cn(
            "mx-auto max-w-4xl rounded-[30px] border border-zinc-200/80 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-all dark:border-white/10 dark:bg-white/[0.04]",
            chatInputDisabled && "border-amber-400/30 bg-amber-500/5",
          )}
        >
          {chatInputDisabled && (
            <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Free Trial Ended. Upgrade to keep chatting with Nexa HR.
              </div>
              <button
                type="button"
                onClick={openUpgradeModal}
                className="rounded-full bg-zinc-950 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-zinc-950"
              >
                Upgrade Now
              </button>
            </div>
          )}

          <div className={cn("transition-all", chatInputDisabled && "blur-[2px] opacity-60")}>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void handleSubmit();
                }
              }}
              placeholder={placeholder}
              rows={3}
              disabled={chatInputDisabled}
              className="min-h-[104px] w-full resize-none border-0 bg-transparent px-2 py-2 text-sm leading-7 text-zinc-900 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed dark:text-white dark:placeholder:text-zinc-500"
            />

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {plan === "free"
                  ? `${messageCount}/${maxFreeLimit} free messages used today`
                  : "Unlimited access enabled"}
              </div>
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={!input.trim() || !canSendMessages}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-950"
              >
                Send
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
