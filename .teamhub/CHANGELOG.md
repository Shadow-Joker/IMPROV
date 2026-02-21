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
```

---

## Active Snapshot Branches (safe rollback points)

| Branch | Time  | Description                                         |
| ------ | ----- | --------------------------------------------------- |
| `main` | 14:45 | Scaffold — all pages render, design system complete |

---

## Compatibility Notes

> When you change something that affects OTHER devs, log it here so they adapt.

| Time  | Change                      | Affects | Action Required                              |
| ----- | --------------------------- | ------- | -------------------------------------------- |
| 14:45 | `dataShapes.js` created     | ALL     | Import shapes from `src/utils/dataShapes.js` |
| 14:45 | `index.css` design system   | ALL     | Use CSS classes only, no inline styles       |
| 14:45 | Routes defined in `App.jsx` | ALL     | Export default from your page files          |
