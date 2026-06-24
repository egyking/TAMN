import React from 'react';

export default function ContactCard({ contact }) {
  const hasPhone = !!contact.phone?.trim();

  return (
    <div style={{
      minWidth: '152px', backgroundColor: 'white', borderRadius: 'var(--radius-md)',
      padding: '20px 16px', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '10px', flexShrink: 0
    }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--blue-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px'
      }}>
        {contact.avatar}
      </div>
      
      <div style={{
        fontSize: '18px', fontWeight: 700, textAlign: 'center', maxWidth: '120px',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
      }}>
        {contact.name || 'بدون اسم'}
      </div>
      
      <div style={{
        fontSize: '14px', backgroundColor: 'var(--bg)', color: 'var(--text-muted)',
        padding: '2px 12px', borderRadius: '20px'
      }}>
        {contact.relation}
      </div>

      <button
        disabled={!hasPhone}
        onClick={() => window.location.href = `tel:${contact.phone}`}
        style={{
          width: '100%', height: '48px', backgroundColor: 'var(--blue)', color: 'white',
          borderRadius: 'var(--radius-full)', fontSize: '18px', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          border: 'none', cursor: hasPhone ? 'pointer' : 'not-allowed',
          opacity: hasPhone ? 1 : 0.5, marginTop: 'auto', fontFamily: "'Cairo', sans-serif"
        }}
      >
        <i className="fa-solid fa-phone"></i>
        {hasPhone ? 'اتصل' : 'لم يُضف'}
      </button>
    </div>
  );
}
