import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  NEXA_MAX_FREE_LIMIT,
  buildAssistantGreeting,
  buildFakeHrResponse,
  buildSessionPreviewFromPrompt,
  buildSessionTitleFromPrompt,
  createInitialChatSession,
  type NexaChatSession,
  type NexaMessage,
  type NexaPlanId,
} from "@/lib/nexaHr";

type PersistedState = {
  activeSessionId: string;
  currentDay: string;
  messageCount: number;
  plan: NexaPlanId;
  sessions: NexaChatSession[];
};

type NexaHrAppContextValue = {
  activeSessionId: string;
  activeSession: NexaChatSession | null;
  canSendMessages: boolean;
  chatInputDisabled: boolean;
  closeUpgradeModal: () => void;
  isUpgradeModalOpen: boolean;
  isAssistantTyping: boolean;
  maxFreeLimit: number;
  messageCount: number;
  messages: NexaMessage[];
  plan: NexaPlanId;
  queuedPrompt: string;
  remainingFreeMessages: number;
  selectChat: (sessionId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  sessions: NexaChatSession[];
  startNewChat: () => void;
  upgradePlan: (planId: NexaPlanId) => void;
  queuePrompt: (prompt: string) => void;
  clearQueuedPrompt: () => void;
  openUpgradeModal: () => void;
};

const STORAGE_KEY = "nexa-hr-public-app";
const THINKING_DELAY_MS = 1100;

const NexaHrAppContext = createContext<NexaHrAppContextValue | null>(null);

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const isStoredMessage = (value: unknown): value is NexaMessage =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as NexaMessage).id === "string" &&
  ((value as NexaMessage).role === "user" ||
    (value as NexaMessage).role === "assistant") &&
  typeof (value as NexaMessage).content === "string" &&
  typeof (value as NexaMessage).createdAt === "number";

const isStoredSession = (value: unknown): value is NexaChatSession =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as NexaChatSession).id === "string" &&
  typeof (value as NexaChatSession).title === "string" &&
  typeof (value as NexaChatSession).preview === "string" &&
  typeof (value as NexaChatSession).createdAt === "number" &&
  typeof (value as NexaChatSession).updatedAt === "number" &&
  Array.isArray((value as NexaChatSession).messages) &&
  (value as NexaChatSession).messages.every(isStoredMessage);

const buildStoredState = (): PersistedState => {
  const initialSession = createInitialChatSession();

  return {
    activeSessionId: initialSession.id,
    currentDay: getTodayKey(),
    messageCount: 0,
    plan: "free",
    sessions: [initialSession],
  };
};

const loadPersistedState = (): PersistedState => {
  const fallback = buildStoredState();

  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    const safeSessions = Array.isArray(parsed.sessions)
      ? parsed.sessions.filter(isStoredSession)
      : fallback.sessions;
    const safeCurrentDay =
      typeof parsed.currentDay === "string" && parsed.currentDay.trim().length > 0
        ? parsed.currentDay
        : getTodayKey();
    const safeMessageCount =
      safeCurrentDay === getTodayKey() && typeof parsed.messageCount === "number"
        ? Math.max(0, parsed.messageCount)
        : 0;
    const safePlan: NexaPlanId =
      parsed.plan === "pro" || parsed.plan === "enterprise" ? parsed.plan : "free";
    const safeActiveSessionId =
      typeof parsed.activeSessionId === "string" &&
      safeSessions.some((session) => session.id === parsed.activeSessionId)
        ? parsed.activeSessionId
        : safeSessions[0]?.id ?? fallback.activeSessionId;

    return {
      activeSessionId: safeActiveSessionId,
      currentDay: getTodayKey(),
      messageCount: safeMessageCount,
      plan: safePlan,
      sessions: safeSessions.length > 0 ? safeSessions : fallback.sessions,
    };
  } catch {
    return fallback;
  }
};

