# Sharvesh — ASSESSOR

## Role

SAI assessment engine, sport-specific metrics, timer, attestation, offline sync, fraud detection, challenges.

## Branch: `feat/assessment`

## Setup

```bash
git clone https://github.com/Shadow-Joker/IMPROV.git
cd IMPROV && npm install
git checkout -b feat/assessment
npm run dev
```

## My Files (ONLY touch these)

```
src/components/assessment/SAITestEngine.jsx
src/components/assessment/MetricsRecorder.jsx
src/components/assessment/TimerWidget.jsx
src/components/assessment/AttestationForm.jsx
src/components/assessment/VideoClipCapture.jsx
src/components/assessment/ChallengeCard.jsx
src/components/assessment/SportSelector.jsx
src/hooks/useOfflineSync.js
src/utils/offlineDB.js
src/utils/hashVerify.js
src/utils/fraudDetection.js
src/utils/sportMetrics.js
src/pages/RecordAssessment.jsx
src/pages/Challenges.jsx
```

## Page Exports

```javascript
// src/pages/RecordAssessment.jsx
export default function RecordAssessment() { ... }

// src/pages/Challenges.jsx
export default function Challenges() { ... }
```

## Task Checklist

- [ ] Clone + setup
- [ ] sportMetrics.js (12 sports)
- [ ] SportSelector.jsx
- [ ] TimerWidget.jsx (stopwatch)
- [ ] SAITestEngine.jsx (8-test guided)
- [ ] MetricsRecorder.jsx (sport-specific)
- [ ] hashVerify.js (SHA-256)
- [ ] AttestationForm.jsx (3 witnesses)
- [ ] offlineDB.js (IndexedDB CRUD)
- [ ] useOfflineSync.js (sync queue)
- [ ] fraudDetection.js (anomaly flags)
- [ ] VideoClipCapture.jsx
- [ ] RecordAssessment.jsx (full page)
- [ ] ChallengeCard.jsx + Challenges.jsx
- [ ] Polish + responsive

## Sync Commands (every 2 hours)

```bash
git add . && git commit -m "progress: <what>" && git push origin feat/assessment
git pull origin main
```

---

## FULL ANTIGRAVITY PROMPT (paste this ENTIRE block into a new Antigravity session)

```
I'm Sharvesh on Team Flexinator building SENTRAK for NXTGEN'26 hackathon (24hr).
We're solving PS2: Grassroots Rural Athlete Talent Discovery Platform.
I have ~18 hours remaining. I must work AUTONOMOUSLY and CONTINUOUSLY.

REPO: https://github.com/Shadow-Joker/IMPROV.git
MY BRANCH: feat/assessment
The scaffold is already on main. I MUST NOT touch files outside my ownership.

═══════════════════════════════════════════════════════════════
                    AUTONOMOUS WORKFLOW RULES
═══════════════════════════════════════════════════════════════

RULE 1 — GIT DISCIPLINE (execute these commands, do NOT just plan them)
  Step A: Clone and setup
    git clone https://github.com/Shadow-Joker/IMPROV.git
    cd IMPROV && npm install
    git checkout -b feat/assessment
    npm run dev

  Step B: After EVERY major component is built:
    git add -A
    git commit -m "feat(assessment): <what was built>"
    git push origin feat/assessment

  Step C: Every 2 HOURS pull main to stay compatible:
    git stash (if uncommitted changes)
    git checkout main && git pull origin main
    git checkout feat/assessment && git merge main
    git stash pop (if stashed)
    git push origin feat/assessment

  Step D: After each MAJOR MILESTONE:
    git tag snapshot/assessment-v<N> -m "<description>"
    git push origin --tags

RULE 2 — CHANGELOG UPDATES
  After every git push, append a line to .teamhub/CHANGELOG.md:
    [HH:MM IST] SHARVESH feat/assessment FEAT — <what was built>
  If you change data shapes or shared contracts:
    Also add a row to the "Compatibility Notes" table in CHANGELOG.md

RULE 3 — CONTINUOUS BUILDING
  Do NOT stop after one file. Build ALL my files end-to-end.
  Order: sportMetrics.js → SportSelector.jsx → TimerWidget.jsx
  → SAITestEngine.jsx → MetricsRecorder.jsx → hashVerify.js
  → AttestationForm.jsx → offlineDB.js → useOfflineSync.js
  → fraudDetection.js → VideoClipCapture.jsx → RecordAssessment.jsx
  → ChallengeCard.jsx → Challenges.jsx
  After each file: verify dev server has no console errors.

RULE 4 — QUALITY BAR
  Use CSS classes from src/index.css ONLY (glass-card, btn-primary, timer-display, etc)
  Mobile-first responsive. Large touch targets (80px+ for timer buttons).
  Smooth animations. Premium dark theme.

═══════════════════════════════════════════════════════════════
                    MY FILES — DETAILED SPECS
═══════════════════════════════════════════════════════════════

DATA SHAPES — import from src/utils/dataShapes.js:
  createAssessment(data), createAttestation(data), createChallenge(data)
  SPORTS, AGE_GROUPS, DEMO_ATHLETES, DEMO_ASSESSMENTS

────────────────────────────────────────────────────────
FILE 1: src/utils/sportMetrics.js
────────────────────────────────────────────────────────
Export SPORT_METRICS object keyed by sport name.
Each sport maps to an array of metric definitions.
Each metric: { key, name, nameTamil, unit, inputType, description }
inputType: "timer" | "manual" | "count" | "rating"

Sports and metrics:
1. Cricket: bowling_speed (km/h, manual), batting_distance (m, manual), fielding_reaction (s, timer)
2. Football: sprint_40m (s, timer), endurance_beep_level (level 1-20, manual), passing_accuracy (count/10, count), dribble_time (s, timer)
3. Kabaddi: raid_success_rate (%, manual), tackle_count (count, count), flexibility (cm, manual)
4. Hockey: sprint_30m (s, timer), dribble_slalom (s, timer), shot_accuracy (count/10, count), endurance_beep (level, manual)
5. Badminton: shuttle_run (s, timer), reaction_time (s, timer), smash_count_60s (count, count), footwork_test (s, timer)
6. Wrestling: pushups_60s (count, count), situps_60s (count, count), flexibility (cm, manual), weight (kg, manual)
7. Athletics_Track: 100m (s, timer), 200m (s, timer), 400m (s, timer), 800m (s, timer), 1500m (s, timer)
8. Athletics_Field: long_jump (m, manual), high_jump (m, manual), shot_put (m, manual), discus (m, manual), javelin (m, manual)
9. Swimming: 50m_freestyle (s, timer), 100m_freestyle (s, timer), technique_score (1-5, rating)
10. Boxing: punch_count_30s (count, count), reaction_test (s, timer), endurance_3min (1-5, rating), weight (kg, manual)
11. Archery: score_10m (0-300, manual), score_20m (0-300, manual), score_30m (0-300, manual)
12. Weightlifting: snatch_max (kg, manual), clean_jerk_max (kg, manual), body_weight (kg, manual)

Also export SAI_TESTS array (the 8 standard tests):
  30m_sprint (s, timer), 60m_sprint (s, timer), 600m_run (s, timer),
  standing_broad_jump (m, manual), vertical_jump (cm, manual),
  shuttle_run_4x10m (s, timer), flexibility_sit_reach (cm, manual),
  bmi (kg/m2, calculated from height+weight inputs)

────────────────────────────────────────────────────────
FILE 2: src/components/assessment/SportSelector.jsx
────────────────────────────────────────────────────────
Grid of 12 sport cards. User selects sport → loads corresponding metric form.
Each card: sport icon/emoji + name. Selected state: accent border + glow.
On select: sets sport state, used by MetricsRecorder to load right metrics.

────────────────────────────────────────────────────────
FILE 3: src/components/assessment/TimerWidget.jsx
────────────────────────────────────────────────────────
Precision stopwatch component.
Display: MM:SS.cc (centiseconds) using timer-display CSS class.
Buttons: START (green, 80px), STOP (red, 80px), RESET (grey), LAP (blue).
States: ready (white) → running (red, timer-running) → stopped (green, timer-stopped).
Uses performance.now() for precision. requestAnimationFrame for display updates.
Vibration feedback: navigator.vibrate(100) on start/stop.
Props: { onStop(timeMs), onLap(lapMs) }
Lap display: list of lap times underneath timer.

────────────────────────────────────────────────────────
FILE 4: src/components/assessment/SAITestEngine.jsx
────────────────────────────────────────────────────────
Guided flow through all 8 SAI tests, one at a time.
For each test:
  1. Show test name + instructions + visual diagram
  2. "Ready" button → 3-2-1 countdown animation
  3. TimerWidget (for timed tests) or manual input field (for measurements)
  4. Record value → show result → "Next Test" button
Progress bar: step X of 8. Allow skip.
Stores all results as assessment objects.
For BMI: two input fields (height cm, weight kg) → auto-calculate BMI.

────────────────────────────────────────────────────────
FILE 5: src/components/assessment/MetricsRecorder.jsx
────────────────────────────────────────────────────────
Dynamic form that loads metrics based on selected sport from sportMetrics.js.
For each metric based on inputType:
  - "timer" → embed TimerWidget
  - "manual" → number input with unit label
  - "count" → increment/decrement buttons with counter display
  - "rating" → 1-5 star/button selector
Each recorded metric: createAssessment({ sport, testType: key, value, unit })
Save all to localStorage under athlete's assessments array.

────────────────────────────────────────────────────────
FILE 6: src/utils/hashVerify.js
────────────────────────────────────────────────────────
async generateHash(assessment) → SHA-256 hex string
  Concatenate: athleteId + testType + value + timestamp + witness phones
  Use: crypto.subtle.digest('SHA-256', encoder.encode(data))
  Return: hex string (array buffer → hex)
async verifyHash(assessment, expectedHash) → boolean
  Regenerate hash → compare to stored hash

────────────────────────────────────────────────────────
FILE 7: src/components/assessment/AttestationForm.jsx
────────────────────────────────────────────────────────
3 witness slots. Each slot:
  - Name input + Phone input (10-digit Indian mobile)
  - "Send OTP" button → for demo: show OTP input, accept any 6 digits
  - On verify: green checkmark animation ✓
All 3 verified → assessment gets "Community Verified" badge.
Store attestations with the assessment object.
Visual: progress indicator (0/3 → 1/3 → 2/3 → 3/3 ✓ VERIFIED)

────────────────────────────────────────────────────────
FILE 8: src/utils/offlineDB.js
────────────────────────────────────────────────────────
Using idb library (already in package.json).
const DB_NAME = 'sentrak'; const DB_VERSION = 1;
Stores: 'athletes' (keyPath: 'id'), 'assessments' (keyPath: 'id'), 'syncQueue' (keyPath: 'id')
Functions:
  initDB() → open/upgrade database
  saveAthlete(athlete), getAthlete(id), getAllAthletes()
  saveAssessment(assessment), getAssessmentsByAthlete(athleteId), getAllAssessments()
  addToSyncQueue(item), getSyncQueue(), removeFromSyncQueue(id)
  clearSyncQueue()
All functions async. Handle errors gracefully.

────────────────────────────────────────────────────────
FILE 9: src/hooks/useOfflineSync.js
────────────────────────────────────────────────────────
Hook that manages offline/online sync.
Returns: { isOnline, pendingCount, lastSyncTime, syncNow, isSyncing }
On mount: add online/offline event listeners.
When online + pendingCount > 0: auto-process sync queue.
syncNow(): read syncQueue from IndexedDB → for each: save to Firestore → markSynced → remove from queue.
For hackathon: Firestore sync is optional (demo with localStorage is fine), but the ARCHITECTURE must be there.

────────────────────────────────────────────────────────
FILE 10: src/utils/fraudDetection.js
────────────────────────────────────────────────────────
checkAnomalies(assessment, sport):
  - Physically impossible checks per sport (100m can't be < 9.5s for U-14)
  - Statistical outlier detection: flag if > 3 standard devs from known ranges
  - Returns: { isAnomaly, flags: string[], severity: 'low'|'medium'|'high' }
checkAttestorReputation(phone, allAttestations):
  - Count attestations by this phone in last 24h
  - If > 20 → flag as suspicious
  - Returns: { trustScore: 0-100, flag: string|null }

────────────────────────────────────────────────────────
FILE 11: src/components/assessment/VideoClipCapture.jsx
────────────────────────────────────────────────────────
Camera capture component (15s max clip).
Uses: navigator.mediaDevices.getUserMedia({ video: true })
Record to MediaRecorder API → save as blob → convert to base64.
UI: camera preview, record button (red circle), 15s countdown, playback.
Compact storage: low resolution (480p), compressed.
Skip/optional — not required for every assessment.

────────────────────────────────────────────────────────
FILE 12: src/pages/RecordAssessment.jsx
────────────────────────────────────────────────────────
Full assessment recording page. Multi-step flow:
  Step 1: Select athlete (from localStorage list or DEMO_ATHLETES)
  Step 2: SportSelector — pick sport
  Step 3: Choose SAI battery OR sport-specific metrics
  Step 4: Run SAITestEngine or MetricsRecorder based on choice
  Step 5: AttestationForm — 3 witnesses verify
  Step 6: Hash generated + results summary
  Step 7: Optional VideoClipCapture
Save all to localStorage assessments. Show success animation.
If URL has :athleteId param, pre-select that athlete.

────────────────────────────────────────────────────────
FILE 13: src/components/assessment/ChallengeCard.jsx
────────────────────────────────────────────────────────
Display card for a district challenge.
Props: challenge object (from createChallenge shape)
Shows: title, sport, age group, district, deadline, entry count, top 3 leaders.
"Enter Challenge" button → links to assessment recording for that sport/test.
Timer badge: "X days remaining"

────────────────────────────────────────────────────────
FILE 14: src/pages/Challenges.jsx
────────────────────────────────────────────────────────
Lists active challenges (seeded demo data).
Seed at least 5 challenges:
  - Fastest U-16 60m Sprint — Dharmapuri (Feb 2026)
  - Longest U-14 Broad Jump — Salem (Feb 2026)
  - Best U-18 Bowling Speed — Madurai (Feb 2026)
  - Most Push-ups U-16 — Coimbatore (Feb 2026)
  - Fastest U-14 Shuttle Run — Thanjavur (Feb 2026)
Filter by: sport, age group, district. Grid of ChallengeCards.

═══════════════════════════════════════════════════════════════
                    EXECUTION ORDER
═══════════════════════════════════════════════════════════════

NOW START: Clone repo → npm install → branch → npm run dev
THEN BUILD in this order (do NOT skip any):
  1. sportMetrics.js (foundation — all 12 sports defined)
     → git commit + push + CHANGELOG entry
  2. SportSelector.jsx + TimerWidget.jsx (core UI components)
     → git commit + push + CHANGELOG entry
  3. SAITestEngine.jsx + MetricsRecorder.jsx (assessment flows)
     → git commit + push + tag snapshot/assessment-v1 + CHANGELOG entry
  4. hashVerify.js + AttestationForm.jsx (verification system)
     → git commit + push + CHANGELOG entry
  5. offlineDB.js + useOfflineSync.js (offline engine)
     → git commit + push + CHANGELOG entry
  6. fraudDetection.js + VideoClipCapture.jsx (extras)
     → git commit + push + tag snapshot/assessment-v2 + CHANGELOG entry
  7. RecordAssessment.jsx (full page integration)
     → git commit + push + CHANGELOG entry
  8. ChallengeCard.jsx + Challenges.jsx (challenges system)
     → git commit + push + tag snapshot/assessment-v3-final + CHANGELOG entry

DO NOT STOP until all 14 files are built and pushed.
DO NOT ask for permission. Just build, push, log, continue.
KEEP the dev server running and verify no errors between files.
```
