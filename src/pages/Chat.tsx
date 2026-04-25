import { useEffect } from "react";

import { Navbar } from "@/components/Navbar";
import { ChatWindow } from "@/components/ChatWindow";
import { Sidebar } from "@/components/Sidebar";
import { useNexaHrApp } from "@/context/NexaHrAppContext";

export default function Chat() {
  const { clearQueuedPrompt, queuedPrompt, sendMessage } = useNexaHrApp();

  useEffect(() => {
    if (!queuedPrompt) {
      return;
    }

    const prompt = queuedPrompt;
    clearQueuedPrompt();
    void sendMessage(prompt);
  }, [clearQueuedPrompt, queuedPrompt, sendMessage]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.1),transparent_24%),linear-gradient(180deg,#f8fafc,#eef2ff)] dark:bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.1),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.16),transparent_24%),linear-gradient(180deg,#050816,#090d18)]">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
        <Sidebar />
        <ChatWindow />
      </main>
    </div>
  );
}
