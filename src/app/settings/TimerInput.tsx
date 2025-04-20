import React from 'react';
import useSettingsStore from '../../store/settingsStore';

const TimerInput: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 120) {
      updateSettings({ timerSeconds: value });
    }
  };

  const handleIncrement = () => {
    if (settings.timerSeconds < 120) {
      updateSettings({ timerSeconds: settings.timerSeconds + 5 });
    }
  };

  const handleDecrement = () => {
    if (settings.timerSeconds > 0) {
      updateSettings({ timerSeconds: Math.max(0, settings.timerSeconds - 5) });
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Time per Problem (seconds)
      </label>
      <div className="flex items-center">
        <button
          type="button"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l"
          onClick={handleDecrement}
          aria-label="Decrease time"
        >
          −
        </button>
        <input
          type="number"
          min="0"
          max="120"
          step="5"
          value={settings.timerSeconds}
          onChange={handleChange}
          className="w-16 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 border-t border-b"
          aria-label="Seconds per problem"
        />
        <button
          type="button"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r"
          onClick={handleIncrement}
          aria-label="Increase time"
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
  );
};

export default TimerInput; 