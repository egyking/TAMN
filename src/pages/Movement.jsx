import React, { useState } from 'react';
import MovementProgress from '../components/movement/MovementProgress';
import ExerciseTimer from '../components/movement/ExerciseTimer';
import WeeklyStreak from '../components/movement/WeeklyStreak';
import BigButton from '../components/shared/BigButton';

export default function Movement() {
  const [activeTab, setActiveTab] = useState('progress');

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
          <div className="card">
            <h2 className="card-title">تمرين التنفس العميق 🫁</h2>
            <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              يساعد على الاسترخاء وتقليل التوتر. خذ نفساً عميقاً من الأنف، ثم أخرجه ببطء من الفم.
            </p>
            <ExerciseTimer durationSeconds={120} label="ابدأ تمرين التنفس (دقيقتين)" />
          </div>

          <div className="card">
            <h2 className="card-title">تمرين تحريك القدمين 🦶</h2>
            <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              وأنت جالس، ارفع كعبيك عن الأرض ثم أنزلهما. يكرر 10 مرات لتنشيط الدورة الدموية.
            </p>
            <ExerciseTimer durationSeconds={60} label="ابدأ التمرين (دقيقة)" />
          </div>
        </div>
      )}
    </div>
  );
}
