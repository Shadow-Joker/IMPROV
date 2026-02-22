# CHANGELOG

## [feat/scout-v3] - Phase 3 SENTRAK

### Added
- Live data wiring to all Scout components (`ScoutDashboard`, `DiscoveryFeed`, `TalentHeatMap`, `SearchFilters`, `AthleteRanking`, `RecruitmentPortal`).
- Real-time heat map distribution logic mapping density and counts with custom Tamil Nadu layout.
- SearchFilters dynamic matching on unique sports based on actual athlete records without hardcoding.
- Trust Badges (🟢 Verified, 🟡 Partial, 🔴 Unverified) dynamically reflecting attestations and OTP validations.
- Hash fingerprints, witness counts, and anomaly flags directly onto Discovery View items.
- Fraud Alert section automatically populating on top of Feed when assessments contain anomaly flags.
- Shortlist & Offer tracking leveraging `localStorage` for offline persistence across sessions.
- Notification `toast` system confirming "Shortlisted", "Send Offer", and delayed "Generated Report" actions.
- 360px absolute mobile responsive CSS restrictions and 48px touch targets for all elements.

### Changed
- `index.css`: Added `@media (max-width: 360px)` breakpoint and 48px minimum heights for touch areas.
- `DiscoveryFeed`: Rewritten from mocked events to prop-delivered robust list with integrated `react-router-dom` navigation for "View Passport".
- `TalentHeatMap`: Desktop SVG refactored for prop integration and hover effects; Mobile version downgraded to data-dense clickable list for better UX on small screens.
- `SearchFilters`: Redesigned iOS-style toggle. Enlarged interactive targets to MIN_HEIGHT 48px for ADA/finger compliance. Active pill indicators dynamic filtering `athletes.filter()`.
- `RecruitmentPortal`: Confetti effects for Offer acceptance. Enlarged target areas.

### Fixed
- Fixed bug where athletes with `verified` tag wouldn't show appropriately due to missing mapping from attestations array length.
- Fixed horizontal scroll leak on 360px viewports with strict overflow hiding on `body` tag and `wrap` attributes added to internal Flex layouts. 
