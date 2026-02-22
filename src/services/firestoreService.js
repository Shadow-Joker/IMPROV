/* ========================================
   SENTRAK — Firestore Cloud Service Layer
   Dual-write: IndexedDB (offline) + Firestore (cloud)
   ======================================== */

import { db } from '../firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore';

function enqueueCloudSyncItem(type, data) {
  try {
    const queue = JSON.parse(localStorage.getItem('sentrak_fallback_syncQueue') || '[]');
    const id = data?.id || `${type}-${Date.now()}`;
    const item = { id, type, data, queuedAt: Date.now() };
    const exists = queue.some((entry) => entry.type === type && entry.id === id);
    if (!exists) queue.push(item);
    localStorage.setItem('sentrak_fallback_syncQueue', JSON.stringify(queue));
  } catch (err) {
    console.warn('[Sync] Failed to enqueue fallback item:', err);
  }
}

function isCloudReady() {
  return !!db;
}

// ========================================
// Users
// ========================================

export async function getUserProfile(uid) {
  if (!isCloudReady()) return null;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('[Firestore] getUserProfile failed:', err);
    return null;
  }
}

export async function setUserProfile(uid, data) {
  if (!isCloudReady()) return false;
  try {
    await setDoc(doc(db, 'users', uid), { ...data, updatedAt: Date.now() }, { merge: true });
    return true;
  } catch (err) {
    console.warn('[Firestore] setUserProfile failed:', err);
    return false;
  }
}

// ========================================
// Athletes
// ========================================

export async function saveAthleteToCloud(athlete, options = {}) {
  const { enqueueOnFail = true } = options;
  if (!isCloudReady()) {
    if (enqueueOnFail) enqueueCloudSyncItem('athlete', athlete);
    return false;
  }

  try {
    await setDoc(doc(db, 'athletes', athlete.id), {
      ...athlete,
      updatedAt: Date.now(),
    });
    return true;
  } catch (err) {
    console.warn('[Firestore] saveAthlete failed:', err);
    if (enqueueOnFail) enqueueCloudSyncItem('athlete', athlete);
    return false;
  }
}

export async function getAthleteFromCloud(id) {
  if (!isCloudReady()) return null;
  try {
    const snap = await getDoc(doc(db, 'athletes', id));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('[Firestore] getAthlete failed:', err);
    return null;
  }
}

export async function getAllAthletesFromCloud() {
  if (!isCloudReady()) return [];
  try {
    const snap = await getDocs(collection(db, 'athletes'));
    return snap.docs.map((d) => d.data());
  } catch (err) {
    console.warn('[Firestore] getAllAthletes failed:', err);
    return [];
  }
}

// Aliases for build compatibility
export const getAthleteById = getAthleteFromCloud;
export const getCloudAthletes = getAllAthletesFromCloud;

export async function getAthletesByCoach(coachUid) {
  if (!isCloudReady()) return [];
  try {
    const q = query(collection(db, 'athletes'), where('registeredBy', '==', coachUid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
  } catch (err) {
    console.warn('[Firestore] getAthletesByCoach failed:', err);
    return [];
  }
}

// ========================================
// Assessments
// ========================================

export async function saveAssessmentToCloud(assessment, options = {}) {
  const { enqueueOnFail = true } = options;
  if (!isCloudReady()) {
    if (enqueueOnFail) enqueueCloudSyncItem('assessment', assessment);
    return false;
  }

  try {
    await setDoc(doc(db, 'assessments', assessment.id), {
      ...assessment,
      updatedAt: Date.now(),
    });
    return true;
  } catch (err) {
    console.warn('[Firestore] saveAssessment failed:', err);
    if (enqueueOnFail) enqueueCloudSyncItem('assessment', assessment);
    return false;
  }
}

export async function getAssessmentsByAthleteCloud(athleteId) {
  if (!isCloudReady()) return [];
  try {
    const q = query(collection(db, 'assessments'), where('athleteId', '==', athleteId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
  } catch (err) {
    console.warn('[Firestore] getAssessmentsByAthlete failed:', err);
    return [];
  }
}

export const getAssessmentsByAthleteId = getAssessmentsByAthleteCloud;

// ========================================
// Certificates (SenPass)
// ========================================

export async function saveCertificateToCloud(cert, options = {}) {
  const { enqueueOnFail = true } = options;
  if (!isCloudReady()) {
    if (enqueueOnFail) enqueueCloudSyncItem('certificate', cert);
    return false;
  }

  try {
    await setDoc(doc(db, 'certificates', cert.id), { ...cert, updatedAt: Date.now() });
    return true;
  } catch (err) {
    console.warn('[Firestore] saveCertificate failed:', err);
    if (enqueueOnFail) enqueueCloudSyncItem('certificate', cert);
    return false;
  }
}

export async function getCertificateById(certId) {
  if (!isCloudReady()) return null;
  try {
    const snap = await getDoc(doc(db, 'certificates', certId));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('[Firestore] getCertificate failed:', err);
    return null;
  }
}

export async function getCertificatesByAthlete(athleteId) {
  if (!isCloudReady()) return [];
  try {
    const q = query(collection(db, 'certificates'), where('athleteId', '==', athleteId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
  } catch (err) {
    console.warn('[Firestore] getCertsByAthlete failed:', err);
    return [];
  }
}

// ========================================
// Sync Engine — Drain offline queue to cloud
// ========================================

export async function syncOfflineQueue() {
  try {
    const queue = JSON.parse(localStorage.getItem('sentrak_fallback_syncQueue') || '[]');
    if (queue.length === 0) return { synced: 0, total: 0, failed: 0 };

    let synced = 0;
    const failedItems = [];

    for (const item of queue) {
      let ok = false;
      if (item.type === 'athlete') {
        ok = await saveAthleteToCloud(item.data, { enqueueOnFail: false });
      } else if (item.type === 'assessment') {
        ok = await saveAssessmentToCloud(item.data, { enqueueOnFail: false });
      } else if (item.type === 'certificate') {
        ok = await saveCertificateToCloud(item.data, { enqueueOnFail: false });
      }

      if (ok) synced++;
      else failedItems.push(item);
    }

    localStorage.setItem('sentrak_fallback_syncQueue', JSON.stringify(failedItems));
    return { synced, total: queue.length, failed: failedItems.length };
  } catch (err) {
    console.warn('[Sync] syncOfflineQueue failed:', err);
    return { synced: 0, total: 0, failed: 0, error: err.message };
  }
}

export { enqueueCloudSyncItem };
