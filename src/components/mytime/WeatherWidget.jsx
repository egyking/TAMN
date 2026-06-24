import React, { useState, useEffect } from 'react';

export default function WeatherWidget({ city = 'القاهرة', lat = 30.0444, lon = 31.2357 }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          code: data.current.weather_code
        });
      } catch (err) {
        console.error('Weather error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [lat, lon]);

  const getWeatherIcon = (code) => {
    if (code === undefined) return '☁️';
    if (code === 0) return '☀️'; // Clear
    if (code >= 1 && code <= 3) return '⛅'; // Partly cloudy
    if (code >= 51 && code <= 67) return '🌧️'; // Rain
    if (code >= 71 && code <= 77) return '❄️'; // Snow
    if (code >= 95) return '⛈️'; // Thunderstorm
    return '☁️';
  };

  if (loading) {
    return (
      <div className="card skeleton" style={{ height: '100px', display: 'flex', alignItems: 'center', padding: '20px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.5)', marginRight: 'auto' }} />
      </div>
    );
  }

  return (
    <div className="card" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'linear-gradient(135deg, #1A7DC4, #0D47A1)', color: 'white'
    }}>
      <div>
        <div style={{ fontSize: '16px', opacity: 0.9 }}>الطقس في {city}</div>
        <div style={{ fontSize: '36px', fontWeight: 900, fontFamily: 'monospace' }}>
          {weather?.temp !== undefined ? `${weather.temp}°` : '--°'}
        </div>
      </div>
      
      <div style={{ fontSize: '64px', lineHeight: 1 }}>
        {getWeatherIcon(weather?.code)}
      </div>
    </div>
  );
}
