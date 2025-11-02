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
        <div className="absolute top-96 left-64 w-28 h-28 border border-black bg-purple-gaming rotate-12"></div>
        <div className="absolute bottom-96 right-64 w-32 h-32 border border-black bg-coral rotate-45"></div>
        
        {/* Circles and arcs */}
        <div className="absolute top-20 right-32 w-24 h-24 border border-black bg-coral rounded-full"></div>
        <div className="absolute bottom-32 left-64 w-32 h-32 border border-black bg-blue-gaming rounded-full opacity-80"></div>
        <div className="absolute top-48 left-1/4 w-28 h-28 border border-black border-r-0 border-b-0 bg-purple-gaming rounded-tl-full"></div>
        <div className="absolute bottom-48 right-1/4 w-24 h-24 border border-black border-l-0 border-t-0 bg-coral rounded-br-full"></div>
        <div className="absolute top-80 left-1/3 w-20 h-20 border border-black bg-blue-gaming rounded-full"></div>
        <div className="absolute bottom-80 right-1/3 w-28 h-28 border border-black bg-purple-gaming rounded-full opacity-70"></div>
        
        {/* Small geometric dots in groups */}
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
        <div className="absolute top-96 right-24 flex gap-1">
          <div className="w-2 h-2 bg-coral border border-black rounded-full"></div>
          <div className="w-2 h-2 bg-purple-gaming border border-black rounded-full"></div>
          <div className="w-2 h-2 bg-blue-gaming border border-black rounded-full"></div>
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
        <div className="absolute top-64 right-96 border border-black p-2">
          <div className="grid grid-cols-3 gap-1">
            <div className="w-3 h-3 border border-black bg-purple-gaming"></div>
            <div className="w-3 h-3 border border-black"></div>
            <div className="w-3 h-3 border border-black bg-blue-gaming"></div>
            <div className="w-3 h-3 border border-black"></div>
            <div className="w-3 h-3 border border-black bg-coral"></div>
            <div className="w-3 h-3 border border-black"></div>
          </div>
        </div>
        
        {/* Symbols - Plus, X, Speech bubble */}
        <div className="absolute top-56 right-1/3 w-6 h-6 border border-black bg-blue-gaming flex items-center justify-center text-black font-bold text-sm">+</div>
        <div className="absolute bottom-56 left-1/3 w-6 h-6 border border-black bg-coral flex items-center justify-center text-white font-bold text-sm">×</div>
        <div className="absolute top-40 left-1/2 border border-black bg-white rounded-lg p-1">
          <div className="flex gap-0.5">
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
          </div>
        </div>
        <div className="absolute bottom-80 right-1/2 w-6 h-6 border border-black bg-purple-gaming flex items-center justify-center text-white font-bold text-sm">+</div>
        <div className="absolute top-1/3 left-96 w-5 h-5 border border-black bg-coral flex items-center justify-center text-white font-bold text-xs">×</div>
        
        {/* Half-filled shapes */}
        <div className="absolute top-64 left-40 w-16 h-16 border border-black relative overflow-hidden">
          <div className="absolute inset-0 bg-coral" style={{width: '50%'}}></div>
          <div className="absolute inset-0 bg-blue-gaming right-0" style={{width: '50%', left: '50%'}}></div>
        </div>
        <div className="absolute bottom-64 right-40 w-16 h-16 border border-black relative overflow-hidden">
          <div className="absolute inset-0 bg-purple-gaming" style={{width: '50%'}}></div>
          <div className="absolute inset-0 bg-coral right-0" style={{width: '50%', left: '50%'}}></div>
        </div>
        <div className="absolute top-96 left-96 w-14 h-14 border border-black relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-gaming" style={{width: '50%'}}></div>
          <div className="absolute inset-0 bg-purple-gaming right-0" style={{width: '50%', left: '50%'}}></div>
        </div>
        
        {/* Quarter circles with filled sections */}
        <div className="absolute top-32 right-96 w-20 h-20 border border-black border-r-0 border-b-0 bg-purple-gaming rounded-tl-full"></div>
        <div className="absolute bottom-32 left-96 w-18 h-18 border border-black border-l-0 border-t-0 bg-coral rounded-br-full"></div>
        
        {/* Small outlined squares and rectangles */}
        <div className="absolute top-48 right-64 w-12 h-12 border border-black"></div>
        <div className="absolute bottom-48 left-64 w-14 h-14 border border-black rotate-45"></div>
        <div className="absolute top-96 right-48 w-10 h-16 border border-black"></div>
        <div className="absolute bottom-96 left-48 w-16 h-10 border border-black"></div>
        
        {/* Outlined circles */}
        <div className="absolute top-64 left-1/2 w-16 h-16 border border-black rounded-full"></div>
        <div className="absolute bottom-64 right-1/2 w-14 h-14 border border-black rounded-full"></div>
        <div className="absolute top-1/2 left-96 w-12 h-12 border border-black rounded-full"></div>
        
        {/* Wavy lines */}
        <div className="absolute top-80 left-20 w-32 h-1 border-t border-b border-black bg-purple-gaming opacity-50" style={{clipPath: 'polygon(0% 50%, 25% 0%, 50% 50%, 75% 100%, 100% 50%)'}}></div>
        <div className="absolute bottom-80 right-20 w-32 h-1 border-t border-b border-black bg-blue-gaming opacity-50" style={{clipPath: 'polygon(0% 50%, 25% 100%, 50% 50%, 75% 0%, 100% 50%)'}}></div>
        
        {/* Diamond shape with 3D effect */}
        <div className="absolute top-72 right-20 w-8 h-20 border border-black bg-purple-gaming transform rotate-12 relative" style={{clipPath: 'polygon(50% 0%, 100% 25%, 50% 100%, 0% 25%)'}}>
          <div className="absolute inset-0 bg-blue-gaming opacity-50" style={{clipPath: 'polygon(50% 10%, 90% 30%, 50% 90%, 10% 30%)'}}></div>
        </div>
        <div className="absolute bottom-72 left-20 w-6 h-16 border border-black bg-coral transform -rotate-12 relative" style={{clipPath: 'polygon(50% 0%, 100% 25%, 50% 100%, 0% 25%)'}}>
          <div className="absolute inset-0 bg-purple-gaming opacity-50" style={{clipPath: 'polygon(50% 10%, 90% 30%, 50% 90%, 10% 30%)'}}></div>
        </div>
      </div>

      {/* Game Header */}
      <div className="relative z-10 bg-white border-b border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BoxCard 
                  letter="B" 
                  bgColor="#7C3AED" 
                  borderColor="#000" 
                  fontSize={28}
                  className="w-10 h-10"
                />
                <BoxCard 
                  letter="I" 
                  bgColor="#FF6B5E" 
                  borderColor="#000" 
                  fontSize={28}
                  className="w-10 h-10"
                />
                <BoxCard 
                  letter="T" 
                  bgColor="#60B5E8" 
                  borderColor="#000" 
                  fontSize={28}
                  className="w-10 h-10"
                />
                <BoxCard 
                  letter="9" 
                  bgColor="#7C3AED" 
                  borderColor="#000" 
                  fontSize={28}
                  className="w-10 h-10"
                />
                <BoxCard 
                  letter="O" 
                  bgColor="#FF6B5E" 
                  borderColor="#000" 
                  fontSize={28}
                  className="w-10 h-10"
                />
              </div>
              <div className="h-8 w-px bg-black"></div>
              <span className="text-2xl font-black text-black flex items-center gap-2">
                Bit9o
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="bg-white border border-black rounded-lg px-5 py-3">
                <div className="text-xs text-black uppercase tracking-wider font-bold">Room Code</div>
                <div className="text-xl font-mono font-black text-black">{roomCode}</div>
              </div>
              <AudioControls />
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
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
            {/* Status Bar */}
            <div className="bg-white border border-black rounded-lg p-5 mb-6 relative">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-gaming w-4 h-4 rounded-full animate-pulse border border-black"></div>
                  <span className="text-black font-bold text-lg flex items-center gap-2">
                    ✨ Connected to Game
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center bg-blue-gaming border border-black rounded-lg p-4">
                    <div className="text-2xl font-black text-black">{calledNumbers.length}</div>
                    <div className="text-xs text-black uppercase font-bold">Numbers Called</div>
                  </div>
                  <div className="text-center bg-coral border border-black rounded-lg p-4">
                    <div className="text-2xl font-black text-black">{markedNumbers.length}</div>
                    <div className="text-xs text-black uppercase font-bold">Marked</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Main Game Area - Card */}
              <div className="lg:col-span-3">
                {/* Card Container */}
                <div className="bg-white border border-black rounded-lg p-8 relative">
                  {/* Card Header - 3D Purple Banner */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-4 bg-purple-gaming border border-black rounded-lg px-8 py-4 mb-4 transform hover:scale-110 transition-transform relative" style={{
                      boxShadow: '2px 2px 0 rgba(124, 58, 237, 0.8), 4px 4px 0 rgba(124, 58, 237, 0.6)'
                    }}>
                      <div className="absolute bottom-0 right-0 w-full h-full bg-purple-gaming-dark opacity-30 rounded-lg" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 85%)'}}></div>
                      <span className="text-4xl animate-bounce relative z-10">🎮</span>
                      <h3 className="text-3xl font-black text-white relative z-10">YOUR GAME CARD</h3>
                      <span className="text-4xl animate-bounce relative z-10" style={{animationDelay: '0.5s'}}>🎯</span>
                    </div>
                    <p className="text-black text-lg font-bold">Tap numbers as they're called!</p>
                  </div>

                  {/* Game Card with 3D Effect */}
                  <div className="max-w-lg mx-auto perspective-1000">
                    <div className="bg-white border border-black rounded-lg p-6 relative overflow-hidden transform-gpu transition-all duration-300 hover:scale-105 card-3d" style={{transformStyle: 'preserve-3d'}}>
                      {/* Geometric Background Elements */}
                      <div className="absolute inset-0" style={{opacity: 0.15}}>
                        <div className="absolute top-2 left-2 w-6 h-6 border border-black bg-purple-gaming rotate-45"></div>
                        <div className="absolute top-2 right-2 w-5 h-5 border border-black bg-coral rounded-full"></div>
                        <div className="absolute bottom-2 left-2 w-8 h-8 border border-black bg-blue-gaming"></div>
                        <div className="absolute bottom-2 right-2 w-5 h-5 border border-black bg-purple-gaming rotate-12"></div>
                        <div className="absolute top-1/2 left-1/2 w-3 h-3 border border-black bg-coral rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                      </div>
                      
                      {/* Card Grid */}
                      <div className="grid grid-cols-3 gap-4 relative z-10">
                        {card?.gridNumbers?.length > 0 ? (
                          card.gridNumbers.map((number, index) => {
                            const isMarked = markedNumbers.includes(number);

                            return (
                              <button
                                key={index}
                                onClick={() => handleMarkNumber(number)}
                                className={`group relative w-24 h-24 text-2xl font-black border border-black rounded-lg transition-all duration-300 cursor-pointer transform-gpu hover:scale-110 hover:-translate-y-2 hover:rotate-3 btn-playful ${
                                  isMarked
                                    ? 'bg-purple-gaming text-white animate-pulse scale-105'
                                    : 'bg-white text-black hover:bg-blue-gaming-light border border-black'
                                }`}
                                style={{transformStyle: 'preserve-3d'}}
                              >
                                <div className="flex items-center justify-center h-full relative">
                                  <span className="text-2xl font-black">{number}</span>
                                  {isMarked && (
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-coral border border-black rounded-full flex items-center justify-center animate-bounce">
                                      <span className="text-white text-lg font-black">✓</span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Hover Effect */}
                                {!isMarked && (
                                  <div className="absolute inset-0 bg-purple-gaming/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <div className="col-span-3 text-center text-black py-16">
                            <div className="animate-bounce">
                              <div className="text-6xl mb-4 transform hover:scale-150 transition-transform">🎮</div>
                              <p className="text-lg font-bold">Loading your card...</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Verify Button */}
                  <div className="text-center">
                    <button
                      onClick={handleVerifyCard}
                      disabled={markedNumbers.length !== 9}
                      className={`px-10 py-5 rounded-lg font-bold text-xl transition-all duration-300 transform btn-playful border border-black ${
                        markedNumbers.length === 9
                          ? 'bg-coral hover:bg-coral-light text-white cursor-pointer hover:scale-110 animate-pulse-glow'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {markedNumbers.length === 9 ? '🎉 BINGO! 🎉' : `Mark All Numbers (${markedNumbers.length}/9)`}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                {/* Called Numbers Panel */}
                <div className="bg-white border border-black rounded-lg p-5 relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-gaming border border-black rounded-lg flex items-center justify-center text-black font-bold">
                      🎯
                    </div>
                    <h3 className="text-lg font-bold text-black">Called Numbers</h3>
                    <div className="ml-auto bg-purple-gaming text-white border border-black px-3 py-1.5 rounded-lg text-sm font-bold">
                      {calledNumbers.length}
                    </div>
                  </div>
                  
                  <div className="bg-white border border-black rounded-lg p-4 min-h-[150px]">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {calledNumbers.length > 0 ? (
                        calledNumbers.map((num, i) => (
                          <div
                            key={i}
                            className={`w-10 h-10 bg-coral border border-black text-white rounded-full flex items-center justify-center transition-all duration-500 font-bold text-base btn-playful ${
                              i === calledNumbers.length - 1
                                ? 'animate-bounce scale-125 bg-purple-gaming text-white'
                                : 'hover:scale-110'
                            }`}
                          >
                            {num}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-black">
                          <div className="text-4xl mb-2 animate-pulse">🎲</div>
                          <p className="text-sm font-bold">Waiting for numbers</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats Panel */}
                <div className="bg-white border border-black rounded-lg p-5 relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-gaming border border-black rounded-lg flex items-center justify-center text-white font-bold">
                      📊
                    </div>
                    <h3 className="text-lg font-bold text-black">Game Stats</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white border border-black rounded-lg">
                      <span className="text-black font-bold flex items-center gap-2">
                        <span className="text-xl">🎯</span>
                        Marked
                      </span>
                      <span className="text-2xl font-black text-purple-gaming">{markedNumbers.length}/9</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white border border-black rounded-lg">
                      <span className="text-black font-bold flex items-center gap-2">
                        <span className="text-xl">⭐</span>
                        Status
                      </span>
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border border-black ${
                        markedNumbers.length === 0 
                          ? 'bg-blue-gaming text-black' 
                          : markedNumbers.length === 9
                            ? 'bg-coral text-white'
                            : 'bg-purple-gaming text-white'
                      }`}>
                        {markedNumbers.length === 0 ? 'Waiting' : markedNumbers.length === 9 ? 'Ready!' : 'Playing'}
                      </span>
                    </div>
                    <div className="w-full bg-white border border-black rounded-full h-3">
                      <div 
                        className="bg-purple-gaming h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(markedNumbers.length / 9) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Players Panel */}
                <div className="bg-white border border-black rounded-lg p-5 relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-coral border border-black rounded-lg flex items-center justify-center text-white font-bold">
                      👥
                    </div>
                    <h3 className="text-lg font-bold text-black">Players</h3>
                    <div className="ml-auto bg-blue-gaming text-black border border-black px-3 py-1.5 rounded-lg text-sm font-bold">
                      {players.length}
                    </div>
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {players.length > 0 ? (
                      players.map((player, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white border border-black rounded-lg hover:shadow-md transition-all btn-playful">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-gaming border border-black rounded-full flex items-center justify-center text-white font-bold text-xs transform hover:scale-110 transition-transform">
                              {player.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-black">{player.name}</span>
                          </div>
                          {player.isHost && (
                            <span className="bg-coral text-white border border-black px-3 py-1 rounded-lg text-xs font-bold">👑 HOST</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-black">
                        <div className="text-2xl mb-2 animate-bounce">👥</div>
                        <p className="text-xs font-bold">No players yet</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Exit Button */}
                <button
                  onClick={handleExitRoom}
                  className="w-full bg-coral hover:bg-coral-light text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform btn-playful border border-black relative z-10 cursor-pointer"
                  type="button"
                >
                  🚪 Exit Room
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Host Control Room - Redesigned */}
        {session?.isHost && (
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="flex justify-center items-center gap-4 mb-4">
                <BoxCard letter="H" bgColor="#7C3AED" borderColor="#000" fontSize={isMobile ? 40 : 50} />
                <BoxCard letter="O" bgColor="#FF6B5E" borderColor="#000" fontSize={isMobile ? 40 : 50} />
                <BoxCard letter="S" bgColor="#60B5E8" borderColor="#000" fontSize={isMobile ? 40 : 50} />
                <BoxCard letter="T" bgColor="#7C3AED" borderColor="#000" fontSize={isMobile ? 40 : 50} />
              </div>
              <h1 className="text-5xl font-black text-black mb-2">
                <span className="text-black">Control</span> Center
              </h1>
              <p className="text-black text-lg font-bold">Control the Game! 🎮</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Game Board */}
              <div className="lg:col-span-2 space-y-6">
                {/* Main Game Board */}
                <div className="bg-white border border-black rounded-lg p-8 relative">
                  {/* Board Header - 3D Purple Banner */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-4 bg-purple-gaming border border-black px-8 py-4 rounded-lg mb-4 transform hover:scale-110 transition-transform relative" style={{
                      boxShadow: '2px 2px 0 rgba(124, 58, 237, 0.8), 4px 4px 0 rgba(124, 58, 237, 0.6)'
                    }}>
                      <div className="absolute bottom-0 right-0 w-full h-full bg-purple-gaming-dark opacity-30 rounded-lg" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 85%)'}}></div>
                      <span className="text-3xl animate-bounce relative z-10">🎲</span>
                      <h3 className="text-2xl font-bold text-white relative z-10">Game Board</h3>
                      <span className="text-3xl animate-bounce relative z-10" style={{animationDelay: '0.3s'}}>🎯</span>
                    </div>
                    <p className="text-black font-bold">Draw numbers and watch the magic happen!</p>
                  </div>

                  {/* Draw Button - Prominent with 3D Effect */}
                  <div className="flex justify-center mb-8 perspective-1000">
                    <button
                      onClick={handleDrawNumber}
                      disabled={isDrawing || calledNumbers.length >= 30}
                      className={`w-36 h-36 flex items-center justify-center text-4xl font-bold rounded-full transition-all duration-300 transform-gpu border border-black btn-playful ${
                        isDrawing
                          ? 'bg-coral animate-pulse scale-110 text-white'
                          : calledNumbers.length >= 30
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-purple-gaming hover:bg-purple-gaming-dark text-white hover:scale-110 hover:-translate-y-2 animate-pulse-glow'
                      }`}
                      style={isDrawing ? {transform: 'rotateY(12deg)', transformStyle: 'preserve-3d'} : {transformStyle: 'preserve-3d'}}
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
                      <span className="text-lg font-bold text-black">Game Progress</span>
                      <span className="text-2xl font-black text-black border border-black bg-white px-3 py-1 rounded-lg">{calledNumbers.length}/30</span>
                    </div>
                    <div className="w-full bg-white border border-black rounded-full h-4 overflow-hidden">
                      <div 
                        className="bg-coral h-4 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${(calledNumbers.length / 30) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-black font-bold mt-2">
                      <span>0</span>
                      <span>15</span>
                      <span>30</span>
                    </div>
                  </div>

                  {/* Called Numbers Display */}
                  <div className="bg-white border border-black rounded-lg p-6 min-h-[300px] relative">
                    <h4 className="text-xl font-bold text-black text-center mb-5">
                      Called Numbers ({calledNumbers.length})
                    </h4>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {calledNumbers.length > 0 ? (
                        calledNumbers.map((num, i) => (
                          <div
                            key={i}
                            className={`w-12 h-12 bg-blue-gaming border border-black text-black rounded-full flex items-center justify-center font-bold text-base transition-all duration-500 btn-playful ${
                              i === calledNumbers.length - 1
                                ? 'animate-bounce scale-125 bg-purple-gaming text-white'
                                : 'hover:scale-110'
                            }`}
                          >
                            {num}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-black">
                          <div className="text-6xl mb-4 transform hover:scale-125 hover:rotate-12 transition-transform inline-block">🎮</div>
                          <p className="text-xl font-bold">Ready to begin!</p>
                          <p className="text-sm font-bold">Click the draw button to start the game</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column - Controls & Players */}
              <div className="space-y-6">
                {/* Players Section */}
                <div className="bg-white border border-black rounded-lg p-6 relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-coral border border-black rounded-full flex items-center justify-center text-white font-bold">
                      👥
                    </div>
                    <h3 className="text-xl font-bold text-black">
                      Players ({players.length})
                    </h3>
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {players.length > 0 ? (
                      players.map((player, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white border border-black rounded-lg hover:shadow-md transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-gaming border border-black rounded-full flex items-center justify-center text-white font-bold text-sm transform hover:scale-110 hover:rotate-6 transition-transform">
                              {player.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-black">{player.name}</span>
                              <div className="text-xs text-black font-semibold">Player #{i + 1}</div>
                            </div>
                          </div>
                          {player.isHost && (
                            <span className="bg-coral text-white border border-black px-3 py-1 rounded-lg text-xs font-bold transform hover:scale-110 transition-transform">👑 Host</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-black">
                        <div className="text-5xl mb-3 transform hover:scale-125 hover:rotate-12 transition-transform inline-block">👥</div>
                        <p className="font-bold">No players yet</p>
                        <p className="text-sm font-bold">Share the room code to invite friends!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Game Stats */}
                <div className="bg-white border border-black rounded-lg p-6 relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-gaming border border-black rounded-full flex items-center justify-center text-black font-bold">
                      📊
                    </div>
                    <h3 className="text-xl font-bold text-black">Game Stats</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white border border-black rounded-lg">
                      <span className="text-black font-bold">Numbers Drawn</span>
                      <span className="text-2xl font-black text-black border border-black bg-white px-2 py-1 rounded-lg">{calledNumbers.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white border border-black rounded-lg">
                      <span className="text-black font-bold">Remaining</span>
                      <span className="text-2xl font-black text-black border border-black bg-white px-2 py-1 rounded-lg">{30 - calledNumbers.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white border border-black rounded-lg">
                      <span className="text-black font-bold">Game Status</span>
                      <span className={`px-4 py-1.5 rounded-lg text-sm font-bold border border-black ${
                        calledNumbers.length === 0 
                          ? 'bg-blue-gaming text-black' 
                          : calledNumbers.length >= 30 
                            ? 'bg-coral text-white'
                            : 'bg-purple-gaming text-white'
                      }`}>
                        {calledNumbers.length === 0 ? 'Waiting' : calledNumbers.length >= 30 ? 'Complete' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Exit Button */}
                <button
                  onClick={handleExitRoom}
                  className="w-full bg-coral hover:bg-coral-light text-black font-bold py-5 px-6 rounded-lg transition-all duration-300 transform btn-playful border border-black relative z-10 cursor-pointer"
                  type="button"
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
