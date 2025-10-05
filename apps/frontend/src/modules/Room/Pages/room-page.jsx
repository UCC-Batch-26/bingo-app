import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import RoomContext from '@/modules/Room/Contexts/room-context';
import CardContext from '@/modules/common/contexts/card-context';
import SessionContext from '@/modules/common/contexts/session-context';
import SocketContext from '@/modules/common/contexts/socket-context';
import { BoxCard } from '@/modules/home/components/box-card';

export function RoomPage() {
  const { room, getRoom, updateRoomStatus, updateDrawnNumbers, verifyCard, error } = useContext(RoomContext);
  const { card, leaveRoom } = useContext(CardContext);
  const { session } = useContext(SessionContext);
  const {
    socket,
    isConnected,
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
      console.log('Number drawn:', data);
      if (data.roomCode === roomCode) {
        getRoom(roomCode);
      }
    };

    const handlePlayerJoined = (data) => {
      console.log('Player joined:', data);
      if (data.roomCode === roomCode) {
        getRoom(roomCode);
      }
    };

    const handlePlayerLeft = (data) => {
      console.log('Player left:', data);
      if (data.roomCode === roomCode) {
        getRoom(roomCode);
      }
    };

    const handleRoomStatusChanged = (data) => {
      console.log('Room status changed:', data);
      if (data.roomCode === roomCode) {
        getRoom(roomCode);
        if (data.status === 'ended') {
          navigate('/', { replace: true });
        }
      }
    };

    const handlePlayerWon = (data) => {
      console.log('Player won:', data);
      if (data.roomCode === roomCode) {
        setWinNotification({
          playerName: data.playerName,
          winType: data.winType,
          isWinner: false,
        });
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
  ]);

  const players = room?.players || [];
  const calledNumbers = room?.drawnNumber || [];
  const currentNumber = calledNumbers[calledNumbers.length - 1] || null;
  const [markedNumbers, setMarkedNumbers] = useState([]);
  const [isBit9o, setIsBit9o] = useState(false);
  const [showNumberBoard, setShowNumberBoard] = useState(false);
  const [winNotification, setWinNotification] = useState(null);

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

    const newNumber = Math.floor(Math.random() * 30) + 1;

    if (calledNumbers.includes(newNumber)) {
      handleDrawNumber();
      return;
    }

    await updateDrawnNumbers(room.code, newNumber);
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

    try {
      const result = await verifyCard(card._id, markedNumbers);
      if (result && result.data && result.data.isWin) {
        if (socket && isConnected) {
          socket.emit('player-won', {
            roomCode: roomCode,
            playerName: card?.name || 'Player',
            playerId: card._id,
            winType: 'BIT9O',
          });
        }

        setWinNotification({
          playerName: card?.name || 'You',
          winType: 'BIT9O',
          isWinner: true,
        });
        setIsBit9o(true);
      } else {
        alert('Card verification failed. Please check your marked numbers.');
      }
    } catch (error) {
      alert('Error verifying card. Please try again.', error);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-10">
        <div className="bg-white border-8 border-red-400 rounded-2xl p-10 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-lg mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-sky-400 hover:bg-sky-500 text-white font-bold px-8 py-3 rounded-2xl"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const isMobile = window.innerWidth < 768;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4 sm:p-10">
      {/* Player Card Section - Show at top for players */}
      {!session?.isHost && card && (
        <div className="mb-6 sm:mb-8 w-full max-w-sm">
          <div className="bg-white border-4 sm:border-8 border-red-400 rounded-2xl p-4 sm:p-6">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Your Bit9o Card</h2>
              <p className="text-sm sm:text-base text-gray-600">
                Listen carefully for called numbers and mark them on your card
              </p>
              {isBit9o && (
                <div className="bg-green-500 text-white text-lg sm:text-xl font-bold py-2 px-4 rounded-lg mt-3 sm:mt-4">
                  🎉 BIT9O! 🎉
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xs mx-auto">
              {card?.gridNumbers?.length > 0 ? (
                card.gridNumbers.map((number, index) => {
                  const isMarked = markedNumbers.includes(number);

                  return (
                    <button
                      key={index}
                      onClick={() => handleMarkNumber(number)}
                      className={`
                        w-14 h-14 sm:w-16 sm:h-16 rounded-lg text-base sm:text-lg font-bold transition-all duration-200
                        ${
                          isMarked
                            ? 'bg-green-500 text-white shadow-lg transform scale-105'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
                        }
                      `}
                    >
                      {number}
                    </button>
                  );
                })
              ) : (
                <div className="col-span-3 text-center text-gray-500 py-6 text-sm sm:text-base">
                  Loading your bit9o card...
                </div>
              )}
            </div>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-sm sm:text-base text-gray-700">
                Marked: {markedNumbers.length} / {card?.gridNumbers?.length || 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">Called numbers: {calledNumbers.length}</p>
            </div>

            <div className="mt-4 sm:mt-6 text-center">
              <button
                onClick={handleVerifyCard}
                disabled={markedNumbers.length === 0}
                className={`
                  px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base
                  ${
                    markedNumbers.length > 0
                      ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                Verify Card
              </button>
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
                      className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg text-sm sm:text-base"
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
                  className="w-full h-full flex items-center justify-center text-lg sm:text-2xl font-bold border-[8px] sm:border-[14px] border-green-500 rounded-full bg-green-400 hover:bg-green-500 text-white transition-colors"
                >
                  {currentNumber ? `Drew: ${currentNumber}` : 'Draw Number'}
                </button>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl sm:text-5xl font-bold border-[8px] sm:border-[14px] border-black rounded-full bg-white">
                  {currentNumber || '--'}
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

      {/* Compact Number View for Players when board is hidden */}
      {!session?.isHost && !showNumberBoard && (
        <div className="mb-6 sm:mb-8 w-full max-w-4xl">
          <div className="bg-white border-4 sm:border-8 border-red-400 rounded-2xl p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Current Number */}
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Current Number</h3>
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-xl sm:text-2xl font-bold border-[6px] sm:border-[8px] border-black rounded-full bg-yellow-300 mx-auto mb-3 sm:mb-4">
                  {currentNumber || '--'}
                </div>
                <button
                  onClick={() => setShowNumberBoard(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                >
                  Show All Numbers
                </button>
              </div>

              {/* Right Column - Player List and Exit Button */}
              <div className="flex flex-col justify-between">
                {/* Player List */}
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4">Players ({players.length})</h3>
                  <ul className="space-y-2 text-center text-sm sm:text-base max-h-32 overflow-y-auto">
                    {players.length > 0 ? (
                      players.map((player, i) => (
                        <li key={i} className="font-bold p-2 bg-gray-100 rounded text-xs sm:text-sm">
                          {player.name}
                          {player.isHost && <span className="text-xs text-blue-500 ml-2">(Host)</span>}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 text-xs sm:text-sm">No players yet</li>
                    )}
                  </ul>
                </div>

                {/* Exit Button */}
                <button
                  onClick={handleExitRoom}
                  className="bg-sky-400 hover:bg-sky-500 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base transition-colors"
                >
                  Exit Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Win Notification Modal */}
      {winNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border-8 border-yellow-400 rounded-2xl p-8 max-w-md text-center shadow-2xl">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-yellow-600 mb-4">
              {winNotification.isWinner ? 'YOU WON!' : 'SOMEONE WON!'}
            </h2>
            <p className="text-xl text-gray-700 mb-6">
              {winNotification.isWinner
                ? `Congratulations! You got ${winNotification.winType}!`
                : `${winNotification.playerName} won with ${winNotification.winType}!`}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setWinNotification(null)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-3 rounded-xl text-lg transition-colors"
              >
                {winNotification.isWinner ? 'Continue Playing' : 'OK'}
              </button>
              <button
                onClick={() => {
                  setWinNotification(null);
                  handleExitRoom();
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl text-lg transition-colors"
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}