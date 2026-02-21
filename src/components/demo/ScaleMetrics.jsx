import { useState, useEffect, useRef } from 'react';
import { Users, MapPin, Search, ClipboardCheck, Send, Award, TrendingUp } from 'lucide-react';

function useCountUp(target, duration = 1500, trigger = true) {
    const [value, setValue] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        if (!trigger) return;

        let startTime = null;
        const animate = (now) => {
            if (!startTime) startTime = now;
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));

            if (progress < 1) {
                ref.current = requestAnimationFrame(animate);
            }
        };

        ref.current = requestAnimationFrame(animate);
        return () => {
            if (ref.current) cancelAnimationFrame(ref.current);
        };
    }, [target, duration, trigger]);

    return value;
}

function StatCard({ icon: Icon, color, label, value, trend, trendDirection, suffix }) {
    const [visible, setVisible] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.3 }
        );
        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    const animatedValue = useCountUp(typeof value === 'number' ? value : parseInt(value) || 0, 1500, visible);

    return (
        <div ref={cardRef} className="glass-card stat-card" style={{ padding: 'var(--space-lg)', position: 'relative', overflow: 'hidden' }}>
            {/* Background accent */}
            <div style={{
                position: 'absolute', top: -20, right: -20,
                width: 80, height: 80, borderRadius: 'var(--radius-full)',
                background: color, opacity: 0.08,
            }} />

            <div className="flex items-center justify-center mb-sm">
                <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-md)',
                    background: `${color}20`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <Icon size={22} color={color} />
                </div>
            </div>

            <div className="stat-number text-gradient" style={{ marginBottom: 'var(--space-xs)' }}>
                {animatedValue.toLocaleString('en-IN')}{suffix || ''}
            </div>

            <div className="stat-label">{label}</div>

            <div className={`stat-trend ${trendDirection === 'up' ? 'up' : 'down'}`}>
                <TrendingUp size={12} style={{
                    display: 'inline', verticalAlign: 'middle', marginRight: 4,
                    transform: trendDirection === 'down' ? 'rotate(180deg)' : 'none',
                }} />
                {trend}
            </div>
        </div>
    );
}

export default function ScaleMetrics() {
    const stats = [
        {
            icon: Users, color: 'var(--accent-primary)',
            label: 'Total Athletes', value: 2847,
            trend: '↑ 23% this month', trendDirection: 'up',
        },
        {
            icon: MapPin, color: 'var(--accent-success)',
            label: 'Districts Active', value: 23, suffix: '/38',
            trend: '↑ 3 new', trendDirection: 'up',
        },
        {
            icon: Search, color: 'var(--accent-secondary)',
            label: 'Scouts Registered', value: 156,
            trend: '↑ 12%', trendDirection: 'up',
        },
        {
            icon: ClipboardCheck, color: 'var(--accent-warning)',
            label: 'Assessments', value: 12430,
            trend: '↑ 340 today', trendDirection: 'up',
        },
        {
            icon: Send, color: 'var(--accent-danger)',
            label: 'Offers Sent', value: 89,
            trend: '↑ 15%', trendDirection: 'up',
        },
        {
            icon: Award, color: 'var(--accent-gold)',
            label: 'Schemes Matched', value: 1247,
            trend: '↑ 8%', trendDirection: 'up',
        },
    ];

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-sm mb-md">
                <Award size={24} color="var(--accent-success)" />
                <h3 className="heading-3">Platform Scale</h3>
            </div>

            <div className="grid grid-3">
                {stats.map((stat, i) => (
                    <div
                        key={stat.label}
                        className="animate-slide-up"
                        style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
                    >
                        <StatCard {...stat} />
                    </div>
                ))}
            </div>
        </div>
    );
}
