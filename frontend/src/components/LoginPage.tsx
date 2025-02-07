import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo, just check if team exists in localStorage
    const storedTeam = localStorage.getItem('teamData');
    if (storedTeam) {
      const teamData = JSON.parse(storedTeam);
      if (teamData.teamName === teamName) {
        // Store current team name for game page
        localStorage.setItem('currentTeam', teamName);
        navigate('/game');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-md w-full border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-8">Start Game</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full bg-black/50 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-white/50 outline-none"
              placeholder="Enter your team name"
              required
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-white/50 outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-lg transition-all duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;