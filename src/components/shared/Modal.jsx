import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'white', borderRadius: '24px 24px 0 0', maxHeight: '90vh',
        width: '100%', maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column',
        animation: 'slideUp 0.3s ease forwards'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{
          position: 'sticky', top: 0, padding: '20px 24px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', borderBottom: '1px solid var(--border)', backgroundColor: 'white',
          borderRadius: '24px 24px 0 0', zIndex: 10
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
            {title}
          </h2>
          <button onClick={onClose} style={{
            width: '44px', height: '44px', minHeight: '44px', backgroundColor: 'transparent', border: 'none', 
            color: 'var(--text-muted)', fontSize: '24px', padding: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style={{
          overflowY: 'auto', padding: '24px', paddingBottom: 'calc(var(--nav-height) + 24px)'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
