import { useState } from "react";
import { Send } from "lucide-react";

export default function SupportChatbot() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello 👋 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // user message
    const userMsg = { role: "user", text: input };

    // fake bot reply (later API se replace karenge)
    const botMsg = {
      role: "bot",
      text: "Thanks for your query. Our AI will assist you shortly 🤖",
    };

    setMessages([...messages, userMsg, botMsg]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[80vh] p-4">
      
      {/* HEADER */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">AI Support Chatbot</h1>
        <p className="text-sm text-gray-500">
          AI-powered employee complaint resolution
        </p>
      </div>

      {/* CHAT BOX */}
      <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs text-sm ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT BOX */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-1"
        >
          <Send size={16} />
          Send
        </button>
      </div>
    </div>
  );
}