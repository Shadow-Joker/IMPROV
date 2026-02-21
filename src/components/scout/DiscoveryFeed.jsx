import { useState, useEffect, useRef, useMemo } from 'react';
import { Radio, CheckCircle, Clock, TrendingUp, Pause, Play } from 'lucide-react';
import { DEMO_ATHLETES, DEMO_ASSESSMENTS, getRatingTier } from '../../utils/dataShapes';
import { calculatePercentile, loadBenchmarks } from '../../utils/talentScoring';

function timeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

// Generate realistic feed entries from demo data
function generateFeedEntries() {
    const entries = [];
    const now = Date.now();
    const sports = ['Athletics_Track', 'Cricket', 'Kabaddi', 'Football', 'Badminton', 'Wrestling', 'Hockey', 'Boxing', 'Archery'];
    const tests = ['60m_sprint', '30m_sprint', '600m_run', 'standing_broad_jump', 'vertical_jump'];
    const units = { '60m_sprint': 's', '30m_sprint': 's', '600m_run': 's', 'standing_broad_jump': 'cm', 'vertical_jump': 'cm' };
    const districts = ['Dharmapuri', 'Tirunelveli', 'Salem', 'Madurai', 'Coimbatore', 'Thanjavur', 'Chennai', 'Erode', 'Vellore', 'Dindigul'];

    // Seed from real assessments
    DEMO_ASSESSMENTS.forEach((assess, i) => {
        const athlete = DEMO_ATHLETES.find(a => a.id === assess.athleteId);
        if (athlete) {
            entries.push({
                id: `feed-real-${i}`,
                athleteName: athlete.name,
                age: athlete.age,
                sport: assess.sport,
                testType: assess.testType,
                value: assess.value,
                unit: assess.unit,
                percentile: assess.percentile,
                district: athlete.district,
                verified: assess.attestations?.length >= 3,
                timestamp: now - (i * 45 + 2) * 60000,
                initials: athlete.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
            });
        }
    });

    // Generate additional synthetic entries
    const names = [
        'Vijay M.', 'Deepa R.', 'Kumaran S.', 'Meena K.', 'Ashwin P.',
        'Kavitha D.', 'Senthil V.', 'Nithya B.', 'Balaji T.', 'Suganya L.',
        'Manoj K.', 'Revathi S.', 'Dinesh R.', 'Pavithra M.', 'Gowtham A.',
    ];

    for (let i = 0; i < 15; i++) {
        const test = tests[Math.floor(Math.random() * tests.length)];
        const isTimeBased = test.includes('sprint') || test.includes('run');
        let value;
        if (test === '60m_sprint') value = (7.0 + Math.random() * 3.0).toFixed(1);
        else if (test === '30m_sprint') value = (4.0 + Math.random() * 2.0).toFixed(1);
        else if (test === '600m_run') value = (90 + Math.random() * 60).toFixed(0);
        else if (test === 'standing_broad_jump') value = (140 + Math.random() * 100).toFixed(0);
        else value = (20 + Math.random() * 40).toFixed(0);

        entries.push({
            id: `feed-syn-${i}`,
            athleteName: names[i % names.length],
            age: 12 + Math.floor(Math.random() * 8),
            sport: sports[Math.floor(Math.random() * sports.length)],
            testType: test,
            value: parseFloat(value),
            unit: units[test] || '',
            percentile: Math.floor(50 + Math.random() * 45),
            district: districts[Math.floor(Math.random() * districts.length)],
            verified: Math.random() > 0.3,
            timestamp: now - (5 + i * 55 + Math.floor(Math.random() * 30)) * 60000,
            initials: names[i % names.length].split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        });
    }

    return entries.sort((a, b) => b.timestamp - a.timestamp);
}

export default function DiscoveryFeed() {
    const [entries, setEntries] = useState([]);
    const [isPaused, setIsPaused] = useState(false);
    const containerRef = useRef(null);
    const animRef = useRef(null);
    const offsetRef = useRef(0);

    useEffect(() => {
        setEntries(generateFeedEntries());
    }, []);

    // Auto-scroll animation
    useEffect(() => {
        if (!containerRef.current || isPaused || entries.length === 0) return;

        let lastTime = performance.now();
        const speed = 0.3; // px per frame

        const animate = (time) => {
            const delta = time - lastTime;
            lastTime = time;
            offsetRef.current += speed * (delta / 16);

            const container = containerRef.current;
            if (container) {
                container.scrollTop = offsetRef.current;
                if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
                    offsetRef.current = 0;
                }
            }
            animRef.current = requestAnimationFrame(animate);
        };

        animRef.current = requestAnimationFrame(animate);
        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [isPaused, entries]);

    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-md">
                <h3 className="heading-4 flex items-center gap-sm">
                    <Radio size={20} color="var(--accent-success)" className="animate-pulse" />
                    Live Discovery Feed
                </h3>
                <div className="flex items-center gap-sm">
                    <button
                        className="btn btn-ghost"
                        onClick={() => setIsPaused(!isPaused)}
                        style={{ padding: '4px 10px', minHeight: 'auto', fontSize: '0.75rem' }}
                    >
                        {isPaused ? <Play size={14} /> : <Pause size={14} />}
                        {isPaused ? 'Resume' : 'Pause'}
                    </button>
                    <span className="badge badge-verified">{entries.length} events</span>
                </div>
            </div>

            <div
                ref={containerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    maxHeight: 500,
                    overflowY: 'auto',
                    scrollBehavior: isPaused ? 'smooth' : 'auto',
                }}
            >
                <div className="flex-col gap-sm" style={{ display: 'flex' }}>
                    {entries.map((entry, i) => (
                        <div
                            key={entry.id}
                            className="glass-card animate-slide-up"
                            style={{
                                padding: '12px 16px',
                                animationDelay: `${Math.min(i * 0.05, 0.5)}s`,
                                opacity: 0,
                            }}
                        >
                            <div className="flex items-center gap-sm">
                                {/* Avatar */}
                                <div style={{
                                    width: 40, height: 40, minWidth: 40, borderRadius: 'var(--radius-full)',
                                    background: 'var(--gradient-hero)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.75rem', fontWeight: 700,
                                }}>
                                    {entry.initials}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                                        <span style={{ fontWeight: 700 }}>{entry.athleteName}</span>
                                        <span className="text-secondary">, {entry.age}, recorded </span>
                                        <span style={{ fontWeight: 600, color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>
                                            {entry.value}{entry.unit}
                                        </span>
                                        <span className="text-secondary"> {entry.testType.replace(/_/g, ' ')} in </span>
                                        <span style={{ fontWeight: 600 }}>{entry.district}</span>
                                    </div>
                                    <div className="flex items-center gap-sm" style={{ marginTop: 4 }}>
                                        <span className="flex items-center gap-xs" style={{
                                            fontSize: '0.75rem', fontWeight: 700,
                                            color: entry.percentile >= 80 ? 'var(--accent-success)' : entry.percentile >= 60 ? 'var(--accent-warning)' : 'var(--text-secondary)',
                                        }}>
                                            <TrendingUp size={12} /> {entry.percentile}th Percentile
                                        </span>
                                        {entry.verified && (
                                            <span className="flex items-center gap-xs" style={{ fontSize: '0.75rem', color: 'var(--accent-success)' }}>
                                                <CheckCircle size={12} /> Verified
                                            </span>
                                        )}
                                        <span className="flex items-center gap-xs text-muted" style={{ fontSize: '0.7rem', marginLeft: 'auto' }}>
                                            <Clock size={11} /> {timeAgo(entry.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
