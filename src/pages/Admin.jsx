import React, { useState, useEffect } from 'react';
import { firebaseUserOps, firebaseMemoryOps, firebaseContentOps, firebaseAdminOps } from '../firebase/firestore';
import { DEFAULT_CONTENT_ITEMS, DEFAULT_EXERCISE_VIDEOS, DEFAULT_TIPS } from '../config/defaultContent';
import { saveGeminiKey, getGeminiKey, saveOpenRouterKey, getOpenRouterKey, askAI, suggestYouTubeVideos, testGeminiKey, testOpenRouterKey } from '../utils/ai';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [contentItems, setContentItems] = useState(DEFAULT_CONTENT_ITEMS);
  const [exerciseVideos, setExerciseVideos] = useState(DEFAULT_EXERCISE_VIDEOS);
  const [tips, setTips] = useState(DEFAULT_TIPS);
  const [adminPassword, setAdminPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [showAiSuggest, setShowAiSuggest] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, memoriesData, contentData] = await Promise.all([
        firebaseUserOps.getAllUsers(),
        firebaseMemoryOps.getAllMemories(),
        firebaseContentOps.getContent()
      ]);
      setUsers(usersData);
      setMemories(memoriesData);
      if (contentData) {
        if (contentData.contentItems) setContentItems(contentData.contentItems);
        if (contentData.exerciseVideos) setExerciseVideos(contentData.exerciseVideos);
        if (contentData.tips) setTips(contentData.tips);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    const isValid = await firebaseAdminOps.verifyPassword(password);
    if (isValid) {
      setIsAuthenticated(true);
      const settings = await firebaseAdminOps.getAdminSettings();
      if (settings.password) setAdminPassword(settings.password);
      const key = getGeminiKey();
      if (key) setGeminiKey(key);
      const hfKey = getOpenRouterKey();
      if (hfKey) setOpenRouterKey(hfKey);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleSaveContent = async () => {
    await firebaseContentOps.saveContent({
      contentItems,
      exerciseVideos,
      tips
    });
    alert('تم حفظ المحتوى بنجاح');
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 4) return;
    await firebaseAdminOps.updatePassword(newPassword);
    setAdminPassword(newPassword);
    setNewPassword('');
    alert('تم تغيير كلمة المرور');
  };

  const handleSaveGeminiKey = () => {
    saveGeminiKey(geminiKey);
    alert('تم حفظ مفتاح Gemini');
  };

  const handleSaveOpenRouterKey = () => {
    saveOpenRouterKey(openRouterKey);
    alert('تم حفظ مفتاح OpenRouter');
  };

  const handleAiSuggest = async () => {
    if (!aiTopic) return;
    setAiLoading(true);
    const suggestions = await suggestYouTubeVideos(aiTopic);
    setAiLoading(false);
    if (suggestions.length > 0) {
      setExerciseVideos(prev => [
        ...prev,
        ...suggestions.map(s => ({
          id: 'ai_' + Date.now() + Math.random(),
          title: s.title,
          url: s.url,
          enabled: true
        }))
      ]);
    }
  };

  const updateContentItem = (index, field, value) => {
    const items = [...contentItems];
    items[index] = { ...items[index], [field]: value };
    setContentItems(items);
  };

  const addContentItem = () => {
    setContentItems([
      ...contentItems,
      { id: 'custom_' + Date.now(), label: '', icon: 'fa-solid fa-video', color: '#607D8B', url: '', enabled: true }
    ]);
  };

  const removeContentItem = (index) => {
    setContentItems(contentItems.filter((_, i) => i !== index));
  };

  const updateExerciseVideo = (index, field, value) => {
    const videos = [...exerciseVideos];
    videos[index] = { ...videos[index], [field]: value };
    setExerciseVideos(videos);
  };

  const addExerciseVideo = () => {
    setExerciseVideos([
      ...exerciseVideos,
      { id: 'ev_' + Date.now(), title: '', url: '', enabled: true }
    ]);
  };

  const removeExerciseVideo = (index) => {
    setExerciseVideos(exerciseVideos.filter((_, i) => i !== index));
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Cairo', sans-serif",
        padding: '24px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: 'var(--green)' }}>
            دخول الأدمن
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            أدخل كلمة المرور للتحكم في التطبيق
          </p>

          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              height: '52px',
              fontSize: '18px',
              borderRadius: '12px',
              border: `2px solid ${loginError ? 'var(--red)' : 'var(--border)'}`,
              textAlign: 'center',
              marginBottom: '16px',
              fontFamily: "'Cairo', sans-serif",
              boxSizing: 'border-box',
              transition: 'all 0.1s',
              transform: loginError ? 'translateX(5px)' : 'none'
            }}
          />

          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: 'var(--green)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'Cairo', sans-serif"
            }}
          >
            دخول
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Cairo', sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '48px', color: 'var(--green)' }}></i>
          <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: 'fa-solid fa-chart-pie' },
    { id: 'users', label: 'المستخدمين', icon: 'fa-solid fa-users' },
    { id: 'content', label: 'المحتوى', icon: 'fa-solid fa-video' },
    { id: 'exercises', label: 'التمارين', icon: 'fa-solid fa-dumbbell' },
    { id: 'ai', label: 'الذكاء الاصطناعي', icon: 'fa-solid fa-robot' },
    { id: 'settings', label: 'الإعدادات', icon: 'fa-solid fa-gear' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      fontFamily: "'Cairo', sans-serif",
      paddingBottom: '80px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--green)' }}>
            لوحة الأدمن
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            إدارة تطبيق رفيق
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={loadData}
            style={{
              backgroundColor: 'var(--green)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontFamily: "'Cairo', sans-serif"
            }}
          >
            <i className="fa-solid fa-refresh" style={{ marginLeft: '8px' }}></i>
            تحديث
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            style={{
              backgroundColor: 'var(--red)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontFamily: "'Cairo', sans-serif"
            }}
          >
            خروج
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        backgroundColor: 'white',
        borderBottom: '1px solid var(--border)',
        overflowX: 'auto'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '12px 8px',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === tab.id ? '3px solid var(--green)' : '3px solid transparent',
              color: activeTab === tab.id ? 'var(--green)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontFamily: "'Cairo', sans-serif",
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? 700 : 400,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap'
            }}
          >
            <i className={tab.icon}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        {activeTab === 'dashboard' && (
          <DashboardTab users={users} memories={memories} />
        )}
        {activeTab === 'users' && (
          <UsersTab users={users} onSelectUser={setSelectedUser} selectedUser={selectedUser} />
        )}
        {activeTab === 'content' && (
          <ContentTab
            contentItems={contentItems}
            onUpdate={updateContentItem}
            onAdd={addContentItem}
            onRemove={removeContentItem}
            onSave={handleSaveContent}
            showAiSuggest={showAiSuggest}
            setShowAiSuggest={setShowAiSuggest}
            aiTopic={aiTopic}
            setAiTopic={setAiTopic}
            aiLoading={aiLoading}
            onAiSuggest={handleAiSuggest}
          />
        )}
        {activeTab === 'exercises' && (
          <ExercisesTab
            exerciseVideos={exerciseVideos}
            onUpdate={updateExerciseVideo}
            onAdd={addExerciseVideo}
            onRemove={removeExerciseVideo}
            onSave={handleSaveContent}
          />
        )}
        {activeTab === 'ai' && (
          <AITab
            geminiKey={geminiKey}
            setGeminiKey={setGeminiKey}
            onSaveGeminiKey={handleSaveGeminiKey}
            openRouterKey={openRouterKey}
            setOpenRouterKey={setOpenRouterKey}
            onSaveOpenRouterKey={handleSaveOpenRouterKey}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab
            adminPassword={adminPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            onUpdatePassword={handleUpdatePassword}
          />
        )}
      </div>
    </div>
  );
}

