import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const getGenAiResponse = async (message) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  async function main() {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { role: "user", parts: [{ text: message }] },
    });

    return response.text;
  }

  try {
    const reply = await main();
    return reply;
  } catch (e) {
    console.log(e);
  }
};

export default getGenAiResponse;
