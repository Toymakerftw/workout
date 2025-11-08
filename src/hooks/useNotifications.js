import { useState, useEffect } from 'react';

export const useNotifications = () => {
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(setPermission);
    }
  };

  const sendNotification = (title, options) => {
    if (permission === 'granted') {
      new Notification(title, options);
    }
  };

  return { permission, requestPermission, sendNotification };
};
