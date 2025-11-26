import React, { useState } from 'react';
import { useToast } from '../hooks/useToast';

const NutritionReminderDialog = ({ isOpen, onClose, onSchedule }) => {
  const showToast = useToast();
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [reminderType, setReminderType] = useState('meal'); // meal, breakfast, lunch, dinner
  const [customMessage, setCustomMessage] = useState('');
  const [repeatDaily, setRepeatDaily] = useState(false);

  if (!isOpen) return null;

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) {
      showToast('Please select both date and time', 'error');
      return;
    }

    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
    
    // Check if the selected time is in the past
    if (scheduledDateTime <= new Date()) {
      showToast('Please select a future date and time', 'error');
      return;
    }

    // Generate appropriate message based on reminder type
    let message = customMessage.trim();
    if (!message) {
      switch(reminderType) {
        case 'breakfast':
          message = 'Time for breakfast! Take a picture of your meal.';
          break;
        case 'lunch':
          message = 'Time for lunch! Take a picture of your meal.';
          break;
        case 'dinner':
          message = 'Time for dinner! Take a picture of your meal.';
          break;
        case 'snack':
          message = 'Time for a snack! Take a picture of your meal.';
          break;
        default:
          message = 'Time to log your meal! Take a picture of your food.';
      }
    }

    onSchedule(scheduledDateTime, message, repeatDaily);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Schedule Meal Reminder
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reminder Type
              </label>
              <select
                value={reminderType}
                onChange={(e) => setReminderType(e.target.value)}
                className="input-field w-full"
              >
                <option value="meal">General Meal</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Custom Message (Optional)
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Custom reminder message..."
                className="input-field w-full"
                rows="2"
              />
            </div>
            <div className="flex items-center">
              <input
                id="repeatDailyNutrition"
                type="checkbox"
                checked={repeatDaily}
                onChange={(e) => setRepeatDaily(e.target.checked)}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="repeatDailyNutrition" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Repeat Daily
              </label>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSchedule}
              className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionReminderDialog;