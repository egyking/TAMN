import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { useApp } from '../../context/AppContext';
import { extractYouTubeId, getYouTubeThumbnail, isYouTubeUrl, isGDriveUrl } from '../../utils/youtube';
import { getTodayKey } from '../../utils/storage';

const CATEGORIES = [
  { id: 'wisdom',  label: 'حكمة في الحياة', emoji: '📖' },
  { id: 'career',  label: 'من شغلي',        emoji: '💼' },
  { id: 'recipe',  label: 'وصفة مطبخ',      emoji: '🍳' },
  { id: 'faith',   label: 'دعاء وقرآن',     emoji: '📿' },
  { id: 'stories', label: 'قصص زمان',       emoji: '🎭' },
  { id: 'advice',  label: 'نصيحة لأولادي',  emoji: '❤️' },
];

export default function AddMemoryModal({ isOpen, onClose }) {
  const { addMemory, showToast } = useApp();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [linkError, setLinkError] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleLinkBlur = () => {
    if (!link.trim()) {
      setLinkError(false);
      setPreview(null);
      return;
    }
    
    if (isYouTubeUrl(link)) {
      setLinkError(false);
      setPreview({ type: 'youtube', img: getYouTubeThumbnail(extractYouTubeId(link)) });
    } else if (isGDriveUrl(link)) {
      setLinkError(false);
      setPreview({ type: 'gdrive' });
    } else {
      setLinkError(true);
      setPreview(null);
    }
  };

  const handleSave = () => {
    addMemory({
      id: Date.now(),
      title,
      link,
      category: category.id,
      date: getTodayKey(),
      description
    });
    showToast('تم حفظ الذكرى ✓');
    
    // Reset form
    setStep(1); setCategory(null); setTitle(''); setLink(''); setDescription('');
    setPreview(null); setLinkError(false);
    
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {
        onClose();
        setTimeout(() => { setStep(1); setCategory(null); }, 300);
      }} 
      title={step === 1 ? "اختر نوع الذكرى" : "تفاصيل الذكرى"}
    >
      {step === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setCategory(cat); setStep(2); }}
              style={{
                minHeight: '80px', backgroundColor: 'white', borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '6px', border: 'none',
                cursor: 'pointer', padding: '16px'
              }}
            >
              <span style={{ fontSize: '32px' }}>{cat.emoji}</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: "'Cairo', sans-serif" }}>{cat.label}</span>
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button 
            onClick={() => setStep(1)}
            style={{ 
              backgroundColor: 'transparent', border: 'none', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', padding: 0,
              fontFamily: "'Cairo', sans-serif", fontWeight: 'bold', cursor: 'pointer', minHeight: 'auto',
              width: 'fit-content'
            }}
          >
            <i className="fa-solid fa-arrow-right"></i> رجوع
          </button>

          {category && (
            <div style={{
              backgroundColor: 'var(--bg)', padding: '8px 16px', borderRadius: '20px',
              fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold',
              width: 'fit-content'
            }}>
              <span>{category.emoji}</span> {category.label}
            </div>
          )}

          <input 
            placeholder="عنوان الذكرى" 
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <div>
            <input 
              placeholder="الصق رابط يوتيوب أو Google Drive" 
              value={link}
              onChange={e => setLink(e.target.value)}
              onBlur={handleLinkBlur}
              dir="ltr"
              style={{
                borderColor: linkError ? 'var(--red)' : 'var(--border)'
              }}
            />
            {linkError && <div style={{ color: 'var(--red)', fontSize: '14px', marginTop: '4px' }}>الرابط غير صحيح</div>}
            
            {preview?.type === 'youtube' && (
              <img src={preview.img} alt="Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginTop: '8px' }} />
            )}
            {preview?.type === 'gdrive' && (
              <div style={{ backgroundColor: 'var(--green-light)', padding: '12px', borderRadius: '12px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--green)', fontWeight: 'bold' }}>
                <span style={{ fontSize: '24px' }}>📁</span> رابط Google Drive
              </div>
            )}
          </div>

          <textarea 
            placeholder="وصف قصير (اختياري)" 
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ minHeight: '100px', resize: 'none' }}
          />

          <button 
            disabled={!title.trim()}
            onClick={handleSave}
            style={{
              width: '100%', height: '68px', backgroundColor: 'var(--green)', color: 'white',
              borderRadius: 'var(--radius-full)', fontSize: '20px', fontWeight: 700,
              border: 'none', cursor: !title.trim() ? 'not-allowed' : 'pointer',
              opacity: !title.trim() ? 0.6 : 1, fontFamily: "'Cairo', sans-serif"
            }}
          >
            حفظ الذكرى ✓
          </button>
        </div>
      )}
    </Modal>
  );
}
