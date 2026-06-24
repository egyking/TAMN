import { useState, useEffect } from 'react';
import { getTodayMovements } from '../utils/storage';

export default function useMovementTimer() {
  const [minutesRemaining, setMinutesRemaining] = useState(null);

  useEffect(() => {
    const calculateRemaining = () => {
      const now = new Date();
      const hour = now.getHours();
      // Only active during waking hours (6 AM - 10 PM)
      if (hour < 6 || hour >= 22) {
        setMinutesRemaining(null);
        return;
      }
      // Reminder every 90 minutes
      const minutesSinceWake = (hour - 6) * 60 + now.getMinutes();
      const nextSlot = Math.ceil(minutesSinceWake / 90) * 90;
      const remaining = nextSlot - minutesSinceWake;
      setMinutesRemaining(remaining <= 0 ? 90 : remaining);
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 60000);
    return () => clearInterval(interval);
  }, []);

  return { minutesRemaining, isActive: minutesRemaining !== null };
}
