import React from 'react';
import useSettingsStore from '../../store/settingsStore';

const GradeSelect: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  const handleGradeChange = (grade: number) => {
    updateSettings({ grade });
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Grade Level
      </label>
      <div className="flex flex-wrap gap-2">
        {[4, 5, 6, 7, 8].map((grade) => (
          <button
            key={grade}
            className={`px-4 py-2 rounded-full ${
              settings.grade === grade
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors duration-300`}
            onClick={() => handleGradeChange(grade)}
          >
            Grade {grade}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 italic mt-1">
        Higher grades include more challenging problems.
      </p>
    </div>
  );
};

export default GradeSelect; 