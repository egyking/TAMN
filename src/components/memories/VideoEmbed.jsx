import React, { useEffect, useState } from 'react';
import Modal from '../shared/Modal';
import { getYouTubeEmbedSrc, isYouTubeUrl, isGDriveUrl, getGDriveEmbedUrl } from '../../utils/youtube';
import { getVideoBlob } from '../../utils/db';

export default function VideoEmbed({ memory, onClose }) {
  const [localVideoUrl, setLocalVideoUrl] = useState(null);

  useEffect(() => {
    if (memory?.isLocalVideo) {
      getVideoBlob(memory.id).then(blob => {
        if (blob) {
          setLocalVideoUrl(URL.createObjectURL(blob));
        }
      });
    }
    return () => {
      if (localVideoUrl) URL.revokeObjectURL(localVideoUrl);
    };
  }, [memory]);

  if (!memory) return null;

  const isYT = isYouTubeUrl(memory?.link);
  const isGDrive = isGDriveUrl(memory?.link);

  return (
    <Modal isOpen={!!memory} onClose={onClose} title={memory.title}>
      {memory.isLocalVideo ? (
        localVideoUrl ? (
          <video
            src={localVideoUrl}
            controls
            autoPlay
            style={{ width: '100%', borderRadius: '12px', backgroundColor: 'black' }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>جاري تحميل الفيديو...</div>
        )
      ) : isYT ? (
        <iframe
          src={getYouTubeEmbedSrc(memory.link)}
          style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px', border: 'none' }}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      ) : isGDrive ? (
        <iframe
          src={getGDriveEmbedUrl(memory.link)}
          style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px', border: 'none' }}
          allowFullScreen
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          {memory.link ? (
            <a href={memory.link} target="_blank" rel="noreferrer" style={{ color: 'var(--blue)', fontSize: '18px' }}>
              فتح الرابط في نافذة جديدة
            </a>
          ) : (
            <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>لا يوجد محتوى لعرضه</p>
          )}
        </div>
      )}
    </Modal>
  );
}
