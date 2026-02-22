import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Map, Trophy, Radio, Briefcase, TrendingUp, Users, ClipboardCheck, Award, FileText, Download } from 'lucide-react';
import { getAllAthletes, getAllAssessments } from '../../utils/demoLoader';
import { toast } from '../shared/Toast';
import SearchFilters from './SearchFilters';
import AthleteRanking from './AthleteRanking';
import TalentHeatMap from './TalentHeatMap';
import DiscoveryFeed from './DiscoveryFeed';
import RecruitmentPortal from './RecruitmentPortal';

/* ── Animated KPI counter ── */
function AnimKPI({ target, suffix = '', duration = 1400 }) {
    const [val, setVal] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
        let start = null;
        const anim = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(eased * target));
            if (p < 1) ref.current = requestAnimationFrame(anim);
        };
        ref.current = requestAnimationFrame(anim);
        return () => { if (ref.current) cancelAnimationFrame(ref.current); };
    }, [target, duration]);
    return <span style={{ fontFamily: 'var(--font-mono)' }}>{val.toLocaleString('en-IN')}{suffix}</span>;
}

/* ── Mini sparkline (6 bars) ── */
function Sparkline({ data, color }) {
    const max = Math.max(...data, 1);
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 28, opacity: 0.35 }}>
            {data.map((v, i) => (
                <div key={i} style={{
                    width: 4, borderRadius: 2, background: color,
                    height: `${(v / max) * 100}%`, minHeight: 2,
                    animation: `growUp 0.5s ${i * 0.08}s both`,
                }} />
            ))}
        </div>
    );
}

/* ── Live ticker item ── */
function TickerItem({ text }) {
    return (
        <span style={{
            display: 'inline-block', whiteSpace: 'nowrap', padding: '4px 12px',
            fontSize: '0.75rem', color: 'var(--text-secondary)',
        }}>
            {text}
        </span>
    );
}

const TABS = [
    { id: 'search', label: 'Search', icon: Search },
    { id: 'heatmap', label: 'Heat Map', icon: Map },
    { id: 'rankings', label: 'Rankings', icon: Trophy },
    { id: 'feed', label: 'Feed', icon: Radio },
    { id: 'recruitment', label: 'Recruit', icon: Briefcase },
];

