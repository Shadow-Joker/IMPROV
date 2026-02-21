# Rahul — ATHLETE FLOW (PHASE 2: POLISH & PRECISION)

## Status: ✅ Phase 1 COMPLETE → Phase 2: Full Polish

## Branch: `feat/athlete-v2`

---

## FULL ANTIGRAVITY PROMPT — PHASE 2 (paste this ENTIRE block into a NEW Antigravity session)

```
I'm Rahul on Team Flexinator building SENTRAK for NXTGEN'26 hackathon.
MY PHASE 1 IS DONE — all 14 files are built and merged into main.
Now I'm doing PHASE 2: precision polish, bug fixing, and WOW factor upgrades.

REPO: https://github.com/Shadow-Joker/IMPROV.git
MY BRANCH: feat/athlete-v2 (new branch from latest main)
I MUST NOT touch files outside my ownership list.

═══════════════════════════════════════════════════════════════
                    AUTONOMOUS WORKFLOW RULES
═══════════════════════════════════════════════════════════════

RULE 1 — GIT SETUP
  git clone https://github.com/Shadow-Joker/IMPROV.git
  cd IMPROV && npm install
  git checkout -b feat/athlete-v2
  npm run dev

RULE 2 — GIT DISCIPLINE
  After EVERY file is improved:
    git add -A && git commit -m "polish(athlete): <what was improved>" && git push origin feat/athlete-v2
  After every 4th commit:
    git tag snapshot/athlete-v2-p<N> -m "<description>" && git push origin --tags
  Every 2 hours:
    git pull origin main && git merge main (resolve conflicts if any)

RULE 3 — CHANGELOG
  After every push, append to .teamhub/CHANGELOG.md:
    [HH:MM IST] RAHUL feat/athlete-v2 POLISH — <exact change>

RULE 4 — CONTINUOUS WORK
  Do NOT stop. Polish ALL files one by one. Verify dev server between each.

═══════════════════════════════════════════════════════════════
   PHASE 2 TASKS — DETAILED LINE-BY-LINE IMPROVEMENTS
   REASON for every change is explained. Follow precisely.
═══════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────
TASK 1: src/utils/translations.js — COMPLETENESS AUDIT
────────────────────────────────────────────────────────
WHY: In demo, judges switch to Tamil. If ANY string shows English while
in Tamil mode, it looks broken. Every single user-facing string MUST
have a Tamil translation. Missing translations kill credibility.

WHAT TO DO:
1. Open the file. Read every key in the 'en' object.
2. For EACH key, verify the 'ta' object has a REAL Tamil translation.
   NOT transliteration (e.g., "rek-is-tar" is WRONG).
   MUST be proper Tamil script (e.g., "பதிவு செய்" for "Register").
3. Add these MISSING strings that the UI currently needs:
   - "viewProfile" → "View Profile" / "சுயவிவரத்தைக் காண"
   - "totalAssessments" → "Total Assessments" / "மொத்த மதிப்பீடுகள்"
   - "communityVerified" → "Community Verified" / "சமூக சரிபார்ப்பு"
   - "talentPassport" → "Talent Passport" / "திறமை கடவுச்சீட்டு"
   - "downloadCard" → "Download Card" / "அட்டையைப் பதிவிறக்கு"
   - "printCard" → "Print Card" / "அட்டையை அச்சிடு"
   - "schemesMatched" → "Schemes You Qualify For" / "நீங்கள் தகுதி பெறும் திட்டங்கள்"
   - "noSchemes" → "Complete your profile to see matching schemes" / "பொருத்தமான திட்டங்களைக் காண உங்கள் சுயவிவரத்தை நிறைவு செய்யுங்கள்"
   - "shareProfile" → "Share Profile" / "சுயவிவரத்தைப் பகிர்"
   - "copiedToClipboard" → "Copied to clipboard!" / "கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டது!"
   - "photoCapture" → "Take Photo" / "புகைப்படம் எடு"
   - "retakePhoto" → "Retake" / "மீண்டும் எடு"
   - "step" → "Step" / "படி"
   - "of" → "of" / "இல்"
   - "reviewSubmit" → "Review & Submit" / "மதிப்பாய்வு & சமர்ப்பி"
   - Error messages: "micPermissionDenied", "cameraPermissionDenied", "voiceNotSupported", "saveError"
4. t() function: if key not found, return the key itself as fallback (don't crash).

────────────────────────────────────────────────────────
TASK 2: src/hooks/useVoiceInput.js — ROBUSTNESS
────────────────────────────────────────────────────────
WHY: Web Speech API fails silently on many Android browsers, cheap Jiophone
devices, and Safari. If voice fails, the entire registration breaks.
Rural users won't know to "type instead." The hook MUST degrade gracefully.

WHAT TO DO:
1. Add a `isSupported` boolean: check if webkitSpeechRecognition OR
   SpeechRecognition exists. If not, return { isSupported: false } and
   ALL other functions become no-ops (no crash).
2. Add timeout: if recognition runs > 10 seconds with no result, auto-stop
   and set error to "No speech detected. Please try again or type instead."
3. Add retry counter: if recognition fails 3 times consecutively, set a
   `fallbackToText` flag so the UI knows to show text input prominently.
4. Handle these specific error codes from recognition.onerror:
   - "not-allowed" → set error "Microphone permission denied. Please allow mic access in Settings."
   - "no-speech" → set error "No speech detected. Tap the mic and speak clearly."
   - "network" → set error "Speech recognition needs internet. Type your answer instead."
   - "aborted" → silently ignore (user cancelled)
5. On cleanup (useEffect return): ALWAYS call recognition.stop() to prevent
   zombie recognition sessions that drain battery on mobile.

────────────────────────────────────────────────────────
TASK 3: src/components/shared/VoiceInput.jsx — UX POLISH
────────────────────────────────────────────────────────
WHY: Village coaches have never used voice input. The component must
TEACH them how to use it through visual feedback, not just assume.

WHAT TO DO:
1. When isSupported=false: hide mic button entirely, show ONLY text input.
   No broken button that does nothing.
2. When listening=true:
   a. Mic button: red background + CSS pulse animation (already done via voice-btn.listening class)
   b. Add a "Listening..." text label below the button in Tamil: "கேட்கிறேன்..."
   c. Show live interim transcript in the input field as greyed placeholder text
   d. Add a sound wave animation: 3-4 vertical bars that oscillate (use CSS @keyframes)
3. When result comes in:
   a. Quick green flash on input border (0.3s transition to accent-success, then back)
   b. haptic feedback: navigator.vibrate?.(50)
4. Error state: show error message in red below input. Add "Try Again" button
   that clears error and restarts listening.
5. Fallback: always show a small "⌨️ Type instead" link below the mic button
   that focuses the text input.
6. Add prop: `speakQuestion` (boolean). If true, use speechSynthesis to
   read the label aloud in the current language before starting recognition.
   This makes the form CONVERSATIONAL — the app asks, user answers.

────────────────────────────────────────────────────────
TASK 4: src/components/shared/LanguageToggle.jsx — PERSISTENCE + STYLING
────────────────────────────────────────────────────────
WHY: If user switches to Tamil and refreshes, it resets to English.
Frustrating for monolingual Tamil speakers.

WHAT TO DO:
1. On language change: save to localStorage('sentrak_language').
2. On mount: read from localStorage. Default to 'ta' (Tamil first,
   because our target users are primarily Tamil speakers).
3. Pill toggle styling: make it wider (min 100px), add smooth sliding
   indicator animation (a colored "pill" that slides left/right).
4. Add globe icon (Globe from lucide-react) before the text.
5. When toggled: brief haptic feedback: navigator.vibrate?.(30)
6. CSS: use glassmorphism background (bg-glass), border-radius-full.

────────────────────────────────────────────────────────
TASK 5: src/components/athlete/RegisterForm.jsx — CRITICAL FIXES
────────────────────────────────────────────────────────
WHY: This is THE first thing judges see in the demo. Every pixel matters.
Any bug here = failed demo.

WHAT TO DO:
1. PROGRESS BAR: Replace simple "Step X of 6" text with a visual progress
   bar. Use a <div> with width percentage, gradient background
   (var(--gradient-hero)), height 4px, border-radius-full, smooth transition.
   Show step dots: 6 circles, filled up to current step, connected by line.

2. STEP 1 — Name:
   a. Two fields: English name + Tamil name. Tamil name field should have
      placeholder "தமிழில் பெயர்" and use VoiceInput with language="ta-IN".
   b. Auto-focus the first field on mount.
   c. If voice gives Tamil text for English name field, detect script and
      auto-fill Tamil name field instead. Detection: check if text contains
      Tamil Unicode range \u0B80-\u0BFF.

3. STEP 2 — Age + Gender:
   a. Age: large number input with - and + buttons (min 8, max 25).
      Show calculated age group badge (U-12, U-14, etc) updating live.
   b. Gender: 3 large pill buttons (Male/Female/Other), not a dropdown.
      Selected state: accent-primary background. Icons: ♂ ♀ ⚧

4. STEP 3 — Sport:
   a. 3×4 grid of sport cards with emojis (already has SPORT_ICONS).
   b. On select: card gets gradient border + subtle scale(1.05) transform.
   c. Add a "Popular in your district" badge on top 2 sports for the
      selected district (hardcode: Cricket + Kabaddi for most districts).

5. STEP 4 — District + Village:
   a. District: searchable dropdown with Tamil names shown alongside English.
      Format: "Chennai (சென்னை)". Use the data from dataShapes or inline list.
   b. Village: free text VoiceInput. Tamil voice should work here.
   c. Show mini "📍 Location" indicator when both filled.

6. STEP 5 — Photo:
   a. Camera preview should show in a circular frame (border-radius: 50%,
      width: 200px, height: 200px, centered, border: 3px solid accent-primary).
   b. Captured photo: show in same circular frame with ✅ overlay.
   c. "Retake" button below photo.
   d. If camera permission denied: show file upload button prominently
      with text "Upload from gallery" instead of broken camera view.
   e. Fallback: if no photo, show default avatar silhouette (SVG).

7. STEP 6 — Review:
   a. Show all entered data in a premium summary card (glass-card).
   b. Each field: label (text-muted) + value (text-primary) in 2-col layout.
   c. Photo thumbnail in top-right corner of card.
   d. "Edit" link next to each field that jumps back to that step.
   e. Submit button: large, gradient background, "Register Athlete ✓"

8. TRANSITIONS between steps:
   a. Slide animation: next step slides in from right, back slides from left.
   b. Use CSS transform: translateX(100%) → translateX(0) with transition.
   c. 300ms duration, ease-out timing.

9. AFTER SUBMIT:
   a. Success animation: green checkmark that scales from 0 to 1 with bounce.
   b. Show the athlete's new Talent Rating badge (starts at 1000 — Bronze).
   c. Auto-navigate to /profile/:id after 2 seconds.
   d. Toast: "Athlete registered successfully!" / "வீரர் வெற்றிகரமாக பதிவு செய்யப்பட்டார்!"

10. VALIDATION:
    a. Name: minimum 2 characters.
    b. Age: 8-25 range enforced.
    c. Sport: must select one.
    d. District: must select one.
    e. Show inline validation errors in red below each field.
    f. "Next" button disabled (opacity 0.5) until step is valid.

────────────────────────────────────────────────────────
TASK 6: src/components/athlete/MentalProfileForm.jsx — ENGAGEMENT
────────────────────────────────────────────────────────
WHY: 15 questions is long. If it feels like a boring survey, athletes
will abandon. Must feel like a game, not a test.

WHAT TO DO:
1. Question card: each question gets its own glass-card with the question
   number as a large accent-colored number in the top-left (e.g., "07").
2. Answer buttons (1-5): replace raw numbers with descriptive labels:
   1 = "Never" / "ஒருபோதும் இல்லை"
   2 = "Rarely" / "அரிதாக"
   3 = "Sometimes" / "சில நேரங்களில்"
   4 = "Often" / "அடிக்கடி"
   5 = "Always" / "எப்போதும்"
3. Selected answer: accent-primary background with checkmark icon.
4. Auto-advance: after selecting answer, wait 500ms then auto-slide
   to next question (with slide animation).
5. Progress: circular progress indicator (SVG circle with stroke-dasharray)
   showing percentage complete. Update in real-time.
6. Voice: Use speechSynthesis to read each question aloud in the current
   language. Start speaking when question appears. Stop when user answers.
7. Completion screen: dramatic reveal of the MentalRadarChart with
   scale-in animation from center. Show dimension names with scores.
   Add encouraging text based on score range:
   - 80-100: "Champion Mindset! 🏆" / "சாம்பியன் மனநிலை! 🏆"
   - 60-79: "Strong Potential! 💪" / "வலுவான திறன்! 💪"
   - 40-59: "Growing Athlete 🌱" / "வளரும் வீரர் 🌱"
   - 0-39: "Keep Training! 🎯" / "பயிற்சியைத் தொடருங்கள்! 🎯"

────────────────────────────────────────────────────────
TASK 7: src/components/athlete/MentalRadarChart.jsx — VISUAL PREMIUM
────────────────────────────────────────────────────────
WHY: This chart is a KEY differentiator. It must look stunning enough
that judges take a photo of it. No chart library — we built SVG by hand,
which impresses technically. But it needs to LOOK premium.

WHAT TO DO:
1. Background: add concentric pentagon outlines (levels 1-5) in faint
   rgba(255,255,255,0.05) — creates a "web" pattern behind the data polygon.
2. Data polygon: gradient fill from accent-primary (0.3 opacity) to
   accent-secondary (0.1 opacity). Stroke: 2px solid accent-primary.
3. Data points: small circles (r=4) at each vertex of the data polygon.
   On hover: grow to r=6 with tooltip showing exact value (e.g., "4.2/5.0").
4. Axis lines: from center to each vertex, dashed stroke (2,4 dasharray).
5. Labels: positioned OUTSIDE the outermost pentagon. Tamil+English stacked:
   e.g., "Toughness" on top, "மன உறுதி" below in smaller font.
6. Center: show overall score as large number (e.g., "78") with circle
   background. Color based on score (green if >70, yellow if >50, red if <50).
7. Animation: polygon grows from center point outward over 800ms on mount.
   Use requestAnimationFrame to interpolate vertex positions from center to final.
8. Responsive: SVG viewBox should be "0 0 300 300". Scale down on mobile
   but keep readable. Min-width: 250px.

────────────────────────────────────────────────────────
TASK 8: src/utils/schemes.js — ACCURACY + DETAIL
────────────────────────────────────────────────────────
WHY: If a judge asks "are these real schemes?" and we can't answer
confidently, we lose trust. Every scheme must be a real Indian government
sports program with accurate eligibility criteria.

WHAT TO DO:
1. Verify every scheme name is a REAL program (Google if unsure).
2. Add these REAL schemes if missing:
   - "Khelo India Youth Games" (MYAS) — ₹5,00,000/year scholarship
   - "TOPS (Target Olympic Podium Scheme)" — for elite national athletes
   - "SAI Training Centre Admission" — free hostel + coaching
   - "Rajiv Gandhi Khel Abhiyan" — rural sports infrastructure
   - "CM's Special Sports Award (TN)" — ₹3,00,000 for state-level
   - "SC/ST Sports Scholarship (GOI)" — ₹75,000/year
   - "National Sports Development Fund" — merit-based grants
3. matchSchemes(): fix eligibility logic:
   a. Age match: athlete.age must be between scheme.eligibility.minAge and maxAge
   b. Sport match: if scheme specifies sports array, athlete.sport must be in it.
      If scheme has no sports restriction, it matches ALL sports.
   c. Gender match: if scheme specifies gender, must match.
   d. State match: all our athletes are from TN, so TN-specific schemes always match.
   e. Performance match: if scheme requires minPercentile, check athlete's best
      assessment percentile >= that value.
4. Each scheme object must have:
   { id, name, nameTamil, description, descriptionTamil, eligibility, benefit, benefitTamil, url }

────────────────────────────────────────────────────────
TASK 9: src/components/athlete/SchemesMatcher.jsx — VISUAL IMPACT
────────────────────────────────────────────────────────
WHY: Government scheme matching is our "10x moment" — the slide where
judges go "oh that's clever." The UI must make the impact OBVIOUS.

WHAT TO DO:
1. Header: "🏛️ Government Schemes You Qualify For" with count badge (e.g., "4 matches")
2. Each scheme card:
   a. Green "You Qualify! ✓" badge in top-right
   b. Scheme name (English + Tamil)
   c. Benefit amount in LARGE gradient text: "₹5,00,000/year"
   d. Short eligibility summary in text-muted
   e. "Apply Now →" button (links to scheme URL or shows info modal)
3. If athlete qualifies for 0 schemes: show an encouraging message:
   "Complete more assessments to unlock scheme matches!"
   with a link to /assess/:id
4. Total benefit calculation at bottom:
   "Total potential value: ₹X,XX,XXX" — sum of all matched scheme benefits.
   Show this as a large gradient number.
5. Animate: cards stagger-enter from bottom (stagger-1 through stagger-5)

────────────────────────────────────────────────────────
TASK 10: src/components/athlete/ProfileCard.jsx — LINKEDIN PREMIUM
────────────────────────────────────────────────────────
WHY: This IS the "Digital Talent Passport." If it doesn't look like
a premium profile card, the entire concept fails visually.

WHAT TO DO:
1. Hero section (top of card):
   a. Background: subtle gradient (accent-primary 5% → transparent)
   b. Circular photo (120px, border: 3px solid accent-primary, shadow-glow)
   c. If no photo: default avatar SVG (silhouette with sport icon overlay)
   d. Name: heading-2 weight, white. Tamil name below in text-secondary.
   e. Sport badge + District badge (pill-shaped, glass background)
   f. Age + Gender shown discreetly in text-muted below badges

2. Talent Rating section:
   a. Large rating number: font-size 3rem, text-gradient
   b. Tier badge next to it: use the CSS class from getRatingTier() — badge-bronze/silver/gold/elite/prodigy
   c. Mini progress bar showing position within tier (e.g., 1800 is 72% through Gold tier)
   d. "Rank in district" if we have comparison data

3. Mental Profile section:
   a. Embed MentalRadarChart component
   b. Below chart: 5 dimension bars (horizontal, colored by value):
      Each dimension name + score + filled bar (width = score/5 * 100%)

4. Assessments section:
   a. List of recorded assessments with:
      - Test name + value + unit
      - Percentile badge (green if >75, yellow if >50, red if <50)
      - "Community Verified ✓" badge if 3+ attestations
      - Timestamp (relative: "3 hours ago")
   b. If no assessments: CTA "Record your first assessment →"

5. Schemes section:
   a. Embed SchemesMatcher component

6. Share section:
   a. "Share Profile" button using Web Share API
   b. Fallback: copy URL to clipboard with success toast
   c. Show as floating action button (FAB) in bottom-right corner

────────────────────────────────────────────────────────
TASK 11: src/components/athlete/QRPassport.jsx — PRINT QUALITY
────────────────────────────────────────────────────────
WHY: Judges may ask "can you print this?" A physical card-like output
is a tangible proof point. Must look like a real ID card.

WHAT TO DO:
1. Layout: A5 card (148mm × 210mm or similar ratio) in portrait orientation.
2. Top: SENTRAK logo + "Digital Talent Passport" header in gradient text.
3. Left side: circular athlete photo (if available) or avatar placeholder.
4. Right side: Name (EN + Tamil), Age, Sport, District, Talent Rating + tier badge.
5. Center: QR code (200px) encoding the URL: {window.location.origin}/profile/{athleteId}
6. Bottom: "Scan to verify" text + SENTRAK branding. Small print: "Generated on {date}"
7. Download button: use html2canvas or manual canvas rendering to create PNG.
   Canvas approach:
   a. Create offscreen canvas (600×850 pixels)
   b. Draw dark background
   c. Draw all text, QR code (from qrcode.react's canvas output), and photo
   d. canvas.toBlob() → create download link
8. Print button: add @media print CSS that hides everything except the passport card.
   window.print()
9. Styling: dark background matching app theme. Gold accent border.
   Must look premium, not like a receipt.

────────────────────────────────────────────────────────
TASK 12: src/pages/Register.jsx — PAGE LEVEL INTEGRATION
────────────────────────────────────────────────────────
WHY: The Register page is the wrapper. It needs to handle edge cases.

WHAT TO DO:
1. Wrap in LanguageProvider so all child components get language context.
2. Add a "Demo Mode" banner at top if navigated from /demo:
   "You're in demo mode — registration data is stored locally"
3. After successful registration, show a celebration modal:
   - Confetti animation (CSS keyframes with multiple colored elements)
   - "🎉 Athlete Registered!"
   - Quick stats card showing: Name, Sport, Rating (1000), New ID
   - Two buttons: "View Profile" → /profile/:id, "Register Another"

────────────────────────────────────────────────────────
TASK 13: src/pages/AthleteProfile.jsx — LOADING + ERROR STATES
────────────────────────────────────────────────────────
WHY: If profile takes time to load (IndexedDB) or ID doesn't exist,
the page shows nothing. Bad UX.

WHAT TO DO:
1. Loading state: show skeleton shimmer (skeleton-card, skeleton-text classes):
   - Circular skeleton for photo
   - Two skeleton-text bars for name
   - Three skeleton-text bars for stats
2. Error state: if athlete not found AND not in DEMO_ATHLETES:
   "Athlete not found" card with link to /register
3. Tab persistence: store active tab in URL hash (#profile, #passport, #mental)
   so refresh doesn't reset to profile tab.
4. Add "Back" button in header that navigates to previous page.
5. Ensure the LanguageProvider wraps correctly (currently done).

────────────────────────────────────────────────────────
TASK 14: src/utils/mentalScoring.js — EDGE CASES
────────────────────────────────────────────────────────
WHY: If user skips a question or provides partial answers, the scoring
shouldn't break or return NaN.

WHAT TO DO:
1. Handle undefined/null answers: treat as score 3 (neutral).
2. Handle empty answers array: return all zeros, score 0.
3. Reverse scoring: verify that reverse-scored questions are correctly
   inverted (score = 6 - rawScore). Double-check which 3 questions are reversed.
4. Clamp all dimension scores to 0.0 - 5.0 range.
5. Clamp overall mentalScore to 0-100 range.
6. Add JSDoc comments explaining the scoring formula.

═══════════════════════════════════════════════════════════════
                    EXECUTION ORDER
═══════════════════════════════════════════════════════════════

NOW: Clone → npm install → git checkout -b feat/athlete-v2 → npm run dev
THEN: Work through tasks 1-14 in ORDER. Do NOT skip any.
After EACH file: verify dev server, commit, push, update CHANGELOG.
After tasks 5, 10, 14: create snapshot tag.

DO NOT STOP until all 14 tasks are done.
DO NOT ask for permission. Build, push, log, continue.
KEEP dev server running. Verify after each change.
```
