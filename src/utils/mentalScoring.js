/* ========================================
   SENTRAK — Mental Scoring Engine (Phase 2)
   15-question assessment across 5 dimensions
   Edge cases: missing answers, empty arrays,
   correct reverse scoring, score clamping
   Owner: Rahul (feat/athlete)
   ======================================== */

/**
 * All 15 mental assessment questions.
 * Each has EN and TA text, a dimension, and reverse-score flag.
 * reverseScored = true means "5 = bad" (e.g. "How often do you skip?")
 */
export const MENTAL_QUESTIONS = [
    // Toughness (3 questions)
    { id: 1, dimension: 'toughness', question_en: 'How quickly do you bounce back after a loss?', question_ta: 'தோல்விக்குப் பிறகு எவ்வளவு விரைவாக மீள்கிறீர்கள்?', reverseScored: false },
    { id: 2, dimension: 'toughness', question_en: 'How well do you perform under pressure?', question_ta: 'அழுத்தத்தின் கீழ் எவ்வளவு சிறப்பாக செயல்படுகிறீர்கள்?', reverseScored: false },
    { id: 3, dimension: 'toughness', question_en: 'Can you stay focused during long training sessions?', question_ta: 'நீண்ட பயிற்சி நேரங்களில் கவனம் செலுத்த முடியுமா?', reverseScored: false },

    // Teamwork (3 questions)
    { id: 4, dimension: 'teamwork', question_en: 'Do you prefer team activities or individual ones?', question_ta: 'குழு செயல்பாடுகள் அல்லது தனிப்பட்ட செயல்பாடுகளை விரும்புகிறீர்களா?', reverseScored: false },
    { id: 5, dimension: 'teamwork', question_en: 'How do you react when a teammate makes a mistake?', question_ta: 'அணி வீரர் தவறு செய்யும் போது எப்படி எதிர்வினையாற்றுவீர்கள்?', reverseScored: false },
    { id: 6, dimension: 'teamwork', question_en: 'Do you actively encourage your teammates?', question_ta: 'உங்கள் அணி வீரர்களை ஊக்குவிக்கிறீர்களா?', reverseScored: false },

    // Drive (3 questions)
    { id: 7, dimension: 'drive', question_en: 'How many hours do you practice on your own each week?', question_ta: 'வாரத்தில் எத்தனை மணி நேரம் தனியாக பயிற்சி செய்கிறீர்கள்?', reverseScored: false },
    { id: 8, dimension: 'drive', question_en: 'Do you enjoy facing stronger opponents?', question_ta: 'வலுவான எதிரிகளை எதிர்கொள்ள விரும்புகிறீர்களா?', reverseScored: false },
    { id: 9, dimension: 'drive', question_en: 'Do you set specific goals for yourself?', question_ta: 'உங்களுக்கான குறிப்பிட்ட இலக்குகளை நிர்ணயிக்கிறீர்களா?', reverseScored: false },

    // Strategy (3 questions)
    { id: 10, dimension: 'strategy', question_en: 'Can you adapt your strategy during a match?', question_ta: 'போட்டியின் போது உத்தியை மாற்ற முடியுமா?', reverseScored: false },
    { id: 11, dimension: 'strategy', question_en: "Can you identify your opponent's weaknesses?", question_ta: 'எதிரியின் பலவீனங்களை கண்டறிய முடியுமா?', reverseScored: false },
    { id: 12, dimension: 'strategy', question_en: 'Do you review your past performances?', question_ta: 'உங்கள் கடந்த கால செயல்திறனை மதிப்பாய்வு செய்கிறீர்களா?', reverseScored: false },

    // Discipline (3 questions)
    { id: 13, dimension: 'discipline', question_en: 'How often do you skip practice?', question_ta: 'எத்தனை முறை பயிற்சியை தவிர்க்கிறீர்கள்?', reverseScored: true },
    { id: 14, dimension: 'discipline', question_en: 'Do you follow a daily routine?', question_ta: 'தினசரி வழக்கத்தை பின்பற்றுகிறீர்களா?', reverseScored: false },
    { id: 15, dimension: 'discipline', question_en: 'Can you stay committed to boring training drills?', question_ta: 'சலிப்பான பயிற்சிகளுக்கு உறுதியாக இருக்க முடியுமா?', reverseScored: false },
];

