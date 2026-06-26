import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TABS = [
  { path: '/emergency', label: 'الطوارئ', icon: 'fa-solid fa-phone-volume', color: '#D32F2F' },
  { path: '/memories',  label: 'ذكرياتي', icon: 'fa-solid fa-heart',         color: '#2EAA1C' },
  { path: '/movement',  label: 'تحرّك',   icon: 'fa-solid fa-person-walking', color: '#1A7DC4' },
  { path: '/mytime',    label: 'وقتي',    icon: 'fa-solid fa-radio',          color: '#F57C00' },
  { path: '/ai-chat',   label: 'سألني',   icon: 'fa-solid fa-robot',          color: '#6366F1' },
  { path: '/admin',     label: 'الأدمن',  icon: 'fa-solid fa-shield-halved',  color: '#6B21A8' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: '480px', margin: '0 auto',
      height: 'var(--nav-height)', backgroundColor: 'white', zIndex: 100,
      display: 'flex', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)'
    }}>
      {TABS.map(tab => {
        const isActive = location.pathname.startsWith(tab.path);
        
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: '4px', border: 'none', backgroundColor: 'transparent',
              padding: '8px 0', minHeight: 'var(--nav-height)', cursor: 'pointer',
              position: 'relative', borderRadius: 0,
              color: isActive ? tab.color : '#9CA3AF'
            }}
          >
            {isActive && (
              <div style={{
                position: 'absolute', top: 0, left: '10%', right: '10%',
                height: '3px', backgroundColor: tab.color,
                borderBottomLeftRadius: '3px', borderBottomRightRadius: '3px'
              }} />
            )}
            <i className={tab.icon} style={{ fontSize: '24px' }}></i>
            <span style={{
              fontSize: '14px', fontWeight: isActive ? 700 : 600,
              fontFamily: "'Cairo', sans-serif"
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
