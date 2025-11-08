import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export const ActivityScreen = () => {
  const { state } = useAppContext();
  const history = state.workoutHistory;
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Group workout history by date
  const historyByDate = history.reduce((acc, record) => {
    const date = record.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {});

  // Convert selected date to string format for comparison
  const selectedDateString = selectedDate.toISOString().split('T')[0];

  // Get workouts for the selected date
  const workoutsForSelectedDate = historyByDate[selectedDateString] || [];

  const totalWorkouts = history.length;
  const totalMinutes = history.reduce((total, record) => {
    const durationMatch = record.duration.match(/(\d+)\s*min/) || record.duration.match(/(\d+)\s*h/);
    if (durationMatch) {
      const value = parseInt(durationMatch[1]);
      if (record.duration.includes('h')) {
        return total + value * 60;
      }
      return total + value;
    }
    return total;
  }, 0);
  const totalCalories = history.reduce((total, record) => total + record.calories, 0);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Activity
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your workout history and progress
        </p>
      </div>

      {/* Stats Card */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          This Week
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              {totalWorkouts}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Workouts
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              {totalMinutes}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Minutes
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              {totalCalories}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Calories
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Calendar
          </h2>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex justify-center">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={({ date, view }) => {
                  const dateString = date.toISOString().split('T')[0];
                  return historyByDate[dateString]
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded'
                    : null;
                }}
                minDetail="month"
                className="w-full max-w-sm mx-auto"
              />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
            {workoutsForSelectedDate.length > 0 ? (
              <div className="space-y-3">
                {workoutsForSelectedDate.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {record.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {record.duration} • {record.calories} kcal
                        </p>
                      </div>
                      {record.status === 'incomplete' && (
                        <span className="px-2 py-1 text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded">
                          Incomplete
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No workouts on this date</p>
                <p className="text-sm mt-1">Complete a workout to see it here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Workout History */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            All Workout History
          </h2>
        </div>

        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map((record) => (
              <div
                key={record.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      {record.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {record.date} • {record.duration} • {record.calories} kcal
                    </p>
                  </div>
                  {record.status === 'incomplete' && (
                    <span className="px-2 py-1 text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded ml-4">
                      Incomplete
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No workout history yet.</p>
            <p className="text-sm mt-1">Complete a workout to see it here!</p>
          </div>
        )}
      </div>
    </div>
  );
};
