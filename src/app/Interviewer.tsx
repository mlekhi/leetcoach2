// src/InterviewQuestionsPage.js
import React from 'react';
import Question from './main/Question';
import Sandbox from './main/CodeSandbox';
import Timer from '../components/Timer';
import { useState, useEffect } from 'react';
import { useQuery } from "convex/react";

const Interview = () => {
    const difficulty = "easy"    
    return (
        <div className="min-h-screen text-white py-12 px-6 flex items-start pt-40 pb-40">
            <div className="container mx-auto flex flex-col lg:flex-row gap-12">
                
                <div className="lg:w-1/4">
                    <div className="mb-12 p-6 rounded-lg shadow-neon-blue">
                        <Question />
                    </div>
                </div>
                
                <div className="lg:w-1/2">
                    <div className="p-6 rounded-lg shadow-neon-purple">
                        <Sandbox />
                    </div>
                </div>

                <div className="lg:w-1/4 flex flex-col items-center">
                    <div className="w-20 mt-4 p-4 rounded-full shadow-neon-blue">
                        <Timer />
                    </div>
                    <div className="mt-4 p-4 rounded-lg">
                        <img src="logo.png" alt="Logo" className="mx-auto max-w-full h-auto" />
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Interview;
