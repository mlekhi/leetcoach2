// src/InterviewQuestionsPage.js
'use client'
import React from 'react';
import Question from './Question';
import CodeEditor from './CodeSandbox';
import Timer from './Timer';
import { useSocket } from '../hooks/useSocket'; // Adjust the path if necessary

const Interview = () => {
    const difficulty = "easy";
    
    // Use the useSocket hook to get socket-related data
    const { response, error, sendMessage } = useSocket();

    // Optionally, handle socket-related logic or side effects here
    React.useEffect(() => {
        // Example: Send a message when the component mounts
        sendMessage('Component Mounted');
    }, [sendMessage]);

    return (
        <div className="min-h-screen text-white py-12 px-6 flex items-start pt-40 pb-40">
            <div className="container mx-auto flex flex-col lg:flex-row gap-12">
                
                <div className="lg:w-1/4">
                    <div className="mb-12 p-6 rounded-lg">
                        <Question />
                    </div>
                </div>
                
                <div className="lg:w-1/2">
                    <div className="p-6 rounded-lg">
                        <CodeEditor />
                    </div>
                </div>

                <div className="lg:w-1/4 flex flex-col items-center">
                    <div className="w-15 mt-4 p-4 rounded-full shadow-neon-blue">
                        <Timer />
                    </div>
                    <div className="mt-4 p-4 rounded-lg">
                        <img src="logo.png" alt="Logo" className="mx-auto max-w-full h-auto" />
                    </div>
                </div>

                {/* Display the response and error from the socket */}
                {/* {response && <div className="p-4 bg-green-500 rounded-lg">Response: {response}</div>}
                {error && <div className="p-4 bg-red-500 rounded-lg">Error: {error}</div>} */}
            </div>
        </div>
    );
}

export default Interview;
