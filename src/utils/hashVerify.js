/* ========================================
   SENTRAK — Hash Verification (Tamper-proof)
   Owner: Sharvesh (feat/assessment)
   ======================================== */

/**
 * Fallback hashing algorithm (djb2) for environments where crypto is unavailable (e.g., HTTP without localhost).
 * Creates a fast, non-cryptographic hash string. Not for high security, but sufficient for offline tamper-evidence.
 * 
 * @param {string} str - The concatenated string data to hash
 * @returns {string} Hexadecimal representation of the 32-bit djb2 hash
 */
function djb2Hash(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    // Convert to positive 32-bit unsigned integer, then to hex
    return (hash >>> 0).toString(16).padStart(8, '0');
}

/**
 * Convert an ArrayBuffer returned by the Web Crypto API into a hexadecimal string.
 * @param {ArrayBuffer} buffer - The buffer to convert
 * @returns {string} Hexadecimal representation
 */
function arrayBufferToHex(buffer) {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Generate a robust SHA-256 hash (or djb2 fallback) for an assessment record.
 * This function concatenates critical immutable fields (athleteId, sport, testType, value, timestamp, witnesses)
 * to create a unique fingerprint. If any of these fields are altered offline, the hash will fail validation upon sync.
 * 
 * @param {Object} assessment - Assessment object complying with `createAssessment` data shape
 * @returns {Promise<string>} Hex hash string representing the integrity fingerprint
 */
export async function generateHash(assessment) {
    // Extract and normalize witness phones for consistent hashing regardless of array order
    const witnessPhones = (assessment.attestations || [])
        .map(a => String(a.witnessPhone || '').trim())
        .filter(phone => phone.length > 0)
        .sort()
        .join(',');

    // Construct rigorous data string blueprint
    const data = [
        assessment.athleteId || 'UNKNOWN_ATHLETE',
        assessment.sport || 'UNKNOWN_SPORT',
        assessment.testType || 'UNKNOWN_TEST',
        String(assessment.value || 0),
        String(assessment.timestamp || Date.now()),
        witnessPhones,
    ].join('|');

    // Attempt standard secure SHA-256 (requires HTTPS or localhost contexts)
    try {
        if (typeof crypto !== 'undefined' && crypto.subtle) {
            const encoder = new TextEncoder();
            const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
            return arrayBufferToHex(buffer);
        }
    } catch (err) {
        console.warn('[SENTRAK Security] crypto.subtle unavailable. Falling back to djb2 hash algorithm.', err);
    }

    // Fallback if Crypto API is missing
    return `djb2:${djb2Hash(data)}`;
}

/**
 * Verify that an assessment's current data structure perfectly matches its stored cryptographic hash.
 * 
 * @param {Object} assessment - The assessment record to test
 * @param {string} expectedHash - The previously stored hash to compare against
 * @returns {Promise<boolean>} True if the record is structurally pristine, False if tampered
 */
export async function verifyHash(assessment, expectedHash) {
    if (!expectedHash) return false;
    const hash = await generateHash(assessment);
    return hash === expectedHash;
}
