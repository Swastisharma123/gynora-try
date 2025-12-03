// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDcnvO51bmfFhn-cKLP61-BVE2wZfEl9Ls"; // paste your working key here directly

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

export async function callGeminiFlash(prompt: string) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text || "No response text received from Gemini.";
  } catch (error) {
    console.error("Gemini API call failed:", error);
    return "AI could not process this request right now. Please try again later.";
  }
}
