import { motion } from "framer-motion";
import { Bot, User2 } from "lucide-react";

import { type NexaMessage } from "@/lib/nexaHr";
import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  message: NexaMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-4",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#22c55e,#0ea5e9)] text-white shadow-[0_18px_40px_rgba(34,197,94,0.18)]">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={cn(
          "max-w-3xl rounded-[28px] px-5 py-4 text-sm leading-7 shadow-[0_18px_40px_rgba(15,23,42,0.08)]",
          isUser
            ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
            : "border border-zinc-200/70 bg-white/90 text-zinc-800 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-100",
        )}
      >
        {message.content}
      </div>

      {isUser && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/80 text-zinc-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-200">
          <User2 className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  );
}
