// components/LiveTranscription.tsx

'use client';
import { useEffect, useRef, useState } from 'react';

const LiveTranscription: React.FC = () => {
  const [transcription, setTranscription] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Your browser does not support audio recording.');
      return;
    }

    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.addEventListener('dataavailable', async (event) => {
          const audioBlob = event.data;
          const audioBuffer = await audioBlob.arrayBuffer();

          // Send the audio to the backend API route
          fetch('/api/transcribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'audio/mp3',
            },
            body: audioBuffer,
          })
            .then((response) => {console.log('Received response:', response);
              return response.json();})
            .then((data) => {console.log('Received data:', data);
              if (data.transcriptions && data.transcriptions.length > 0) {
                const transcript = data.transcriptions[0].transcript; // Access the first transcript
                console.log('Transcript:', transcript);
                
                setTranscription((prev) => prev + ' ' + transcript); // Append the transcript
              } else {
                console.log('No transcription found:', data);
              }
                      })
            .catch((error) => console.error('Error:', error));
        });

        mediaRecorder.start(4000); // Send data every 1000ms
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    startRecording();

    return () => {
      mediaRecorderRef.current?.stop();
      audioStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div>
      <h2>Live Transcription</h2>
      <p>{transcription}</p>
    </div>
  );
};

export default LiveTranscription;
