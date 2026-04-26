import React, { useState } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { callAI } from "@/lib/ai";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export const FloatingCoachWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const prompt = `You are Gynora's empathetic AI Wellness Coach, specifically designed to support women managing PCOS/PCOD. Your tone is warm, compassionate, and highly sensitive to the emotional and physical challenges women face. You specialize in skin care routines, hormonal balance, nutrition, and mental health. Always prioritize being supportive and kind while providing evidence-based wellness guidance.\n\nUser: ${textToSend}`;

    const aiResponseText = await callAI(prompt);
    const aiMessage: Message = { sender: "ai", text: aiResponseText };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-32 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-2xl shadow-purple-200 hover:scale-110 transition-all z-[100] flex items-center justify-center border-4 border-white active:scale-95 group"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-48 right-6 w-[320px] h-[480px] bg-white rounded-3xl shadow-[0_30px_90px_rgba(124,58,237,0.25)] border border-purple-50 flex flex-col overflow-hidden z-[100] animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-6 text-white flex items-center space-x-3">
            <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
               <MessageCircle className="w-5 h-5" />
            </div>
            <div>
               <p className="text-sm font-black tracking-tight leading-none">Health Coach</p>
               <p className="text-[9px] font-bold uppercase tracking-widest mt-1.5 opacity-80">Empathetic AI</p>
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto bg-[#FCFAFF] flex flex-col space-y-4 custom-scrollbar">
            {messages.length === 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-purple-50">
                    <Sparkles className="w-8 h-8 text-purple-500" />
                  </div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    Hello! Ask me about PCOS, <br/> Skincare or Nutrition. ✨
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {["Best PCOS Diet?", "Skincare Tips?", "Stress Help?"].map((faq) => (
                    <button
                      key={faq}
                      onClick={() => handleSend(faq)}
                      className="px-5 py-3 bg-white border border-purple-100 rounded-2xl text-[11px] font-bold text-purple-600 hover:bg-purple-50 transition shadow-sm text-left"
                    >
                      {faq}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-[13px] font-bold max-w-[85%] leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-br-none"
                      : "bg-white text-slate-600 rounded-bl-none border border-purple-50"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: msg.text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br/>")
                  }}
                />
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-5 py-3 rounded-2xl bg-white text-purple-400 rounded-bl-none shadow-sm border border-purple-50">
                   <div className="flex space-x-1.5">
                     <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
                     <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                     <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                   </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-white border-t border-purple-50 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Message..."
              className="flex-1 px-4 py-3 bg-slate-50 border-0 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-100 transition"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="w-11 h-11 bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-xl flex items-center justify-center hover:scale-105 disabled:opacity-30 transition-all shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
