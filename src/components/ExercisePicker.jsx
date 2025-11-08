import React, { useState } from 'react';
import { exercisesData } from '../utils/exerciseData';
import ExerciseInfoDialog from './ExerciseInfoDialog';

const ExercisePicker = ({ open, onClose, onAddExercises, selectedExercises = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  // Filter exercises based on search term
  const filteredExercises = Object.entries(exercisesData).filter(([key, exercise]) => {
    return exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           exercise.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (exercise.muscles && exercise.muscles.some(m => m.toLowerCase().includes(searchTerm.toLowerCase())));
  });

  const handleAddExercise = (exerciseId) => {
    const exercise = exercisesData[exerciseId];
    if (exercise) {
      onAddExercises({ ...exercise });
    }
  };

  const handleShowInfo = (exercise) => {
    setSelectedExercise(exercise);
    setInfoDialogOpen(true);
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Backdrop */}
          <div
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            aria-hidden="true"
          />

          {/* Modal panel */}
          <div
            className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-t-xl sm:rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full h-[90vh] sm:h-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Exercises
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                aria-label="Close"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Search */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Select exercises to add to your workout
              </p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="input-field pl-10"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
              {filteredExercises.length > 0 ? (
                <div className="space-y-2">
                  {filteredExercises.map(([key, exercise]) => {
                    const isAdded = selectedExercises.some(ex => ex.id === exercise.id);
                    return (
                      <div
                        key={key}
                        className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                            {exercise.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {exercise.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                              {exercise.category}
                            </span>
                            {exercise.muscles && exercise.muscles.map((muscle, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                              >
                                {muscle}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                          <button
                            onClick={() => handleShowInfo(exercise)}
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
                            onClick={() => handleAddExercise(key)}
                            disabled={isAdded}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              isAdded
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                : 'bg-primary-600 hover:bg-primary-700 text-white'
                            }`}
                          >
                            {isAdded ? 'Added' : 'Add'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No exercises found</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-4 flex justify-end border-t border-gray-200 dark:border-gray-600">
              <button onClick={onClose} className="btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedExercise && (
        <ExerciseInfoDialog
          exercise={selectedExercise}
          open={infoDialogOpen}
          onClose={() => setInfoDialogOpen(false)}
        />
      )}
    </>
  );
};

export default ExercisePicker;
