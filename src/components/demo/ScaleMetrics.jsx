import { useState, useEffect, useRef } from 'react';
import { Users, MapPin, Search, ClipboardCheck, Send, Award, TrendingUp, ChevronRight } from 'lucide-react';

function useCountUp(target, duration = 1500, trigger = true) {
    const [v, setV] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
        if (!trigger) return;
        let start = null;
        const anim = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            setV(Math.round((1 - Math.pow(1 - p, 3)) * target));
            if (p < 1) ref.current = requestAnimationFrame(anim);
        };
        ref.current = requestAnimationFrame(anim);
        return () => { if (ref.current) cancelAnimationFrame(ref.current); };
    }, [target, duration, trigger]);
    return v;
}

function StatCard({ icon: Icon, color, label, value, trend, suffix }) {
    const [vis, setVis] = useState(false);
    const el = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.3 });
        if (el.current) obs.observe(el.current);
        return () => obs.disconnect();
    }, []);
    const anim = useCountUp(typeof value === 'number' ? value : parseInt(value) || 0, 1500, vis);

    return (
        <div ref={el} className="glass-card stat-card" style={{ padding: 'var(--space-lg)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -15, right: -15, width: 70, height: 70, borderRadius: '50%', background: color, opacity: 0.06 }} />
            <div className="flex items-center justify-center mb-sm">
                <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={color} />
                </div>
            </div>
            <div className="stat-number text-gradient">{anim.toLocaleString('en-IN')}{suffix || ''}</div>
            <div className="stat-label">{label}</div>
            <div className="stat-trend up" style={{ color: 'var(--accent-success)', fontSize: '0.72rem' }}>
                <TrendingUp size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                {trend}
            </div>
        </div>
    );
}

/* ── Visual Funnel ── */
function Funnel() {
    const stages = [
        { label: 'Villages Covered', count: 1200, color: 'var(--accent-primary)', w: 100 },
        { label: 'Schools Connected', count: 340, color: 'var(--accent-secondary)', w: 80 },
        { label: 'Athletes Scouted', count: 2847, color: 'var(--accent-warning)', w: 60 },
        { label: 'Prodigies Found', count: 23, color: 'var(--accent-success)', w: 40 },
    ];

    return (
        <div className="glass-card mt-lg" style={{ padding: 'var(--space-lg)' }}>
            <h4 className="heading-4 mb-md flex items-center gap-sm">
                <TrendingUp size={18} color="var(--accent-primary)" /> Discovery Funnel
            </h4>
            <div className="flex-col" style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
                {stages.map((s, i) => (
                    <div key={s.label} className="animate-slide-up" style={{
                        width: `${s.w}%`, padding: '14px', textAlign: 'center', position: 'relative',
                        background: `${s.color}15`, borderLeft: `3px solid ${s.color}`,
                        borderRight: `3px solid ${s.color}`,
                        borderTop: i === 0 ? `3px solid ${s.color}` : 'none',
                        borderBottom: i === stages.length - 1 ? `3px solid ${s.color}` : 'none',
                        animationDelay: `${i * 0.15}s`, opacity: 0,
                    }}>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color, fontFamily: 'var(--font-mono)' }}>
                            {s.count.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</div>
                        {i < stages.length - 1 && (
                            <ChevronRight size={16} color="var(--text-muted)" style={{
                                position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%) rotate(90deg)',
                            }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ScaleMetrics() {
    const stats = [
        { icon: Users, color: 'var(--accent-primary)', label: 'Total Athletes', value: 2847, trend: '↑ 23% this month' },
        { icon: MapPin, color: 'var(--accent-success)', label: 'Districts Active', value: 23, suffix: '/38', trend: '↑ 3 new' },
        { icon: Search, color: 'var(--accent-secondary)', label: 'Scouts Registered', value: 156, trend: '↑ 12%' },
        { icon: ClipboardCheck, color: 'var(--accent-warning)', label: 'Assessments', value: 12430, trend: '↑ 340 today' },
        { icon: Send, color: 'var(--accent-danger)', label: 'Offers Sent', value: 89, trend: '↑ 15%' },
        { icon: Award, color: 'var(--accent-gold)', label: 'Schemes Matched', value: 1247, trend: '↑ 8%' },
    ];

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-sm mb-md">
                <Award size={24} color="var(--accent-success)" />
                <h3 className="heading-3">Platform Scale</h3>
            </div>
            <div className="grid grid-3">
                {stats.map((s, i) => (
                    <div key={s.label} className="animate-slide-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                        <StatCard {...s} />
                    </div>
                ))}
            </div>
            <Funnel />
        </div>
    );
}
