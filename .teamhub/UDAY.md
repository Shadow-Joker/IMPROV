# Uday — SCOUT

## Role

Scout dashboard, talent heat map, search/filter, rankings, recruitment portal, revenue calculator, discovery feed.

## Branch: `feat/scout`

## Setup

```bash
git clone https://github.com/Shadow-Joker/IMPROV.git
cd IMPROV && npm install
git checkout -b feat/scout
npm run dev
```

## My Files (ONLY touch these)

```
src/components/scout/ScoutDashboard.jsx
src/components/scout/TalentHeatMap.jsx
src/components/scout/AthleteRanking.jsx
src/components/scout/SearchFilters.jsx
src/components/scout/DiscoveryFeed.jsx
src/components/scout/RecruitmentPortal.jsx
src/components/scout/OfferCard.jsx
src/components/demo/RevenueCalculator.jsx
src/components/demo/ScaleMetrics.jsx
src/utils/talentScoring.js
src/utils/districts.js
src/pages/ScoutView.jsx
public/data/tn-districts.json
public/data/sai-benchmarks.json
```

## Page Exports

```javascript
// src/pages/ScoutView.jsx
export default function ScoutView() { ... }
```

## Task Checklist

- [ ] Clone + setup
- [ ] tn-districts.json (38 TN districts)
- [ ] sai-benchmarks.json
- [ ] districts.js (utilities)
- [ ] talentScoring.js (composite scoring)
- [ ] SearchFilters.jsx
- [ ] ScoutDashboard.jsx (tab layout)
- [ ] AthleteRanking.jsx
- [ ] TalentHeatMap.jsx (SVG map)
- [ ] DiscoveryFeed.jsx
- [ ] RecruitmentPortal.jsx + OfferCard.jsx
- [ ] RevenueCalculator.jsx
- [ ] ScaleMetrics.jsx
- [ ] ScoutView.jsx
- [ ] Polish + responsive

## Sync Commands (every 2 hours)

```bash
git add . && git commit -m "progress: <what>" && git push origin feat/scout
git pull origin main
```

---

## FULL ANTIGRAVITY PROMPT (paste this ENTIRE block into a new Antigravity session)

