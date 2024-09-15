// components/SocketComponent.tsx
import React from 'react';
import useSocket from '../components/useSocket'; // Adjust the path if necessary

const SocketComponent: React.FC = () => {
    const { response, error, sendMessage } = useSocket();

    const handleClick = () => {
        sendMessage('Hello, Server!');
    };

    return (
        <div>
            <button onClick={handleClick}>Send Message</button>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <p>Response: {response}</p>
        </div>
    );
};

export default SocketComponent;
