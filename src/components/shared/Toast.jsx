import React from 'react';

export default function Toast({ message, type = 'success' }) {
  const bgColors = {
    success: 'var(--green)',
    error: 'var(--red)',
    info: 'var(--blue)'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(var(--nav-height) + 16px)',
      left: '16px',
      right: '16px',
      zIndex: 900,
      backgroundColor: bgColors[type],
      color: 'white',
      fontFamily: "'Cairo', sans-serif",
      fontSize: '18px',
      fontWeight: 'bold',
      padding: '16px 20px',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      animation: 'toastSlideIn 0.3s ease forwards',
      textAlign: 'right'
    }}>
      {message}
    </div>
  );
}
