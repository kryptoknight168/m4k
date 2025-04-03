import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import GameScreen from './app/game/GameScreen';
import ResultsScreen from './app/results/ResultsScreen';
import useSettingsStore from './store/settingsStore';

// Placeholder components for now
const Welcome = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-100 to-purple-100">
    <div className="text-center w-full max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-7xl font-bold text-blue-700 mb-2 animate-pulse">Math Quest!</h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-8">Fun math practice for kids</p>
      
      <div className="flex justify-center">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-lg sm:text-xl w-48 sm:w-64 shadow-lg transform transition-transform hover:scale-105"
          onClick={() => window.location.href = '/settings'}
        >
          Let's Start!
        </button>
      </div>
      
      <div className="mt-12 text-4xl md:text-6xl">
        <span className="mx-2 md:mx-4">🧮</span>
        <span className="mx-2 md:mx-4">📐</span>
        <span className="mx-2 md:mx-4">✏️</span>
        <span className="mx-2 md:mx-4">🔢</span>
      </div>
    </div>
  </div>
);

const Settings = () => {
  const { settings, updateSettings } = useSettingsStore();

  // Handle grade selection
  const handleGradeChange = (grade: number) => {
    updateSettings({ grade });
  };

  // Handle operation toggle
  const handleOperationToggle = (operation: 'addition' | 'subtraction' | 'multiplication' | 'division') => {
    updateSettings({
      operations: {
        ...settings.operations,
        [operation]: !settings.operations[operation]
      }
    });
  };

  // Handle number of problems changes
  const handleNumberOfProblemsChange = (value: number) => {
    if (value >= 1 && value <= 50) {
      updateSettings({ numberOfProblems: value });
    }
  };

  // Handle timer changes
  const handleTimerChange = (value: number) => {
    if (value >= 0 && value <= 120) {
      updateSettings({ timerSeconds: value });
    }
  };

  // Check if start button should be disabled
  const isStartDisabled = !Object.values(settings.operations).some(value => value === true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-100 to-purple-100">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-6">Game Settings</h1>
        
        <div className="space-y-6">
          {/* Grade Level */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Grade Level</label>
            <div className="flex flex-wrap gap-2">
              {[4, 5, 6, 7, 8].map((grade) => (
                <button
                  key={grade}
                  className={`px-4 py-2 rounded-full 
                    ${settings.grade === grade 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition-colors duration-300`}
                  onClick={() => handleGradeChange(grade)}
                >
                  Grade {grade}
                </button>
              ))}
            </div>
          </div>
          
          {/* Math Operations */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Math Operations</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center">
                <input
                  id="addition"
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 rounded-sm focus:ring-blue-500"
                  checked={settings.operations.addition}
                  onChange={() => handleOperationToggle('addition')}
                />
                <label htmlFor="addition" className="ml-2 text-gray-700">Addition (+)</label>
              </div>
              <div className="flex items-center">
                <input
                  id="subtraction"
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 rounded-sm focus:ring-blue-500"
                  checked={settings.operations.subtraction}
                  onChange={() => handleOperationToggle('subtraction')}
                />
                <label htmlFor="subtraction" className="ml-2 text-gray-700">Subtraction (−)</label>
              </div>
              <div className="flex items-center">
                <input
                  id="multiplication"
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 rounded-sm focus:ring-blue-500"
                  checked={settings.operations.multiplication}
                  onChange={() => handleOperationToggle('multiplication')}
                />
                <label htmlFor="multiplication" className="ml-2 text-gray-700">Multiplication (×)</label>
              </div>
              <div className="flex items-center">
                <input
                  id="division"
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 rounded-sm focus:ring-blue-500"
                  checked={settings.operations.division}
                  onChange={() => handleOperationToggle('division')}
                />
                <label htmlFor="division" className="ml-2 text-gray-700">Division (÷)</label>
              </div>
            </div>
          </div>
          
          {/* Number of Problems */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Number of Problems</label>
            <div className="flex items-center">
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l"
                onClick={() => handleNumberOfProblemsChange(settings.numberOfProblems - 1)}
              >
                −
              </button>
              <input
                type="number"
                className="w-16 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 border-t border-b"
                value={settings.numberOfProblems}
                onChange={(e) => handleNumberOfProblemsChange(parseInt(e.target.value))}
                min={1}
                max={50}
              />
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r"
                onClick={() => handleNumberOfProblemsChange(settings.numberOfProblems + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Timer */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Time per Problem (seconds)</label>
            <div className="flex items-center">
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l"
                onClick={() => handleTimerChange(settings.timerSeconds - 5)}
              >
                −
              </button>
              <input
                type="number"
                className="w-16 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 border-t border-b"
                value={settings.timerSeconds}
                onChange={(e) => handleTimerChange(parseInt(e.target.value))}
                min={0}
                max={120}
                step={5}
              />
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r"
                onClick={() => handleTimerChange(settings.timerSeconds + 5)}
              >
                +
              </button>
            </div>
            <p className="text-xs text-gray-500 italic mt-1">
              {settings.timerSeconds === 0 
                ? "No time limit - practice mode" 
                : `${settings.timerSeconds} seconds per problem`}
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-8">
            <button 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg order-2 sm:order-1"
              onClick={() => window.location.href = '/'}
            >
              Back
            </button>
            
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg order-1 sm:order-2"
              onClick={() => window.location.href = '/game'}
              disabled={isStartDisabled}
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { loadSettings } = useSettingsStore();

  // Load settings when app starts
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/results" element={<ResultsScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
