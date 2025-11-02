import { useState } from 'react';
import { HowToPlayCards } from '../components/how-to-play-cards';
import { AboutCards } from '../components/about-cards';
import { BoxCard } from '../components/box-card';
import { AudioControls } from '@/modules/common/components/audio-controls';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import RoomContext from '@/modules/Room/Contexts/room-context';
import { Footer } from '@/modules/common/components/footer';
import { Button } from '@/modules/common/components/button';

export function LandingPage() {
  const { createRoom, joinRoom, error, clearError } = useContext(RoomContext);
  const navigate = useNavigate();

  // Audio system

  const [create, setCreate] = useState({
    mode: 'quick',
  });

  const [join, setJoin] = useState({
    name: '',
    room: '',
  });

  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    clearError();
    if (isJoining) return;
    setIsJoining(true);
    const success = await joinRoom(join);

    if (success) {
      navigate(`/lobby/${join.room}`, { replace: true });
    }
    setIsJoining(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const room = await createRoom(create);

    if (room) {
      alert('Room Created');
    }
  };

  const [formType, setFormType] = useState('play');

  // Removed auto-play of BGM here to comply with user gesture policies.

  const isMobile = window.innerWidth < 768;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#FEFBF3' }}>
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.4 }}>
        {/* Large geometric shapes - squares and rectangles */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-black bg-purple-gaming rotate-45"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-black bg-coral"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 border border-black bg-blue-gaming rotate-12"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 border border-black bg-purple-gaming"></div>
        <div className="absolute top-64 left-96 w-20 h-20 border border-black bg-coral-light"></div>
        <div className="absolute bottom-64 right-96 w-24 h-24 border border-black bg-blue-gaming-light rotate-45"></div>
        <div className="absolute top-96 left-64 w-28 h-28 border border-black bg-purple-gaming rotate-12"></div>
        <div className="absolute bottom-96 right-64 w-32 h-32 border border-black bg-coral rotate-45"></div>

        {/* Circles and arcs */}
        <div className="absolute top-20 right-32 w-24 h-24 border border-black bg-coral rounded-full"></div>
        <div className="absolute bottom-32 left-64 w-32 h-32 border border-black bg-blue-gaming rounded-full opacity-80"></div>
        <div className="absolute top-48 left-1/4 w-28 h-28 border border-black border-r-0 border-b-0 bg-purple-gaming rounded-tl-full"></div>
        <div className="absolute bottom-48 right-1/4 w-24 h-24 border border-black border-l-0 border-t-0 bg-coral rounded-br-full"></div>
        <div className="absolute top-80 left-1/3 w-20 h-20 border border-black bg-blue-gaming rounded-full"></div>
        <div className="absolute bottom-80 right-1/3 w-28 h-28 border border-black bg-purple-gaming rounded-full opacity-70"></div>

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
        <div className="absolute top-1/2 left-1/4 flex gap-1">
          <div className="w-2 h-2 bg-blue-gaming border border-black rounded-full"></div>
          <div className="w-2 h-2 bg-coral border border-black rounded-full"></div>
          <div className="w-2 h-2 bg-purple-gaming border border-black rounded-full"></div>
          <div className="w-2 h-2 bg-coral border border-black rounded-full"></div>
        </div>
        <div className="absolute top-1/3 right-1/3 flex gap-1">
          <div className="w-3 h-3 bg-purple-gaming border border-black rounded-full"></div>
          <div className="w-3 h-3 bg-blue-gaming border border-black rounded-full"></div>
        </div>
        <div className="absolute top-96 right-24 flex gap-1">
          <div className="w-2 h-2 bg-coral border border-black rounded-full"></div>
          <div className="w-2 h-2 bg-purple-gaming border border-black rounded-full"></div>
          <div className="w-2 h-2 bg-blue-gaming border border-black rounded-full"></div>
        </div>

        {/* Grid patterns - outlined rectangles */}
        <div className="absolute top-24 right-16 border border-black p-2">
          <div className="grid grid-cols-2 gap-1">
            <div className="w-4 h-4 border border-black bg-coral"></div>
            <div className="w-4 h-4 border border-black"></div>
            <div className="w-4 h-4 border border-black"></div>
            <div className="w-4 h-4 border border-black bg-blue-gaming"></div>
          </div>
        </div>
        <div className="absolute bottom-24 left-16 border border-black p-2">
          <div className="grid grid-cols-2 gap-1">
            <div className="w-4 h-4 border border-black bg-purple-gaming"></div>
            <div className="w-4 h-4 border border-black"></div>
            <div className="w-4 h-4 border border-black bg-coral"></div>
            <div className="w-4 h-4 border border-black"></div>
          </div>
        </div>
        <div className="absolute top-64 right-96 border border-black p-2">
          <div className="grid grid-cols-3 gap-1">
            <div className="w-3 h-3 border border-black bg-purple-gaming"></div>
            <div className="w-3 h-3 border border-black"></div>
            <div className="w-3 h-3 border border-black bg-blue-gaming"></div>
            <div className="w-3 h-3 border border-black"></div>
            <div className="w-3 h-3 border border-black bg-coral"></div>
            <div className="w-3 h-3 border border-black"></div>
          </div>
        </div>

        {/* Symbols - Plus, X, Speech bubble */}
        <div className="absolute top-56 right-1/3 w-6 h-6 border border-black bg-blue-gaming flex items-center justify-center text-black font-bold text-sm">
          +
        </div>
        <div className="absolute bottom-56 left-1/3 w-6 h-6 border border-black bg-coral flex items-center justify-center text-black font-bold text-sm">
          ×
        </div>
        <div className="absolute top-80 left-1/2 border border-black bg-white rounded-lg p-1">
          <div className="flex gap-0.5">
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
          </div>
        </div>
        <div className="absolute bottom-80 right-1/2 w-6 h-6 border border-black bg-purple-gaming flex items-center justify-center text-white font-bold text-sm">
          +
        </div>
        <div className="absolute top-1/3 left-96 w-5 h-5 border border-black bg-coral flex items-center justify-center text-black font-bold text-xs">
          ×
        </div>

        {/* Half-filled shapes */}
        <div className="absolute top-64 left-40 w-16 h-16 border border-black relative overflow-hidden">
          <div className="absolute inset-0 bg-coral" style={{ width: '50%' }}></div>
          <div className="absolute inset-0 bg-blue-gaming right-0" style={{ width: '50%', left: '50%' }}></div>
        </div>
        <div className="absolute bottom-64 right-40 w-16 h-16 border border-black relative overflow-hidden">
          <div className="absolute inset-0 bg-purple-gaming" style={{ width: '50%' }}></div>
          <div className="absolute inset-0 bg-coral right-0" style={{ width: '50%', left: '50%' }}></div>
        </div>
        <div className="absolute top-96 left-96 w-14 h-14 border border-black relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-gaming" style={{ width: '50%' }}></div>
          <div className="absolute inset-0 bg-purple-gaming right-0" style={{ width: '50%', left: '50%' }}></div>
        </div>

        {/* Quarter circles with filled sections */}
        <div className="absolute top-32 right-96 w-20 h-20 border border-black border-r-0 border-b-0 bg-purple-gaming rounded-tl-full"></div>
        <div className="absolute bottom-32 left-96 w-18 h-18 border border-black border-l-0 border-t-0 bg-coral rounded-br-full"></div>

        {/* Small outlined squares and rectangles */}
        <div className="absolute top-48 right-64 w-12 h-12 border border-black"></div>
        <div className="absolute bottom-48 left-64 w-14 h-14 border border-black rotate-45"></div>
        <div className="absolute top-96 right-48 w-10 h-16 border border-black"></div>
        <div className="absolute bottom-96 left-48 w-16 h-10 border border-black"></div>

        {/* Outlined circles */}
        <div className="absolute top-64 left-1/2 w-16 h-16 border border-black rounded-full"></div>
        <div className="absolute bottom-64 right-1/2 w-14 h-14 border border-black rounded-full"></div>
        <div className="absolute top-1/2 left-96 w-12 h-12 border border-black rounded-full"></div>

        {/* Wavy lines pattern */}
        <div
          className="absolute top-80 left-20 w-32 h-1 border-t border-b border-black bg-purple-gaming opacity-50"
          style={{ clipPath: 'polygon(0% 50%, 25% 0%, 50% 50%, 75% 100%, 100% 50%)' }}
        ></div>
        <div
          className="absolute bottom-80 right-20 w-32 h-1 border-t border-b border-black bg-blue-gaming opacity-50"
          style={{ clipPath: 'polygon(0% 50%, 25% 100%, 50% 50%, 75% 0%, 100% 50%)' }}
        ></div>

        {/* Diamond shape with 3D effect */}
        <div
          className="absolute top-72 right-20 w-8 h-20 border border-black bg-purple-gaming transform rotate-12 relative"
          style={{ clipPath: 'polygon(50% 0%, 100% 25%, 50% 100%, 0% 25%)' }}
        >
          <div
            className="absolute inset-0 bg-blue-gaming opacity-50"
            style={{ clipPath: 'polygon(50% 10%, 90% 30%, 50% 90%, 10% 30%)' }}
          ></div>
        </div>
        <div
          className="absolute bottom-72 left-20 w-6 h-16 border border-black bg-coral transform -rotate-12 relative"
          style={{ clipPath: 'polygon(50% 0%, 100% 25%, 50% 100%, 0% 25%)' }}
        >
          <div
            className="absolute inset-0 bg-purple-gaming opacity-50"
            style={{ clipPath: 'polygon(50% 10%, 90% 30%, 50% 90%, 10% 30%)' }}
          ></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BoxCard
              letter="B"
              bgColor="#7C3AED"
              borderColor="#000"
              fontSize={isMobile ? 28 : 32}
              className="w-12 h-12"
            />
            <span className="text-2xl font-black text-black">Bit9o</span>
          </div>
          <AudioControls />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-black leading-tight text-black">
                Play <span className="text-black">Bit9o</span>
              </h1>
              <h2 className="text-3xl lg:text-5xl font-bold text-black transform hover:scale-105 transition-transform inline-block">
                Together Anywhere 🎮
              </h2>
            </div>

            <p className="text-lg lg:text-xl text-black leading-relaxed max-w-lg">
              Join the fun! Create or join rooms, invite your friends, and play together online—whether you're near or
              far. Simple, social, and full of excitement! ✨
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-black bg-white border border-black px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-purple-gaming border border-black rounded-full"></div>
                <span className="font-bold">Free to play</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-black bg-white border border-black px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-coral border border-black rounded-full"></div>
                <span className="font-bold">No registration</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-black bg-white border border-black px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-blue-gaming border border-black rounded-full"></div>
                <span className="font-bold">Cross-platform</span>
              </div>
            </div>
          </div>

          {/* Right Content - Game Form */}
          <div className="relative z-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white border border-black rounded-lg p-8 max-w-md mx-auto relative">
              {/* Logo Display */}
              <div className="flex justify-center items-center gap-2 mb-8 relative z-10">
                <BoxCard letter="B" bgColor="#7C3AED" borderColor="#000" fontSize={isMobile ? 40 : 50} />
                <BoxCard letter="I" bgColor="#FF6B5E" borderColor="#000" fontSize={isMobile ? 40 : 50} />
                <BoxCard letter="T" bgColor="#60B5E8" borderColor="#000" fontSize={isMobile ? 40 : 50} />
                <BoxCard letter="9" bgColor="#7C3AED" borderColor="#000" fontSize={isMobile ? 40 : 50} />
                <BoxCard letter="O" bgColor="#FF6B5E" borderColor="#000" fontSize={isMobile ? 40 : 50} />
              </div>

              {/* Tab Navigation */}
              <div className="flex bg-white border border-black rounded-lg p-1.5 mb-6">
                <button
                  onClick={() => setFormType('play')}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all duration-300 border border-black ${
                    formType === 'play'
                      ? 'bg-purple-gaming text-white transform scale-105'
                      : 'text-black hover:bg-blue-gaming-light bg-white hover:text-black'
                  }`}
                >
                  Join Game
                </button>
                <button
                  onClick={() => setFormType('create')}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all duration-300 border border-black ${
                    formType === 'create'
                      ? 'bg-coral text-white transform scale-105'
                      : 'text-black hover:bg-blue-gaming-light bg-white hover:text-black'
                  }`}
                >
                  Create Room
                </button>
              </div>

              {/* Forms */}
              {formType === 'play' ? (
                <form onSubmit={handleJoin} className="space-y-6 relative z-10">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        className="w-full px-5 py-4 border border-black rounded-lg bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-gaming/50 focus:border-purple-gaming transition-all relative z-20 cursor-text"
                        placeholder="Enter your name"
                        value={join.name}
                        onChange={(e) => setJoin((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">Room Code</label>
                      <input
                        type="text"
                        name="roomCode"
                        className="w-full px-5 py-4 border border-black rounded-lg bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-gaming/50 focus:border-purple-gaming transition-all relative z-20 cursor-text"
                        placeholder="Enter room code"
                        value={join.room}
                        onChange={(e) => setJoin((prev) => ({ ...prev, room: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-white border border-black text-red-700 px-5 py-4 rounded-lg">
                      <p className="text-sm font-bold text-center">{error}</p>
                    </div>
                  )}

                  <Button type="submit" variant="primary" size="lg" disabled={isJoining} className="w-full">
                    {isJoining ? 'Joining...' : 'Join Game'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleCreate} className="space-y-6 relative z-10">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Game Mode</label>
                    <select
                      name="mode"
                      className="w-full px-5 py-4 border border-black rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-purple-gaming/50 focus:border-purple-gaming transition-all relative z-20 cursor-pointer"
                      value={create.mode}
                      onChange={(e) => setCreate((prev) => ({ ...prev, mode: e.target.value }))}
                      required
                    >
                      <option value="quick">Quick Game</option>
                      <option value="standard">Standard Game</option>
                    </select>
                  </div>

                  <Button type="submit" variant="secondary" size="lg" className="w-full">
                    Create Room
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-black">
            How to <span className="text-black">Play</span>
          </h2>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Get started in seconds and enjoy bingo with friends anywhere! 🎮
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <HowToPlayCards
            type="Host"
            description="Create a room in seconds, set your game rules, and share a unique code with your friends. Once everyone joins, you control the game and call the numbers. It's like hosting a party, but for bingo!"
          />
          <HowToPlayCards
            type="Player"
            description="Simply enter the room code from your host, grab your bingo card, and start marking numbers as they're called. When you complete the winning pattern, shout 'Bingo!' and celebrate with your friends online."
          />
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-black">
            Why Choose <span className="text-black">Bit9o</span>
          </h2>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Modern bingo that brings people together, no matter where they are 🎮
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <AboutCards
            title="Social Gaming Made Simple"
            description="Bring the classic bingo experience online with friends and family. Create rooms, share codes, and play together instantly—no complicated setup required."
          />
          <AboutCards
            title="Connect Anywhere, Anytime"
            description="Whether you're across the street or across the world, Bit9o keeps you connected through the joy of bingo. Perfect for virtual hangouts and family game nights."
          />
          <AboutCards
            title="Modern & Intuitive"
            description="Clean, beautiful interface that's easy to use for players of all ages. Enjoy smooth gameplay with modern features while keeping the classic bingo charm."
          />
        </div>

        {/* Decorative Bingo Letters */}
        <div className="flex justify-center items-center gap-4 mt-16 opacity-50">
          <BoxCard letter="A" bgColor="#6366f1" borderColor="#4f46e5" fontSize={24} />
          <BoxCard letter="B" bgColor="#ec4899" borderColor="#db2777" fontSize={24} />
          <BoxCard letter="O" bgColor="#f59e0b" borderColor="#d97706" fontSize={24} />
          <BoxCard letter="U" bgColor="#8b5cf6" borderColor="#7c3aed" fontSize={24} />
          <BoxCard letter="T" bgColor="#10b981" borderColor="#059669" fontSize={24} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
