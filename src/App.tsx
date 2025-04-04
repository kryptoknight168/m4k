import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import GameScreen from './app/game/GameScreen';
import ResultsScreen from './app/results/ResultsScreen';
import useSettingsStore from './store/settingsStore';
import useGameStore from './store/gameStore';

// Placeholder components for now
const Welcome = () => {
  return (
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
};

const Settings = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettingsStore();
  const { initializeGame } = useGameStore();
  
  const handleStartGame = () => {
    initializeGame(settings);
    navigate('/game');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-100 to-purple-100">
      <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Game Settings</h2>
        
        <div className="space-y-4">
          {/* Grade Level Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Grade Level</label>
            <div className="flex flex-wrap gap-2">
              {[4, 5, 6, 7, 8].map((grade) => (
                <button
                  key={grade}
                  className={`px-4 py-2 rounded-full 
                    ${settings.grade === grade 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition-colors duration-300`}
                  onClick={() => updateSettings({ grade })}
                >
                  Grade {grade}
                </button>
              ))}
            </div>
          </div>
          
          {/* Operation Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Math Operations</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'addition', label: 'Addition (+)' },
                { key: 'subtraction', label: 'Subtraction (−)' },
                { key: 'multiplication', label: 'Multiplication (×)' },
                { key: 'division', label: 'Division (÷)' }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center">
                  <input
                    id={key}
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 rounded-sm focus:ring-blue-500"
                    checked={settings.operations[key as keyof typeof settings.operations]}
                    onChange={() => updateSettings({ 
                      operations: {
                        ...settings.operations,
                        [key]: !settings.operations[key as keyof typeof settings.operations]
                      }
                    })}
                  />
                  <label htmlFor={key} className="ml-2 text-gray-700">{label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Number of Problems */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Number of Problems</label>
            <div className="flex items-center">
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l"
                onClick={() => updateSettings({ 
                  numberOfProblems: Math.max(1, settings.numberOfProblems - 1) 
                })}
              >
                −
              </button>
              <input
                type="number"
                className="w-16 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 border-t border-b"
                value={settings.numberOfProblems}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 1 && value <= 50) {
                    updateSettings({ numberOfProblems: value });
                  }
                }}
                min={1}
                max={50}
              />
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r"
                onClick={() => updateSettings({ 
                  numberOfProblems: Math.min(50, settings.numberOfProblems + 1) 
                })}
              >
                +
              </button>
            </div>
          </div>

          {/* Timer */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Time per Problem (seconds)</label>
            <div className="flex items-center">
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l"
                onClick={() => updateSettings({ 
                  timerSeconds: Math.max(0, settings.timerSeconds - 5) 
                })}
              >
                −
              </button>
              <input
                type="number"
                className="w-16 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 border-t border-b"
                value={settings.timerSeconds}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 0 && value <= 120) {
                    updateSettings({ timerSeconds: value });
                  }
                }}
                min={0}
                max={120}
                step={5}
              />
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r"
                onClick={() => updateSettings({ 
                  timerSeconds: Math.min(120, settings.timerSeconds + 5) 
                })}
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
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={handleStartGame}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-lg w-64 shadow-lg transform transition-transform hover:scale-105"
          >
            Start Game
          </button>
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
