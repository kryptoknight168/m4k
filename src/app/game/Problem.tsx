import React from 'react';
import { motion } from 'framer-motion';
import { Problem as ProblemType } from '../../types';

interface ProblemProps {
  problem: ProblemType;
  showFeedback: boolean;
  feedbackType: 'correct' | 'incorrect';
}

const Problem: React.FC<ProblemProps> = ({ problem, showFeedback, feedbackType }) => {
  if (!problem) return null;
  
  const { num1, num2, operation, answer } = problem;
  
  // Format numbers (whole numbers or up to 2 decimal places)
  const formatNumber = (num: number): string => {
    if (Number.isInteger(num)) {
      return num.toString();
    }
    return num.toFixed(2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`text-center text-4xl md:text-6xl font-bold ${
        showFeedback ? (feedbackType === 'correct' ? 'text-green-600' : 'text-red-600') : 'text-blue-700'
      }`}
    >
      {formatNumber(num1)} {operation} {formatNumber(num2)} = {answer !== undefined ? formatNumber(answer) : '?'}
    </motion.div>
  );
};

export default Problem;