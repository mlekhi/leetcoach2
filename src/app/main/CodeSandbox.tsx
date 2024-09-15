"use client"; // Necessary for client-side features

import React, { useState } from "react";
import {
  Controlled as ControlledEditor,
  IControlledCodeMirror,
} from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";

interface ApiResponse {
  message: string;
  code?: string;
}

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState<string>("");

  const [response, setResponse] = useState<string | null>(null);

  const handleEditorChange = (
    editor: IControlledCodeMirror,
    data: unknown,
    value: string
  ) => {
    setCode(value);
  };

  const submitCode = async () => {
    try {
      const res = await fetch("/api/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit code");
      }

      const data: ApiResponse = await res.json();
      setResponse(data.message);
    } catch (error) {
      console.error("Error submitting code:", error);
      setResponse("An error occurred while submitting code");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="code-editor w-full h-96 border border-gray-300 rounded-md overflow-y-auto">
        <ControlledEditor
          value={code}
          onBeforeChange={handleEditorChange}
          options={{
            lineWrapping: true,
            lint: true,
            mode: "javascript",
            theme: "material",
            lineNumbers: true,
            // placeholder: "Write your code here...", // Placeholder support
          }}
          className="h-full"
        />
      </div>
      <button
        onClick={submitCode}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
      >
        Submit Code
      </button>
      {response && <p className="mt-4 text-green-600">{response}</p>}
    </div>
  );
};

export default CodeEditor;
