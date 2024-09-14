import React from 'react';

const questions = [
  {
    problem_name: "Duplicate Integer",
    difficulty: "Easy",
    examples: [
      { input: "nums = [1, 2, 3, 3]", output: "true" },
      { input: "nums = [1, 2, 3, 4]", output: "false" }
    ],
    constraints: "None provided",
    solution: `class Solution:
    def hasDuplicate(self, nums: List[int]) -> bool:
        hashset = set()
        for n in nums:
            if n in hashset:
                return True
            hashset.add(n)
        return False`
  },
];

const InterviewQuestionsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="space-y-6">
        {questions.map((q, index) => (
          <div key={index} className="p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              {q.problem_name} 
            </h2>
            <h3 className="text-lg font-semibold mt-4 mb-2">Examples:</h3>
            <ul className="list-disc pl-5 space-y-2">
              {q.examples.map((ex, i) => (
                <li key={i}>
                  <strong className="font-medium">Input:</strong> {ex.input} <br />
                  <strong className="font-medium">Output:</strong> {ex.output}
                </li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mt-4 mb-2">Constraints:</h3>
            <p className="text-gray-700">{q.constraints}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewQuestionsPage;
