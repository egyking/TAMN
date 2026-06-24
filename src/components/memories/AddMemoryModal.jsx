import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { useApp } from '../../context/AppContext';
import { extractYouTubeId, getYouTubeThumbnail, isYouTubeUrl, isGDriveUrl } from '../../utils/youtube';
import { getTodayKey } from '../../utils/storage';
import { saveVideoBlob } from '../../utils/db';
import VideoRecorder from './VideoRecorder';
import BigButton from '../shared/BigButton';

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
  
  // Selection step: 0 = Link, 1 = Record
  const [inputType, setInputType] = useState(null); 
  
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [linkError, setLinkError] = useState(false);
  const [preview, setPreview] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);

  const resetForm = () => {
    setStep(1); setCategory(null); setInputType(null);
    setTitle(''); setLink(''); setDescription('');
    setPreview(null); setLinkError(false); setRecordedBlob(null);
  };

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

  const handleSave = async () => {
    const memoryId = Date.now().toString();
    
    if (inputType === 'record' && recordedBlob) {
      await saveVideoBlob(memoryId, recordedBlob);
    }

    addMemory({
      id: memoryId,
      title,
      link: inputType === 'link' ? link : null,
      isLocalVideo: inputType === 'record',
      category: category.id,
      date: getTodayKey(),
      description
    });
    
    showToast('تم حفظ الذكرى ✓');
    resetForm();
    onClose();
  };

  const renderContent = () => {
    if (step === 1) {
      return (
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
      );
    }

    if (step === 2) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', padding: '20px 0' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>كيف تفضل إضافة الذكرى؟</h3>
          <BigButton 
            label="سجّل فيديو بنفسي الآن 🎥" 
            onClick={() => { setInputType('record'); setStep(3); }} 
            color="var(--red)"
          />
          <BigButton 
            label="إضافة رابط يوتيوب/درايف 🔗" 
            onClick={() => { setInputType('link'); setStep(3); }} 
            color="var(--blue)"
          />
        </div>
      );
    }

    if (step === 3) {
      if (inputType === 'record' && !recordedBlob) {
        return <VideoRecorder onVideoRecorded={(blob) => setRecordedBlob(blob)} onCancel={() => setStep(2)} />;
      }

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button 
            onClick={() => setStep(2)}
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

          {inputType === 'link' ? (
            <div>
              <input 
                placeholder="الصق رابط يوتيوب أو Google Drive" 
                value={link}
                onChange={e => setLink(e.target.value)}
                onBlur={handleLinkBlur}
                dir="ltr"
                style={{ borderColor: linkError ? 'var(--red)' : 'var(--border)' }}
              />
              {linkError && <div style={{ color: 'var(--red)', fontSize: '14px', marginTop: '4px' }}>الرابط غير صحيح</div>}
              
              {preview?.type === 'youtube' && (
                <img src={preview.img} alt="Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginTop: '8px' }} />
              )}
            </div>
          ) : (
            <div style={{ 
              backgroundColor: 'var(--green-light)', padding: '16px', borderRadius: '12px', 
              display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--green)' 
            }}>
              <span style={{ fontSize: '32px' }}>✅</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>تم تسجيل الفيديو بنجاح!</span>
              <button 
                onClick={() => setRecordedBlob(null)}
                style={{ 
                  marginRight: 'auto', backgroundColor: 'transparent', border: 'none', 
                  color: 'var(--red)', fontWeight: 'bold', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" 
                }}
              >
                إعادة التسجيل
              </button>
            </div>
          )}

          <textarea 
            placeholder="وصف قصير (اختياري)" 
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ minHeight: '100px', resize: 'none' }}
          />

          <button 
            disabled={!title.trim() || (inputType === 'link' && !link.trim())}
            onClick={handleSave}
            style={{
              width: '100%', height: '68px', backgroundColor: 'var(--green)', color: 'white',
              borderRadius: 'var(--radius-full)', fontSize: '20px', fontWeight: 700,
              border: 'none', cursor: (!title.trim() || (inputType === 'link' && !link.trim())) ? 'not-allowed' : 'pointer',
              opacity: (!title.trim() || (inputType === 'link' && !link.trim())) ? 0.6 : 1, fontFamily: "'Cairo', sans-serif"
            }}
          >
            حفظ الذكرى ✓
          </button>
        </div>
      );
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {
        onClose();
        setTimeout(resetForm, 300);
      }} 
      title="أضف ذكرى جديدة"
    >
      {renderContent()}
    </Modal>
  );
}
