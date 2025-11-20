import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Moved outside component to prevent re-declaration on every render
const getColorByWorkout = (name) => {
  const colors = [
    'primary',
    'emerald',
    'amber',
    'rose',
    'indigo',
    'purple'
  ];
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
  return colors[colorIndex];
};

const WorkoutCard = ({ workout, onEdit, onDelete }) => {
  const cardColor = getColorByWorkout(workout.name);
  const colorClasses = {
    primary: 'border-l-primary-500 bg-primary-50 dark:bg-primary-900/20',
    emerald: 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
    amber: 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/20',
    rose: 'border-l-rose-500 bg-rose-50 dark:bg-rose-900/20',
    indigo: 'border-l-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
    purple: 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20',
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = (e) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(workout.id);
    }
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };
  
  const handleEditClick = (e) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    onEdit(workout.id);
  };

  return (
    <>
      <Link
        to={`/workouts/${workout.id}`}
        className={`card block border-l-4 ${colorClasses[cardColor]} mb-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 p-5`}
        aria-label={`View workout: ${workout.name}`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
              {workout.name}
            </h3>
            {workout.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {workout.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                {workout.exercises || 0} exercises
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                {workout.duration || '0 min'}
              </span>
            </div>
          </div>

          <div className="flex gap-2 ml-4 flex-shrink-0">
            <button
              onClick={handleEditClick}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Edit workout"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              aria-label="Delete workout"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
      </Link>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleCancelDelete}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
            role="document"
          >
            <h3
              id="delete-dialog-title"
              className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
            >
              Delete Workout
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{workout.name}"? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkoutCard;
