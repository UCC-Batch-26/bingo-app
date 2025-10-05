import { createContext, useState } from 'react';
import { getData, patchData, postData } from '@/services/api';
import { useNavigate } from 'react-router';

const RoomContext = createContext();

export function RoomProvider({ children }) {
  const [room, setRoom] = useState({});
  const [player, setPlayer] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const createRoom = async (mode) => {
    const roomData = await postData('/room', mode);
    setRoom(roomData);
    localStorage.setItem('sessionToken', roomData.data.sessionToken);
    localStorage.setItem('roomCode', roomData.data.code);
    window.dispatchEvent(new CustomEvent('sessionUpdated'));
    navigate(`/lobby/${roomData.data.code}`, { replace: true });
    return true;
  };

  const joinRoom = async (player) => {
    try {
      setError(null);
      const cardData = await postData('/card/lobby', player);
      setPlayer(cardData);
      localStorage.setItem('sessionToken', cardData.data.sessionToken);
      localStorage.setItem('playerId', cardData.data._id);
      window.dispatchEvent(new CustomEvent('sessionUpdated'));
      return true;
    } catch (error) {
      if (error.response?.status === 404 && error.response?.data?.message === 'Room not exist') {
        setError('Room not exist');
      } else {
        setError(error.response?.data?.message || 'Failed to join room');
      }
      return false;
    }
  };

  const getRoom = async (roomCode) => {
    try {
      setError(null);
      const roomData = await getData(`/room/${roomCode}`);
      setRoom(roomData);
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        setError('Room not exist');
      } else {
        setError(error.response?.data?.message || 'Failed to get room');
      }
      return false;
    }
  };

  const updateRoomStatus = async (roomCode, status) => {
    try {
      setError(null);
      const roomData = await patchData(`/room/status/${roomCode}`, { status });
      if (roomData) {
        if (status == 'ended') {
          localStorage.clear();
          window.dispatchEvent(new CustomEvent('sessionUpdated'));
        }
        return true;
      }
      return false;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update room status');
      return false;
    }
  };

  const updateDrawnNumbers = async (roomCode, newNumber) => {
    try {
      setError(null);
      const roomData = await patchData(`/room/${roomCode}`, { drawnNumber: newNumber });
      if (roomData) {
        setRoom(roomData);
        return true;
      }
      return false;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update drawn numbers');
      return false;
    }
  };

  const verifyCard = async (cardId, markedNumbers) => {
    try {
      setError(null);
      const result = await postData('/card/verify', { cardId, markedNumbers });
      return result;
    } catch (error) {
      console.error('Failed to verify card:', error);
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <RoomContext.Provider
      value={{
        room,
        createRoom,
        getRoom,
        joinRoom,
        updateRoomStatus,
        updateDrawnNumbers,
        verifyCard,
        player,
        error,
        clearError,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export default RoomContext;
