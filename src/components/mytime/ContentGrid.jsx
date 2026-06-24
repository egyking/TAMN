import React, { useState } from 'react';
import VideoEmbed from '../memories/VideoEmbed';

const CONTENT = [
  { id: 'quran',    label: 'القرآن الكريم', icon: 'fa-solid fa-book-quran', color: '#2EAA1C', url: 'https://www.youtube.com/watch?v=0IzeUbs1zHw' },
  { id: 'radio',    label: 'إذاعة القرآن',  icon: 'fa-solid fa-radio',      color: '#1A7DC4', url: 'https://www.youtube.com/watch?v=Fj-yRtn4X9E' },
  { id: 'news',     label: 'أخبار اليوم',   icon: 'fa-solid fa-newspaper',  color: '#D32F2F', url: 'https://www.youtube.com/watch?v=R91kS9hQ4_M' },
  { id: 'health',   label: 'نصائح طبية',    icon: 'fa-solid fa-stethoscope',color: '#F57C00', url: 'https://www.youtube.com/watch?v=9g0HIfY4Tig' },
  { id: 'cooking',  label: 'طبخ ووصفات',    icon: 'fa-solid fa-utensils',   color: '#7B1FA2', url: 'https://www.youtube.com/watch?v=3M_k-3G_T1w' },
  { id: 'nostalgia',label: 'كلاسيكيات',     icon: 'fa-solid fa-tv',         color: '#607D8B', url: 'https://www.youtube.com/watch?v=t1Z8x0wF32M' },
];

export default function ContentGrid() {
  const [playing, setPlaying] = useState(null);

  return (
    <>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'
      }}>
        {CONTENT.map(item => (
          <button
            key={item.id}
            onClick={() => setPlaying(item)}
            style={{
              height: '140px', backgroundColor: 'white', borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '12px', border: 'none',
              cursor: 'pointer', transition: 'var(--transition)'
            }}
          >
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%', backgroundColor: `${item.color}15`,
              color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px'
            }}>
              <i className={item.icon}></i>
            </div>
            <span style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: "'Cairo', sans-serif" }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <VideoEmbed 
        memory={playing ? { title: playing.label, link: playing.url } : null} 
        onClose={() => setPlaying(null)} 
      />
    </>
  );
}
