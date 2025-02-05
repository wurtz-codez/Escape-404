import React, { useState, useCallback } from 'react';
import { MapPin, User, ArrowDown, ArrowUp, ArrowLeft, ArrowRight } from 'lucide-react';
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import GameOption from './components/GameOption';
import QuestionModal from './components/QuestionModal';
import ContentModal from './components/ContentModal';
import SelectedOptions from './components/SelectedOptions';
import LivesDisplay from './components/LivesDisplay';
import AlertModal from './components/AlertModal';
import { questions } from './data/questions';
import { generateContent } from './data/content';

function App() {
  const [showQuestion, setShowQuestion] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [moves, setMoves] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [selectedOptionType, setSelectedOptionType] = useState<string | null>(null);
  const [lives, setLives] = useState(3);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const handleOptionClick = (type: string) => {
    setSelectedOptionType(type);
    if (type === 'question') {
      setShowQuestion(true);
    } else {
      setShowContent(true);
    }
  };

  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (isCorrect && selectedOptionType) {
      setMoves([...moves, selectedOptionType]);
      if (selectedOptionType === 'question') {
        setCurrentQuestionIndex(prev => prev + 1);
      } else if (selectedOptionType === 'puzzle') {
        setCurrentPuzzleIndex(prev => prev + 1);
      } else if (selectedOptionType === 'book') {
        setCurrentTaskIndex(prev => prev + 1);
      }
    } else {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives === 0) {
          setAlertMessage('LOST ALL LIVES. ESCAPE INCOMPLETE');
        } else {
          setAlertMessage('YOU LOST A LIFE!!!');
        }
        setShowAlert(true);
        return newLives;
      });
    }
    setShowQuestion(false);
    setShowContent(false);
    setSelectedOptionType(null);
  };

  const handleGoBack = () => {
    if (moves.length > 0) {
      const lastMove = moves[moves.length - 1];
      if (lastMove === 'question') {
        setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
      } else if (lastMove === 'puzzle') {
        setCurrentPuzzleIndex(prev => Math.max(0, prev - 1));
      } else if (lastMove === 'book') {
        setCurrentTaskIndex(prev => Math.max(0, prev - 1));
      }
      setMoves([...moves.slice(0, -1), 'back']);
    }
  };

  const getCurrentContent = () => {
    if (selectedOptionType === 'puzzle') {
      return generateContent('puzzle', currentPuzzleIndex);
    }
    return generateContent('task', currentTaskIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            opacity: 0
          },
          fpsLimit: 120,
          particles: {
            color: {
              value: "#ffffff"
            },
            links: {
              enable: true,
              color: "#ffffff",
              opacity: 0.2
            },
            move: {
              enable: true,
              speed: 0.8,
              direction: "none",
              random: true,
              straight: false,
              outModes: {
                default: "bounce"
              }
            },
            number: {
              value: 80,
              density: {
                enable: true,
                area: 800
              }
            },
            size: {
              value: { min: 1, max: 2 }
            },
            opacity: {
              value: { min: 0.1, max: 0.3 }
            }
          }
        }}
      />

      {/* Map Section */}
      <div className="absolute top-4 left-4 w-64 h-64 bg-white/90 rounded-lg shadow-lg p-2">
        <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
          <MapPin className="w-8 h-8 text-gray-400" />
          <span className="ml-2">Map will be loaded here</span>
        </div>
      </div>

      {/* Team Name */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 px-6 py-3 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-indigo-600">Team Name: Escape Masters</h1>
      </div>

      {/* Selected Options Display */}
      <SelectedOptions moves={moves} />

      {/* Lives Display */}
      <LivesDisplay lives={lives} />

      {/* Main Game Area */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          {/* Direction Arrows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-64 h-64">
              {/* Up Arrow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 text-white/40">
                <ArrowUp className="w-8 h-8" />
              </div>
              {/* Left Arrow */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40">
                <ArrowLeft className="w-8 h-8" />
              </div>
              {/* Right Arrow */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40">
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Top Option */}
          <div className="absolute -top-48 left-1/2 -translate-x-1/2">
            <GameOption
              type="question"
              onClick={() => handleOptionClick('question')}
            />
          </div>

          {/* Left Option */}
          <div className="absolute top-1/2 -left-48 -translate-y-1/2">
            <GameOption
              type="puzzle"
              onClick={() => handleOptionClick('puzzle')}
            />
          </div>

          {/* Right Option */}
          <div className="absolute top-1/2 -right-48 -translate-y-1/2">
            <GameOption
              type="book"
              onClick={() => handleOptionClick('book')}
            />
          </div>

          {/* Player */}
          <div className="w-24 h-24 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
            <User className="w-12 h-12 text-indigo-600" />
          </div>

          {/* Back Option */}
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2">
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
            >
              <ArrowDown className="w-8 h-8 text-indigo-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Question Modal */}
      {showQuestion && (
        <QuestionModal
          isOpen={showQuestion}
          onClose={() => setShowQuestion(false)}
          onSubmit={handleAnswerSubmit}
          question={questions[currentQuestionIndex % questions.length]}
        />
      )}

      {/* Content Modal */}
      {showContent && selectedOptionType && selectedOptionType !== 'question' && (
        <ContentModal
          isOpen={showContent}
          onClose={() => setShowContent(false)}
          onSubmit={handleAnswerSubmit}
          content={getCurrentContent()}
        />
      )}

      {/* Alert Modal */}
      <AlertModal
        isOpen={showAlert}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
}

export default App;