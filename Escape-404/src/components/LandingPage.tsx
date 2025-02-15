import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import Logo from '../images/Logo.png';
import '../effects/typewriter.css'; // Import the typewriter CSS

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
          <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 typewriter-box">
            ESCAPE-404
          </div>
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

      <div className="absolute bottom-4 left-4 text-lg bg-black/40 p-4 rounded-lg backdrop-blur-sm">
        <ul className="text-white">
          <li className="font-semibold mb-2">Developers:</li>
          <li className="ml-4">
            <a href="https://github.com/nihalawasthi" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Nihal Awasthi
            </a>
          </li>
          <li className="ml-4">
            <a href="https://github.com/wurtz-codez" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Koustubh Pande
            </a>
          </li>
          <li className="ml-4">
            <a href="https://github.com/Asceptic07" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Swanik Srivastava
            </a>
          </li>
        </ul>
      </div>
      
      <footer className="absolute bottom-4 right-4 text-white p-4 rounded-lg backdrop-blur-sm">
        <p className="font-bold">2025 © All rights reserved by Eureka Club</p>
      </footer>

    </div>
  );
};

export default LandingPage;