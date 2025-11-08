import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateCustomWorkout } from '../utils/openRouter';
import { useNavigate } from 'react-router-dom';

export const CustomWorkoutScreen = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    aim: '',
    additionalNotes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.height || isNaN(formData.height) || formData.height <= 0) {
      setError('Please enter a valid height in cm');
      return false;
    }
    if (!formData.weight || isNaN(formData.weight) || formData.weight <= 0) {
      setError('Please enter a valid weight in kg');
      return false;
    }
    if (!formData.aim.trim()) {
      setError('Please enter your workout aim/target');
      return false;
    }
    if (!state.settings.openRouterApiKey) {
      setError('Please set your OpenRouter API key in Settings first');
      navigate('/settings');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const workoutData = await generateCustomWorkout(state.settings.openRouterApiKey, formData);
      
      // Format the workout data to match the app's structure
      const formattedWorkout = {
        id: Date.now(), // Generate a unique ID
        name: workoutData.name || 'Custom Workout',
        description: workoutData.description || 'A personalized workout based on your goals',
        exercises: workoutData.exercises?.length || 0,
        duration: workoutData.duration || '20-30 min',
        customExercises: workoutData.exercises || []
      };
      
      setGeneratedWorkout(formattedWorkout);
      setShowSuccess(true);
    } catch (err) {
      setError(`Failed to generate workout: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWorkout = () => {
    if (generatedWorkout) {
      dispatch({
        type: 'CREATE_WORKOUT',
        payload: generatedWorkout
      });
      navigate('/workouts');
    }
  };

  const handleNewWorkout = () => {
    setFormData({
      height: '',
      weight: '',
      aim: '',
      additionalNotes: ''
    });
    setGeneratedWorkout(null);
    setShowSuccess(false);
    setError('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create Custom Workout
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Generate a personalized workout based on your physical characteristics and goals
        </p>
      </div>

      {!showSuccess ? (
        <form onSubmit={handleSubmit} className="card space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="e.g., 175"
                min="100"
                max="300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="e.g., 70"
                min="30"
                max="300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Workout Aim/Target
              </label>
              <select
                name="aim"
                value={formData.aim}
                onChange={handleInputChange}
                className="input-field w-full"
              >
                <option value="">Select your goal</option>
                <option value="lose weight">Lose Weight</option>
                <option value="build muscle">Build Muscle</option>
                <option value="maintain fitness">Maintain Fitness</option>
                <option value="improve endurance">Improve Endurance</option>
                <option value="increase strength">Increase Strength</option>
                <option value="lose fat and build muscle">Lose Fat & Build Muscle</option>
                <option value="improve flexibility">Improve Flexibility</option>
                <option value="cardio training">Cardio Training</option>
                <option value="rehabilitation">Rehabilitation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                className="input-field w-full"
                rows="3"
                placeholder="Any specific requirements, limitations, or preferences..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Workout...
              </div>
            ) : (
              'Generate Custom Workout'
            )}
          </button>

          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Your data is processed securely through OpenRouter's API. We don't store your information.
          </p>
        </form>
      ) : (
        <div className="card space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-green-900/20">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Workout Generated Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your personalized workout has been created based on your input
            </p>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{generatedWorkout?.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{generatedWorkout?.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{generatedWorkout?.duration}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Exercises:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{generatedWorkout?.exercises}</span>
              </div>
            </div>

            {generatedWorkout?.customExercises && generatedWorkout.customExercises.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Exercises:</h4>
                <ul className="space-y-2">
                  {generatedWorkout.customExercises.slice(0, 3).map((exercise, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      • {exercise.name}: {exercise.sets}
                    </li>
                  ))}
                  {generatedWorkout.customExercises.length > 3 && (
                    <li className="text-sm text-gray-500 dark:text-gray-400">
                      ... and {generatedWorkout.customExercises.length - 3} more exercises
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSaveWorkout}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Save Workout
            </button>
            <button
              onClick={handleNewWorkout}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            >
              Create Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomWorkoutScreen;