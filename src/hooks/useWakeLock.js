import { useState, useEffect } from 'react';

export const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState(null);
  const [supported, setSupported] = useState('wakeLock' in navigator);

  const request = async () => {
    if (!supported) return;
    
    try {
      const wakeLockInstance = await navigator.wakeLock.request('screen');
      setWakeLock(wakeLockInstance);
      
      wakeLockInstance.addEventListener('release', () => {
        console.log('Screen Wake Lock released');
      });

      return wakeLockInstance;
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
      return null;
    }
  };

  const release = async () => {
    if (wakeLock !== null) {
      try {
        await wakeLock.release();
        setWakeLock(null);
      } catch (err) {
        console.error(`${err.name}, ${err.message}`);
      }
    }
  };

  useEffect(() => {
    // Release wake lock when component unmounts
    return () => {
      if (wakeLock) {
        release();
      }
    };
  }, [wakeLock]);

  // Add event listener to request wake lock again when visibility changes
  useEffect(() => {
    if (!supported) return;

    const handleVisibilityChange = async () => {
      if (wakeLock && document.visibilityState === 'visible') {
        await request();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [wakeLock, supported]);

  return { request, release, supported, isLocked: wakeLock !== null };
};