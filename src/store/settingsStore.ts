import { create } from 'zustand';
import { Settings } from '../types';

// Define the store interface
interface SettingsStore {
  settings: Settings;
  loadSettings: () => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

// Default settings
const defaultSettings: Settings = {
  grade: 4,
  operations: {
    addition: true,
    subtraction: true,
    multiplication: true,
    division: true
  },
  numberOfProblems: 10,
  timerSeconds: 30,
};

// Create the store
const useSettingsStore = create<SettingsStore>((set) => ({
  settings: defaultSettings,
  
  loadSettings: () => {
    const savedSettings = localStorage.getItem('mathAppSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        set({ settings: parsedSettings });
      } catch (error) {
        console.error('Error loading settings:', error);
        set({ settings: defaultSettings });
      }
    }
  },
  
  updateSettings: (newSettings) => {
    set((state) => {
      const updatedSettings = {
        ...state.settings,
        ...newSettings,
      };
      
      // Save to localStorage
      try {
        localStorage.setItem('mathAppSettings', JSON.stringify(updatedSettings));
      } catch (error) {
        console.error('Error saving settings:', error);
      }
      
      return { settings: updatedSettings };
    });
  },
}));

export default useSettingsStore; 