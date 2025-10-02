import React from 'react';
import { useParams } from 'react-router';

export function LobbyPage() {
  const { id: roomCode } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full p-[7px] rounded-xl bg-[#FF4D6D]">
        <div className="p-[4px] rounded-xl bg-[#9B17F8]">
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
    </div>
  );
}
