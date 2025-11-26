import { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';

const REMINDERS_STORAGE_KEY = 'feeel_reminders';

export const useWorkoutReminders = () => {
  const { state } = useAppContext();
  const [reminders, setReminders] = useState(() => {
    try {
      const storedReminders = localStorage.getItem(REMINDERS_STORAGE_KEY);
      return storedReminders ? JSON.parse(storedReminders).map(r => ({
        ...r,
        scheduledTime: new Date(r.scheduledTime), // Convert back to Date object
        timeoutId: null // Will be set on re-scheduling
      })) : [];
    } catch (error) {
      console.error("Failed to parse reminders from localStorage", error);
      return [];
    }
  });

  // Effect to re-schedule reminders when the component mounts or reminders change
  useEffect(() => {
    reminders.forEach(reminder => {
      const now = new Date();
      const timeDiff = reminder.scheduledTime.getTime() - now.getTime();

      if (timeDiff > 0 && !reminder.timeoutId) { // Only re-schedule if in the future and not already scheduled
        const timeoutId = setTimeout(() => {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(
              reminder.reminderType === 'workout' ? 'Workout Reminder' : 'Meal Reminder',
              {
                body: reminder.reminderType === 'workout'
                  ? `Time for your "${reminder.workoutName}" workout!`
                  : reminder.customMessage,
                icon: '/android-chrome-192x192.png',
                tag: reminder.id
              }
            );
          } else if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
              registration.showNotification(
                reminder.reminderType === 'workout' ? 'Workout Reminder' : 'Meal Reminder',
                {
                  body: reminder.reminderType === 'workout'
                    ? `Time for your "${reminder.workoutName}" workout!`
                    : reminder.customMessage,
                  icon: '/android-chrome-192x192.png',
                  tag: reminder.id
                }
              );
            });
          }
          setReminders(prev => prev.filter(r => r.id !== reminder.id));
        }, timeDiff);

        setReminders(prev =>
          prev.map(r => (r.id === reminder.id ? { ...r, timeoutId } : r))
        );
      } else if (timeDiff <= 0 && reminder.timeoutId) {
        // Clear past reminders that somehow still have a timeoutId
        clearTimeout(reminder.timeoutId);
        setReminders(prev => prev.filter(r => r.id !== reminder.id));
      }
    });

    // Cleanup function to clear all timeouts if the component unmounts
    return () => {
      reminders.forEach(reminder => {
        if (reminder.timeoutId) {
          clearTimeout(reminder.timeoutId);
        }
      });
    };
  }, [reminders]);


  // Effect to save reminders to localStorage whenever they change
  useEffect(() => {
    try {
      // Don't store timeoutId in localStorage
      const serializableReminders = reminders.map(({ timeoutId, ...rest }) => ({
        ...rest,
        scheduledTime: rest.scheduledTime.toISOString() // Store as ISO string
      }));
      localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(serializableReminders));
    } catch (error) {
      console.error("Failed to save reminders to localStorage", error);
    }
  }, [reminders]);

  const triggerNotification = useCallback((reminder) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(
        reminder.reminderType === 'workout' ? 'Workout Reminder' : 'Meal Reminder',
        {
          body: reminder.reminderType === 'workout'
            ? `Time for your "${reminder.workoutName}" workout!`
            : reminder.customMessage,
          icon: '/android-chrome-192x192.png',
          tag: reminder.id
        }
      );
    } else if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(
          reminder.reminderType === 'workout' ? 'Workout Reminder' : 'Meal Reminder',
          {
            body: reminder.reminderType === 'workout'
              ? `Time for your "${reminder.workoutName}" workout!`
              : reminder.customMessage,
            icon: '/android-chrome-192x192.png',
            tag: reminder.id
          }
        );
      });
    }
  }, []);

  const scheduleReminder = useCallback((newReminder) => {
    if (!state.settings.remindersEnabled) return;

    const now = new Date();
    const timeDiff = newReminder.scheduledTime.getTime() - now.getTime();

    if (timeDiff <= 0) return; // Don't schedule if time is in the past

    // Clear existing reminder if it has the same ID
    setReminders(prev => {
      const existing = prev.find(r => r.id === newReminder.id);
      if (existing && existing.timeoutId) {
        clearTimeout(existing.timeoutId);
      }
      return prev.filter(r => r.id !== newReminder.id);
    });

    const timeoutId = setTimeout(() => {
      triggerNotification(newReminder);
      setReminders(prev => prev.filter(r => r.id !== newReminder.id));
    }, timeDiff);

    setReminders(prev => [...prev, { ...newReminder, timeoutId }]);
  }, [state.settings.remindersEnabled, triggerNotification]);

  // Function to schedule a workout reminder
  const scheduleWorkoutReminder = useCallback((workout, scheduledTime) => {
    const reminderId = `workout-${workout.id}-${scheduledTime.getTime()}`;
    const newReminder = {
      id: reminderId,
      reminderType: 'workout',
      workoutId: workout.id,
      workoutName: workout.name,
      scheduledTime,
      timeoutId: null
    };
    scheduleReminder(newReminder);
  }, [scheduleReminder]);

  // Function to schedule a nutrition reminder
  const scheduleNutritionReminder = useCallback((scheduledTime, customMessage = 'Time to log your meal!') => {
    const reminderId = `nutrition-${scheduledTime.getTime()}`;
    const newReminder = {
      id: reminderId,
      reminderType: 'nutrition',
      customMessage,
      scheduledTime,
      timeoutId: null
    };
    scheduleReminder(newReminder);
  }, [scheduleReminder]);

  // Function to cancel a specific reminder
  const cancelReminder = useCallback((reminderId) => {
    setReminders(prev => {
      const reminderToCancel = prev.find(r => r.id === reminderId);
      if (reminderToCancel && reminderToCancel.timeoutId) {
        clearTimeout(reminderToCancel.timeoutId);
      }
      return prev.filter(r => r.id !== reminderId);
    });
  }, []);


  // Function to cancel all reminders for a specific workout
  const cancelAllRemindersForWorkout = useCallback((workoutId) => {
    setReminders(prev => {
      const remainingReminders = prev.filter(r => {
        if (r.reminderType === 'workout' && r.workoutId === workoutId) {
          if (r.timeoutId) clearTimeout(r.timeoutId);
          return false;
        }
        return true;
      });
      return remainingReminders;
    });
  }, []);

  // Function to cancel all nutrition reminders
  const cancelAllNutritionReminders = useCallback(() => {
    setReminders(prev => {
      const remainingReminders = prev.filter(r => {
        if (r.reminderType === 'nutrition') {
          if (r.timeoutId) clearTimeout(r.timeoutId);
          return false;
        }
        return true;
      });
      return remainingReminders;
    });
  }, []);

  // Cleanup function to clear all reminders when component unmounts or reminders are disabled
  const cancelAllReminders = useCallback(() => {
    setReminders(prev => {
      prev.forEach(reminder => {
        if (reminder.timeoutId) {
          clearTimeout(reminder.timeoutId);
        }
      });
      return [];
    });
  }, []);

  // Effect to handle remindersEnabled setting change
  useEffect(() => {
    if (!state.settings.remindersEnabled) {
      cancelAllReminders();
    }
  }, [state.settings.remindersEnabled, cancelAllReminders]);

  return {
    reminders,
    scheduleWorkoutReminder,
    scheduleNutritionReminder,
    cancelReminder, // Renamed from cancelWorkoutReminder for generality
    cancelAllRemindersForWorkout,
    cancelAllNutritionReminders,
    cancelAllReminders
  };
};