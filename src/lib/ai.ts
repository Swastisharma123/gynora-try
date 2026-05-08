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

      let textResponse = "";

      // If response is a string, check if it's a JSON array string
      let parsedResponse = response;
      if (typeof response === 'string') {
        try {
          parsedResponse = JSON.parse(response);
        } catch (e) { }
      }

      if (typeof parsedResponse === 'string') {
        textResponse = parsedResponse;
      } else if (Array.isArray(parsedResponse)) {
        textResponse = parsedResponse.map((item: any) => item.text || item.message || JSON.stringify(item)).join("\n");
      } else {
        // If Puter returned { text: [...] } where text is an array of blocks!
        if (Array.isArray(parsedResponse?.text)) {
           textResponse = parsedResponse.text.map((item: any) => item.text || JSON.stringify(item)).join("\n");
        } else if (Array.isArray(parsedResponse?.message?.content)) {
           textResponse = parsedResponse.message.content.map((item: any) => item.text || JSON.stringify(item)).join("\n");
        } else {
           textResponse = parsedResponse?.text || parsedResponse?.message?.content || String(parsedResponse);
        }
      }
      
      let finalStr = typeof textResponse === 'string' ? textResponse : JSON.stringify(textResponse);
      
      // Aggressively unwrap if it starts with quote
      if (finalStr.startsWith('"') && finalStr.endsWith('"')) {
         try { finalStr = JSON.parse(finalStr); } catch(e) {}
      }

      // Try to parse array
      if (typeof finalStr === 'string' && finalStr.includes('"type"') && finalStr.includes('"text"')) {
         try {
            const arr = JSON.parse(finalStr);
            if (Array.isArray(arr)) {
               finalStr = arr.map((item: any) => item.text).join("\n");
            }
         } catch(e) {}
      }

      return finalStr;
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
              content: "You are Gynora's empathetic AI Wellness Coach for women. Be extremely warm, lively, highly human-like, and supportive. Speak like a best friend, use emojis generously, and DO NOT use numbered lists—use bullet points instead."
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
