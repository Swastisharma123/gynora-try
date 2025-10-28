import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDcnvO51bmfFhn-cKLP61-BVE2wZfEl9Ls");
const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

async function test() {
  const result = await model.generateContent("Say hello world");
  console.log(result.response.text());
}

test().catch(console.error);
