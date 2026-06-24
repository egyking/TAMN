import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { isMedTakenToday } from '../../utils/storage';
import { toArabicNumerals } from '../../utils/dateUtils';

export default function MedicationTracker() {
  const { user, doRecordMed } = useApp();
  
  const enabledMeds = user.medications.filter(m => m.enabled);
  const total = enabledMeds.length;
  
  const [takenStatus, setTakenStatus] = useState(() => {
    const status = {};
    enabledMeds.forEach(m => {
      status[m.id] = isMedTakenToday(m.id);
    });
    return status;
  });

  const handleCheck = (medId) => {
    if (takenStatus[medId]) return;
    doRecordMed(medId);
    setTakenStatus(prev => ({ ...prev, [medId]: true }));
  };

  const timeLabels = { morning: 'الصباح ☀️', noon: 'الظهر 🌤️', evening: 'المساء 🌅', night: 'النوم 🌙' };

  if (total === 0) {
    return (
      <div className="card">
        <h2 className="card-title">💊 أدويتي اليوم</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', textAlign: 'center' }}>
          لم تُضف أدوية — أضف أدويتك من الإعدادات
        </p>
      </div>
    );
  }

  const takenCount = Object.values(takenStatus).filter(Boolean).length;
  const progressPercent = (takenCount / total) * 100;

  return (
    <div className="card">
      <h2 className="card-title">💊 أدويتي اليوم</h2>
      
      <div style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '8px' }}>
        أخذت {toArabicNumerals(takenCount)} من {toArabicNumerals(total)} أدوية
      </div>
      
      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ height: '100%', backgroundColor: 'var(--green)', width: `${progressPercent}%`, transition: 'width 0.3s ease' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {enabledMeds.map(m => {
          const isTaken = takenStatus[m.id];
          return (
            <div key={m.id} style={{ minHeight: '60px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => handleCheck(m.id)}
                disabled={isTaken}
                style={{
                  width: '44px', height: '44px', minHeight: '44px', borderRadius: '12px', padding: 0,
                  backgroundColor: isTaken ? 'var(--green)' : 'white',
                  border: isTaken ? 'none' : '2px solid var(--border)',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', cursor: isTaken ? 'default' : 'pointer'
                }}
              >
                {isTaken && <i className="fa-solid fa-check"></i>}
              </button>
              
              <span style={{ 
                fontSize: '20px', flex: 1, 
                textDecoration: isTaken ? 'line-through' : 'none',
                color: isTaken ? 'var(--text-muted)' : 'var(--text)'
              }}>
                {m.name || 'بدون اسم'}
              </span>
              
              <span style={{
                fontSize: '14px', padding: '4px 12px', borderRadius: '20px',
                backgroundColor: 'var(--bg)', color: 'var(--text-muted)'
              }}>
                {timeLabels[m.time]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
