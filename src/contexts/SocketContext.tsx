import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { authManager } from '@/lib/api/auth';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  joinRoom: () => {},
  leaveRoom: () => {},
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const joinedRoomsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const token = authManager.getToken();
    if (!token) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

    const socket = io(socketUrl, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      // Rejoin rooms after reconnection
      joinedRoomsRef.current.forEach((roomId) => {
        socket.emit('joinRoom', { requestId: roomId });
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const joinRoom = (roomId: string) => {
    joinedRoomsRef.current.add(roomId);
    socketRef.current?.emit('joinRoom', { requestId: roomId });
  };

  const leaveRoom = (roomId: string) => {
    joinedRoomsRef.current.delete(roomId);
    socketRef.current?.emit('leaveRoom', { requestId: roomId });
  };

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, isConnected, joinRoom, leaveRoom }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
