import React from 'react';
import { useApp } from '../context/AppContext';
import WeatherWidget from '../components/mytime/WeatherWidget';
import ContentGrid from '../components/mytime/ContentGrid';
import { getGreeting } from '../utils/dateUtils';

export default function MyTime() {
  const { user } = useApp();
  
  return (
    <div className="page-content page-fade-enter-active">
      <div style={{ marginBottom: '8px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text)', marginBottom: '4px' }}>
          {getGreeting(user?.name)}
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>
          اختر ما تحب أن تستمع إليه الآن
        </p>
      </div>

      <WeatherWidget city={user?.city} lat={user?.lat} lon={user?.lon} />
      
      <div style={{ marginTop: '16px' }}>
        <ContentGrid />
      </div>
    </div>
  );
}
