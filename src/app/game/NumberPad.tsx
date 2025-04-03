import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface NumberPadProps {
  onNumberClick: (digit: string) => void;
  onClear: () => void;
  onDelete: () => void;
  onSubmit: () => void;
  userInput: string;
  disabled?: boolean;
}

const NumberPad: React.FC<NumberPadProps> = ({
  onNumberClick,
  onClear,
  onDelete,
  onSubmit,
  userInput,
  disabled = false,
}) => {
  // Buttons for the number pad
  const buttons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '-', '0', '⌫'
  ];
  
  // Animations for button press
  const buttonVariants = {
    rest: { scale: 1 },
    pressed: { scale: 0.95 },
  };
  
  // Add keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      
      // Prevent default behavior for these keys to avoid page scrolling
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', 'Backspace', 'Delete', 'Enter', 'Escape'].includes(e.key)) {
        e.preventDefault();
      }
      
      // Handle number keys and minus sign
      if (/^[0-9]$/.test(e.key)) {
        onNumberClick(e.key);
      } else if (e.key === '-') {
        onNumberClick('-');
      } 
      // Handle backspace/delete for deleting digits
      else if (e.key === 'Backspace' || e.key === 'Delete') {
        onDelete();
      } 
      // Handle enter for submitting
      else if (e.key === 'Enter') {
        onSubmit();
      } 
      // Handle escape for clearing
      else if (e.key === 'Escape') {
        onClear();
      }
    };
    
    // Add event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [disabled, onNumberClick, onDelete, onSubmit, onClear]);
  
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Input display */}
      <div className="bg-white rounded-lg p-4 mb-4 text-right text-2xl md:text-3xl font-bold shadow-md">
        {userInput || '0'}
      </div>
      
      {/* Number pad grid */}
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {buttons.map((btn) => (
          <motion.button
            key={btn}
            className={`
              py-4 text-xl md:text-2xl font-semibold rounded-lg shadow-md
              ${btn === '⌫' ? 'bg-red-500 text-white' : 'bg-white text-gray-800'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 active:bg-gray-200'}
            `}
            onClick={() => {
              if (disabled) return;
              
              if (btn === '⌫') {
                onDelete();
              } else {
                onNumberClick(btn);
              }
            }}
            disabled={disabled}
            variants={buttonVariants}
            initial="rest"
            whileHover={{ scale: 1.05 }}
            whileTap="pressed"
            transition={{ duration: 0.1 }}
          >
            {btn}
          </motion.button>
        ))}
      </div>
      
      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 md:gap-3 mt-2 md:mt-3">
        <motion.button
          className={`
            py-4 text-xl md:text-2xl font-semibold rounded-lg shadow-md bg-gray-200 text-gray-800
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300 active:bg-gray-400'}
          `}
          onClick={onClear}
          disabled={disabled}
          variants={buttonVariants}
          initial="rest"
          whileHover={{ scale: 1.05 }}
          whileTap="pressed"
          transition={{ duration: 0.1 }}
        >
          Clear
        </motion.button>
        
        <motion.button
          className={`
            py-4 text-xl md:text-2xl font-semibold rounded-lg shadow-md bg-blue-600 text-white
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 active:bg-blue-800'}
          `}
          onClick={onSubmit}
          disabled={disabled}
          variants={buttonVariants}
          initial="rest"
          whileHover={{ scale: 1.05 }}
          whileTap="pressed"
          transition={{ duration: 0.1 }}
        >
          Submit
        </motion.button>
      </div>
      
      {/* Keyboard shortcuts help */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Keyboard shortcuts: Numbers, '-' for negative, Enter to submit, Esc to clear, Backspace to delete</p>
      </div>
    </div>
  );
};

export default NumberPad;