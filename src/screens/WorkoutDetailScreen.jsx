import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { exercisesData, workoutExercises } from '../utils/exerciseData';
import { useAppContext } from '../context/AppContext';
import ExerciseInfoDialog from '../components/ExerciseInfoDialog';
import { useSound } from '../hooks/useSound';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { useNotifications } from '../hooks/useNotifications';

export const WorkoutDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { playSound } = useSound();
  const { triggerHapticFeedback } = useHapticFeedback();
  const { permission, requestPermission, sendNotification } = useNotifications();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [exerciseInfoOpen, setExerciseInfoOpen] = useState(false);

  useEffect(() => {
    if (permission === 'default') {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const currentWorkout = state.workouts.find(workout => workout.id === parseInt(id));

  // Get exercises based on whether it's a custom workout or default
  let exercises;
  if (currentWorkout && currentWorkout.exercises_list) {
    exercises = currentWorkout.exercises_list;
  } else {
    const exerciseList = workoutExercises[id] || [];
    exercises = exerciseList.map(ex => ({
      ...exercisesData[ex.exerciseId],
      duration: ex.duration
    }));
  }

  const currentExercise = exercises[currentExerciseIndex];

  useEffect(() => {
    let interval = null;

    if (currentExercise && isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (currentExerciseIndex < exercises.length - 1) {
              setCurrentExerciseIndex(prevIndex => prevIndex + 1);
              const nextExercise = exercises[currentExerciseIndex + 1];
              return nextExercise?.duration || currentWorkout?.exerciseDuration || 30;
            } else {
              setIsPlaying(false);
              setIsCompleted(true);
              playSound('end');
              triggerHapticFeedback([200, 100, 200]);
              sendNotification('Workout Completed!', {
                body: 'Great job completing your workout!'
              });
              const totalDuration = exercises.reduce((sum, ex) => sum + (ex.duration || currentWorkout?.exerciseDuration || 30), 0) +
                                   (exercises.length - 1) * (currentWorkout?.breakDuration || 15);
              const completedWorkout = {
                id: Date.now(),
                name: currentWorkout?.name || 'Unknown Workout',
                date: new Date().toISOString().split('T')[0],
                duration: `${Math.round(totalDuration / 60)} min`,
                calories: Math.round(totalDuration * 0.15),
                status: 'complete'
              };
              dispatch({ type: 'ADD_WORKOUT_HISTORY', payload: completedWorkout });
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, currentExerciseIndex, exercises, currentExercise, currentWorkout, dispatch, playSound, triggerHapticFeedback, sendNotification]);

  useEffect(() => {
    if (currentExercise) {
      setTimeLeft(currentExercise.duration || currentWorkout?.exerciseDuration || 30);
    }
  }, [currentExerciseIndex, currentExercise, currentWorkout]);

  const handlePlayPause = () => {
    triggerHapticFeedback();
    if (!isPlaying) {
      playSound('start');
    } else {
      playSound('click');
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    triggerHapticFeedback();
    playSound('click');
    setIsPlaying(false);
    setCurrentExerciseIndex(0);
    setTimeLeft(exercises[0]?.duration || 0);
    setIsCompleted(false);
  };

  const handleExerciseInfo = () => {
    setExerciseInfoOpen(true);
  };

  const handleNext = () => {
    triggerHapticFeedback();
    playSound('click');
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setTimeLeft(exercises[currentExerciseIndex + 1]?.duration || 0);
      setIsPlaying(false);
    } else {
      setIsCompleted(true);
      playSound('end');
      triggerHapticFeedback([200, 100, 200]);
      sendNotification('Workout Completed!', {
        body: 'Great job completing your workout!'
      });
    }
  };

  const handleStop = () => {
    triggerHapticFeedback();
    playSound('click');
    if (currentExerciseIndex > 0 || timeLeft < (exercises[0]?.duration || currentWorkout?.exerciseDuration || 30)) {
      const elapsedTime = (currentExerciseIndex * (currentWorkout?.exerciseDuration || 30 + currentWorkout?.breakDuration || 15)) +
                          ((currentWorkout?.exerciseDuration || 30) - timeLeft);
      const incompleteWorkout = {
        id: Date.now(),
        name: currentWorkout?.name || 'Unknown Workout',
        date: new Date().toISOString().split('T')[0],
        duration: `${Math.round(elapsedTime / 60)} min`,
        calories: Math.round(elapsedTime * 0.15),
        status: 'incomplete'
      };
      dispatch({ type: 'ADD_WORKOUT_HISTORY', payload: incompleteWorkout });
    }
    navigate('/workouts');
  };

  if (isCompleted) {
    const handleDoAgain = () => {
      triggerHapticFeedback();
      playSound('click');
      setIsPlaying(false);
      setCurrentExerciseIndex(0);
      setTimeLeft(exercises[0]?.duration || 0);
      setIsCompleted(false);
    };

    const handleBackToWorkouts = () => {
      triggerHapticFeedback();
      playSound('click');
      navigate('/workouts');
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-8 px-4">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Workout Completed! 🎉
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Great job completing your workout!
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <button
            onClick={handleDoAgain}
            className="btn-primary flex-1"
          >
            Do Again
          </button>
          <button
            onClick={handleBackToWorkouts}
            className="btn-secondary flex-1"
          >
            Back to Workouts
          </button>
        </div>
      </div>
    );
  }

  if (!currentExercise) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-8 px-4">
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          No exercises found for this workout
        </p>
        <button
          onClick={() => navigate('/workouts')}
          className="btn-secondary"
        >
          Back to Workouts
        </button>
      </div>
    );
  }

  const progress = (currentExerciseIndex / exercises.length) * 100;
  const timeProgress = currentExercise.duration
    ? ((currentExercise.duration - timeLeft) / currentExercise.duration) * 100
    : 0;

  return (
    <div className="flex flex-col h-full min-h-[60vh]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Exercise {currentExerciseIndex + 1} of {exercises.length}
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <button
          onClick={handleExerciseInfo}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Exercise info"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

      {/* Exercise Info */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {currentExercise.name}
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400">
          {currentExercise.description}
        </p>
      </div>

      {/* Exercise Image */}
      <div className="w-full max-w-sm mx-auto mb-6 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 aspect-square flex items-center justify-center">
        {currentExercise.image ? (
          <img
            src={`/exercise_images/${currentExercise.image}.webp`}
            alt={currentExercise.name}
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <div className="text-gray-400 dark:text-gray-500 text-sm">
            Exercise Image
          </div>
        )}
      </div>

      {/* Timer Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          {/* Progress Circle */}
          <svg className="transform -rotate-90 w-full h-full">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 45}%`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - timeProgress / 100)}%`}
              className="text-primary-600 transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          {/* Timer Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-auto pb-4">
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Restart</span>
          </button>
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>Stop</span>
          </button>
          <button
            onClick={handlePlayPause}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
              isPlaying
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Pause</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Start</span>
              </>
            )}
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span>Skip</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <ExerciseInfoDialog
        exercise={currentExercise}
        open={exerciseInfoOpen}
        onClose={() => setExerciseInfoOpen(false)}
      />
    </div>
  );
};
