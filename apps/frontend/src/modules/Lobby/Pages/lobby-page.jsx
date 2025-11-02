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
    <div className="min-h-screen relative overflow-hidden" style={{backgroundColor: '#FEFBF3'}}>
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{opacity: 0.4}}>
        {/* Large geometric shapes - squares and rectangles */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-black bg-purple-gaming rotate-45"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-black bg-coral"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 border border-black bg-blue-gaming rotate-12"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 border border-black bg-purple-gaming"></div>
        <div className="absolute top-64 left-96 w-20 h-20 border border-black bg-coral-light"></div>
        <div className="absolute bottom-64 right-96 w-24 h-24 border border-black bg-blue-gaming-light rotate-45"></div>
        
        {/* Circles and arcs */}
        <div className="absolute top-20 right-32 w-24 h-24 border border-black bg-coral rounded-full"></div>
        <div className="absolute bottom-32 left-64 w-32 h-32 border border-black bg-blue-gaming rounded-full opacity-80"></div>
        <div className="absolute top-48 left-1/4 w-28 h-28 border border-black border-r-0 border-b-0 bg-purple-gaming rounded-tl-full"></div>
        <div className="absolute bottom-48 right-1/4 w-24 h-24 border border-black border-l-0 border-t-0 bg-coral rounded-br-full"></div>
        
        {/* Small dots in groups */}
        <div className="absolute top-32 left-24 flex gap-1">
          <div className="w-2 h-2 bg-coral border border-black rounded-full"></div>
          <div className="w-2 h-2 bg-blue-gaming border border-black rounded-full"></div>
          <div className="w-2 h-2 bg-purple-gaming border border-black rounded-full"></div>
        </div>
        <div className="absolute bottom-40 left-24 flex gap-1">
          <div className="w-3 h-3 bg-purple-gaming border border-black rounded-full"></div>
          <div className="w-3 h-3 bg-coral border border-black rounded-full"></div>
        </div>
        <div className="absolute top-1/2 left-1/4 flex gap-1">
          <div className="w-2 h-2 bg-blue-gaming border border-black rounded-full"></div>
          <div className="w-2 h-2 bg-coral border border-black rounded-full"></div>
          <div className="w-2 h-2 bg-purple-gaming border border-black rounded-full"></div>
          <div className="w-2 h-2 bg-coral border border-black rounded-full"></div>
        </div>
        <div className="absolute top-1/3 right-1/3 flex gap-1">
          <div className="w-3 h-3 bg-purple-gaming border border-black rounded-full"></div>
          <div className="w-3 h-3 bg-blue-gaming border border-black rounded-full"></div>
        </div>
        
        {/* Grid patterns - outlined rectangles */}
        <div className="absolute top-24 right-16 border border-black p-2">
          <div className="grid grid-cols-2 gap-1">
            <div className="w-4 h-4 border border-black bg-coral"></div>
            <div className="w-4 h-4 border border-black"></div>
            <div className="w-4 h-4 border border-black"></div>
            <div className="w-4 h-4 border border-black bg-blue-gaming"></div>
          </div>
        </div>
        <div className="absolute bottom-24 left-16 border border-black p-2">
          <div className="grid grid-cols-2 gap-1">
            <div className="w-4 h-4 border border-black bg-purple-gaming"></div>
            <div className="w-4 h-4 border border-black"></div>
            <div className="w-4 h-4 border border-black bg-coral"></div>
            <div className="w-4 h-4 border border-black"></div>
          </div>
        </div>
        
        {/* Symbols - Plus, X, Speech bubble */}
        <div className="absolute top-56 right-1/3 w-6 h-6 border border-black bg-blue-gaming flex items-center justify-center text-black font-bold text-sm">+</div>
        <div className="absolute bottom-56 left-1/3 w-6 h-6 border border-black bg-coral flex items-center justify-center text-black font-bold text-sm">×</div>
        <div className="absolute top-40 left-1/2 border border-black bg-white rounded-lg p-1">
          <div className="flex gap-0.5">
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
          </div>
        </div>
        
        {/* Half-filled shapes */}
        <div className="absolute top-64 left-40 w-16 h-16 border border-black relative overflow-hidden">
          <div className="absolute inset-0 bg-coral" style={{width: '50%'}}></div>
          <div className="absolute inset-0 bg-blue-gaming right-0" style={{width: '50%', left: '50%'}}></div>
        </div>
        <div className="absolute bottom-64 right-40 w-16 h-16 border border-black relative overflow-hidden">
          <div className="absolute inset-0 bg-purple-gaming" style={{width: '50%'}}></div>
          <div className="absolute inset-0 bg-coral right-0" style={{width: '50%', left: '50%'}}></div>
        </div>
        
        {/* Wavy lines */}
        <div className="absolute top-80 left-20 w-32 h-1 border-t border-b border-black bg-purple-gaming opacity-50" style={{clipPath: 'polygon(0% 50%, 25% 0%, 50% 50%, 75% 100%, 100% 50%)'}}></div>
        <div className="absolute bottom-80 right-20 w-32 h-1 border-t border-b border-black bg-blue-gaming opacity-50" style={{clipPath: 'polygon(0% 50%, 25% 100%, 50% 50%, 75% 0%, 100% 50%)'}}></div>
        
        {/* Diamond shape with 3D effect */}
        <div className="absolute top-72 right-20 w-8 h-20 border border-black bg-purple-gaming transform rotate-12 relative" style={{clipPath: 'polygon(50% 0%, 100% 25%, 50% 100%, 0% 25%)'}}>
          <div className="absolute inset-0 bg-blue-gaming opacity-50" style={{clipPath: 'polygon(50% 10%, 90% 30%, 50% 90%, 10% 30%)'}}></div>
        </div>
        
        {/* Outlined circles and squares */}
        <div className="absolute top-64 left-1/2 w-16 h-16 border border-black rounded-full"></div>
        <div className="absolute bottom-64 right-1/2 w-14 h-14 border border-black rounded-full"></div>
        <div className="absolute top-48 right-64 w-12 h-12 border border-black"></div>
        <div className="absolute bottom-48 left-64 w-14 h-14 border border-black rotate-45"></div>
      </div>
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BoxCard 
              letter="B" 
              bgColor="#7C3AED" 
              borderColor="#000" 
              fontSize={32}
              className="w-12 h-12"
            />
            <span className="text-2xl font-black text-black">Bit9o</span>
          </div>
          <div className="text-sm text-black bg-white border border-black rounded-lg px-4 py-2.5">
            Room: <span className="font-mono font-bold text-black">{roomCode}</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Lobby Title */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-2 mb-6">
            <BoxCard letter="L" bgColor="#7C3AED" borderColor="#000" fontSize={isMobile ? 40 : 50} />
            <BoxCard letter="O" bgColor="#FF6B5E" borderColor="#000" fontSize={isMobile ? 40 : 50} />
            <BoxCard letter="B" bgColor="#60B5E8" borderColor="#000" fontSize={isMobile ? 40 : 50} />
            <BoxCard letter="B" bgColor="#7C3AED" borderColor="#000" fontSize={isMobile ? 40 : 50} />
            <BoxCard letter="Y" bgColor="#FF6B5E" borderColor="#000" fontSize={isMobile ? 40 : 50} />
          </div>
          <h1 className="text-4xl lg:text-6xl font-black mb-4 text-black">
            Game <span className="text-black">Lobby</span>
          </h1>
          <p className="text-xl text-black">Get ready to play Bit9o with your friends! 🎮</p>
        </div>
        {/* Player View */}
        {session?.isHost === false ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-black rounded-lg p-8 relative">
              {/* Welcome Message */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-black mb-2">
                  Welcome, <span className="text-black">{session.name}</span>! 🎮
                </h2>
                <p className="text-black text-lg">Get ready for an exciting game of Bit9o!</p>
              </div>

              {/* Room Info Card */}
              <div className="bg-white border border-black rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-black">Room Information</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-gaming border border-black rounded-full animate-pulse"></div>
                    <span className="text-sm text-black font-bold">Connected</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-black font-bold">Room Code:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-purple-gaming text-white border border-black rounded-lg px-4 py-2 text-lg font-bold">{room.roomCode}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(room.roomCode, setCopiedPlayer)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-gaming hover:bg-blue-gaming-light border border-black text-black transition-all btn-playful"
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
                      <span className="text-black font-bold">Game Mode:</span>
                      <span className="bg-coral text-black border border-black px-4 py-1.5 rounded-lg text-sm font-bold capitalize">{room.mode}</span>
                    </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black font-bold">Status:</span>
                    <span className="bg-blue-gaming text-black border border-black px-4 py-1.5 rounded-lg text-sm font-bold">Waiting for players</span>
                  </div>
                </div>
              </div>

              {/* Your Bingo Card Preview */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-black mb-4 text-center">Your Bit9o Card</h3>
                <div className="bg-white border border-black rounded-lg p-6">
                  <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                    {cardNumbers.map((cardNumber) => (
                      <div key={cardNumber} className="bg-white border border-black rounded-lg p-4 text-center hover:shadow-md transition-all btn-playful">
                        <span className="text-xl font-bold text-black">{cardNumber}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Waiting Status */}
              {(!room?.players || room.players.length < 2 || room?.status !== 'live') && (
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 bg-white border border-black rounded-lg px-6 py-4">
                    <div className="w-6 h-6 border-2 border-purple-gaming border-t-transparent rounded-full animate-spin"></div>
                    <div>
                      <p className="text-black font-bold">Waiting for the game to start...</p>
                      <p className="text-black text-sm">Players joined: {room?.players?.length || 0}</p>
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
                  className="bg-coral hover:bg-coral-light text-black py-4 px-8 rounded-lg font-bold transition-all duration-300 btn-playful border border-black"
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
                <div className="bg-white border border-black rounded-lg p-8 relative">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-black mb-2">🎮 Host Control Panel</h2>
                    <p className="text-black text-lg">Manage your Bit9o game room</p>
                  </div>

                  {/* Room Details */}
                  <div className="bg-white border border-black rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-black">Room Details</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-gaming border border-black rounded-full animate-pulse"></div>
                        <span className="text-sm text-black font-bold">Active</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-black font-bold">Room Code:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-purple-gaming text-white border border-black rounded-lg px-4 py-2 text-lg font-bold">{room.code}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(room.code, setCopiedHost)}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-gaming hover:bg-blue-gaming-light border border-black text-black transition-all btn-playful"
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
                        <span className="text-black font-bold">Game Mode:</span>
                        <span className="bg-coral text-black border border-black px-4 py-1.5 rounded-lg text-sm font-bold capitalize">{room.mode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Players List */}
                  <div>
                    <h3 className="text-lg font-bold text-black mb-4">Players ({room?.players?.length || 0})</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {room?.players?.length > 0 ? (
                        room.players.map((player, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-white border border-black rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-gaming border border-black rounded-full flex items-center justify-center text-white font-bold text-sm transform hover:scale-110 transition-transform">
                                {player.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-bold text-black">{player.name}</span>
                            </div>
                            {player.isHost && (
                              <span className="bg-coral text-black border border-black px-3 py-1 rounded-lg text-xs font-bold">👑 Host</span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-black">
                          <div className="text-4xl mb-2">👥</div>
                          <p className="font-bold">No players joined yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Game Controls */}
              <div className="space-y-6">
                {/* Room Status */}
                <div className="bg-white border border-black rounded-lg p-8 text-center relative">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-purple-gaming border-t-transparent animate-spin"></div>
                  <h3 className="text-xl font-bold text-black mb-2">Ready to Start</h3>
                  <p className="text-black mb-4 text-lg">Share the room code with your friends!</p>
                  <div className="bg-white border border-black rounded-lg p-4">
                    <p className="text-black font-bold">Players joined: {room?.players?.length || 0}</p>
                    <p className="text-black text-sm">You can start the game anytime!</p>
                  </div>
                </div>

                {/* Game Actions */}
                <div className="bg-white border border-black rounded-lg p-8 relative">
                  <h3 className="text-xl font-bold text-black mb-6 text-center">Game Controls</h3>
                  
                  <div className="space-y-4">
                    <button
                      onClick={handleStartGame}
                      className="w-full py-5 px-6 rounded-lg font-bold text-lg transition-all duration-300 transform bg-purple-gaming hover:bg-purple-gaming-dark text-white hover:scale-105 btn-playful border border-black animate-pulse-glow"
                    >
                      🚀 Start Game!
                    </button>
                    
                    <button
                      onClick={(e) => {
                        if (confirm('Are you sure you want to end the lobby and kick all players?')) {
                          handleLeaveHost(e);
                        }
                      }}
                      className="w-full bg-coral hover:bg-coral-light text-black py-4 px-6 rounded-lg font-bold transition-all duration-300 btn-playful border border-black"
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
