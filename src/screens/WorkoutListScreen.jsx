import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import WorkoutCard from '../components/WorkoutCard';

const WorkoutListScreen = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const handleCreateNewWorkout = () => {
    navigate('/workouts/new');
  };

  const handleEditWorkout = (workoutId) => {
    navigate(`/workouts/edit/${workoutId}`);
  };

  const handleDeleteWorkout = (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout? This action cannot be undone.')) {
      dispatch({ type: 'DELETE_WORKOUT', payload: workoutId });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Workouts
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a workout to start or create a new one
        </p>
      </div>

      {/* Workout List */}
      <div className="mb-4">
        {state.workouts.length > 0 ? (
          <div className="space-y-4">
            {state.workouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onEdit={handleEditWorkout}
                onDelete={handleDeleteWorkout}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No workouts created yet.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              Tap the + button to create your first workout!
            </p>
          </div>
        )}
      </div>

      {/* Create Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleCreateNewWorkout}
          className="btn-primary flex items-center gap-2 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          aria-label="Create new workout"
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
          <span>Create New</span>
        </button>
      </div>
    </div>
  );
};

export default WorkoutListScreen;
