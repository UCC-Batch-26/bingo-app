import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = import.meta.env.PROD 
      ? 'https://www.bit9o.com' 
      : 'http://localhost:3000';
    
    const newSocket = io(socketUrl, {
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const joinRoom = (roomCode) => {
    if (socket && isConnected) {
      socket.emit('join-room', roomCode);
    }
  };

  const leaveRoom = (roomCode) => {
    if (socket && isConnected) {
      socket.emit('leave-room', roomCode);
    }
  };

  const onNumberDrawn = (callback) => {
    if (socket) {
      socket.on('number-drawn', callback);
    }
  };

  const offNumberDrawn = (callback) => {
    if (socket) {
      socket.off('number-drawn', callback);
    }
  };

  const onPlayerJoined = (callback) => {
    if (socket) {
      socket.on('player-joined', callback);
    }
  };

  const offPlayerJoined = (callback) => {
    if (socket) {
      socket.off('player-joined', callback);
    }
  };

  const onPlayerLeft = (callback) => {
    if (socket) {
      socket.on('player-left', callback);
    }
  };

  const offPlayerLeft = (callback) => {
    if (socket) {
      socket.off('player-left', callback);
    }
  };

  const onRoomStatusChanged = (callback) => {
    if (socket) {
      socket.on('room-status-changed', callback);
    }
  };

  const offRoomStatusChanged = (callback) => {
    if (socket) {
      socket.off('room-status-changed', callback);
    }
  };

  const onPlayerWon = (callback) => {
    if (socket) {
      socket.on('player-won', callback);
    }
  };

  const offPlayerWon = (callback) => {
    if (socket) {
      socket.off('player-won', callback);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinRoom,
        leaveRoom,
        onNumberDrawn,
        offNumberDrawn,
        onPlayerJoined,
        offPlayerJoined,
        onPlayerLeft,
        offPlayerLeft,
        onRoomStatusChanged,
        offRoomStatusChanged,
        onPlayerWon,
        offPlayerWon,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export default SocketContext;
