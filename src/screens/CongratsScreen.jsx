import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

const CongratsScreen = ({ currentWorkout, completedWorkout, isDarkMode }) => {
  const navigate = useNavigate();
  const { triggerHapticFeedback } = useHapticFeedback();

  const handleGoHome = () => {
    triggerHapticFeedback();
    navigate('/workouts');
  };

  const handleViewHistory = () => {
    triggerHapticFeedback();
    navigate('/activity');
  };

  const theme = {
    bgClass: isDarkMode
      ? 'from-gray-900 via-gray-900 to-green-900/20'
      : 'from-green-50 to-green-100',
    textColor: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    buttonBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    buttonBorder: isDarkMode ? 'border-gray-900' : 'border-gray-200',
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-700 bg-gradient-to-br ${theme.bgClass} ${theme.textColor} p-6`}>
      <div className="relative w-32 h-32 mb-6">
        <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
        <div className={`${theme.buttonBg} relative rounded-full w-full h-full flex items-center justify-center ${isDarkMode ? 'border border-green-500/30' : 'border border-green-300'}`}>
          <span className="text-5xl">🎉</span>
        </div>
      </div>
      
      <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 text-center">
        Workout Complete!
      </h2>
      <p className={`${theme.textSecondary} text-center mb-2`}>
        You finished {currentWorkout?.name || 'your workout'}
      </p>
      
      <div className="bg-white/10 backdrop-blur rounded-xl p-4 my-6 w-full max-w-md">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">{completedWorkout?.calories || '0'}</div>
            <div className={`text-xs ${theme.textSecondary} uppercase tracking-wider`}>Calories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-400">{completedWorkout?.duration || '0'}</div>
            <div className={`text-xs ${theme.textSecondary} uppercase tracking-wider`}>Duration</div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button 
          onClick={handleGoHome}
          className={`w-full py-4 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} rounded-xl font-bold transition-all`}
        >
          Back to Home
        </button>
        <button 
          onClick={handleViewHistory}
          className={`w-full py-4 ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white/50 hover:bg-gray-100/50'} rounded-xl font-bold transition-all ${theme.textSecondary}`}
        >
          View Activity
        </button>
      </div>
    </div>
  );
};

export default CongratsScreen;