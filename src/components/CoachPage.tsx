import React, { useState } from "react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

const fakeResponses: Record<string, string> = {
  pcos:
    "**AI Suggestion:** For PCOS, include more high-fiber foods such as spinach, broccoli, and oats. " +
    "Limit processed sugar, dairy, and fried snacks. Stay active at least 30 minutes a day and get enough sleep — " +
    "these small habits can regulate your hormones naturally.",

  sweat:
    "**AI Insight (Based on Sweat Analysis):** Your sweat pattern indicates mild dehydration and slightly high sodium levels. " +
    "Drink 2.5–3 liters of water daily, include fruits like watermelon and cucumber, and avoid excessive salty or spicy food. " +
    "Maintaining electrolyte balance will help your skin and energy levels.",

  "mental health":
    "**AI Support:** Hey, I know things can get stressful sometimes. Try journaling or listening to calm music. " +
    "Close your eyes for a few seconds and take slow, deep breaths. Remember, progress isn’t always visible — but it’s happening.",

  diet:
    "**AI Tip:** Focus on a colorful plate — veggies, whole grains, and proteins. " +
    "Avoid skipping breakfast and reduce sugary drinks. Eat small portions more often to balance energy throughout the day.",

  hydration:
    "**AI Note:** You seem a bit low on hydration! Aim for 8–10 glasses of water daily. " +
    "Add lemon or mint for taste, and eat hydrating foods like oranges and cucumbers.",

  exercise:
    "**AI Motivation:** A 20-minute walk or quick stretch session can reset your mind and boost metabolism. " +
    "You don’t need hours — just consistency and movement every day.",

  default:
    "**AI Fallback:** The AI is recharging 🤖💤. Meanwhile, take a deep breath, hydrate, and keep going strong!"
};

// Function to get fake AI response
function getFakeAIResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes("pcos")) return fakeResponses["pcos"];
  if (lowerPrompt.includes("sweat")) return fakeResponses["sweat"];
  if (lowerPrompt.includes("mental")) return fakeResponses["mental health"];
  if (lowerPrompt.includes("diet")) return fakeResponses["diet"];
  if (lowerPrompt.includes("hydration")) return fakeResponses["hydration"];
  if (lowerPrompt.includes("exercise")) return fakeResponses["exercise"];
  return fakeResponses["default"];
}

const CoachPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    const aiResponse: Message = { sender: "ai", text: getFakeAIResponse(input) };

    setMessages((prev) => [...prev, userMessage, aiResponse]);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-pink-50 to-purple-100 p-4">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">💬 Gynora Coach</h1>

      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-4 flex flex-col space-y-4 overflow-y-auto h-[70vh] border border-pink-200">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 italic">
            Ask me about PCOS, diet, hydration, sweat analysis, or mental health 🌿
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
                msg.sender === "user"
                  ? "bg-purple-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none border border-purple-100"
              }`}
              dangerouslySetInnerHTML={{
                __html: msg.text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 w-full max-w-lg flex items-center gap-2">
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
      </div>
    </div>
  );
};

export default CoachPage;