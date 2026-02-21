/* ========================================
   SENTRAK — Fraud Detection & Anomaly Checks
   Owner: Sharvesh (feat/assessment)
   ======================================== */

/**
 * Known performance ranges for anomaly detection
 * Format: { [testType]: { min, max, mean, stdDev } }
 * Based on average grassroots athlete data for U-14/U-16.
 * Limits are specifically tailored to prevent "impossible human limits" data entry typos.
 */
const PERFORMANCE_RANGES = {
    // SAI Tests
    '30m_sprint': { min: 3.5, max: 8.0, mean: 5.0, stdDev: 0.5 },
    '60m_sprint': { min: 7.0, max: 14.0, mean: 9.2, stdDev: 0.8 },
    '600m_run': { min: 90, max: 240, mean: 150, stdDev: 20 },
    'standing_broad_jump': { min: 1.0, max: 3.5, mean: 2.0, stdDev: 0.3 },
    'vertical_jump': { min: 15, max: 75, mean: 40, stdDev: 8 },
    'shuttle_run_4x10m': { min: 8.0, max: 18.0, mean: 12.0, stdDev: 1.2 },
    'flexibility_sit_reach': { min: -5, max: 45, mean: 20, stdDev: 7 },
    'bmi': { min: 12, max: 35, mean: 20, stdDev: 3 },
    // Sport-specific
    'bowling_speed': { min: 40, max: 160, mean: 90, stdDev: 15 },
    'batting_distance': { min: 5, max: 120, mean: 40, stdDev: 15 },
    'fielding_reaction': { min: 0.15, max: 3.0, mean: 0.8, stdDev: 0.2 },
    'sprint_40m': { min: 4.5, max: 9.0, mean: 6.0, stdDev: 0.6 },
    '100m': { min: 9.5, max: 20.0, mean: 13.5, stdDev: 1.2 },
    '200m': { min: 20.0, max: 40.0, mean: 28.0, stdDev: 2.5 },
    '400m': { min: 45.0, max: 100.0, mean: 65.0, stdDev: 6 },
    '800m': { min: 100, max: 240, mean: 160, stdDev: 15 },
    '1500m': { min: 210, max: 480, mean: 330, stdDev: 30 },
    'long_jump': { min: 1.5, max: 8.0, mean: 4.0, stdDev: 0.8 },
    'high_jump': { min: 0.8, max: 2.3, mean: 1.4, stdDev: 0.2 },
    'shot_put': { min: 3, max: 22, mean: 10, stdDev: 3 },
    'discus': { min: 8, max: 65, mean: 25, stdDev: 8 },
    'javelin': { min: 10, max: 85, mean: 35, stdDev: 10 },
    'punch_count_30s': { min: 10, max: 120, mean: 50, stdDev: 15 },
    'pushups_60s': { min: 5, max: 80, mean: 35, stdDev: 10 },
    'situps_60s': { min: 5, max: 70, mean: 30, stdDev: 8 },
};

/**
 * Physically impossible thresholds — absolute world-record human limits.
 * If a value crosses these, it's flagged as severe "high" anomaly indicating a fabricated entry or extreme typo.
 */
const IMPOSSIBLE_THRESHOLDS = {
    '100m': { limit: 9.5, type: 'lower' },       // Usain Bolt is 9.58s
    '200m': { limit: 19.0, type: 'lower' },
    '400m': { limit: 43.0, type: 'lower' },
    '30m_sprint': { limit: 3.0, type: 'lower' },
    '60m_sprint': { limit: 6.0, type: 'lower' },
    '600m_run': { limit: 70, type: 'lower' },
    'long_jump': { limit: 8.95, type: 'upper' }, // Mike Powell 8.95m
    'high_jump': { limit: 2.45, type: 'upper' },
    'bowling_speed': { limit: 165, type: 'upper' },
    'sprint_40m': { limit: 4.0, type: 'lower' },
};

