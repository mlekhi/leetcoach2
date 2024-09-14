"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Home() {
   const randomTask = useQuery(
     api.getLeetCodeTask.getRandomProblemByDifficulty,
     {
       difficulty: "Medium",
     }
   );
   console.log(randomTask);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      testing shit
    </main>
  );
}