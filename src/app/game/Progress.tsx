import React from 'react';
import { motion } from 'framer-motion';

interface ProgressProps {
  currentProblem: number;
  totalProblems: number;
  timeRemaining: number;
  timePerProblem: number;
}

const Progress: React.FC<ProgressProps> = ({
  currentProblem,
  totalProblems,
  timeRemaining,
  timePerProblem,
}) => {

  // Calculate time percentage
  const timePercentage = (timeRemaining / timePerProblem) * 100;
  
  // Format time remaining as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="w-full">
      {/* Problem counter */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">
          Problem {currentProblem + 1} of {totalProblems}
        </span>
        
        {timePerProblem > 0 && (
          <span className="text-sm font-medium text-gray-700">
            Time: {formatTime(timeRemaining)}
          </span>
        )}
      </div>
      
      {/* Timer progress bar (only if timer is enabled) */}
      {timePerProblem > 0 && (
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${timePercentage > 66 
              ? 'bg-green-500' 
              : timePercentage > 33 
                ? 'bg-yellow-500' 
                : 'bg-red-500'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${timePercentage}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
      )}
    </div>
  );
};

export default Progress; 