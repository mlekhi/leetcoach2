"use client"; // This is a client-side component

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const fetchConversationAndSendToAPI = async () => {
      try {
        const conversationResponse = await fetch('/conversation.txt');
        const conversation = await conversationResponse.text();

        const apiResponse = await fetch('/api/summary', {  // Changed here
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ conversation }),
        });

        if (!apiResponse.ok) {
          throw new Error('Error summarizing conversation');
        }

        const data = await apiResponse.json();
        setSummary(data);
      } catch (error) {
        console.error(error);
        alert('Failed to summarize the conversation.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversationAndSendToAPI();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Conversation Summarizer</h1>
      {loading ? (
        <p>Loading summary...</p>
      ) : (
        summary && (
          <div style={{ marginTop: '20px' }}>
            <h2>Summary</h2>
            <p>Correctness Score: {summary['correctness-score']}/10</p>
            <p>Clarity Score: {summary['clarity-score']}/10</p>
            <p>Time Complexity Score: {summary['time-complexity-score']}/10</p>
          </div>
        )
      )}
    </div>
  );
}
