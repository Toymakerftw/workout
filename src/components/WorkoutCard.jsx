import React from 'react';
import { Link } from 'react-router-dom';

const WorkoutCard = ({ workout, onEdit }) => {
  // Generate a color based on the workout name for visual distinction
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

  const cardColor = getColorByWorkout(workout.name);
  const colorClasses = {
    primary: 'border-l-primary-500 bg-primary-50 dark:bg-primary-900/20',
    emerald: 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
    amber: 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/20',
    rose: 'border-l-rose-500 bg-rose-50 dark:bg-rose-900/20',
    indigo: 'border-l-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
    purple: 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20',
  };

  return (
    <div
      className={`card border-l-4 ${colorClasses[cardColor]} mb-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer`}
      onClick={() => window.location.href = `/workouts/${workout.id}`}
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
        
        <div className="flex gap-2 ml-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(workout.id);
            }}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Edit workout"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <Link
            to={`/workouts/${workout.id}`}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Start workout"
            onClick={(e) => e.stopPropagation()}
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
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard;
