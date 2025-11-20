import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateCustomWorkout } from '../utils/geminiApi';
import { useNavigate } from 'react-router-dom';
import { exercisesData } from '../utils/exerciseData';

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
    if (!state.settings.geminiApiKey) {
      setError('Please set your Gemini API key in Settings first');
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
      const workoutData = await generateCustomWorkout(state.settings.geminiApiKey, formData);
      
      const exercisesArray = Object.values(exercisesData);
      const mappedExercises = workoutData.exercises.map(aiExercise => {
        const foundExercise = exercisesArray.find(e => e.name.toLowerCase() === aiExercise.name.toLowerCase());
        if (foundExercise) {
          return { ...foundExercise, duration: 30 }; // default duration
        }
        return null; // Or handle as a custom exercise
      }).filter(Boolean);

      const newWorkout = {
        name: workoutData.name || 'AI Generated Workout',
        description: workoutData.description || `A workout to help you ${formData.aim}`,
        exercises: mappedExercises,
        category: 'strength',
        exerciseDuration: 30,
        breakDuration: 15
      };
      
      navigate('/workout/edit/new', { state: { newWorkout } });

    } catch (err) {
      setError(`Failed to generate workout: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create Custom Workout
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Generate a personalized workout based on your physical characteristics and goals
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6 p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-6">
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

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Workout...
              </>
            ) : (
              'Generate Custom Workout'
            )}
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          Your data is processed securely through Google Gemini's API. We don't store your information.
        </p>
      </form>
    </div>
  );
};

export default CustomWorkoutScreen;