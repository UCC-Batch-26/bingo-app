import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold tracking-wide">🎉 Bingo App</h1>
        <p className="mt-4 text-lg text-white/90">Play with friends, join rooms, and enjoy the game!</p>
      </header>

      {/* Actions */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          to="/lobby"
          className="bg-white text-purple-600 font-semibold py-3 px-6 rounded-lg shadow-md text-center hover:bg-purple-100 transition"
        >
          Enter Lobby
        </Link>

        <Link
          to="/unauthorized"
          className="bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md text-center hover:bg-red-700 transition"
        >
          Unauthorized Test
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-sm text-white/70">
        © {new Date().getFullYear()} Bingo App. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
