import { Link } from 'react-router';
import { BoxCard } from '@/modules/home/components/box-card';

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{backgroundColor: '#FEFBF3'}}>
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{opacity: 0.4}}>
        {/* Large geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-black bg-purple-gaming rotate-45"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-black bg-coral"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 border border-black bg-blue-gaming rotate-12"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 border border-black bg-purple-gaming"></div>
        
        {/* Circles and arcs */}
        <div className="absolute top-20 right-32 w-24 h-24 border border-black bg-coral rounded-full"></div>
        <div className="absolute bottom-32 left-64 w-32 h-32 border border-black bg-blue-gaming rounded-full opacity-80"></div>
        <div className="absolute top-48 left-1/4 w-28 h-28 border border-black border-r-0 border-b-0 bg-purple-gaming rounded-tl-full"></div>
        
        {/* Small dots in groups */}
        <div className="absolute top-32 left-24 flex gap-1">
          <div className="w-2 h-2 bg-coral border border-black rounded-full"></div>
          <div className="w-2 h-2 bg-blue-gaming border border-black rounded-full"></div>
          <div className="w-2 h-2 bg-purple-gaming border border-black rounded-full"></div>
        </div>
        <div className="absolute bottom-40 left-24 flex gap-1">
          <div className="w-3 h-3 bg-purple-gaming border border-black rounded-full"></div>
          <div className="w-3 h-3 bg-coral border border-black rounded-full"></div>
        </div>
        
        {/* Grid patterns */}
        <div className="absolute top-24 right-16 border border-black p-2">
          <div className="grid grid-cols-2 gap-1">
            <div className="w-4 h-4 border border-black bg-coral"></div>
            <div className="w-4 h-4 border border-black"></div>
            <div className="w-4 h-4 border border-black"></div>
            <div className="w-4 h-4 border border-black bg-blue-gaming"></div>
          </div>
        </div>
        
        {/* Symbols */}
        <div className="absolute top-56 right-1/3 w-6 h-6 border border-black bg-coral flex items-center justify-center text-black font-bold text-sm">🚫</div>
        <div className="absolute bottom-56 left-1/3 w-6 h-6 border border-black bg-blue-gaming flex items-center justify-center text-black font-bold text-sm">×</div>
        <div className="absolute top-40 left-1/2 border border-black bg-white rounded-lg p-1">
          <div className="flex gap-0.5">
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
          </div>
        </div>
        
        {/* Half-filled shapes */}
        <div className="absolute top-64 left-40 w-16 h-16 border border-black relative overflow-hidden">
          <div className="absolute inset-0 bg-coral" style={{width: '50%'}}></div>
          <div className="absolute inset-0 bg-blue-gaming right-0" style={{width: '50%', left: '50%'}}></div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        {/* Unauthorized Title */}
        <div className="mb-12 animate-fade-in-up">
          <div className="flex justify-center items-center gap-2 mb-8">
            <BoxCard letter="U" bgColor="#7C3AED" borderColor="#000" fontSize={60} />
            <BoxCard letter="N" bgColor="#FF6B5E" borderColor="#000" fontSize={60} />
            <BoxCard letter="A" bgColor="#60B5E8" borderColor="#000" fontSize={60} />
            <BoxCard letter="U" bgColor="#7C3AED" borderColor="#000" fontSize={60} />
            <BoxCard letter="T" bgColor="#FF6B5E" borderColor="#000" fontSize={60} />
            <BoxCard letter="H" bgColor="#60B5E8" borderColor="#000" fontSize={60} />
          </div>
          <h1 className="text-5xl lg:text-7xl font-black mb-4 text-black">
            <span className="text-black">Access Denied</span>
          </h1>
          <p className="text-xl lg:text-2xl text-black mb-8">
            Oops! You don't have permission to enter this room! 🚪
          </p>
        </div>

        {/* Fun Message */}
        <div className="bg-white border border-black rounded-lg p-8 mb-12 relative animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <div className="text-6xl mb-4 animate-bounce">🚫</div>
          <h2 className="text-3xl font-bold mb-4 text-black">This room is members only!</h2>
          <p className="text-lg text-black mb-6">
            Looks like you need a special invitation to join this Bit9o game. Don't worry, it's not personal - 
            we just want to keep the game fair and fun for everyone!
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-black">
            <span>• Make sure you have the correct room code 🎫</span>
            <span>• Check if the game is still active ⏰</span>
            <span>• Ask the host for a fresh invitation 📨</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-purple-gaming hover:bg-purple-gaming-dark text-white px-8 py-5 rounded-lg font-bold text-lg transition-all duration-300 transform btn-playful border border-black"
          >
            🏠 Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="bg-white text-black hover:bg-blue-gaming-light px-8 py-5 rounded-lg font-bold text-lg transition-all duration-300 btn-playful border border-black"
          >
            ⬅️ Try Again
          </button>
        </div>

        {/* Fun Footer */}
        <div className="mt-16 text-black">
          <p className="text-sm font-bold">
            Pro tip: In Bit9o, every player needs a valid ticket - just like this page! 🎟️
          </p>
        </div>
      </div>
    </div>
  );
}
