import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowUp, ArrowLeft, ArrowRight } from 'lucide-react';
import { RootState } from '../store/store';
import {
  movePlayer,
  reduceLives,
  addMove,
  setAvailableMoves,
  updateGameTime,
  resetGameTime,
  addPoints
} from '../store/gameSlice';
import { questions } from '../data/questions';
import { generateContent } from '../data/content';
import GameMap from './GameMap';
import GameOption from './GameOption';
import QuestionModal from './QuestionModal';
import ContentModal from './ContentModal';
import SelectedOptions from './SelectedOptions';
import LivesDisplay from './LivesDisplay';
import AlertModal from './AlertModal';
import WinModal from './WinModal';
import Timer from './Timer';
import GameOverModal from './GameOverModal';

const GameComponent: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    playerPosition, 
    lives, 
    moves, 
    blockedCells,
    hasWon,
    isGameOver,
    gameTime,
    points,
    livesLost
  } = useSelector((state: RootState) => state.game);
  
  const [showQuestion, setShowQuestion] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedOptionType, setSelectedOptionType] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [taskStartTime, setTaskStartTime] = useState<number>(0);

  // Mapping each option to a direction (top, left, right, bottom)
  const [iconPositions, setIconPositions] = useState<{ [key: string]: string }>({
    question: 'top',
    puzzle: 'left',
    book: 'right',
    pencil: 'bottom'
  });

  const userImage = localStorage.getItem('userImage');

  // Helper: Given a position, return movement delta and rotation.
  const getDeltaAndRotation = (pos: string) => {
    let dx = 0, dy = 0, rotation = 0;
    if (pos === 'top') {
      dy = -1;
      rotation = 0;
    } else if (pos === 'left') {
      dx = -1;
      rotation = 270;
    } else if (pos === 'right') {
      dx = 1;
      rotation = 90;
    } else if (pos === 'bottom') {
      dy = 1;
      rotation = 180;
    }
    return { dx, dy, rotation };
  };

  // Start timer when component mounts
  useEffect(() => {
    dispatch(resetGameTime());
    setTimerStarted(true);
  }, []);

  // Handle timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (timerStarted && !hasWon && !isGameOver) {
      timer = setInterval(() => {
        dispatch(updateGameTime(gameTime + 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timerStarted, hasWon, isGameOver, gameTime]);

  // Update available moves whenever playerPosition, blockedCells, or iconPositions change.
  useEffect(() => {
    updateAvailableMoves();
  }, [playerPosition, blockedCells, iconPositions]);

  useEffect(() => {
    if (isGameOver) {
      setTimerStarted(false);
      setTimeout(() => navigate('/lost-game'), 2000);
    }
  }, [isGameOver]);

  useEffect(() => {
    if (hasWon) {
      setTimerStarted(false);
      const finalTime = gameTime - (points * 2) + (livesLost * 10);
      localStorage.setItem('completionTime', finalTime.toString());
      localStorage.setItem('pointsScored', points.toString());
      setTimeout(() => navigate('/completion'), 2000);
    }
  }, [hasWon]);

  // Validate move using the current iconPositions mapping
  const isValidMove = (type: string): boolean => {
    const { x, y } = playerPosition;
    const pos = iconPositions[type];
    const { dx, dy } = getDeltaAndRotation(pos);
    const newX = x + dx;
    const newY = y + dy;
    return (
      newX >= 0 && newX < 10 &&
      newY >= 0 && newY < 10 &&
      !blockedCells[newY][newX]
    );
  };

  // Update available moves based on dynamic directions.
  const updateAvailableMoves = () => {
    const available: string[] = [];
    const optionTypes = ['question', 'puzzle', 'book', 'pencil'];
    optionTypes.forEach((type) => {
      if (isValidMove(type)) available.push(type);
    });
    dispatch(setAvailableMoves(available));
  };

  const getCurrentContent = () => {
    return generateContent(
      selectedOptionType === 'puzzle' ? 'puzzle' : 'task',
      currentContentIndex
    );
  };

  const calculatePoints = (type: string, timeTaken: number) => {
    const basePoints = {
      question: 3,
      puzzle: 8,
      book: 12,
      pencil: 10
    };
    const timeThresholds = {
      question: 30,
      puzzle: 45,
      book: 75,
      pencil: 60
    };
    const basePoint = basePoints[type as keyof typeof basePoints] || 0;
    const threshold = timeThresholds[type as keyof typeof timeThresholds] || 30;
    let timeBonus = 0;
    if (timeTaken < threshold) {
      timeBonus = Math.floor((threshold - timeTaken) / 5);
    }
    return basePoint + timeBonus;
  };

  const handleOptionClick = (type: string) => {
    if (!isValidMove(type)) {
      setAlertMessage('This path is blocked!');
      setShowAlert(true);
      return;
    }
    // Record the option type and start the task.
    setSelectedOptionType(type);
    setTaskStartTime(Date.now());
    if (type === 'question') {
      setShowQuestion(true);
    } else {
      setShowContent(true);
    }
  };

  // Helper: Shuffle an array (Fisher–Yates shuffle)
  const shuffleArray = (array: string[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Shuffle iconPositions ensuring that options are remapped.
  const shuffleIconPositions = () => {
    const positions = ['top', 'left', 'right', 'bottom'];
    const keys = ['question', 'puzzle', 'book', 'pencil'];
    let newPermutation: string[];
    let attempts = 0;
    do {
      newPermutation = shuffleArray(positions);
      attempts++;
    } while (
      keys.some((key, index) => newPermutation[index] === iconPositions[key] && keys.length > 1) &&
      attempts < 10
    );
    const updatedMapping: { [key: string]: string } = {};
    keys.forEach((key, index) => {
      updatedMapping[key] = newPermutation[index];
    });
    setIconPositions(updatedMapping);
  };

  const handleAnswerSubmit = (isCorrect: boolean) => {
    const timeTaken = Math.floor((Date.now() - taskStartTime) / 1000);
    const newPosition = { ...playerPosition };

    if (isCorrect && selectedOptionType) {
      const earnedPoints = calculatePoints(selectedOptionType, timeTaken);
      dispatch(addPoints(earnedPoints));

      // Determine movement based on the current icon's position.
      const currentPos = iconPositions[selectedOptionType];
      const { dx, dy, rotation } = getDeltaAndRotation(currentPos);
      newPosition.x += dx;
      newPosition.y += dy;
      newPosition.rotation = rotation;

      // Update indices for questions or content.
      if (selectedOptionType === 'question') {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setCurrentContentIndex(prev => prev + 1);
      }
      dispatch(movePlayer(newPosition));

      // Determine arrow direction based on the icon's position.
      let arrowDirection = "";
      if (currentPos === "top") arrowDirection = "up";
      else if (currentPos === "left") arrowDirection = "left";
      else if (currentPos === "right") arrowDirection = "right";
      else if (currentPos === "bottom") arrowDirection = "down";

      // Add the arrow direction to the moves display in the top-right.
      dispatch(addMove(arrowDirection));
    } else {
      dispatch(reduceLives());
      setAlertMessage(`Wrong answer! You lost a life! +10 seconds penalty`);
      setShowAlert(true);
    }
    setShowQuestion(false);
    setShowContent(false);
    setSelectedOptionType(null);

    // Shuffle icon positions after each move.
    shuffleIconPositions();
  };

  // CSS classes for positioning the option icons.
  const positionClasses: { [key: string]: string } = {
    top: "absolute -top-48 left-1/2 -translate-x-1/2",
    left: "absolute top-1/2 -left-48 -translate-y-1/2",
    right: "absolute top-1/2 -right-48 -translate-y-1/2",
    bottom: "absolute -bottom-48 left-1/2 -translate-x-1/2"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute top-4 left-4">
        <GameMap />
      </div>

      {/* Moves display in the top-right white box */}
      <SelectedOptions moves={moves} />

      <LivesDisplay lives={lives} />
      <Timer time={gameTime} />

      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          {/* Render option icons at their dynamically assigned positions */}
          {['question', 'puzzle', 'book', 'pencil'].map((optionKey) => {
            if (!isValidMove(optionKey)) return null;
            const pos = iconPositions[optionKey];
            return (
              <div key={optionKey} className={positionClasses[pos]}>
                <GameOption type={optionKey} onClick={() => handleOptionClick(optionKey)} />
              </div>
            );
          })}

          {/* Player image */}
          <div 
            className="w-24 h-24 rounded-full bg-white/90 shadow-lg flex items-center justify-center overflow-hidden"
            style={{ transform: `rotate(${playerPosition.rotation}deg)` }}
          >
            {userImage ? (
              <img 
                src={userImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-xl">?</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {showQuestion && (
        <QuestionModal
          isOpen={showQuestion}
          onClose={() => setShowQuestion(false)}
          onSubmit={handleAnswerSubmit}
          question={questions[currentQuestionIndex % questions.length]}
        />
      )}

      {showContent && selectedOptionType && selectedOptionType !== 'question' && (
        <ContentModal
          isOpen={showContent}
          onClose={() => setShowContent(false)}
          onSubmit={handleAnswerSubmit}
          content={getCurrentContent()}
        />
      )}

      <AlertModal
        isOpen={showAlert}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />

      <WinModal isOpen={hasWon} />
      <GameOverModal isOpen={isGameOver} />

      <footer className="absolute bottom-4 w-full text-center text-white">
        <p>2025 © All rights reserved by Eureka Club</p>
      </footer>
    </div>
  );
};

export default GameComponent;
