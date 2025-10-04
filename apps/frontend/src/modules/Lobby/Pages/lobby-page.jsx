import { BoxCard } from '@/modules/home/components/box-card';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

export function LobbyPage() {
  const user = 'player';
  const [userName, setUserName] = useState('Player 1');
  const [cardNumbers, setCardNumbers] = useState([]);
  const [roomCode, setRoomCode] = useState('123');

  // get the name
  async function getUserName() {
    const URL = 'http://localhost:3000/v1/card/68dfbcea8d79322704f6d3b8';
    try {
      const res = await fetch(URL);

      if (!res.ok) {
        throw new Error('Not Successful');
      }

      const data = await res.json();
      setUserName(data.name);
    } catch (error) {
      console.error(error);
    }
  }

  // get the card numbers
  async function handleCardNumbers() {
    const URL = 'http://localhost:3000/v1/card/68dfbcea8d79322704f6d3b8';
    try {
      const res = await fetch(URL);

      if (!res.ok) {
        throw new Error('Not Successful');
      }

      const data = await res.json();
      setCardNumbers(data.gridNumbers);
    } catch (error) {
      console.error(error);
    }
  }

  // get the room code
  async function handleRoomCode() {
    const URL = 'http://localhost:3000/v1/card/68dfbcea8d79322704f6d3b8';
    try {
      const res = await fetch(URL);

      if (!res.ok) {
        throw new Error('Not Successful');
      }

      const data = await res.json();
      setRoomCode(data.room);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getUserName();
  }, []);

  useEffect(() => {
    handleCardNumbers();
  }, []);

  useEffect(() => {
    handleRoomCode();
  }, []);

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
      {user === 'player' ? (
        <div className=" max-w-md w-full p-[7px] rounded-xl bg-[#FF4D6D]">
          <div className="bg-[] p-[4px] rounded-xl bg-[#9B17F8]">
            <div className="bg-white shadow-lg rounded-xl p-6">
              {/* Title */}
              <h1 className="text-2xl font-bold text-center mb-4">Hello {userName}</h1>

              {/* Room Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-gray-700">
                  <span className="font-semibold">Room Code:</span> {roomCode}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Mode:</span> Standard
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

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button className="w-full bg-[#FF4D6D] hover:bg-[#9B17F8] text-white py-2 rounded-lg font-semibold transition">
                  Get Card
                </button>
                <button className="w-full bg-gray-200 hover:bg-[#9B17F8] text-gray-800 hover:text-white py-2 rounded-lg font-semibold transition">
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
                  <span className="font-semibold">Room Code:</span> {roomCode}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Mode:</span> Standard
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Status:</span> Waiting for players
                </p>
              </div>

              {/* Players List */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Players</h2>
                <ul className="space-y-2">
                  <li className="p-2 bg-gray-100 rounded-md">Player 1</li>
                  <li className="p-2 bg-gray-100 rounded-md">Player 2</li>
                  <li className="p-2 bg-gray-100 rounded-md">Player 3</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button className="w-full bg-[#FF4D6D] hover:bg-[#9B17F8] text-white py-2 rounded-lg font-semibold transition">
                  Start Game
                </button>
                <button className="w-full bg-gray-200 hover:bg-[#9B17F8] text-gray-800 hover:text-white py-2 rounded-lg font-semibold transition">
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
