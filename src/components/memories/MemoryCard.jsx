import React, { useState } from 'react';
import ConfirmDialog from '../shared/ConfirmDialog';
import { extractYouTubeId, getYouTubeThumbnail, isYouTubeUrl } from '../../utils/youtube';
import { deleteVideoBlob } from '../../utils/db';

export default function MemoryCard({ memory, onPlay, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const getThumbnail = () => {
    if (memory.isLocalVideo) return null; // Handled in render
    if (isYouTubeUrl(memory.link)) {
      return getYouTubeThumbnail(extractYouTubeId(memory.link));
    }
    return null;
  };

  const thumb = getThumbnail();

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
      <button 
        onClick={() => setShowConfirm(true)}
        style={{
          position: 'absolute', top: '12px', left: '12px', width: '40px', height: '40px',
          borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', color: 'var(--red)',
          border: 'none', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        <i className="fa-solid fa-trash"></i>
      </button>

      {memory.isLocalVideo ? (
        <div 
          onClick={onPlay}
          style={{ height: '180px', position: 'relative', cursor: 'pointer', backgroundColor: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
          }}>
            <i className="fa-solid fa-play" style={{ fontSize: '28px', marginLeft: '4px' }}></i>
          </div>
          <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '14px' }}>
            فيديو مسجل 🎥
          </div>
        </div>
      ) : thumb ? (
        <div 
          onClick={onPlay}
          style={{ height: '180px', backgroundImage: `url(${thumb})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', cursor: 'pointer' }}
        >
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
          }}>
            <i className="fa-solid fa-play" style={{ fontSize: '28px', marginLeft: '4px' }}></i>
          </div>
        </div>
      ) : (
        <div 
          onClick={onPlay}
          style={{ height: '180px', backgroundColor: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--blue)', fontSize: '48px' }}
        >
          <i className="fa-solid fa-link"></i>
        </div>
      )}

      <div style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{memory.title}</h3>
        {memory.description && <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '12px' }}>{memory.description}</p>}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-muted)' }}>
          <span>{memory.date}</span>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="حذف الذكرى؟"
        message="هل أنت متأكد أنك تريد حذف هذه الذكرى نهائياً؟"
        confirmLabel="نعم، احذف"
        cancelLabel="تراجع"
        confirmColor="var(--red)"
        onConfirm={() => { 
          if (memory.isLocalVideo) deleteVideoBlob(memory.id);
          onDelete(); 
          setShowConfirm(false); 
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
