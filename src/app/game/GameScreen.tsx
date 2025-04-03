import React, { useEffect } from 'react';
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
  
  // Redirect to results when game is over
  useEffect(() => {
    if (isGameOver) {
      navigate('/results');
    }
  }, [isGameOver, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-100 to-purple-100">
      <div className="w-full max-w-3xl mx-auto">
        {/* Header with progress */}
        <div className="mb-6">
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