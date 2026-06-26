import React, { useState, useEffect } from 'react';
import VideoEmbed from '../memories/VideoEmbed';
import { DEFAULT_CONTENT_ITEMS } from '../../config/defaultContent';
import { firebaseContentOps } from '../../firebase/firestore';

export default function ContentGrid() {
  const [playing, setPlaying] = useState(null);
  const [contentItems, setContentItems] = useState(DEFAULT_CONTENT_ITEMS);

  useEffect(() => {
    const unsubscribe = firebaseContentOps.subscribeToContent((data) => {
      if (data.contentItems && data.contentItems.length > 0) {
        setContentItems(data.contentItems);
      }
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  const enabledItems = contentItems.filter(item => item.enabled);

  return (
    <>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'
      }}>
        {enabledItems.map(item => (
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
