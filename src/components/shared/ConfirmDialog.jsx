import React from 'react';

export default function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  confirmColor = 'var(--red)',
  isOpen
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease'
    }} onClick={onCancel}>
      <div style={{
        width: '90%', maxWidth: '400px', backgroundColor: 'white', borderRadius: '24px', padding: '28px'
      }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px', color: 'var(--text)' }}>
          {title}
        </h3>
        <p style={{ fontSize: '20px', color: 'var(--text-muted)', marginBottom: '24px' }}>
          {message}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={onConfirm} style={{
            width: '100%', height: '68px', backgroundColor: confirmColor, color: 'white', 
            borderRadius: '50px', fontSize: '20px', fontWeight: 700, border: 'none', cursor: 'pointer',
            fontFamily: "'Cairo', sans-serif"
          }}>
            {confirmLabel}
          </button>
          <button onClick={onCancel} style={{
            width: '100%', height: '56px', backgroundColor: 'transparent', color: 'var(--text-muted)', 
            border: '2px solid var(--border)', borderRadius: '50px', fontSize: '18px', fontWeight: 700,
            cursor: 'pointer', fontFamily: "'Cairo', sans-serif"
          }}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
