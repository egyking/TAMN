import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { storage, KEYS, DEFAULT_USER, isCheckedInToday, getLastCheckInTime, recordCheckIn, getTodayMovements, recordMovement, recordMedTaken } from '../utils/storage';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUserState] = useState(() => storage.get(KEYS.USER, DEFAULT_USER));
  const [memories, setMemoriesState] = useState(() => storage.get(KEYS.MEMORIES, []));
  const [checkedInToday, setCheckedInToday] = useState(isCheckedInToday());
  const [lastCheckInTime, setLastCheckInTime] = useState(getLastCheckInTime());
  const [todayMovements, setTodayMovements] = useState(getTodayMovements());
  const [toast, setToast] = useState(null);

  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    storage.set(KEYS.USER, user);
  }, [user]);

  useEffect(() => {
    storage.set(KEYS.MEMORIES, memories);
  }, [memories]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const setUser = useCallback((newUser) => {
    setUserState(newUser);
  }, []);

  const updateUser = useCallback((partial) => {
    setUserState(prev => ({ ...prev, ...partial }));
  }, []);

  const addMemory = useCallback((memory) => {
    setMemoriesState(prev => [memory, ...prev]);
  }, []);

  const deleteMemory = useCallback((id) => {
    setMemoriesState(prev => prev.filter(m => m.id !== id));
  }, []);

  const doCheckIn = useCallback(() => {
    if (recordCheckIn()) {
      setCheckedInToday(true);
      setLastCheckInTime(getLastCheckInTime());
      return true;
    }
    return false;
  }, []);

  const doRecordMovement = useCallback(() => {
    const count = recordMovement();
    setTodayMovements(count);
  }, []);

  const doRecordMed = useCallback((medId) => {
    recordMedTaken(medId);
  }, []);

  const value = {
    user,
    setUser,
    updateUser,
    memories,
    addMemory,
    deleteMemory,
    checkedInToday,
    lastCheckInTime,
    doCheckIn,
    todayMovements,
    doRecordMovement,
    doRecordMed,
    toast,
    showToast
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
