# 📒 SENTRAK Change Ledger

> Auto-updated by each dev's Antigravity. Source of truth for all changes.

---

## Format

```
[TIMESTAMP] [DEV] [BRANCH] [TYPE] — Description
Types: FEAT | FIX | MERGE | BRANCH | SYNC | DESIGN | DATA
```

---

## Log

### Scaffold Phase

```
[14:45 IST] NAVNEETH main FEAT — Project scaffold pushed: Vite+React, design system, routing, 6 pages, dataShapes.js, firebase.js, layout components, teamhub files (28 files, 10K lines)
[16:40 IST] SHARVESH feat/assessment FEAT — sportMetrics.js: 12 sports + SAI_TESTS (8 standard tests) + SPORT_ICONS map
[16:45 IST] SHARVESH feat/assessment FEAT — SportSelector.jsx: 12-sport card grid with accent glow selection
[16:45 IST] SHARVESH feat/assessment FEAT — TimerWidget.jsx: precision stopwatch (performance.now, rAF, laps, vibration, 80px buttons)
[16:50 IST] SHARVESH feat/assessment FEAT — SAITestEngine.jsx: guided 8-test flow with countdown, timer/manual/BMI inputs, progress bar
[16:50 IST] SHARVESH feat/assessment FEAT — MetricsRecorder.jsx: dynamic sport-specific metrics (timer/manual/count/rating inputs)
[16:55 IST] SHARVESH feat/assessment FEAT — hashVerify.js: SHA-256 hash generation + verification (Web Crypto API)
[16:55 IST] SHARVESH feat/assessment FEAT — AttestationForm.jsx: 3-witness OTP verification with progress indicators
[17:00 IST] SHARVESH feat/assessment FEAT — offlineDB.js: IndexedDB storage (athletes, assessments, syncQueue stores)
[17:00 IST] SHARVESH feat/assessment FEAT — useOfflineSync.js: offline/online sync hook with auto-sync on reconnect
[17:05 IST] SHARVESH feat/assessment FEAT — fraudDetection.js: anomaly detection (impossible checks, z-score outliers, attestor reputation)
[17:05 IST] SHARVESH feat/assessment FEAT — VideoClipCapture.jsx: camera capture (15s max, MediaRecorder API, base64)
[17:10 IST] SHARVESH feat/assessment FEAT — RecordAssessment.jsx: full 7-step assessment page integrating all components
[17:10 IST] SHARVESH feat/assessment FEAT — ChallengeCard.jsx + Challenges.jsx: 5 seeded district challenges with filters
[17:15 IST] SHARVESH feat/assessment BRANCH — Tagged snapshot/assessment-v1 (all 14 files built and verified)
[19:35 IST] SHARVESH feat/assessment-v3 FIX — RecordAssessment.jsx: End-to-end cross-DB persistence and auto-redirect handling to Profile
[19:40 IST] SHARVESH feat/assessment-v3 FIX — AthleteProfile.jsx: Merged IDB offline queue fallback data alongside LocalStorage on init
[19:45 IST] SHARVESH feat/assessment-v3 FEAT — RecordAssessment.jsx: Integrated AI Anomaly Fraud warnings with a forced coach verification opt-in
[19:50 IST] SHARVESH feat/assessment-v3 FEAT — ErrorBoundary.jsx: React error boundaries safeguarding TestEngine/MetricsRecorder maps
[19:55 IST] SHARVESH feat/assessment-v3 DESIGN — TimerWidget.jsx & AttestationForm.jsx & RecordAssessment.jsx: Clamped viewport fonts, pinned nav, enforced tel inputs for iPhone UX
[20:25 IST] SHARVESH feat/assessment-v4 FEAT — TimerWidget.jsx: Added 3-2-1 countdown, scaling numbers, beep AudioContext, pulsing red glow, green flash 
[20:25 IST] SHARVESH feat/assessment-v4 FEAT — AttestationForm.jsx: 3-witness row layout, 6-digit OTP separated boxes, auto-focus, Confetti burst, green shimmer reveal
[20:25 IST] SHARVESH feat/assessment-v4 UX — RecordAssessment.jsx: Connected step progress bar, 300ms slide transitions, persistent back/next footer, animated Success loop
[20:25 IST] SHARVESH feat/assessment-v4 FEAT — ChallengeCard.jsx: Routed URL params `?sport=` auto-triggering `RecordAssessment.jsx` hook configuration
[20:25 IST] SHARVESH feat/assessment-v4 MOBILE — Resized 80px Stacked Timer inputs, 360px viewport bounding checks, numeric telephone keys
[21:00 IST] SHARVESH feat/final-integration FEAT — RegisterForm.jsx: Wired global toast.success on registration + fixed local state shadowing
[21:00 IST] SHARVESH feat/final-integration FEAT — RecordAssessment.jsx: Added toast.success on assessment save + ← Back button in header
[21:00 IST] SHARVESH feat/final-integration FEAT — ProfileCard.jsx: Replaced local share toast with global toast.info system
[21:05 IST] SHARVESH feat/final-integration FEAT — AthleteProfile.jsx: Added ← Back button + scoreAthlete() rating recalculation from assessments
[21:05 IST] SHARVESH feat/final-integration FIX — BottomNav.jsx: Fixed active state to use startsWith() for sub-route highlighting
[21:05 IST] SHARVESH feat/final-integration MOBILE — Challenges.jsx: Responsive auto-fill grids for 360px stacking
[21:05 IST] SHARVESH feat/final-integration QA — Browser verified all demo data: /challenges 5 cards, /profile/demo-1 full data, /scout 10 athletes
```

