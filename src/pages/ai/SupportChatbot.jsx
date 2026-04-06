import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  MessageCircle,
  Trash2,
  Mic,
  Sun,
  Moon,
  User,
  Bot,
  Clock,
} from "lucide-react";

export default function SupportChatbot() {
  // State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Add welcome message
      setMessages([
        {
          id: Date.now(),
          role: "bot",
          text: "Hello! I'm your AI Support Assistant. How can I help you today? 😊",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Simulate bot response (or replace with API call)
  const getBotResponse = async (userMessage) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple keyword-based responses
    const msg = userMessage.toLowerCase();
    if (msg.includes("leave")) {
      return "You can apply for leave from the HR portal. Would you like me to guide you?";
    } else if (msg.includes("salary")) {
      return "Your salary details are available in the Payroll section. Need help with calculations?";
    } else if (msg.includes("hr")) {
      return "HR support is available 9 AM - 6 PM. You can raise a ticket or email hr@company.com";
    } else if (msg.includes("thank")) {
      return "You're welcome! 😊 Let me know if you need anything else.";
    } else if (msg.includes("hello") || msg.includes("hi")) {
      return "Hi there! How can I assist you today?";
    } else {
      return "I'm here to help! Try asking about leave, salary, HR support, or just say hi. 😊";
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      role: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Get bot response
    const botReply = await getBotResponse(input);
    const botMsg = {
      id: Date.now() + 1,
      role: "bot",
      text: botReply,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "bot",
        text: "Chat cleared. How can I help you today? 😊",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    localStorage.removeItem("chatMessages");
  };

  const quickReplies = [
    { text: "Check Leave", emoji: "🏖️" },
    { text: "Salary Help", emoji: "💰" },
    { text: "HR Support", emoji: "👥" },
    { text: "General Help", emoji: "💡" },
  ];

  const handleQuickReply = (reply) => {
    setInput(reply);
    inputRef.current?.focus();
  };

  // Voice input (simplified)
  const handleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      recognition.start();
    } else {
      alert("Voice input not supported in this browser.");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-3 flex items-center justify-between border-b ${
            darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gradient-to-r from-indigo-600 to-blue-600"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <MessageCircle className={`h-6 w-6 ${darkMode ? "text-indigo-400" : "text-white"}`} />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
            </div>
            <div>
              <h1 className={`font-semibold ${darkMode ? "text-white" : "text-white"}`}>AI Support Assistant</h1>
              <p className="text-xs text-green-200">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-1.5 rounded-lg transition ${
                darkMode ? "hover:bg-gray-700 text-yellow-400" : "hover:bg-white/20 text-white"
              }`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={clearChat}
              className={`p-1.5 rounded-lg transition ${
                darkMode ? "hover:bg-gray-700 text-red-400" : "hover:bg-white/20 text-white"
              }`}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div
          className={`flex-1 overflow-y-auto p-4 space-y-4 h-[500px] ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === "user"
                      ? darkMode
                        ? "bg-indigo-600 text-white"
                        : "bg-indigo-600 text-white"
                      : darkMode
                      ? "bg-gray-700 text-gray-100"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {msg.role === "bot" && (
                      <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                    )}
                    <div className="space-y-1">
                      <p className="text-sm">{msg.text}</p>
                      <div className="flex items-center justify-end gap-1 text-xs opacity-70">
                        <Clock className="h-3 w-3" />
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                    {msg.role === "user" && (
                      <User className="h-4 w-4 mt-1 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    darkMode ? "bg-gray-700 text-gray-100" : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <span className="text-sm ml-1">Bot is typing</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>

        {/* Quick Replies */}
        <div
          className={`px-4 py-2 flex flex-wrap gap-2 border-t ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickReply(reply.text)}
              className={`text-sm px-3 py-1 rounded-full transition ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {reply.emoji} {reply.text}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div
          className={`p-4 border-t ${
            darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              className={`flex-1 resize-none rounded-lg px-4 py-2 outline-none transition ${
                darkMode
                  ? "bg-gray-700 text-white border border-gray-600 focus:border-indigo-500"
                  : "bg-gray-100 text-gray-800 border border-gray-300 focus:border-indigo-500"
              }`}
            />
            <button
              onClick={handleVoiceInput}
              className={`p-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
            >
              <Mic className="h-5 w-5" />
            </button>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className={`p-2 rounded-lg transition ${
                !input.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : darkMode
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}