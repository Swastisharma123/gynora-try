// src/lib/ai.ts (Multi-provider AI service: Puter, Groq, and Gemini)
import { GoogleGenerativeAI } from "@google/generative-ai";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDcnvO51bmfFhn-cKLP61-BVE2wZfEl9Ls";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

declare global {
  interface Window {
    puter: any;
  }
}

export async function callAI(prompt: string, base64Image?: string) {
  // 1. TRY GEMINI FOR VISION (Highly reliable for images)
  if (base64Image && GEMINI_API_KEY) {
    try {
      const mimeType = "image/jpeg";
      const imagePart = {
        inlineData: {
          data: base64Image.replace(/^data:image\/\w+;base64,/, ""),
          mimeType,
        },
      };

      const result = await geminiModel.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      if (text) return text;
    } catch (error) {
      console.warn("Gemini vision failed, falling back to Groq:", error);
    }
  }

  // 2. TRY PUTER FOR TEXT CHAT (If available and no image)
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
        try { finalStr = JSON.parse(finalStr); } catch (e) { }
      }

      // Try to parse array
      if (typeof finalStr === 'string' && finalStr.includes('"type"') && finalStr.includes('"text"')) {
        try {
          const arr = JSON.parse(finalStr);
          if (Array.isArray(arr)) {
            finalStr = arr.map((item: any) => item.text).join("\n");
          }
        } catch (e) { }
      }

      return finalStr;
    } catch (error: unknown) {
      console.warn("Puter AI failed, falling back to Groq/Gemini:", error);
    }
  }

  // 3. TRY GROQ AS FALLBACK
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
    } catch (error: unknown) {
      console.error("Groq Error:", error);
    }
  }

  // 4. LAST RESORT: TRY GEMINI FOR TEXT IF NOT ALREADY TRIED
  if (!base64Image && GEMINI_API_KEY) {
    try {
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini text failed:", error);
    }
  }

  return "⚠️ AI Configuration Error: Please ensure Puter is loaded or API keys are active.";
}

