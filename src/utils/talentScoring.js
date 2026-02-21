/* ========================================
   SENTRAK — Talent Scoring Engine
   Percentile calc, composite scores, ratings
   ======================================== */

import { getAgeGroup } from './dataShapes';

// Inline SAI benchmarks for offline use
const SAI_BENCHMARKS = {
    "30m_sprint": { lowerIsBetter: true },
    "60m_sprint": { lowerIsBetter: true },
    "600m_run": { lowerIsBetter: true },
    "shuttle_run_4x10m": { lowerIsBetter: true },
    "standing_broad_jump": { lowerIsBetter: false },
    "vertical_jump": { lowerIsBetter: false },
    "flexibility_sit_reach": { lowerIsBetter: false },
    "bmi": { lowerIsBetter: false },
};

// Time-based tests: lower is better
const LOWER_IS_BETTER = new Set([
    '30m_sprint', '60m_sprint', '600m_run', 'shuttle_run_4x10m'
]);

/**
 * Calculate percentile (0-100) for an athlete's test value
 * against SAI benchmarks for their age group and gender.
 *
 * @param {number} value - The athlete's recorded value
 * @param {string} testType - e.g. '60m_sprint'
 * @param {string} ageGroup - e.g. 'U-14'
 * @param {string} gender - 'male' or 'female'
 * @param {object} benchmarks - Full benchmarks object (fetched or provided)
 * @returns {number} 0-100 percentile
 */
export function calculatePercentile(value, testType, ageGroup, gender, benchmarks) {
    if (!benchmarks || !benchmarks[testType]) return 50;
    const ageData = benchmarks[testType][ageGroup];
    if (!ageData) return 50;
    const gData = ageData[gender] || ageData['male'];
    if (!gData) return 50;

    const { excellent, good, avg } = gData;
    const lowerIsBetter = LOWER_IS_BETTER.has(testType);

    if (lowerIsBetter) {
        // Lower times = better performance = higher percentile
        if (value <= excellent) return 95 + Math.min(5, (excellent - value) / excellent * 20);
        if (value <= good) return 70 + (good - value) / (good - excellent) * 25;
        if (value <= avg) return 40 + (avg - value) / (avg - good) * 30;
        // Worse than average
        const overAvg = value - avg;
        const range = avg - excellent;
        return Math.max(0, 40 - (overAvg / range) * 40);
    } else {
        // Higher values = better (jumps, flexibility)
        if (value >= excellent) return 95 + Math.min(5, (value - excellent) / excellent * 20);
        if (value >= good) return 70 + (value - good) / (excellent - good) * 25;
        if (value >= avg) return 40 + (value - avg) / (good - avg) * 30;
        // Worse than average
        const underAvg = avg - value;
        const range = excellent - avg;
        return Math.max(0, 40 - (underAvg / range) * 40);
    }
}

/**
 * Calculate composite talent score (0-100) for an athlete.
 * Weighted: 60% physical + 25% mental + 15% trust
 */
export function calculateComposite(athlete, benchmarks) {
    let physicalScore = 50; // Default if no assessments

    if (athlete.assessments && athlete.assessments.length > 0) {
        const saiAssessments = athlete.assessments.filter(a => a.testCategory === 'sai');
        if (saiAssessments.length > 0) {
            const ageGroup = getAgeGroup(athlete.age);
            const percentiles = saiAssessments.map(a =>
                calculatePercentile(a.value, a.testType, ageGroup, athlete.gender, benchmarks)
            );
            physicalScore = percentiles.reduce((sum, p) => sum + p, 0) / percentiles.length;
        } else {
            // Use any assessment percentiles
            const percentiles = athlete.assessments.map(a => a.percentile || 50);
            physicalScore = percentiles.reduce((sum, p) => sum + p, 0) / percentiles.length;
        }
    }

    const mentalScore = athlete.mentalScore || 0;

    // Trust score: ratio of verified attestations
    let trustScore = 50;
    if (athlete.assessments && athlete.assessments.length > 0) {
        const totalAttestations = athlete.assessments.reduce(
            (sum, a) => sum + (a.attestations ? a.attestations.length : 0), 0
        );
        const verifiedAttestations = athlete.assessments.reduce(
            (sum, a) => sum + (a.attestations ? a.attestations.filter(att => att.otpVerified).length : 0), 0
        );
        if (totalAttestations > 0) {
            trustScore = (verifiedAttestations / totalAttestations) * 100;
        }
    }

    const composite = physicalScore * 0.60 + mentalScore * 0.25 + trustScore * 0.15;
    return Math.round(composite * 100) / 100;
}

/**
 * Convert composite score (0-100) to talent rating (1000-2500)
 * 0-20 → 1000-1300 (Bronze)
 * 20-40 → 1300-1600 (Silver)
 * 40-60 → 1600-1900 (Gold)
 * 60-80 → 1900-2200 (Elite)
 * 80-100 → 2200-2500 (Prodigy)
 */
export function compositeToRating(composite) {
    const clamped = Math.max(0, Math.min(100, composite));
    return Math.round(1000 + (clamped / 100) * 1500);
}

/**
 * Full scoring pipeline: calculate composite → convert to rating
 */
export function scoreAthlete(athlete, benchmarks) {
    const composite = calculateComposite(athlete, benchmarks);
    const rating = compositeToRating(composite);
    return { composite, rating };
}

/**
 * Load SAI benchmarks from public/data endpoint
 */
let _cachedBenchmarks = null;
export async function loadBenchmarks() {
    if (_cachedBenchmarks) return _cachedBenchmarks;
    try {
        const res = await fetch('/data/sai-benchmarks.json');
        _cachedBenchmarks = await res.json();
        return _cachedBenchmarks;
    } catch {
        console.warn('Failed to load SAI benchmarks, using defaults');
        return null;
    }
}
