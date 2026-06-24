import React, { useState, useEffect } from 'react';
import BigButton from '../shared/BigButton';
import { toArabicNumerals } from '../../utils/dateUtils';

export default function ExerciseTimer({ durationSeconds, label }) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Optional: play a sound here
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    if (timeLeft === 0) setTimeLeft(durationSeconds);
    setIsRunning(!isRunning);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${toArabicNumerals(mins)}:${toArabicNumerals(secs.toString().padStart(2, '0'))}`;

  const progress = ((durationSeconds - timeLeft) / durationSeconds) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {!isRunning && timeLeft === durationSeconds ? (
        <BigButton label={label} onClick={toggleTimer} color="var(--blue)" />
      ) : (
        <div style={{
          backgroundColor: isRunning ? 'var(--blue-light)' : 'var(--bg)',
          borderRadius: 'var(--radius-md)', padding: '20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
          transition: 'background-color 0.3s'
        }}>
          <div style={{
            fontSize: '48px', fontWeight: 900, fontFamily: 'monospace',
            color: timeLeft === 0 ? 'var(--green)' : 'var(--blue)',
            animation: isRunning ? 'timerPulse 2s infinite' : 'none'
          }}>
            {timeStr}
          </div>
          
          <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`, backgroundColor: timeLeft === 0 ? 'var(--green)' : 'var(--blue)',
              transition: 'width 1s linear'
            }} />
          </div>

          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <button
              onClick={toggleTimer}
              style={{
                flex: 2, height: '56px', borderRadius: '50px', border: 'none',
                backgroundColor: timeLeft === 0 ? 'var(--green)' : 'var(--blue)',
                color: 'white', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer',
                fontFamily: "'Cairo', sans-serif"
              }}
            >
              {timeLeft === 0 ? 'اكتمل!' : isRunning ? 'إيقاف مؤقت' : 'استئناف'}
            </button>
            <button
              onClick={() => { setIsRunning(false); setTimeLeft(durationSeconds); }}
              style={{
                flex: 1, height: '56px', borderRadius: '50px', border: '2px solid var(--border)',
                backgroundColor: 'white', color: 'var(--text-muted)', fontSize: '18px',
                fontWeight: 'bold', cursor: 'pointer', fontFamily: "'Cairo', sans-serif"
              }}
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
