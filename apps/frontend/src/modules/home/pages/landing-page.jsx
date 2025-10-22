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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BoxCard 
              letter="B" 
              bgColor="#6366f1" 
              borderColor="#4f46e5" 
              fontSize={isMobile ? 28 : 32}
              className="w-12 h-12"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">Bit9o</span>
          </div>
          <AudioControls />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                Play <span className="bg-gradient-to-r from-indigo-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">Bit9o</span>
              </h1>
              <h2 className="text-3xl lg:text-5xl font-bold text-slate-300">
                Together Anywhere
              </h2>
            </div>
            
            <p className="text-lg lg:text-xl text-slate-300 leading-relaxed max-w-lg">
              Enjoy the classic fun of bingo with a modern twist! Create or join rooms, invite your friends, 
              and play together online—whether you're near or far. Simple, social, and full of laughs.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Free to play</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>No registration required</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span>Cross-platform</span>
              </div>
            </div>
          </div>

          {/* Right Content - Game Form */}
          <div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-8 max-w-md mx-auto">
              {/* Logo Display */}
              <div className="flex justify-center items-center gap-2 mb-8">
                <BoxCard letter="B" bgColor="#6366f1" borderColor="#4f46e5" fontSize={isMobile ? 40 : 50} />
                <BoxCard letter="I" bgColor="#ec4899" borderColor="#db2777" fontSize={isMobile ? 40 : 50} />
                <BoxCard letter="T" bgColor="#f59e0b" borderColor="#d97706" fontSize={isMobile ? 40 : 50} />
                <BoxCard letter="9" bgColor="#8b5cf6" borderColor="#7c3aed" fontSize={isMobile ? 40 : 50} />
                <BoxCard letter="O" bgColor="#10b981" borderColor="#059669" fontSize={isMobile ? 40 : 50} />
              </div>

              {/* Tab Navigation */}
              <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
                <button
                  onClick={() => setFormType('play')}
                  className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
                    formType === 'play' 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Join Game
                </button>
                <button
                  onClick={() => setFormType('create')}
                  className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
                    formType === 'create' 
                      ? 'bg-pink-500 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Room
                </button>
              </div>

              {/* Forms */}
              {formType === 'play' ? (
                <form onSubmit={handleJoin} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
                        placeholder="Enter your name"
                        value={join.name}
                        onChange={(e) => setJoin((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Room Code
                      </label>
                      <input
                        type="text"
                        name="roomCode"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
                        placeholder="Enter room code"
                        value={join.room}
                        onChange={(e) => setJoin((prev) => ({ ...prev, room: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      <p className="text-sm font-medium text-center">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isJoining}
                    className="w-full"
                  >
                    {isJoining ? 'Joining...' : 'Join Game'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Game Mode
                    </label>
                    <select
                      name="mode"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
                      value={create.mode}
                      onChange={(e) => setCreate((prev) => ({ ...prev, mode: e.target.value }))}
                      required
                    >
                      <option value="quick">Quick Game</option>
                      <option value="standard">Standard Game</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    className="w-full"
                  >
                    Create Room
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            How to <span className="bg-gradient-to-r from-indigo-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">Play</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Get started in seconds and enjoy bingo with friends anywhere in the world
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Why Choose <span className="bg-gradient-to-r from-indigo-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">Bit9o</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Modern bingo that brings people together, no matter where they are
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
