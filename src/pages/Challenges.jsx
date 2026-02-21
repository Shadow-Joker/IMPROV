import { useState, useMemo } from 'react';
import { Trophy, Filter, Activity, Flame, Medal } from 'lucide-react';
import { createChallenge, SPORTS, AGE_GROUPS } from '../utils/dataShapes';
import ChallengeCard from '../components/assessment/ChallengeCard';

// ─── Seeded Demo Challenges ───────────────────────
const DEMO_CHALLENGES = [
  createChallenge({
    id: 'ch-1',
    title: 'Fastest U-16 60m Sprint',
    sport: 'Athletics_Track',
    testType: '60m_sprint',
    ageGroup: 'U-16',
    district: 'Dharmapuri',
    startDate: Date.now() - (2 * 24 * 60 * 60 * 1000), // Started 2 days ago
    endDate: Date.now() + (2 * 24 * 60 * 60 * 1000), // Ends in 2 days (Urgent)
    entries: [
      { name: 'Murugan K.', value: 7.8, unit: 's', athleteId: '1' },
      { name: 'Surya P.', value: 8.1, unit: 's', athleteId: '2' },
      { name: 'Ravi D.', value: 8.5, unit: 's', athleteId: '3' },
      { name: 'Karthik V.', value: 8.9, unit: 's', athleteId: '4' },
      { name: 'Mani S.', value: 9.2, unit: 's', athleteId: '5' },
    ],
    status: 'active',
  }),
  createChallenge({
    id: 'ch-2',
    title: 'Longest U-14 Broad Jump',
    sport: 'Athletics_Field',
    testType: 'standing_broad_jump',
    ageGroup: 'U-14',
    district: 'Salem',
    startDate: Date.now() - (5 * 24 * 60 * 60 * 1000),
    endDate: Date.now() + (12 * 24 * 60 * 60 * 1000),
    entries: [
      { name: 'Saranya T.', value: 2.45, unit: 'm', athleteId: '6' },
      { name: 'Priya M.', value: 2.3, unit: 'm', athleteId: '7' },
      { name: 'Anitha B.', value: 2.15, unit: 'm', athleteId: '8' },
    ],
    status: 'active',
  }),
  createChallenge({
    id: 'ch-3',
    title: 'Best U-18 Bowling Speed',
    sport: 'Cricket',
    testType: 'bowling_speed',
    ageGroup: 'U-18',
    district: 'Madurai',
    startDate: Date.now(),
    endDate: Date.now() + (20 * 24 * 60 * 60 * 1000),
    entries: [
      { name: 'Arjun S.', value: 125, unit: 'km/h', athleteId: '9' },
      { name: 'Ravi D.', value: 118, unit: 'km/h', athleteId: '3' },
    ],
    status: 'active',
  }),
  createChallenge({
    id: 'ch-4',
    title: 'Most Push-ups U-16',
    sport: 'Wrestling',
    testType: 'pushups_60s',
    ageGroup: 'U-16',
    district: 'Coimbatore',
    startDate: Date.now() - (1 * 24 * 60 * 60 * 1000),
    endDate: Date.now() + (7 * 24 * 60 * 60 * 1000),
    entries: [
      { name: 'Ravi D.', value: 52, unit: 'count', athleteId: '3' },
      { name: 'Surya P.', value: 48, unit: 'count', athleteId: '2' },
      { name: 'Karthik V.', value: 45, unit: 'count', athleteId: '4' },
      { name: 'Murugan K.', value: 40, unit: 'count', athleteId: '1' },
      { name: 'Arjun S.', value: 38, unit: 'count', athleteId: '9' },
    ],
    status: 'active',
  }),
  createChallenge({
    id: 'ch-5',
    title: 'Fastest U-14 Shuttle Run',
    sport: 'Badminton',
    testType: 'shuttle_run_4x10m',
    ageGroup: 'U-14',
    district: 'Thanjavur',
    startDate: Date.now() - (10 * 24 * 60 * 60 * 1000),
    endDate: Date.now() + (1 * 24 * 60 * 60 * 1000), // Ends in 1 day (Urgent)
    entries: [
      { name: 'Priya M.', value: 10.2, unit: 's', athleteId: '7' },
      { name: 'Divya K.', value: 10.8, unit: 's', athleteId: '10' },
      { name: 'Saranya T.', value: 11.3, unit: 's', athleteId: '6' },
      { name: 'Anitha B.', value: 12.1, unit: 's', athleteId: '8' },
    ],
    status: 'active',
  }),
];

// ─── All districts appearing in challenges ────────
const DISTRICTS = ['All', 'Dharmapuri', 'Salem', 'Madurai', 'Coimbatore', 'Thanjavur', 'Tirunelveli'];

