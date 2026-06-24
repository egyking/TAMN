import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import CheckInButton from '../components/emergency/CheckInButton';
import SOSButton from '../components/emergency/SOSButton';
import ContactCard from '../components/emergency/ContactCard';
import MedicationTracker from '../components/emergency/MedicationTracker';
import Modal from '../components/shared/Modal';
import BigButton from '../components/shared/BigButton';

export default function Emergency() {
  const { user, updateUser, showToast } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Settings form state
  const [contacts, setContacts] = useState(user.contacts);
  const [medications, setMedications] = useState(user.medications);

  const handleOpenSettings = () => {
    setContacts(user.contacts);
    setMedications(user.medications);
    setIsSettingsOpen(true);
  };

  const handleSaveSettings = () => {
    updateUser({ contacts, medications });
    setIsSettingsOpen(false);
    showToast('تم الحفظ بنجاح ✓');
  };

  return (
    <div className="page-content page-fade-enter-active" style={{ backgroundColor: '#FFFAFA' }}>
      <CheckInButton />
      <SOSButton />
      
      <div style={{ marginTop: '8px' }}>
        <h2 className="card-title">👨‍👩‍👧‍👦 اتصل بأسرتي</h2>
        <div className="scroll-row">
          {user.contacts.map((contact, index) => (
            <ContactCard key={index} contact={contact} />
          ))}
        </div>
      </div>

      <MedicationTracker />

      <button
        onClick={handleOpenSettings}
        style={{
          marginTop: '16px', backgroundColor: 'transparent', border: 'none',
          color: 'var(--text-muted)', fontSize: '18px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px', padding: '16px', fontFamily: "'Cairo', sans-serif"
        }}
      >
        <span>⚙️</span>
        إعداد جهات الاتصال والأدوية
      </button>

      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="الإعدادات">
        <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>جهات الاتصال</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {contacts.map((c, i) => (
            <div key={c.id} style={{ backgroundColor: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>{c.relation}</div>
              <input 
                placeholder="الاسم" 
                value={c.name}
                onChange={e => {
                  const newC = [...contacts]; newC[i].name = e.target.value; setContacts(newC);
                }}
                style={{ marginBottom: '8px' }}
              />
              <input 
                placeholder="رقم الجوال" type="tel" dir="ltr"
                value={c.phone}
                onChange={e => {
                  const newC = [...contacts]; newC[i].phone = e.target.value; setContacts(newC);
                }}
              />
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>الأدوية</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {medications.map((m, i) => {
            const timeLabels = { morning: 'الصباح ☀️', noon: 'الظهر 🌤️', evening: 'المساء 🌅', night: 'النوم 🌙' };
            return (
              <div key={m.id} style={{ backgroundColor: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: m.enabled ? '12px' : 0 }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{timeLabels[m.time]}</span>
                  <button 
                    className={`toggle-switch ${m.enabled ? 'active' : ''}`}
                    onClick={() => {
                      const newM = [...medications]; newM[i].enabled = !m.enabled; setMedications(newM);
                    }}
                  />
                </div>
                {m.enabled && (
                  <input 
                    placeholder="اسم الدواء" 
                    value={m.name}
                    onChange={e => {
                      const newM = [...medications]; newM[i].name = e.target.value; setMedications(newM);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <BigButton label="حفظ الإعدادات ✓" onClick={handleSaveSettings} />
      </Modal>
    </div>
  );
}
