import React from 'react';

export function LobbyPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-4">Game Lobby</h1>

        {/* Room Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <p className="text-gray-700">
            <span className="font-semibold">Room Code:</span> ABC123
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
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition">
            Start Game
          </button>
          <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold transition">
            Leave Lobby
          </button>
        </div>
      </div>
    </div>
  );
}
