// src/lib/ai.ts (Migrated from gemini.ts to Groq for better reliability)
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Groq API KEY (Using Env Var for Security)
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

declare global {
  interface Window {
    puter: any;
  }
}

export async function callAI(prompt: string, base64Image?: string) {
  // 1. USE PUTER FOR TEXT CHAT (If available and no image)
  if (!base64Image && typeof window !== 'undefined' && window.puter) {
    try {
      const response = await window.puter.ai.chat(prompt);
      return response.toString();
    } catch (error: any) {
      console.warn("Puter AI failed, falling back to Groq:", error);
    }
  }

  // 2. USE GROQ FOR VISION OR FALLBACK
  if (GROQ_API_KEY && !GROQ_API_KEY.startsWith("PASTE_")) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: base64Image ? "llama-3.2-11b-vision-preview" : "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: "You are Gynora's empathetic AI Wellness Coach for women. Be professional, kind, and supportive."
            },
            {
              role: "user",
              content: base64Image 
                ? [
                    { type: "text", text: prompt },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image.replace(/^data:image\/\w+;base64,/, "")}` } }
                  ]
                : prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content;
      }
      throw new Error(data.error?.message || "Groq API error");
    } catch (error: any) {
      console.error("Groq Error:", error);
      return `⚠️ AI Error: ${error.message}.`;
    }
  }

  return "⚠️ AI Configuration Error: Please ensure Puter is loaded or Groq key is active.";
}
