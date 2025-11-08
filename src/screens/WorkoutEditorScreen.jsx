import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ExercisePicker from '../components/ExercisePicker';
import ExerciseInfoDialog from '../components/ExerciseInfoDialog';
import { exercisesData } from '../utils/exerciseData';

const WorkoutEditorScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const isEditing = id !== undefined && id !== 'new';

  const [workout, setWorkout] = useState({
    id: null,
    name: '',
    description: '',
    exercises: [],
    category: 'strength',
    exerciseDuration: 30,
    breakDuration: 15
  });

  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseInfoOpen, setExerciseInfoOpen] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const existingWorkout = state.workouts.find(w => w.id === parseInt(id));
      if (existingWorkout) {
        setWorkout({
          id: existingWorkout.id,
          name: existingWorkout.name,
          description: existingWorkout.description || '',
          exercises: existingWorkout.exercises_list || [],
          category: existingWorkout.category || 'strength',
          exerciseDuration: existingWorkout.exerciseDuration || 30,
          breakDuration: existingWorkout.breakDuration || 15
        });
      }
    }
  }, [id, isEditing, state.workouts]);

  const handleSave = () => {
    if (!workout.name.trim()) {
      alert('Please enter a workout name');
      return;
    }

    if (workout.exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    const totalDuration = workout.exercises.reduce((total, exercise, index) => {
      const exerciseTime = exercise.duration || workout.exerciseDuration;
      const breakTime = index < workout.exercises.length - 1 ? workout.breakDuration : 0;
      return total + exerciseTime + breakTime;
    }, 0);

    const workoutPayload = {
      ...workout,
      id: isEditing ? parseInt(id) : (state.workouts.length > 0 ? Math.max(...state.workouts.map(w => w.id)) : 0) + 1,
      exercises: workout.exercises.length,
      duration: `${Math.round(totalDuration / 60)} min`,
      exercises_list: workout.exercises,
      exerciseDuration: workout.exerciseDuration,
      breakDuration: workout.breakDuration
    };

    if (isEditing && (isNaN(parseInt(id)) || parseInt(id) <= 0)) {
      console.error('Invalid workout ID for editing:', id);
      alert('Invalid workout ID. Cannot edit this workout.');
      return;
    }

    if (isEditing) {
      dispatch({ type: 'UPDATE_WORKOUT', payload: workoutPayload });
    } else {
      dispatch({ type: 'CREATE_WORKOUT', payload: workoutPayload });
    }

    navigate('/workouts');
  };

  const handleRemoveExercise = (index) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleExerciseChange = (index, field, value) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) =>
        i === index ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const handleShowExerciseInfo = (exercise) => {
    setSelectedExercise(exercise);
    setExerciseInfoOpen(true);
  };

  return (
    <div className="w-full pb-20 md:pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Workout' : 'Create Workout'}
        </h1>
        <button
          onClick={handleSave}
          className="btn-primary flex items-center gap-2"
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          Save Workout
        </button>
      </div>

      {/* Workout Details Card */}
      <div className="card mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Workout Details
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Workout Name *
            </label>
            <input
              type="text"
              className="input-field"
              value={workout.name}
              onChange={(e) => setWorkout(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter workout name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={workout.description}
              onChange={(e) => setWorkout(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter workout description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              className="input-field"
              value={workout.category}
              onChange={(e) => setWorkout(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="stretching">Stretching</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exercises Card */}
      <div className="card mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Exercises ({workout.exercises.length})
          </h2>
          <button
            onClick={() => setShowExercisePicker(true)}
            className="btn-secondary flex items-center gap-2"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Exercise
          </button>
        </div>

        <ExercisePicker
          open={showExercisePicker}
          onClose={() => setShowExercisePicker(false)}
          onAddExercises={(exercise) => {
            setWorkout(prev => ({
              ...prev,
              exercises: [...prev.exercises, { ...exercise, duration: prev.exerciseDuration }]
            }));
            setShowExercisePicker(false);
          }}
          selectedExercises={workout.exercises}
        />

        {workout.exercises.length > 0 ? (
          <div className="space-y-3">
            {workout.exercises.map((exercise, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      {index + 1}. {exercise.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {exercise.description}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleShowExerciseInfo(exercise)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      aria-label="Exercise info"
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
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleRemoveExercise(index)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      aria-label="Remove exercise"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="input-field text-sm w-32"
                    value={exercise.duration || workout.exerciseDuration}
                    onChange={(e) => handleExerciseChange(index, 'duration', parseInt(e.target.value) || workout.exerciseDuration)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No exercises added yet. Add exercises to build your workout!</p>
          </div>
        )}
      </div>

      {/* Timing Controls Card */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Workout Timing
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Exercise Duration (seconds)
            </label>
            <input
              type="number"
              min="1"
              className="input-field"
              value={workout.exerciseDuration}
              onChange={(e) => setWorkout(prev => ({
                ...prev,
                exerciseDuration: parseInt(e.target.value) || 30
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Break Duration (seconds)
            </label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={workout.breakDuration}
              onChange={(e) => setWorkout(prev => ({
                ...prev,
                breakDuration: parseInt(e.target.value) || 15
              }))}
            />
          </div>
        </div>
      </div>

      {/* Floating Save Button - Mobile */}
      <button
        onClick={handleSave}
        className="fixed bottom-24 right-4 md:hidden bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 z-40"
        aria-label="Save workout"
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
            d="M5 13l4 4L19 7"
          />
        </svg>
      </button>

      <ExerciseInfoDialog
        exercise={selectedExercise}
        open={exerciseInfoOpen}
        onClose={() => setExerciseInfoOpen(false)}
      />
    </div>
  );
};

export default WorkoutEditorScreen;
