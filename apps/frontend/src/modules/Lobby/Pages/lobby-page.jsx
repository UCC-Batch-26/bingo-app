import CardContext from '@/modules/common/contexts/card-context';
import SessionContext from '@/modules/common/contexts/session-context';
import { BoxCard } from '@/modules/home/components/box-card';
import RoomContext from '@/modules/Room/Contexts/room-context';
import SocketContext from '@/modules/common/contexts/socket-context';
import BGMContext from '@/modules/common/contexts/bgm-context';
import React from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';

export function LobbyPage() {
  const { session } = useContext(SessionContext);
  const { room, getRoom, updateRoomStatus } = useContext(RoomContext);
  const { id: roomCode } = useParams();
  const { card, leaveRoom } = useContext(CardContext);
  const { isBgmPlaying, toggleBGM } = useContext(BGMContext);
  const {
    joinRoom,
    leaveRoom: socketLeaveRoom,
    onPlayerJoined,
    offPlayerJoined,
    onRoomStatusChanged,
    offRoomStatusChanged,
  } = useContext(SocketContext);
  const cardNumbers = card.gridNumbers;
  const navigate = useNavigate();

  useEffect(() => {
    getRoom(roomCode);
    joinRoom(roomCode);

    return () => {
      socketLeaveRoom(roomCode);
    };
  }, [roomCode, joinRoom, socketLeaveRoom]);

  useEffect(() => {
    const handlePlayerJoined = (data) => {
      console.log('Player joined lobby:', data);
      if (data.roomCode === roomCode) {
        getRoom(roomCode);
      }
    };

    const handleRoomStatusChanged = (data) => {
      console.log('Room status changed in lobby:', data);
      if (data.roomCode === roomCode) {
        if (data.status === 'live') {
          navigate(`/room/${roomCode}`, { replace: true });
        } else {
          getRoom(roomCode);
        }
      }
    };

    onPlayerJoined(handlePlayerJoined);
    onRoomStatusChanged(handleRoomStatusChanged);

    return () => {
      offPlayerJoined(handlePlayerJoined);
      offRoomStatusChanged(handleRoomStatusChanged);
    };
  }, [roomCode, getRoom, navigate, onPlayerJoined, offPlayerJoined, onRoomStatusChanged, offRoomStatusChanged]);

  const handleLeaveHost = async (e) => {
    e.preventDefault();
    const updatedRoom = await updateRoomStatus(room.code, 'ended');
    if (updatedRoom) {
      navigate(`/`, { replace: true });
    }
  };

  const handleLeavePlayer = async (e) => {
    e.preventDefault();
    const leave = await leaveRoom(card._id);
    if (leave) {
      navigate(`/`, { replace: true });
    }
  };

  const handleStartGame = async (e) => {
    e.preventDefault();
    const updatedRoom = await updateRoomStatus(room.code, 'live');
    if (updatedRoom) {
      navigate(`/room/${room.code}`, { replace: true });
    }
  };

  return (
    <div className="w-[auto] min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full flex-center">
        <div className="w-[95%] h-[70px] flex-center text-white">
          <BoxCard letter="L" bgColor="#32BAEC" borderColor="#0C6795" fontSize={50} />
          <BoxCard letter="O" bgColor="#F37213" borderColor="#D82C23" fontSize={50} />
          <BoxCard letter="B" bgColor="#FFD93D" borderColor="#BC7E06" fontSize={50} />
          <BoxCard letter="B" bgColor="#C6B29B" borderColor="#7D6450" fontSize={50} />
          <BoxCard letter="Y" bgColor="#6BCB77" borderColor="#2C7A25" fontSize={50} />
        </div>
      </div>

      {/* BGM Toggle Button */}
      <div className="mb-4">
        <button
          onClick={toggleBGM}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
            isBgmPlaying ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white'
          }`}
        >
          {isBgmPlaying ? '🔊 BGM' : '🔇 BGM'}
        </button>
      </div>
      {session?.isHost === false ? (
        <div className=" max-w-md w-full p-[7px] rounded-xl bg-[#FF4D6D]">
          <div className="bg-[] p-[4px] rounded-xl bg-[#9B17F8]">
            <div className="bg-white shadow-lg rounded-xl p-6">
              {/* Title */}
              <h1 className="text-2xl font-bold text-center mb-4">Hello {session.name}</h1>

              {/* Room Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-gray-700">
                  <span className="font-semibold">Room Code:</span> {room.roomCode}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Mode:</span> {room.mode}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Status:</span> Waiting for players
                </p>
              </div>

              {/* Player Cards */}
              <div className="size flex-center mb-6">
                <div className="w-[80%] h-[260px] grid grid-cols-3 grid-rows-3 gap-2 p-[20px] bg-gray-200 rounded-[10px]">
                  {cardNumbers.map((cardNumber) => (
                    <div className=" bg-gray-500 flex-center" key={cardNumber}>
                      <span className="font-[700] text-white text-[20px]">{cardNumber}</span>
                    </div>
                  ))}
                </div>
              </div>

              <h1 className="text-2xl font-bold text-center mb-4">Other Player</h1>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button className="w-full bg-[#FF4D6D] hover:bg-[#9B17F8] text-white py-2 rounded-lg font-semibold transition">
                  Get Card
                </button>
                <button
                  onClick={(e) => {
                    if (confirm('Are you sure?')) {
                      handleLeavePlayer(e);
                    }
                  }}
                  className="w-full bg-gray-200 hover:bg-[#9B17F8] text-gray-800 hover:text-white py-2 rounded-lg font-semibold transition"
                >
                  Leave Lobby
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Host Lobby
        <div className=" max-w-md w-full p-[7px] rounded-xl bg-[#FF4D6D]">
          <div className="bg-[] p-[4px] rounded-xl bg-[#9B17F8]">
            <div className="bg-white shadow-lg rounded-xl p-6">
              {/* Title */}
              <h1 className="text-2xl font-bold text-center mb-4">Game Lobby</h1>

              {/* Room Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-gray-700">
                  <span className="font-semibold">Room Code:</span> {room.code}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Mode:</span> {room.mode}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Status:</span> Waiting for players
                </p>
              </div>

              {/* Players List */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Players</h2>
                <ul className="space-y-2">
                  {room?.players?.map((player, index) => (
                    <li key={index} className="flex justify-between p-2 bg-gray-100 rounded-md">
                      <span>{player.name}</span>
                      {player.isHost && <span className="text-sm text-blue-500">Host</span>}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleStartGame}
                  className="w-full bg-[#FF4D6D] hover:bg-[#9B17F8] text-white py-2 rounded-lg font-semibold transition"
                >
                  Start Game
                </button>
                <button
                  onClick={(e) => {
                    if (confirm('Are you sure?')) {
                      handleLeaveHost(e);
                    }
                  }}
                  className="w-full bg-gray-200 hover:bg-[#9B17F8] text-gray-800 hover:text-white py-2 rounded-lg font-semibold transition"
                >
                  Leave Lobby
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
