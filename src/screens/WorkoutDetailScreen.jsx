import React, { useState, useEffect, useRef } from 'react';
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
  
  // State
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [exerciseInfoOpen, setExerciseInfoOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState('exercise'); 
  const [exercises, setExercises] = useState([]);
  
  // Refs
  const timerRef = useRef(null);

  const currentWorkout = state.workouts.find(workout => workout.id === parseInt(id));

  // --- VISUAL THEME LOGIC ---
  const isRest = currentStage === 'rest';
  
  const theme = {
    text: isRest ? 'text-amber-400' : 'text-cyan-400',
    bg: isRest ? 'bg-amber-500' : 'bg-cyan-500',
    ring: isRest ? 'text-amber-500' : 'text-cyan-500',
    gradient: isRest 
      ? 'from-gray-900 via-gray-900 to-amber-900/20' 
      : 'from-gray-900 via-gray-900 to-cyan-900/20',
  };

  // --- INITIALIZATION ---
  useEffect(() => {
    if (permission === 'default') requestPermission();
  }, [permission, requestPermission]);

  useEffect(() => {
    let exerciseList = [];
    if (currentWorkout) {
      if (currentWorkout.exercises_list) {
        exerciseList = currentWorkout.exercises_list;
      } else {
        const predefinedExercises = workoutExercises[currentWorkout.id] || [];
        exerciseList = predefinedExercises.map(ex => ({
          ...exercisesData[ex.exerciseId],
          duration: ex.duration
        }));
      }
    }
    setExercises(exerciseList);
  }, [id, state.workouts, currentWorkout]);

  const currentExercise = exercises[currentExerciseIndex];

  // --- TIMER LOGIC ---
  
  // 1. Initialize Timer on Stage Change
  useEffect(() => {
    if (currentExercise) {
      if (currentStage === 'exercise') {
        setTimeLeft(currentExercise.duration || currentWorkout?.exerciseDuration || 30);
      } else {
        setTimeLeft(currentWorkout?.breakDuration || 15);
      }
    }
  }, [currentExerciseIndex, currentExercise, currentStage]);

  // 2. The Timer Loop
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      handleTimerComplete();
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, timeLeft]);

  // 3. Ticking Sound Effect
  useEffect(() => {
    if (isPlaying && timeLeft > 0 && timeLeft <= 4) {
      playSound('tick');
    }
  }, [timeLeft, isPlaying, playSound]);

  const handleTimerComplete = () => {
    clearInterval(timerRef.current);
    
    if (currentStage === 'exercise') {
      if (currentExerciseIndex < exercises.length - 1) {
        // Exercise -> Rest
        playSound('break'); // Play break sound automatically
        setCurrentStage('rest');
      } else {
        finishWorkout();
      }
    } else {
      // Rest -> Next Exercise
      if (currentExerciseIndex < exercises.length - 1) {
        playSound('exercise'); // Play exercise sound automatically
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentStage('exercise');
      } else {
        finishWorkout();
      }
    }
  };

  const finishWorkout = () => {
    setIsPlaying(false);
    setIsCompleted(true);
    playSound('finish');
    triggerHapticFeedback([200, 100, 200]);
    sendNotification('Workout Completed!', { body: 'Great job!' });
    
    const totalDuration = exercises.length * 30; 
    const completedWorkout = {
      id: Date.now(),
      name: currentWorkout?.name || 'Workout',
      date: new Date().toISOString().split('T')[0],
      duration: `${Math.round(totalDuration / 60)} min`,
      calories: Math.round(totalDuration * 0.15),
      status: 'complete'
    };
    dispatch({ type: 'ADD_WORKOUT_HISTORY', payload: completedWorkout });
  };

  // --- CONTROLS ---

  // UPDATED: Smart Sound Triggering
  const handlePlayPause = () => {
    triggerHapticFeedback();
    
    if (!isPlaying) {
      // We are STARTING or RESUMING
      if(timeLeft === 0) return; 
      
      // Play context-aware sound
      if (currentStage === 'exercise') {
        playSound('exercise'); // Whistle/Start sound
      } else {
        playSound('break'); // Break sound
      }
    } else {
      // We are PAUSING
      playSound('click');
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    triggerHapticFeedback();
    playSound('click');
    setIsPlaying(false);
    setCurrentExerciseIndex(0);
    setCurrentStage('exercise');
    setTimeLeft(exercises[0]?.duration || 30);
  };

  const handleNext = () => {
    triggerHapticFeedback();
    playSound('click');
    
    if (currentStage === 'exercise') {
        if (currentExerciseIndex < exercises.length - 1) {
            setCurrentStage('rest');
        } else {
            finishWorkout();
        }
    } else {
        if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex(p => p + 1);
            setCurrentStage('exercise');
        } else {
            finishWorkout();
        }
    }
  };

  const handleStop = () => {
    triggerHapticFeedback();
    navigate('/workouts');
  };

  // --- RENDER HELPERS ---
  if (!currentExercise) return <div className="bg-gray-900 h-screen w-full" />;

  const maxTime = currentStage === 'exercise' 
    ? (currentExercise.duration || currentWorkout?.exerciseDuration || 30)
    : (currentWorkout?.breakDuration || 15);
    
  const timeProgress = ((maxTime - timeLeft) / maxTime) * 100;
  const totalProgress = ((currentExerciseIndex + (currentStage === 'rest' ? 0.5 : 0)) / exercises.length) * 100;

  if (isCompleted) {
    return (
       <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 text-white p-6">
          <div className="relative w-32 h-32 mb-6">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative bg-gray-800 rounded-full w-full h-full flex items-center justify-center border border-green-500/30">
                <span className="text-5xl">🎉</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">Workout Complete!</h2>
          <p className="text-gray-400 mb-8">You crushed it.</p>
          <button onClick={handleStop} className="w-full max-w-xs py-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold text-white transition-all">Back to Home</button>
       </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 flex flex-col transition-colors duration-700 bg-gradient-to-br ${theme.gradient} text-white overflow-hidden`}>
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-6 pt-safe-top">
        <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
                <span className={`text-xs font-bold tracking-widest uppercase ${theme.text} transition-colors duration-500`}>
                    {currentStage}
                </span>
                <span className="text-xs text-gray-500 font-mono">
                    {currentExerciseIndex + 1} / {exercises.length}
                </span>
            </div>
            <div className="h-1 w-32 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                    className={`h-full transition-all duration-700 ease-out ${theme.bg}`} 
                    style={{ width: `${totalProgress}%` }}
                />
            </div>
        </div>

        <button 
            onClick={handleStop}
            className="p-3 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-6">
        <div className="relative w-full max-w-[280px] aspect-square mb-8 flex items-center justify-center">
            <div className={`absolute inset-4 rounded-full blur-3xl opacity-30 transition-colors duration-700 ${isRest ? 'bg-amber-500' : 'bg-cyan-500'}`}></div>
            <div className="relative z-10 w-full h-full flex items-center justify-center animate-float">
                {isRest ? (
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-7xl mb-4 animate-bounce-slow">😮‍💨</div>
                        <p className="text-amber-200/80 font-medium tracking-wide">Breathe</p>
                    </div>
                ) : (
                    currentExercise.image ? (
                        <img 
                            src={`/exercise_images/${currentExercise.image}.webp`} 
                            alt={currentExercise.name}
                            className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                        />
                    ) : (
                        <div className="text-6xl opacity-20">💪</div>
                    )
                )}
            </div>
        </div>

        <div className="text-center z-10 w-full max-w-md">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none mb-3 transition-all duration-300">
                {isRest ? (
                    <span className="text-gray-300">Up Next: <span className="text-white">{exercises[currentExerciseIndex + 1]?.name || 'Finish'}</span></span>
                ) : (
                    currentExercise.name
                )}
            </h2>
            
            {!isRest && (
                <button 
                    onClick={() => setExerciseInfoOpen(true)}
                    className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-cyan-400 transition-colors group py-2 px-4 rounded-full hover:bg-white/5"
                >
                    <span>See Instructions</span>
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            )}
        </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="relative">
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl border-t border-white/10 rounded-t-[2.5rem]"></div>
        <div className="relative z-10 pt-8 pb-10 px-6 flex flex-col items-center">
            <div className="flex items-center justify-between w-full max-w-sm px-4">
                
                {/* Restart */}
                <button 
                    onClick={handleRestart}
                    className="group p-4 flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors"
                >
                    <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </div>
                </button>

                {/* Play / Pause / Timer */}
                <div className="relative -mt-12 mb-2">
                    <div className={`absolute inset-2 rounded-full blur-xl opacity-40 transition-colors duration-700 ${isRest ? 'bg-amber-500' : 'bg-cyan-500'}`}></div>
                    <button
                        onClick={handlePlayPause}
                        className="relative w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center shadow-2xl border-4 border-gray-900 group active:scale-95 transition-transform duration-200"
                    >
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none scale-110">
                            <circle cx="50%" cy="50%" r="46%" stroke="#1f2937" strokeWidth="4" fill="transparent" />
                            <circle 
                                cx="50%" cy="50%" r="46%" 
                                stroke="currentColor" strokeWidth="4" fill="transparent" 
                                strokeDasharray={`${2 * Math.PI * 46}%`}
                                strokeDashoffset={`${2 * Math.PI * 46 * (1 - timeProgress / 100)}%`}
                                strokeLinecap="round"
                                className={`${theme.ring} transition-all duration-1000 ease-linear shadow-[0_0_10px_currentColor] drop-shadow-lg`}
                            />
                        </svg>
                        <div className={`flex flex-col items-center justify-center transition-colors duration-300 ${isPlaying ? 'text-white' : theme.text}`}>
                            {isPlaying ? (
                                <>
                                    <span className="text-3xl font-bold tabular-nums leading-none tracking-tight">{timeLeft}</span>
                                    <span className="text-[10px] uppercase tracking-wider opacity-70 font-bold mt-0.5">
                                        {isRest ? 'Rest' : 'Sec'}
                                    </span>
                                </>
                            ) : (
                                <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                            )}
                        </div>
                    </button>
                </div>

                {/* Skip */}
                <button 
                    onClick={handleNext}
                    className="group p-4 flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors"
                >
                    <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                    </div>
                </button>
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-2">
                {isPlaying ? (isRest ? 'Resting...' : 'Workout in progress') : 'Tap to Start'}
            </p>
        </div>
      </div>

      <ExerciseInfoDialog
        exercise={currentExercise}
        open={exerciseInfoOpen}
        onClose={() => setExerciseInfoOpen(false)}
      />
      
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
      `}</style>
    </div>
  );
};