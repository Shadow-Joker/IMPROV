import { useState, useEffect, useRef } from 'react';
import { Calculator, TrendingUp, IndianRupee, Building2, FileBarChart, Target } from 'lucide-react';

function formatINR(n) {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
    return `₹${n.toLocaleString('en-IN')}`;
}

function AnimNum({ value, format, duration = 1200 }) {
    const [display, setDisplay] = useState('₹0');
    const ref = useRef(null);
    useEffect(() => {
        let start = null;
        const anim = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(format ? format(Math.round(eased * value)) : Math.round(eased * value).toLocaleString('en-IN'));
            if (p < 1) ref.current = requestAnimationFrame(anim);
        };
        ref.current = requestAnimationFrame(anim);
        return () => { if (ref.current) cancelAnimationFrame(ref.current); };
    }, [value, format, duration]);
    return <span>{display}</span>;
}

export default function RevenueCalculator() {
    const [academies, setAcademies] = useState(15000);
    const [convRate, setConvRate] = useState(2);
    const [monthlyPrice, setMonthlyPrice] = useState(999);
    const [govtContracts, setGovtContracts] = useState(5);
    const [govtValue, setGovtValue] = useState(2500000);

    const paying = Math.floor(academies * (convRate / 100));
    const monthly = paying * monthlyPrice + govtContracts * (govtValue / 12);
    const annual = monthly * 12;
    const y2 = annual * 1.2, y3 = y2 * 1.2;
    const total3 = annual + y2 + y3;

    const sliders = [
        { label: 'Target Academies', value: academies, set: setAcademies, min: 0, max: 15000, step: 500, display: academies.toLocaleString('en-IN'), icon: Building2, color: 'var(--accent-primary)' },
        { label: 'Conversion Rate', value: convRate, set: setConvRate, min: 0, max: 20, step: 0.5, display: `${convRate}%`, icon: Target, color: 'var(--accent-success)' },
        { label: 'Monthly Price', value: monthlyPrice, set: setMonthlyPrice, min: 499, max: 9999, step: 100, display: `₹${monthlyPrice.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'var(--accent-warning)' },
        { label: 'Govt Contracts', value: govtContracts, set: setGovtContracts, min: 0, max: 38, step: 1, display: `${govtContracts} districts`, icon: FileBarChart, color: 'var(--accent-secondary)' },
        { label: 'Contract Value', value: govtValue, set: setGovtValue, min: 1000000, max: 10000000, step: 500000, display: formatINR(govtValue), icon: IndianRupee, color: 'var(--accent-danger)' },
    ];

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-sm mb-md">
                <Calculator size={24} color="var(--accent-warning)" />
                <h3 className="heading-3">Revenue Calculator</h3>
            </div>

            <div className="revenue-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                {/* Sliders */}
                <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                    <h4 className="heading-4 mb-md text-secondary">Input Parameters</h4>
                    <div className="flex-col" style={{ display: 'flex', gap: 'var(--space-lg)' }}>
                        {sliders.map(s => {
                            const Icon = s.icon;
                            return (
                                <div key={s.label}>
                                    <div className="flex items-center justify-between mb-xs">
                                        <label className="flex items-center gap-xs" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                                            <Icon size={15} color={s.color} /> {s.label}
                                        </label>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', fontWeight: 700, color: s.color }}>{s.display}</span>
                                    </div>
                                    <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                                        onChange={e => s.set(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: s.color }} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Results */}
                <div className="flex-col" style={{ display: 'flex', gap: 'var(--space-md)' }}>
                    <div className="glass-card" style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--accent-primary)' }}>
                        <div className="text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Paying Academies</div>
                        <div className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800 }}>
                            <AnimNum value={paying} format={v => v.toLocaleString('en-IN')} />
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--accent-success)' }}>
                        <div className="text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Monthly Revenue</div>
                        <div className="text-gradient" style={{ fontSize: '2.2rem', fontWeight: 800 }}>
                            <AnimNum value={monthly} format={formatINR} />
                        </div>
                        <div className="text-secondary" style={{ fontSize: '0.75rem' }}>SaaS + Govt contracts</div>
                    </div>
                    <div className="glass-card" style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--accent-warning)' }}>
                        <div className="text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Annual Revenue</div>
                        <div className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800 }}>
                            <AnimNum value={annual} format={formatINR} />
                        </div>
                    </div>
                    <div className="glass-card" style={{
                        padding: 'var(--space-lg)', borderLeft: '4px solid var(--accent-secondary)',
                        background: 'var(--gradient-card)',
                    }}>
                        <div className="text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>3-Year Projection (20% YoY)</div>
                        <div className="text-gradient" style={{ fontSize: '2.8rem', fontWeight: 800 }}>
                            <AnimNum value={total3} format={formatINR} />
                        </div>
                        <div className="flex gap-md mt-sm" style={{ fontSize: '0.72rem' }}>
                            <span className="text-secondary">Y1: {formatINR(annual)}</span>
                            <span className="text-secondary">Y2: {formatINR(y2)}</span>
                            <span className="text-secondary">Y3: {formatINR(y3)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .revenue-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}