function DashboardTab({ users, memories }) {
  const stats = [
    { label: 'إجمالي المستخدمين', value: users.length, icon: 'fa-solid fa-users', color: '#1A7DC4' },
    { label: 'إجمالي الذكريات', value: memories.length, icon: 'fa-solid fa-heart', color: '#2EAA1C' },
    { label: 'مستخدمين نشطين', value: users.filter(u => u.setupDone).length, icon: 'fa-solid fa-user-check', color: '#F57C00' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>نظرة عامة</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: stat.color + '20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className={stat.icon} style={{ fontSize: '24px', color: stat.color }}></i>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTab({ users, onSelectUser, selectedUser }) {
  if (users.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
        <i className="fa-solid fa-users" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
        <p>لا يوجد مستخدمين بعد</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>المستخدمين ({users.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {users.map(user => (
          <div
            key={user.id}
            onClick={() => onSelectUser(selectedUser?.id === user.id ? null : user)}
            style={{
              backgroundColor: selectedUser?.id === user.id ? '#E8F5E9' : 'white',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>{user.name || 'مستخدم بدون اسم'}</h3>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                  {user.city || 'مدينة غير محددة'}
                </p>
              </div>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                backgroundColor: user.setupDone ? '#E8F5E9' : '#FFEBEE',
                color: user.setupDone ? 'var(--green)' : 'var(--red)'
              }}>
                {user.setupDone ? 'نشط' : 'غير مكتمل'}
              </span>
            </div>

            {selectedUser?.id === user.id && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '16px' }}>جهات الاتصال</h4>
                {user.contacts?.map((c, i) => (
                  <div key={i} style={{ padding: '8px 0', fontSize: '14px' }}>
                    <span>{c.avatar} {c.relation}</span>
                    {c.name && <span style={{ marginRight: '8px' }}>- {c.name}</span>}
                    {c.phone && <span style={{ marginRight: '8px', color: 'var(--text-muted)' }}>{c.phone}</span>}
                  </div>
                ))}

                <h4 style={{ margin: '16px 0 12px', fontSize: '16px' }}>الأدوية</h4>
                {user.medications?.filter(m => m.enabled).map((m, i) => (
                  <div key={i} style={{ padding: '8px 0', fontSize: '14px' }}>
                    <span>{m.name || 'بدون اسم'}</span>
                    {m.dose && <span style={{ marginRight: '8px', color: 'var(--text-muted)' }}>({m.dose})</span>}
                    <span style={{ marginRight: '8px', color: 'var(--text-muted)' }}>- {m.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentTab({ contentItems, onUpdate, onAdd, onRemove, onSave, showAiSuggest, setShowAiSuggest, aiTopic, setAiTopic, aiLoading, onAiSuggest }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>إدارة المحتوى</h2>
        <button onClick={onSave} style={{
          backgroundColor: 'var(--green)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          cursor: 'pointer',
          fontFamily: "'Cairo', sans-serif",
          fontWeight: 700
        }}>
          حفظ الكل
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {contentItems.map((item, index) => (
          <div key={item.id} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  backgroundColor: item.color + '20', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <i className={item.icon} style={{ color: item.color }}></i>
                </div>
                <span style={{ fontWeight: 700 }}>{item.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => onUpdate(index, 'enabled', !item.enabled)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: item.enabled ? '#E8F5E9' : '#FFEBEE',
                    color: item.enabled ? 'var(--green)' : 'var(--red)',
                    cursor: 'pointer',
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                >
                  {item.enabled ? 'مفعّل' : 'مخفي'}
                </button>
                <button
                  onClick={() => onRemove(index)}
                  style={{
                    width: '32px', height: '32px',
                    borderRadius: '50%', border: 'none',
                    backgroundColor: '#FFEBEE', color: 'var(--red)',
                    cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                placeholder="العنوان"
                value={item.label}
                onChange={(e) => onUpdate(index, 'label', e.target.value)}
                style={{ fontSize: '14px' }}
              />
              <input
                placeholder="رابط YouTube"
                value={item.url}
                onChange={(e) => onUpdate(index, 'url', e.target.value)}
                style={{ fontSize: '14px', direction: 'ltr', textAlign: 'left' }}
              />
              <input
                placeholder="اللون (مثال: #2EAA1C)"
                value={item.color}
                onChange={(e) => onUpdate(index, 'color', e.target.value)}
                style={{ fontSize: '14px', direction: 'ltr', textAlign: 'left' }}
              />
              <input
                placeholder="الأيقونة (مثال: fa-solid fa-heart)"
                value={item.icon}
                onChange={(e) => onUpdate(index, 'icon', e.target.value)}
                style={{ fontSize: '14px', direction: 'ltr', textAlign: 'left' }}
              />
            </div>
          </div>
        ))}

        <button
          onClick={onAdd}
          style={{
            height: '52px',
            backgroundColor: 'white',
            border: '2px dashed var(--border)',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: "'Cairo', sans-serif",
            color: 'var(--text-muted)'
          }}
        >
          + إضافة عنصر جديد
        </button>
      </div>
    </div>
  );
}

function ExercisesTab({ exerciseVideos, onUpdate, onAdd, onRemove, onSave }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>فيديوهات التمارين</h2>
        <button onClick={onSave} style={{
          backgroundColor: 'var(--green)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          cursor: 'pointer',
          fontFamily: "'Cairo', sans-serif",
          fontWeight: 700
        }}>
          حفظ الكل
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {exerciseVideos.map((video, index) => (
          <div key={video.id} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 700 }}>{video.title}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => onUpdate(index, 'enabled', !video.enabled)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: video.enabled ? '#E8F5E9' : '#FFEBEE',
                    color: video.enabled ? 'var(--green)' : 'var(--red)',
                    cursor: 'pointer',
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                >
                  {video.enabled ? 'مفعّل' : 'مخفي'}
                </button>
                <button
                  onClick={() => onRemove(index)}
                  style={{
                    width: '32px', height: '32px',
                    borderRadius: '50%', border: 'none',
                    backgroundColor: '#FFEBEE', color: 'var(--red)',
                    cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
            </div>
            <input
              placeholder="عنوان الفيديو"
              value={video.title}
              onChange={(e) => onUpdate(index, 'title', e.target.value)}
              style={{ fontSize: '14px', marginBottom: '8px' }}
            />
            <input
              placeholder="رابط YouTube"
              value={video.url}
              onChange={(e) => onUpdate(index, 'url', e.target.value)}
              style={{ fontSize: '14px', direction: 'ltr', textAlign: 'left' }}
            />
          </div>
        ))}

        <button
          onClick={onAdd}
          style={{
            height: '52px',
            backgroundColor: 'white',
            border: '2px dashed var(--border)',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: "'Cairo', sans-serif",
            color: 'var(--text-muted)'
          }}
        >
          + إضافة فيديو جديد
        </button>
      </div>
    </div>
  );
}

function AITab({ geminiKey, setGeminiKey, onSaveGeminiKey, openRouterKey, setOpenRouterKey, onSaveOpenRouterKey }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [activeProvider, setActiveProvider] = useState('openrouter');

  const handleTestGemini = async () => {
    if (!geminiKey) return;
    setTesting(true);
    setTestResult(null);
    const result = await testGeminiKey(geminiKey);
    setTesting(false);
    setTestResult(result);
    if (result.success) {
      onSaveGeminiKey();
    }
  };

  const handleTestOpenRouter = async () => {
    if (!openRouterKey) return;
    setTesting(true);
    setTestResult(null);
    const result = await testOpenRouterKey(openRouterKey);
    setTesting(false);
    setTestResult(result);
    if (result.success === true) {
      onSaveOpenRouterKey();
    }
  };

  const handleAsk = async () => {
    if (!question) return;
    setLoading(true);
    const result = await askAI(question);
    setLoading(false);
    if (result.text) {
      setAnswer(result.text);
    } else {
      setAnswer(result.message);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>الذكاء الاصطناعي</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => { setActiveProvider('openrouter'); setTestResult(null); }}
          style={{
            flex: 1,
            padding: '12px',
            border: activeProvider === 'openrouter' ? '2px solid #6366F1' : '2px solid var(--border)',
            borderRadius: '12px',
            backgroundColor: activeProvider === 'openrouter' ? '#EDE9FE' : 'white',
            cursor: 'pointer',
            fontFamily: "'Cairo', sans-serif",
            fontWeight: 700,
            fontSize: '14px'
          }}
        >
          OpenRouter (مجاني - نماذج متعددة)
        </button>
        <button
          onClick={() => { setActiveProvider('gemini'); setTestResult(null); }}
          style={{
            flex: 1,
            padding: '12px',
            border: activeProvider === 'gemini' ? '2px solid #4285F4' : '2px solid var(--border)',
            borderRadius: '12px',
            backgroundColor: activeProvider === 'gemini' ? '#E8F0FE' : 'white',
            cursor: 'pointer',
            fontFamily: "'Cairo', sans-serif",
            fontWeight: 700,
            fontSize: '14px'
          }}
        >
          Google Gemini
        </button>
      </div>

      {activeProvider === 'openrouter' && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: '16px'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>OpenRouter API</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            مجاني ويستخدم Gemma 3. سجّل في <a href="https://openrouter.ai" target="_blank" rel="noreferrer" style={{ color: 'var(--blue)' }}>OpenRouter</a> واحصل على مفتاح مجاني
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              placeholder="sk-or-v1-xxxxxxxxxxxxxxxxxxxx"
              value={openRouterKey}
              onChange={(e) => { setOpenRouterKey(e.target.value); setTestResult(null); }}
              style={{ flex: 1, fontSize: '14px', direction: 'ltr', textAlign: 'left' }}
            />
            <button onClick={onSaveOpenRouterKey} style={{
              backgroundColor: 'var(--green)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}>
              حفظ
            </button>
            <button
              onClick={handleTestOpenRouter}
              disabled={testing || !openRouterKey}
              style={{
                backgroundColor: testing || !openRouterKey ? '#ccc' : '#6366F1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: testing || !openRouterKey ? 'not-allowed' : 'pointer',
                fontFamily: "'Cairo', sans-serif",
                fontWeight: 700,
                whiteSpace: 'nowrap'
              }}
            >
              {testing ? '...' : 'اختبار'}
            </button>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            يستخدم نموذج Google Gemma 3 المجاني - سريع وبدون حدود يومية
          </p>
        </div>
      )}

      {activeProvider === 'gemini' && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: '16px'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>مفتاح Gemini API</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            احصل على مفتاح مجاني من: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: 'var(--blue)' }}>Google AI Studio</a>
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              placeholder="أدخل مفتاح API هنا"
              value={geminiKey}
              onChange={(e) => { setGeminiKey(e.target.value); setTestResult(null); }}
              style={{ flex: 1, fontSize: '14px', direction: 'ltr', textAlign: 'left' }}
            />
            <button onClick={onSaveGeminiKey} style={{
              backgroundColor: 'var(--green)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}>
              حفظ
            </button>
            <button
              onClick={handleTestGemini}
              disabled={testing || !geminiKey}
              style={{
                backgroundColor: testing || !geminiKey ? '#ccc' : '#4285F4',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: testing || !geminiKey ? 'not-allowed' : 'pointer',
                fontFamily: "'Cairo', sans-serif",
                fontWeight: 700,
                whiteSpace: 'nowrap'
              }}
            >
              {testing ? '...' : 'اختبار'}
            </button>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--red)', marginTop: '8px' }}>
            تنبيه: الحد المجاني 1500 طلب/يوم. إذا وصل للحد استخدم OpenRouter
          </p>
        </div>
      )}

      {testResult && (
        <div style={{
          marginBottom: '16px',
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: testResult.success ? '#E8F5E9' : '#FFEBEE',
          color: testResult.success ? 'var(--green)' : 'var(--red)',
          fontSize: '14px'
        }}>
          {testResult.success
            ? `نجح! الرد: "${testResult.response}"`
            : testResult.success === 'loading'
              ? testResult.message
              : `فشل: ${testResult.error}`
          }
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>اسأل الذكاء الاصطناعي</h3>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            placeholder="اكتب سؤالك هنا..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            style={{ flex: 1, fontSize: '14px' }}
          />
          <button onClick={handleAsk} disabled={loading} style={{
            backgroundColor: 'var(--blue)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: "'Cairo', sans-serif",
            fontWeight: 700,
            whiteSpace: 'nowrap'
          }}>
            {loading ? '...' : 'اسأل'}
          </button>
        </div>
        {answer && (
          <div style={{
            backgroundColor: 'var(--bg)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '14px',
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap'
          }}>
            {answer}
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsTab({ adminPassword, newPassword, setNewPassword, onUpdatePassword }) {
  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>الإعدادات</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>تغيير كلمة مرور الأدمن</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="password"
              placeholder="كلمة المرور الجديدة"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ flex: 1, fontSize: '14px' }}
            />
            <button onClick={onUpdatePassword} style={{
              backgroundColor: 'var(--green)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}>
              تغيير
            </button>
          </div>
        </div>

        <div style={{
          backgroundColor: '#FFF3E0',
          borderRadius: '12px',
          padding: '16px',
          borderRight: '4px solid #F57C00'
        }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '16px' }}>قواعد Firestore المطلوبة</h3>
          <pre style={{ margin: 0, fontSize: '12px', overflowX: 'auto', direction: 'ltr', textAlign: 'left', background: 'rgba(0,0,0,0.05)', padding: '8px', borderRadius: '4px' }}>
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
