import { create } from 'zustand';
import { 
  Problem, 
  Settings, 
  generateProblems, 
  getIncreasedDifficulty, 
  getDecreasedDifficulty 
} from '../utils/problemGenerator';

interface GameState {
  problems: Problem[];
  currentProblemIndex: number;
  settings: Settings;
  timePerProblem: number;
  isGameOver: boolean;
  score: {
    correct: number;
    total: number;
    percentage: number;
  };
  
  // Actions
  initializeGame: (settings: Settings) => void;
  submitAnswer: (answer: number) => void;
  nextProblem: () => void;
  endGame: () => void;
  resetGame: () => void;
}

// Default settings
const defaultSettings: Settings = {
  grade: 4,
  operations: {
    addition: true,
    subtraction: true,
    multiplication: true,
    division: true,
  },
  numberOfProblems: 10,
  timerSeconds: 30,
};

const useGameStore = create<GameState>((set, get) => ({
  // State
  problems: [],
  currentProblemIndex: 0,
  settings: defaultSettings,
  timePerProblem: defaultSettings.timerSeconds,
  isGameOver: false,
  score: {
    correct: 0,
    total: 0,
    percentage: 0,
  },
  
  // Actions
  initializeGame: (settings) => {
    const problems = generateProblems(settings);
    
    set({
      problems,
      currentProblemIndex: 0,
      settings,
      timePerProblem: settings.timerSeconds,
      isGameOver: false,
      score: {
        correct: 0,
        total: 0,
        percentage: 0,
      },
    });
  },
  
  submitAnswer: (answer) => {
    const { problems, currentProblemIndex, score } = get();
    const currentProblem = problems[currentProblemIndex];
    
    // Skip if already answered
    if (currentProblem.userAnswer !== undefined) return;
    
    // Check if answer is correct (with small epsilon for floating point errors)
    const isCorrect = Math.abs(answer - currentProblem.answer) < 0.0001;
    
    // Update problem with user's answer
    const updatedProblems = [...problems];
    updatedProblems[currentProblemIndex] = {
      ...currentProblem,
      userAnswer: answer,
      isCorrect,
    };
    
    // Update score
    const newCorrect = isCorrect ? score.correct + 1 : score.correct;
    const newTotal = score.total + 1;
    const newPercentage = (newCorrect / newTotal) * 100;
    
    // Determine if problem difficulty should change
    let updatedSettings = { ...get().settings };
    if (isCorrect) {
      updatedSettings = getIncreasedDifficulty(updatedSettings);
    } else {
      updatedSettings = getDecreasedDifficulty(updatedSettings);
    }
    
    set({
      problems: updatedProblems,
      score: {
        correct: newCorrect,
        total: newTotal,
        percentage: newPercentage,
      },
      settings: updatedSettings,
    });
  },
  
  nextProblem: () => {
    const { currentProblemIndex, problems } = get();
    
    if (currentProblemIndex < problems.length - 1) {
      set({ currentProblemIndex: currentProblemIndex + 1 });
    } else {
      // If we're at the last problem, end the game
      get().endGame();
    }
  },
  
  endGame: () => {
    // Mark any unanswered problems as incorrect
    const { problems } = get();
    const updatedProblems = problems.map(problem => {
      if (problem.userAnswer === undefined) {
        return { ...problem, userAnswer: 0, isCorrect: false };
      }
      return problem;
    });
    
    set({
      problems: updatedProblems,
      isGameOver: true,
    });
  },
  
  resetGame: () => {
    set({
      problems: [],
      currentProblemIndex: 0,
      isGameOver: false,
      score: {
        correct: 0,
        total: 0,
        percentage: 0,
      },
    });
  },
}));

export default useGameStore; 