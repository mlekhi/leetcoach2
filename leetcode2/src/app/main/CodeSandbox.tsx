"use client"; // Necessary for client-side features

import React, { useState } from "react";
import Controlled from "@uiw/react-codemirror"
import IControlledCodeMirror from "@uiw/react-codemirror"
import {EditorView} from "@codemirror/view"

let myTheme = EditorView.theme({
  "&": {
    color: "white",
    backgroundColor: "#111827"
  },
  ".cm-content": {
    caretColor: "white"
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "#0e9"
  },
  "&.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "#111827"
  },
  ".cm-gutters": {
    backgroundColor: "#111827",
    color: "#ddd",
    border: "none"
  }
}, {dark: true})

interface ApiResponse {
  message: string;
  code?: string;
}

const CodeEditor: React.FC = () => {
  console.log("CodeEditor rendered");

  const [code, setCode] = useState<string>(""); // State to control editor content
  const [response, setResponse] = useState<string | null>(null); // State for API response

  // Function to handle editor changes
  const handleEditorChange = (
    editor: typeof IControlledCodeMirror,
    data: unknown,
    value: string
  ) => {
    setCode(value); // Update code state with new editor value
  };

  // Function to submit the code to the server
  const submitCode = async () => {
    try {
      const res = await fetch("/api/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }), // Send code in request body
      });

      if (!res.ok) {
        throw new Error("Failed to submit code");
      }

      const data: ApiResponse = await res.json(); // Parse JSON response
      setResponse(data.message); // Set the response message
    } catch (error) {
      console.error("Error submitting code:", error);
      setResponse("An error occurred while submitting code");
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 min-h-screen text-white">
      <div className="code-editor w-full h-96 border border-gray-300 rounded-md overflow-y-auto">
        {/* Controlled CodeMirror editor */}
        <Controlled
          value={code} // Controlled value for the editor
          onBeforeChange={handleEditorChange} // Handle code changes
          theme={myTheme}
          options={{
            lineWrapping: true,
            lint: true,
            mode: "python", // Set mode to Python
            lineNumbers: true, // Show line numbers
          }}
          className="h-full"
        />
      </div>
      {/* Button to submit the code */}
      <button
        onClick={submitCode}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
      >
        Submit Code
      </button>
      {/* Display the response */}
      {response && <p className="mt-4 text-green-600">{response}</p>}
    </div>
  );
};

export default CodeEditor;
