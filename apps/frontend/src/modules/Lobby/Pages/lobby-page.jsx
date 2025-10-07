import CardContext from '@/modules/common/contexts/card-context';
import SessionContext from '@/modules/common/contexts/session-context';
import { BoxCard } from '@/modules/home/components/box-card';
import RoomContext from '@/modules/Room/Contexts/room-context';
import SocketContext from '@/modules/common/contexts/socket-context';
import { useAudioContext } from '@/modules/common/contexts/audio-context';
import React from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';

export function LobbyPage() {
  const { session } = useContext(SessionContext);
  const { room, getRoom, updateRoomStatus } = useContext(RoomContext);
  const { id: roomCode } = useParams();
  const { card, leaveRoom } = useContext(CardContext);
  const {
    joinRoom,
    leaveRoom: socketLeaveRoom,
    onPlayerJoined,
    offPlayerJoined,
    onPlayerLeft,
    offPlayerLeft,
    onRoomStatusChanged,
    offRoomStatusChanged,
  } = useContext(SocketContext);
  const cardNumbers = card.gridNumbers;
  const navigate = useNavigate();
  const [copiedPlayer, setCopiedPlayer] = useState(false);
  const [copiedHost, setCopiedHost] = useState(false);

  const handleCopy = async (text, setCopiedFn) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFn(true);
      setTimeout(() => setCopiedFn(false), 1500);
    } catch (error) {
      error.preventDefault();
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        document.execCommand('copy');
        setCopiedFn(true);
        setTimeout(() => setCopiedFn(false), 1500);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  // Audio system (global)
  const { resumeAudioContext } = useAudioContext();

  useEffect(() => {
    getRoom(roomCode);
    joinRoom(roomCode);

    return () => {
      socketLeaveRoom(roomCode);
    };
  }, [roomCode, joinRoom, socketLeaveRoom]);

  // Ensure audio context is resumed after navigation; BGM is started via global controls/user gesture
  useEffect(() => {
    resumeAudioContext();
  }, [resumeAudioContext]);

  useEffect(() => {
    const handlePlayerJoined = (data) => {
      console.log('Player joined lobby:', data);
      if (data.roomCode === roomCode) {
        getRoom(roomCode);
      }
    };

    const handlePlayerLeft = (data) => {
      console.log('Player left lobby:', data);
      if (data.roomCode === roomCode) {
        // Check if this player was removed because host left
        if (data.reason === 'host-left') {
          alert('Host has left the lobby. You have been removed from the room.');
          navigate('/', { replace: true });
        } else {
          getRoom(roomCode);
        }
      }
    };

    const handleRoomStatusChanged = (data) => {
      console.log('Room status changed in lobby:', data);
      if (data.roomCode === roomCode) {
        if (data.status === 'live') {
          navigate(`/room/${roomCode}`, { replace: true });
        } else if (data.status === 'ended') {
          alert('Host has ended the room. You have been removed from the lobby.');
          navigate('/', { replace: true });
        } else {
          getRoom(roomCode);
        }
      }
    };

    onPlayerJoined(handlePlayerJoined);
    onPlayerLeft(handlePlayerLeft);
    onRoomStatusChanged(handleRoomStatusChanged);

    return () => {
      offPlayerJoined(handlePlayerJoined);
      offPlayerLeft(handlePlayerLeft);
      offRoomStatusChanged(handleRoomStatusChanged);
    };
  }, [
    roomCode,
    getRoom,
    navigate,
    onPlayerJoined,
    offPlayerJoined,
    onPlayerLeft,
    offPlayerLeft,
    onRoomStatusChanged,
    offRoomStatusChanged,
  ]);

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
      {session?.isHost === false ? (
        <div className=" max-w-md w-full p-[7px] rounded-xl bg-[#FF4D6D]">
          <div className="bg-[] p-[4px] rounded-xl bg-[#9B17F8]">
            <div className="bg-white shadow-lg rounded-xl p-6">
              {/* Title */}
              <h1 className="text-2xl font-bold text-center mb-4">Hello {session.name}</h1>

              {/* Room Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-gray-700 flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">Room Code:</span>
                  <span className="font-mono bg-white rounded px-2 py-0.5">{room.roomCode}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(room.roomCode, setCopiedPlayer)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                    title={copiedPlayer ? 'Copied!' : 'Copy to clipboard'}
                    aria-label="Copy room code"
                  >
                    {copiedPlayer ? (
                      // check icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-7.5 9.5a.75.75 0 01-1.127.055l-3.5-3.75a.75.75 0 011.082-1.038l2.88 3.085 6.977-8.846a.75.75 0 011.045-.058z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      // copy icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 7.5v-2.25A2.25 2.25 0 0110.5 3h6.75A2.25 2.25 0 0119.5 5.25V12a2.25 2.25 0 01-2.25 2.25H15M5.25 7.5H12A2.25 2.25 0 0114.25 9.75V18A2.25 2.25 0 0112 20.25H5.25A2.25 2.25 0 013 18V9.75A2.25 2.25 0 015.25 7.5z"
                        />
                      </svg>
                    )}
                  </button>
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Mode:</span> {room.mode}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Status:</span> Waiting for players
                </p>
              </div>

              {/* Waiting Indicator (Player) */}
              {(!room?.players || room.players.length < 2 || room?.status !== 'live') && (
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin mb-3"></div>
                  <p className="text-gray-700 font-semibold">Waiting for host/players...</p>
                  <p className="text-gray-500 text-sm">Players joined: {room?.players?.length || 0}</p>
                </div>
              )}

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
                <p className="text-gray-700 flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">Room Code:</span>
                  <span className="font-mono bg-white rounded px-2 py-0.5">{room.code}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(room.code, setCopiedHost)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                    title={copiedHost ? 'Copied!' : 'Copy to clipboard'}
                    aria-label="Copy room code"
                  >
                    {copiedHost ? (
                      // check icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-7.5 9.5a.75.75 0 01-1.127.055l-3.5-3.75a.75.75 0 011.082-1.038l2.88 3.085 6.977-8.846a.75.75 0 011.045-.058z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      // copy icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 7.5v-2.25A2.25 2.25 0 0110.5 3h6.75A2.25 2.25 0 0119.5 5.25V12a2.25 2.25 0 01-2.25 2.25H15M5.25 7.5H12A2.25 2.25 0 0114.25 9.75V18A2.25 2.25 0 0112 20.25H5.25A2.25 2.25 0 013 18V9.75A2.25 2.25 0 015.25 7.5z"
                        />
                      </svg>
                    )}
                  </button>
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Mode:</span> {room.mode}
                </p>
              </div>

              {/* Waiting Indicator (Host) */}
              {(!room?.players || room.players.length < 2 || room?.status !== 'live') && (
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-3"></div>
                  <p className="text-gray-700 font-semibold">Waiting for players to join...</p>
                  <p className="text-gray-500 text-sm">Players joined: {room?.players?.length || 0}</p>
                </div>
              )}

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
