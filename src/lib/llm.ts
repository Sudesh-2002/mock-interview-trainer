import OpenAI from "openai";

export const llm = new OpenAI({
  apiKey: process.env.LLM_API_KEY ?? "missing",
  baseURL: process.env.LLM_BASE_URL ?? "https://api.groq.com/openai/v1",
});

export const LLM_MODEL = process.env.LLM_MODEL ?? "qwen/qwen3.8-27b";