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

   // In your component:
   const groqAction = useAction(api.getGroqResponse.getGroqChatCompletion);

   // To use the action:
   const handleSubmit = async () => {
     try {
       const response = await groqAction({ userMessage: "I love men." });
       console.log(response);
     } catch (error) {
       console.error("Error:", error);
     }
   };
   console.log(randomTask);

   handleSubmit();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      testing shit
    </main>
  );
}