import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import useDailyReset from './hooks/useDailyReset';
import { requestNotificationPermission } from './utils/notifications';

// Screens
import Onboarding from './screens/Onboarding';
import Emergency from './pages/Emergency';
import Memories from './pages/Memories';
import Movement from './pages/Movement';
import MyTime from './pages/MyTime';

// Layout
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import Toast from './components/shared/Toast';

function AppContent() {
  const { user, toast, showToast } = useApp();
  const location = useLocation();
  const isSetupDone = user?.setupDone;

  // Daily reset logic (runs when date changes while app is open)
  useDailyReset(() => {
    showToast('يوم جديد! تم تصفير عدادات الأدوية والحركة.', 'info');
    // State will re-sync with storage automatically on next check
  });

  useEffect(() => {
    if (isSetupDone) {
      requestNotificationPermission();
    }
  }, [isSetupDone]);

  // Handle routing for onboarding
  if (!isSetupDone && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  if (isSetupDone && location.pathname === '/onboarding') {
    return <Navigate to="/emergency" replace />;
  }

  if (location.pathname === '/') {
    return <Navigate to={isSetupDone ? "/emergency" : "/onboarding"} replace />;
  }

  return (
    <>
      {isSetupDone && <Header />}
      
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/memories" element={<Memories />} />
        <Route path="/movement" element={<Movement />} />
        <Route path="/mytime" element={<MyTime />} />
      </Routes>

      {isSetupDone && <BottomNav />}
      
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
}
