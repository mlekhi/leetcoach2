"use client";

import { useQuery, useAction} from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Home() {
   const randomTask = useQuery(
     api.getLeetCodeTask.getRandomProblemByDifficulty,
     {
       difficulty: "Medium",
     }
   );
   const groqTask = useAction(api.getGroqResponse.getGroqChatCompletion, {
     userMessage: "I love men.",
   });
   console.log(randomTask);
   console.log(groqTask)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      testing shit
    </main>
  );
}