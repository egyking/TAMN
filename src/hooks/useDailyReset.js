import { useEffect, useRef } from 'react';
import { getTodayKey } from '../utils/storage';

export default function useDailyReset(onNewDay) {
  const lastDate = useRef(getTodayKey());

  useEffect(() => {
    const check = () => {
      const today = getTodayKey();
      if (today !== lastDate.current) {
        lastDate.current = today;
        if (onNewDay) onNewDay();
      }
    };
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [onNewDay]);
}
