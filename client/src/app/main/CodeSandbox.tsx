"use client"; // Necessary for client-side features

import React, { useState, useEffect, useCallback } from "react";
import Controlled from "@uiw/react-codemirror";
import IControlledCodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import debounce from "lodash.debounce"; // Debounce utility to delay sending updates

let myTheme = EditorView.theme(
  {
    "&": {
      color: "white",
      backgroundColor: "#111827",
    },
    ".cm-content": {
      caretColor: "white",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#0e9",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "#111827",
    },
    ".cm-gutters": {
      backgroundColor: "#111827",
      color: "#ddd",
      border: "none",
    },
  },
  { dark: true }
);

interface ApiResponse {
  message: string;
  code?: string;
}

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState<string>(""); // State to control editor content
  const [response, setResponse] = useState<string | null>(null); // State for API response

  // Function to submit the code to the server
  const submitCode = async (codeToSubmit: string) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: codeToSubmit }), // Send code in request body
      });

      if (!res.ok) {
        throw new Error("Failed to submit code");
      }

      const data: ApiResponse = await res.json(); // Parse JSON response
      setResponse(data.message); // Set the response message
    } catch (error) {
      console.error("Error submitting code:", error);
      setResponse("An error occurred while submitting code"); // Set error message
    }
  };

  // Debounced function to send code to backend
  const debouncedSubmitCode = useCallback(
    debounce((newCode: string) => {
      console.log(newCode);
      submitCode(newCode);
    }, 2000), // Wait 2 seconds after the user stops typing
    [] // Dependency array is empty since debounce does not depend on external values
  );

  // Function to handle editor changes
  const handleEditorChange = (editor: IControlledCodeMirror, data: unknown, value: string) => {
    setCode(value); // Update code state with new editor value
    debouncedSubmitCode(value); // Call debounced submit function
  };

  useEffect(() => {
    // Function to periodically submit code to the server
    const intervalId = setInterval(() => {
      submitCode(code); // Submit the current code every 5 seconds
    }, 5000); // 5000 milliseconds = 5 seconds

    // Cleanup function to clear the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [code]); // Depend on `code` so it updates with the latest code

  return (
    <div className="flex flex-col items-center bg-gray-900 min-h-screen text-white">
      <div className="code-editor w-full h-96 border border-gray-300 rounded-md overflow-y-auto">
        {/* Controlled CodeMirror editor */}
        <Controlled
          value={code} // Controlled value for the editor
          onChange={handleEditorChange} // Handle code changes
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
      <div className="p-10">
        <button
          onClick={() => submitCode(code)}
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 ease-in-out shadow-neon-blue hover:shadow-neon-purple hover:scale-105"
        >
          Submit Code
        </button>
      </div>
      {/* Display the response */}
      {response && <p className="mt-4 text-green-600">{response}</p>}
    </div>
  );
};

export default CodeEditor;
