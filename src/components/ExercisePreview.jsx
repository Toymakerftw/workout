import React, { useState } from 'react';
import { Info as InfoIcon } from '@mui/icons-material';
import ExerciseInfoDialog from './ExerciseInfoDialog';

const ExercisePreview = ({ exercise, showInfoButton = true }) => {
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-shadow duration-200 hover:shadow-lg">
        <div className="flex-1 flex flex-col p-4 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {exercise.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {exercise.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 border border-primary-300 dark:border-primary-700">
                  {exercise.category}
                </span>
                {exercise.muscles && exercise.muscles.map((muscle, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
            
            {showInfoButton && (
              <div className="relative ml-2">
                <button
                  onClick={() => setInfoDialogOpen(true)}
                  className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  aria-label="View more info"
                >
                  <InfoIcon fontSize="small" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {exercise.image && (
          <img
            className="w-full md:w-32 h-32 object-contain flex-shrink-0 bg-gray-100 dark:bg-gray-900 m-2 rounded"
            src={`/exercise_images/${exercise.image}.webp`}
            alt={exercise.name}
          />
        )}
      </div>
      
      <ExerciseInfoDialog
        exercise={exercise}
        open={infoDialogOpen}
        onClose={() => setInfoDialogOpen(false)}
      />
    </>
  );
};

export default ExercisePreview;