export default function Challenges() {
  const [sportFilter, setSportFilter] = useState('All');
  const [ageFilter, setAgeFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');

  const filtered = useMemo(() => {
    return DEMO_CHALLENGES.filter(ch => {
      if (sportFilter !== 'All' && ch.sport !== sportFilter) return false;
      if (ageFilter !== 'All' && ch.ageGroup !== ageFilter) return false;
      if (districtFilter !== 'All' && ch.district !== districtFilter) return false;
      return true;
    });
  }, [sportFilter, ageFilter, districtFilter]);

  // Derived stats for header
  const totalEntries = filtered.reduce((acc, ch) => acc + (ch.entries?.length || 0), 0);
  const hotChallenges = filtered.filter(ch => {
    const daysLeft = Math.max(0, Math.ceil((ch.endDate - Date.now()) / (1000 * 60 * 60 * 24)));
    return daysLeft <= 3 && ch.entries?.length > 3;
  }).length;

  return (
    <div className="animate-fade-in pb-2xl">
      {/* Header Deck */}
      <div className="page-header mb-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.1) 0%, rgba(0,0,0,0) 100%)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2xl) var(--space-xl)', border: '1px solid rgba(234,179,8,0.2)' }}>
        <div className="absolute top-0 right-0 -mr-10 -mt-10 opacity-20" style={{ transform: 'rotate(15deg)' }}>
          <Trophy size={200} color="var(--accent-gold)" />
        </div>

        <h1 className="page-title flex items-center gap-sm text-gradient-gold mb-sm" style={{ fontSize: '2.5rem' }}>
          <Trophy size={36} color="var(--accent-gold)" />
          District Tournaments
        </h1>
        <p className="text-secondary mb-lg max-w-md">Rise to the top of the leaderboards by completing highly competitive regional skill challenges.</p>

        <div className="flex gap-md">
          <div className="flex items-center gap-xs bg-black/40 px-md py-xs rounded-full border border-white/10">
            <Activity size={16} className="text-indigo-400" />
            <span className="font-bold text-white">{totalEntries}</span>
            <span className="text-muted text-xs uppercase tracking-wide">Athletes Competing</span>
          </div>
          {hotChallenges > 0 && (
            <div className="flex items-center gap-xs bg-red-500/20 px-md py-xs rounded-full border border-red-500/30">
              <Flame size={16} className="text-red-400 animate-pulse" />
              <span className="font-bold text-red-100">{hotChallenges}</span>
              <span className="text-red-300 text-xs uppercase tracking-wide">Ending Soon</span>
            </div>
          )}
        </div>
      </div>

      {/* Control Panel / Filters */}
      <div className="glass-card-static mb-xl sticky top-0 z-30 shadow-lg" style={{ backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center justify-between mb-sm">
          <div className="flex items-center gap-sm">
            <Filter size={18} color="var(--text-muted)" />
            <span className="text-white font-bold tracking-wide">Live Radar Filters</span>
          </div>
          {(sportFilter !== 'All' || ageFilter !== 'All' || districtFilter !== 'All') && (
            <button
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest font-bold"
              onClick={() => { setSportFilter('All'); setAgeFilter('All'); setDistrictFilter('All'); }}
            >
              Clear All ✕
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))', gap: 'var(--space-md)' }}>
          <div className="form-group mb-0">
            <select className="form-select bg-black/40 border-white/10 w-full" value={sportFilter} onChange={e => setSportFilter(e.target.value)}>
              <option value="All">🏆 All Disciplines</option>
              {SPORTS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div className="form-group mb-0">
            <select className="form-select bg-black/40 border-white/10 w-full" value={ageFilter} onChange={e => setAgeFilter(e.target.value)}>
              <option value="All">👥 All Age Groups</option>
              {AGE_GROUPS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="form-group mb-0">
            <select className="form-select bg-black/40 border-white/10 w-full" value={districtFilter} onChange={e => setDistrictFilter(e.target.value)}>
              <option value="All">📍 All Districts</option>
              {DISTRICTS.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Challenge Grid Map */}
      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: 'var(--space-lg)' }}>
          {filtered.map((challenge, index) => (
            <div key={challenge.id} className={`animate-slide-up hover:-translate-y-1 transition-transform duration-300`} style={{ animationDelay: `${index * 0.1}s` }}>
              <ChallengeCard challenge={challenge} />
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card text-center p-3xl mt-xl border-dashed border-white/10">
          <Medal size={64} className="mx-auto text-indigo-500/30 mb-md opacity-50" />
          <h3 className="heading-3 mb-sm text-white">No Tournaments Discovered</h3>
          <p className="text-secondary max-w-sm mx-auto">
            Broaden your radar parameters or check back soon when new grassroots districts initiate challenges.
          </p>
          <button
            className="btn btn-primary mt-lg"
            onClick={() => { setSportFilter('All'); setAgeFilter('All'); setDistrictFilter('All'); }}
          >
            Reset Radar Sweep
          </button>
        </div>
      )}
    </div>
  );
}
