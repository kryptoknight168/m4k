import React from 'react';
import useSettingsStore from '../../store/settingsStore';

const NumberOfProblemsInput: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 50) {
      updateSettings({ numberOfProblems: value });
    }
  };

  const handleIncrement = () => {
    if (settings.numberOfProblems < 50) {
      updateSettings({ numberOfProblems: settings.numberOfProblems + 1 });
    }
  };

  const handleDecrement = () => {
    if (settings.numberOfProblems > 1) {
      updateSettings({ numberOfProblems: settings.numberOfProblems - 1 });
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Number of Problems
      </label>
      <div className="flex items-center">
        <button
          type="button"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l"
          onClick={handleDecrement}
          aria-label="Decrease number"
        >
          −
        </button>
        <input
          type="number"
          min="1"
          max="50"
          value={settings.numberOfProblems}
          onChange={handleChange}
          className="w-16 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 border-t border-b"
          aria-label="Number of problems"
        />
        <button
          type="button"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r"
          onClick={handleIncrement}
          aria-label="Increase number"
        >
          +
        </button>
      </div>
      <p className="text-xs text-gray-500 italic mt-1">
        Choose between 1 and 50 problems.
      </p>
    </div>
  );
};

export default NumberOfProblemsInput; 