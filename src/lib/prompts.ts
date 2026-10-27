import type { Difficulty, Role } from "@/types";

const LEVEL_GUIDE: Record<Difficulty, string> = {
  junior: "Entry-level. Focus on fundamentals and practical basics.",
  mid: "2-5 years of experience. Expect trade-offs, debugging, and real-world experience.",
  senior: "5+ years. Expect design decisions, scalability, mentoring, and ambiguity.",
};

interface QuestionPromptInput {
  role: Role;
  difficulty: Difficulty;
  previousQuestions: string[];
}

export function buildQuestionMessages({
  role,
  difficulty,
  previousQuestions,
}: QuestionPromptInput) {
  const system = [
    "You are an experienced interviewer conducting a mock interview.",
    "Ask exactly ONE interview question.",
    "Output only the question text: no preamble, no numbering, no hints, no sample answer.",
    "Keep it under 60 words and make it answerable in 1-3 minutes of speaking.",
  ].join(" ");

  const avoid =
    previousQuestions.length > 0
      ? `\nDo NOT repeat or closely rephrase these earlier questions:\n${previousQuestions
          .map((q) => `- ${q}`)
          .join("\n")}`
      : "";

  const user = [
    `Role: ${role.title}`,
    `Focus areas: ${role.topics.join(", ")}`,
    `Level: ${difficulty}. ${LEVEL_GUIDE[difficulty]}`,
    role.slug === "behavioral"
      ? "Ask a behavioral question that suits a STAR-style answer."
      : "Pick one focus area and ask a question about it.",
    avoid,
  ].join("\n");

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}