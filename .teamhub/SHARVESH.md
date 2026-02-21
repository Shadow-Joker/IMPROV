# Sharvesh — PHASE 4: FINAL DEMO POLISH

## Status: ✅ Phase 1 ✅ Phase 2 ✅ Phase 3 → Phase 4: Demo-Ready Final Polish

## Branch: `feat/assessment-v4`

---

## FULL ANTIGRAVITY PROMPT — PHASE 4 (paste into NEW Antigravity session)

```
I'm Sharvesh on Team Flexinator building SENTRAK for NXTGEN'26 hackathon.
Phases 1-3 are DONE and merged. This is the FINAL POLISH pass.
Goal: Make every assessment screen absolutely beautiful and demo-proof.

REPO: https://github.com/Shadow-Joker/IMPROV.git
MY BRANCH: feat/assessment-v4 (new branch from latest main)

═══════════════════════════════════════════════════════════════
                    AUTONOMOUS WORKFLOW RULES
═══════════════════════════════════════════════════════════════

RULE 1 — GIT SETUP
  git clone https://github.com/Shadow-Joker/IMPROV.git
  cd IMPROV && npm install
  git checkout -b feat/assessment-v4
  npm run dev

RULE 2 — After EACH task: git add -A && git commit && git push origin feat/assessment-v4
RULE 3 — CHANGELOG: append after every push.
RULE 4 — CONTINUOUS. Do NOT stop until all tasks done.

═══════════════════════════════════════════════════════════════
   PHASE 4: FINAL DEMO POLISH — MAKE JUDGES SAY "WOW"
═══════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────
TASK 1: TIMER WIDGET — DEMO SHOWSTOPPER
────────────────────────────────────────────────────────
WHY: The timer is the most interactive component judges touch.
It needs to feel like a professional sports stopwatch app.

WHAT TO DO:
1. Add a 3-2-1 countdown animation before the timer starts:
   - Large numbers (5rem) that scale in, hold 700ms, scale out.
   - "GO!" in gradient text at the end.
   - Each number plays a short beep using AudioContext (440Hz for 3,2,1 and 880Hz for GO).
2. When running: add a subtle red ring glow that pulses around the timer display.
3. On stop: brief green flash + haptic vibrate(100).
4. Display format: MM:SS.cc (centiseconds). Use a monospace font (var(--font-mono)).
5. Buttons must be at least 80px diameter for projector visibility.

────────────────────────────────────────────────────────
TASK 2: ATTESTATION — THE "WOW" MOMENT
────────────────────────────────────────────────────────
WHY: "3 witnesses + OTP + SHA-256 hash" is our unique selling point.
The UI must make judges FEEL the trust being built.

WHAT TO DO:
1. 3 witness cards in a row (stacked on mobile).
2. Each card: numbered circle (①②③), name field, phone field, "Send OTP" button.
3. OTP input: 6 separate digit boxes (like banking apps), auto-focus next on input.
4. On verify: satisfying checkmark animation + card border turns green.
5. When all 3 verified: dramatic reveal —
   - All 3 cards shimmer with green glow.
   - "COMMUNITY VERIFIED ✓" banner slides in from bottom.
   - SHA-256 hash fingerprint appears below: "a3f2...9bc1"
   - Brief confetti burst (CSS-only: 20 small colored squares falling).
6. For demo: accept any 6-digit OTP as valid.

────────────────────────────────────────────────────────
TASK 3: RECORD ASSESSMENT PAGE — SMOOTH WIZARD
────────────────────────────────────────────────────────
WHY: The multi-step wizard is the backbone of the assessment flow.
It must feel seamless, not clunky.

WHAT TO DO:
1. Step progress bar at top: numbered circles connected by lines.
   Current step: accent-primary + glow. Completed: green checkmark.
2. Slide transitions between steps (translateX animation, 300ms).
3. "Back" button always visible. "Next" disabled until step is valid.
4. On final save: success screen with:
   - Green checkmark animation (scale from 0 to 1 with bounce).
   - "Assessment Recorded!" text.
   - Link to athlete's profile.
   - Summary of what was recorded.
5. All data persists to localStorage immediately (no data loss on refresh).

────────────────────────────────────────────────────────
TASK 4: CHALLENGES PAGE — ENGAGEMENT ENGINE
────────────────────────────────────────────────────────
WHY: "District challenges" prove organic data collection strategy.

WHAT TO DO:
1. At least 5 seeded challenge cards with real data:
   - "Fastest U-16 60m Sprint — Dharmapuri" (12 entries, closes in 5 days)
   - "Longest U-14 Broad Jump — Salem" (8 entries, closes in 12 days)
   - "Best U-18 Bowling Speed — Madurai" (15 entries, closes in 3 days)
   - "Most Push-ups U-16 60s — Coimbatore" (20 entries, closes in 7 days)
   - "Fastest U-14 Shuttle Run — Thanjavur" (6 entries, closes in 10 days)
2. Each card: sport emoji, title, entry count, countdown badge, top 3 mini-leaderboard.
3. "Enter Challenge" → navigates to /assess with sport pre-selected.
4. Filter bar: Sport dropdown, Age Group dropdown.

────────────────────────────────────────────────────────
TASK 5: CROSS-BROWSER + MOBILE FINAL CHECK
────────────────────────────────────────────────────────
WHY: Judges may test on any device.

WHAT TO DO:
1. Test all assessment pages at 360px width (iPhone SE). Fix any overflow.
2. Timer buttons: full-width on mobile, stacked vertically.
3. OTP inputs: use inputmode="numeric" for mobile number pad.
4. All touch targets: minimum 48px.
5. Attestation phone input: use type="tel".

═══════════════════════════════════════════════════════════════
                    EXECUTION ORDER
═══════════════════════════════════════════════════════════════

NOW: Clone → install → branch feat/assessment-v4 → npm run dev
THEN: Tasks 1-5 in order. Commit + push after each.
Tag snapshot/assessment-v4-final when ALL done.

DO NOT STOP. DO NOT ASK. Build, test, push, continue.
```
