import { useState, useCallback, useEffect } from 'react';
import useGameStore from '../store/gameStore';
import useTimer from './useTimer';
import { Settings } from '../utils/problemGenerator';

interface UseGameLogicProps {
  settings: Settings;
}

const useGameLogic = ({ settings }: UseGameLogicProps) => {
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect'>('correct');
  
  // Get game state from store
  const { 
    problems, 
    currentProblemIndex, 
    score,
    isGameOver,
    initializeGame,
    submitAnswer,
    nextProblem,
    endGame,
  } = useGameStore();
  
  // Get current problem
  const currentProblem = problems[currentProblemIndex] || null;
  
  // Set up timer
  const { 
    time, 
    startTimer, 
    resetTimer, 
    percentRemaining,
  } = useTimer({
    initialTime: settings.timerSeconds,
    onTimeout: () => {
      if (currentProblem && currentProblem.userAnswer === undefined) {
        handleSubmit();
      }
    },
  });
  
  // Initialize game
  useEffect(() => {
    initializeGame(settings);
  }, [initializeGame, settings]);
  
  // Start timer when a new problem is displayed
  useEffect(() => {
    if (currentProblem && !isGameOver) {
      resetTimer(settings.timerSeconds);
      startTimer();
    }
  }, [currentProblemIndex, currentProblem, isGameOver, resetTimer, settings.timerSeconds, startTimer]);
  
  // Handle number input
  const handleNumberInput = useCallback((value: string) => {
    // Allow numbers, decimal point, and negative sign
    if (!/^-?[0-9.]*$/.test(value) && value !== '') return;
    
    // Don't allow multiple decimal points
    if (value.split('.').length > 2) return;
    
    setUserInput(value);
  }, []);
  
  // Add digit to input
  const addDigit = useCallback((digit: string) => {
    setUserInput(prev => {
      // Check if adding another decimal point
      if (digit === '.' && prev.includes('.')) return prev;
      
      // Handle negative sign - only allow at the beginning
      if (digit === '-') {
        // Toggle negative sign if at the beginning
        if (prev.startsWith('-')) {
          return prev.substring(1);
        }
        // Only add negative at the beginning
        if (prev === '') {
          return '-';
        }
        return prev;
      }
      
      // Limit to reasonable length
      if (prev.length >= 10) return prev;
      
      return prev + digit;
    });
  }, []);
  
  // Delete last digit
  const deleteDigit = useCallback(() => {
    setUserInput(prev => prev.slice(0, -1));
  }, []);
  
  // Clear input
  const clearInput = useCallback(() => {
    setUserInput('');
  }, []);
  
  // Submit answer
  const handleSubmit = useCallback(() => {
    if (!currentProblem) return;
    
    // If no input, treat as 0
    const answer = userInput === '' ? 0 : parseFloat(userInput);
    
    // Submit to store
    submitAnswer(answer);
    
    // Show feedback
    const isCorrect = Math.abs(answer - currentProblem.answer) < 0.0001;
    setFeedbackType(isCorrect ? 'correct' : 'incorrect');
    setShowFeedback(true);
    
    // Clear input for next problem
    setUserInput('');
    
    // Move to next problem after a delay
    setTimeout(() => {
      setShowFeedback(false);
      nextProblem();
    }, 1500);
  }, [currentProblem, userInput, submitAnswer, nextProblem]);
  
  return {
    userInput,
    setUserInput: handleNumberInput,
    addDigit,
    deleteDigit,
    clearInput,
    handleSubmit,
    currentProblem,
    currentProblemIndex,
    totalProblems: problems.length,
    score,
    isGameOver,
    endGame,
    time,
    percentRemaining,
    showFeedback,
    feedbackType,
  };
};

export default useGameLogic; 