```
I'm Uday on Team Flexinator building SENTRAK for NXTGEN'26 hackathon (24hr).
We're solving PS2: Grassroots Rural Athlete Talent Discovery Platform.
I have ~18 hours remaining. I must work AUTONOMOUSLY and CONTINUOUSLY.

REPO: https://github.com/Shadow-Joker/IMPROV.git
MY BRANCH: feat/scout
The scaffold is already on main. I MUST NOT touch files outside my ownership.

═══════════════════════════════════════════════════════════════
                    AUTONOMOUS WORKFLOW RULES
═══════════════════════════════════════════════════════════════

RULE 1 — GIT DISCIPLINE (execute these commands, do NOT just plan them)
  Step A: Clone and setup
    git clone https://github.com/Shadow-Joker/IMPROV.git
    cd IMPROV && npm install
    git checkout -b feat/scout
    npm run dev

  Step B: After EVERY major component is built:
    git add -A
    git commit -m "feat(scout): <what was built>"
    git push origin feat/scout

  Step C: Every 2 HOURS pull main to stay compatible:
    git stash (if uncommitted changes)
    git checkout main && git pull origin main
    git checkout feat/scout && git merge main
    git stash pop (if stashed)
    git push origin feat/scout

  Step D: After each MAJOR MILESTONE:
    git tag snapshot/scout-v<N> -m "<description>"
    git push origin --tags

RULE 2 — CHANGELOG UPDATES
  After every git push, append a line to .teamhub/CHANGELOG.md:
    [HH:MM IST] UDAY feat/scout FEAT — <what was built>
  If you change data shapes or shared contracts:
    Also add a row to the "Compatibility Notes" table in CHANGELOG.md

RULE 3 — CONTINUOUS BUILDING
  Do NOT stop after one file. Build ALL my files end-to-end.
  Order: tn-districts.json → sai-benchmarks.json → districts.js
  → talentScoring.js → SearchFilters.jsx → AthleteRanking.jsx
  → TalentHeatMap.jsx → DiscoveryFeed.jsx → RecruitmentPortal.jsx
  → OfferCard.jsx → ScoutDashboard.jsx → ScoutView.jsx
  → RevenueCalculator.jsx → ScaleMetrics.jsx
  After each file: verify dev server has no console errors.

RULE 4 — QUALITY BAR
  Use CSS classes from src/index.css ONLY
  DESKTOP-FIRST for scout dashboard (responsive down to tablet)
  Data-dense but clean. Tables, charts, maps. Premium dark theme.

═══════════════════════════════════════════════════════════════
                    MY FILES — DETAILED SPECS
═══════════════════════════════════════════════════════════════

DATA SHAPES — import from src/utils/dataShapes.js:
  DEMO_ATHLETES (10 athletes), DEMO_ASSESSMENTS (5 assessments)
  createOffer(data), SPORTS, AGE_GROUPS, RATING_TIERS, getRatingTier(rating)

────────────────────────────────────────────────────────
FILE 1: public/data/tn-districts.json
────────────────────────────────────────────────────────
JSON array of all 38 Tamil Nadu districts:
Each: { "id": "chennai", "name": "Chennai", "nameTamil": "சென்னை", "population": 4646732, "taluks": ["Egmore", "Fort Tondiarpet", ...] }

All 38 districts:
Chennai, Coimbatore, Madurai, Tiruchirappalli, Salem, Tirunelveli, Erode,
Vellore, Thoothukudi, Dindigul, Thanjavur, Ranipet, Sivaganga, Karur,
Tiruvannamalai, Namakkal, Tiruppur, Cuddalore, Kanchipuram, Krishnagiri,
Dharmapuri, Nagapattinam, Villupuram, Virudhunagar, Theni, Perambalur,
Ariyalur, Nilgiris, Ramanathapuram, Pudukkottai, Kallakurichi, Chengalpattu,
Tirupattur, Tenkasi, Mayiladuthurai, Kanyakumari, Tiruvallur

────────────────────────────────────────────────────────
FILE 2: public/data/sai-benchmarks.json
────────────────────────────────────────────────────────
JSON object keyed by test type, then age group, then gender.
Structure:
{
  "30m_sprint": {
    "U-12": { "male": { "good": 5.5, "excellent": 4.8, "avg": 6.0 }, "female": { "good": 5.8, "excellent": 5.2, "avg": 6.3 } },
    "U-14": { ... }, "U-16": { ... }, "U-18": { ... }, "U-21": { ... }
  },
  "60m_sprint": { ... },
  "600m_run": { ... },
  "standing_broad_jump": { ... },
  "vertical_jump": { ... },
  "shuttle_run_4x10m": { ... },
  "flexibility_sit_reach": { ... },
  "bmi": { ... }
}
Use realistic SAI/Khelo India standards. Research actual values.

────────────────────────────────────────────────────────
FILE 3: src/utils/districts.js
────────────────────────────────────────────────────────
Load and search TN districts.
getAllDistricts() → parsed array from tn-districts.json (fetch or inline)
searchDistricts(query) → filtered by name/nameTamil
getDistrictById(id) → single district
For simplicity: inline the district data rather than fetching JSON.

────────────────────────────────────────────────────────
FILE 4: src/utils/talentScoring.js
────────────────────────────────────────────────────────
calculatePercentile(value, testType, ageGroup, gender, benchmarks):
  Compare value against good/excellent/avg from benchmarks
  Return 0-100 percentile (linear interpolation)
  Lower is better for time-based tests, higher for distance/count

calculateComposite(athlete):
  physicalScore = avg percentile of all assessments (0-100)
  mentalScore = athlete.mentalScore (0-100)
  trustScore = (verified attestations / total) × 100
  composite = physical × 0.60 + mental × 0.25 + trust × 0.15
  return composite

compositeToRating(composite):
  Map 0-100 → 1000-2500 (linear):
  0-20 → 1000-1300 (Bronze)
  20-40 → 1300-1600 (Silver)
  40-60 → 1600-1900 (Gold)
  60-80 → 1900-2200 (Elite)
  80-100 → 2200-2500 (Prodigy)

────────────────────────────────────────────────────────
FILE 5: src/components/scout/SearchFilters.jsx
────────────────────────────────────────────────────────
Filter panel (sidebar on desktop, top bar on mobile).
Filters:
  - Sport: dropdown (12 sports from SPORTS constant)
  - Age Group: radio buttons (U-12 through U-21)
  - Gender: radio (All, Male, Female)
  - District: searchable dropdown (38 districts)
  - Min Talent Rating: range slider (1000-2500)
  - Min Mental Score: range slider (0-100)
  - Verified Only: toggle switch
  - Sort By: dropdown (Rating ↓, Mental Score ↓, Recent, Name)
Props: { filters, onChange }
Each filter change calls onChange with updated filter object.
Use form-select, form-input CSS classes. Compact layout.

────────────────────────────────────────────────────────
FILE 6: src/components/scout/AthleteRanking.jsx
────────────────────────────────────────────────────────
Leaderboard table of athletes sorted by talent rating.
Props: { athletes, filters }
Apply filters → sort → display as table.
Columns: Rank, Photo, Name, Age, Sport, District, Rating (with tier badge), Mental Score, Verified?
Use table, table-container CSS classes.
Click row → navigate to /profile/:id
Sortable column headers. Highlight top 3 with gold/silver/bronze styling.

────────────────────────────────────────────────────────
FILE 7: src/components/scout/TalentHeatMap.jsx
────────────────────────────────────────────────────────
SVG-based simplified Tamil Nadu map.
Create using SVG <path> elements for each district (simplified polygons — doesn't need to be geographically perfect, just recognizable shapes in a grid/cluster layout).
Alternative approach if SVG paths are too complex: use a grid of 38 hexagonal tiles, each representing a district, arranged roughly in TN's shape.
Color intensity: based on athlete count per district (from DEMO_ATHLETES).
  0 athletes: rgba(255,255,255,0.05)
  1-3: rgba(99,102,241,0.3)
  4-7: rgba(99,102,241,0.5)
  8+: rgba(99,102,241,0.8)
Hover: tooltip with district name + athlete count + top sport
Click: show top 5 athletes in that district below the map
Smooth CSS transitions on hover. Glassmorphism tooltip.

────────────────────────────────────────────────────────
FILE 8: src/components/scout/DiscoveryFeed.jsx
────────────────────────────────────────────────────────
Live-updating feed of recent assessments.
Uses DEMO_ASSESSMENTS + DEMO_ATHLETES to generate feed entries.
Each entry: "[Avatar] Murugan K., 14, recorded 7.8s 60m Sprint in Dharmapuri — 85th Percentile ✓ · 2 min ago"
Seed with 15-20 entries with realistic timestamps (spread over last 24h).
Auto-scroll animation (CSS translateY). Pause on hover.
New entries slide in from top with animation. Glass card per entry.
Format timestamps as relative: "2 min ago", "1 hour ago", "5 hours ago"

────────────────────────────────────────────────────────
FILE 9: src/components/scout/RecruitmentPortal.jsx
────────────────────────────────────────────────────────
"Send Offer" modal form triggered from athlete cards.
Form fields: Academy Name, Program Type (scholarship/training/trial/sponsorship dropdown), Value/Benefits text, Duration, Location, Personal Message.
On submit: createOffer(data) → save to localStorage 'sentrak_offers'.
Shows "Offers Sent" list with status badges (Pending/Accepted/Declined).
Uses modal-overlay, modal CSS classes.

────────────────────────────────────────────────────────
FILE 10: src/components/scout/OfferCard.jsx
────────────────────────────────────────────────────────
Display card for an offer (used on athlete profile page).
Props: { offer, onAccept, onDecline }
Shows: academy name, offer type badge, value/benefit, message.
Accept/Decline buttons (shown only if status === 'pending').
Status badges: pending (badge-pending), accepted (badge-verified), declined (badge-danger).

────────────────────────────────────────────────────────
FILE 11: src/components/scout/ScoutDashboard.jsx
────────────────────────────────────────────────────────
Main scout command center with tab navigation.
Tabs: Search | Heat Map | Rankings | Feed | Recruitment
Uses tabs, tab CSS classes.
Each tab renders corresponding component.
Desktop-optimized: sidebar filters + main content area.
On mobile: stacked layout, tabs scroll horizontally.

────────────────────────────────────────────────────────
FILE 12: src/pages/ScoutView.jsx
────────────────────────────────────────────────────────
Page wrapper. Loads athlete data from localStorage + DEMO_ATHLETES.
Passes athletes and filters state to ScoutDashboard.
Manages filter state at page level.

────────────────────────────────────────────────────────
FILE 13: src/components/demo/RevenueCalculator.jsx
────────────────────────────────────────────────────────
Interactive revenue calculator with sliders.
Sliders (use HTML range input + custom CSS):
  - Number of Academies: 0-15,000 (default 15,000)
  - Conversion Rate: 0-20% (default 2%)
  - Monthly Price: ₹499-₹9,999 (default ₹999)
  - Govt Contracts: 0-38 (default 5)
  - Govt Contract Value: ₹10L-₹1Cr (default ₹25L)
Calculated outputs with animated counting:
  Monthly Revenue, Annual Revenue, 3-Year Projection (20% YoY)
Format: ₹X.XX Cr (Indian currency formatting)
Premium glass card with gradient accents.

────────────────────────────────────────────────────────
FILE 14: src/components/demo/ScaleMetrics.jsx
────────────────────────────────────────────────────────
Animated counters that roll up from 0 on mount/visibility.
Stats grid (3×2):
  Total Athletes: 2,847 (↑ 23% this month)
  Districts Active: 23/38 (↑ 3 new)
  Scouts Registered: 156 (↑ 12%)
  Assessments: 12,430 (↑ 340 today)
  Offers Sent: 89 (↑ 15%)
  Schemes Matched: 1,247 (↑ 8%)
Use requestAnimationFrame for smooth counting.
Each stat: stat-card, stat-number (text-gradient), stat-label, stat-trend CSS.
Grid layout using grid-3 class.

═══════════════════════════════════════════════════════════════
                    EXECUTION ORDER
═══════════════════════════════════════════════════════════════

NOW START: Clone repo → npm install → branch → npm run dev
THEN BUILD in this order (do NOT skip any):
  1. tn-districts.json + sai-benchmarks.json (data files)
  2. districts.js + talentScoring.js (utilities)
     → git commit + push + CHANGELOG entry
  3. SearchFilters.jsx + AthleteRanking.jsx (core search)
     → git commit + push + tag snapshot/scout-v1 + CHANGELOG entry
  4. TalentHeatMap.jsx (the wow-factor component)
     → git commit + push + CHANGELOG entry
  5. DiscoveryFeed.jsx (live activity)
     → git commit + push + CHANGELOG entry
  6. RecruitmentPortal.jsx + OfferCard.jsx (marketplace)
     → git commit + push + tag snapshot/scout-v2 + CHANGELOG entry
  7. ScoutDashboard.jsx + ScoutView.jsx (integration)
     → git commit + push + CHANGELOG entry
  8. RevenueCalculator.jsx + ScaleMetrics.jsx (demo weapons)
     → git commit + push + tag snapshot/scout-v3-final + CHANGELOG entry

DO NOT STOP until all 14 files are built and pushed.
DO NOT ask for permission. Just build, push, log, continue.
KEEP the dev server running and verify no errors between files.
```
