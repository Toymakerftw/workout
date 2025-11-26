import { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { Howl } from 'howler';

const REMINDERS_STORAGE_KEY = 'feeel_reminders';

export const useWorkoutReminders = () => {
  const { state } = useAppContext();
  const [reminders, setReminders] = useState(() => {
    try {
      const storedReminders = localStorage.getItem(REMINDERS_STORAGE_KEY);
      if (storedReminders) {
        const parsedReminders = JSON.parse(storedReminders).map(r => ({
          ...r,
          scheduledTime: new Date(r.scheduledTime), // Convert back to Date object
          timeoutId: null // Will be set on re-scheduling
        }));

        // Handle recurring reminders that may have missed their scheduled time while page was closed
        const now = new Date();
        return parsedReminders.map(reminder => {
          if (reminder.recurring === 'daily' && reminder.scheduledTime <= now) {
            // Calculate the next occurrence that is in the future
            let nextOccurrence = new Date(reminder.scheduledTime);

            // Add days until the next occurrence is in the future
            while (nextOccurrence <= now) {
              nextOccurrence.setDate(nextOccurrence.getDate() + 1);
            }

            return {
              ...reminder,
              scheduledTime: nextOccurrence
            };
          }
          return reminder;
        });
      }
      return [];
    } catch (error) {
      console.error("Failed to parse reminders from localStorage", error);
      return [];
    }
  });

  // Function to play notification sound using Web Audio API
  const playNotificationSound = useCallback(() => {
    /* eslint-disable no-unused-vars */
    try {
      // Create audio context
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

      // Create oscillator for the beep sound
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Configure the sound - a pleasant notification beep
      oscillator.type = 'sine'; // sine wave for a pleasant tone
      oscillator.frequency.value = 800; // frequency in hertz
      gainNode.gain.value = 0.3; // volume (0.0 to 1.0)

      // Configure the timing
      const now = audioCtx.currentTime;
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3); // fade out

      // Start and stop the oscillator
      oscillator.start();
      oscillator.stop(now + 0.3); // stop after 0.3 seconds
    } catch (error) {
      // Fallback to Howl if Web Audio API is not supported
      try {
        const notificationSound = new Howl({
          src: ['/notification-sound.mp3', '/assets/notification-sound.mp3', '/sounds/notification.mp3'],
          volume: 0.8,
          onplayerror: function() {
            console.warn('Notification sound failed to play');
          }
        });
        notificationSound.play();
      } catch (fallbackError) {
        // If both methods fail, simply skip the sound
        console.warn('Both Web Audio API and Howl failed to play notification sound');
      }
    }
    /* eslint-enable no-unused-vars */
  }, []);

  const triggerNotification = useCallback((reminder) => {
    // Play notification sound using Web Audio API
    playNotificationSound();

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
  }, [playNotificationSound]);

  const scheduleReminder = useCallback((newReminder) => {
    if (!state.settings.remindersEnabled) return;

    const now = new Date();
    const timeDiff = newReminder.scheduledTime.getTime() - now.getTime();

    if (timeDiff <= 0) { // Don't schedule if time is in the past
      if (newReminder.recurring === 'daily') {
        const nextDay = new Date(newReminder.scheduledTime);
        nextDay.setDate(nextDay.getDate() + 1);

        // Update the stored reminder with the new scheduled time
        setReminders(prev =>
          prev.map(reminder =>
            reminder.id === newReminder.id
              ? { ...reminder, scheduledTime: nextDay, timeoutId: null } // Set timeoutId to null so it gets rescheduled on next load
              : reminder
          )
        );

        return; // We've updated the reminder in the list, so it will be picked up by the useEffect
      }
      return; // For non-recurring reminders in the past, just return without scheduling
    }

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
      if (newReminder.recurring === 'daily') {
        const nextDay = new Date(newReminder.scheduledTime);
        nextDay.setDate(nextDay.getDate() + 1);

        // Update the stored reminder with the new scheduled time
        setReminders(prev =>
          prev.map(reminder =>
            reminder.id === newReminder.id
              ? { ...reminder, scheduledTime: nextDay, timeoutId: null } // Set timeoutId to null so it gets rescheduled on next load
              : reminder
          )
        );

        scheduleReminder({ ...newReminder, scheduledTime: nextDay });
      } else {
        setReminders(prev => prev.filter(r => r.id !== newReminder.id));
      }
    }, timeDiff);

    setReminders(prev => [...prev, { ...newReminder, timeoutId }]);
  }, [state.settings.remindersEnabled, triggerNotification]);


  // Effect to re-schedule reminders when the component mounts or reminders change
  useEffect(() => {
    reminders.forEach(reminder => {
      if (!reminder.timeoutId) { // Only schedule if it doesn't have a timeout
        // For recurring reminders that may have missed their scheduled time while page was closed,
        // we need to potentially reschedule them for the next occurrence
        if (reminder.recurring === 'daily' && reminder.scheduledTime <= new Date()) {
          // Calculate the next occurrence that is in the future
          const now = new Date();
          let nextOccurrence = new Date(reminder.scheduledTime);

          // Add days until the next occurrence is in the future
          while (nextOccurrence <= now) {
            nextOccurrence.setDate(nextOccurrence.getDate() + 1);
          }

          // Create a new reminder with the updated time and schedule it
          const updatedReminder = {
            ...reminder,
            scheduledTime: nextOccurrence
          };
          scheduleReminder(updatedReminder);
        } else {
          scheduleReminder(reminder);
        }
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
  }, [reminders, scheduleReminder]);


  // Effect to save reminders to localStorage whenever they change
  useEffect(() => {
    try {
      // Don't store timeoutId in localStorage - create a clean serializable version
      const serializableReminders = reminders.map(reminder => ({
        id: reminder.id,
        reminderType: reminder.reminderType,
        workoutId: reminder.workoutId,
        workoutName: reminder.workoutName,
        customMessage: reminder.customMessage,
        scheduledTime: reminder.scheduledTime.toISOString(), // Store as ISO string
        recurring: reminder.recurring
      })).filter(reminder => reminder.scheduledTime); // Ensure we have a valid scheduledTime

      localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(serializableReminders));
    } catch (error) {
      console.error("Failed to save reminders to localStorage", error);
    }
  }, [reminders]);

  // Function to schedule a workout reminder
  const scheduleWorkoutReminder = useCallback((workout, scheduledTime, repeatDaily) => {
    const reminderId = `workout-${workout.id}`; // Use a stable ID for recurring reminders
    const newReminder = {
      id: reminderId,
      reminderType: 'workout',
      workoutId: workout.id,
      workoutName: workout.name,
      scheduledTime,
      recurring: repeatDaily ? 'daily' : null,
      timeoutId: null
    };
    scheduleReminder(newReminder);
  }, [scheduleReminder]);

  // Function to schedule a nutrition reminder
  const scheduleNutritionReminder = useCallback((scheduledTime, customMessage = 'Time to log your meal!', repeatDaily) => {
    const reminderId = `nutrition-${new Date().getTime()}`; // Less chance of stable ID needed here unless we build a UI for it
    const newReminder = {
      id: reminderId,
      reminderType: 'nutrition',
      customMessage,
      scheduledTime,
      recurring: repeatDaily ? 'daily' : null,
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