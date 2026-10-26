export type Difficulty = "junior" | "mid" | "senior";

export interface Role {
  slug: string;
  title: string;
  description: string;
  topics: string[];
}