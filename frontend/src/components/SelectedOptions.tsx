import React, { useRef, useEffect } from 'react';
import { ArrowUp, ArrowLeft, ArrowRight, ArrowDown } from 'lucide-react';

interface SelectedOptionsProps {
  moves: string[];
}

const getArrowIcon = (move: string) => {
  switch (move) {
    case 'question':
      return <ArrowUp className="w-6 h-6 text-indigo-600" />;
    case 'puzzle':
      return <ArrowLeft className="w-6 h-6 text-indigo-600" />;
    case 'book':
      return <ArrowRight className="w-6 h-6 text-indigo-600" />;
    case 'back':
      return <ArrowDown className="w-6 h-6 text-indigo-600" />;
    default:
      return null;
  }
};

const SelectedOptions: React.FC<SelectedOptionsProps> = ({ moves }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [moves]);

  return (
    <div className="absolute top-4 right-4 max-w-md">
      <div 
        ref={scrollContainerRef}
        className="flex space-x-2 overflow-x-auto p-2 bg-white/80 rounded-lg shadow-lg scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-transparent"
        style={{
          scrollBehavior: 'smooth',
          msOverflowStyle: 'none',
          scrollbarWidth: 'thin'
        }}
      >
        {moves.map((move, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-12 h-12 bg-white rounded-lg shadow flex items-center justify-center"
          >
            {getArrowIcon(move)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedOptions;