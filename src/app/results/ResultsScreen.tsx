import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import useGameStore from '../../store/gameStore';
import useSettingsStore from '../../store/settingsStore';
import Button from '../../components/ui/button';

const ResultsScreen: React.FC = () => {
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
    navigate('/settings');
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
    if (score.percentage >= 80 && confettiCanvasRef.current) {
      const myConfetti = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true,
      });
      
      const duration = 3 * 1000;
      const end = Date.now() + duration;
      
      const colors = ['#0077FF', '#4CAF50', '#FFC107'];
      
      (function frame() {
        myConfetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        
        myConfetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [score.percentage]);
  
  // Check if there are any problems to display
  if (problems.length === 0) {
    // Redirect to welcome if there are no problems (user navigated directly to results)
    useEffect(() => {
      navigate('/');
    }, [navigate]);
    
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-100 to-purple-100">
      <div className="w-[500px] px-4">
        <motion.div 
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
  );
};

export default ResultsScreen; 