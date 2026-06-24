import React from 'react';
import { useApp } from '../../context/AppContext';
import { getGreeting } from '../../utils/dateUtils';

export default function Header() {
  const { user } = useApp();
  const greeting = getGreeting(user?.name);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, maxWidth: '480px', margin: '0 auto',
      height: 'var(--header-height)', backgroundColor: 'white', zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '0 16px', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '24px', color: 'var(--green)' }}>💚</span>
        <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--green)', fontFamily: "'Cairo', sans-serif" }}>رفيق</span>
      </div>

      <div style={{
        fontSize: '16px', color: 'var(--text-muted)', maxWidth: '50%',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        textAlign: 'center', fontFamily: "'Cairo', sans-serif"
      }}>
        {greeting}
      </div>

      <button style={{
        width: '40px', height: '40px', minHeight: '40px', backgroundColor: 'transparent',
        border: 'none', fontSize: '24px', padding: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center', color: 'var(--text)', cursor: 'pointer'
      }}>
        🔔
      </button>
    </header>
  );
}
