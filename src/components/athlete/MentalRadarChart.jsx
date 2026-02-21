/* ========================================
   SENTRAK — MentalRadarChart Component (Phase 2)
   5-axis SVG spider chart with gradient polygon,
   glow data points, stacked bilingual labels,
   animated mount, and center score display
   Owner: Rahul (feat/athlete)
   ======================================== */

import { useState, useEffect } from 'react';

const DIMENSIONS = ['toughness', 'teamwork', 'drive', 'strategy', 'discipline'];
const LABELS = {
    toughness: { en: 'Toughness', ta: 'மன உறுதி' },
    teamwork: { en: 'Teamwork', ta: 'குழு ஒத்துழைப்பு' },
    drive: { en: 'Drive', ta: 'உந்துதல்' },
    strategy: { en: 'Strategy', ta: 'உத்தி' },
    discipline: { en: 'Discipline', ta: 'ஒழுக்கம்' },
};
const DIM_COLORS = {
    toughness: '#ef4444',
    teamwork: '#3b82f6',
    drive: '#f59e0b',
    strategy: '#10b981',
    discipline: '#8b5cf6',
};

const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = 110;
const MAX_VALUE = 5;
const LEVELS = 5;

function polarToCartesian(angle, radius) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
        x: CENTER + radius * Math.cos(rad),
        y: CENTER + radius * Math.sin(rad),
    };
}

function getPolygonPoints(values) {
    return values
        .map((val, i) => {
            const angle = (360 / values.length) * i;
            const r = (val / MAX_VALUE) * RADIUS;
            const { x, y } = polarToCartesian(angle, r);
            return `${x},${y}`;
        })
        .join(' ');
}

function getScoreColor(score) {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#6366f1';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
}

export default function MentalRadarChart({ profile = {}, score = 0, language = 'en' }) {
    const [animProgress, setAnimProgress] = useState(0);

    useEffect(() => {
        let frame;
        let start = null;
        const duration = 800;

        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimProgress(eased);
            if (progress < 1) {
                frame = requestAnimationFrame(animate);
            }
        };

        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);

    const values = DIMENSIONS.map((d) => (profile[d] || 0) * animProgress);
    const fullValues = DIMENSIONS.map((d) => profile[d] || 0);
    const gridLevels = Array.from({ length: LEVELS }, (_, i) => i + 1);
    const scoreColor = getScoreColor(score);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)' }}>
            <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ maxWidth: '100%' }}>
                <defs>
                    <linearGradient id="radarFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                        <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.15" />
                    </linearGradient>
                    <linearGradient id="radarStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <filter id="pointGlow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={scoreColor} stopOpacity="0.15" />
                        <stop offset="100%" stopColor={scoreColor} stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Background grid levels */}
                {gridLevels.map((level) => {
                    const r = (level / MAX_VALUE) * RADIUS;
                    const points = DIMENSIONS.map((_, i) => {
                        const angle = (360 / DIMENSIONS.length) * i;
                        const { x, y } = polarToCartesian(angle, r);
                        return `${x},${y}`;
                    }).join(' ');
                    return (
                        <polygon
                            key={level}
                            points={points}
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="1"
                            strokeDasharray={level < LEVELS ? "4 4" : "none"}
                        />
                    );
                })}

                {/* Axis lines — dashed */}
                {DIMENSIONS.map((_, i) => {
                    const angle = (360 / DIMENSIONS.length) * i;
                    const { x, y } = polarToCartesian(angle, RADIUS);
                    return (
                        <line
                            key={i}
                            x1={CENTER} y1={CENTER}
                            x2={x} y2={y}
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="1"
                            strokeDasharray="3 5"
                        />
                    );
                })}

                {/* Center glow */}
                <circle cx={CENTER} cy={CENTER} r="40" fill="url(#centerGlow)" />

                {/* Data polygon — gradient fill + stroke */}
                <polygon
                    points={getPolygonPoints(values)}
                    fill="url(#radarFillGrad)"
                    stroke="url(#radarStrokeGrad)"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                />

                {/* Data points with glow */}
                {values.map((val, i) => {
                    const angle = (360 / DIMENSIONS.length) * i;
                    const r = (val / MAX_VALUE) * RADIUS;
                    const { x, y } = polarToCartesian(angle, r);
                    return (
                        <circle
                            key={i}
                            cx={x} cy={y} r="5"
                            fill={DIM_COLORS[DIMENSIONS[i]]}
                            stroke="white"
                            strokeWidth="2"
                            filter="url(#pointGlow)"
                        />
                    );
                })}

                {/* Stacked bilingual labels — EN on top, TA below */}
                {DIMENSIONS.map((dim, i) => {
                    const angle = (360 / DIMENSIONS.length) * i;
                    const { x, y } = polarToCartesian(angle, RADIUS + 30);
                    const labelObj = LABELS[dim];
                    return (
                        <g key={dim}>
                            <text
                                x={x} y={y - 7}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill={DIM_COLORS[dim]}
                                fontSize="10"
                                fontWeight="700"
                                fontFamily="var(--font-primary)"
                            >
                                {labelObj.en}
                            </text>
                            <text
                                x={x} y={y + 7}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="var(--text-muted)"
                                fontSize="9"
                                fontWeight="500"
                            >
                                {labelObj.ta}
                            </text>
                        </g>
                    );
                })}

                {/* Value labels near data points */}
                {fullValues.map((val, i) => {
                    const angle = (360 / DIMENSIONS.length) * i;
                    const r = (val / MAX_VALUE) * RADIUS + 16;
                    const { x, y } = polarToCartesian(angle, r);
                    return (
                        <text
                            key={`val-${i}`}
                            x={x} y={y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={DIM_COLORS[DIMENSIONS[i]]}
                            fontSize="10"
                            fontWeight="800"
                        >
                            {val > 0 ? val.toFixed(1) : ''}
                        </text>
                    );
                })}

                {/* Center score — color-coded */}
                <text
                    x={CENTER} y={CENTER - 6}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={scoreColor}
                    fontSize="24"
                    fontWeight="900"
                >
                    {score}
                </text>
                <text
                    x={CENTER} y={CENTER + 14}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="var(--text-muted)"
                    fontSize="8"
                    fontWeight="700"
                    letterSpacing="0.15em"
                >
                    SCORE
                </text>
            </svg>
        </div>
    );
}
