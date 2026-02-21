import { useState, useMemo } from 'react';
import { MapPin, Users, Trophy } from 'lucide-react';
import { getAllDistricts } from '../../utils/districts';
import { getRatingTier } from '../../utils/dataShapes';

// Hex grid layout arranged roughly in TN's shape
// Row/col positions map districts to approximate geographic positions
const HEX_LAYOUT = [
    // Row 0 (North) - Tiruvallur, Chennai area
    { id: 'tiruvallur', row: 0, col: 2 }, { id: 'chennai', row: 0, col: 3 },
    // Row 1
    { id: 'vellore', row: 1, col: 0 }, { id: 'tirupattur', row: 1, col: 1 }, { id: 'ranipet', row: 1, col: 2 }, { id: 'chengalpattu', row: 1, col: 3 }, { id: 'kanchipuram', row: 1, col: 4 },
    // Row 2
    { id: 'krishnagiri', row: 2, col: 0 }, { id: 'dharmapuri', row: 2, col: 1 }, { id: 'tiruvannamalai', row: 2, col: 2 }, { id: 'villupuram', row: 2, col: 3 }, { id: 'cuddalore', row: 2, col: 4 },
    // Row 3
    { id: 'salem', row: 3, col: 0 }, { id: 'namakkal', row: 3, col: 1 }, { id: 'perambalur', row: 3, col: 2 }, { id: 'ariyalur', row: 3, col: 3 }, { id: 'mayiladuthurai', row: 3, col: 4 },
    // Row 4
    { id: 'erode', row: 4, col: 0 }, { id: 'karur', row: 4, col: 1 }, { id: 'tiruchirappalli', row: 4, col: 2 }, { id: 'thanjavur', row: 4, col: 3 }, { id: 'nagapattinam', row: 4, col: 4 },
    // Row 5
    { id: 'nilgiris', row: 5, col: -1 }, { id: 'tiruppur', row: 5, col: 0 }, { id: 'coimbatore', row: 5, col: 1 }, { id: 'dindigul', row: 5, col: 2 }, { id: 'sivaganga', row: 5, col: 3 }, { id: 'pudukkottai', row: 5, col: 4 },
    // Row 6
    { id: 'theni', row: 6, col: 1 }, { id: 'madurai', row: 6, col: 2 }, { id: 'virudhunagar', row: 6, col: 3 }, { id: 'ramanathapuram', row: 6, col: 4 },
    // Row 7
    { id: 'tenkasi', row: 7, col: 1 }, { id: 'tirunelveli', row: 7, col: 2 }, { id: 'thoothukudi', row: 7, col: 3 },
    // Row 8 (South)
    { id: 'kanyakumari', row: 8, col: 2 },
    // Row 2.5 — Kallakurichi
    { id: 'kallakurichi', row: 2.5, col: 4.5 },
];

const HEX_SIZE = 48;
const HEX_GAP = 4;

function getHexPoints(cx, cy, size) {
    const points = [];
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        points.push(`${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`);
    }
    return points.join(' ');
}

function getHeatColor(count) {
    if (count === 0) return 'rgba(255,255,255,0.05)';
    if (count <= 3) return 'rgba(99,102,241,0.3)';
    if (count <= 7) return 'rgba(99,102,241,0.5)';
    return 'rgba(99,102,241,0.8)';
}

