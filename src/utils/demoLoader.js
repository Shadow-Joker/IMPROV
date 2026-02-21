/* ========================================
   SENTRAK — Demo Data Seeder
   Pre-loads demo athletes + assessments into localStorage
   so every page has data on first load.
   Owner: Navneeth (architect)
   ======================================== */

import { DEMO_ATHLETES, DEMO_ASSESSMENTS } from './dataShapes';

const SEED_KEY = 'sentrak_demo_seeded';
const ATHLETES_KEY = 'sentrak_athletes';
const ASSESSMENTS_KEY = 'sentrak_assessments';

/**
 * Seeds localStorage with demo data if not already seeded.
 * Safe to call multiple times — idempotent.
 * Returns { athletes: number, assessments: number } count.
 */
export function seedDemoData() {
  try {
    if (localStorage.getItem(SEED_KEY) === 'v2') return null; // already seeded

    // Merge with any existing data (don't overwrite user-created athletes)
    const existingAthletes = safeParseJSON(localStorage.getItem(ATHLETES_KEY), []);
    const existingAssessments = safeParseJSON(localStorage.getItem(ASSESSMENTS_KEY), []);

    const existingIds = new Set(existingAthletes.map(a => a.id));
    const newAthletes = DEMO_ATHLETES.filter(a => !existingIds.has(a.id));

    const existingAssIds = new Set(existingAssessments.map(a => a.id));
    const newAssessments = DEMO_ASSESSMENTS.filter(a => !existingAssIds.has(a.id));

    const mergedAthletes = [...existingAthletes, ...newAthletes];
    const mergedAssessments = [...existingAssessments, ...newAssessments];

    localStorage.setItem(ATHLETES_KEY, JSON.stringify(mergedAthletes));
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(mergedAssessments));
    localStorage.setItem(SEED_KEY, 'v2');

    return {
      athletes: newAthletes.length,
      assessments: newAssessments.length,
      total: mergedAthletes.length
    };
  } catch (err) {
    console.warn('[SENTRAK] Demo seed failed:', err);
    return null;
  }
}

/**
 * Force re-seed (useful for demo reset)
 */
export function resetDemoData() {
  try {
    localStorage.removeItem(SEED_KEY);
    localStorage.removeItem(ATHLETES_KEY);
    localStorage.removeItem(ASSESSMENTS_KEY);
    return seedDemoData();
  } catch (err) {
    console.warn('[SENTRAK] Demo reset failed:', err);
    return null;
  }
}

/**
 * Get all athletes from localStorage (demo + user-created)
 */
export function getAllAthletes() {
  return safeParseJSON(localStorage.getItem(ATHLETES_KEY), DEMO_ATHLETES);
}

/**
 * Get all assessments from localStorage
 */
export function getAllAssessments() {
  return safeParseJSON(localStorage.getItem(ASSESSMENTS_KEY), DEMO_ASSESSMENTS);
}

/**
 * Get assessments for a specific athlete
 */
export function getAthleteAssessments(athleteId) {
  const all = getAllAssessments();
  return all.filter(a => a.athleteId === athleteId);
}

/**
 * Save a new athlete to localStorage
 */
export function saveAthlete(athlete) {
  try {
    const athletes = getAllAthletes();
    const idx = athletes.findIndex(a => a.id === athlete.id);
    if (idx >= 0) {
      athletes[idx] = { ...athletes[idx], ...athlete };
    } else {
      athletes.push(athlete);
    }
    localStorage.setItem(ATHLETES_KEY, JSON.stringify(athletes));
    return true;
  } catch (err) {
    console.warn('[SENTRAK] Save athlete failed:', err);
    return false;
  }
}

/**
 * Save a new assessment to localStorage
 */
export function saveAssessment(assessment) {
  try {
    const assessments = getAllAssessments();
    assessments.push(assessment);
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(assessments));
    return true;
  } catch (err) {
    console.warn('[SENTRAK] Save assessment failed:', err);
    return false;
  }
}

function safeParseJSON(str, fallback) {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}
