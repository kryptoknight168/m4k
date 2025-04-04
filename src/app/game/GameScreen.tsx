import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Problem from './Problem';
import NumberPad from './NumberPad';
import Progress from './Progress';
import useGameLogic from '../../hooks/useGameLogic';
import useSettingsStore from '../../store/settingsStore';

const GameScreen: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettingsStore();
  const [showQuitConfirmation, setShowQuitConfirmation] = useState(false);
  
  const {
    userInput,
    addDigit,
    deleteDigit,
    clearInput,
    handleSubmit,
    currentProblem,
    currentProblemIndex,
    totalProblems,
    isGameOver,
    time,
    showFeedback,
    feedbackType,
  } = useGameLogic({ settings });
  
  const handleQuit = () => {
    setShowQuitConfirmation(true);
  };
  
  const confirmQuit = () => {
    navigate('/');
  };
  
  const cancelQuit = () => {
    setShowQuitConfirmation(false);
  };
  
  // Redirect to results when game is over
  useEffect(() => {
    if (isGameOver) {
      navigate('/results');
    }
  }, [isGameOver, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-100 to-purple-100">
      <div className="w-full max-w-3xl mx-auto relative">
        {/* Quit button */}
        <div className="absolute -top-16 right-0">
          <button 
            onClick={handleQuit}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Quit
          </button>
        </div>
        
        {/* Quit Confirmation Popup */}
        {showQuitConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl text-center">
              <h2 className="text-xl font-bold mb-4">Quit Game?</h2>
              <p className="mb-6">Are you sure you want to quit the game?</p>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={confirmQuit}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Quit
                </button>
                <button 
                  onClick={cancelQuit}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Header with problem number and timer */}
        <div className="mb-6 flex flex-col items-center">
          <div className="text-center text-xl font-semibold mb-2">
            Problem {currentProblemIndex + 1} of {totalProblems}
          </div>
          <Progress
            currentProblem={currentProblemIndex}
            totalProblems={totalProblems}            
            timeRemaining={time}
            timePerProblem={settings.timerSeconds}
          />
        </div>
        
        {/* Problem display */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProblemIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {currentProblem && (
                <Problem
                  problem={currentProblem}
                  showFeedback={showFeedback}
                  feedbackType={feedbackType}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Number input pad */}
        <div>
          <NumberPad
            userInput={userInput}
            onNumberClick={addDigit}
            onDelete={deleteDigit}
            onClear={clearInput}
            onSubmit={handleSubmit}
            disabled={showFeedback}
          />
        </div>
      </div>
    </div>
  );
};

export default GameScreen; 