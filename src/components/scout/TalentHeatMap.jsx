import { useState, useMemo, useEffect } from 'react';
import { MapPin, Users, Trophy, TrendingUp, Zap } from 'lucide-react';
import { getAllDistricts } from '../../utils/districts';
import { getRatingTier } from '../../utils/dataShapes';
import { getAllAthletes } from '../../utils/demoLoader';

/* ── hex layout: districts placed in rough TN map shape ── */
const HEX_LAYOUT = [
    { id: 'tiruvallur', row: 0, col: 2 }, { id: 'chennai', row: 0, col: 3 },
    { id: 'vellore', row: 1, col: 0 }, { id: 'tirupattur', row: 1, col: 1 },
    { id: 'ranipet', row: 1, col: 2 }, { id: 'chengalpattu', row: 1, col: 3 },
    { id: 'kanchipuram', row: 1, col: 4 },
    { id: 'krishnagiri', row: 2, col: 0 }, { id: 'dharmapuri', row: 2, col: 1 },
    { id: 'tiruvannamalai', row: 2, col: 2 }, { id: 'villupuram', row: 2, col: 3 },
    { id: 'cuddalore', row: 2, col: 4 },
    { id: 'salem', row: 3, col: 0 }, { id: 'namakkal', row: 3, col: 1 },
    { id: 'perambalur', row: 3, col: 2 }, { id: 'ariyalur', row: 3, col: 3 },
    { id: 'mayiladuthurai', row: 3, col: 4 },
    { id: 'erode', row: 4, col: 0 }, { id: 'karur', row: 4, col: 1 },
    { id: 'tiruchirappalli', row: 4, col: 2 }, { id: 'thanjavur', row: 4, col: 3 },
    { id: 'nagapattinam', row: 4, col: 4 },
    { id: 'nilgiris', row: 5, col: -1 }, { id: 'tiruppur', row: 5, col: 0 },
    { id: 'coimbatore', row: 5, col: 1 }, { id: 'dindigul', row: 5, col: 2 },
    { id: 'sivaganga', row: 5, col: 3 }, { id: 'pudukkottai', row: 5, col: 4 },
    { id: 'theni', row: 6, col: 1 }, { id: 'madurai', row: 6, col: 2 },
    { id: 'virudhunagar', row: 6, col: 3 }, { id: 'ramanathapuram', row: 6, col: 4 },
    { id: 'tenkasi', row: 7, col: 1 }, { id: 'tirunelveli', row: 7, col: 2 },
    { id: 'thoothukudi', row: 7, col: 3 },
    { id: 'kanyakumari', row: 8, col: 2 },
    { id: 'kallakurichi', row: 2.5, col: 4.5 },
];

const HEX_SIZE = 44;
const HEX_GAP = 5;

function hexPoints(cx, cy, size) {
    const pts = [];
    for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        pts.push(`${cx + size * Math.cos(a)},${cy + size * Math.sin(a)}`);
    }
    return pts.join(' ');
}

/* gradient from cool blue → hot purple/pink based on density */
function heatGradient(count, max) {
    if (count === 0) return 'rgba(255,255,255,0.04)';
    const t = Math.min(count / Math.max(max, 1), 1);
    if (t <= 0.25) return `rgba(99,102,241,${0.15 + t * 1.4})`;  // indigo
    if (t <= 0.5) return `rgba(139,92,246,${0.3 + t * 0.8})`;     // violet
    if (t <= 0.75) return `rgba(168,85,247,${0.4 + t * 0.6})`;    // purple
    return `rgba(236,72,153,${0.5 + t * 0.4})`;                   // pink - hottest
}

function heatGlow(count, max) {
    if (count === 0) return 'none';
    const t = Math.min(count / Math.max(max, 1), 1);
    if (t > 0.5) return `drop-shadow(0 0 8px rgba(168,85,247,${t * 0.6}))`;
    return 'none';
}

