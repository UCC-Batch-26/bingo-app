import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import RoomContext from '@/modules/Room/Contexts/room-context';
import CardContext from '@/modules/common/contexts/card-context';
import SessionContext from '@/modules/common/contexts/session-context';
import SocketContext from '@/modules/common/contexts/socket-context';
import { BoxCard } from '@/modules/home/components/box-card';
import { AudioControls } from '@/modules/common/components/audio-controls';
import { useAudioContext } from '@/modules/common/contexts/audio-context';

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
  const [showNumberBoard, setShowNumberBoard] = useState(false);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4 sm:p-10">
      {/* Audio Controls */}
      <AudioControls />
      {/* Winner Banner - Shows at top for all players */}
      {winNotification && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-yellow-400 border-b-4 border-yellow-600 shadow-lg">
          <div className="text-center py-4 px-4 relative">
            <button
              onClick={() => setWinNotification(null)}
              className="absolute top-2 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
              title="Close notification"
            >
              ×
            </button>
            <div className="text-2xl sm:text-4xl font-black text-red-600 mb-2">🎉 WINNER ANNOUNCEMENT! 🎉</div>
            <div className="text-lg sm:text-2xl font-bold text-gray-800">
              {winNotification.isWinner ? (
                <span className="text-green-600">Congratulations! You won {winNotification.winType}!</span>
              ) : (
                <span className="text-blue-600">
                  {winNotification.playerName} won {winNotification.winType}!
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Player View: Numbers on top, Card in middle, Players at bottom */}
      {!session?.isHost && card && (
        <div className="mb-6 sm:mb-8 w-full max-w-2xl">
          <div className="bg-white border-4 sm:border-8 border-red-400 rounded-2xl p-4 sm:p-6">
            {/* Top: Called Numbers (compact) - only show drawn numbers */}
            <div className="bg-white border-2 border-gray-300 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Called Numbers ({calledNumbers.length})</h3>
                <button
                  onClick={() => setShowNumberBoard(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1.5 rounded-lg font-semibold text-xs sm:text-sm"
                >
                  Show Board
                </button>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 text-base sm:text-lg font-bold">
                {calledNumbers.length > 0 ? (
                  calledNumbers.map((num, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 sm:w-10 sm:h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow transition-all duration-500 ${
                        i === calledNumbers.length - 1
                          ? 'animate-pulse scale-110 ring-4 ring-yellow-400'
                          : 'hover:scale-105'
                      }`}
                    >
                      {num}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm sm:text-base">No numbers drawn yet</div>
                )}
              </div>
            </div>

            {/* Player Card - Separate Box */}
            <div className="bg-white border-2 border-gray-300 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
              {/* BIT9O Letters inside the box */}
              <div className="mb-4 sm:mb-6">
                <div className="flex gap-2 sm:gap-3 text-white w-full h-16 sm:h-20">
                  <BoxCard letter="B" bgColor="#32BAEC" borderColor="#0C6795" fontSize={isMobile ? 30 : 40} />
                  <BoxCard letter="I" bgColor="#F37213" borderColor="#D82C23" fontSize={isMobile ? 30 : 40} />
                  <BoxCard letter="T" bgColor="#FFD93D" borderColor="#BC7E06" fontSize={isMobile ? 30 : 40} />
                  <BoxCard letter="9" bgColor="#C6B29B" borderColor="#7D6450" fontSize={isMobile ? 30 : 40} />
                  <BoxCard letter="O" bgColor="#6BCB77" borderColor="#2C7A25" fontSize={isMobile ? 30 : 40} />
                </div>
              </div>

              <div className="text-center mb-4">
                {isBit9o && (
                  <div className="bg-green-500 text-white text-lg sm:text-xl font-bold py-2 px-4 rounded-lg mb-4">
                    🎉 BIT9O! 🎉
                  </div>
                )}
              </div>

              {/* Bit9o Card Grid - 3x3 */}
              <div className="max-w-xs mx-auto">
                <div className="grid grid-cols-3 gap-3 border-4 border-gradient-to-r from-purple-500 to-blue-500 bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 p-4">
                  {card?.gridNumbers?.length > 0 ? (
                    card.gridNumbers.map((number, index) => {
                      const isMarked = markedNumbers.includes(number);

                      return (
                        <button
                          key={index}
                          onClick={() => handleMarkNumber(number)}
                          className={`w-16 h-16 sm:w-20 sm:h-20 text-lg sm:text-xl font-black border-2 rounded-2xl transition-colors duration-200 cursor-pointer ${
                            isMarked
                              ? 'bg-green-100 border-green-300 hover:bg-green-200'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-center h-full relative">
                            <span className="text-lg sm:text-xl font-bold text-gray-700">{number}</span>
                            {isMarked && (
                              <div className="absolute top-1 right-1 w-6 h-6 sm:w-7 sm:h-7 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white text-sm sm:text-base font-bold">✓</span>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="col-span-3 text-center text-gray-500 py-8 text-sm sm:text-base bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl">
                      <div className="animate-pulse">Loading your bit9o card...</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 sm:mt-6 text-center">
                <button
                  onClick={handleVerifyCard}
                  disabled={markedNumbers.length !== 9}
                  className={`
                    px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 transform
                    ${
                      markedNumbers.length === 9
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white cursor-pointer hover:scale-105 shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {markedNumbers.length === 9 ? '🎯 Verify Card!' : `Mark All Numbers (${markedNumbers.length}/9)`}
                </button>
              </div>
            </div>

            {/* Bottom: Players List */}
            <div className="bg-white border-2 border-gray-300 rounded-xl p-4 sm:p-6 mt-6 sm:mt-8">
              <h3 className="text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4">Players ({players.length})</h3>
              <ul className="space-y-2 sm:space-y-3 text-center text-base sm:text-lg max-h-40 overflow-y-auto">
                {players.length > 0 ? (
                  players.map((player, i) => (
                    <li key={i} className="font-bold p-2 bg-gray-100 rounded text-sm sm:text-base">
                      {player.name}
                      {player.isHost && <span className="text-xs sm:text-sm text-blue-500 ml-2">(Host)</span>}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 text-sm sm:text-base">No players yet</li>
                )}
              </ul>
              <div className="mt-4 sm:mt-6 text-center">
                <button
                  onClick={handleExitRoom}
                  className="bg-sky-400 hover:bg-sky-500 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-sm sm:text-base"
                >
                  Exit Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {(session?.isHost || showNumberBoard) && (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start w-full max-w-7xl max-sm:w-[100%]">
          {/* Left Column (Board + BIT9O letters) */}
          <div className="flex flex-col items-start max-sm:w-[100%]">
            {/* Called Numbers Board */}
            <div className="bg-white border-4 sm:border-8 border-red-400 rounded-2xl p-4 sm:p-10 w-[910px] h-[455px] flex-center flex-col gap-[30px] max-sm:w-[100%] max-sm:order-[1] max-sm:mt-[10px]">
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
                Called Numbers ({calledNumbers.length})
              </h3>

              <div className="flex flex-wrap gap-2 sm:gap-4 text-2xl sm:text-4xl font-bold justify-center">
                {calledNumbers.length > 0 ? (
                  calledNumbers.map((num, i) => (
                    <div
                      key={i}
                      className={`w-12 h-12 sm:w-16 sm:h-16 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg text-sm sm:text-base transition-all duration-500 ${
                        i === calledNumbers.length - 1
                          ? 'animate-bounce scale-125 ring-4 ring-yellow-400'
                          : 'hover:scale-110'
                      }`}
                    >
                      {num}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-lg sm:text-xl">No numbers drawn yet</div>
                )}
              </div>

              {/* ✅ Player Number Board View (when toggled ON by Player) */}
              {!session?.isHost && showNumberBoard && (
                <div className="flex flex-col items-start w-full max-w-7xl max-sm:w-[100%]">
                  {/* 👇 Hide Button (Player Only) */}
                  <div className="w-full text-center mb-4">
                    <button
                      onClick={() => setShowNumberBoard(false)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                    >
                      Hide All Numbers
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* BIT9O Letters Row - Only show for hosts */}
            {session?.isHost && (
              <div className="flex gap-4 mt-8 max-sm:w-[100%] max-sm:gap-2 text-white w-[100%] h-[100px] max-sm:h-[60px]">
                <BoxCard letter="B" bgColor="#32BAEC" borderColor="#0C6795" fontSize={isMobile ? 45 : 70} />
                <BoxCard letter="I" bgColor="#F37213" borderColor="#D82C23" fontSize={isMobile ? 45 : 70} />
                <BoxCard letter="T" bgColor="#FFD93D" borderColor="#BC7E06" fontSize={isMobile ? 45 : 70} />
                <BoxCard letter="9" bgColor="#C6B29B" borderColor="#7D6450" fontSize={isMobile ? 45 : 70} />
                <BoxCard letter="O" bgColor="#6BCB77" borderColor="#2C7A25" fontSize={isMobile ? 45 : 70} />
              </div>
            )}
          </div>

          {/* Right Column (Players + Current Number + Exit) */}
          <div className="flex flex-col items-center justify-between w-full lg:w-auto">
            {/* Player List */}
            <div className="bg-white border-4 sm:border-8 border-red-400 rounded-2xl p-4 sm:p-8 w-full max-w-sm lg:w-60 mb-6 lg:mb-10">
              <h3 className="text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4">Players ({players.length})</h3>
              <ul className="space-y-2 sm:space-y-3 text-center text-base sm:text-lg">
                {players.length > 0 ? (
                  players.map((player, i) => (
                    <li key={i} className="font-bold p-2 bg-gray-100 rounded text-sm sm:text-base">
                      {player.name}
                      {player.isHost && <span className="text-xs sm:text-sm text-blue-500 ml-2">(Host)</span>}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 text-sm sm:text-base">No players yet</li>
                )}
              </ul>
            </div>

            {/* Draw Number Button / Current Number */}
            <div className="w-32 h-32 sm:w-44 sm:h-44 flex items-center justify-center mb-6 lg:mb-10">
              {session?.isHost ? (
                <button
                  onClick={handleDrawNumber}
                  disabled={isDrawing || calledNumbers.length >= 30}
                  className={`w-full h-full flex items-center justify-center text-lg sm:text-2xl font-bold border-[8px] sm:border-[14px] rounded-full transition-all duration-300 ${
                    isDrawing
                      ? 'border-yellow-500 bg-yellow-400 animate-pulse'
                      : calledNumbers.length >= 30
                        ? 'border-gray-400 bg-gray-300 cursor-not-allowed'
                        : 'border-green-500 bg-green-400 hover:bg-green-500 hover:scale-105'
                  }`}
                >
                  {isDrawing ? (
                    <div className="text-center">
                      <div className="text-6xl sm:text-8xl font-black animate-spin">
                        {newDrawnNumber ? newDrawnNumber : '🎲'}
                      </div>
                      <div className="text-xs sm:text-sm mt-1">Drawing...</div>
                    </div>
                  ) : calledNumbers.length >= 30 ? (
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-black">Game Over</div>
                      <div className="text-xs sm:text-sm mt-1">All 30 numbers drawn</div>
                    </div>
                  ) : currentNumber ? (
                    `Drew: ${currentNumber}`
                  ) : (
                    'Draw Number'
                  )}
                </button>
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center text-3xl sm:text-5xl font-bold border-[8px] sm:border-[14px] rounded-full transition-all duration-500 ${
                    newDrawnNumber ? 'border-yellow-500 bg-yellow-300 scale-110' : 'border-black bg-white'
                  }`}
                >
                  {newDrawnNumber ? (
                    <div className="animate-spin text-4xl sm:text-6xl">{newDrawnNumber}</div>
                  ) : (
                    currentNumber || '--'
                  )}
                </div>
              )}
            </div>

            {/* Exit Button */}
            <button
              onClick={handleExitRoom}
              className="bg-sky-400 hover:bg-sky-500 text-white font-bold px-6 sm:px-8 py-3 sm:py-5 rounded-2xl w-full max-w-xs lg:w-56 text-lg sm:text-2xl"
            >
              Exit Room
            </button>
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
  );
}
