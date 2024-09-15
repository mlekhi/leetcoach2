'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function RecordButton() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start(3000); // Collect data every 3 seconds
      setIsRecording(true);

      // Send audio chunks every 3 seconds for transcription
      intervalRef.current = setInterval(async () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
          await transcribeAudio(audioFile);
          audioChunksRef.current = []; // Reset the chunks after sending
        }
      }, 3000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Transcribe any remaining audio
      if (audioChunksRef.current.length > 0) {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
        transcribeAudio(audioFile);
      }
    }
  };

  const transcribeAudio = async (audioFile: File) => {
    const formData = new FormData();
    formData.append('file', audioFile);

    try {
      const response = await axios.post('/api/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Transcribed text:', response.data.text);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error transcribing audio:', error.response.data);
      } else {
        console.error('Error transcribing audio:', error);
      }
    }
  };

  useEffect(() => {
    return () => {
      // Clean up when the component unmounts
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
}