export default function TalentHeatMap({ athletes: propAthletes }) {
    const [hoveredDistrict, setHovered] = useState(null);
    const [selectedDistrict, setSelected] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const athletes = propAthletes || getAllAthletes();
    const districts = getAllDistricts();

    const { stats, maxCount } = useMemo(() => {
        const s = {};
        districts.forEach(d => { s[d.id] = { count: 0, athletes: [], sports: {}, avgRating: 0 }; });
        athletes.forEach(a => {
            const did = a.district?.toLowerCase().replace(/\s/g, '');
            const match = districts.find(d => d.id === did || d.name.toLowerCase() === a.district?.toLowerCase());
            if (match) {
                s[match.id].count++;
                s[match.id].athletes.push(a);
                s[match.id].sports[a.sport] = (s[match.id].sports[a.sport] || 0) + 1;
            }
        });
        let mx = 0;
        Object.values(s).forEach(v => {
            if (v.count > mx) mx = v.count;
            if (v.athletes.length) v.avgRating = Math.round(v.athletes.reduce((a, b) => a + (b.talentRating || 1000), 0) / v.athletes.length);
        });
        return { stats: s, maxCount: mx };
    }, [athletes, districts]);

    const topSport = (id) => {
        const sp = stats[id]?.sports || {};
        let top = 'N/A', mx = 0;
        Object.entries(sp).forEach(([k, v]) => { if (v > mx) { top = k; mx = v; } });
        return top.replace(/_/g, ' ');
    };

    const handleHover = (id, e) => {
        setHovered(id);
        const rect = e.currentTarget.closest('svg').getBoundingClientRect();
        setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top - 80 });
    };

    const selAthletes = selectedDistrict
        ? (stats[selectedDistrict]?.athletes || []).sort((a, b) => b.talentRating - a.talentRating).slice(0, 5)
        : [];
    const selName = selectedDistrict ? districts.find(d => d.id === selectedDistrict)?.name : '';

    const minCol = Math.min(...HEX_LAYOUT.map(h => h.col));
    const maxCol = Math.max(...HEX_LAYOUT.map(h => h.col));
    const maxRow = Math.max(...HEX_LAYOUT.map(h => h.row));
    const colW = HEX_SIZE * Math.sqrt(3) + HEX_GAP;
    const rowH = HEX_SIZE * 1.5 + HEX_GAP;
    const svgW = (maxCol - minCol + 2) * colW + HEX_SIZE * 2;
    const svgH = (maxRow + 2) * rowH + HEX_SIZE;

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-md">
                <h3 className="heading-4 flex items-center gap-sm">
                    <MapPin size={20} color="var(--accent-primary)" />
                    Talent Heat Map — Tamil Nadu
                </h3>
                <div className="flex items-center gap-md" style={{ fontSize: '0.7rem' }}>
                    <span className="flex items-center gap-xs">
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(99,102,241,0.35)' }} /> Low
                    </span>
                    <span className="flex items-center gap-xs">
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(168,85,247,0.6)' }} /> Mid
                    </span>
                    <span className="flex items-center gap-xs">
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(236,72,153,0.8)' }} /> Hot
                    </span>
                </div>
            </div>

            <div className="glass-card" style={{ padding: 'var(--space-md)', overflow: 'auto' }}>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ maxWidth: '100%', height: 'auto' }}>
                        {/* Ambient glow background */}
                        <defs>
                            <radialGradient id="mapGlow" cx="50%" cy="40%" r="50%">
                                <stop offset="0%" stopColor="rgba(99,102,241,0.08)" />
                                <stop offset="100%" stopColor="transparent" />
                            </radialGradient>
                        </defs>
                        <rect x="0" y="0" width={svgW} height={svgH} fill="url(#mapGlow)" rx="12" />

                        {HEX_LAYOUT.map((hex, idx) => {
                            const dist = districts.find(d => d.id === hex.id);
                            if (!dist) return null;

                            const offX = hex.row % 2 === 0 ? 0 : colW / 2;
                            const cx = (hex.col - minCol + 1) * colW + offX + HEX_SIZE;
                            const cy = (hex.row + 0.5) * rowH + HEX_SIZE;
                            const count = stats[hex.id]?.count || 0;
                            const isHov = hoveredDistrict === hex.id;
                            const isSel = selectedDistrict === hex.id;
                            const delay = mounted ? idx * 40 : 0;

                            return (
                                <g key={hex.id}
                                    onMouseEnter={e => handleHover(hex.id, e)}
                                    onMouseLeave={() => setHovered(null)}
                                    onClick={() => setSelected(selectedDistrict === hex.id ? null : hex.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <polygon
                                        points={hexPoints(cx, cy, HEX_SIZE)}
                                        fill={heatGradient(count, maxCount)}
                                        stroke={isSel ? 'var(--accent-secondary)' : isHov ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.08)'}
                                        strokeWidth={isSel ? 2.5 : isHov ? 2 : 0.8}
                                        style={{
                                            transition: 'all 0.35s cubic-bezier(.4,0,.2,1)',
                                            filter: isHov ? `brightness(1.4) ${heatGlow(count, maxCount)}` : heatGlow(count, maxCount),
                                            transform: isHov ? `scale(1.06)` : 'scale(1)',
                                            transformOrigin: `${cx}px ${cy}px`,
                                            opacity: mounted ? 1 : 0,
                                            animation: mounted ? `fadeIn 0.4s ${delay}ms both` : 'none',
                                        }}
                                    />
                                    <text x={cx} y={cy - 3} textAnchor="middle" fill="var(--text-primary)" fontSize="7.5"
                                        fontWeight="600" fontFamily="var(--font-primary)" style={{ pointerEvents: 'none', opacity: 0.9 }}>
                                        {dist.name.length > 9 ? dist.name.slice(0, 8) + '…' : dist.name}
                                    </text>
                                    {count > 0 && (
                                        <text x={cx} y={cy + 11} textAnchor="middle" fill="var(--accent-secondary)" fontSize="10"
                                            fontWeight="800" fontFamily="var(--font-mono)" style={{ pointerEvents: 'none' }}>
                                            {count}
                                        </text>
                                    )}
                                </g>
                            );
                        })}
                    </svg>

                    {/* Glassmorphic tooltip */}
                    {hoveredDistrict && (
                        <div style={{
                            position: 'absolute', left: tooltipPos.x, top: tooltipPos.y,
                            background: 'rgba(15,20,50,0.92)', backdropFilter: 'blur(24px)',
                            border: '1px solid rgba(139,92,246,0.35)', borderRadius: 'var(--radius-md)',
                            padding: '12px 16px', pointerEvents: 'none', zIndex: 10, minWidth: 170,
                            boxShadow: '0 8px 32px rgba(139,92,246,0.15)', transform: 'translateX(-50%)',
                        }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, color: 'var(--text-primary)' }}>
                                {districts.find(d => d.id === hoveredDistrict)?.name}
                                <span className="tamil" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 6 }}>
                                    {districts.find(d => d.id === hoveredDistrict)?.nameTamil}
                                </span>
                            </div>
                            <div className="flex items-center gap-xs" style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)', fontWeight: 600, marginBottom: 3 }}>
                                <Users size={13} /> {stats[hoveredDistrict]?.count || 0} athletes
                            </div>
                            <div className="flex items-center gap-xs" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                <Trophy size={13} /> Top: {topSport(hoveredDistrict)}
                            </div>
                            {stats[hoveredDistrict]?.avgRating > 0 && (
                                <div className="flex items-center gap-xs" style={{ fontSize: '0.78rem', color: 'var(--accent-warning)', marginTop: 3 }}>
                                    <Zap size={13} /> Avg Rating: {stats[hoveredDistrict].avgRating}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Selected district athletes */}
            {selectedDistrict && selAthletes.length > 0 && (
                <div className="glass-card mt-md animate-slide-up" style={{ padding: 'var(--space-md)' }}>
                    <h4 className="heading-4 mb-sm flex items-center gap-sm">
                        <TrendingUp size={16} color="var(--accent-secondary)" />
                        Top Athletes in {selName}
                    </h4>
                    <div className="grid grid-3" style={{ gap: 'var(--space-sm)' }}>
                        {selAthletes.map((a) => {
                            const tier = getRatingTier(a.talentRating);
                            return (
                                <div key={a.id} className="glass-card" style={{ padding: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                    <div className="flex items-center gap-sm">
                                        <div style={{
                                            width: 34, height: 34, borderRadius: 'var(--radius-full)',
                                            background: 'var(--gradient-hero)', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700,
                                        }}>
                                            {a.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div>
                                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>{a.sport?.replace(/_/g, ' ')} · Age {a.age}</div>
                                        </div>
                                        <span className={`badge ${tier.class}`} style={{ fontSize: '0.65rem', marginLeft: 'auto' }}>{a.talentRating}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @media (max-width: 768px) {
          .grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}
