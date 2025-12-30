// hooks/useViewportHeight.js
import { useState, useEffect, useCallback } from 'react';

export const useViewportHeight = () => {
  const [vh, setVh] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight * 0.01;
    }
    return 1;
  });

  const updateViewportHeight = useCallback(() => {
    const vhValue = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vhValue}px`);
    setVh(vhValue);
  }, []);

  useEffect(() => {
    // Set initial value
    updateViewportHeight();

    // Debounced resize handler
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateViewportHeight, 100);
    };

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', updateViewportHeight);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', updateViewportHeight);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [updateViewportHeight]);

  return { vh, updateViewportHeight };
};