import React from 'react';
import { useAppContext } from '../context/AppContext';

export const SettingsScreen = () => {
  const { state, dispatch } = useAppContext();

  const handleDarkModeChange = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const handleRemindersChange = (event) => {
    dispatch({
      type: 'UPDATE_SETTING',
      payload: { key: 'remindersEnabled', value: event.target.checked }
    });
  };



  const handleGeminiApiKeyChange = (event) => {
    dispatch({
      type: 'UPDATE_SETTING',
      payload: { key: 'geminiApiKey', value: event.target.value }
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your app experience
        </p>
      </div>

      {/* Appearance Settings */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Appearance
        </h2>
        <div className="space-y-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
            <div className="flex-1">
              <label className="text-base font-medium text-gray-900 dark:text-white">
                Dark Mode
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Switch between light and dark theme
              </p>
            </div>
            <button
              onClick={handleDarkModeChange}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                state.settings.darkMode ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              role="switch"
              aria-checked={state.settings.darkMode}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  state.settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>


        </div>
      </div>

      {/* Notifications Settings */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Notifications
        </h2>
        <div className="space-y-4">
          {/* Workout Reminders Toggle */}
          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <label className="text-base font-medium text-gray-900 dark:text-white">
                Workout Reminders
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Get reminders for your scheduled workouts
              </p>
            </div>
            <button
              onClick={(e) => handleRemindersChange({ target: { checked: !state.settings.remindersEnabled } })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                state.settings.remindersEnabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              role="switch"
              aria-checked={state.settings.remindersEnabled}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  state.settings.remindersEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>


      {/* AI Integration Settings */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          AI Integration
        </h2>
        <div className="space-y-4">
          {/* Gemini API Key Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gemini API Key
            </label>
            <input
              type="password"
              className="input-field w-full"
              placeholder="Enter your Gemini API key"
              value={state.settings.geminiApiKey}
              onChange={handleGeminiApiKeyChange}
              autoComplete="off"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Get your API key from{' '}
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Google AI Studio
              </a>{' '}
              to use AI-powered workout generation.
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          About
        </h2>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong>Chapter Two</strong> v1.0.0
          </p>
          <p>
            A simple home workout app that respects your privacy
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
