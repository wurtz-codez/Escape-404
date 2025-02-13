import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { ArrowUp } from 'lucide-react';

const GameMap: React.FC = () => {
  const { 
    playerPosition, 
    visitedCells, 
    blockedCells,
    startPosition,
    exitPosition 
  } = useSelector((state: RootState) => state.game);

  return (
    <div className="w-48 h-48 bg-white/90 rounded-lg shadow-lg p-2">
      <div className="w-full h-full bg-gray-100 rounded grid grid-cols-6 grid-rows-6 gap-0.5">
        {visitedCells.map((row, y) => (
          row.map((visited, x) => {
            const isStart = x === startPosition.x && y === startPosition.y;
            const isExit = x === exitPosition.x && y === exitPosition.y;
            const isBlocked = blockedCells[y][x];
            const isPlayer = x === playerPosition.x && y === playerPosition.y;

            return (
              <div
                key={`${x}-${y}`}
                className={`
                  relative
                  ${visited ? 'bg-indigo-200' : 'bg-gray-300'}
                  ${isStart ? 'bg-blue-300' : ''}
                  ${isExit ? 'bg-green-300' : ''}
                  ${isBlocked ? 'bg-red-400' : ''}
                  transition-all duration-300
                `}
              >
                {isPlayer && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center transform"
                    style={{ transform: `rotate(${playerPosition.rotation}deg)` }}
                  >
                    <ArrowUp className="w-4 h-4 text-indigo-600" />
                  </div>
                )}
                {isStart && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-blue-700">START</span>
                  </div>
                )}
                {isExit && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-green-700">END</span>
                  </div>
                )}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default GameMap;