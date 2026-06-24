import React, { useState } from 'react';
import ConfirmDialog from '../shared/ConfirmDialog';

export default function SOSButton() {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
        <button
          onClick={() => setShowConfirm(true)}
          style={{
            width: '180px', height: '180px', borderRadius: '50%', backgroundColor: 'var(--red)',
            color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: '8px', border: 'none', cursor: 'pointer',
            animation: 'sos-pulse 2s infinite', boxShadow: 'var(--shadow-lg)'
          }}
        >
          <i className="fa-solid fa-phone" style={{ fontSize: '48px' }}></i>
          <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: "'Cairo', sans-serif" }}>الإسعاف</span>
        </button>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="الاتصال بالإسعاف؟"
        message="هل تريد الاتصال بالإسعاف الآن؟"
        confirmLabel="نعم، اتصل"
        cancelLabel="لا، خطأ"
        confirmColor="var(--red)"
        onConfirm={() => { window.location.href = 'tel:123'; setShowConfirm(false); }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
