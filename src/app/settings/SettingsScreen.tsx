import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from "../components/Button";
import AnimatedContainer from "../components/AnimatedContainer";
import GradeSelect from './GradeSelect';
import OperationsSelect from './OperationsSelect';
import NumberOfProblemsInput from './NumberOfProblemsInput';
import TimerInput from './TimerInput';
import useSettingsStore from '../../store/settingsStore';

const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { settings, loadSettings } = useSettingsStore();

  // Load settings when component mounts
  useEffect(() => {   
    loadSettings();
  }, [loadSettings]);

  const handleStartGame = () => {
    navigate('/game');
  };

  const handleBackToWelcome = () => {
    navigate('/');
  };

  // Check if at least one operation is selected
  const isStartDisabled = !Object.values(settings.operations).some(value => value === true);
// 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="w-full max-w-4xl mx-auto text-center">
        <AnimatedContainer animation="fade" className="w-full">
        <div className="bg-white rounded-xl p-6 w-full">
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Game Settings</h1>
          
          <div className="space-y-6">
            {/* Grade Level Selection */}
            <GradeSelect />
            
            {/* Math Operations Selection */}
            <OperationsSelect />
            
            {/* Number of Problems */}
            <NumberOfProblemsInput />
            
            {/* Timer Settings */}
            <TimerInput />
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-8">
              <Button 
                variant="secondary" 
                onClick={handleBackToWelcome}
                className="order-2 sm:order-1"
              >
                Back
              </Button>
              
              <Button 
                onClick={handleStartGame}
                disabled={isStartDisabled}
                className="order-1 sm:order-2"
              >
                Start Game
              </Button>
            </div>
            {/* Quit Game link always below */}
            <a
              href="/"
              className="block mt-6 text-center text-sm text-red-600 hover:underline focus:underline"
            >
              Quit Game
            </a>
          </div>
        </div>
      </AnimatedContainer>
      </div>
    </div>
  );
};

export default SettingsScreen;