import React from 'react';
import { useApp } from '../../context/AppContext';
import useMovementTimer from '../../hooks/useMovementTimer';
import BigButton from '../shared/BigButton';
import { toArabicNumerals } from '../../utils/dateUtils';

export default function MovementProgress() {
  const { user, todayMovements, doRecordMovement, showToast } = useApp();
  const { minutesRemaining, isActive } = useMovementTimer();

  const goal = user.movementGoal || 6;
  const progress = Math.min(100, (todayMovements / goal) * 100);
  const isComplete = todayMovements >= goal;

  const handleRecord = () => {
    doRecordMovement();
    showToast('عاش! استمر في الحركة 💪', 'success');
  };

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>الهدف اليومي للحركة</h2>
      
      <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 24px' }}>
        <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="10" />
          <circle 
            cx="50" cy="50" r="45" fill="none" 
            stroke={isComplete ? 'var(--green)' : 'var(--blue)'} 
            strokeWidth="10" 
            strokeLinecap="round"
            strokeDasharray={`${progress * 2.83} 283`}
            style={{ transition: 'stroke-dasharray 1s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: '48px', fontWeight: 900, lineHeight: 1, color: isComplete ? 'var(--green)' : 'var(--blue)' }}>
            {toArabicNumerals(todayMovements)}
          </span>
          <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>
            من {toArabicNumerals(goal)} مرات
          </span>
        </div>
      </div>

      <BigButton 
        label="سجّل حركة جديدة الآن 🚶‍♂️" 
        onClick={handleRecord}
        color={isComplete ? 'var(--green)' : 'var(--blue)'}
      />

      {isActive && !isComplete && (
        <div style={{
          marginTop: '20px', padding: '12px', backgroundColor: 'var(--bg)',
          borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px', fontSize: '18px'
        }}>
          <i className="fa-regular fa-clock" style={{ color: 'var(--text-muted)' }}></i>
          <span>التذكير القادم بعد</span>
          <span style={{ fontWeight: 700, color: 'var(--blue)' }}>
            {toArabicNumerals(minutesRemaining)} دقيقة
          </span>
        </div>
      )}
    </div>
  );
}
