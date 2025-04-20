import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import useGameStore from '../../store/gameStore';
import useSettingsStore from '../../store/settingsStore';
import Button from '../../components/ui/button';

const ResultsScreen: React.FC = () => {
  const location = useLocation();
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { problems, score, resetGame } = useGameStore();
  const { settings } = useSettingsStore();
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const handlePlayAgain = () => {
    resetGame();
    // Initialize a new game with the current settings and navigate directly to game
    useGameStore.getState().initializeGame(settings);
    navigate('/game');
  };
  
  const handleChangeSettings = () => {
    resetGame();
    setTimeout(() => {
      navigate('/settings');
    }, 0);
  };

  
  // Calculate letter grade based on percentage
  const getLetterGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };
  
  // Get a message based on the score
  const getMessage = (percentage: number): string => {
    if (percentage >= 90) return 'Excellent Work!';
    if (percentage >= 80) return 'Great Job!';
    if (percentage >= 70) return 'Good Effort!';
    if (percentage >= 60) return 'Keep Practicing!';
    return 'Try Again!';
  };
  
  // Show confetti for high scores
  useEffect(() => {
    if (score.percentage >= 90 && confettiCanvasRef.current) {
      // Set canvas size to match viewport
      confettiCanvasRef.current.width = window.innerWidth;
      confettiCanvasRef.current.height = window.innerHeight;
      requestAnimationFrame(() => {
        if (!confettiCanvasRef.current) return;
        const myConfetti = confetti.create(confettiCanvasRef.current, {
          resize: true,
          useWorker: true,
        });

        const duration = 3 * 1000;
        const end = Date.now() + duration;

        // Vibrant, varied color set
        const colors = [
          '#0077FF', '#4CAF50', '#FFC107', '#FF3B30', '#FF6F00', '#9C27B0',
          '#00BCD4', '#FFEB3B', '#E91E63', '#8BC34A', '#FF9800', '#FF00FF', '#00FFB3', '#FFD600', '#C51162', '#00C853', '#D500F9', '#FF1744', '#304FFE', '#00B8D4'
        ];

        (function frame() {
          myConfetti({
            particleCount: 4,
            angle: 60,
            spread: 70,
            startVelocity: 55,
            origin: { x: 0, y: 1 }, // bottom left
            colors: colors,
          });
          myConfetti({
            particleCount: 4,
            angle: 120,
            spread: 70,
            startVelocity: 55,
            origin: { x: 1, y: 1 }, // bottom right
            colors: colors,
          });
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        })();
      });
    }
  }, [score.percentage]);
  
  // Redirect to welcome if there are no problems (user navigated directly to results)
  useEffect(() => {
    if (
      problems.length === 0 &&
      location.pathname !== '/settings'
    ) {
      navigate('/');
    }
  }, [problems.length, navigate, location.pathname]);

  if (problems.length === 0) {
    return null;
  }
  
    return (
    <>
      {/* Confetti Canvas - must be present for confetti to show */}
      <canvas ref={confettiCanvasRef} className="fixed inset-0 pointer-events-none z-50" />
      {/* Confetti Canvas - fixed, covers viewport, pointerEvents none */}
      <canvas
        ref={confettiCanvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 50,
        }}
        width={typeof window !== 'undefined' ? window.innerWidth : 1920}
        height={typeof window !== 'undefined' ? window.innerHeight : 1080}
      />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-100 to-purple-100">
        <div className="w-full max-w-4xl px-4 text-center">
          <motion.div 
            ref={cardRef}
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-6">Results</h1>
            {/* Score summary */}
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-gray-800 mb-2">
                {score.percentage.toFixed(0)}%
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-4">
                {getLetterGrade(score.percentage)} - {getMessage(score.percentage)}
              </div>
              <div className="text-gray-600">
                You got {score.correct} out of {score.total} problems correct.
              </div>
            </div>
            {/* Problem summary */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Problem Summary</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {problems.map((problem, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg ${problem.isCorrect 
                      ? 'bg-green-100 border-l-4 border-green-500' 
                      : 'bg-red-100 border-l-4 border-red-500'}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span>{problem.num1} {problem.operation} {problem.num2} = {problem.answer}</span>
                      </div>
                      <div>
                        {problem.isCorrect ? (
                          <span className="text-green-600 font-semibold">✓ Correct</span>
                        ) : (
                          <span className="text-red-600 font-semibold">
                            ✗ You answered: {problem.userAnswer}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-6">
            <Button 
              variant="secondary" 
              onClick={handleChangeSettings}
              className="order-2 sm:order-1"
            >
              Change Settings
            </Button>
            <Button 
              onClick={handlePlayAgain}
              className="order-1 sm:order-2"
            >
              Play Again
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsScreen;