# 🔴 SENTRAK — Red Team Vulnerability Analysis

## "How Every Feature Can Be Bypassed or Fooled"

> **Purpose:** If a judge asks "but what about X?", you already know the answer.
> This document maps every attack vector, how it works, and your defense talking points.

---

## 1. 🎭 ATTESTATION / OTP SYSTEM — THE BIGGEST TARGET

### Attack: **Fake Witnesses (Sybil Attack)**

**How it works:** A single person registers 3 different phone numbers (all their own SIMs or family members). They verify all 3 OTPs themselves, creating the illusion of independent witnesses.

**Code proof (AttestationForm.jsx:105-114):**

```js
// Allow any 6 digit input for demo
if (w.otp.length === 6 && /^\d{6}$/.test(w.otp)) {
  updateWitness(index, "verified", true);
}
```

Any 6 digits works. No real SMS is sent. No real OTP server.

**Current defense:** `checkAttestorReputation()` flags phones with >20 attestations in 24h.
**Gap:** Threshold is 20 — way too high. A fraud ring of 5 people could verify 100 fake athletes (20 each) before triggering.

**Judge Defense:** _"In production, this calls Twilio/MSG91 with real OTPs. The 6-digit demo mode is for hackathon offline testing only. Our attestor reputation system penalizes repeat attestors, and we'd lower the threshold to 5 in production."_

---

### Attack: **Coach Collusion**

**How it works:** A coach creates a fake athlete, inflates the times (e.g., 10.5s for 100m when real time was 14s), and then has their friends verify it.

**Current defense:** `checkAnomalies()` flags statistically unusual values.
**Gap:** If the inflated value is within the "normal" range (e.g., 10.5s is in range [9.5, 20] for 100m), the fraud goes undetected. The system only catches EXTREME outliers.

**Judge Defense:** _"SENTRAK creates transparency, not perfection. In production, we'd cross-reference against video evidence (VideoClipCapture), historical trends for the same athlete, and district-level averages. Multiple independent assessments over time would expose inconsistencies."_

---

### Attack: **Self-Attestation**

**How it works:** The coach recording the assessment also adds their own phone as a witness.

**Current defense:** None. There's no check that witness phones are different from the coach's phone.

**Judge Defense:** _"In production, the assessor's phone would be automatically excluded from the witness pool. This is a simple backend validation rule."_

---

## 2. 🔐 HASH VERIFICATION — TAMPER DETECTION

### Attack: **Regenerate Hash After Tampering**

**How it works:** An attacker opens DevTools → modifies localStorage assessment data → calls `generateHash()` on the modified data → replaces the stored hash with the new one. The verification still passes because the hash matches the tampered data.

**Code proof (hashVerify.js:42-73):**

```js
export async function generateHash(assessment) {
  // ... builds data string from assessment fields
  const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
  return arrayBufferToHex(buffer);
}
```

The hash function is public. Anyone can call it on modified data.

**Current defense:** None client-side. The hash only proves "this data hasn't been modified SINCE hashing."
**Gap:** If you have access to the device, you can re-hash anything.

**Judge Defense:** _"The hash is generated at assessment time and immediately queued for server sync. Once synced to Firebase, the server-side hash becomes the immutable reference. Client-side manipulation is meaningless once synced — it would fail server verification. In a full deployment, we'd use Firebase Security Rules to make assessment records append-only."_

---

### Attack: **DJB2 Fallback is Weak**

**How it works:** If the app runs on HTTP (not HTTPS/localhost), `crypto.subtle` is unavailable, and the fallback is djb2 — a non-cryptographic 32-bit hash. This is trivially reversible.

**Code proof (hashVerify.js:13-19):**

```js
function djb2Hash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
```

**Judge Defense:** _"DJB2 is only a fallback for development environments. Production deployment on Vercel uses HTTPS, which always provides crypto.subtle for SHA-256. The fallback is prefixed with 'djb2:' so we can flag records that weren't cryptographically secured."_

---

## 3. 💾 LOCALSTORAGE / OFFLINE DB — DATA MANIPULATION

### Attack: **Direct localStorage Editing**

**How it works:** Open DevTools → Application → localStorage → edit `sentrak_athletes` or `sentrak_assessments` directly. Change any athlete's talent rating from 1000 (Bronze) to 2500 (Prodigy).

**Current defense:** None. localStorage is completely unprotected client-side.

**Judge Defense:** _"Client-side storage is inherently untrusted — every web app has this limitation. That's why we have the hash verification layer. In production, Firebase Firestore is the source of truth, with security rules preventing unauthorized writes. localStorage is just a cache for offline functionality."_

---

### Attack: **Flood Attack / Storage Exhaustion**

**How it works:** Fill localStorage (5MB limit) with junk data, crashing the app for all operations.

**Current defense:** Try/catch in offlineDB.js falls back gracefully.
**Gap:** The fallback just silently fails — user doesn't know their data wasn't saved.

---

## 4. 📝 REGISTRATION — IDENTITY FRAUD

### Attack: **Duplicate Athletes**

**How it works:** Register the same athlete multiple times with slightly different names ("Priya K" vs "Priya Kumar"). Each registration gets a fresh UUID, so the system treats them as different athletes.

**Current defense:** None. No deduplication by name, Aadhaar, or phone.

**Judge Defense:** _"In production, we'd use Aadhaar-linked verification (DigiLocker API) or phone OTP to create unique identity binding. For the hackathon demo, we focused on the assessment verification flow, which is our core innovation."_

---

### Attack: **Age Manipulation**

**How it works:** Register a 19-year-old as "14" to compete in U-14 categories where they'd dominate and get higher percentiles.

**Current defense:** None. Age is self-reported with no document verification.

**Judge Defense:** _"In production, age verification would be linked to Aadhaar/birth certificate. The assessment data would also flag this naturally — a 19-year-old competing as U-14 would have physically impossible benchmarks for that category, triggering our fraud detection engine."_

---

### Attack: **Voice Input Spoofing**

**How it works:** Play a pre-recorded audio clip of someone else's voice into the Web Speech API.

**Current defense:** None. The voice input has no biometric verification.

**Judge Defense:** _"Voice input is for convenience, not authentication. The coach operating the device is the trusted party, verified through their Firebase Auth session. Voice input just saves typing time in Tamil."_

---

## 5. 📊 TALENT SCORING — GAMING THE SYSTEM

### Attack: **Mental Score Manipulation**

**How it works:** Answer all 15 mental assessment questions as "5" (highest). Instantly get a 100/100 mental score, boosting total composite by 25%.

**Code proof (talentScoring.js:105):**

```js
const composite = physicalScore * 0.6 + mentalScore * 0.25 + trustScore * 0.15;
```

**Current defense:** None. Self-assessment is unmonitored.

**Judge Defense:** _"Mental profiling is a self-assessment tool for coaches, not a competitive metric. In production, we'd validate mental scores against behavioral patterns — an athlete who 'bounces back quickly from losses' but has a declining performance trend would be flagged for score inflation."_

---

### Attack: **Scheme Eligibility Gaming**

**How it works:** Register as female (when male) to qualify for the "Women in Sports Initiative" (₹1,00,000). Register with an artificially high talent rating to qualify for TOPS (₹10,00,000+, requires 90th percentile).

**Code proof (schemes.js:92):**

```js
eligibility: {
  genders: ["female"];
} // Only checks the gender field
```

**Current defense:** None — no identity document verification.

**Judge Defense:** _"Scheme matching is informational only — SENTRAK tells athletes what they MIGHT qualify for. Actual scheme disbursement requires government verification through separate channels. We're the discovery layer, not the payment layer."_

---

## 6. 🔥 FIREBASE — BACKEND VULNERABILITIES

### Attack: **Demo Credentials Exposed**

**How it works:** The firebase.js file has demo fallback keys hardcoded in source code. Anyone can read them from the public build.

**Code proof (firebase.js:9):**

```js
apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
```

**Current defense:** Demo keys point to a non-existent project.
**Gap:** If real keys are deployed without env vars, they'd be visible in the browser bundle.

**Judge Defense:** _"Firebase API keys are designed to be public — they only identify the project. Security comes from Firebase Security Rules, which restrict read/write access. The demo keys are placeholders; production uses environment variables."_

---

## 7. 🌐 OFFLINE MODE — SYNC VULNERABILITIES

### Attack: **Offline Queue Poisoning**

**How it works:** While offline, submit hundreds of fake assessments. They all queue in syncQueue. When the device reconnects, they all sync to Firebase in bulk.

**Current defense:** None. The sync queue accepts everything.

**Judge Defense:** _"Server-side Firebase Cloud Functions would validate each synced record against our anomaly thresholds before writing to the main collection. Poisoned records would be quarantined."_

---

### Attack: **Conflict Resolution Exploits**

**How it works:** Two devices assess the same athlete offline. Both sync different data when reconnecting. Which one wins?

**Current defense:** None — no conflict resolution strategy implemented.

**Judge Defense:** _"In production, we'd use Firestore's merge semantics with timestamps. Both records would be preserved with their assessment timestamps, and the athlete's composite score would be recalculated from ALL assessments."_

---

## 8. 📱 SCOUT DASHBOARD — DATA INTEGRITY

### Attack: **Fake Offers**

**How it works:** Scout creates "Scholarship Offers" that are purely localStorage mock data. An athlete sees "Offer Pending" but it's meaningless.

**Current defense:** None — offers are completely local.

**Judge Defense:** _"The recruitment portal is a demonstration of the marketplace flow. In production, offers would be routed through a verification layer where scout organizations are verified entities with KYC."_

---

## 🛡️ OVERALL DEFENSE STRATEGY (For Judges)

When a judge asks about security, use this **3-layer defense:**

1. **"We built the trust protocol"** — Community attestation with 3 witnesses + OTP is MORE verification than ANY existing grassroots sports system in India (which has ZERO digital records)

2. **"Client is untrusted, server is secured"** — Every web app's client can be manipulated. That's why we hash at creation time, sync to Firebase, and make records append-only server-side

3. **"We detect, not prevent"** — Our fraud detection engine flags anomalies statistically. Combined with reputation scoring, video evidence, and cross-referencing across time, manipulation becomes increasingly difficult and traceable

> **The key insight:** SENTRAK doesn't need to be unhackable. It needs to be BETTER than the current system (paper records, no records, or fabricated certificates) — and it is orders of magnitude better.
