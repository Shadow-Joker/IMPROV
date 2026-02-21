# Rahul — ATHLETE FLOW

## Role

Athlete registration, voice input, profiles, QR passport, i18n, mental profile, scheme matching.

## Branch: `feat/athlete`

## Setup

```bash
git clone https://github.com/Shadow-Joker/IMPROV.git
cd IMPROV && npm install
git checkout -b feat/athlete
npm run dev
```

## My Files (ONLY touch these)

```
src/components/athlete/RegisterForm.jsx
src/components/athlete/ProfileCard.jsx
src/components/athlete/QRPassport.jsx
src/components/athlete/SchemesMatcher.jsx
src/components/athlete/MentalProfileForm.jsx
src/components/athlete/MentalRadarChart.jsx
src/components/shared/VoiceInput.jsx
src/components/shared/LanguageToggle.jsx
src/hooks/useVoiceInput.js
src/utils/translations.js
src/utils/schemes.js
src/utils/mentalScoring.js
src/pages/Register.jsx
src/pages/AthleteProfile.jsx
```

## Page Exports

```javascript
// src/pages/Register.jsx
export default function Register() { ... }

// src/pages/AthleteProfile.jsx
export default function AthleteProfile() { ... }
```

## Task Checklist

- [ ] Clone + setup
- [ ] VoiceInput + useVoiceInput (Tamil/English)
- [ ] RegisterForm (voice-first)
- [ ] LanguageToggle
- [ ] translations.js (full Tamil/English)
- [ ] ProfileCard (LinkedIn-premium)
- [ ] QRPassport (QR code shareable)
- [ ] MentalProfileForm (15 questions)
- [ ] MentalRadarChart (5-axis)
- [ ] mentalScoring.js
- [ ] SchemesMatcher + schemes.js
- [ ] Register page
- [ ] AthleteProfile page
- [ ] Polish + responsive

## Sync Commands (every 2 hours)

```bash
git add . && git commit -m "progress: <what>" && git push origin feat/athlete
git pull origin main
```

---

## FULL ANTIGRAVITY PROMPT (paste this ENTIRE block into a new Antigravity session)

