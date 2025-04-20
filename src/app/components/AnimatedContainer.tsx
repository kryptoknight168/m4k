import React from 'react';

interface AnimatedContainerProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide';
  className?: string;
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  animation = 'fade',
  className = '',
}) => {
  // Simple fade-in animation using Tailwind CSS classes
  const animationClasses =
    animation === 'fade'
      ? 'transition-opacity duration-500 opacity-100'
      : animation === 'slide'
      ? 'transition-transform duration-500 translate-y-0'
      : '';

  return (
    <div className={`${animationClasses} ${className}`}>
      {children}
    </div>
  );
};

export default AnimatedContainer;
