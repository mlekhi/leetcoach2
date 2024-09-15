import { query } from "./_generated/server";
import { v } from "convex/values";

export const getRandomProblemByDifficulty = query({
  args: {
    difficulty: v.union(
      v.literal("Easy"),
      v.literal("Medium"),
      v.literal("Hard")
    ),
  },
  handler: async (ctx, args) => {
    const problems = await ctx.db
      .query("Problems")
      .filter((q) => q.eq(q.field("difficulty"), args.difficulty))
      .collect();

    if (problems.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * problems.length);
    return problems[randomIndex];
  },
});