```
I'm Rahul on Team Flexinator building SENTRAK for NXTGEN'26 hackathon (24hr).
We're solving PS2: Grassroots Rural Athlete Talent Discovery Platform.
I have ~18 hours remaining. I must work AUTONOMOUSLY and CONTINUOUSLY.

REPO: https://github.com/Shadow-Joker/IMPROV.git
MY BRANCH: feat/athlete
The scaffold is already on main. I MUST NOT touch files outside my ownership.

═══════════════════════════════════════════════════════════════
                    AUTONOMOUS WORKFLOW RULES
═══════════════════════════════════════════════════════════════

RULE 1 — GIT DISCIPLINE (execute these commands, do NOT just plan them)
  Step A: Clone and setup
    git clone https://github.com/Shadow-Joker/IMPROV.git
    cd IMPROV && npm install
    git checkout -b feat/athlete
    npm run dev

  Step B: After EVERY major component is built (not after every tiny change):
    git add -A
    git commit -m "feat(athlete): <what was built>"
    git push origin feat/athlete

  Step C: Every 2 HOURS pull main to stay compatible:
    git stash (if uncommitted changes)
    git checkout main && git pull origin main
    git checkout feat/athlete && git merge main
    git stash pop (if stashed)
    git push origin feat/athlete

  Step D: After each MAJOR MILESTONE (registration done, profiles done, etc):
    git tag snapshot/athlete-v<N> -m "<description>"
    git push origin --tags
    This creates safe rollback points.

RULE 2 — CHANGELOG UPDATES
  After every git push, append a line to .teamhub/CHANGELOG.md:
    [HH:MM IST] RAHUL feat/athlete FEAT — <what was built>
  If you change something that affects data shapes or shared contracts:
    Also add a row to the "Compatibility Notes" table in CHANGELOG.md

RULE 3 — CONTINUOUS BUILDING
  Do NOT stop after one file. Build ALL my files end-to-end, one after another.
  Order: translations.js → useVoiceInput.js → VoiceInput.jsx → LanguageToggle.jsx
  → RegisterForm.jsx → Register.jsx → mentalScoring.js → MentalProfileForm.jsx
  → MentalRadarChart.jsx → schemes.js → SchemesMatcher.jsx → ProfileCard.jsx
  → QRPassport.jsx → AthleteProfile.jsx
  After each file: verify the dev server has no console errors before moving on.

RULE 4 — QUALITY BAR
  Every component must be production-grade:
  - Use CSS classes from src/index.css ONLY (glass-card, btn-primary, form-input, etc)
  - NO inline styles except for layout-specific one-offs
  - Mobile-first responsive (works on cheap Android)
  - Smooth animations (use animate-fade-in, animate-slide-up classes)
  - Large touch targets (min 48px) for rural users

═══════════════════════════════════════════════════════════════
                    MY FILES — DETAILED SPECS
═══════════════════════════════════════════════════════════════

DATA SHAPES — import from src/utils/dataShapes.js (already exists on main):
  createAthlete(data) → returns athlete object
  SPORTS → array of 12 sport names
  AGE_GROUPS → ['U-12', 'U-14', 'U-16', 'U-18', 'U-21']
  GENDERS → ['male', 'female', 'other']
  RATING_TIERS → array of { min, max, name, class }
  getRatingTier(rating) → returns tier object
  getAgeGroup(age) → returns age group string
  DEMO_ATHLETES → 10 seeded athletes for testing
  DEMO_ASSESSMENTS → 5 seeded assessments

────────────────────────────────────────────────────────
FILE 1: src/utils/translations.js
────────────────────────────────────────────────────────
Export an object with keys 'en' and 'ta', each containing ALL UI strings.
Minimum strings needed:
  - Navigation: home, register, assess, scout, challenges
  - Registration: name, age, gender, sport, district, village, photo, submit
  - Prompts: "What is the athlete's name?", "How old is the athlete?", etc.
  - Mental assessment: all 15 questions (see below)
  - Scheme matcher: scheme names, eligibility, benefit text
  - Profile: talentRating, mentalScore, assessments, verified, share
  - Common: save, cancel, next, back, confirm, loading, error, success, offline
  - Status messages: "Registered successfully", "Profile saved", etc.

Tamil translations must be REAL Tamil, not transliterations.
Export a helper: t(key, lang) → returns string

────────────────────────────────────────────────────────
FILE 2: src/hooks/useVoiceInput.js
────────────────────────────────────────────────────────
Custom React hook using Web Speech API (SpeechRecognition).
Returns: { isListening, transcript, interimTranscript, startListening, stopListening, error, isSupported }
Parameters: { language = 'ta-IN', continuous = false, onResult }
Languages: 'ta-IN' for Tamil, 'en-IN' for English
Handle: browser not supported, no mic permission, recognition errors
Use webkitSpeechRecognition || SpeechRecognition for cross-browser.

────────────────────────────────────────────────────────
FILE 3: src/components/shared/VoiceInput.jsx
────────────────────────────────────────────────────────
Reusable voice input component wrapping useVoiceInput.
Props: { onResult, language, placeholder, label, value, onChange }
UI: Text input field + mic button. When mic active, pulse animation.
Shows interim transcript as placeholder text, final on confirm.
Fallback: always allow manual text typing.
Uses: form-input, voice-btn, voice-btn.listening CSS classes.

────────────────────────────────────────────────────────
FILE 4: src/components/shared/LanguageToggle.jsx
────────────────────────────────────────────────────────
Toggle button: Tamil ↔ English
Stores language preference in localStorage.
Exports a React context: LanguageProvider + useLanguage hook.
UI: pill-shaped toggle with "தமிழ்" / "ENG" labels.

────────────────────────────────────────────────────────
FILE 5: src/components/athlete/RegisterForm.jsx
────────────────────────────────────────────────────────
Multi-step registration form with voice-first UX.
Steps: 1) Name + Tamil name  2) Age + Gender  3) Sport selection  4) District + Village  5) Photo capture  6) Review + Submit
Each step: VoiceInput for text fields, large button selectors for choices.
Sport selection: grid of SPORTS with icons.
District: dropdown of 38 TN districts (data in src/utils/dataShapes.js or hardcode top 15).
Photo: use navigator.mediaDevices.getUserMedia for camera, canvas snapshot to base64, fallback to file input.
On submit: createAthlete(formData) → save to localStorage array 'sentrak_athletes' → navigate to /profile/:id
Conversational mode: app speaks each question using speechSynthesis API in Tamil.

────────────────────────────────────────────────────────
FILE 6: src/pages/Register.jsx
────────────────────────────────────────────────────────
Page wrapper: imports RegisterForm, wraps in page layout with header.
Include LanguageProvider if not global.

────────────────────────────────────────────────────────
FILE 7: src/utils/mentalScoring.js
────────────────────────────────────────────────────────
MENTAL_QUESTIONS array: 15 objects, each:
  { id, dimension, question_en, question_ta, reverseScored }
5 dimensions × 3 questions (see below).
calculateMentalProfile(answers) → { toughness, teamwork, drive, strategy, discipline } (each 1-5)
calculateMentalScore(profile) → 0-100 (weighted avg × 20)

Mental Questions:
1. Toughness: resilience after loss, performance under pressure, long session focus
2. Teamwork: team vs individual preference, react to teammate mistake, encourage teammates
3. Drive: solo practice hours, facing stronger opponents, goal-setting
4. Strategy: adapt to opponent, identify weaknesses, analyze past performance
5. Discipline: skip practice frequency (reverse), daily routine, handle boring training

────────────────────────────────────────────────────────
FILE 8: src/components/athlete/MentalProfileForm.jsx
────────────────────────────────────────────────────────
15 questions, one at a time, voice-first.
Each question: Tamil text + English text, 5-option scale (1-5) as large buttons.
Voice mode: app speaks question in Tamil using speechSynthesis, athlete can respond verbally.
Progress bar showing question X/15.
On complete: pass answers to calculateMentalProfile → display results.

────────────────────────────────────────────────────────
FILE 9: src/components/athlete/MentalRadarChart.jsx
────────────────────────────────────────────────────────
5-axis radar/spider chart using SVG (NOT a library — hand-draw with SVG polygon).
Axes: Toughness, Teamwork, Drive, Strategy, Discipline
Values: 1-5 per axis, plotted as polygon.
Colors: gradient fill with accent-primary transparency.
Labels at each axis tip. Center score displayed.
Animated: polygon grows from center on mount.

────────────────────────────────────────────────────────
FILE 10: src/utils/schemes.js
────────────────────────────────────────────────────────
SCHEMES array of 12+ government sports schemes:
Each: { id, name, nameTamil, description, eligibility: { minAge, maxAge, sports, genders, states, minPercentile }, benefit, benefitAmount, url }

Schemes to include:
1. Khelo India Youth Games — U-21, any sport, ₹5,00,000/year
2. Target Olympic Podium Scheme (TOPS) — 18+, national level, ₹10,00,000+
3. SAI Training Centers — U-14 to U-21, any sport, ₹2,00,000/year
4. TN CM Sports Development — TN residents, any, ₹1,00,000
5. National Sports Development Fund — merit-based, ₹50,000-5,00,000
6. Rural Sports Programme — rural athletes, ₹50,000
7. Sports Scholarship (UGC) — student athletes, ₹25,000-1,00,000
8. SC/ST Sports Scholarship — reserved category, ₹75,000
9. Women in Sports Initiative — female athletes, ₹1,00,000
10. District Sports Dev Fund — district level, ₹30,000
11. Fit India Movement Grant — fitness programs, ₹20,000
12. State Sports Council Grant — state level, ₹50,000-2,00,000

matchSchemes(athlete) → array of matching scheme objects

────────────────────────────────────────────────────────
FILE 11: src/components/athlete/SchemesMatcher.jsx
────────────────────────────────────────────────────────
Takes athlete prop → runs matchSchemes → displays matching schemes as cards.
Each card: scheme name (Tamil + English), benefit amount, eligibility summary, "Learn More" link.
Badge: "You Qualify! ✓" in green.
Empty state: "Complete your profile to see matching schemes"

────────────────────────────────────────────────────────
FILE 12: src/components/athlete/ProfileCard.jsx
────────────────────────────────────────────────────────
LinkedIn-premium style athlete profile card.
Sections:
  - Hero: photo + name (English + Tamil) + age + sport + district
  - Talent Rating: large number + tier badge (Bronze/Silver/Gold/Elite/Prodigy)
  - Mental Profile: MentalRadarChart component + overall score
  - Assessments: list of recorded metrics with verification badges
  - Government Schemes: SchemesMatcher component
  - Share: "Share Profile" button (Web Share API or copy URL)
Glass card styling, premium feel. Load athlete from localStorage by ID.

────────────────────────────────────────────────────────
FILE 13: src/components/athlete/QRPassport.jsx
────────────────────────────────────────────────────────
Uses qrcode.react to generate QR code linking to /profile/:athleteId
Layout: A5 printable card — athlete photo, name, key stats, QR code.
Download button: convert to canvas → create blob → trigger download.
Print button: window.print() with print-specific CSS.

────────────────────────────────────────────────────────
FILE 14: src/pages/AthleteProfile.jsx
────────────────────────────────────────────────────────
Full profile page. Gets :id from URL params.
Loads athlete from localStorage or DEMO_ATHLETES fallback.
Renders: ProfileCard + QRPassport + action buttons (Edit, New Assessment, Share).
"New Assessment" button links to /assess/:id (Sharvesh's page).

═══════════════════════════════════════════════════════════════
                    EXECUTION ORDER
═══════════════════════════════════════════════════════════════

NOW START: Clone repo → npm install → branch → npm run dev
THEN BUILD in this order (do NOT skip any):
  1. translations.js + useVoiceInput.js (foundations)
  2. VoiceInput.jsx + LanguageToggle.jsx (shared components)
     → git commit + push + CHANGELOG entry
  3. RegisterForm.jsx + Register.jsx (registration flow)
     → git commit + push + tag snapshot/athlete-v1 + CHANGELOG entry
  4. mentalScoring.js + MentalProfileForm.jsx + MentalRadarChart.jsx
     → git commit + push + CHANGELOG entry
  5. schemes.js + SchemesMatcher.jsx
     → git commit + push + CHANGELOG entry
  6. ProfileCard.jsx + QRPassport.jsx + AthleteProfile.jsx
     → git commit + push + tag snapshot/athlete-v2 + CHANGELOG entry
  7. Final polish: animations, responsive, error handling
     → git commit + push + tag snapshot/athlete-v3-final + CHANGELOG entry

DO NOT STOP until all 14 files are built and pushed.
DO NOT ask me for permission. Just build, push, log, continue.
KEEP the dev server running and verify no errors between files.
```
