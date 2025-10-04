import { createContext, useState } from 'react';
import { getData, patchData, postData } from '@/services/api';
import { useNavigate } from 'react-router';

const RoomContext = createContext();

export function RoomProvider({ children }) {
  const [room, setRoom] = useState({});
  const [player, setPlayer] = useState({});
  const navigate = useNavigate();
  const createRoom = async (mode) => {
    const roomData = await postData('/room', mode);
    setRoom(roomData);
    localStorage.setItem('sessionToken', roomData.data.sessionToken);
    localStorage.setItem('roomCode', roomData.data.code);
    navigate(`/lobby/${roomData.data.code}`, { replace: true });
    return true;
  };

  const joinRoom = async (player) => {
    const cardData = await postData('/card/lobby', player);
    setPlayer(cardData);
    localStorage.setItem('sessionToken', cardData.data.sessionToken);
    localStorage.setItem('playerId', cardData.data._id);
    return true;
  };

  const getRoom = async (roomCode) => {
    const roomData = await getData(`/room/${roomCode}`);
    setRoom(roomData);
    return true;
  };

  const updateRoomStatus = async (roomCode, status) => {
    const roomData = await patchData(`/room/status/${roomCode}`, { status });
    if (roomData) {
      if (status == 'ended') {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('sessionToken');
      }
      return true;
    }
  };

  return (
    <RoomContext.Provider value={{ room, createRoom, getRoom, joinRoom, updateRoomStatus, player }}>
      {children}
    </RoomContext.Provider>
  );
}

export default RoomContext;