export default function TalentHeatMap({ athletes = [] }) {
    const [hoveredDistrict, setHoveredDistrict] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const districts = getAllDistricts();

    const districtStats = useMemo(() => {
        const stats = {};
        districts.forEach(d => {
            stats[d.id] = { count: 0, athletes: [], sports: {} };
        });
        athletes.forEach(a => {
            const distId = a.district?.toLowerCase().replace(/\s/g, '');
            const match = districts.find(d =>
                d.id === distId || d.name.toLowerCase() === a.district?.toLowerCase()
            );
            if (match) {
                stats[match.id].count++;
                stats[match.id].athletes.push(a);
                stats[match.id].sports[a.sport] = (stats[match.id].sports[a.sport] || 0) + 1;
            }
        });
        return stats;
    }, [athletes, districts]);

    const getTopSport = (distId) => {
        const sportCounts = districtStats[distId]?.sports || {};
        let topSport = 'N/A';
        let maxCount = 0;
        Object.entries(sportCounts).forEach(([sport, count]) => {
            if (count > maxCount) { topSport = sport; maxCount = count; }
        });
        return topSport.replace(/_/g, ' ');
    };

    const handleHover = (distId, e) => {
        setHoveredDistrict(distId);
        const rect = e.currentTarget.closest('svg').getBoundingClientRect();
        setTooltipPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top - 60,
        });
    };

    const selectedAthletes = selectedDistrict
        ? (districtStats[selectedDistrict]?.athletes || [])
            .sort((a, b) => b.talentRating - a.talentRating)
            .slice(0, 5)
        : [];

    const selectedDistrictName = selectedDistrict
        ? districts.find(d => d.id === selectedDistrict)?.name
        : '';

    // Calculate SVG dimensions
    const minCol = Math.min(...HEX_LAYOUT.map(h => h.col));
    const maxCol = Math.max(...HEX_LAYOUT.map(h => h.col));
    const maxRow = Math.max(...HEX_LAYOUT.map(h => h.row));
    const colWidth = HEX_SIZE * Math.sqrt(3) + HEX_GAP;
    const rowHeight = HEX_SIZE * 1.5 + HEX_GAP;
    const svgWidth = (maxCol - minCol + 2) * colWidth + HEX_SIZE * 2;
    const svgHeight = (maxRow + 2) * rowHeight + HEX_SIZE;

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-md">
                <h3 className="heading-4 flex items-center gap-sm">
                    <MapPin size={20} color="var(--accent-primary)" />
                    Talent Heat Map — Tamil Nadu
                </h3>
                <div className="flex items-center gap-md" style={{ fontSize: '0.75rem' }}>
                    <span className="flex items-center gap-xs">
                        <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(99,102,241,0.3)' }}></span> 1-3
                    </span>
                    <span className="flex items-center gap-xs">
                        <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(99,102,241,0.5)' }}></span> 4-7
                    </span>
                    <span className="flex items-center gap-xs">
                        <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(99,102,241,0.8)' }}></span> 8+
                    </span>
                </div>
            </div>

            <div className="glass-card-static" style={{ padding: 'var(--space-md)', overflow: 'auto' }}>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                    <svg
                        width={svgWidth}
                        height={svgHeight}
                        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                        style={{ maxWidth: '100%', height: 'auto' }}
                    >
                        {HEX_LAYOUT.map(hex => {
                            const dist = districts.find(d => d.id === hex.id);
                            if (!dist) return null;

                            const offsetX = hex.row % 2 === 0 ? 0 : colWidth / 2;
                            const cx = (hex.col - minCol + 1) * colWidth + offsetX + HEX_SIZE;
                            const cy = (hex.row + 0.5) * rowHeight + HEX_SIZE;
                            const count = districtStats[hex.id]?.count || 0;
                            const isHovered = hoveredDistrict === hex.id;
                            const isSelected = selectedDistrict === hex.id;

                            return (
                                <g key={hex.id}
                                    onMouseEnter={e => handleHover(hex.id, e)}
                                    onMouseLeave={() => setHoveredDistrict(null)}
                                    onClick={() => setSelectedDistrict(selectedDistrict === hex.id ? null : hex.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <polygon
                                        points={getHexPoints(cx, cy, HEX_SIZE)}
                                        fill={getHeatColor(count)}
                                        stroke={isSelected ? 'var(--accent-primary)' : isHovered ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)'}
                                        strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                                        style={{
                                            transition: 'all 0.3s ease',
                                            filter: isHovered ? 'brightness(1.3)' : 'none',
                                        }}
                                    />
                                    <text
                                        x={cx} y={cy - 4}
                                        textAnchor="middle"
                                        fill="var(--text-primary)"
                                        fontSize="8"
                                        fontWeight="600"
                                        fontFamily="var(--font-primary)"
                                        style={{ pointerEvents: 'none' }}
                                    >
                                        {dist.name.length > 8 ? dist.name.slice(0, 7) + '…' : dist.name}
                                    </text>
                                    {count > 0 && (
                                        <text
                                            x={cx} y={cy + 12}
                                            textAnchor="middle"
                                            fill="var(--accent-secondary)"
                                            fontSize="10"
                                            fontWeight="700"
                                            fontFamily="var(--font-mono)"
                                            style={{ pointerEvents: 'none' }}
                                        >
                                            {count}
                                        </text>
                                    )}
                                </g>
                            );
                        })}
                    </svg>

                    {/* Tooltip */}
                    {hoveredDistrict && (
                        <div style={{
                            position: 'absolute',
                            left: tooltipPos.x,
                            top: tooltipPos.y,
                            background: 'rgba(17, 22, 56, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(99,102,241,0.3)',
                            borderRadius: 'var(--radius-md)',
                            padding: '10px 14px',
                            pointerEvents: 'none',
                            zIndex: 10,
                            minWidth: 150,
                            boxShadow: 'var(--shadow-lg)',
                            transform: 'translateX(-50%)',
                        }}>
                            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 4 }}>
                                {districts.find(d => d.id === hoveredDistrict)?.name}
                            </div>
                            <div className="flex items-center gap-xs" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                <Users size={12} /> {districtStats[hoveredDistrict]?.count || 0} athletes
                            </div>
                            <div className="flex items-center gap-xs" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                                <Trophy size={12} /> Top: {getTopSport(hoveredDistrict)}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Selected District Athletes */}
            {selectedDistrict && selectedAthletes.length > 0 && (
                <div className="glass-card-static mt-md animate-slide-up" style={{ padding: 'var(--space-md)' }}>
                    <h4 className="heading-4 mb-sm flex items-center gap-sm">
                        <MapPin size={16} color="var(--accent-secondary)" />
                        Top Athletes in {selectedDistrictName}
                    </h4>
                    <div className="grid grid-3">
                        {selectedAthletes.map((a, i) => {
                            const tier = getRatingTier(a.talentRating);
                            return (
                                <div key={a.id} className="glass-card" style={{ padding: 'var(--space-md)' }}>
                                    <div className="flex items-center gap-sm mb-sm">
                                        <div style={{
                                            width: 36, height: 36, borderRadius: 'var(--radius-full)',
                                            background: 'var(--gradient-hero)', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.75rem', fontWeight: 700,
                                        }}>
                                            {a.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.name}</div>
                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Age {a.age} · {a.sport?.replace(/_/g, ' ')}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-xs">
                                        <span className={`badge ${tier.class}`} style={{ fontSize: '0.7rem' }}>{a.talentRating}</span>
                                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>{tier.name}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
