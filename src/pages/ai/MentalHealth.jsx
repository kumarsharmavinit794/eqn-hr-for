import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smile,
  Frown,
  Brain,
  Coffee,
  Moon,
  Angry,
  Heart,
  RefreshCw,
  Play,
  BookOpen,
  Activity,
  Calendar,
} from "lucide-react";

export default function MentalHealth() {
  // State
  const [mood, setMood] = useState("");
  const [thought, setThought] = useState("");
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [showBreathing, setShowBreathing] = useState(false);
  const [affirmation, setAffirmation] = useState("");
  const [tip, setTip] = useState("");

  // Mood options
  const moods = [
    { value: "happy", label: "Happy", emoji: "😊", icon: Smile, color: "text-green-500" },
    { value: "sad", label: "Sad", emoji: "😔", icon: Frown, color: "text-blue-400" },
    { value: "stressed", label: "Stressed", emoji: "😰", icon: Brain, color: "text-orange-500" },
    { value: "tired", label: "Tired", emoji: "😴", icon: Moon, color: "text-purple-500" },
    { value: "angry", label: "Angry", emoji: "😡", icon: Angry, color: "text-red-500" },
  ];

  // Predefined responses
  const getResponse = (moodValue) => {
    switch (moodValue) {
      case "happy":
        return {
          message: "That's wonderful! Your positivity is contagious. 🌟",
          action: "Share your joy with someone – a kind word or a smile can brighten their day.",
          emoji: "🌈",
        };
      case "sad":
        return {
          message: "It's okay to feel sad sometimes. You're not alone. 💙",
          action: "Try journaling your thoughts or talk to a trusted friend. A short walk might help.",
          emoji: "🌧️",
        };
      case "stressed":
        return {
          message: "Take a deep breath. You've got this. 🌿",
          action: "Step away for 5 minutes – stretch, hydrate, or try the breathing exercise below.",
          emoji: "🧘",
        };
      case "tired":
        return {
          message: "Your body and mind need rest. Listen to them. 🛌",
          action: "Take a power nap (15-20 min) or enjoy a warm, non-caffeinated drink.",
          emoji: "😴",
        };
      case "angry":
        return {
          message: "Anger is a signal. Give yourself space to cool down. 🔥➡️💧",
          action: "Step away from the situation, squeeze a stress ball, or write down what's bothering you.",
          emoji: "🌊",
        };
      default:
        return {
          message: "How are you feeling today? Choose a mood to get personalized support.",
          action: "Select a mood above to see helpful suggestions.",
          emoji: "💭",
        };
    }
  };

  // Affirmations
  const affirmations = [
    "I am capable of handling whatever comes my way.",
    "I give myself permission to rest and recharge.",
    "My feelings are valid, and I honor them.",
    "I choose peace over perfection.",
    "I am enough, just as I am.",
    "Today, I will be kind to myself.",
  ];

  // Relaxing tips
  const tips = [
    "Take 5 deep breaths, focusing on your inhale and exhale.",
    "Listen to calming music or nature sounds for 5 minutes.",
    "Massage your temples gently.",
    "Drink a cup of herbal tea slowly.",
    "Close your eyes and visualize a peaceful place.",
    "Stretch your neck and shoulders.",
  ];

  // Load history and random daily affirmation from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem("moodHistory");
    if (storedHistory) setHistory(JSON.parse(storedHistory));
    setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
    setTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("moodHistory", JSON.stringify(history));
  }, [history]);

  const handleMoodSelect = (moodValue) => {
    setMood(moodValue);
    const resp = getResponse(moodValue);
    setResponse(resp);
  };

  const handleSaveEntry = () => {
    if (!mood) return;
    const newEntry = {
      id: Date.now(),
      mood,
      thought: thought.trim() || "(no note)",
      timestamp: new Date().toLocaleString(),
      response: response ? response.message : getResponse(mood).message,
    };
    setHistory([newEntry, ...history]);
    // Optionally clear thought after saving
    setThought("");
  };

  const handleReset = () => {
    setMood("");
    setThought("");
    setResponse(null);
    // Optionally reset history? Not required, but we keep.
  };

  const getMoodEmoji = (moodValue) => {
    const m = moods.find((m) => m.value === moodValue);
    return m ? m.emoji : "😐";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 px-6 py-4">
          <div className="flex items-center gap-3">
            <Heart className="h-7 w-7 text-white" />
            <h1 className="text-2xl font-bold text-white">Mindful Companion</h1>
          </div>
          <p className="text-teal-100 text-sm mt-1">
            Your gentle guide to emotional well-being
          </p>
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Mood Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              How are you feeling?
            </label>
            <div className="flex flex-wrap gap-3">
              {moods.map((m) => (
                <motion.button
                  key={m.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodSelect(m.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition ${
                    mood === m.value
                      ? "bg-indigo-100 border-indigo-400 text-indigo-700"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xl">{m.emoji}</span>
                  <span className="font-medium">{m.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Thought Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              What's on your mind? (optional)
            </label>
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Write anything you'd like to share..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveEntry}
              disabled={!mood}
              className={`px-5 py-2 rounded-lg font-medium flex items-center gap-2 ${
                !mood
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              <Heart className="h-4 w-4" />
              Save Entry
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </motion.button>
          </div>

          {/* Response Card */}
          <AnimatePresence>
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{response.emoji}</span>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{response.message}</p>
                    <p className="text-gray-600 text-sm mt-2">{response.action}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Two Column: Breathing Exercise + Affirmation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Breathing Exercise */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Breathing Exercise
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBreathing(!showBreathing)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  {showBreathing ? "Hide" : "Show"}
                </motion.button>
              </div>
              <AnimatePresence>
                {showBreathing && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>🌬️ <strong>4-7-8 Breathing</strong></p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Inhale quietly through nose for <strong>4 seconds</strong></li>
                        <li>Hold breath for <strong>7 seconds</strong></li>
                        <li>Exhale forcefully through mouth for <strong>8 seconds</strong></li>
                        <li>Repeat 3-4 times</li>
                      </ol>
                      <p className="mt-2 text-xs text-blue-600">This technique helps calm the nervous system.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Daily Affirmation */}
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-purple-800">Daily Affirmation</h3>
              </div>
              <p className="text-gray-700 italic">“{affirmation}”</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)])
                }
                className="mt-3 text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" /> New affirmation
              </motion.button>
            </div>
          </div>

          {/* Relaxing Tip */}
          <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coffee className="h-5 w-5 text-teal-600" />
                <h3 className="font-semibold text-teal-800">Relaxing Tip</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTip(tips[Math.floor(Math.random() * tips.length)])}
                className="text-sm text-teal-600 hover:text-teal-800"
              >
                New Tip
              </motion.button>
            </div>
            <p className="text-gray-700 mt-2">{tip}</p>
          </div>

          {/* Mood History */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Mood Entries
            </h3>
            {history.length === 0 ? (
              <p className="text-gray-500 text-sm">No entries yet. Save a mood to see history.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {history.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
                      <span className="font-medium text-gray-700">{entry.mood}</span>
                      <span className="text-xs text-gray-400 ml-auto">{entry.timestamp}</span>
                    </div>
                    {entry.thought !== "(no note)" && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{entry.thought}</p>
                    )}
                  </div>
                ))}
                {history.length > 5 && (
                  <p className="text-xs text-gray-400 text-center">+ {history.length - 5} more</p>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}