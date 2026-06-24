import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import AddMemoryModal from '../components/memories/AddMemoryModal';
import MemoryCard from '../components/memories/MemoryCard';
import VideoEmbed from '../components/memories/VideoEmbed';

const CATEGORIES = [
  { id: 'all',     label: 'الكل',           emoji: '📋' },
  { id: 'wisdom',  label: 'حكمة في الحياة', emoji: '📖' },
  { id: 'career',  label: 'من شغلي',        emoji: '💼' },
  { id: 'recipe',  label: 'وصفة مطبخ',      emoji: '🍳' },
  { id: 'faith',   label: 'دعاء وقرآن',     emoji: '📿' },
  { id: 'stories', label: 'قصص زمان',       emoji: '🎭' },
  { id: 'advice',  label: 'نصيحة لأولادي',  emoji: '❤️' },
];

export default function Memories() {
  const { memories, deleteMemory, showToast } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [playingMemory, setPlayingMemory] = useState(null);

  const filteredMemories = activeCategory === 'all' 
    ? memories 
    : memories.filter(m => m.category === activeCategory);

  const handleDelete = (id) => {
    deleteMemory(id);
    showToast('تم حذف الذكرى');
  };

  return (
    <div className="page-content page-fade-enter-active" style={{ backgroundColor: 'var(--green-light)' }}>
      <button 
        onClick={() => setShowAddModal(true)}
        style={{
          width: '100%', height: '68px', backgroundColor: 'var(--green)', color: 'white',
          borderRadius: 'var(--radius-full)', fontSize: '20px', fontWeight: 700,
          border: 'none', cursor: 'pointer', fontFamily: "'Cairo', sans-serif"
        }}
      >
        + أضف ذكرى جديدة
      </button>

      <div className="scroll-row" style={{ marginTop: '8px' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              height: '44px', minHeight: '44px', padding: '0 20px', borderRadius: '22px',
              backgroundColor: activeCategory === cat.id ? 'var(--green)' : 'white',
              color: activeCategory === cat.id ? 'white' : 'var(--green)',
              border: activeCategory === cat.id ? 'none' : '1.5px solid var(--green)',
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
              fontSize: '16px', fontWeight: 'bold', fontFamily: "'Cairo', sans-serif",
              whiteSpace: 'nowrap'
            }}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
        {filteredMemories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '48px' }}>📹</div>
            <h2 style={{ fontSize: '24px', fontWeight: 700 }}>لا توجد ذكريات بعد</h2>
            <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>اضغط + لتبدأ توثيق كلامك لأولادك</p>
          </div>
        ) : (
          filteredMemories.map(memory => (
            <MemoryCard 
              key={memory.id} 
              memory={memory} 
              onPlay={() => setPlayingMemory(memory)}
              onDelete={() => handleDelete(memory.id)}
            />
          ))
        )}
      </div>

      <AddMemoryModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      <VideoEmbed memory={playingMemory} onClose={() => setPlayingMemory(null)} />
    </div>
  );
}