/** Dimension weights — toughness and drive slightly weighted higher for sports context */
const DIMENSION_WEIGHTS = {
    toughness: 1.2,
    teamwork: 1.0,
    drive: 1.2,
    strategy: 1.0,
    discipline: 1.1,
};

/** Clamp a value between min and max */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Calculate mental profile from answers array (indexed 0-14, each value 1-5).
 * Handles: missing answers (default 3), empty arrays (all 3s),
 * correct reverse scoring, clamped dimension scores (1.0-5.0).
 *
 * @param {number[]} answers - array of 15 answers (1-5 scale)
 * @returns {{ toughness: number, teamwork: number, drive: number, strategy: number, discipline: number, overall: number }}
 */
export function calculateMentalProfile(answers = []) {
    const dimensions = { toughness: [], teamwork: [], drive: [], strategy: [], discipline: [] };

    MENTAL_QUESTIONS.forEach((q, i) => {
        // Default missing answers to 3 (neutral)
        let raw = answers[i];
        if (raw === undefined || raw === null || isNaN(raw)) raw = 3;
        raw = clamp(raw, 1, 5);

        // Reverse scoring: "How often do you skip practice?" — 5 = bad → flipped to 1
        let score = q.reverseScored ? (6 - raw) : raw;
        dimensions[q.dimension].push(score);
    });

    const profile = {};
    for (const [dim, scores] of Object.entries(dimensions)) {
        if (scores.length === 0) {
            profile[dim] = 3.0; // Neutral if somehow empty
        } else {
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            profile[dim] = clamp(Math.round(avg * 10) / 10, 1.0, 5.0);
        }
    }

    // Add overall score (0-100)
    profile.overall = calculateMentalScore(profile);
    return profile;
}

/**
 * Calculate overall mental score from profile (0-100).
 * Uses weighted average of dimension scores (1-5), multiplied by 20.
 * Returns clamped integer between 0 and 100.
 *
 * @param {{ toughness: number, teamwork: number, drive: number, strategy: number, discipline: number }} profile
 * @returns {number} 0-100
 */
export function calculateMentalScore(profile = {}) {
    const totalWeight = Object.values(DIMENSION_WEIGHTS).reduce((a, b) => a + b, 0);

    let weightedSum = 0;
    for (const [dim, weight] of Object.entries(DIMENSION_WEIGHTS)) {
        const val = profile[dim];
        // If dimension is missing, default to 3 (neutral)
        weightedSum += (typeof val === 'number' && !isNaN(val) ? val : 3) * weight;
    }

    const avgScore = weightedSum / totalWeight; // 1-5 range
    return clamp(Math.round(avgScore * 20), 0, 100);
}

/**
 * Get encouraging message based on score range.
 * @param {number} score - 0-100
 * @param {string} lang - 'en' or 'ta'
 * @returns {string}
 */
export function getMentalResultMessage(score, lang = 'en') {
    const messages = {
        en: [
            { min: 80, msg: 'Champion Mindset! 🏆' },
            { min: 60, msg: 'Strong Potential! 💪' },
            { min: 40, msg: 'Growing Athlete 🌱' },
            { min: 0, msg: 'Keep Training! 🎯' },
        ],
        ta: [
            { min: 80, msg: 'சாம்பியன் மனநிலை! 🏆' },
            { min: 60, msg: 'வலுவான திறன்! 💪' },
            { min: 40, msg: 'வளரும் வீரர் 🌱' },
            { min: 0, msg: 'பயிற்சியைத் தொடருங்கள்! 🎯' },
        ],
    };
    const list = messages[lang] || messages.en;
    for (const item of list) {
        if (score >= item.min) return item.msg;
    }
    return list[list.length - 1].msg;
}
