import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowUp, ArrowLeft, ArrowRight } from 'lucide-react';
import { RootState } from '../store/store';
import { movePlayer, reduceLives, addMove, setAvailableMoves, updateGameTime, resetGameTime, addPoints } from '../store/gameSlice';
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
    availableMoves, 
    blockedCells,
    hasWon,
    isGameOver,
    gameTime,
    exitPosition,
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

  const userImage = localStorage.getItem('userImage');

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
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timerStarted, hasWon, isGameOver, gameTime]);

  useEffect(() => {
    updateAvailableMoves();
  }, [playerPosition, blockedCells]);

  useEffect(() => {
    if (isGameOver) {
      setTimerStarted(false);
      setTimeout(() => {
        navigate('/lost-game');
      }, 2000);
    }
  }, [isGameOver]);

  useEffect(() => {
    if (hasWon) {
      setTimerStarted(false);
      // Calculate final time with points and penalties, allowing negative values
      const finalTime = gameTime - (points * 2) + (livesLost * 10);
      localStorage.setItem('completionTime', finalTime.toString());
      localStorage.setItem('pointsScored', points.toString());
      setTimeout(() => {
        navigate('/completion');
      }, 2000);
    }
  }, [hasWon]);

  const isValidMove = (type: string): boolean => {
    const { x, y } = playerPosition;
    let newX = x;
    let newY = y;
    
    switch (type) {
      case 'question':
        newY = y - 1;
        break;
      case 'puzzle':
        newX = x - 1;
        break;
      case 'book':
        newX = x + 1;
        break;
      case 'pencil':
        newY = y + 1;
        break;
    }
    
    return (
      newX >= 0 && 
      newX < 10 && 
      newY >= 0 && 
      newY < 10 && 
      !blockedCells[newY][newX]
    );
  };

  const updateAvailableMoves = () => {
    const available: string[] = [];
    
    if (isValidMove('question')) available.push('question');
    if (isValidMove('puzzle')) available.push('puzzle');
    if (isValidMove('book')) available.push('book');
    if (isValidMove('pencil')) available.push('pencil');

    dispatch(setAvailableMoves(available));
  };

  const getCurrentContent = () => {
    return generateContent(
      selectedOptionType === 'puzzle' ? 'puzzle' : 'task',
      currentContentIndex
    );
  };

  const calculatePoints = (type: string, timeTaken: number) => {
    // Base points for each type
    const basePoints = {
      'question': 3,
      'puzzle': 8,
      'book': 12,
      'pencil': 10
    };

    // Time thresholds in seconds
    const timeThresholds = {
      'question': 30,
      'puzzle': 45,
      'book': 75,
      'pencil': 60
    };

    const basePoint = basePoints[type as keyof typeof basePoints] || 0;
    const threshold = timeThresholds[type as keyof typeof timeThresholds] || 30;

    // Calculate bonus points based on time taken
    let timeBonus = 0;
    if (timeTaken < threshold) {
      timeBonus = Math.floor((threshold - timeTaken) / 5); // 1 bonus point per 5 seconds under threshold
    }

    return basePoint + timeBonus;
  };

  const handleOptionClick = (type: string) => {
    if (!isValidMove(type)) {
      setAlertMessage('This path is blocked!');
      setShowAlert(true);
      return;
    }

    if (availableMoves.includes(type)) {
      setSelectedOptionType(type);
      setTaskStartTime(Date.now());
      
      if (type === 'question') {
        setShowQuestion(true);
      } else {
        setShowContent(true);
      }
    }
  };

  const handleAnswerSubmit = (isCorrect: boolean) => {
    const timeTaken = Math.floor((Date.now() - taskStartTime) / 1000);
    
    if (isCorrect && selectedOptionType) {
      const earnedPoints = calculatePoints(selectedOptionType, timeTaken);
      dispatch(addPoints(earnedPoints));
      const newPosition = { ...playerPosition };

      switch (selectedOptionType) {
        case 'question':
          newPosition.y -= 1;
          newPosition.rotation = 0;
          setCurrentQuestionIndex(prev => prev + 1);
          break;
        case 'puzzle':
          newPosition.x -= 1;
          newPosition.rotation = 270;
          setCurrentContentIndex(prev => prev + 1);
          break;
        case 'book':
          newPosition.x += 1;
          newPosition.rotation = 90;
          setCurrentContentIndex(prev => prev + 1);
          break;
        case 'pencil':
          newPosition.y += 1;
          newPosition.rotation = 180;
          setCurrentContentIndex(prev => prev + 1);
          break;
      }

      dispatch(movePlayer(newPosition));
    } else {
      dispatch(reduceLives());
      setAlertMessage(`Wrong answer! You lost a life! +10 seconds penalty`);
      setShowAlert(true);
    }
    setShowQuestion(false);
    setShowContent(false);
    setSelectedOptionType(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute top-4 left-4">
        <GameMap />
      </div>

      <SelectedOptions moves={moves} />
      <LivesDisplay lives={lives} />
      <Timer time={gameTime} />

      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-64 h-64">
              {availableMoves.includes('question') && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 text-white/40">
                  <ArrowUp className="w-8 h-8" />
                </div>
              )}
              {availableMoves.includes('puzzle') && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40">
                  <ArrowLeft className="w-8 h-8" />
                </div>
              )}
              {availableMoves.includes('book') && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40">
                  <ArrowRight className="w-8 h-8" />
                </div>
              )}
              {availableMoves.includes('pencil') && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white/40">
                  <ArrowDown className="w-8 h-8" />
                </div>
              )}
            </div>
          </div>

          {availableMoves.includes('question') && (
            <div className="absolute -top-48 left-1/2 -translate-x-1/2">
              <GameOption type="question" onClick={() => handleOptionClick('question')} />
            </div>
          )}
          {availableMoves.includes('puzzle') && (
            <div className="absolute top-1/2 -left-48 -translate-y-1/2">
              <GameOption type="puzzle" onClick={() => handleOptionClick('puzzle')} />
            </div>
          )}
          {availableMoves.includes('book') && (
            <div className="absolute top-1/2 -right-48 -translate-y-1/2">
              <GameOption type="book" onClick={() => handleOptionClick('book')} />
            </div>
          )}
          {availableMoves.includes('pencil') && (
            <div className="absolute -bottom-48 left-1/2 -translate-x-1/2">
              <GameOption type="pencil" onClick={() => handleOptionClick('pencil')} />
            </div>
          )}

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