export const KEYS = {
  USER:      'rafeeq_user',
  CHECKINS:  'rafeeq_checkins',
  MEMORIES:  'rafeeq_memories',
  MOVEMENTS: 'rafeeq_movements',
  MEDS_LOG:  'rafeeq_meds_log',
};

export const DEFAULT_USER = {
  name: '',
  setupDone: false,
  contacts: [
    { id: 'c1', name: '', relation: 'الابن',   phone: '', avatar: '👨' },
    { id: 'c2', name: '', relation: 'البنت',   phone: '', avatar: '👩' },
    { id: 'c3', name: '', relation: 'الطبيب',  phone: '', avatar: '👨‍⚕️' },
  ],
  medications: [
    { id: 'm1', name: '', dose: '', time: 'morning', enabled: false },
    { id: 'm2', name: '', dose: '', time: 'noon',    enabled: false },
    { id: 'm3', name: '', dose: '', time: 'evening', enabled: false },
    { id: 'm4', name: '', dose: '', time: 'night',   enabled: false },
  ],
  movementGoal: 6,
  city: 'القاهرة',
  lat: 30.0444,
  lon: 31.2357,
  prayerReminder: true,
};

export const storage = {
  get: (key, fallback = null) => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : fallback;
    } catch { return fallback; }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch { return false; }
  },
  remove: (key) => { try { localStorage.removeItem(key); } catch {} },
};

export const getTodayKey = () => new Date().toISOString().split('T')[0];

export const isCheckedInToday = () => {
  const checkins = storage.get(KEYS.CHECKINS, []);
  return checkins.some(c => c.date === getTodayKey());
};

export const getLastCheckInTime = () => {
  const checkins = storage.get(KEYS.CHECKINS, []);
  const today = checkins.find(c => c.date === getTodayKey());
  return today ? today.time : null;
};

export const recordCheckIn = () => {
  const checkins = storage.get(KEYS.CHECKINS, []);
  if (isCheckedInToday()) return false;
  checkins.unshift({
    date: getTodayKey(),
    time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
  });
  storage.set(KEYS.CHECKINS, checkins.slice(0, 60));
  return true;
};

export const getTodayMovements = () => {
  const movements = storage.get(KEYS.MOVEMENTS, []);
  const today = movements.find(m => m.date === getTodayKey());
  return today ? today.count : 0;
};

export const recordMovement = () => {
  const movements = storage.get(KEYS.MOVEMENTS, []);
  const todayIndex = movements.findIndex(m => m.date === getTodayKey());
  if (todayIndex >= 0) {
    movements[todayIndex].count += 1;
  } else {
    movements.unshift({ date: getTodayKey(), count: 1 });
  }
  storage.set(KEYS.MOVEMENTS, movements.slice(0, 60));
  return movements.find(m => m.date === getTodayKey()).count;
};

export const getMovementsForDate = (dateKey) => {
  const movements = storage.get(KEYS.MOVEMENTS, []);
  const day = movements.find(m => m.date === dateKey);
  return day ? day.count : 0;
};

export const isMedTakenToday = (medId) => {
  const log = storage.get(KEYS.MEDS_LOG, []);
  return log.some(entry => entry.medId === medId && entry.date === getTodayKey());
};

export const recordMedTaken = (medId) => {
  const log = storage.get(KEYS.MEDS_LOG, []);
  if (isMedTakenToday(medId)) return;
  log.unshift({
    medId,
    date: getTodayKey(),
    time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
  });
  storage.set(KEYS.MEDS_LOG, log.slice(0, 200));
};
