export const useHapticFeedback = () => {
  const triggerHapticFeedback = (pattern = [100]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  return { triggerHapticFeedback };
};