export function NexaHrAppProvider({ children }: { children: ReactNode }) {
  const persistedState = useMemo(loadPersistedState, []);

  const [plan, setPlan] = useState<NexaPlanId>(persistedState.plan);
  const [messageCount, setMessageCount] = useState(persistedState.messageCount);
  const [sessions, setSessions] = useState<NexaChatSession[]>(persistedState.sessions);
  const [activeSessionId, setActiveSessionId] = useState(persistedState.activeSessionId);
  const [queuedPrompt, setQueuedPrompt] = useState("");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const payload: PersistedState = {
      activeSessionId,
      currentDay: getTodayKey(),
      messageCount,
      plan,
      sessions,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [activeSessionId, messageCount, plan, sessions]);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) ?? null,
    [activeSessionId, sessions],
  );

  const messages = useMemo(
    () => activeSession?.messages ?? [],
    [activeSession],
  );

  const chatInputDisabled =
    plan === "free" && messageCount >= NEXA_MAX_FREE_LIMIT;
  const canSendMessages = !chatInputDisabled && !isAssistantTyping;
  const remainingFreeMessages = Math.max(0, NEXA_MAX_FREE_LIMIT - messageCount);

  const ensureSession = useCallback((existingSessionId?: string) => {
    const sessionId = existingSessionId ?? activeSessionId;
    const hasSession = sessions.some((session) => session.id === sessionId);

    if (hasSession) {
      return sessionId;
    }

    const freshSession = createInitialChatSession();
    setSessions((prev) => [freshSession, ...prev]);
    setActiveSessionId(freshSession.id);
    return freshSession.id;
  }, [activeSessionId, sessions]);

  const startNewChat = useCallback(() => {
    const timestamp = Date.now();
    const greeting = buildAssistantGreeting();
    const newSession: NexaChatSession = {
      id: `session-${timestamp}`,
      title: "New chat",
      preview: "Start a new conversation with Nexa HR",
      createdAt: timestamp,
      updatedAt: timestamp,
      messages: [{ ...greeting, id: `assistant-${timestamp}` }],
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  }, []);

  const selectChat = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
  }, []);

  const openUpgradeModal = useCallback(() => {
    setIsUpgradeModalOpen(true);
  }, []);

  const closeUpgradeModal = useCallback(() => {
    setIsUpgradeModalOpen(false);
  }, []);

  const queuePrompt = useCallback((prompt: string) => {
    setQueuedPrompt(prompt.trim());
  }, []);

  const clearQueuedPrompt = useCallback(() => {
    setQueuedPrompt("");
  }, []);

  const upgradePlan = useCallback((planId: NexaPlanId) => {
    setPlan(planId);
    setIsUpgradeModalOpen(false);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isAssistantTyping) {
        return;
      }

      if (plan === "free" && messageCount >= NEXA_MAX_FREE_LIMIT) {
        setIsUpgradeModalOpen(true);
        return;
      }

      const sessionId = ensureSession();
      const now = Date.now();
      const userMessage: NexaMessage = {
        id: `user-${now}`,
        role: "user",
        content: trimmed,
        createdAt: now,
      };

      setSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                messages: [...session.messages, userMessage],
                preview: buildSessionPreviewFromPrompt(trimmed),
                title:
                  session.title === "New chat" ||
                  session.title === "Welcome to Nexa HR"
                    ? buildSessionTitleFromPrompt(trimmed)
                    : session.title,
                updatedAt: now,
              }
            : session,
        ),
      );

      setActiveSessionId(sessionId);
      setIsAssistantTyping(true);
      setMessageCount((prev) => prev + 1);

      await new Promise<void>((resolve) => {
        window.setTimeout(() => {
          const assistantMessage: NexaMessage = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: buildFakeHrResponse(trimmed),
            createdAt: Date.now(),
          };

          setSessions((prev) =>
            prev.map((session) =>
              session.id === sessionId
                ? {
                    ...session,
                    messages: [...session.messages, assistantMessage],
                    preview: assistantMessage.content,
                    updatedAt: assistantMessage.createdAt,
                  }
                : session,
            ),
          );
          setIsAssistantTyping(false);
          resolve();
        }, THINKING_DELAY_MS);
      });
    },
    [ensureSession, isAssistantTyping, messageCount, plan],
  );

  const value = useMemo<NexaHrAppContextValue>(
    () => ({
      activeSession,
      activeSessionId,
      canSendMessages,
      chatInputDisabled,
      clearQueuedPrompt,
      closeUpgradeModal,
      isAssistantTyping,
      isUpgradeModalOpen,
      maxFreeLimit: NEXA_MAX_FREE_LIMIT,
      messageCount,
      messages,
      openUpgradeModal,
      plan,
      queuePrompt,
      queuedPrompt,
      remainingFreeMessages,
      selectChat,
      sendMessage,
      sessions,
      startNewChat,
      upgradePlan,
    }),
    [
      activeSession,
      activeSessionId,
      canSendMessages,
      chatInputDisabled,
      clearQueuedPrompt,
      closeUpgradeModal,
      isAssistantTyping,
      isUpgradeModalOpen,
      messageCount,
      messages,
      openUpgradeModal,
      plan,
      queuePrompt,
      queuedPrompt,
      remainingFreeMessages,
      selectChat,
      sendMessage,
      sessions,
      startNewChat,
      upgradePlan,
    ],
  );

  return (
    <NexaHrAppContext.Provider value={value}>
      {children}
    </NexaHrAppContext.Provider>
  );
}

export const useNexaHrApp = () => {
  const context = useContext(NexaHrAppContext);

  if (!context) {
    throw new Error("useNexaHrApp must be used within NexaHrAppProvider");
  }

  return context;
};
