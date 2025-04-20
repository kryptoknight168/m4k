import React from 'react';
import { motion } from 'framer-motion';
import { Problem as ProblemType } from '../../types';
// Trigger Vercel redeploy
interface ProblemProps {
  problem: ProblemType;
  showFeedback: boolean;
  feedbackType: 'correct' | 'incorrect';
}

const Problem: React.FC<ProblemProps> = ({ problem, showFeedback, feedbackType }) => {
  if (!problem) return null;
  
  const { num1, num2, operation } = problem;
  
  // Format numbers (whole numbers or up to 2 decimal places)
  const formatNumber = (num: number): string => {
    if (Number.isInteger(num)) {
      return num.toString();
    }
    return num.toFixed(2);
  };

  return (
    <div className="relative">
        <motion.div
          className="text-center p-8 rounded-lg bg-white shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center items-center text-4xl md:text-6xl font-bold">
            <span>{formatNumber(num1)}</span>
            <span className="mx-4 text-blue-600">{operation}</span>
            <span>{formatNumber(num2)}</span>
            <span className="mx-4">=</span>
            <span className="text-4xl md:text-6xl">?</span>
          </div>
        </motion.div>
        
        {/* Feedback overlay */}
        {showFeedback && (
          <motion.div
            className={`absolute inset-0 flex items-center justify-center text-white text-5xl md:text-7xl font-bold rounded-lg
              ${feedbackType === 'correct' ? 'bg-green-500/80' : 'bg-red-500/80'}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {feedbackType === 'correct' ? '✓' : '✗'}
          </motion.div>
        )}
    </div>
  );
};

export default Problem;