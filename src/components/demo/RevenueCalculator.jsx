import { useState, useEffect, useRef } from 'react';
import { Calculator, TrendingUp, IndianRupee, Building2, FileBarChart } from 'lucide-react';

function formatINR(num) {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
    return `₹${num.toLocaleString('en-IN')}`;
}

function AnimatedNumber({ value, format, duration = 1200 }) {
    const [display, setDisplay] = useState('₹0');
    const ref = useRef(null);

    useEffect(() => {
        let start = 0;
        const startTime = performance.now();

        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * value);
            setDisplay(format ? format(current) : current.toLocaleString('en-IN'));

            if (progress < 1) {
                ref.current = requestAnimationFrame(animate);
            }
        };

        ref.current = requestAnimationFrame(animate);
        return () => {
            if (ref.current) cancelAnimationFrame(ref.current);
        };
    }, [value, format, duration]);

    return <span>{display}</span>;
}

export default function RevenueCalculator() {
    const [academies, setAcademies] = useState(15000);
    const [conversionRate, setConversionRate] = useState(2);
    const [monthlyPrice, setMonthlyPrice] = useState(999);
    const [govtContracts, setGovtContracts] = useState(5);
    const [govtContractValue, setGovtContractValue] = useState(2500000); // 25L

    // Calculations
    const payingAcademies = Math.floor(academies * (conversionRate / 100));
    const monthlyRevenue = payingAcademies * monthlyPrice + govtContracts * (govtContractValue / 12);
    const annualRevenue = monthlyRevenue * 12;
    const year2 = annualRevenue * 1.20;
    const year3 = year2 * 1.20;
    const projection3yr = annualRevenue + year2 + year3;

    const sliders = [
        {
            label: 'Target Academies',
            value: academies, setter: setAcademies,
            min: 0, max: 15000, step: 500,
            display: academies.toLocaleString('en-IN'),
            icon: Building2, color: 'var(--accent-primary)',
        },
        {
            label: 'Conversion Rate',
            value: conversionRate, setter: setConversionRate,
            min: 0, max: 20, step: 0.5,
            display: `${conversionRate}%`,
            icon: TrendingUp, color: 'var(--accent-success)',
        },
        {
            label: 'Monthly Price',
            value: monthlyPrice, setter: setMonthlyPrice,
            min: 499, max: 9999, step: 100,
            display: `₹${monthlyPrice.toLocaleString('en-IN')}`,
            icon: IndianRupee, color: 'var(--accent-warning)',
        },
        {
            label: 'Govt Contracts',
            value: govtContracts, setter: setGovtContracts,
            min: 0, max: 38, step: 1,
            display: `${govtContracts} districts`,
            icon: FileBarChart, color: 'var(--accent-secondary)',
        },
        {
            label: 'Contract Value',
            value: govtContractValue, setter: setGovtContractValue,
            min: 1000000, max: 10000000, step: 500000,
            display: formatINR(govtContractValue),
            icon: IndianRupee, color: 'var(--accent-danger)',
        },
    ];

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-sm mb-md">
                <Calculator size={24} color="var(--accent-warning)" />
                <h3 className="heading-3">Revenue Calculator</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                {/* Sliders Panel */}
                <div className="glass-card-static" style={{ padding: 'var(--space-lg)' }}>
                    <h4 className="heading-4 mb-md text-secondary">Input Parameters</h4>
                    <div className="flex-col gap-md" style={{ display: 'flex' }}>
                        {sliders.map(s => {
                            const Icon = s.icon;
                            return (
                                <div key={s.label}>
                                    <div className="flex items-center justify-between mb-xs">
                                        <label className="flex items-center gap-xs" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                            <Icon size={16} color={s.color} />
                                            {s.label}
                                        </label>
                                        <span style={{
                                            fontFamily: 'var(--font-mono)', fontSize: '0.9rem',
                                            fontWeight: 700, color: s.color,
                                        }}>{s.display}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={s.min} max={s.max} step={s.step}
                                        value={s.value}
                                        onChange={e => s.setter(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: s.color }}
                                    />
                                    <div className="flex justify-between" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                        <span>{s.min === 1000000 ? '₹10L' : s.min.toLocaleString('en-IN')}</span>
                                        <span>{s.max === 10000000 ? '₹1Cr' : s.max.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Results Panel */}
                <div className="flex-col gap-md" style={{ display: 'flex' }}>
                    {/* Paying Academies */}
                    <div className="glass-card-static" style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--accent-primary)' }}>
                        <div className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Paying Academies</div>
                        <div className="stat-number text-gradient" style={{ fontSize: '2rem' }}>
                            <AnimatedNumber value={payingAcademies} format={v => v.toLocaleString('en-IN')} />
                        </div>
                        <div className="text-secondary" style={{ fontSize: '0.8rem' }}>{conversionRate}% of {academies.toLocaleString('en-IN')}</div>
                    </div>

                    {/* Monthly Revenue */}
                    <div className="glass-card-static" style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--accent-success)' }}>
                        <div className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Monthly Revenue</div>
                        <div className="stat-number text-gradient" style={{ fontSize: '2.5rem' }}>
                            <AnimatedNumber value={monthlyRevenue} format={formatINR} />
                        </div>
                        <div className="text-secondary" style={{ fontSize: '0.8rem' }}>SaaS + Govt contracts</div>
                    </div>

                    {/* Annual Revenue */}
                    <div className="glass-card-static" style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--accent-warning)' }}>
                        <div className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Annual Revenue</div>
                        <div className="stat-number text-gradient" style={{ fontSize: '2.5rem' }}>
                            <AnimatedNumber value={annualRevenue} format={formatINR} />
                        </div>
                    </div>

                    {/* 3-Year Projection */}
                    <div className="glass-card-static animate-glow" style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--accent-secondary)', background: 'var(--gradient-card)' }}>
                        <div className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>3-Year Projection (20% YoY)</div>
                        <div className="stat-number text-gradient" style={{ fontSize: '3rem' }}>
                            <AnimatedNumber value={projection3yr} format={formatINR} />
                        </div>
                        <div className="flex gap-md mt-sm" style={{ fontSize: '0.75rem' }}>
                            <span className="text-secondary">Y1: {formatINR(annualRevenue)}</span>
                            <span className="text-secondary">Y2: {formatINR(year2)}</span>
                            <span className="text-secondary">Y3: {formatINR(year3)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Responsive */}
            <style>{`
        @media (max-width: 768px) {
          .revenue-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}
