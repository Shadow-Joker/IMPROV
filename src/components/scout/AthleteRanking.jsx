import { useState, useMemo } from 'react';
import { Trophy, ChevronDown, ChevronUp, CheckCircle, TrendingUp, TrendingDown, MapPin } from 'lucide-react';
import { getRatingTier, getAgeGroup } from '../../utils/dataShapes';
import { useNavigate } from 'react-router-dom';

export default function AthleteRanking({ athletes = [], filters = {} }) {
    const [sortCol, setSortCol] = useState('rating');
    const [sortDir, setSortDir] = useState('desc');
    const [viewMode, setViewMode] = useState('statewide'); // 'statewide' | 'district'
    const navigate = useNavigate();

    const toggleSort = (col) => {
        if (sortCol === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
        else { setSortCol(col); setSortDir('desc'); }
    };

    const filtered = useMemo(() => {
        let list = [...athletes];
        const f = filters;
        const activeSports = f.sports?.length ? f.sports : (f.sport ? [f.sport] : []);
        if (activeSports.length) list = list.filter(a => activeSports.includes(a.sport));
        if (f.ageGroup) {
            const ageMap = { 'U-12': [0, 12], 'U-14': [12, 14], 'U-16': [14, 16], 'U-18': [16, 18], 'U-21': [18, 21] };
            const range = ageMap[f.ageGroup];
            if (range) list = list.filter(a => a.age >= range[0] && a.age < range[1]);
        }
        if (f.gender) list = list.filter(a => a.gender === f.gender);
        if (f.district) list = list.filter(a => a.district?.toLowerCase() === f.district?.toLowerCase());
        if (f.minRating > 1000) list = list.filter(a => (a.talentRating || 0) >= f.minRating);
        if (f.verifiedOnly) list = list.filter(a => a.attestations?.length >= 3 || a.syncStatus === 'synced');

        // District view: show only selected or first available district
        if (viewMode === 'district' && !f.district) {
            const dists = [...new Set(list.map(a => a.district).filter(Boolean))];
            if (dists.length) list = list.filter(a => a.district === dists[0]);
        }

        // Sort
        list.sort((a, b) => {
            let va, vb;
            switch (sortCol) {
                case 'name': va = a.name; vb = b.name; break;
                case 'age': va = a.age; vb = b.age; break;
                case 'mental': va = a.mentalScore || 0; vb = b.mentalScore || 0; break;
                default: va = a.talentRating || 0; vb = b.talentRating || 0;
            }
            if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
            return sortDir === 'asc' ? va - vb : vb - va;
        });
        return list;
    }, [athletes, filters, sortCol, sortDir, viewMode]);

    const SortIcon = ({ col }) => {
        if (sortCol !== col) return <ChevronDown size={11} style={{ opacity: 0.25 }} />;
        return sortDir === 'desc' ? <ChevronDown size={11} /> : <ChevronUp size={11} />;
    };

    const getRankStyle = (rank) => {
        if (rank === 1) return { background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#1a1a1a', fontWeight: 800, boxShadow: '0 0 12px rgba(251,191,36,0.3)' };
        if (rank === 2) return { background: 'linear-gradient(135deg, #9ca3af, #d1d5db)', color: '#1a1a1a', fontWeight: 700 };
        if (rank === 3) return { background: 'linear-gradient(135deg, #b45309, #d97706)', color: 'white', fontWeight: 700 };
        return {};
    };

    // Simulated trend (random per athlete - deterministic based on name hash)
    const getTrend = (name) => {
        const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        return hash % 3 === 0 ? 'down' : 'up';
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-md" style={{ flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                <h3 className="heading-4 flex items-center gap-sm">
                    <Trophy size={20} color="var(--accent-warning)" />
                    Talent Rankings
                </h3>
                <div className="flex items-center gap-sm">
                    {/* View Mode Toggle */}
                    <div className="flex flex-wrap" style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <button onClick={() => setViewMode('statewide')} style={{
                            padding: '5px 12px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', border: 'none',
                            background: viewMode === 'statewide' ? 'var(--accent-primary)' : 'transparent',
                            color: viewMode === 'statewide' ? 'white' : 'var(--text-secondary)', transition: 'all 0.2s',
                            minHeight: 48, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>Statewide</button>
                        <button onClick={() => setViewMode('district')} style={{
                            padding: '5px 12px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', border: 'none',
                            background: viewMode === 'district' ? 'var(--accent-primary)' : 'transparent',
                            color: viewMode === 'district' ? 'white' : 'var(--text-secondary)', transition: 'all 0.2s',
                            minHeight: 48, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <MapPin size={11} style={{ marginRight: 4 }} />
                            District
                        </button>
                    </div>
                    <span className="badge badge-verified" style={{ fontSize: '0.68rem', minHeight: 28, display: 'flex', alignItems: 'center' }}>
                        {filtered.length} ATHLETES
                    </span>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="table-container desktop-table">
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ width: 50 }}>#</th>
                            <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer', minHeight: 48 }}>
                                <span className="flex items-center gap-xs">NAME <SortIcon col="name" /></span>
                            </th>
                            <th onClick={() => toggleSort('age')} style={{ cursor: 'pointer', width: 60, minHeight: 48 }}>
                                <span className="flex items-center gap-xs">AGE <SortIcon col="age" /></span>
                            </th>
                            <th>SPORT</th>
                            <th>DISTRICT</th>
                            <th onClick={() => toggleSort('rating')} style={{ cursor: 'pointer', minHeight: 48 }}>
                                <span className="flex items-center gap-xs">RATING <SortIcon col="rating" /></span>
                            </th>
                            <th onClick={() => toggleSort('mental')} style={{ cursor: 'pointer', width: 80, minHeight: 48 }}>
                                <span className="flex items-center gap-xs">MENTAL <SortIcon col="mental" /></span>
                            </th>
                            <th style={{ width: 60 }}>TREND</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((a, i) => {
                            const rank = i + 1;
                            const tier = getRatingTier(a.talentRating || 1000);
                            const trend = getTrend(a.name);
                            const verified = a.attestations?.length >= 3 || a.syncStatus === 'synced';
                            return (
                                <tr key={a.id} onClick={() => navigate(`/profile/${a.id}`)}
                                    style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.06)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td>
                                        <span style={{
                                            display: 'inline-flex', width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                                            alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem',
                                            ...getRankStyle(rank),
                                        }}>{rank}</span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-sm" style={{ minHeight: 48 }}>
                                            <div style={{
                                                width: 32, height: 32, borderRadius: 'var(--radius-full)', background: 'var(--gradient-hero)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                                            }}>
                                                {a.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{a.name}</div>
                                                {a.nameTamil && <div className="tamil text-muted" style={{ fontSize: '0.65rem' }}>{a.nameTamil}</div>}
                                            </div>
                                            {verified && <CheckCircle size={13} color="var(--accent-success)" style={{ flexShrink: 0 }} />}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.85rem' }}>{a.age}</div>
                                        <div className="text-muted" style={{ fontSize: '0.65rem' }}>{getAgeGroup(a.age)}</div>
                                    </td>
                                    <td style={{ fontSize: '0.82rem' }}>{a.sport?.replace(/_/g, ' ')}</td>
                                    <td style={{ fontSize: '0.82rem' }}>{a.district}</td>
                                    <td>
                                        <span className={`badge ${tier.class}`} style={{ fontSize: '0.68rem', padding: '4px 8px' }}>
                                            {a.talentRating || 1000}
                                        </span>
                                        <span className="text-muted" style={{ fontSize: '0.62rem', marginLeft: 4 }}>{tier.name}</span>
                                    </td>
                                    <td>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600 }}>
                                            {a.mentalScore || '—'}
                                        </span>
                                    </td>
                                    <td>
                                        {trend === 'up' ? (
                                            <span className="flex items-center gap-xs" style={{ color: 'var(--accent-success)', fontSize: '0.75rem', fontWeight: 600 }}>
                                                <TrendingUp size={14} /> +{Math.floor(Math.random() * 50 + 10)}
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-xs" style={{ color: 'var(--accent-danger)', fontSize: '0.75rem', fontWeight: 600 }}>
                                                <TrendingDown size={14} /> -{Math.floor(Math.random() * 20 + 5)}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="mobile-cards" style={{ display: 'none' }}>
                {filtered.map((a, i) => {
                    const tier = getRatingTier(a.talentRating || 1000);
                    const trend = getTrend(a.name);
                    return (
                        <div key={a.id} className="glass-card mb-sm" style={{ padding: '12px', minHeight: 64 }}
                            onClick={() => navigate(`/profile/${a.id}`)}>
                            <div className="flex items-center gap-sm">
                                <span style={{
                                    display: 'inline-flex', width: 26, height: 26, borderRadius: 'var(--radius-sm)',
                                    alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0,
                                    ...getRankStyle(i + 1),
                                }}>{i + 1}</span>
                                <div style={{
                                    width: 34, height: 34, borderRadius: 'var(--radius-full)', background: 'var(--gradient-hero)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700,
                                }}>
                                    {a.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{a.name}</div>
                                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>{a.sport?.replace(/_/g, ' ')} · {a.district}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className={`badge ${tier.class}`} style={{ fontSize: '0.65rem' }}>{a.talentRating}</span>
                                    <div style={{ fontSize: '0.7rem', marginTop: 2, color: trend === 'up' ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                                        {trend === 'up' ? '↑' : '↓'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
        @media (max-width: 768px) {
          .desktop-table { display: none !important; }
          .mobile-cards { display: block !important; }
        }
      `}</style>
        </div>
    );
}
