import { v } from "convex/values";
import { action } from "./_generated/server";
import Groq from "groq-sdk";

export const getGroqChatCompletion = action({
  args: {
    userMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: args.userMessage,
          },
        ],
        model: "llama3-70b-8192", // or whichever model you prefer
      });

      return chatCompletion.choices[0]?.message?.content;
    } catch (error) {
      console.error("Error calling Groq API:", error);
      throw new Error("Failed to get chat completion from Groq");
    }
  },
});
