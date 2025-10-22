import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import RoomContext from '@/modules/Room/Contexts/room-context';
import CardContext from '@/modules/common/contexts/card-context';
import SessionContext from '@/modules/common/contexts/session-context';
import SocketContext from '@/modules/common/contexts/socket-context';
import { BoxCard } from '@/modules/home/components/box-card';
import { AudioControls } from '@/modules/common/components/audio-controls';
import { useAudioContext } from '@/modules/common/contexts/use-audio-context';

export function RoomPage() {
  const { room, getRoom, updateRoomStatus, updateDrawnNumbers, verifyCard } = useContext(RoomContext);
  const { card, leaveRoom } = useContext(CardContext);
  const { session } = useContext(SessionContext);
  const {
    joinRoom,
    leaveRoom: socketLeaveRoom,
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
  } = useContext(SocketContext);
  const { id: roomCode } = useParams();
  const navigate = useNavigate();

  // Audio system
  const { playBallDraw, playVictory, resumeAudioContext } = useAudioContext();

  // When room becomes active, only resume audio context; BGM start is driven by user gesture via AudioControls
  useEffect(() => {
    if (room?.status === 'active' || room?.status === 'started') {
      resumeAudioContext();
    }
  }, [room?.status, resumeAudioContext]);

  useEffect(() => {
    if (roomCode) {
      getRoom(roomCode);
      joinRoom(roomCode);
    }

    return () => {
      if (roomCode) {
        socketLeaveRoom(roomCode);
      }
    };
  }, [roomCode, joinRoom, socketLeaveRoom]);

  useEffect(() => {
    const handleNumberDrawn = (data) => {
      if (data.roomCode === roomCode) {
        getRoom(roomCode);
        // Play ball draw sound effect
        playBallDraw();
      }
    };

    const handlePlayerJoined = (data) => {
      if (data.roomCode === roomCode) {
        getRoom(roomCode);
      }
    };

    const handlePlayerLeft = (data) => {
      if (data.roomCode === roomCode) {
        if (data.reason === 'host-left') {
          alert('Host has left the room. You have been removed from the game.');
          navigate('/', { replace: true });
        } else {
          getRoom(roomCode);
        }
      }
    };

    const handleRoomStatusChanged = (data) => {
      if (data.roomCode === roomCode) {
        getRoom(roomCode);
        if (data.status === 'ended') {
          alert('Host has ended the room. You have been removed from the game.');
          navigate('/', { replace: true });
        }
      }
    };

    const handlePlayerWon = (data) => {
      if (data.roomCode === roomCode) {
        setWinNotification({
          playerName: data.playerName || 'Unknown Player',
          winType: data.winType || 'BIT9O',
          isWinner: data.playerId === card?._id, // Check if this is the current player
        });
        setIsBit9o(true);
        // Play victory sound effect
        playVictory();
      } else {
        console.log('Player won event for different room:', data.roomCode, 'current room:', roomCode);
      }
    };

    onNumberDrawn(handleNumberDrawn);
    onPlayerJoined(handlePlayerJoined);
    onPlayerLeft(handlePlayerLeft);
    onRoomStatusChanged(handleRoomStatusChanged);
    onPlayerWon(handlePlayerWon);

    return () => {
      offNumberDrawn(handleNumberDrawn);
      offPlayerJoined(handlePlayerJoined);
      offPlayerLeft(handlePlayerLeft);
      offRoomStatusChanged(handleRoomStatusChanged);
      offPlayerWon(handlePlayerWon);
    };
  }, [
    roomCode,
    getRoom,
    navigate,
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
    playBallDraw,
    playVictory,
  ]);

  const players = room?.players || [];
  const calledNumbers = room?.drawnNumber || [];
  const currentNumber = calledNumbers[calledNumbers.length - 1] || null;
  const [markedNumbers, setMarkedNumbers] = useState([]);
  const [isBit9o, setIsBit9o] = useState(false);
  const [winNotification, setWinNotification] = useState(null);
  const [newDrawnNumber, setNewDrawnNumber] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [verificationError, setVerificationError] = useState(null);

  const handleExitRoom = async () => {
    if (confirm('Are you sure you want to exit the room?')) {
      if (session?.isHost) {
        await updateRoomStatus(room.code, 'ended');
        localStorage.clear();
      } else {
        if (card?._id) {
          await leaveRoom(card._id);
        }
      }
      navigate('/', { replace: true });
    }
  };

  const handleDrawNumber = async () => {
    if (!session?.isHost) {
      alert('Only the host can draw numbers!');
      return;
    }

    if (calledNumbers.length >= 30) {
      alert('All 30 numbers have been drawn! Game is over.');
      return;
    }

    setIsDrawing(true);

    // Animation sequence: show random numbers before revealing the actual number
    const animationNumbers = [];
    for (let i = 0; i < 5; i++) {
      animationNumbers.push(Math.floor(Math.random() * 30) + 1);
    }

    for (let i = 0; i < animationNumbers.length; i++) {
      setNewDrawnNumber(animationNumbers[i]);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    let newNumber;
    do {
      newNumber = Math.floor(Math.random() * 30) + 1;
    } while (calledNumbers.includes(newNumber));

    setNewDrawnNumber(newNumber);
    await new Promise((resolve) => setTimeout(resolve, 200));

    await updateDrawnNumbers(room.code, newNumber);

    setIsDrawing(false);
    setNewDrawnNumber(null);
  };

  const handleMarkNumber = (number) => {
    if (markedNumbers.includes(number)) {
      setMarkedNumbers((prev) => prev.filter((n) => n !== number));
    } else {
      setMarkedNumbers((prev) => [...prev, number]);
    }
  };

  const handleVerifyCard = async () => {
    if (!card?._id) {
      alert('No card found to verify');
      return;
    }

    if (markedNumbers.length === 0) {
      alert('Please mark some numbers before verifying');
      return;
    }

    if (markedNumbers.length !== 9) {
      alert(`You need to mark all 9 numbers on your card. Currently marked: ${markedNumbers.length}/9`);
      return;
    }

    try {
      const result = await verifyCard(card._id, markedNumbers);

      if (result && result.data && result.data.isWin) {
        setWinNotification({
          playerName: card?.name || 'You',
          winType: 'BIT9O',
          isWinner: true,
        });
        setIsBit9o(true);
      } else {
        setVerificationError({
          message: 'Not Win Yet',
          details: 'Please check your marked numbers and try again.',
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationError({
        message: 'Failed to verify card',
        details: 'Please try again.',
      });
    }
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900 text-white relative overflow-hidden">
      {/* Anime Background Effects */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-36 h-36 bg-indigo-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-cyan-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-rose-500 rounded-full blur-2xl animate-ping"></div>
      </div>

      {/* Anime Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Sparkles */}
        <div className="absolute top-16 left-12 text-4xl opacity-60 animate-bounce" style={{animationDelay: '2s'}}>✨</div>
        <div className="absolute top-24 right-16 text-3xl opacity-70 animate-bounce" style={{animationDelay: '3s'}}>⭐</div>
        <div className="absolute bottom-32 left-20 text-5xl opacity-50 animate-bounce" style={{animationDelay: '1s'}}>💫</div>
        <div className="absolute bottom-20 right-12 text-4xl opacity-60 animate-bounce" style={{animationDelay: '4s'}}>🌟</div>
        
        {/* Anime Characters */}
        <div className="absolute top-32 left-1/4 text-3xl opacity-70 animate-bounce" style={{animationDelay: '5s'}}>🌸</div>
        <div className="absolute bottom-40 right-1/4 text-2xl opacity-60 animate-bounce" style={{animationDelay: '6s'}}>🎀</div>
        <div className="absolute top-1/2 right-8 text-2xl opacity-50 animate-bounce" style={{animationDelay: '7s'}}>💖</div>
        <div className="absolute top-1/3 left-1/3 text-2xl opacity-60 animate-bounce" style={{animationDelay: '8s'}}>🎭</div>
        
        {/* Floating Hearts */}
        <div className="absolute top-20 left-1/2 text-2xl opacity-40 animate-ping" style={{animationDelay: '9s'}}>💕</div>
        <div className="absolute bottom-1/3 right-1/3 text-2xl opacity-50 animate-ping" style={{animationDelay: '10s'}}>💗</div>
      </div>

      {/* Anime Game Header */}
      <div className="relative z-10 bg-gradient-to-r from-pink-600/40 via-purple-600/40 to-indigo-600/40 backdrop-blur-md border-b-2 border-pink-400/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BoxCard 
                  letter="B" 
                  bgColor="#ec4899" 
                  borderColor="#db2777" 
                  fontSize={28}
                  className="w-10 h-10"
                />
                <BoxCard 
                  letter="I" 
                  bgColor="#8b5cf6" 
                  borderColor="#7c3aed" 
                  fontSize={28}
                  className="w-10 h-10"
                />
                <BoxCard 
                  letter="T" 
                  bgColor="#06b6d4" 
                  borderColor="#0891b2" 
                  fontSize={28}
                  className="w-10 h-10"
                />
                <BoxCard 
                  letter="9" 
                  bgColor="#f59e0b" 
                  borderColor="#d97706" 
                  fontSize={28}
                  className="w-10 h-10"
                />
                <BoxCard 
                  letter="O" 
                  bgColor="#ef4444" 
                  borderColor="#dc2626" 
                  fontSize={28}
                  className="w-10 h-10"
                />
              </div>
              <div className="h-8 w-px bg-pink-400/50"></div>
              <span className="text-xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
                ✨ ANIME BINGO ✨
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="bg-pink-800/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-pink-400/30">
                <div className="text-xs text-pink-300 uppercase tracking-wider">Room Code</div>
                <div className="text-lg font-mono font-bold text-pink-100">{roomCode}</div>
              </div>
              <AudioControls />
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Winner Banner - Shows at top for all players */}
        {winNotification && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 border-b-4 border-yellow-600 shadow-2xl animate-bounce">
            <div className="text-center py-6 px-4 relative">
              <button
                onClick={() => setWinNotification(null)}
                className="absolute top-3 right-6 text-gray-700 hover:text-gray-900 text-3xl font-bold transition-colors"
                title="Close notification"
              >
                ×
              </button>
              <div className="text-3xl sm:text-5xl font-black text-red-600 mb-3 animate-pulse">🎉 WINNER ANNOUNCEMENT! 🎉</div>
              <div className="text-xl sm:text-3xl font-bold text-gray-800">
                {winNotification.isWinner ? (
                  <span className="text-green-600 animate-pulse">Congratulations! You won {winNotification.winType}!</span>
                ) : (
                  <span className="text-blue-600">
                    {winNotification.playerName} won {winNotification.winType}!
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Player Game Interface */}
        {!session?.isHost && card && (
          <div className="relative z-10">
            {/* Anime Status Bar */}
            <div className="bg-gradient-to-r from-pink-600/40 via-purple-600/40 to-indigo-600/40 backdrop-blur-md rounded-2xl p-4 mb-6 border-2 border-pink-400/50 shadow-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-pink-500 w-4 h-4 rounded-full animate-pulse shadow-lg shadow-pink-500/50"></div>
                  <span className="text-white font-bold text-lg flex items-center gap-2">
                    ✨ Connected to Anime Game
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center bg-purple-500/20 rounded-xl p-3 border border-purple-400/30">
                    <div className="text-2xl font-black text-purple-400">{calledNumbers.length}</div>
                    <div className="text-xs text-purple-300 uppercase font-bold">Numbers Called</div>
                  </div>
                  <div className="text-center bg-cyan-500/20 rounded-xl p-3 border border-cyan-400/30">
                    <div className="text-2xl font-black text-cyan-400">{markedNumbers.length}</div>
                    <div className="text-xs text-cyan-300 uppercase font-bold">Marked</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Main Game Area - Card */}
              <div className="lg:col-span-3">
                {/* Anime Card Container */}
                <div className="bg-gradient-to-br from-pink-900/30 via-purple-900/30 to-indigo-900/30 backdrop-blur-md rounded-3xl p-8 border-2 border-pink-400/50 shadow-2xl">
                  {/* Card Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-pink-400/50 mb-4">
                      <span className="text-3xl">🌸</span>
                      <h3 className="text-3xl font-black text-white">YOUR ANIME CARD</h3>
                      <span className="text-3xl">✨</span>
                    </div>
                    <p className="text-pink-200">Tap numbers as they're called in the anime world!</p>
                  </div>

                  {/* Anime Game Card */}
                  <div className="max-w-lg mx-auto">
                    <div className="bg-gradient-to-br from-pink-800 via-purple-700 to-indigo-800 rounded-3xl p-6 shadow-2xl border-2 border-pink-500 relative overflow-hidden">
                      {/* Anime Card Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl"></div>
                      
                      {/* Anime Background Elements */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-2 left-2 text-2xl animate-bounce">✨</div>
                        <div className="absolute top-2 right-2 text-2xl animate-bounce" style={{animationDelay: '0.5s'}}>⭐</div>
                        <div className="absolute bottom-2 left-2 text-2xl animate-bounce" style={{animationDelay: '1s'}}>💫</div>
                        <div className="absolute bottom-2 right-2 text-2xl animate-bounce" style={{animationDelay: '1.5s'}}>🌟</div>
                      </div>
                      
                      {/* Anime Card Grid */}
                      <div className="grid grid-cols-3 gap-4 relative z-10">
                        {card?.gridNumbers?.length > 0 ? (
                          card.gridNumbers.map((number, index) => {
                            const isMarked = markedNumbers.includes(number);

                            return (
                              <button
                                key={index}
                                onClick={() => handleMarkNumber(number)}
                                className={`group relative w-24 h-24 text-2xl font-bold rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                                  isMarked
                                    ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-2xl ring-4 ring-pink-400 animate-pulse'
                                    : 'bg-purple-700 text-white hover:bg-purple-600 border-2 border-purple-600 hover:border-pink-400 hover:shadow-xl'
                                }`}
                              >
                                <div className="flex items-center justify-center h-full relative">
                                  <span className="text-2xl font-black">{number}</span>
                                  {isMarked && (
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg ring-2 ring-pink-500 animate-bounce">
                                      <span className="text-pink-600 text-lg font-black">✓</span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Anime Hover Effect */}
                                {!isMarked && (
                                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <div className="col-span-3 text-center text-pink-300 py-16">
                            <div className="animate-bounce">
                              <div className="text-6xl mb-4">🌸</div>
                              <p className="text-lg font-semibold">Loading your anime card...</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Anime Verify Button */}
                  <div className="text-center">
                    <button
                      onClick={handleVerifyCard}
                      disabled={markedNumbers.length !== 9}
                      className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                        markedNumbers.length === 9
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white cursor-pointer hover:scale-105 shadow-xl hover:shadow-2xl border-2 border-pink-400'
                          : 'bg-purple-700 text-purple-300 cursor-not-allowed'
                      }`}
                    >
                      {markedNumbers.length === 9 ? '✨ ANIME BINGO! 🌸' : `Mark All Numbers (${markedNumbers.length}/9)`}
                    </button>
                  </div>
                </div>
              </div>

              {/* Anime Sidebar */}
              <div className="space-y-4">
                {/* Called Numbers Panel */}
                <div className="bg-gradient-to-br from-pink-800/40 via-purple-800/40 to-indigo-800/40 backdrop-blur-md rounded-2xl p-4 border-2 border-pink-400/50 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                      ✨
                    </div>
                    <h3 className="text-lg font-bold text-white">Anime Numbers</h3>
                    <div className="ml-auto bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg text-sm font-bold">
                      {calledNumbers.length}
                    </div>
                  </div>
                  
                  <div className="bg-purple-700/50 rounded-xl p-3 min-h-[150px] border border-purple-600">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {calledNumbers.length > 0 ? (
                        calledNumbers.map((num, i) => (
                          <div
                            key={i}
                            className={`w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg flex items-center justify-center shadow-lg transition-all duration-500 font-bold text-sm ${
                              i === calledNumbers.length - 1
                                ? 'animate-bounce scale-125 ring-2 ring-pink-400'
                                : 'hover:scale-110'
                            }`}
                          >
                            {num}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-pink-300">
                          <div className="text-3xl mb-2">🌸</div>
                          <p className="text-sm font-semibold">Waiting for anime numbers</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Anime Stats Panel */}
                <div className="bg-gradient-to-br from-pink-800/40 via-purple-800/40 to-indigo-800/40 backdrop-blur-md rounded-2xl p-4 border-2 border-pink-400/50 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
                      💖
                    </div>
                    <h3 className="text-lg font-bold text-white">Anime Stats</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-purple-700/50 rounded-lg border border-purple-600">
                      <span className="text-pink-200 font-medium flex items-center gap-2">
                        <span className="text-lg">✨</span>
                        Marked
                      </span>
                      <span className="text-xl font-bold text-cyan-400">{markedNumbers.length}/9</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-700/50 rounded-lg border border-purple-600">
                      <span className="text-pink-200 font-medium flex items-center gap-2">
                        <span className="text-lg">🌸</span>
                        Status
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        markedNumbers.length === 0 
                          ? 'bg-yellow-500/20 text-yellow-400' 
                          : markedNumbers.length === 9
                            ? 'bg-pink-500/20 text-pink-400'
                            : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {markedNumbers.length === 0 ? 'Waiting' : markedNumbers.length === 9 ? 'Ready!' : 'Playing'}
                      </span>
                    </div>
                    <div className="w-full bg-purple-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(markedNumbers.length / 9) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Anime Players Panel */}
                <div className="bg-gradient-to-br from-pink-800/40 via-purple-800/40 to-indigo-800/40 backdrop-blur-md rounded-2xl p-4 border-2 border-pink-400/50 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                      🎀
                    </div>
                    <h3 className="text-lg font-bold text-white">Anime Players</h3>
                    <div className="ml-auto bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg text-sm font-bold">
                      {players.length}
                    </div>
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {players.length > 0 ? (
                      players.map((player, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-purple-700/50 rounded-lg border border-purple-600 hover:bg-purple-600/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                              {player.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-semibold text-white">{player.name}</span>
                          </div>
                          {player.isHost && (
                            <span className="bg-pink-500/20 text-pink-400 px-2 py-1 rounded text-xs font-bold">HOST</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-pink-300">
                        <div className="text-2xl mb-2">🌸</div>
                        <p className="text-xs font-semibold">No anime players</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Anime Exit Button */}
                <button
                  onClick={handleExitRoom}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-xl border border-red-500/50"
                >
                  ✨ Exit Anime World
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Host Control Room - Redesigned */}
        {session?.isHost && (
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="flex justify-center items-center gap-4 mb-4">
                <BoxCard letter="H" bgColor="#6366f1" borderColor="#4f46e5" fontSize={isMobile ? 40 : 50} />
                <BoxCard letter="O" bgColor="#ec4899" borderColor="#db2777" fontSize={isMobile ? 40 : 50} />
                <BoxCard letter="S" bgColor="#f59e0b" borderColor="#d97706" fontSize={isMobile ? 40 : 50} />
                <BoxCard letter="T" bgColor="#8b5cf6" borderColor="#7c3aed" fontSize={isMobile ? 40 : 50} />
              </div>
              <h1 className="text-5xl font-black text-white mb-2">
                <span className="bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">Control</span> Center
              </h1>
              <p className="text-slate-300 text-lg">Master the Bit9o universe! 🌟</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Game Board */}
              <div className="lg:col-span-2 space-y-6">
                {/* Main Game Board */}
                <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl p-8 border-4 border-indigo-200">
                  {/* Board Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full mb-4">
                      <span className="text-2xl">🎲</span>
                      <h3 className="text-2xl font-bold">Game Board</h3>
                      <span className="text-2xl">🎯</span>
                    </div>
                    <p className="text-slate-600">Draw numbers and watch the magic happen!</p>
                  </div>

                  {/* Draw Button - Prominent */}
                  <div className="flex justify-center mb-8">
                    <button
                      onClick={handleDrawNumber}
                      disabled={isDrawing || calledNumbers.length >= 30}
                      className={`w-32 h-32 flex items-center justify-center text-3xl font-bold rounded-full transition-all duration-300 transform shadow-2xl ${
                        isDrawing
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 animate-pulse scale-110 ring-8 ring-yellow-300'
                          : calledNumbers.length >= 30
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:scale-110 hover:shadow-3xl'
                      }`}
                    >
                      {isDrawing ? (
                        <div className="text-center">
                          <div className="text-4xl font-black animate-spin">
                            {newDrawnNumber ? newDrawnNumber : '🎲'}
                          </div>
                          <div className="text-sm mt-1 font-bold">Drawing...</div>
                        </div>
                      ) : calledNumbers.length >= 30 ? (
                        <div className="text-center">
                          <div className="text-2xl font-black">🏁</div>
                          <div className="text-sm mt-1 font-bold">Game Over!</div>
                        </div>
                      ) : currentNumber ? (
                        <div className="text-center">
                          <div className="text-2xl font-black">🎯</div>
                          <div className="text-sm mt-1 font-bold">Draw Next</div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="text-3xl font-black">🎲</div>
                          <div className="text-sm mt-1 font-bold">Start Game</div>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Progress Section */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-semibold text-slate-700">Game Progress</span>
                      <span className="text-2xl font-bold text-indigo-600">{calledNumbers.length}/30</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 h-4 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${(calledNumbers.length / 30) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-slate-500 mt-2">
                      <span>0</span>
                      <span>15</span>
                      <span>30</span>
                    </div>
                  </div>

                  {/* Called Numbers Display */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 min-h-[300px]">
                    <h4 className="text-xl font-bold text-slate-800 text-center mb-4">
                      Called Numbers ({calledNumbers.length})
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {calledNumbers.length > 0 ? (
                        calledNumbers.map((num, i) => (
                          <div
                            key={i}
                            className={`w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center shadow-lg font-bold text-sm transition-all duration-500 ${
                              i === calledNumbers.length - 1
                                ? 'animate-bounce scale-125 ring-4 ring-yellow-400'
                                : 'hover:scale-110'
                            }`}
                          >
                            {num}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-slate-500">
                          <div className="text-6xl mb-4">🎮</div>
                          <p className="text-xl font-semibold">Ready to begin!</p>
                          <p className="text-sm">Click the draw button to start the game</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column - Controls & Players */}
              <div className="space-y-6">
                {/* Players Section */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      👥
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Players ({players.length})
                    </h3>
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {players.length > 0 ? (
                      players.map((player, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {player.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-700">{player.name}</span>
                              <div className="text-xs text-slate-500">Player #{i + 1}</div>
                            </div>
                          </div>
                          {player.isHost && (
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">👑 Host</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <div className="text-5xl mb-3">👥</div>
                        <p className="font-semibold">No players yet</p>
                        <p className="text-sm">Share the room code to invite friends!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Game Stats */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                      📊
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Game Stats</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-700 font-medium">Numbers Drawn</span>
                      <span className="text-2xl font-bold text-indigo-600">{calledNumbers.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-700 font-medium">Remaining</span>
                      <span className="text-2xl font-bold text-green-600">{30 - calledNumbers.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-700 font-medium">Game Status</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        calledNumbers.length === 0 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : calledNumbers.length >= 30 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {calledNumbers.length === 0 ? 'Waiting' : calledNumbers.length >= 30 ? 'Complete' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Exit Button */}
                <button
                  onClick={handleExitRoom}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-xl"
                >
                  🚪 Exit Control Room
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Win Notification Modal */}
      {winNotification && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="bg-yellow-100 border-8 border-yellow-500 rounded-3xl p-8 max-w-lg text-center shadow-2xl">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-4xl font-black text-yellow-700 mb-6">
              {winNotification.isWinner ? '🎊 YOU WON! 🎊' : '🏆 WINNER! 🏆'}
            </h2>
            <div className="bg-white rounded-2xl p-6 mb-6 border-4 border-yellow-400">
              <p className="text-2xl font-bold text-gray-800 mb-2">
                {winNotification.isWinner ? 'Congratulations!' : 'Winner:'}
              </p>
              <p className="text-3xl font-black text-blue-600 mb-2">{winNotification.playerName}</p>
              <p className="text-xl text-gray-700">
                Won <span className="font-bold text-green-600">{winNotification.winType}</span>!
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setWinNotification(null);
                  handleExitRoom();
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 rounded-2xl text-xl shadow-lg"
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Error Modal */}
      {verificationError && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="bg-red-100 border-8 border-red-500 rounded-3xl p-8 max-w-lg text-center shadow-2xl">
            <div className="text-8xl mb-6">❌</div>
            <h2 className="text-4xl font-black text-red-700 mb-6">{verificationError.message}</h2>
            <div className="bg-white rounded-2xl p-6 mb-6 border-4 border-red-400">
              <p className="text-xl text-gray-700">{verificationError.details}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setVerificationError(null)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl text-xl shadow-lg"
              >
                Return to Game
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
