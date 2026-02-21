/* ========================================
   SENTRAK — MentalRadarChart Component
   5-axis SVG spider chart (no library)
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

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 110;
const MAX_VALUE = 5;
const LEVELS = 5;

function polarToCartesian(angle, radius) {
    // Start from top (-90°)
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

export default function MentalRadarChart({ profile = {}, score = 0, language = 'en' }) {
    const [animProgress, setAnimProgress] = useState(0);

    // Animate polygon growing from center on mount
    useEffect(() => {
        let frame;
        let start = null;
        const duration = 800;

        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            // Easing: ease-out cubic
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

    // Grid levels
    const gridLevels = Array.from({ length: LEVELS }, (_, i) => i + 1);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)' }}>
            <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ maxWidth: '100%' }}>
                <defs>
                    <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity="0.2" />
                    </linearGradient>
                    <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--accent-primary)" />
                        <stop offset="100%" stopColor="var(--accent-secondary)" />
                    </linearGradient>
                </defs>

                {/* Grid levels */}
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
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Axis lines */}
                {DIMENSIONS.map((_, i) => {
                    const angle = (360 / DIMENSIONS.length) * i;
                    const { x, y } = polarToCartesian(angle, RADIUS);
                    return (
                        <line
                            key={i}
                            x1={CENTER}
                            y1={CENTER}
                            x2={x}
                            y2={y}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data polygon */}
                <polygon
                    points={getPolygonPoints(values)}
                    fill="url(#radarFill)"
                    stroke="url(#radarStroke)"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                />

                {/* Data points */}
                {values.map((val, i) => {
                    const angle = (360 / DIMENSIONS.length) * i;
                    const r = (val / MAX_VALUE) * RADIUS;
                    const { x, y } = polarToCartesian(angle, r);
                    return (
                        <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="var(--accent-primary)"
                            stroke="white"
                            strokeWidth="2"
                        />
                    );
                })}

                {/* Labels */}
                {DIMENSIONS.map((dim, i) => {
                    const angle = (360 / DIMENSIONS.length) * i;
                    const { x, y } = polarToCartesian(angle, RADIUS + 28);
                    const labelObj = LABELS[dim];
                    const label = language === 'ta' ? labelObj.ta : labelObj.en;
                    return (
                        <text
                            key={dim}
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="var(--text-secondary)"
                            fontSize="11"
                            fontWeight="600"
                            fontFamily="var(--font-primary)"
                        >
                            {label}
                        </text>
                    );
                })}

                {/* Value labels near data points */}
                {fullValues.map((val, i) => {
                    const angle = (360 / DIMENSIONS.length) * i;
                    const r = (val / MAX_VALUE) * RADIUS + 14;
                    const { x, y } = polarToCartesian(angle, r);
                    return (
                        <text
                            key={`val-${i}`}
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="var(--accent-primary)"
                            fontSize="10"
                            fontWeight="700"
                        >
                            {val > 0 ? val.toFixed(1) : ''}
                        </text>
                    );
                })}

                {/* Center score */}
                <text
                    x={CENTER}
                    y={CENTER - 6}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="var(--text-primary)"
                    fontSize="22"
                    fontWeight="800"
                >
                    {score}
                </text>
                <text
                    x={CENTER}
                    y={CENTER + 14}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="var(--text-muted)"
                    fontSize="9"
                    fontWeight="600"
                    letterSpacing="0.1em"
                >
                    SCORE
                </text>
            </svg>

            {/* Dimension breakdown */}
            <div className="flex flex-wrap justify-center gap-sm" style={{ maxWidth: '400px' }}>
                {DIMENSIONS.map((dim) => (
                    <div
                        key={dim}
                        className="flex items-center gap-xs"
                        style={{
                            padding: '4px 10px',
                            background: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                        }}
                    >
                        <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                            {(profile[dim] || 0).toFixed(1)}
                        </span>
                        <span className="text-secondary">
                            {language === 'ta' ? LABELS[dim].ta : LABELS[dim].en}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
