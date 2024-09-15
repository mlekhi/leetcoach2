import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'http://127.0.0.1:5000';

export function useSocket() {
    const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
    const [response, setResponse] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let socketIo: SocketIOClient.Socket | undefined;

        try {
            socketIo = io(SOCKET_URL, { transports: ['websocket'] });

            socketIo.on('connect', () => {
                console.log('Socket connected');
            });

            socketIo.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            socketIo.on('groq_response', (data: { response: string }) => {
                console.log('Received groq_response:', data);
                setResponse(data.response);
            });

            setSocket(socketIo);
        } catch (err) {
            setError(`Socket connection error: ${(err as Error).message}`);
        }

        return () => {
            if (socketIo) {
                socketIo.disconnect();
            }
        };
    }, []);

    const sendMessage = (message: string) => {
        if (socket) {
            socket.emit('message', message);
        } else {
            setError('Socket is not initialized.');
        }
    };

    const fetchAudio = async (text: string) => {
        try {
            const response = await fetch('/api/synthesize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            // Handle the audio URL, e.g., play the audio
            const audio = new Audio(audioUrl);
            audio.play();
        } catch (err) {
            setError(`Error fetching audio: ${(err as Error).message}`);
        }
    };

    return { response, error, sendMessage, fetchAudio };
}

export default useSocket;
