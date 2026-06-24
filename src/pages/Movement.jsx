import React, { useState } from 'react';
import MovementProgress from '../components/movement/MovementProgress';
import ExerciseTimer from '../components/movement/ExerciseTimer';
import WeeklyStreak from '../components/movement/WeeklyStreak';
import VideoEmbed from '../components/memories/VideoEmbed';

const EXERCISES = [
  { id: 'walk', label: 'مشي في المكان 🚶‍♂️', duration: 300, desc: 'يساعد على تنشيط الدورة الدموية. قف مستقيماً وابدأ المشي في مكانك.' },
  { id: 'breathe', label: 'تمرين التنفس العميق 🫁', duration: 120, desc: 'خذ نفساً عميقاً من الأنف، ثم أخرجه ببطء من الفم للاسترخاء.' },
  { id: 'feet', label: 'تحريك القدمين 🦶', duration: 60, desc: 'وأنت جالس، ارفع كعبيك عن الأرض ثم أنزلهما لتنشيط الدم.' },
];

const YOUTUBE_EXERCISES = [
  { title: 'تمارين جلوس لكبار السن', url: 'https://www.youtube.com/watch?v=Ev6yE55kYGw' },
  { title: 'تمارين إطالة خفيفة', url: 'https://www.youtube.com/watch?v=0gSELLy8Sw0' },
];

export default function Movement() {
  const [activeTab, setActiveTab] = useState('progress');
  const [playingVideo, setPlayingVideo] = useState(null);

  return (
    <div className="page-content page-fade-enter-active">
      
      <div style={{
        display: 'flex', backgroundColor: 'white', borderRadius: 'var(--radius-full)',
        padding: '6px', boxShadow: 'var(--shadow)', marginBottom: '16px'
      }}>
        <button
          onClick={() => setActiveTab('progress')}
          style={{
            flex: 1, height: '48px', borderRadius: 'var(--radius-full)',
            backgroundColor: activeTab === 'progress' ? 'var(--blue)' : 'transparent',
            color: activeTab === 'progress' ? 'white' : 'var(--text-muted)',
            fontWeight: 'bold', fontSize: '18px', border: 'none', cursor: 'pointer',
            fontFamily: "'Cairo', sans-serif"
          }}
        >
          نشاطي اليوم
        </button>
        <button
          onClick={() => setActiveTab('exercises')}
          style={{
            flex: 1, height: '48px', borderRadius: 'var(--radius-full)',
            backgroundColor: activeTab === 'exercises' ? 'var(--blue)' : 'transparent',
            color: activeTab === 'exercises' ? 'white' : 'var(--text-muted)',
            fontWeight: 'bold', fontSize: '18px', border: 'none', cursor: 'pointer',
            fontFamily: "'Cairo', sans-serif"
          }}
        >
          تمارين خفيفة
        </button>
      </div>

      {activeTab === 'progress' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <MovementProgress />
          <WeeklyStreak />
          
          <div className="card" style={{ backgroundColor: 'var(--blue-light)', border: 'none' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--blue)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-lightbulb"></i> نصيحة اليوم
            </h3>
            <p style={{ fontSize: '18px', margin: 0 }}>
              المشي لمدة 10 دقائق بعد الأكل يساعد في الهضم ويضبط مستوى السكر في الدم.
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>فيديوهات تمارين مفيدة 📺</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {YOUTUBE_EXERCISES.map((ex, i) => (
              <button 
                key={i}
                onClick={() => setPlayingVideo({ title: ex.title, link: ex.url })}
                style={{
                  backgroundColor: 'white', borderRadius: 'var(--radius-md)', padding: '16px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow)', fontFamily: "'Cairo', sans-serif"
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--red-light)', color: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                  <i className="fa-brands fa-youtube"></i>
                </div>
                <span style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>{ex.title}</span>
              </button>
            ))}
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '8px' }}>تمارين بالمؤقت ⏱️</h3>
          {EXERCISES.map(ex => (
            <div key={ex.id} className="card">
              <h2 className="card-title">{ex.label}</h2>
              <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {ex.desc}
              </p>
              <ExerciseTimer durationSeconds={ex.duration} label={`ابدأ (${ex.duration / 60} دقائق)`} />
            </div>
          ))}
        </div>
      )}

      <VideoEmbed memory={playingVideo} onClose={() => setPlayingVideo(null)} />
    </div>
  );
}
