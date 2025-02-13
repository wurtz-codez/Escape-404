import React from 'react';
import { useDispatch } from 'react-redux';
import { resetGame } from '../store/gameSlice';
import { Trophy } from 'lucide-react';

interface WinModalProps {
  isOpen: boolean;
}

const WinModal: React.FC<WinModalProps> = ({ isOpen }) => {
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handlePlayAgain = () => {
    dispatch(resetGame());
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h2>
          <p className="text-gray-600 mb-6">
            You've successfully completed the game! Would you like to play again?
          </p>
          <button
            onClick={handlePlayAgain}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinModal;