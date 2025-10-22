import { Link } from 'react-router';
import { BoxCard } from '@/modules/home/components/box-card';

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Unauthorized Title */}
        <div className="mb-12">
          <div className="flex justify-center items-center gap-2 mb-8">
            <BoxCard letter="🚫" bgColor="#ef4444" borderColor="#dc2626" fontSize={60} />
            <BoxCard letter="U" bgColor="#f59e0b" borderColor="#d97706" fontSize={60} />
            <BoxCard letter="N" bgColor="#8b5cf6" borderColor="#7c3aed" fontSize={60} />
            <BoxCard letter="A" bgColor="#10b981" borderColor="#059669" fontSize={60} />
            <BoxCard letter="U" bgColor="#ec4899" borderColor="#db2777" fontSize={60} />
            <BoxCard letter="T" bgColor="#6366f1" borderColor="#4f46e5" fontSize={60} />
            <BoxCard letter="H" bgColor="#f59e0b" borderColor="#d97706" fontSize={60} />
          </div>
          <h1 className="text-5xl lg:text-7xl font-black mb-4">
            <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">Access Denied</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-300 mb-8">
            Oops! You don't have permission to enter this room! 🚪
          </p>
        </div>

        {/* Fun Message */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-12 border border-white/20">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-3xl font-bold mb-4">This room is members only!</h2>
          <p className="text-lg text-slate-300 mb-6">
            Looks like you need a special invitation to join this Bit9o game. Don't worry, it's not personal - 
            we just want to keep the game fair and fun for everyone!
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
            <span>• Make sure you have the correct room code 🎫</span>
            <span>• Check if the game is still active ⏰</span>
            <span>• Ask the host for a fresh invitation 📨</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-xl"
          >
            🏠 Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200"
          >
            ⬅️ Try Again
          </button>
        </div>

        {/* Fun Footer */}
        <div className="mt-16 text-slate-400">
          <p className="text-sm">
            Pro tip: In Bit9o, every player needs a valid ticket - just like this page! 🎟️
          </p>
        </div>
      </div>
    </div>
  );
}
