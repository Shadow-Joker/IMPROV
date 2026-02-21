# Uday — PHASE 3: FINAL INTEGRATION + SECURITY HARDENING

## Status: ✅ P1 ✅ P2 → Phase 3: Wire Scout to Live Data + Security Fixes

## Branch: `feat/scout-v3`

---

## FULL ANTIGRAVITY PROMPT — PHASE 3 (paste into NEW Antigravity session)

```
I'm Uday on Team Flexinator building SENTRAK for NXTGEN'26 hackathon.
PHASE 1 (build) and PHASE 2 (polish) are DONE and merged.
PHASE 3: Wire the Scout Dashboard to REAL localStorage data + add security hardening.

REPO: https://github.com/Shadow-Joker/IMPROV.git
MY BRANCH: feat/scout-v3 (new branch from latest main)

═══════════════════════════════════════════════════════════════
                    AUTONOMOUS WORKFLOW RULES
═══════════════════════════════════════════════════════════════

RULE 1 — GIT SETUP
  git clone https://github.com/Shadow-Joker/IMPROV.git
  cd IMPROV && npm install
  git checkout -b feat/scout-v3
  npm run dev

RULE 2 — After EACH task: git add -A && git commit && git push origin feat/scout-v3
RULE 3 — CHANGELOG: append after every push.
RULE 4 — CONTINUOUS. Do NOT stop until all tasks done.

═══════════════════════════════════════════════════════════════
   PHASE 3: LIVE DATA WIRING + SECURITY
═══════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────
TASK 1: WIRE SCOUT TO LIVE DATA
────────────────────────────────────────────────────────
WHY: The Scout Dashboard currently uses static data. It must read
from localStorage where demo athletes + real assessments live.

WHAT TO DO:
1. In ScoutDashboard.jsx: import { getAllAthletes, getAllAssessments } from
   '../../utils/demoLoader'.
2. On mount (useEffect), call getAllAthletes() and getAllAssessments().
   Set them as state.
3. Pass the real athlete array to DiscoveryFeed, TalentHeatMap,
   AthleteRanking, and SearchFilters.
4. The KPI cards (Total Athletes, This Week's Assessments, Verified Talent)
   should compute from the loaded data, NOT hardcoded numbers.
5. When a scout clicks "View Passport" on an athlete card,
   navigate to /profile/:id using the real athlete ID.

────────────────────────────────────────────────────────
TASK 2: HEAT MAP → REAL DISTRICT DISTRIBUTION
────────────────────────────────────────────────────────
WHY: The heat map must show WHERE athletes are concentrated based
on actual data, not static numbers.

WHAT TO DO:
1. Count athletes per district from the loaded athlete array.
   athlete.district field maps to TN districts.
2. Color intensity should be proportional to athlete count.
3. Clicking a district should filter the DiscoveryFeed to only
   show athletes from that district.
4. Show a "Clear Filter" button when a district is selected.

────────────────────────────────────────────────────────
TASK 3: SEARCH FILTERS → REAL-TIME FILTERING
────────────────────────────────────────────────────────
WHY: Filters must actually filter the real athlete data.

WHAT TO DO:
1. Sport pills: extract unique sports from athlete data.
2. Age range slider: filter by athlete.age.
3. "Verified Only" toggle: filter to athletes where
   assessments[].attestations.length >= 3.
4. Rating threshold: filter by athlete.talentRating.
5. All filters should update DiscoveryFeed in real-time.

────────────────────────────────────────────────────────
TASK 4: ANTI-FRAUD VISIBILITY IN SCOUT VIEW
────────────────────────────────────────────────────────
WHY: Scouts need to see whether an athlete's data is trustworthy.
This is a huge trust differentiator for judges.

WHAT TO DO:
1. On each athlete card in DiscoveryFeed, show a "Trust Badge":
   - 🟢 "Verified" (3+ attestations, all OTP verified, no anomalies)
   - 🟡 "Partial" (1-2 attestations or some unverified)
   - 🔴 "Unverified" (0 attestations)
2. In athlete detail/passport view, show:
   - Hash fingerprint (first 8 + last 4 chars of SHA-256)
   - Number of witnesses
   - Anomaly flags if any exist
3. Add a "Fraud Alert" section that shows athletes with
   flagged assessments (if any anomalies were detected by
   the fraud detection engine).

────────────────────────────────────────────────────────
TASK 5: OFFER TRACKING + TOAST NOTIFICATIONS
────────────────────────────────────────────────────────
WHY: Every action needs feedback to feel premium.

WHAT TO DO:
1. Import { toast } from '../components/shared/Toast'.
2. When "Shortlist" is clicked: toast.success("Added to shortlist!").
3. When "Send Offer" is submitted: toast.success("Offer sent to athlete!").
4. When "Generate Report" is clicked: simulate a 2s delay,
   then toast.info("Report downloaded!").
5. Save shortlisted athletes to localStorage ('sentrak_shortlist').
6. Show shortlist count badge on the "Recruitment" tab.

────────────────────────────────────────────────────────
TASK 6: RESPONSIVE FINAL PASS
────────────────────────────────────────────────────────
WHY: Judges test on phones.

WHAT TO DO:
1. Test at 360px width. All cards must fit without horizontal scroll.
2. Heatmap: on mobile, show a simplified list view of districts
   instead of the SVG map.
3. Ranking table: on mobile (<768px), show card-based layout
   instead of table rows.
4. Touch targets: all buttons and pills minimum 48px.

═══════════════════════════════════════════════════════════════
                    EXECUTION ORDER
═══════════════════════════════════════════════════════════════

NOW: Clone → install → branch feat/scout-v3 → npm run dev
THEN: Tasks 1-6 in order. Commit + push after each.
Tag snapshot/scout-v3-final when ALL done.

DO NOT STOP. DO NOT ASK. Build, test, push, continue.
```
