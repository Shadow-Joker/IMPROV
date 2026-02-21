# Uday — PHASE 2: POLISH & PRECISION

## Status: ✅ Phase 1 DONE → Phase 2: Full Polish + WOW Factor

## Branch: `feat/scout-v2`

> ⚠️ **UDAY — Phase 2 prompt is ready. Start a NEW Antigravity session and paste the prompt below!**

---

## FULL ANTIGRAVITY PROMPT — PHASE 2 (paste into NEW Antigravity session)

```
I'm Uday on Team Flexinator building SENTRAK for NXTGEN'26 hackathon.
MY PHASE 1 IS DONE — all 14 scout files are built and merged to main.
Now PHASE 2: precision polish, bug fixes, and making the Scout Dashboard jaw-dropping.

REPO: https://github.com/Shadow-Joker/IMPROV.git
MY BRANCH: feat/scout-v2 (new branch from latest main)
I MUST NOT touch files outside my ownership list.

═══════════════════════════════════════════════════════════════
                    AUTONOMOUS WORKFLOW RULES
═══════════════════════════════════════════════════════════════

RULE 1 — GIT SETUP
  git clone https://github.com/Shadow-Joker/IMPROV.git
  cd IMPROV && npm install
  git checkout -b feat/scout-v2
  npm run dev

RULE 2 — GIT DISCIPLINE
  After EACH file improved: git add -A && git commit -m "polish(scout): <what>" && git push origin feat/scout-v2
  After every 3rd commit: git tag snapshot/scout-v2-p<N> && git push origin --tags
  Every 2 hours: git pull origin main && merge

RULE 3 — CHANGELOG: append after every push.
RULE 4 — CONTINUOUS. Do NOT stop until all tasks done.

═══════════════════════════════════════════════════════════════
   PHASE 2: DETAILED IMPROVEMENTS
═══════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────
TASK 1: src/components/scout/TalentHeatMap.jsx — VISUAL IMPACT
────────────────────────────────────────────────────────
WHY: The heat map is our "data analytics" differentiator. Must look dynamic.

WHAT TO DO:
1. Make the TN map interactive: each district is a clickable region.
2. Color intensity: gradient from soft blue (low talent) to deep accent (high).
3. Hover: scale(1.05) + glassmorphic tooltip: District Name, Athletes, Top Sport.
4. Animation: stagger fade-in of districts.
5. Load data from localStorage (seeded demo athletes) to make counts real.

────────────────────────────────────────────────────────
TASK 2: src/components/scout/ScoutDashboard.jsx — PREMIUM LAUNCHPAD
────────────────────────────────────────────────────────
WHY: First thing a recruiter sees. Must scream "enterprise analytics".

WHAT TO DO:
1. Top: 3 KPI cards (Total Athletes, Assessments This Week, Verified Talent).
   Each with animated counter and a mini sparkline chart in background.
2. Layout: CSS Grid — heatmap 60% width, discovery feed 40% on desktop.
3. "Live Activity" ticker at bottom showing recent attestations.
4. "Generate Report" button (simulated PDF download).

────────────────────────────────────────────────────────
TASK 3: src/components/scout/DiscoveryFeed.jsx — SOCIAL FEED UX
────────────────────────────────────────────────────────
WHY: Browsing talent should feel addictive like a modern social feed.

WHAT TO DO:
1. Each athlete card: circular avatar, sport badge, composite score + tier.
2. "New Assessment" badge with pulsing green dot on recently assessed athletes.
3. "Load More" button for infinite scroll simulation (5 at a time).
4. Quick actions on hover/tap: "View Passport", "Shortlist", "Send Offer".
5. Wire data from localStorage (demo athletes + assessments).

────────────────────────────────────────────────────────
TASK 4: src/components/scout/SearchFilters.jsx — POWER TOOLS
────────────────────────────────────────────────────────
WHY: Scouts need complex queries. Must be smooth.

WHAT TO DO:
1. Multi-select pills for sports: clickable pill buttons [Kabaddi][Athletics][+].
2. Age range: double-thumb slider (12 to 22 range).
3. "Verified Only" toggle (iOS-style switch, green accent).
4. Minimum rating threshold slider.
5. Apply filters to DiscoveryFeed in real-time (filter demo data).

────────────────────────────────────────────────────────
TASK 5: src/components/scout/AthleteRanking.jsx — LEADERBOARD
────────────────────────────────────────────────────────
WHY: Leaderboards drive competition and make data meaningful.

WHAT TO DO:
1. Table: Rank, Athlete, District, Score, Trend (green/red arrow).
2. Top 3: gold/silver/bronze background tints.
3. "Statewide" / "Your District" toggle.
4. Populate from demo data, sorted by talent rating descending.

────────────────────────────────────────────────────────
TASK 6: src/components/scout/RecruitmentPortal.jsx + OfferCard.jsx
────────────────────────────────────────────────────────
WHY: Closes the loop — scouts can actually act on talent they find.

WHAT TO DO:
1. "Saved Athletes" list from localStorage.
2. "Make Offer" opens OfferCard modal: type (Scholarship/Academy/Sponsorship),
   value, message to athlete.
3. "Send Offer" → confetti + toast + status "Offer Pending".
4. Track in localStorage ('sentrak_mock_offers').

────────────────────────────────────────────────────────
TASK 7: src/components/demo/RevenueCalculator.jsx + ScaleMetrics.jsx
────────────────────────────────────────────────────────
WHY: Business model proof for judges.

WHAT TO DO:
1. Interactive sliders: Districts Onboarded, Assessments/Month, Scout Subscriptions.
2. Auto-calculate projected ARR with large gradient numbers.
3. ScaleMetrics: visual funnel "Villages → Schools → Athletes → Prodigies".
4. Animated progression filling bars.

────────────────────────────────────────────────────────
TASK 8: RESPONSIVE + MOBILE
────────────────────────────────────────────────────────
WHY: Judges test on phones.

WHAT TO DO:
1. Stack layout vertically on <768px.
2. Card-based lists on mobile instead of complex tables.
3. All touch targets: minimum 44x44px.
4. Test at 360px width, fix all overflow issues.

═══════════════════════════════════════════════════════════════
                    EXECUTION ORDER
═══════════════════════════════════════════════════════════════

NOW: Clone → install → branch feat/scout-v2 → npm run dev
THEN: Tasks 1-8 in order. Commit + push + CHANGELOG after each.
Tags after tasks 3, 6, 8.

DO NOT STOP. DO NOT ASK. Build, test, push, continue.
```
