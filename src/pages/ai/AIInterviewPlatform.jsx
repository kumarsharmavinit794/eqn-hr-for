import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Gauge,
  Heart,
  Layers,
  MessageSquare,
  RefreshCcw,
  Shield,
  Sparkles,
  Target,
  Users,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const EXPERIENCE_OPTIONS = [
  { value: "fresher", label: "Fresher", hint: "0-1 years" },
  { value: "junior", label: "Junior", hint: "1-3 years" },
  { value: "senior", label: "Senior", hint: "3-7 years" },
  { value: "lead", label: "Lead", hint: "7+ years" },
];

const QUESTION_COUNT_OPTIONS = [5, 8, 10];

const TOPIC_OPTIONS = [
  { id: "dsa", label: "DSA", accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { id: "system_design", label: "System Design", accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { id: "oop", label: "OOP", accent: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  { id: "databases", label: "Databases", accent: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
  { id: "react", label: "React", accent: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  { id: "nodejs", label: "Node.js", accent: "bg-lime-500/10 text-lime-600 dark:text-lime-400" },
  { id: "devops", label: "DevOps", accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { id: "behavioral", label: "Behavioral", accent: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
];

const TOPIC_LABELS = Object.fromEntries(TOPIC_OPTIONS.map((topic) => [topic.id, topic.label]));

const TOPIC_TEMPLATES = {
  dsa: {
    easy: [
      {
        id: "dsa-easy-1",
        prompt: "When would you choose a hash map over a nested loop approach for a lookup-heavy problem?",
        keywords: ["hash map", "lookup", "time complexity", "O(1)", "trade off"],
        focus: "data structure choice and time complexity",
      },
      {
        id: "dsa-easy-2",
        prompt: "How would you detect duplicate values in a large array efficiently?",
        keywords: ["set", "hash", "O(n)", "memory", "iterate"],
        focus: "duplicate detection and complexity awareness",
      },
    ],
    medium: [
      {
        id: "dsa-medium-1",
        prompt: "Explain how you would solve a sliding window problem and what signals tell you that pattern fits.",
        keywords: ["window", "left", "right", "pointer", "O(n)", "expand", "shrink"],
        focus: "pattern recognition and pointer movement",
      },
      {
        id: "dsa-medium-2",
        prompt: "How would you compare merge sort and quick sort in a production backend service?",
        keywords: ["merge sort", "quick sort", "worst case", "memory", "partition", "stable"],
        focus: "sorting tradeoffs in real systems",
      },
    ],
    hard: [
      {
        id: "dsa-hard-1",
        prompt: "Design an approach for top-k frequent elements when the input size is too large to sort fully.",
        keywords: ["heap", "bucket", "frequency map", "top k", "O(n log k)"],
        focus: "scalable frequency analysis",
      },
      {
        id: "dsa-hard-2",
        prompt: "How would you handle cycle detection in a graph and when would you prefer DFS over union-find?",
        keywords: ["graph", "dfs", "union find", "visited", "cycle", "component"],
        focus: "graph traversal and cycle detection strategy",
      },
    ],
  },
  system_design: {
    easy: [
      {
        id: "sd-easy-1",
        prompt: "What core pieces would you list first when asked to design a URL shortener?",
        keywords: ["api", "database", "cache", "read", "write", "availability"],
        focus: "system decomposition",
      },
      {
        id: "sd-easy-2",
        prompt: "How would you think about scale when a notification service suddenly grows 10x?",
        keywords: ["queue", "throughput", "scaling", "worker", "retry", "latency"],
        focus: "scale signals and operational planning",
      },
    ],
    medium: [
      {
        id: "sd-medium-1",
        prompt: "Design a document collaboration service and explain how you would manage concurrent edits.",
        keywords: ["collaboration", "conflict", "sync", "version", "ot", "crdt"],
        focus: "real-time synchronization strategy",
      },
      {
        id: "sd-medium-2",
        prompt: "How would you design a metrics dashboard that must stay fast under heavy read traffic?",
        keywords: ["aggregation", "cache", "precompute", "read heavy", "latency", "dashboard"],
        focus: "read optimization and aggregation",
      },
    ],
    hard: [
      {
        id: "sd-hard-1",
        prompt: "Design a multi-region interview platform with video sessions, recordings, and report generation.",
        keywords: ["multi-region", "latency", "storage", "failover", "stream", "queue"],
        focus: "multi-region reliability",
      },
      {
        id: "sd-hard-2",
        prompt: "How would you design a high-volume event pipeline that feeds analytics and alerting in near real time?",
        keywords: ["stream", "partition", "consumer", "backpressure", "schema", "idempotent"],
        focus: "event-driven analytics architecture",
      },
    ],
  },
  oop: {
    easy: [
      {
        id: "oop-easy-1",
        prompt: "How do encapsulation and abstraction help when multiple engineers work on the same codebase?",
        keywords: ["encapsulation", "abstraction", "interface", "maintainability", "change"],
        focus: "fundamental object-oriented concepts",
      },
      {
        id: "oop-easy-2",
        prompt: "When would you prefer composition over inheritance?",
        keywords: ["composition", "inheritance", "flexibility", "reuse", "coupling"],
        focus: "design tradeoffs",
      },
    ],
    medium: [
      {
        id: "oop-medium-1",
        prompt: "Explain how you would model an interview workflow using domain objects and responsibilities.",
        keywords: ["object", "responsibility", "state", "workflow", "class", "interface"],
        focus: "object modeling",
      },
      {
        id: "oop-medium-2",
        prompt: "How do SOLID principles show up in frontend or backend modules you ship regularly?",
        keywords: ["solid", "single responsibility", "open closed", "dependency", "interface"],
        focus: "practical SOLID usage",
      },
    ],
    hard: [
      {
        id: "oop-hard-1",
        prompt: "Describe a refactor where polymorphism removed complex conditionals from a growing product feature.",
        keywords: ["polymorphism", "strategy", "refactor", "conditional", "extensible"],
        focus: "refactoring for extensibility",
      },
      {
        id: "oop-hard-2",
        prompt: "How would you design a plugin architecture so interview evaluators can be swapped safely?",
        keywords: ["plugin", "interface", "contract", "dependency injection", "extensible"],
        focus: "extensibility and boundaries",
      },
    ],
  },
  databases: {
    easy: [
      {
        id: "db-easy-1",
        prompt: "How do indexes improve query performance and what do they cost you?",
        keywords: ["index", "query", "read", "write", "storage", "scan"],
        focus: "read-write tradeoffs",
      },
      {
        id: "db-easy-2",
        prompt: "When would you use normalization and when would you intentionally denormalize?",
        keywords: ["normalize", "denormalize", "join", "consistency", "performance"],
        focus: "schema tradeoffs",
      },
    ],
    medium: [
      {
        id: "db-medium-1",
        prompt: "How would you store interview transcripts so search stays fast and access remains secure?",
        keywords: ["partition", "search", "retention", "encryption", "access control", "metadata"],
        focus: "storage and security design",
      },
      {
        id: "db-medium-2",
        prompt: "Explain how transactions and isolation levels matter in a payroll or HR workflow.",
        keywords: ["transaction", "isolation", "consistency", "commit", "rollback", "race condition"],
        focus: "consistency under concurrency",
      },
    ],
    hard: [
      {
        id: "db-hard-1",
        prompt: "What would guide your choice between relational storage and document storage for candidate evaluation data?",
        keywords: ["relational", "document", "schema", "query pattern", "consistency", "flexibility"],
        focus: "storage engine selection",
      },
      {
        id: "db-hard-2",
        prompt: "How would you migrate a critical interview dataset without breaking reporting consumers?",
        keywords: ["migration", "backfill", "dual write", "compatibility", "rollback", "consumer"],
        focus: "safe data migration planning",
      },
    ],
  },
  react: {
    easy: [
      {
        id: "react-easy-1",
        prompt: "How do props, state, and effects differ in a React component that handles interview answers?",
        keywords: ["props", "state", "effect", "render", "component", "lifecycle"],
        focus: "core React mental model",
      },
      {
        id: "react-easy-2",
        prompt: "What makes a React form feel responsive even when validation is involved?",
        keywords: ["form", "validation", "controlled", "feedback", "latency", "input"],
        focus: "responsive forms",
      },
    ],
    medium: [
      {
        id: "react-medium-1",
        prompt: "How would you structure a complex dashboard so state stays predictable and components stay reusable?",
        keywords: ["state", "component", "reusable", "context", "hook", "separation"],
        focus: "component architecture",
      },
      {
        id: "react-medium-2",
        prompt: "How do you debug unnecessary re-renders in a feature-rich React page?",
        keywords: ["render", "profiling", "memo", "state update", "debug", "component"],
        focus: "performance debugging",
      },
    ],
    hard: [
      {
        id: "react-hard-1",
        prompt: "Explain how you would build a real-time interview transcript UI without making the page feel jittery.",
        keywords: ["streaming", "batch", "render", "transition", "state", "latency"],
        focus: "real-time UI performance",
      },
      {
        id: "react-hard-2",
        prompt: "How would you approach server state, optimistic updates, and error recovery in an AI interview product?",
        keywords: ["server state", "optimistic", "retry", "error", "cache", "query"],
        focus: "client-server state strategy",
      },
    ],
  },
  nodejs: {
    easy: [
      {
        id: "node-easy-1",
        prompt: "Why is non-blocking I/O useful in Node.js, and when can it still become a bottleneck?",
        keywords: ["non-blocking", "event loop", "I/O", "cpu", "async"],
        focus: "event loop basics",
      },
      {
        id: "node-easy-2",
        prompt: "How would you structure a small Express or Fastify API for an interview scheduling service?",
        keywords: ["route", "middleware", "validation", "service", "controller"],
        focus: "API structure",
      },
    ],
    medium: [
      {
        id: "node-medium-1",
        prompt: "How do you protect a Node.js service from slow downstream dependencies?",
        keywords: ["timeout", "retry", "circuit breaker", "queue", "fallback"],
        focus: "resilience patterns",
      },
      {
        id: "node-medium-2",
        prompt: "What would you log and monitor for a backend that generates AI interview reports?",
        keywords: ["log", "monitor", "latency", "error", "trace", "alert"],
        focus: "observability",
      },
    ],
    hard: [
      {
        id: "node-hard-1",
        prompt: "How would you scale a Node.js service that handles simultaneous video interview callbacks and scoring jobs?",
        keywords: ["queue", "worker", "horizontal", "backpressure", "webhook", "scaling"],
        focus: "backend scaling and job orchestration",
      },
      {
        id: "node-hard-2",
        prompt: "Describe how you would secure secrets, roles, and audit logs in a Node.js HR platform.",
        keywords: ["secret", "rbac", "audit", "token", "rotation", "access"],
        focus: "security and governance",
      },
    ],
  },
  devops: {
    easy: [
      {
        id: "devops-easy-1",
        prompt: "What does a healthy CI pipeline look like for a fast-moving frontend team?",
        keywords: ["ci", "build", "test", "lint", "deploy", "pipeline"],
        focus: "delivery hygiene",
      },
      {
        id: "devops-easy-2",
        prompt: "How would you explain containers and why teams use them in cloud deployments?",
        keywords: ["container", "image", "environment", "deploy", "consistency"],
        focus: "container fundamentals",
      },
    ],
    medium: [
      {
        id: "devops-medium-1",
        prompt: "How would you set up deployment safeguards for an interview platform used by recruiters all day?",
        keywords: ["rollback", "health check", "canary", "monitor", "deploy"],
        focus: "safe deployment strategy",
      },
      {
        id: "devops-medium-2",
        prompt: "What signals would make you autoscale a service, and what risks would you watch for?",
        keywords: ["autoscale", "cpu", "queue", "latency", "cost", "limit"],
        focus: "scaling signals and risk",
      },
    ],
    hard: [
      {
        id: "devops-hard-1",
        prompt: "Design a secure production pipeline for an AI feature that processes sensitive employee data.",
        keywords: ["security", "secrets", "least privilege", "audit", "encryption", "compliance"],
        focus: "security-first delivery",
      },
      {
        id: "devops-hard-2",
        prompt: "How would you improve reliability when report generation depends on multiple external AI services?",
        keywords: ["redundancy", "fallback", "timeout", "retry", "queue", "sla"],
        focus: "reliability across dependencies",
      },
    ],
  },
  behavioral: {
    easy: [
      {
        id: "beh-easy-1",
        prompt: "Tell me about a time you handled conflicting priorities with limited time.",
        keywords: ["priority", "stakeholder", "plan", "communication", "result"],
        focus: "prioritization and clarity",
      },
      {
        id: "beh-easy-2",
        prompt: "How do you usually ask for help when you are blocked?",
        keywords: ["help", "communicate", "context", "ownership", "follow up"],
        focus: "self-awareness and collaboration",
      },
    ],
    medium: [
      {
        id: "beh-medium-1",
        prompt: "Describe a disagreement with a teammate and how you kept the relationship productive.",
        keywords: ["conflict", "listen", "data", "respect", "resolution"],
        focus: "conflict management",
      },
      {
        id: "beh-medium-2",
        prompt: "Tell me about a project where you created clarity in a messy situation.",
        keywords: ["clarity", "ownership", "alignment", "plan", "impact"],
        focus: "leadership through ambiguity",
      },
    ],
    hard: [
      {
        id: "beh-hard-1",
        prompt: "Describe a high-stakes decision you made with incomplete information and how you managed the downside.",
        keywords: ["decision", "risk", "trade off", "communicate", "mitigate"],
        focus: "judgment under uncertainty",
      },
      {
        id: "beh-hard-2",
        prompt: "Tell me about a time you raised the bar for your team, not just for yourself.",
        keywords: ["leadership", "team", "coach", "improve", "standard", "impact"],
        focus: "team-level impact",
      },
    ],
  },
};

const roleplaceholders = [
  "Senior Frontend Engineer",
  "Backend Developer",
  "HR Analytics Specialist",
  "Platform Engineer",
];

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function averageScore(entries) {
  if (!entries.length) return 0;
  return Math.round((entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length) * 10) / 10;
}

function getInitialDifficulty(experience) {
  if (experience === "fresher") return "easy";
  if (experience === "junior") return "medium";
  if (experience === "lead") return "hard";
  return "medium";
}

function getAdaptiveDifficulty(experience, scores) {
  if (!scores.length) return getInitialDifficulty(experience);

  const recentAverage = scores.slice(-2).reduce((sum, entry) => sum + entry.score, 0) / Math.min(scores.length, 2);

  if (recentAverage >= 8.5) {
    return experience === "fresher" ? "medium" : "hard";
  }

  if (recentAverage >= 6) {
    return "medium";
  }

  return "easy";
}

function buildLanguageHint(language) {
  if (language === "hinglish") return "You can answer in Hinglish.";
  if (language === "hindi") return "Aap Hindi me bhi answer de sakte ho.";
  return "Answer in your preferred professional style.";
}

function pickNextQuestion(config, scores, usedQuestionIds) {
  const selectedTopics = config.topics.length > 0 ? config.topics : [TOPIC_OPTIONS[0].id];
  const topicIndex = scores.length % selectedTopics.length;
  const primaryTopic = selectedTopics[topicIndex];
  const adaptiveDifficulty = getAdaptiveDifficulty(config.experience, scores);
  const difficultyOrder = adaptiveDifficulty === "easy"
    ? ["easy", "medium", "hard"]
    : adaptiveDifficulty === "medium"
      ? ["medium", "hard", "easy"]
      : ["hard", "medium", "easy"];

  const candidateTopics = [primaryTopic, ...selectedTopics.filter((topic) => topic !== primaryTopic)];

  for (const topic of candidateTopics) {
    for (const difficulty of difficultyOrder) {
      const question = (TOPIC_TEMPLATES[topic]?.[difficulty] || []).find((item) => !usedQuestionIds.includes(item.id));
      if (question) {
        return {
          ...question,
          topic,
          topicLabel: TOPIC_LABELS[topic],
          difficulty,
          reasoning: `Selected to evaluate ${question.focus} with a ${difficulty} prompt for ${TOPIC_LABELS[topic]}.`,
        };
      }
    }
  }

  const fallbackTopic = candidateTopics[0];
  const fallbackDifficulty = difficultyOrder[0];
  const fallbackQuestion = TOPIC_TEMPLATES[fallbackTopic][fallbackDifficulty][scores.length % TOPIC_TEMPLATES[fallbackTopic][fallbackDifficulty].length];

  return {
    ...fallbackQuestion,
    topic: fallbackTopic,
    topicLabel: TOPIC_LABELS[fallbackTopic],
    difficulty: fallbackDifficulty,
    reasoning: `Reusing a prompt because the selected topic bank was exhausted for this session.`,
  };
}

function evaluateAnswer(answer, currentQuestion) {
  const normalized = answer.toLowerCase();
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const keywordMatches = currentQuestion.keywords.filter((keyword) => normalized.includes(keyword.toLowerCase()));
  const claritySignals = ["because", "for example", "for instance", "trade off", "edge case", "first", "then", "finally", "monitor"];
  const clarityHits = claritySignals.filter((signal) => normalized.includes(signal)).length;
  const technicalAccuracy = clamp(2 + keywordMatches.length * 2 + (wordCount >= 55 ? 1 : 0), 0, 10);
  const communicationClarity = clamp(3 + Math.min(4, Math.floor(wordCount / 22)) + Math.min(3, clarityHits), 0, 10);
  const depth = clamp(2 + keywordMatches.length * 2 + (normalized.includes("complexity") ? 1 : 0) + (normalized.includes("risk") ? 1 : 0), 0, 10);
  const score = Math.round((technicalAccuracy + communicationClarity + depth) / 3);
  const performanceSignal = score >= 8 ? "strong" : score >= 5 ? "average" : "weak";

  let feedback = "The answer was recorded.";
  if (performanceSignal === "strong") {
    feedback = "Strong answer. You showed structure, relevant technical signals, and good depth.";
  } else if (performanceSignal === "average") {
    feedback = "Decent answer. Add sharper examples, clearer tradeoffs, and one concrete edge case to strengthen it.";
  } else {
    feedback = "This answer needs more depth. Focus on the approach, tradeoffs, and at least one concrete implementation detail.";
  }

  return {
    score,
    technicalAccuracy,
    communicationClarity,
    depth,
    feedback,
    keywordsMatched: keywordMatches,
    performanceSignal,
  };
}

function buildReport(scores, config) {
  const overall = Math.round(averageScore(scores) * 10);
  const grade =
    overall >= 90 ? "A" :
    overall >= 80 ? "B" :
    overall >= 70 ? "C" :
    overall >= 60 ? "D" :
    "F";

  const recommendation =
    overall >= 85 ? "Strong Hire" :
    overall >= 75 ? "Hire" :
    overall >= 60 ? "Maybe" :
    "No Hire";

  const topicBreakdown = Object.fromEntries(
    config.topics.map((topic) => {
      const topicScores = scores.filter((entry) => entry.topic === topic);
      const topicAverage = topicScores.length
        ? Math.round((topicScores.reduce((sum, entry) => sum + entry.score, 0) / topicScores.length) * 10) / 10
        : 0;
      return [TOPIC_LABELS[topic], topicAverage];
    }),
  );

  const sortedTopics = Object.entries(topicBreakdown).sort((a, b) => b[1] - a[1]);
  const strengths = sortedTopics.slice(0, 3).map(([topic, value]) => `${topic} showed the strongest signals at ${value}/10.`);
  const improvements = sortedTopics.slice(-2).map(([topic, value]) => `${topic} needs clearer examples and stronger technical precision (${value}/10).`);

  return {
    overall,
    grade,
    recommendation,
    strengths,
    improvements,
    topicBreakdown,
    summary: `${config.role || "Candidate"} finished a ${scores.length}-question adaptive interview with an overall score of ${overall}/100. Performance was strongest in ${sortedTopics[0]?.[0] || "the selected topics"}, while the biggest improvement opportunity is sharper depth and example quality in lower-scoring areas.`,
    notes: `The interview adapted difficulty based on live scoring. Recommendation is ${recommendation} with ${scores.filter((entry) => entry.performanceSignal === "strong").length} strong answers, ${scores.filter((entry) => entry.performanceSignal === "average").length} average answers, and ${scores.filter((entry) => entry.performanceSignal === "weak").length} weak answers.`,
  };
}

function getTopicAccent(topicId) {
  return TOPIC_OPTIONS.find((topic) => topic.id === topicId)?.accent || "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400";
}

function getSignalTone(signal) {
  if (signal === "strong") return "text-emerald-600 dark:text-emerald-400";
  if (signal === "average") return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

function getDifficultyTone(difficulty) {
  if (difficulty === "hard") return "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400";
  if (difficulty === "medium") return "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
  return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
}

function createEmptySession() {
  return {
    phase: "setup",
    messages: [],
    currentQuestion: null,
    questionNumber: 0,
    scores: [],
    finalReport: null,
    usedQuestionIds: [],
    answer: "",
    loading: false,
    loadingMessage: "",
  };
}

export default function AIInterviewPlatform() {
  const [config, setConfig] = useState({
    role: "",
    experience: "fresher",
    topics: ["dsa", "react", "behavioral"],
    language: "english",
    totalQuestions: 8,
  });
  const [session, setSession] = useState(createEmptySession());

  const average = useMemo(() => averageScore(session.scores), [session.scores]);
  const answeredCount = session.scores.length;
  const progressValue = config.totalQuestions ? Math.round((answeredCount / config.totalQuestions) * 100) : 0;
  const latestFeedback = session.messages.filter((message) => message.role === "feedback").at(-1);

  const startInterview = async () => {
    if (!config.role.trim() || config.topics.length === 0) return;

    const nextQuestion = pickNextQuestion(config, [], []);

    setSession((current) => ({
      ...current,
      phase: "interview",
      loading: true,
      loadingMessage: "Coordinator is preparing the opening question.",
    }));

    await wait(450);

    setSession({
      phase: "interview",
      currentQuestion: nextQuestion,
      questionNumber: 1,
      scores: [],
      finalReport: null,
      usedQuestionIds: [nextQuestion.id],
      answer: "",
      loading: false,
      loadingMessage: "",
      messages: [
        {
          role: "assistant",
          content: nextQuestion.prompt,
          meta: {
            qNum: 1,
            topic: nextQuestion.topic,
            topicLabel: nextQuestion.topicLabel,
            difficulty: nextQuestion.difficulty,
            reasoning: nextQuestion.reasoning,
          },
        },
      ],
    });
  };

  const moveToNextQuestion = async (updatedScores, updatedMessages, updatedUsedIds) => {
    if (updatedScores.length >= config.totalQuestions) {
      setSession((current) => ({
        ...current,
        loading: true,
        loadingMessage: "Report agent is compiling the final summary.",
      }));

      await wait(500);

      const report = buildReport(updatedScores, config);
      setSession((current) => ({
        ...current,
        phase: "report",
        loading: false,
        loadingMessage: "",
        finalReport: report,
        scores: updatedScores,
        messages: updatedMessages,
        usedQuestionIds: updatedUsedIds,
      }));
      return;
    }

    setSession((current) => ({
      ...current,
      loading: true,
      loadingMessage: "Coordinator is selecting the next question.",
      scores: updatedScores,
      messages: updatedMessages,
      usedQuestionIds: updatedUsedIds,
      answer: "",
    }));

    await wait(350);

    const nextQuestion = pickNextQuestion(config, updatedScores, updatedUsedIds);
    const nextQuestionNumber = updatedScores.length + 1;

    setSession((current) => ({
      ...current,
      currentQuestion: nextQuestion,
      questionNumber: nextQuestionNumber,
      loading: false,
      loadingMessage: "",
      usedQuestionIds: [...updatedUsedIds, nextQuestion.id],
      messages: [
        ...updatedMessages,
        {
          role: "assistant",
          content: nextQuestion.prompt,
          meta: {
            qNum: nextQuestionNumber,
            topic: nextQuestion.topic,
            topicLabel: nextQuestion.topicLabel,
            difficulty: nextQuestion.difficulty,
            reasoning: nextQuestion.reasoning,
          },
        },
      ],
    }));
  };

  const submitAnswer = async () => {
    if (!session.answer.trim() || session.loading || !session.currentQuestion) return;

    const answer = session.answer.trim();
    const evaluation = evaluateAnswer(answer, session.currentQuestion);
    const updatedScores = [
      ...session.scores,
      {
        ...evaluation,
        answer,
        question: session.currentQuestion.prompt,
        topic: session.currentQuestion.topic,
        topicLabel: session.currentQuestion.topicLabel,
        difficulty: session.currentQuestion.difficulty,
        questionNumber: session.questionNumber,
      },
    ];
    const updatedMessages = [
      ...session.messages,
      { role: "user", content: answer, meta: { qNum: session.questionNumber } },
      {
        role: "feedback",
        content: evaluation.feedback,
        meta: {
          qNum: session.questionNumber,
          score: evaluation.score,
          signal: evaluation.performanceSignal,
          keywords: evaluation.keywordsMatched,
        },
      },
    ];

    setSession((current) => ({
      ...current,
      loading: true,
      loadingMessage: "Evaluator is reviewing your answer.",
      scores: updatedScores,
      messages: updatedMessages,
      answer: "",
    }));

    await wait(400);
    await moveToNextQuestion(updatedScores, updatedMessages, session.usedQuestionIds);
  };

  const skipQuestion = async () => {
    if (session.loading || !session.currentQuestion) return;

    const updatedScores = [
      ...session.scores,
      {
        score: 0,
        technicalAccuracy: 0,
        communicationClarity: 0,
        depth: 0,
        feedback: "Question skipped. The platform moved ahead to keep the interview flowing.",
        keywordsMatched: [],
        performanceSignal: "weak",
        answer: "",
        question: session.currentQuestion.prompt,
        topic: session.currentQuestion.topic,
        topicLabel: session.currentQuestion.topicLabel,
        difficulty: session.currentQuestion.difficulty,
        questionNumber: session.questionNumber,
      },
    ];
    const updatedMessages = [
      ...session.messages,
      {
        role: "feedback",
        content: "Question skipped. The next prompt has been selected.",
        meta: {
          qNum: session.questionNumber,
          score: 0,
          signal: "weak",
          keywords: [],
        },
      },
    ];

    setSession((current) => ({
      ...current,
      loading: true,
      loadingMessage: "Coordinator is rebalancing the interview after a skip.",
      scores: updatedScores,
      messages: updatedMessages,
      answer: "",
    }));

    await wait(300);
    await moveToNextQuestion(updatedScores, updatedMessages, session.usedQuestionIds);
  };

  const restartInterview = () => {
    setSession(createEmptySession());
    setConfig((current) => ({ ...current, role: "" }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[calc(100vh-7rem)] space-y-6"
    >
      {session.phase === "setup" && (
        <SetupScreen
          config={config}
          setConfig={setConfig}
          onStart={startInterview}
        />
      )}

      {session.phase === "interview" && (
        <InterviewScreen
          config={config}
          session={session}
          average={average}
          progressValue={progressValue}
          latestFeedback={latestFeedback}
          setAnswer={(value) => setSession((current) => ({ ...current, answer: value }))}
          onSubmit={submitAnswer}
          onSkip={skipQuestion}
        />
      )}

      {session.phase === "report" && (
        <ReportScreen
          config={config}
          report={session.finalReport}
          scores={session.scores}
          onRestart={restartInterview}
        />
      )}
    </motion.div>
  );
}

function SetupScreen({ config, setConfig, onStart }) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_48%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_42%)]" />
        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <Badge className="w-fit border border-white/10 bg-white/10 text-white hover:bg-white/10">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              AI Interview Platform
            </Badge>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Run adaptive mock interviews with live evaluation and a final hiring report.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                This version is wired as a polished in-app interview studio. It keeps the coordinator, evaluator, and report flow from your source file, but the UI is fully rebuilt to match the dashboard and it works without an external API key.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-300">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Adaptive difficulty</div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Topic-aware scoring</div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Instant summary report</div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {[
              { icon: Brain, label: "Coordinator", value: "Dynamic next question selection" },
              { icon: Gauge, label: "Evaluator", value: "0-10 scoring with keyword signals" },
              { icon: BarChart3, label: "Report Agent", value: "Topic breakdown and recommendation" },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <item.icon className="h-5 w-5 text-sky-300" />
                <p className="mt-4 text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-2 text-xs leading-6 text-slate-300">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="overflow-hidden rounded-[28px] border-zinc-200/70 shadow-xl dark:border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Interview Setup</CardTitle>
            <CardDescription>
              Configure the role, experience level, language, and the topics you want this interview to cover.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role">Target Role</Label>
              <Input
                id="role"
                value={config.role}
                placeholder={roleplaceholders[config.topics.length % roleplaceholders.length]}
                onChange={(event) => setConfig((current) => ({ ...current, role: event.target.value }))}
              />
            </div>

            <div className="space-y-3">
              <Label>Experience Level</Label>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {EXPERIENCE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setConfig((current) => ({ ...current, experience: option.value }))}
                    className={`rounded-2xl border p-4 text-left transition-colors ${
                      config.experience === option.value
                        ? "border-emerald-500/40 bg-emerald-500/10"
                        : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950/30 dark:hover:bg-zinc-900/60"
                    }`}
                  >
                    <p className="text-sm font-semibold">{option.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{option.hint}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Topics to Cover</Label>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {TOPIC_OPTIONS.map((topic) => {
                  const active = config.topics.includes(topic.id);
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() =>
                        setConfig((current) => ({
                          ...current,
                          topics: active
                            ? current.topics.filter((entry) => entry !== topic.id)
                            : [...current.topics, topic.id],
                        }))
                      }
                      className={`rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                        active
                          ? "border-sky-500/40 bg-sky-500/10"
                          : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950/30 dark:hover:bg-zinc-900/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">{topic.label}</span>
                        {active && <CheckCircle2 className="h-4 w-4 text-sky-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={config.language}
                  onValueChange={(value) => setConfig((current) => ({ ...current, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hinglish">Hinglish</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Question Count</Label>
                <Select
                  value={String(config.totalQuestions)}
                  onValueChange={(value) => setConfig((current) => ({ ...current, totalQuestions: Number(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose count" />
                  </SelectTrigger>
                  <SelectContent>
                    {QUESTION_COUNT_OPTIONS.map((count) => (
                      <SelectItem key={count} value={String(count)}>
                        {count} questions
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-3xl border border-dashed border-zinc-200/80 bg-zinc-50/80 p-4 text-sm text-muted-foreground dark:border-white/10 dark:bg-zinc-900/40">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <p>
                  The current implementation runs locally with a deterministic evaluation engine so the page is usable immediately. If you want, we can wire Claude or OpenAI later using a backend endpoint.
                </p>
              </div>
            </div>

            <Button
              size="lg"
              onClick={onStart}
              disabled={!config.role.trim() || config.topics.length === 0}
              className="w-full rounded-2xl"
            >
              Launch Interview Studio
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[28px] border-zinc-200/70 shadow-xl dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-xl">What Gets Added</CardTitle>
              <CardDescription>
                The feature includes a setup flow, live interview phase, scoring feedback, and a final report screen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { icon: Video, title: "Interview studio", text: "One question at a time with topic and difficulty badges." },
                { icon: MessageSquare, title: "Live feedback", text: "Answer evaluation appears after each submission." },
                { icon: Award, title: "Final recommendation", text: "A hiring-style summary with topic breakdowns." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-zinc-900/40">
                  <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-zinc-200/70 shadow-xl dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-xl">Topic Coverage</CardTitle>
              <CardDescription>
                Selected topics rotate during the session so the interview feels balanced.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {TOPIC_OPTIONS.map((topic) => (
                <Badge
                  key={topic.id}
                  variant="outline"
                  className={`rounded-full border px-3 py-1.5 ${config.topics.includes(topic.id) ? topic.accent : "text-muted-foreground"}`}
                >
                  {topic.label}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InterviewScreen({
  config,
  session,
  average,
  progressValue,
  latestFeedback,
  setAnswer,
  onSubmit,
  onSkip,
}) {
  const currentQuestion = session.currentQuestion;
  const remainingQuestions = Math.max(config.totalQuestions - session.scores.length, 0);
  const hint = buildLanguageHint(config.language);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[28px] border border-zinc-200/70 bg-white/95 shadow-xl dark:border-white/10 dark:bg-zinc-950/70"
      >
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
                <Brain className="mr-2 h-3.5 w-3.5" />
                Interview in progress
              </Badge>
              <Badge variant="outline" className="rounded-full">
                {config.role}
              </Badge>
              <Badge variant="outline" className="rounded-full">
                {config.language}
              </Badge>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Nexa Interview Studio
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                The coordinator is adapting questions based on your last answers. The evaluator scores structure, accuracy, and depth after every response.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Interview progress</span>
                <span>{session.scores.length}/{config.totalQuestions} answered</span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:w-[360px]">
            {[
              { label: "Current", value: `Q${session.questionNumber}`, icon: Briefcase },
              { label: "Average", value: `${average || 0}/10`, icon: Gauge },
              { label: "Remaining", value: `${remainingQuestions}`, icon: Clock3 },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-zinc-200/80 bg-zinc-50/80 p-4 dark:border-white/10 dark:bg-white/5">
                <item.icon className="h-4 w-4 text-primary" />
                <p className="mt-4 text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card className="rounded-[28px] border-zinc-200/70 shadow-xl dark:border-white/10">
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={`rounded-full ${getTopicAccent(currentQuestion?.topic)}`}>
                    {currentQuestion?.topicLabel}
                  </Badge>
                  <Badge variant="outline" className={`rounded-full ${getDifficultyTone(currentQuestion?.difficulty)}`}>
                    {currentQuestion?.difficulty}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {hint}
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl">Question {session.questionNumber}</CardTitle>
                <CardDescription className="mt-2 leading-6">
                  {currentQuestion?.reasoning}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/80 p-5 text-sm leading-7 dark:border-white/10 dark:bg-zinc-900/40">
                {currentQuestion?.prompt}
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer-box">Your Answer</Label>
                <Textarea
                  id="answer-box"
                  value={session.answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="Type your answer here. Mention tradeoffs, examples, edge cases, or implementation detail to improve your score."
                  rows={8}
                  disabled={session.loading}
                  onKeyDown={(event) => {
                    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                      event.preventDefault();
                      onSubmit();
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Use Ctrl+Enter to submit quickly.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="outline" className="rounded-2xl" onClick={onSkip} disabled={session.loading}>
                  Skip Question
                </Button>
                <Button className="rounded-2xl" onClick={onSubmit} disabled={session.loading || !session.answer.trim()}>
                  Submit Answer
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-zinc-200/70 shadow-xl dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-xl">Interview Timeline</CardTitle>
              <CardDescription>
                The transcript below shows each coordinator prompt, your submitted answer, and the evaluator feedback.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1">
                {session.messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[92%] rounded-3xl px-4 py-3 text-sm leading-7 ${
                        message.role === "assistant"
                          ? "border border-blue-500/20 bg-blue-500/10"
                          : message.role === "feedback"
                            ? "border border-emerald-500/20 bg-emerald-500/10"
                            : "border border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-white/10"
                      }`}
                    >
                      <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        <span>
                          {message.role === "assistant" ? "Coordinator" : message.role === "feedback" ? "Evaluator" : "Candidate"}
                        </span>
                        {message.meta?.qNum && <span>Q{message.meta.qNum}</span>}
                        {message.meta?.topicLabel && <span>{message.meta.topicLabel}</span>}
                      </div>
                      <p>{message.content}</p>
                      {message.role === "feedback" && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className={`rounded-full ${getSignalTone(message.meta?.signal)}`}>
                            Score {message.meta?.score}/10
                          </Badge>
                          {(message.meta?.keywords || []).slice(0, 4).map((keyword) => (
                            <Badge key={keyword} variant="outline" className="rounded-full text-[11px]">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <AnimatePresence>
                  {session.loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex justify-start"
                    >
                      <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/80 px-4 py-3 text-sm dark:border-white/10 dark:bg-zinc-900/40">
                        <div className="mb-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          System
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                            <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:120ms]" />
                            <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:240ms]" />
                          </div>
                          <span>{session.loadingMessage}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[28px] border-zinc-200/70 shadow-xl dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-xl">Live Evaluator</CardTitle>
              <CardDescription>
                Instant scoring uses answer structure, depth, and topic keyword alignment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/80 p-4 dark:border-white/10 dark:bg-zinc-900/40">
                  <p className="text-xs text-muted-foreground">Average score</p>
                  <p className="mt-2 text-3xl font-semibold">{average || 0}<span className="text-base text-muted-foreground">/10</span></p>
                </div>
                <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/80 p-4 dark:border-white/10 dark:bg-zinc-900/40">
                  <p className="text-xs text-muted-foreground">Last signal</p>
                  <p className={`mt-2 text-lg font-semibold ${getSignalTone(latestFeedback?.meta?.signal)}`}>
                    {latestFeedback?.meta?.signal || "Awaiting answer"}
                  </p>
                </div>
              </div>

              {latestFeedback ? (
                <div className="rounded-3xl border border-dashed border-zinc-200/80 bg-zinc-50/80 p-4 text-sm leading-7 dark:border-white/10 dark:bg-zinc-900/40">
                  <p className="font-medium">Latest evaluator note</p>
                  <p className="mt-2 text-muted-foreground">{latestFeedback.content}</p>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-zinc-200/80 bg-zinc-50/80 p-4 text-sm text-muted-foreground dark:border-white/10 dark:bg-zinc-900/40">
                  Submit your first answer to see real-time feedback.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-zinc-200/70 shadow-xl dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-xl">Coverage Snapshot</CardTitle>
              <CardDescription>
                Selected topics are tracked here as the interview moves forward.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.topics.map((topic) => {
                const topicScores = session.scores.filter((entry) => entry.topic === topic);
                const topicAverage = topicScores.length
                  ? Math.round((topicScores.reduce((sum, entry) => sum + entry.score, 0) / topicScores.length) * 10)
                  : 0;

                return (
                  <div key={topic} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{TOPIC_LABELS[topic]}</span>
                      <span className="text-muted-foreground">{topicScores.length} asked</span>
                    </div>
                    <Progress value={topicAverage} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-zinc-200/70 shadow-xl dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-xl">Session Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>Questions adapt in difficulty based on the last two scores.</p>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>Clear examples, tradeoffs, and edge cases improve evaluation quality.</p>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>Skipping a question keeps the session moving but lowers the final report.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ReportScreen({ config, report, scores, onRestart }) {
  const sortedTopics = Object.entries(report.topicBreakdown).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-2xl"
      >
        <div className="grid gap-8 xl:grid-cols-[1fr_auto] xl:items-center">
          <div className="space-y-4">
            <Badge className="w-fit border border-white/10 bg-white/10 text-white hover:bg-white/10">
              <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
              Interview complete
            </Badge>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {report.recommendation}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                {report.summary}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Role - {config.role}
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Grade - {report.grade}
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Questions - {scores.length}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {[
              { label: "Overall", value: `${report.overall}/100`, icon: Award },
              { label: "Best topic", value: sortedTopics[0]?.[0] || "-", icon: Layers },
              { label: "Recommendation", value: report.recommendation, icon: Sparkles },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <item.icon className="h-5 w-5 text-sky-300" />
                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="rounded-[28px] border-zinc-200/70 shadow-xl dark:border-white/10">
          <CardHeader>
            <CardTitle className="text-xl">Summary Notes</CardTitle>
            <CardDescription>
              These notes are generated from the question-by-question scoring model.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold">Strengths</p>
              {report.strengths.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold">Improvements</p>
              {report.improvements.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm">
                  <Target className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-dashed border-zinc-200/80 bg-zinc-50/80 p-4 text-sm leading-7 text-muted-foreground dark:border-white/10 dark:bg-zinc-900/40">
              <p className="font-medium text-foreground">Interviewer Notes</p>
              <p className="mt-2">{report.notes}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[28px] border-zinc-200/70 shadow-xl dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-xl">Topic Breakdown</CardTitle>
              <CardDescription>
                Average topic scores were derived from the answers in this session.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(report.topicBreakdown).map(([topic, score]) => (
                <div key={topic} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{topic}</span>
                    <span className="text-muted-foreground">{score}/10</span>
                  </div>
                  <Progress value={score * 10} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-zinc-200/70 shadow-xl dark:border-white/10">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-xl">Question Breakdown</CardTitle>
                <CardDescription>
                  Each submitted answer is listed with topic, difficulty, and score.
                </CardDescription>
              </div>
              <Button variant="outline" className="rounded-2xl" onClick={onRestart}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Start another session
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {scores.map((entry) => (
                <div key={`${entry.questionNumber}-${entry.question}`} className="rounded-3xl border border-zinc-200/80 bg-zinc-50/80 p-4 dark:border-white/10 dark:bg-zinc-900/40">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="rounded-full">Q{entry.questionNumber}</Badge>
                        <Badge variant="outline" className={`rounded-full ${getTopicAccent(entry.topic)}`}>
                          {entry.topicLabel}
                        </Badge>
                        <Badge variant="outline" className={`rounded-full ${getDifficultyTone(entry.difficulty)}`}>
                          {entry.difficulty}
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm leading-7">{entry.question}</p>
                      <p className="mt-3 text-xs text-muted-foreground">{entry.feedback}</p>
                    </div>
                    <div className={`shrink-0 text-right text-lg font-semibold ${getSignalTone(entry.performanceSignal)}`}>
                      {entry.score}/10
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
