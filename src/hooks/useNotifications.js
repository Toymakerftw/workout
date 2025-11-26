import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export const useNotifications = () => {
  const { state } = useAppContext();
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if (!('Notification' in window)) {
      console.warn("Notifications are not supported in this browser.");
      return;
    }

    // Set initial permission status
    setPermission(Notification.permission);

    // Request permission if reminders are enabled and permission is not granted yet
    if (state.settings.remindersEnabled && Notification.permission === 'default') {
      Notification.requestPermission().then(setPermission);
    }

    // Listen for changes in permission (e.g., if user changes it manually)
    // Note: This part is tricky as there's no direct event listener for Notification.permission changes
    // A workaround could be to periodically check or re-request, but that's usually not ideal.
    // For now, we rely on the initial check and explicit requests.
  }, [state.settings.remindersEnabled]); // Re-run effect if remindersEnabled changes

  // Exposing a direct request function in case a component needs to trigger it explicitly
  // (e.g., if user clicks a button to enable notifications)
  const requestPermission = () => {
    if (!('Notification' in window)) {
      console.warn("Notifications are not supported in this browser.");
      return Promise.resolve('denied'); // Or 'unsupported'
    }
    return Notification.requestPermission().then(status => {
      setPermission(status);
      return status;
    });
  };

  const sendNotification = (title, options) => {
    if (permission === 'granted') {
      new Notification(title, options);
    } else {
      console.warn("Cannot send notification: Permission not granted.");
    }
  };

  return { permission, requestPermission, sendNotification };
};
