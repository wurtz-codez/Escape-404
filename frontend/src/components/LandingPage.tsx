import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import Logo from '../images/Logo.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              enable: true,
              speed: 3,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="flex justify-center mb-8">
          <img src={Logo} alt="Eureka Club Logo" className="w-64 h-64 mb-4" />
        </div>
        
        <div className="mb-12 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-white mb-2">Eureka Club</h1>
          <h2 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">
            ESCAPE-404
          </h2>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate('/game')}
            className="w-64 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all duration-300 border border-white/20"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage