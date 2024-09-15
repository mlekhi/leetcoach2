// hooks/useSocket.ts
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export function useSocket() {
    const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
    const [response, setResponse] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initialize the socket connection
        let socketIo: SocketIOClient.Socket | undefined;
        try {
            socketIo = io(SOCKET_URL);
            
            // Listen for 'groq_response' event
            socketIo.on('groq_response', (data: { response: string }) => {
                setResponse(data.response);
            });

            // Set the socket instance
            setSocket(socketIo);
        } catch (err) {
            setError(`Socket connection error: ${(err as Error).message}`);
        }

        // Cleanup on component unmount
        return () => {
            if (socketIo) {
                socketIo.disconnect();
            }
        };
    }, []);

    // Handle cases where the socket is null
    const sendMessage = (message: string) => {
        if (socket) {
            socket.emit('message', message);
        } else {
            setError('Socket is not initialized.');
        } 
    };

    return { response, error, sendMessage };
}

export default useSocket;
