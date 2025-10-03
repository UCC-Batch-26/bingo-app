import React from 'react';

export function RoomPage() {
  const players = ['Dillan', 'Ian', 'Jag'];
  const calledNumbers = [22, 33, 32, 12];
  const currentNumber = 22;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-10">
      {/* Top section */}
      <div className="flex gap-12 items-start">
        {/* Left Column (Board + BINGO letters) */}
        <div className="flex flex-col items-start">
          {/* Called Numbers Board */}
          <div className="bg-white border-8 border-red-400 rounded-2xl p-10 w-[910px] h-[455px]">
            <div className="flex gap-12 text-5xl font-bold">
              {calledNumbers.map((num, i) => (
                <span key={i}>{num}</span>
              ))}
            </div>
          </div>

          {/* BINGO Letters Row */}
          <div className="flex gap-4 mt-8">
            <div className="bg-sky-400 border-6 border-[#0C6795] w-40 h-40 flex items-center justify-center rounded-2xl text-white text-6xl font-bold shadow-lg">
              B
            </div>
            <div className="bg-orange-500 border-6 border-[#D82C23] w-40 h-40 flex items-center justify-center rounded-2xl text-white text-6xl font-bold shadow-lg">
              I
            </div>
            <div className="bg-yellow-300 border-6 border-[#BC7E06] w-40 h-40 flex items-center justify-center rounded-2xl text-white text-6xl font-bold shadow-lg">
              T
            </div>
            <div className="bg-[#C6B29B] border-6 border-[#7D6450] w-40 h-40 flex items-center justify-center rounded-2xl text-white text-6xl font-bold shadow-lg">
              9
            </div>
            <div className="bg-green-500 border-6 border-[#2C7A25] w-40 h-40 flex items-center justify-center rounded-2xl text-white text-6xl font-bold shadow-lg">
              O
            </div>
          </div>
        </div>

        {/* Right Column (Players + Current Number + Exit) */}
        <div className="flex flex-col items-center justify-between">
          {/* Player List */}
          <div className="bg-white border-8 border-red-400 rounded-2xl p-8 w-60 mb-10">
            <ul className="space-y-5 text-center text-2xl">
              {players.map((player, i) => (
                <li key={i} className="font-bold">
                  {player}
                </li>
              ))}
            </ul>
          </div>

          {/* Current Number */}
          <div className="w-44 h-44 flex items-center justify-center text-5xl font-bold border-[14px] border-black rounded-full bg-white mb-10">
            {currentNumber}
          </div>

          {/* Exit Button */}
          <button className="bg-sky-400 hover:bg-sky-500 text-white font-bold px-8 py-5 rounded-2xl w-56 text-2xl">
            Exit Room
          </button>
        </div>
      </div>
    </div>
  );
}
