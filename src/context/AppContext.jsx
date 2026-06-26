import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { storage, KEYS, DEFAULT_USER, isCheckedInToday, getLastCheckInTime, recordCheckIn, getTodayMovements, recordMovement, recordMedTaken } from '../utils/storage';
import { firebaseUserOps, firebaseMemoryOps, firebaseCheckInOps, firebaseMovementOps, firebaseMedsOps } from '../firebase/firestore';

const AppContext = createContext();

// Generate a unique user ID (in production, use Firebase Auth)
const getUserId = () => {
  let userId = localStorage.getItem('rafeeq_user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('rafeeq_user_id', userId);
  }
  return userId;
};

const USER_ID = getUserId();

export function AppProvider({ children }) {
  const [user, setUserState] = useState(() => storage.get(KEYS.USER, DEFAULT_USER));
  const [memories, setMemoriesState] = useState(() => storage.get(KEYS.MEMORIES, []));
  const [checkedInToday, setCheckedInToday] = useState(isCheckedInToday());
  const [lastCheckInTime, setLastCheckInTime] = useState(getLastCheckInTime());
  const [todayMovements, setTodayMovements] = useState(getTodayMovements());
  const [toast, setToast] = useState(null);
  const [firebaseEnabled, setFirebaseEnabled] = useState(false);

  const toastTimeoutRef = useRef(null);
  const userSyncedRef = useRef(false);

  // Check if Firebase is configured
  useEffect(() => {
    import('../firebase/firebase').then(({ db }) => {
      if (db.app.options.apiKey !== 'YOUR_API_KEY') {
        setFirebaseEnabled(true);
        console.log('Firebase enabled for user:', USER_ID);
      }
    }).catch(() => {});
  }, []);

  // Save user to localStorage and sync to Firebase once when setupDone
  useEffect(() => {
    storage.set(KEYS.USER, user);

    if (firebaseEnabled && user.setupDone && !userSyncedRef.current) {
      userSyncedRef.current = true;
      console.log('Syncing user to Firebase:', user);
      firebaseUserOps.createUser(USER_ID, user).catch((err) => {
        console.error('Error creating user:', err);
      });
    }

    // Update user data changes (medications taken, etc.)
    if (firebaseEnabled && user.setupDone && userSyncedRef.current) {
      firebaseUserOps.updateUser(USER_ID, user).catch(() => {});
    }
  }, [user, firebaseEnabled]);

  // Sync memories to localStorage only
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
    if (firebaseEnabled && newUser.setupDone) {
      userSyncedRef.current = false; // Reset to trigger create
    }
  }, [firebaseEnabled]);

  const updateUser = useCallback((partial) => {
    setUserState(prev => ({ ...prev, ...partial }));
  }, []);

  const addMemory = useCallback(async (memory) => {
    const newMemory = { ...memory, id: Date.now().toString() };
    setMemoriesState(prev => [newMemory, ...prev]);

    if (firebaseEnabled) {
      try {
        await firebaseMemoryOps.addMemory(USER_ID, memory);
      } catch (error) {
        console.error('Error adding memory to Firebase:', error);
      }
    }
  }, [firebaseEnabled]);

  const deleteMemory = useCallback(async (id) => {
    setMemoriesState(prev => prev.filter(m => m.id !== id));

    if (firebaseEnabled) {
      try {
        await firebaseMemoryOps.deleteMemory(id);
      } catch (error) {
        console.error('Error deleting memory from Firebase:', error);
      }
    }
  }, [firebaseEnabled]);

  const doCheckIn = useCallback(async () => {
    if (recordCheckIn()) {
      setCheckedInToday(true);
      setLastCheckInTime(getLastCheckInTime());

      if (firebaseEnabled) {
        try {
          await firebaseCheckInOps.recordCheckIn(USER_ID);
        } catch (error) {
          console.error('Error recording check-in to Firebase:', error);
        }
      }

      return true;
    }
    return false;
  }, [firebaseEnabled]);

  const doRecordMovement = useCallback(async () => {
    const count = recordMovement();
    setTodayMovements(count);

    if (firebaseEnabled) {
      try {
        await firebaseMovementOps.recordMovement(USER_ID);
      } catch (error) {
        console.error('Error recording movement to Firebase:', error);
      }
    }
  }, [firebaseEnabled]);

  const doRecordMed = useCallback(async (medId) => {
    recordMedTaken(medId);

    if (firebaseEnabled) {
      try {
        await firebaseMedsOps.recordMedTaken(USER_ID, medId);
      } catch (error) {
        console.error('Error recording med to Firebase:', error);
      }
    }
  }, [firebaseEnabled]);

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
    showToast,
    firebaseEnabled,
    userId: USER_ID
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
