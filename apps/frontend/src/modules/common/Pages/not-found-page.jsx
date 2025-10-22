import { Link } from 'react-router';
import { BoxCard } from '@/modules/home/components/box-card';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* 404 Title */}
        <div className="mb-12">
          <div className="flex justify-center items-center gap-2 mb-8">
            <BoxCard letter="4" bgColor="#ef4444" borderColor="#dc2626" fontSize={80} />
            <BoxCard letter="0" bgColor="#f59e0b" borderColor="#d97706" fontSize={80} />
            <BoxCard letter="4" bgColor="#8b5cf6" borderColor="#7c3aed" fontSize={80} />
          </div>
          <h1 className="text-6xl lg:text-8xl font-black mb-4">
            Oops! <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">Page Not Found</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-300 mb-8">
            Looks like this page went missing! 🕵️‍♂️
          </p>
        </div>

        {/* Fun Message */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-12 border border-white/20">
          <div className="text-6xl mb-4">🎲</div>
          <h2 className="text-3xl font-bold mb-4">This page is playing hide and seek!</h2>
          <p className="text-lg text-slate-300 mb-6">
            Don't worry, it happens to the best of us. Even the most organized bingo games can have a missing number or two!
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
            <span>• Maybe it's taking a coffee break ☕</span>
            <span>• Perhaps it's playing Bit9o somewhere else 🎮</span>
            <span>• It might be hiding behind a bingo card 🃏</span>
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
            ⬅️ Go Back
          </button>
        </div>

        {/* Fun Footer */}
        <div className="mt-16 text-slate-400">
          <p className="text-sm">
            Remember: In Bit9o, every number matters - but this page? Not so much! 😄
          </p>
        </div>
      </div>
    </div>
  );
}
