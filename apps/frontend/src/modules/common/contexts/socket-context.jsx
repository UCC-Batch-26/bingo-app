import { createContext, useEffect, useState, useRef } from 'react';
import Pusher from 'pusher-js';

let pusherInstance = null;
function getPusherInstance() {
  if (!pusherInstance) {
    const pusherKey = '77e522a933cb626f5be0';
    const pusherCluster = 'ap1';
    pusherInstance = new Pusher(pusherKey, {
      cluster: pusherCluster,
      forceTLS: true,
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
    });
  }
  return pusherInstance;
}

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [pusher, setPusher] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const boundHandlersRef = useRef(false);

  useEffect(() => {
    const instance = getPusherInstance();
    setPusher(instance);

    if (!boundHandlersRef.current) {
      instance.connection.bind('connected', () => {
        setIsConnected(true);
      });

      instance.connection.bind('disconnected', () => {
        setIsConnected(false);
      });

      instance.connection.bind('error', (error) => {
        console.error('Pusher connection error:', error);
        setIsConnected(false);
      });

      boundHandlersRef.current = true;
    }

    const handleBeforeUnload = () => {
      try {
        instance.disconnect();
      } catch (error) {
        console.error('Error disconnecting Pusher on unload:', error);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);      
    };
  }, []);

  const joinRoom = (roomCode) => {
    if (pusher && (isConnected || (pusher.connection && pusher.connection.state === 'connected'))) {
      if (currentRoom) {
        pusher.unsubscribe(`room-${currentRoom}`);
      }

      const channel = pusher.subscribe(`room-${roomCode}`);
      setCurrentRoom(roomCode);

      channel.bind('pusher:subscription_succeeded', () => {
        console.log('Successfully subscribe to room:', roomCode);
      });

      channel.bind('pusher:subscription_error', (error) => {
        console.error('Failed to subscribe to room:', roomCode, error);
      });
    } else {
      console.log('Cannot join room - pusher or connection not ready:', { pusher: !!pusher, isConnected });
    }
  };

  const leaveRoom = (roomCode) => {
    if (pusher && isConnected) {
      pusher.unsubscribe(`room-${roomCode}`);
      if (currentRoom === roomCode) {
        setCurrentRoom(null);
      }
    }
  };

  const onNumberDrawn = (callback) => {
    if (pusher && currentRoom) {
      const channel = pusher.channel(`room-${currentRoom}`);
      if (channel) {
        channel.bind('number-drawn', callback);
      }
    }
  };

  const offNumberDrawn = (callback) => {
    if (pusher && currentRoom) {
      const channel = pusher.channel(`room-${currentRoom}`);
      if (channel) {
        channel.unbind('number-drawn', callback);
      }
    }
  };

  const onPlayerJoined = (callback) => {
    if (pusher && currentRoom) {
      const channel = pusher.channel(`room-${currentRoom}`);
      if (channel) {
        channel.bind('player-joined', callback);
      }
    }
  };

  const offPlayerJoined = (callback) => {
    if (pusher && currentRoom) {
      const channel = pusher.channel(`room-${currentRoom}`);
      if (channel) {
        channel.unbind('player-joined', callback);
      }
    }
  };

  const onPlayerLeft = (callback) => {
    if (pusher && currentRoom) {
      const channel = pusher.channel(`room-${currentRoom}`);
      if (channel) {
        channel.bind('player-left', callback);
      }
    }
  };

  const offPlayerLeft = (callback) => {
    if (pusher && currentRoom) {
      const channel = pusher.channel(`room-${currentRoom}`);
      if (channel) {
        channel.unbind('player-left', callback);
      }
    }
  };

  const onRoomStatusChanged = (callback) => {
    if (pusher && currentRoom) {
      const channel = pusher.channel(`room-${currentRoom}`);
      if (channel) {
        channel.bind('room-status-changed', callback);
      }
    }
  };

  const offRoomStatusChanged = (callback) => {
    if (pusher && currentRoom) {
      const channel = pusher.channel(`room-${currentRoom}`);
      if (channel) {
        channel.unbind('room-status-changed', callback);
      }
    }
  };

  const onPlayerWon = (callback) => {
    if (pusher && currentRoom) {
      const channel = pusher.channel(`room-${currentRoom}`);
      if (channel) {
        channel.bind('player-won', callback);
      } else {
        console.log('Channel not found for room:', currentRoom);
      }
    } else {
      console.log('Pusher or currentRoom not available:', { pusher: !!pusher, currentRoom });
    }
  };

  const offPlayerWon = (callback) => {
    if (pusher && currentRoom) {
      const channel = pusher.channel(`room-${currentRoom}`);
      if (channel) {
        channel.unbind('player-won', callback);
      }
    }
  };

  return (
    <SocketContext.Provider
      value={{
        pusher,
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
