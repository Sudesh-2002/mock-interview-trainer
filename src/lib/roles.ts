import type { Role } from "@/types";

export const CUSTOM_ROLE_SLUG = "custom-job";

export const ROLES: Role[] = [
  {
    slug: CUSTOM_ROLE_SLUG,
    title: "From a Job Posting",
    description:
      "Paste a real job description and practise with questions tailored to it.",
    topics: ["Your target job", "Tailored questions", "Any industry"],
  },
  {
    slug: "frontend-engineer",
    title: "Frontend Engineer",
    description: "React, TypeScript, performance, accessibility.",
    topics: ["React", "TypeScript", "CSS", "Web performance", "Accessibility"],
  },
  {
    slug: "backend-engineer",
    title: "Backend Engineer",
    description: "APIs, databases, scalability, system design.",
    topics: ["REST/GraphQL", "SQL", "Caching", "Auth", "System design"],
  },
  {
    slug: "fullstack-engineer",
    title: "Full Stack Engineer",
    description: "End-to-end features across the whole stack.",
    topics: ["Next.js", "APIs", "Databases", "Deployment", "Testing"],
  },
  {
    slug: "ml-engineer",
    title: "AI / ML Engineer",
    description: "Model training, evaluation, and deployment.",
    topics: ["ML basics", "Evaluation", "Deep learning", "MLOps", "LLMs"],
  },
  {
    slug: "behavioral",
    title: "Behavioral Interview",
    description: "STAR-style questions on teamwork and leadership.",
    topics: ["Conflict", "Leadership", "Failure", "Ownership", "Communication"],
  },
];

export function getRole(slug: string | undefined) {
  return ROLES.find((r) => r.slug === slug);
}