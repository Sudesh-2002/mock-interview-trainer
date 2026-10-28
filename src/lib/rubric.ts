export const MIN_ANSWER_CHARS = 20;
export const MAX_ANSWER_CHARS = 4000;

export const DIMENSIONS = [
  {
    key: "structure",
    label: "Structure",
    description:
      "Logical organization: a clear opening, ordered reasoning, and a conclusion. For behavioral questions, use STAR (Situation, Task, Action, Result).",
  },
  {
    key: "clarity",
    label: "Clarity",
    description:
      "Easy to follow: precise wording, no rambling, no unexplained jargon.",
  },
  {
    key: "relevance",
    label: "Relevance",
    description: "Directly answers what was asked and stays on topic.",
  },
  {
    key: "depth",
    label: "Depth",
    description:
      "Substance: correct details, trade-offs, concrete examples, measurable results.",
  },
] as const;

export type DimensionKey = (typeof DIMENSIONS)[number]["key"];

export const SCORE_ANCHORS = [
  "0-2: missing, off-topic, or mostly incorrect",
  "3-4: weak, with major gaps or vague generalities",
  "5-6: adequate; correct but generic or uneven",
  "7-8: strong; specific, accurate and well organized",
  "9-10: exceptional; rare, would impress a senior interviewer",
];