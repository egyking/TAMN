import React from 'react';
import { getWeekDays } from '../../utils/dateUtils';
import { getMovementsForDate } from '../../utils/storage';

export default function WeeklyStreak() {
  const days = getWeekDays();
  
  return (
    <div className="card">
      <h3 className="card-title">نشاطي هذا الأسبوع 📅</h3>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
        {days.map((day, i) => {
          const count = getMovementsForDate(day.date);
          const hasActivity = count > 0;
          
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: hasActivity ? 'var(--green)' : 'var(--bg)',
                color: hasActivity ? 'white' : 'var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', border: hasActivity ? 'none' : '2px solid var(--border)'
              }}>
                {hasActivity ? '✓' : ''}
              </div>
              <span style={{
                fontSize: '14px', fontWeight: day.isToday ? 'bold' : 'normal',
                color: day.isToday ? 'var(--text)' : 'var(--text-muted)'
              }}>
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
