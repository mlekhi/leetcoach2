import { query } from "../server";
import { v } from "convex/values";

type Difficulty = "easy" | "medium" | "difficult";

interface Problem {
  _id: string;
  _creationTime: number;
  title: string;
  difficulty: Difficulty;
  description: string;
  exampleInput: string;
  exampleOutput: string;
  constraints: string;
  // Add any other fields that might be in your Problem table
}

export const getRandomTask = query({
  args: {
    difficulty: v.union(
      v.literal("easy"),
      v.literal("medium"),
      v.literal("difficult")
    ),
  },
  handler: async (ctx, args): Promise<Problem | null> => {
    const tasks = await ctx.db
      .query("LeetCodeQuestions")
      .filter((q) => q.eq(q.field("difficulty"), args.difficulty))
      .collect();

    if (tasks.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * tasks.length);
    return tasks[randomIndex] as Problem;
  },
});
