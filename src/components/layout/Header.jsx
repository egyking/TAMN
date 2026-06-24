import React from 'react';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const { user } = useApp();
  
  return (
    <header style={{
      height: 'var(--header-height)', backgroundColor: 'white', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between', padding: '0 16px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img 
          src="/logo.jpeg"
          alt="رفيق" 
          style={{ height: '40px', width: 'auto', objectFit: 'contain' }} 
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.style.display = 'none'; 
          }} 
        />
        <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--green)' }}>رفيق</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{user?.name}</span>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--blue-light)',
          color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px'
        }}>
          👤
        </div>
      </div>
    </header>
  );
}
