import React from 'react';
import useSettingsStore from '../../store/settingsStore';

const OperationsSelect: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  const handleOperationToggle = (operation: keyof typeof settings.operations) => {
    updateSettings({
      operations: {
        ...settings.operations,
        [operation]: !settings.operations[operation],
      },
    });
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Math Operations
      </label>
      <div className="grid grid-cols-2 gap-3">
        <OperationCheckbox
          label="Addition (+)"
          checked={settings.operations.addition}
          onChange={() => handleOperationToggle('addition')}
        />
        <OperationCheckbox
          label="Subtraction (−)"
          checked={settings.operations.subtraction}
          onChange={() => handleOperationToggle('subtraction')}
        />
        <OperationCheckbox
          label="Multiplication (×)"
          checked={settings.operations.multiplication}
          onChange={() => handleOperationToggle('multiplication')}
        />
        <OperationCheckbox
          label="Division (÷)"
          checked={settings.operations.division}
          onChange={() => handleOperationToggle('division')}
        />
      </div>
      <p className="text-xs text-gray-500 italic mt-1">
        Select at least one operation.
      </p>
    </div>
  );
};

interface OperationCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const OperationCheckbox: React.FC<OperationCheckboxProps> = ({
  label,
  checked,
  onChange,
}) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      className="w-5 h-5 text-blue-600 rounded-sm focus:ring-blue-500"
      checked={checked}
      onChange={onChange}
      id={`operation-${label}`}
    />
    <label
      htmlFor={`operation-${label}`}
      className="ml-2 text-gray-700 cursor-pointer"
    >
      {label}
    </label>
  </div>
);

export default OperationsSelect; 