### Scout Phase (Uday)

```
[18:30 IST] UDAY feat/scout DATA — tn-districts.json: 38 TN districts with Tamil names, populations, taluks
[18:30 IST] UDAY feat/scout DATA — sai-benchmarks.json: 8 SAI tests × 5 age groups × 2 genders
[18:35 IST] UDAY feat/scout FEAT — districts.js: inline district data + search/filter utilities
[18:35 IST] UDAY feat/scout FEAT — talentScoring.js: percentile calc, composite scoring (60/25/15), rating conversion (1000-2500)
[18:40 IST] UDAY feat/scout FEAT — SearchFilters.jsx: sport/age/gender/district/rating/mental filters with searchable dropdown
[18:40 IST] UDAY feat/scout FEAT — AthleteRanking.jsx: leaderboard table with sortable cols, gold/silver/bronze top-3, tier badges
[18:45 IST] UDAY feat/scout FEAT — TalentHeatMap.jsx: hex-grid TN map (38 districts), color-intensity by athlete count, hover tooltips
[18:45 IST] UDAY feat/scout FEAT — DiscoveryFeed.jsx: live auto-scrolling feed with 20 entries, pause-on-hover, relative timestamps
[18:50 IST] UDAY feat/scout FEAT — RecruitmentPortal.jsx: modal offer form, localStorage persistence, status management
[18:50 IST] UDAY feat/scout FEAT — OfferCard.jsx: offer display card with type badges, accept/decline actions
[18:55 IST] UDAY feat/scout FEAT — ScoutDashboard.jsx: tab nav (Search/HeatMap/Rankings/Feed/Recruitment), sidebar layout
[18:55 IST] UDAY feat/scout FEAT — ScoutView.jsx: page wrapper with localStorage + DEMO_ATHLETES merge, filter state mgmt
[19:00 IST] UDAY feat/scout FEAT — RevenueCalculator.jsx: 5-slider calculator, animated INR, 3yr projection (20% YoY)
[19:00 IST] UDAY feat/scout FEAT — ScaleMetrics.jsx: 6-stat animated counter grid with IntersectionObserver
[19:05 IST] UDAY feat/scout BRANCH — Tagged snapshot/scout-v1, v2, v3-final (all 14 files built, verified, pushed)
[19:28 IST] UDAY feat/scout SYNC — Pulled main (Sharvesh assessment-v2 + deploy), merged into feat/scout, all 5 tabs verified working
```

### Scout Phase 2 — Polish (Uday)

```
[20:15 IST] UDAY feat/scout-v2 POLISH — TalentHeatMap: gradient colors (blue→pink), stagger fade-in, scale hover, glassmorphic tooltip
[20:15 IST] UDAY feat/scout-v2 POLISH — ScoutDashboard: 3 KPI cards (animated counters + sparklines), live ticker, Export Report button
[20:18 IST] UDAY feat/scout-v2 POLISH — DiscoveryFeed: social feed UX, sport badges, Load More pagination, shortlist/view/offer actions
[20:18 IST] UDAY feat/scout-v2 POLISH — SearchFilters: multi-select sport pills, iOS-style verified toggle, collapsible panel
[20:20 IST] UDAY feat/scout-v2 POLISH — AthleteRanking: trend arrows (up/down), Statewide/District toggle, mobile card view
[20:20 IST] UDAY feat/scout-v2 POLISH — RecruitmentPortal: canvas confetti on offer send, saved/shortlisted athletes section
[20:22 IST] UDAY feat/scout-v2 POLISH — RevenueCalculator + ScaleMetrics: cleaner layout, Discovery Funnel visualization
[20:25 IST] UDAY feat/scout-v2 POLISH — ScoutView: wired to demoLoader.getAllAthletes(), multi-sport filter support
[20:30 IST] UDAY feat/scout-v2 BRANCH — Tagged snapshot/scout-v2-p1 (all polish verified, pushed)
```

---

## Active Snapshot Branches (safe rollback points)

| Branch | Time  | Description                                         |
| ------ | ----- | --------------------------------------------------- |
| `main` | 14:45 | Scaffold — all pages render, design system complete |
| `snapshot/scout-v1` | 19:05 | Core search + data + utilities |
| `snapshot/scout-v2` | 19:05 | Heatmap + Feed + Marketplace |
| `snapshot/scout-v3-final` | 19:05 | All 14 scout files complete |
| `snapshot/scout-v2-p1` | 20:30 | Phase 2 polish: KPIs, gradient heatmap, social feed |

---

## Compatibility Notes

> When you change something that affects OTHER devs, log it here so they adapt.

| Time  | Change                      | Affects | Action Required                              |
| ----- | --------------------------- | ------- | -------------------------------------------- |
| 14:45 | `dataShapes.js` created     | ALL     | Import shapes from `src/utils/dataShapes.js` |
| 14:45 | `index.css` design system   | ALL     | Use CSS classes only, no inline styles       |
| 14:45 | Routes defined in `App.jsx` | ALL     | Export default from your page files          |
| 19:05 | `districts.js` created      | ALL     | Import from `src/utils/districts.js` for TN district data |
| 19:05 | `talentScoring.js` created  | ALL     | Import from `src/utils/talentScoring.js` for percentile/composite scoring |
| 19:05 | Offers stored in localStorage | ALL   | Key: `sentrak_offers` — use `createOffer()` from dataShapes |