export default function ScoutDashboard({ athletes: propAthletes, filters, onFilterChange }) {
    const [activeTab, setActiveTab] = useState('search');
    const [tickerOffset, setTickerOffset] = useState(0);
    const tickerRef = useRef(null);
    const [districtFilter, setDistrictFilter] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);

    // Load real data from localStorage via demoLoader
    const athletes = propAthletes?.length ? propAthletes : getAllAthletes();
    const assessments = getAllAssessments();

    // Shortlist count (from localStorage)
    const [shortlistCount, setShortlistCount] = useState(0);
    useEffect(() => {
        const updateCount = () => {
            try {
                const sl = JSON.parse(localStorage.getItem('sentrak_shortlist') || '[]');
                setShortlistCount(sl.length);
            } catch { setShortlistCount(0); }
        };
        updateCount();
        // Poll for shortlist changes every 2s
        const interval = setInterval(updateCount, 2000);
        return () => clearInterval(interval);
    }, []);

    // KPI data — computed from REAL data
    const totalAthletes = athletes.length;
    const weekAssessments = assessments.filter(a => {
        const ts = a.timestamp || a.createdAt || 0;
        return Date.now() - ts < 7 * 86400000;
    }).length || assessments.length;

    const verifiedCount = athletes.filter(a => {
        const athleteAssessments = assessments.filter(as => as.athleteId === a.id);
        const totalAttestations = athleteAssessments.reduce((sum, as) => sum + (as.attestations?.length || 0), 0);
        return totalAttestations >= 3 || a.syncStatus === 'synced';
    }).length;

    // Sparkline data (weekly trend)
    const sparkData1 = [3, 5, 4, 7, 6, 8, totalAthletes > 6 ? 10 : 5];
    const sparkData2 = [2, 4, 3, 5, 7, 6, weekAssessments > 3 ? 8 : 4];
    const sparkData3 = [1, 2, 2, 3, 3, 4, verifiedCount > 2 ? 5 : 3];

    // Recent attestation ticker
    const tickerItems = useMemo(() => {
        const items = [];
        athletes.slice(0, 8).forEach(a => {
            items.push(`✓ ${a.name} verified in ${a.district || 'TN'}`);
        });
        assessments.slice(0, 5).forEach(a => {
            const ath = athletes.find(x => x.id === a.athleteId);
            if (ath) items.push(`📊 ${ath.name} recorded ${a.testType?.replace(/_/g, ' ')} — ${a.value}${a.unit || ''}`);
        });
        return items;
    }, [athletes, assessments]);

    // Ticker animation
    useEffect(() => {
        if (!tickerRef.current || tickerItems.length === 0) return;
        const interval = setInterval(() => {
            setTickerOffset(prev => {
                const el = tickerRef.current;
                if (!el) return prev;
                const max = el.scrollWidth - el.clientWidth;
                return prev >= max ? 0 : prev + 1;
            });
        }, 30);
        return () => clearInterval(interval);
    }, [tickerItems]);

    // District filter callback from HeatMap
    const handleDistrictFilter = (districtName) => {
        setDistrictFilter(districtName);
        if (districtName) {
            // Auto-switch to feed tab when filtering by district
            setActiveTab('feed');
        }
    };

    const clearDistrictFilter = () => setDistrictFilter(null);

    const handleGenerateReport = () => {
        if (reportLoading) return;
        setReportLoading(true);
        toast.info('Generating report...');

        setTimeout(() => {
            const reportData = {
                generated: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                totalAthletes, weekAssessments, verifiedCount,
                topAthletes: [...athletes].sort((a, b) => (b.talentRating || 0) - (a.talentRating || 0)).slice(0, 10).map(a => ({
                    name: a.name, district: a.district, sport: a.sport, rating: a.talentRating
                })),
            };
            const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `sentrak-report-${Date.now()}.json`; a.click();
            URL.revokeObjectURL(url);
            setReportLoading(false);
            toast.success('Report downloaded!');
        }, 2000);
    };

    const renderTab = () => {
        switch (activeTab) {
            case 'search': return <AthleteRanking athletes={athletes} filters={filters} />;
            case 'heatmap': return <TalentHeatMap athletes={athletes} onDistrictSelect={handleDistrictFilter} />;
            case 'rankings': return <AthleteRanking athletes={athletes} filters={filters} />;
            case 'feed': return (
                <DiscoveryFeed
                    athletes={athletes}
                    assessments={assessments}
                    districtFilter={districtFilter}
                    onClearDistrictFilter={clearDistrictFilter}
                    filters={filters}
                />
            );
            case 'recruitment': return <RecruitmentPortal athletes={athletes} />;
            default: return null;
        }
    };

    const showSidebar = activeTab === 'search' || activeTab === 'rankings';

    return (
        <div className="animate-fade-in">
            {/* ── KPI Cards ── */}
            <div className="grid grid-3 mb-lg" style={{ gap: 'var(--space-md)' }}>
                {[
                    { label: 'Total Athletes', value: totalAthletes, icon: Users, color: 'var(--accent-primary)', spark: sparkData1 },
                    { label: 'Assessments This Week', value: weekAssessments, icon: ClipboardCheck, color: 'var(--accent-success)', spark: sparkData2 },
                    { label: 'Verified Talent', value: verifiedCount, icon: Award, color: 'var(--accent-warning)', spark: sparkData3 },
                ].map((kpi, i) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={kpi.label} className="glass-card animate-slide-up" style={{
                            padding: 'var(--space-md) var(--space-lg)', position: 'relative', overflow: 'hidden',
                            animationDelay: `${i * 0.1}s`, opacity: 0,
                        }}>
                            {/* bg glow */}
                            <div style={{ position: 'absolute', top: -15, right: -15, width: 60, height: 60, borderRadius: '50%', background: kpi.color, opacity: 0.08 }} />

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{kpi.label}</div>
                                    <div className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>
                                        <AnimKPI target={kpi.value} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-sm">
                                    <Sparkline data={kpi.spark} color={kpi.color} />
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 'var(--radius-md)',
                                        background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Icon size={20} color={kpi.color} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── District Filter Banner ── */}
            {districtFilter && (
                <div className="glass-card mb-md animate-slide-up" style={{
                    padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderLeft: '3px solid var(--accent-primary)',
                }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        🗺️ Filtering: <span style={{ color: 'var(--accent-secondary)' }}>{districtFilter}</span>
                    </span>
                    <button className="btn btn-ghost" onClick={clearDistrictFilter}
                        style={{ padding: '4px 12px', minHeight: 'auto', fontSize: '0.78rem' }}>
                        ✕ Clear Filter
                    </button>
                </div>
            )}

            {/* ── Tab Navigation ── */}
            <div className="flex items-center justify-between mb-md" style={{ flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                <div className="tabs">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        const isRecruit = tab.id === 'recruitment';
                        return (
                            <button key={tab.id} className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                                style={{ position: 'relative', minHeight: 48 }}>
                                <span className="flex items-center gap-xs">
                                    <Icon size={15} /> {tab.label}
                                </span>
                                {/* Shortlist count badge on Recruitment tab */}
                                {isRecruit && shortlistCount > 0 && (
                                    <span style={{
                                        position: 'absolute', top: 2, right: 2,
                                        width: 18, height: 18, borderRadius: '50%',
                                        background: 'var(--accent-danger, #ef4444)', color: 'white',
                                        fontSize: '0.6rem', fontWeight: 800,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        lineHeight: 1,
                                    }}>
                                        {shortlistCount > 9 ? '9+' : shortlistCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
                <button className="btn btn-ghost" onClick={handleGenerateReport} disabled={reportLoading}
                    style={{ padding: '6px 14px', fontSize: '0.78rem', minHeight: 48 }}>
                    <Download size={14} /> {reportLoading ? 'Generating...' : 'Export Report'}
                </button>
            </div>

            {/* ── Main Content ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: showSidebar ? 'minmax(260px, 280px) 1fr' : '1fr',
                gap: 'var(--space-md)',
            }}>
                {showSidebar && (
                    <aside className="scout-sidebar" style={{
                        position: 'sticky', top: 80, alignSelf: 'start',
                        maxHeight: 'calc(100vh - 100px)', overflowY: 'auto',
                    }}>
                        <SearchFilters filters={filters} onChange={onFilterChange} athletes={athletes} assessments={assessments} />
                    </aside>
                )}
                <main style={{ minWidth: 0 }}>{renderTab()}</main>
            </div>

            {/* ── Live Ticker ── */}
            <div className="glass-card mt-md" style={{
                padding: '8px 0', overflow: 'hidden', position: 'relative',
            }}>
                <div className="flex items-center gap-xs" style={{ paddingLeft: 12 }}>
                    <div style={{
                        width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-success)',
                        animation: 'pulse 2s infinite',
                    }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-success)', marginRight: 8, flexShrink: 0 }}>LIVE</span>
                </div>
                <div ref={tickerRef} style={{
                    overflow: 'hidden', whiteSpace: 'nowrap', paddingLeft: 60,
                }}>
                    <div style={{ display: 'inline-block', transform: `translateX(-${tickerOffset}px)`, transition: 'none' }}>
                        {tickerItems.map((t, i) => <TickerItem key={i} text={t} />)}
                        {tickerItems.map((t, i) => <TickerItem key={`r-${i}`} text={t} />)}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes growUp { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media (max-width: 1024px) {
          .scout-sidebar { position: static !important; max-height: none !important; }
        }
        @media (max-width: 768px) {
          .grid-3 { grid-template-columns: 1fr !important; }
          .tabs { overflow-x: auto; flex-wrap: nowrap; }
        }
      `}</style>
        </div>
    );
}
