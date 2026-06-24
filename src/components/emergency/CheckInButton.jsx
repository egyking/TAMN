import React from 'react';
import { useApp } from '../../context/AppContext';

export default function CheckInButton() {
  const { checkedInToday, lastCheckInTime, doCheckIn, showToast } = useApp();

  if (!checkedInToday) {
    return (
      <div style={{ backgroundColor: 'var(--green-light)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
        <button
          onClick={() => {
            if (doCheckIn()) showToast("تم تسجيل أنك بخير ✓", 'success');
          }}
          style={{
            width: '100%', height: '72px', backgroundColor: 'var(--green)', color: 'white',
            borderRadius: 'var(--radius-full)', fontSize: '22px', fontWeight: 900,
            border: 'none', cursor: 'pointer', fontFamily: "'Cairo', sans-serif"
          }}
        >
          أنا بخير اليوم ✓
        </button>
        <div style={{ textAlign: 'center', fontSize: '16px', color: 'var(--text-muted)', marginTop: '8px' }}>
          اضغط لتعلم أسرتك أنك بخير
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F0F0F0', borderRadius: 'var(--radius-md)', padding: '24px', textAlign: 'center' }}>
      <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--green-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        ✅ سجّلت أنك بخير
      </div>
      <div style={{ fontSize: '16px', color: 'var(--text-muted)', marginTop: '4px' }}>
        الساعة {lastCheckInTime}
      </div>
    </div>
  );
}
