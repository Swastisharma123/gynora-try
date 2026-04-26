import React, { useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  sender: "user" | "ai";
  text: string;
}



const CoachPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const prompt = `You are Gynora's empathetic AI Wellness Coach, specifically designed to support women managing PCOS/PCOD. Your tone is warm, compassionate, and highly sensitive to the emotional and physical challenges women face. You specialize in skin care routines, hormonal balance, nutrition, and mental health. Always prioritize being supportive and kind while providing medical/wellness advice in a highly professional yet empathetic tone.\n\nUser: ${input}`;

    try {
      const { callAI } = await import('@/lib/ai');
      const aiResponseText = await callAI(prompt);
      const aiMessage: Message = { sender: "ai", text: aiResponseText };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (e) {
      setMessages((prev) => [...prev, { sender: "ai", text: "Sorry, I am having trouble connecting right now." }]);
    }
    setIsLoading(false);
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">💬 Gynora Coach</h1>

      <div className="w-full bg-white shadow-lg rounded-2xl p-4 flex flex-col space-y-4 overflow-y-auto h-[70vh]">
=======
    <div className="h-[calc(100vh-140px)] flex flex-col bg-transparent animate-in fade-in duration-500">
      {/* Header */}
      <div className="glass-panel mx-4 mt-2 p-5 rounded-[2.5rem] flex items-center justify-between mb-6 border-white shadow-xl shadow-purple-50">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">Wellness Coach</h1>
            <p className="text-[10px] text-pink-500 font-black uppercase tracking-[0.2em] mt-2 flex items-center">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
               Empathy Online
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-4 custom-scrollbar">
>>>>>>> aea17dd (4/26/2026)
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl border border-purple-50 floating">
              <Sparkles className="w-12 h-12 text-purple-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">How can I help today?</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest max-w-[240px] leading-relaxed">
              Skincare • Nutrition • Hormonal Balance
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={cn(
                "px-6 py-4 max-w-[85%] text-[13px] leading-relaxed shadow-sm transition-all duration-300 font-bold",
                msg.sender === "user"
                  ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-[2rem] rounded-tr-none shadow-purple-100"
                  : "bg-white text-slate-600 rounded-[2rem] rounded-tl-none border border-purple-50 shadow-sm"
              )}
              dangerouslySetInnerHTML={{
                __html: msg.text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br/>")
              }}
            />
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
             <div className="px-6 py-4 rounded-[2rem] rounded-tl-none bg-white text-purple-400 border border-purple-50 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
             </div>
          </div>
        )}
      </div>

<<<<<<< HEAD
      <div className="mt-4 w-full max flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your question..."
          className="flex-1 p-3 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition"
        >
          Send
        </button>
=======
      {/* Input Area */}
      <div className="px-4 pb-4 mt-2">
        <div className="glass-panel p-2 rounded-[2.5rem] flex items-center gap-2 border-white shadow-2xl shadow-purple-100">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-6 py-4 bg-transparent border-0 focus:ring-0 text-sm font-bold text-slate-800 placeholder:text-slate-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-30 shadow-xl shadow-purple-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-0.5">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
>>>>>>> aea17dd (4/26/2026)
      </div>
    </div>
  );
};

export default CoachPage;