import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { db } from './firebase';

const USERS_COLLECTION = 'users';
const MEMORIES_COLLECTION = 'memories';
const CHECKINS_COLLECTION = 'checkins';
const MOVEMENTS_COLLECTION = 'movements';
const MEDS_LOG_COLLECTION = 'meds_log';
const CONTENT_COLLECTION = 'content_config';
const ADMIN_COLLECTION = 'admin_settings';

// Sanitize user data to ensure correct types for Firestore
const sanitizeUserData = (userData) => {
  const sanitized = { ...userData };

  // Ensure setupDone is boolean
  if (sanitized.setupDone !== undefined) {
    sanitized.setupDone = Boolean(sanitized.setupDone);
  }

  // Ensure contacts is an array
  if (sanitized.contacts !== undefined) {
    sanitized.contacts = Array.isArray(sanitized.contacts)
      ? sanitized.contacts.map(c => ({
          id: String(c.id || ''),
          name: String(c.name || ''),
          relation: String(c.relation || ''),
          phone: String(c.phone || ''),
          avatar: String(c.avatar || '')
        }))
      : [];
  }

  // Ensure medications is an array
  if (sanitized.medications !== undefined) {
    sanitized.medications = Array.isArray(sanitized.medications)
      ? sanitized.medications.map(m => ({
          id: String(m.id || ''),
          name: String(m.name || ''),
          dose: String(m.dose || ''),
          time: String(m.time || ''),
          enabled: Boolean(m.enabled)
        }))
      : [];
  }

  // Ensure movementGoal is a number
  if (sanitized.movementGoal !== undefined) {
    sanitized.movementGoal = Number(sanitized.movementGoal) || 6;
  }

  // Ensure lat/lon are numbers
  if (sanitized.lat !== undefined) {
    sanitized.lat = Number(sanitized.lat) || 0;
  }
  if (sanitized.lon !== undefined) {
    sanitized.lon = Number(sanitized.lon) || 0;
  }

  // Ensure prayerReminder is boolean
  if (sanitized.prayerReminder !== undefined) {
    sanitized.prayerReminder = Boolean(sanitized.prayerReminder);
  }

  // Ensure name and city are strings
  if (sanitized.name !== undefined) {
    sanitized.name = String(sanitized.name);
  }
  if (sanitized.city !== undefined) {
    sanitized.city = String(sanitized.city);
  }

  return sanitized;
};

// User operations
export const firebaseUserOps = {
  async getUser(userId) {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  async createUser(userId, userData) {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const sanitizedData = sanitizeUserData(userData);
    console.log('Creating user in Firebase:', sanitizedData);
    await setDoc(docRef, {
      ...sanitizedData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: userId, ...sanitizedData };
  },

  async updateUser(userId, userData) {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const sanitizedData = sanitizeUserData(userData);
    console.log('Updating user in Firebase:', sanitizedData);
    await updateDoc(docRef, {
      ...sanitizedData,
      updatedAt: serverTimestamp()
    });
  },

  subscribeToUser(userId, callback) {
    const docRef = doc(db, USERS_COLLECTION, userId);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback({ id: snapshot.id, ...snapshot.data() });
      }
    });
  },

  async getAllUsers() {
    const snapshot = await getDocs(collection(db, USERS_COLLECTION));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

// Memories operations
export const firebaseMemoryOps = {
  async addMemory(userId, memory) {
    const docRef = await addDoc(collection(db, MEMORIES_COLLECTION), {
      userId,
      ...memory,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async deleteMemory(memoryId) {
    await deleteDoc(doc(db, MEMORIES_COLLECTION, memoryId));
  },

  subscribeToMemories(userId, callback) {
    const q = query(
      collection(db, MEMORIES_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const memories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(memories);
    });
  },

  async getAllMemories() {
    const snapshot = await getDocs(
      query(collection(db, MEMORIES_COLLECTION), orderBy('createdAt', 'desc'))
    );
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

// Check-ins operations
export const firebaseCheckInOps = {
  async recordCheckIn(userId) {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, CHECKINS_COLLECTION),
      where('userId', '==', userId),
      where('date', '==', today)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) return false;

    await addDoc(collection(db, CHECKINS_COLLECTION), {
      userId,
      date: today,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      timestamp: serverTimestamp()
    });
    return true;
  },

  subscribeToCheckIns(userId, callback) {
    const q = query(
      collection(db, CHECKINS_COLLECTION),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const checkins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(checkins);
    });
  }
};

// Movements operations
export const firebaseMovementOps = {
  async recordMovement(userId) {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, MOVEMENTS_COLLECTION),
      where('userId', '==', userId),
      where('date', '==', today)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      const currentCount = snapshot.docs[0].data().count;
      await updateDoc(docRef, { count: currentCount + 1 });
      return currentCount + 1;
    } else {
      await addDoc(collection(db, MOVEMENTS_COLLECTION), {
        userId,
        date: today,
        count: 1,
        timestamp: serverTimestamp()
      });
      return 1;
    }
  },

  subscribeToMovements(userId, callback) {
    const q = query(
      collection(db, MOVEMENTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const movements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(movements);
    });
  }
};

// Meds log operations
export const firebaseMedsOps = {
  async recordMedTaken(userId, medId) {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, MEDS_LOG_COLLECTION),
      where('userId', '==', userId),
      where('medId', '==', medId),
      where('date', '==', today)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) return;

    await addDoc(collection(db, MEDS_LOG_COLLECTION), {
      userId,
      medId,
      date: today,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      timestamp: serverTimestamp()
    });
  },

  async isMedTakenToday(userId, medId) {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, MEDS_LOG_COLLECTION),
      where('userId', '==', userId),
      where('medId', '==', medId),
      where('date', '==', today)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }
};

// Content config operations
export const firebaseContentOps = {
  async getContent() {
    const docRef = doc(db, CONTENT_COLLECTION, 'global');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  },

  async saveContent(contentData) {
    const docRef = doc(db, CONTENT_COLLECTION, 'global');
    await setDoc(docRef, {
      ...contentData,
      updatedAt: serverTimestamp()
    });
  },

  subscribeToContent(callback) {
    const docRef = doc(db, CONTENT_COLLECTION, 'global');
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback({ id: snapshot.id, ...snapshot.data() });
      }
    });
  }
};

// Admin operations
export const firebaseAdminOps = {
  async verifyPassword(password) {
    const docRef = doc(db, ADMIN_COLLECTION, 'credentials');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.password === password;
    }
    // Default password for first time
    return password === 'rafeeq2024';
  },

  async updatePassword(newPassword) {
    const docRef = doc(db, ADMIN_COLLECTION, 'credentials');
    await setDoc(docRef, { password: newPassword }, { merge: true });
  },

  async getAdminSettings() {
    const docRef = doc(db, ADMIN_COLLECTION, 'credentials');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : {};
  }
};
