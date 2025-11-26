import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

export const useWorkoutReminders = () => {
  const { state } = useAppContext();
  const [reminders, setReminders] = useState([]);

  // Function to schedule a workout reminder
  const scheduleWorkoutReminder = (workout, scheduledTime) => {
    if (!state.settings.remindersEnabled) return;

    const now = new Date();
    const timeDiff = scheduledTime.getTime() - now.getTime();

    // Don't schedule if time is in the past
    if (timeDiff <= 0) return;

    // Create a unique ID for the reminder
    const reminderId = `workout-${workout.id}-${scheduledTime.getTime()}`;

    // Check if a similar reminder already exists
    const existingReminder = reminders.find(r => r.id === reminderId);
    if (existingReminder) {
      // Clear the existing reminder
      clearTimeout(existingReminder.timeoutId);
    }

    const timeoutId = setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Workout Reminder', {
          body: `Time for your "${workout.name}" workout!`,
          icon: '/android-chrome-192x192.png',
          tag: reminderId
        });
      } else if ('serviceWorker' in navigator) {
        // Use service worker notification if available
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification('Workout Reminder', {
            body: `Time for your "${workout.name}" workout!`,
            icon: '/android-chrome-192x192.png',
            tag: reminderId
          });
        });
      }

      // Remove the reminder after it's triggered
      setReminders(prev => prev.filter(r => r.id !== reminderId));
    }, timeDiff);

    // Store the reminder
    const newReminder = {
      id: reminderId,
      reminderType: 'workout',
      workoutId: workout.id,
      workoutName: workout.name,
      scheduledTime,
      timeoutId
    };

    setReminders(prev => [...prev, newReminder]);
  };

  // Function to schedule a nutrition reminder
  const scheduleNutritionReminder = (scheduledTime, customMessage = 'Time to log your meal!') => {
    if (!state.settings.remindersEnabled) return;

    const now = new Date();
    const timeDiff = scheduledTime.getTime() - now.getTime();

    // Don't schedule if time is in the past
    if (timeDiff <= 0) return;

    // Create a unique ID for the nutrition reminder
    const reminderId = `nutrition-${scheduledTime.getTime()}`;

    // Check if a similar reminder already exists
    const existingReminder = reminders.find(r => r.id === reminderId);
    if (existingReminder) {
      // Clear the existing reminder
      clearTimeout(existingReminder.timeoutId);
    }

    const timeoutId = setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Meal Reminder', {
          body: customMessage,
          icon: '/android-chrome-192x192.png',
          tag: reminderId
        });
      } else if ('serviceWorker' in navigator) {
        // Use service worker notification if available
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification('Meal Reminder', {
            body: customMessage,
            icon: '/android-chrome-192x192.png',
            tag: reminderId
          });
        });
      }

      // Remove the reminder after it's triggered
      setReminders(prev => prev.filter(r => r.id !== reminderId));
    }, timeDiff);

    // Store the reminder
    const newReminder = {
      id: reminderId,
      reminderType: 'nutrition',
      customMessage,
      scheduledTime,
      timeoutId
    };

    setReminders(prev => [...prev, newReminder]);
  };

  // Function to cancel a specific reminder
  const cancelWorkoutReminder = (reminderId) => {
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder) {
      clearTimeout(reminder.timeoutId);
      setReminders(prev => prev.filter(r => r.id !== reminderId));
    }
  };

  // Function to cancel all reminders for a specific workout
  const cancelAllRemindersForWorkout = (workoutId) => {
    const workoutReminders = reminders.filter(r => r.workoutId === workoutId);
    workoutReminders.forEach(reminder => {
      clearTimeout(reminder.timeoutId);
    });
    setReminders(prev => prev.filter(r => r.workoutId !== workoutId));
  };

  // Function to cancel all nutrition reminders
  const cancelAllNutritionReminders = () => {
    const nutritionReminders = reminders.filter(r => r.reminderType === 'nutrition');
    nutritionReminders.forEach(reminder => {
      clearTimeout(reminder.timeoutId);
    });
    setReminders(prev => prev.filter(r => r.reminderType !== 'nutrition'));
  };

  // Cleanup function to clear all reminders when component unmounts
  const cancelAllReminders = () => {
    reminders.forEach(reminder => {
      clearTimeout(reminder.timeoutId);
    });
    setReminders([]);
  };

  // Effect to handle remindersEnabled setting change
  useEffect(() => {
    if (!state.settings.remindersEnabled) {
      // Cancel all reminders if reminders are disabled
      cancelAllReminders();
    }
  }, [state.settings.remindersEnabled]);

  return {
    reminders,
    scheduleWorkoutReminder,
    scheduleNutritionReminder,
    cancelWorkoutReminder,
    cancelAllRemindersForWorkout,
    cancelAllNutritionReminders,
    cancelAllReminders
  };
};