'use client';

import React, { useState, FormEvent } from 'react';
import useSocket from '../hooks/useSocket';

const TextToSpeechComponent: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { response, sendMessage, error } = useSocket();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setAudioUrl(null); // Reset audioUrl before starting the request
    try {
      sendMessage(text);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  // Update audio URL when response changes
  React.useEffect(() => {
    if (response) {
      // Assuming the response is a URL to the audio file
      console.log("to hear: ", {response});
      setAudioUrl(response);
      setIsLoading(false);
    }
  }, [response]);

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }}>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
          placeholder="Enter text to convert to speech"
          style={{ width: '100%', minHeight: '100px', marginBottom: '16px', padding: '8px' }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Converting...' : 'Convert to Speech'}
        </button>
      </form>
      {audioUrl && (
        <div style={{ marginTop: '16px' }}>
          <audio controls src={audioUrl} autoPlay>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default TextToSpeechComponent;