/**
 * Scan a single assessment record for anomalies by comparing it against
 * physiological possibility thresholds and grassroots statistical variances.
 * 
 * @param {Object} assessment - Assessment metric payload carrying { testType, value, unit }
 * @returns {{ isAnomaly: boolean, flags: string[], severity: 'low'|'medium'|'high' }}
 */
export function checkAnomalies(assessment) {
    const flags = [];
    let severity = 'low';
    const { testType, value } = assessment;
    const numVal = parseFloat(value);

    if (isNaN(numVal)) {
        return { isAnomaly: true, flags: ['Invalid: measurement value is not a number'], severity: 'high' };
    }

    // 1. Negative or zero value check (except allowed negative flexibility)
    if (numVal <= 0 && testType !== 'flexibility_sit_reach') {
        flags.push(`Invalid syntax: recorded value (${numVal}) cannot be zero or negative.`);
        severity = 'high';
    }

    // 2. Physically Impossible World Record Sanity Check
    const impossible = IMPOSSIBLE_THRESHOLDS[testType];
    if (impossible) {
        if (impossible.type === 'lower' && numVal < impossible.limit) {
            flags.push(`Physically Impossible: ${numVal}${assessment.unit} breaks human physiological limits (${impossible.limit}${assessment.unit}).`);
            severity = 'high';
        } else if (impossible.type === 'upper' && numVal > impossible.limit) {
            flags.push(`Physically Impossible: ${numVal}${assessment.unit} exceeds mathematical bounds (${impossible.limit}${assessment.unit}).`);
            severity = 'high';
        }
    }

    // 3. Statistical Standard Deviation Detection (Grassroots variance)
    const range = PERFORMANCE_RANGES[testType];
    if (range && severity !== 'high') { // Don't bother with std dev if already flagged as impossible
        const zScore = Math.abs((numVal - range.mean) / range.stdDev);

        // Anything outside [min, max] range is a medium flag
        if (numVal < range.min || numVal > range.max) {
            flags.push(`Out of Bounds: ${numVal} lies significantly outside expected U-14/U-16 age brackets [${range.min}, ${range.max}].`);
            severity = 'medium';
        }
        // Z-Score statistical anomaly checks
        else if (zScore > 3) {
            flags.push(`Statistical Outlier: ${numVal} deviates by ${zScore.toFixed(1)}σ from the grassroots average.`);
            severity = 'medium';
        } else if (zScore > 2) {
            flags.push(`Unusual Entry: Performance marked ${zScore.toFixed(1)}σ from norm.`);
            // Keeps severity low if it's just unusual but not completely broken
        }
    }

    return {
        isAnomaly: flags.length > 0,
        flags,
        severity,
    };
}

/**
 * Check attestor reputation to prevent duplicate mass verifications (fraud rings).
 * Scrutinizes number of attestations generated by a single witness phone across 24h.
 * 
 * @param {string} phone - Witness phone number undergoing verification
 * @param {Array} allAttestations - Historic local/synced attestation array
 * @returns {{ trustScore: number, flag: string|null }} Output score out of 100%
 */
export function checkAttestorReputation(phone, allAttestations = []) {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);

    // Count attestations by this phone within 24hr window
    const recentCount = allAttestations.filter(a =>
        a.witnessPhone === phone && a.timestamp > last24h
    ).length;

    let trustScore = 100;
    let flag = null;

    if (recentCount > 20) {
        // Penalty calculation: Minus 5 points per attestation over the 20 limits
        trustScore = Math.max(0, 100 - ((recentCount - 20) * 5));
        flag = `🚨 Suspicious Volume: Phone number validated ${recentCount} distinct entries across past 24H (Soft Limit: 20)`;
    } else if (recentCount > 10) {
        trustScore = 80;
        flag = `⚠️ Notice: Witness verified ${recentCount} assessments recently. Moderate trust reduction applied.`;
    }

    return { trustScore, flag };
}
