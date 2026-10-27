import OpenAI from "openai";

export const llm = new OpenAI({
  apiKey: process.env.LLM_API_KEY ?? "missing",
  baseURL: process.env.LLM_BASE_URL ?? "https://api.groq.com/openai/v1",
});

export const LLM_MODEL = process.env.LLM_MODEL ?? "llama-3.3-70b-versatile";