import CardContext from '@/modules/common/contexts/card-context';
import SessionContext from '@/modules/common/contexts/session-context';
import { BoxCard } from '@/modules/home/components/box-card';
import RoomContext from '@/modules/Room/Contexts/room-context';
import SocketContext from '@/modules/common/contexts/socket-context';
import { useAudioContext } from '@/modules/common/contexts/use-audio-context';
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
  const isMobile = window.innerWidth < 768;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BoxCard 
              letter="B" 
              bgColor="#6366f1" 
              borderColor="#4f46e5" 
              fontSize={32}
              className="w-12 h-12"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">Bit9o</span>
          </div>
          <div className="text-sm text-slate-400">
            Room: <span className="font-mono text-white">{roomCode}</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Lobby Title */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-2 mb-6">
            <BoxCard letter="L" bgColor="#6366f1" borderColor="#4f46e5" fontSize={isMobile ? 40 : 50} />
            <BoxCard letter="O" bgColor="#ec4899" borderColor="#db2777" fontSize={isMobile ? 40 : 50} />
            <BoxCard letter="B" bgColor="#f59e0b" borderColor="#d97706" fontSize={isMobile ? 40 : 50} />
            <BoxCard letter="B" bgColor="#8b5cf6" borderColor="#7c3aed" fontSize={isMobile ? 40 : 50} />
            <BoxCard letter="Y" bgColor="#10b981" borderColor="#059669" fontSize={isMobile ? 40 : 50} />
          </div>
          <h1 className="text-4xl lg:text-6xl font-black mb-4">
            Game <span className="bg-gradient-to-r from-indigo-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">Lobby</span>
          </h1>
          <p className="text-xl text-slate-300">Get ready to play Bit9o with your friends!</p>
        </div>
        {/* Player View */}
        {session?.isHost === false ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              {/* Welcome Message */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Welcome, <span className="bg-gradient-to-r from-indigo-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">{session.name}</span>! 🎮
                </h2>
                <p className="text-slate-600">Get ready for an exciting game of Bit9o!</p>
              </div>

              {/* Room Info Card */}
              <div className="bg-gradient-to-r from-indigo-50 to-pink-50 border border-indigo-200 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Room Information</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">Connected</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Room Code:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-slate-800 text-white border border-slate-600 rounded px-3 py-1 text-lg font-bold">{room.roomCode}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(room.roomCode, setCopiedPlayer)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
                        title={copiedPlayer ? 'Copied!' : 'Copy to clipboard'}
                        aria-label="Copy room code"
                      >
                        {copiedPlayer ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-7.5 9.5a.75.75 0 01-1.127.055l-3.5-3.75a.75.75 0 011.082-1.038l2.88 3.085 6.977-8.846a.75.75 0 011.045-.058z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5v-2.25A2.25 2.25 0 0110.5 3h6.75A2.25 2.25 0 0119.5 5.25V12a2.25 2.25 0 01-2.25 2.25H15M5.25 7.5H12A2.25 2.25 0 0114.25 9.75V18A2.25 2.25 0 0112 20.25H5.25A2.25 2.25 0 013 18V9.75A2.25 2.25 0 015.25 7.5z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Game Mode:</span>
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium capitalize">{room.mode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Status:</span>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">Waiting for players</span>
                  </div>
                </div>
              </div>

              {/* Your Bingo Card Preview */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">Your Bit9o Card</h3>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl p-6">
                  <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                    {cardNumbers.map((cardNumber) => (
                      <div key={cardNumber} className="bg-white border-2 border-slate-300 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                        <span className="text-xl font-bold text-slate-700">{cardNumber}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Waiting Status */}
              {(!room?.players || room.players.length < 2 || room?.status !== 'live') && (
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-6 py-4">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <div>
                      <p className="text-blue-800 font-semibold">Waiting for the game to start...</p>
                      <p className="text-blue-600 text-sm">Players joined: {room?.players?.length || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-center">
                <button
                  onClick={(e) => {
                    if (confirm('Are you sure you want to leave the lobby?')) {
                      handleLeavePlayer(e);
                    }
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 px-8 rounded-xl font-semibold transition-all duration-200"
                >
                  🚪 Leave Lobby
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Host Lobby */
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Room Info & Players */}
              <div className="space-y-6">
                {/* Room Info Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">🎮 Host Control Panel</h2>
                    <p className="text-slate-600">Manage your Bit9o game room</p>
                  </div>

                  {/* Room Details */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">Room Details</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-600 font-medium">Active</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 font-medium">Room Code:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-slate-800 text-white border border-slate-600 rounded px-3 py-1 text-lg font-bold">{room.code}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(room.code, setCopiedHost)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-colors"
                            title={copiedHost ? 'Copied!' : 'Copy to clipboard'}
                            aria-label="Copy room code"
                          >
                            {copiedHost ? (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-7.5 9.5a.75.75 0 01-1.127.055l-3.5-3.75a.75.75 0 011.082-1.038l2.88 3.085 6.977-8.846a.75.75 0 011.045-.058z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5v-2.25A2.25 2.25 0 0110.5 3h6.75A2.25 2.25 0 0119.5 5.25V12a2.25 2.25 0 01-2.25 2.25H15M5.25 7.5H12A2.25 2.25 0 0114.25 9.75V18A2.25 2.25 0 0112 20.25H5.25A2.25 2.25 0 013 18V9.75A2.25 2.25 0 015.25 7.5z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 font-medium">Game Mode:</span>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium capitalize">{room.mode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Players List */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Players ({room?.players?.length || 0})</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {room?.players?.length > 0 ? (
                        room.players.map((player, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {player.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-slate-700">{player.name}</span>
                            </div>
                            {player.isHost && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Host</span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-500">
                          <div className="text-4xl mb-2">👥</div>
                          <p>No players joined yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Game Controls */}
              <div className="space-y-6">
                {/* Room Status */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready to Start</h3>
                  <p className="text-slate-600 mb-4">Share the room code with your friends!</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-blue-800 font-medium">Players joined: {room?.players?.length || 0}</p>
                    <p className="text-blue-600 text-sm">You can start the game anytime!</p>
                  </div>
                </div>

                {/* Game Actions */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <h3 className="text-xl font-semibold text-slate-900 mb-6 text-center">Game Controls</h3>
                  
                  <div className="space-y-4">
                    <button
                      onClick={handleStartGame}
                      className="w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 transform bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:scale-105 shadow-lg"
                    >
                      🚀 Start Game!
                    </button>
                    
                    <button
                      onClick={(e) => {
                        if (confirm('Are you sure you want to end the lobby and kick all players?')) {
                          handleLeaveHost(e);
                        }
                      }}
                      className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-4 px-6 rounded-xl font-semibold transition-all duration-200"
                    >
                      🚪 End Lobby
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
