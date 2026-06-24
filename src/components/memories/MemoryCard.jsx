import React, { useState } from 'react';
import { extractYouTubeId, getYouTubeThumbnail, isYouTubeUrl, isGDriveUrl } from '../../utils/youtube';
import { formatArabicDate } from '../../utils/dateUtils';
import ConfirmDialog from '../shared/ConfirmDialog';

const CAT_MAP = {
  wisdom: { label: 'حكمة', emoji: '📖', bg: '#FFF3E0' },
  career: { label: 'شغل', emoji: '💼', bg: '#E3F2FD' },
  recipe: { label: 'وصفة', emoji: '🍳', bg: '#FFF8E1' },
  faith:  { label: 'دعاء', emoji: '📿', bg: '#E8F5E3' },
  stories:{ label: 'قصة',  emoji: '🎭', bg: '#F3E5F5' },
  advice: { label: 'نصيحة',emoji: '❤️', bg: '#FFEBEE' },
};

export default function MemoryCard({ memory, onPlay, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const badge = CAT_MAP[memory.category] || { label: 'أخرى', emoji: '📋', bg: '#F5F7FA' };
  
  const isYT = isYouTubeUrl(memory.link);
  const isGDrive = isGDriveUrl(memory.link);

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {isYT && (
        <div 
          onClick={onPlay}
          style={{ height: '180px', position: 'relative', cursor: 'pointer', backgroundColor: 'black' }}
        >
          <img 
            src={getYouTubeThumbnail(extractYouTubeId(memory.link))} 
            alt="Thumbnail"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
          />
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
          }}>
            <i className="fa-solid fa-play" style={{ fontSize: '28px', marginLeft: '4px' }}></i>
          </div>
        </div>
      )}

      {isGDrive && (
        <div 
          onClick={onPlay}
          style={{ 
            height: '80px', backgroundColor: 'var(--green-light)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontSize: '18px', fontWeight: 'bold', color: 'var(--green)'
          }}
        >
          <span style={{ fontSize: '36px' }}>📁</span> Google Drive
        </div>
      )}

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            backgroundColor: badge.bg, padding: '4px 12px', borderRadius: '20px',
            fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold'
          }}>
            <span>{badge.emoji}</span> {badge.label}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {formatArabicDate(memory.date)}
          </div>
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: 700, marginTop: '8px' }}>{memory.title}</h3>
        
        {memory.description && (
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {memory.description}
          </p>
        )}

        <button 
          onClick={() => setShowConfirm(true)}
          style={{
            backgroundColor: 'transparent', border: 'none', color: 'var(--red)',
            fontSize: '16px', padding: 0, marginTop: '12px', minHeight: 'auto',
            fontFamily: "'Cairo', sans-serif", fontWeight: 'bold'
          }}
        >
          حذف
        </button>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="حذف الذكرى؟"
        message="هل أنت متأكد أنك تريد حذف هذه الذكرى؟"
        confirmLabel="نعم، احذف"
        cancelLabel="تراجع"
        confirmColor="var(--red)"
        onConfirm={() => { onDelete(); setShowConfirm(false); }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
