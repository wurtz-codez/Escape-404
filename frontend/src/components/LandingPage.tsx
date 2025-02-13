import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2 } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="mb-8">
        <Code2 className="w-24 h-24 text-white" />
      </div>
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Eureka Club</h1>
        <h2 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">
          ESCAPE-404
        </h2>
      </div>

      <button
        onClick={() => navigate('/game')}
        className="w-64 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all duration-300 border border-white/20"
      >
        Start Game
      </button>
    </div>
  );
};

export default LandingPage;