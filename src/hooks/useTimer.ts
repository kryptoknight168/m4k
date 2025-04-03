import { useState, useEffect, useCallback, useRef } from 'react';

interface TimerHookProps {
  initialTime: number;
  onTimeout?: () => void;
  autoStart?: boolean;
}

interface TimerHookReturn {
  time: number;
  isRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (newTime?: number) => void;
  percentRemaining: number;
}

const useTimer = ({
  initialTime,
  onTimeout,
  autoStart = false,
}: TimerHookProps): TimerHookReturn => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [initialTimeState, setInitialTimeState] = useState(initialTime);
  const timeoutCallback = useRef(onTimeout);
  
  // Update callback ref when onTimeout changes
  useEffect(() => {
    timeoutCallback.current = onTimeout;
  }, [onTimeout]);
  
  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);
  
  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);
  
  const resetTimer = useCallback((newTime?: number) => {
    const resetValue = newTime !== undefined ? newTime : initialTimeState;
    setTime(resetValue);
    setInitialTimeState(resetValue);
    setIsRunning(false);
  }, [initialTimeState]);
  
  // Calculate percentage of time remaining
  const percentRemaining = (time / initialTimeState) * 100;
  
  // Timer countdown effect
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning && time > 0) {
      interval = window.setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;
          
          // If time reaches 0, run onTimeout callback and stop the timer
          if (newTime <= 0 && timeoutCallback.current) {
            timeoutCallback.current();
            setIsRunning(false);
            return 0;
          }
          
          return newTime;
        });
      }, 1000); // Update every second
    }
    
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isRunning, time]);
  
  return {
    time,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    percentRemaining,
  };
};

export default useTimer; 