import { useState, useEffect } from 'react';

export const useTime = (smooth = true) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let animationFrameId: number;
    let timeoutId: number;

    const updateTime = () => {
      setTime(new Date());
      if (smooth) {
        animationFrameId = requestAnimationFrame(updateTime);
      } else {
        const now = new Date();
        const delay = 1000 - now.getMilliseconds();
        timeoutId = window.setTimeout(updateTime, delay);
      }
    };

    updateTime();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, [smooth]);

  return time;
};
