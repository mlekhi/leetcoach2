'use client'
import React, { useState, useRef } from "react";
import axios from "axios";

export default function RecordButton() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.webm");

        try {
          const response = await axios.post("/api/transcribe", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log("Transcribed text:", response.data.text);
        } catch (error) {
          console.error("Error transcribing audio:", error);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <button onClick={isRecording ? stopRecording : startRecording}>
      {isRecording ? "Stop Recording" : "Start Recording"}
    </button>
  );
}
