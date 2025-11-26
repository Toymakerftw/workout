import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSound } from '../hooks/useSound';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

const GetReadyScreen = ({ onReady, currentWorkout, exercises, isDarkMode }) => {
  const [timeLeft, setTimeLeft] = useState(5); // 5 second countdown
  const navigate = useNavigate();
  const { playSound } = useSound();
  const { triggerHapticFeedback } = useHapticFeedback();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Automatically proceed when countdown finishes
      playSound('exercise');
      onReady();
    }
  }, [timeLeft, onReady, playSound]);

  const handleStart = () => {
    triggerHapticFeedback();
    playSound('click');
    clearTimeout(); // Clear any existing timer
    onReady();
  };

  const handleCancel = () => {
    triggerHapticFeedback();
    navigate('/workouts');
  };

  const theme = {
    bgClass: isDarkMode
      ? 'from-gray-900 via-gray-900 to-cyan-900/20'
      : 'from-cyan-50 to-cyan-100',
    textColor: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    buttonBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    buttonBorder: isDarkMode ? 'border-gray-900' : 'border-gray-200',
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-700 bg-gradient-to-br ${theme.bgClass} ${theme.textColor} p-6`}>
      <div className="relative w-40 h-40 mb-8">
        <div className="absolute inset-0 bg-cyan-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className={`${theme.buttonBg} relative rounded-full w-full h-full flex items-center justify-center ${isDarkMode ? 'border border-cyan-500/30' : 'border border-cyan-300'} shadow-2xl`}>
          <div className="text-6xl font-bold">
            {timeLeft > 0 ? timeLeft : 'GO!'}
          </div>
        </div>
      </div>
      
      <h2 className="text-3xl font-bold mb-2 text-center">Get Ready!</h2>
      <p className={`${theme.textSecondary} mb-8 text-center`}>
        Prepare for {currentWorkout?.name || 'your workout'}
        <br />
        {exercises?.length} exercises • {Math.round((exercises?.length || 0) * 30 / 60)} min
      </p>
      
      <div className="flex gap-4 w-full max-w-xs">
        <button 
          onClick={handleCancel}
          className={`flex-1 py-4 rounded-xl font-bold transition-all ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-white/80 hover:bg-gray-100 text-gray-700'} backdrop-blur-sm`}
        >
          Cancel
        </button>
        <button 
          onClick={handleStart}
          className={`flex-1 py-4 rounded-xl font-bold transition-all ${isDarkMode ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-cyan-500 hover:bg-cyan-400 text-white'}`}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default GetReadyScreen;