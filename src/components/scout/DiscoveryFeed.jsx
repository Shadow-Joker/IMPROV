import { useState, useEffect, useMemo } from 'react';
import { Radio, CheckCircle, Clock, TrendingUp, Eye, Star, Send, Loader } from 'lucide-react';
import { getAllAthletes, getAllAssessments } from '../../utils/demoLoader';
import { getRatingTier } from '../../utils/dataShapes';

function timeAgo(ts) {
    const d = Date.now() - ts;
    const m = Math.floor(d / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

function buildFeedEntries(athletes, assessments) {
    const entries = [];
    const now = Date.now();
    const tests = ['60m_sprint', '30m_sprint', '600m_run', 'standing_broad_jump', 'vertical_jump'];
    const units = { '60m_sprint': 's', '30m_sprint': 's', '600m_run': 's', 'standing_broad_jump': 'cm', 'vertical_jump': 'cm' };

    // Real assessments
    assessments.forEach((a, i) => {
        const ath = athletes.find(x => x.id === a.athleteId);
        if (ath) {
            entries.push({
                id: `r-${i}`, name: ath.name, nameTamil: ath.nameTamil || '', age: ath.age,
                sport: a.sport || ath.sport, testType: a.testType, value: a.value,
                unit: a.unit || '', percentile: a.percentile || 75, district: ath.district,
                verified: (a.attestations?.length >= 3) || ath.syncStatus === 'synced',
                timestamp: now - (i * 40 + 2) * 60000, talentRating: ath.talentRating,
                mentalScore: ath.mentalScore, initials: ath.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                isRecent: i < 3,
            });
        }
    });

    // Synthetic
    const names = ['Vijay M.', 'Deepa R.', 'Kumaran S.', 'Meena K.', 'Ashwin P.',
        'Kavitha D.', 'Senthil V.', 'Nithya B.', 'Balaji T.', 'Suganya L.',
        'Manoj K.', 'Revathi S.', 'Dinesh R.', 'Pavithra M.', 'Gowtham A.'];
    const dists = ['Dharmapuri', 'Tirunelveli', 'Salem', 'Madurai', 'Coimbatore', 'Thanjavur', 'Erode', 'Vellore'];
    const sports = ['Athletics_Track', 'Cricket', 'Kabaddi', 'Football', 'Badminton', 'Wrestling', 'Hockey'];

    for (let i = 0; i < 15; i++) {
        const test = tests[i % tests.length];
        const isTime = test.includes('sprint') || test.includes('run');
        let value;
        if (test === '60m_sprint') value = (7 + Math.random() * 3).toFixed(1);
        else if (test === '30m_sprint') value = (4 + Math.random() * 2).toFixed(1);
        else if (test === '600m_run') value = (90 + Math.random() * 60).toFixed(0);
        else value = (140 + Math.random() * 100).toFixed(0);

        const pctl = Math.floor(50 + Math.random() * 45);
        entries.push({
            id: `s-${i}`, name: names[i], nameTamil: '', age: 12 + Math.floor(Math.random() * 8),
            sport: sports[i % sports.length], testType: test, value: parseFloat(value),
            unit: units[test], percentile: pctl, district: dists[i % dists.length],
            verified: Math.random() > 0.3, timestamp: now - (10 + i * 50 + Math.random() * 30) * 60000,
            talentRating: 1000 + Math.floor(Math.random() * 1200), mentalScore: Math.floor(50 + Math.random() * 45),
            initials: names[i].split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
            isRecent: false,
        });
    }

    return entries.sort((a, b) => b.timestamp - a.timestamp);
}

const PAGE_SIZE = 6;

export default function DiscoveryFeed() {
    const [allEntries, setAllEntries] = useState([]);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [loading, setLoading] = useState(false);
    const [shortlisted, setShortlisted] = useState(() => {
        try { return JSON.parse(localStorage.getItem('sentrak_shortlist') || '[]'); } catch { return []; }
    });

    useEffect(() => {
        const ath = getAllAthletes();
        const ass = getAllAssessments();
        setAllEntries(buildFeedEntries(ath, ass));
    }, []);

    const visible = allEntries.slice(0, visibleCount);
    const hasMore = visibleCount < allEntries.length;

    const loadMore = () => {
        setLoading(true);
        setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + PAGE_SIZE, allEntries.length));
            setLoading(false);
        }, 400);
    };

    const toggleShortlist = (id) => {
        const next = shortlisted.includes(id) ? shortlisted.filter(x => x !== id) : [...shortlisted, id];
        setShortlisted(next);
        localStorage.setItem('sentrak_shortlist', JSON.stringify(next));
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-md">
                <h3 className="heading-4 flex items-center gap-sm">
                    <Radio size={20} color="var(--accent-success)" style={{ animation: 'pulse 2s infinite' }} />
                    Discovery Feed
                </h3>
                <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>{allEntries.length} events</span>
            </div>

            <div className="flex-col" style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                {visible.map((entry, i) => {
                    const tier = getRatingTier(entry.talentRating || 1000);
                    const isStarred = shortlisted.includes(entry.id);
                    return (
                        <div key={entry.id} className="glass-card animate-slide-up" style={{
                            padding: '14px 16px', animationDelay: `${Math.min(i * 0.04, 0.4)}s`, opacity: 0,
                            transition: 'all 0.2s',
                        }}>
                            <div className="flex gap-sm" style={{ alignItems: 'flex-start' }}>
                                {/* Avatar */}
                                <div style={{ position: 'relative', flexShrink: 0 }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 'var(--radius-full)',
                                        background: 'var(--gradient-hero)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700,
                                    }}>
                                        {entry.initials}
                                    </div>
                                    {/* Sport badge */}
                                    <div style={{
                                        position: 'absolute', bottom: -3, right: -3, width: 18, height: 18,
                                        borderRadius: '50%', background: 'var(--bg-card)', border: '2px solid var(--bg-primary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem',
                                    }}>
                                        {entry.sport === 'Cricket' ? '🏏' : entry.sport === 'Football' ? '⚽' :
                                            entry.sport === 'Kabaddi' ? '🤼' : entry.sport?.includes('Track') ? '🏃' :
                                                entry.sport === 'Badminton' ? '🏸' : entry.sport === 'Wrestling' ? '🤼' :
                                                    entry.sport === 'Hockey' ? '🏑' : entry.sport === 'Boxing' ? '🥊' : '🏅'}
                                    </div>
                                    {/* "New" pulsing dot */}
                                    {entry.isRecent && (
                                        <div style={{
                                            position: 'absolute', top: -2, right: -2, width: 10, height: 10,
                                            borderRadius: '50%', background: 'var(--accent-success)',
                                            border: '2px solid var(--bg-card)', animation: 'pulse 1.5s infinite',
                                        }} />
                                    )}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>
                                        <span style={{ fontWeight: 700 }}>{entry.name}</span>
                                        <span className="text-secondary">, {entry.age}, </span>
                                        <span style={{ fontWeight: 600, color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                                            {entry.value}{entry.unit}
                                        </span>
                                        <span className="text-secondary"> {entry.testType.replace(/_/g, ' ')}</span>
                                    </div>
                                    <div className="flex items-center gap-sm" style={{ marginTop: 4, flexWrap: 'wrap' }}>
                                        <span className={`badge ${tier.class}`} style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                                            {entry.talentRating} {tier.name}
                                        </span>
                                        <span className="flex items-center gap-xs" style={{
                                            fontSize: '0.72rem', fontWeight: 600,
                                            color: entry.percentile >= 80 ? 'var(--accent-success)' : entry.percentile >= 60 ? 'var(--accent-warning)' : 'var(--text-secondary)',
                                        }}>
                                            <TrendingUp size={11} /> {entry.percentile}th
                                        </span>
                                        {entry.verified && (
                                            <span className="flex items-center gap-xs" style={{ fontSize: '0.72rem', color: 'var(--accent-success)' }}>
                                                <CheckCircle size={11} /> Verified
                                            </span>
                                        )}
                                        <span className="text-muted" style={{ fontSize: '0.65rem', marginLeft: 'auto' }}>
                                            <Clock size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />
                                            {timeAgo(entry.timestamp)}
                                        </span>
                                    </div>
                                </div>

                                {/* Quick actions */}
                                <div className="flex-col" style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                                    <button className="btn btn-ghost" title="View Passport"
                                        style={{ width: 30, height: 30, padding: 0, minHeight: 'auto', borderRadius: 'var(--radius-sm)' }}>
                                        <Eye size={14} />
                                    </button>
                                    <button className={`btn ${isStarred ? 'btn-primary' : 'btn-ghost'}`} title="Shortlist"
                                        onClick={() => toggleShortlist(entry.id)}
                                        style={{ width: 30, height: 30, padding: 0, minHeight: 'auto', borderRadius: 'var(--radius-sm)' }}>
                                        <Star size={14} fill={isStarred ? 'currentColor' : 'none'} />
                                    </button>
                                    <button className="btn btn-ghost" title="Send Offer"
                                        style={{ width: 30, height: 30, padding: 0, minHeight: 'auto', borderRadius: 'var(--radius-sm)' }}>
                                        <Send size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Load More */}
            {hasMore && (
                <div className="text-center mt-md">
                    <button className="btn btn-ghost" onClick={loadMore} disabled={loading}
                        style={{ padding: '8px 24px', fontSize: '0.85rem', minHeight: 40 }}>
                        {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Loading...</> : 'Load More'}
                    </button>
                </div>
            )}

            {!hasMore && visible.length > 0 && (
                <div className="text-center mt-md text-muted" style={{ fontSize: '0.8rem' }}>End of feed</div>
            )}

            <style>{`
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
        @keyframes spin { to { transform:rotate(360deg) } }
      `}</style>
        </div>
    );
}
