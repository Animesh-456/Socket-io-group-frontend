import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'https://socket-io-group-backend.onrender.com';

export const useSocket = (): Socket => {
    const socketRef = useRef<Socket | null>(null);

    if (!socketRef.current) {
        socketRef.current = io(SOCKET_URL);
    }

    useEffect(() => {
        const socket = socketRef.current;

        return () => {
            socket?.disconnect();
        };
    }, []);

    return socketRef.current;
};
