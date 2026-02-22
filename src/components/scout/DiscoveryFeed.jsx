import { useState, useEffect, useMemo } from 'react';
import { Radio, CheckCircle, Clock, TrendingUp, Eye, Star, Send, Loader, Shield, AlertTriangle, X } from 'lucide-react';
import { getAllAthletes, getAllAssessments } from '../../utils/demoLoader';
import { getRatingTier } from '../../utils/dataShapes';
import { toast } from '../shared/Toast';
import { useNavigate } from 'react-router-dom';

function timeAgo(ts) {
    const d = Date.now() - ts;
    const m = Math.floor(d / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

/* ── Trust Badge component ── */
function TrustBadge({ athlete, assessments }) {
    const athleteAssessments = assessments.filter(a => a.athleteId === athlete.id);
    const totalAttestations = athleteAssessments.reduce((sum, a) => sum + (a.attestations?.length || 0), 0);
    const allOtpVerified = athleteAssessments.every(a =>
        (a.attestations || []).every(att => att.otpVerified !== false)
    );
    const hasAnomalies = athleteAssessments.some(a => a.flags?.length > 0);

    let level, label, color, bgColor;
    if (totalAttestations >= 3 && allOtpVerified && !hasAnomalies) {
        level = 'verified'; label = '🟢 Verified'; color = 'var(--accent-success)'; bgColor = 'rgba(34,197,94,0.12)';
    } else if (totalAttestations >= 1) {
        level = 'partial'; label = '🟡 Partial'; color = 'var(--accent-warning)'; bgColor = 'rgba(251,191,36,0.12)';
    } else {
        level = 'unverified'; label = '🔴 Unverified'; color = 'var(--accent-danger, #ef4444)'; bgColor = 'rgba(239,68,68,0.12)';
    }

    return (
        <span style={{
            fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px',
            borderRadius: 'var(--radius-full)', background: bgColor, color,
            display: 'inline-flex', alignItems: 'center', gap: 3,
            whiteSpace: 'nowrap',
        }}>
            {label}
        </span>
    );
}

/* ── Hash Fingerprint display ── */
function HashFingerprint({ hash }) {
    if (!hash) return null;
    const display = hash.length > 12
        ? `${hash.slice(0, 8)}…${hash.slice(-4)}`
        : hash;
    return (
        <span title={hash} style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
            color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)',
            padding: '1px 6px', borderRadius: 'var(--radius-sm)',
        }}>
            🔗 {display}
        </span>
    );
}

function buildFeedEntries(athletes, assessments) {
    const entries = [];
    const now = Date.now();

    // Real assessments
    assessments.forEach((a, i) => {
        const ath = athletes.find(x => x.id === a.athleteId);
        if (ath) {
            entries.push({
                id: `r-${a.id || i}`, athleteId: ath.id,
                name: ath.name, nameTamil: ath.nameTamil || '', age: ath.age,
                sport: a.sport || ath.sport, testType: a.testType, value: a.value,
                unit: a.unit || '', percentile: a.percentile || 75, district: ath.district,
                verified: (a.attestations?.length >= 3) || ath.syncStatus === 'synced',
                timestamp: a.timestamp || now - (i * 40 + 2) * 60000,
                talentRating: ath.talentRating,
                mentalScore: ath.mentalScore,
                initials: ath.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                isRecent: i < 3,
                hash: a.hash || '',
                attestationCount: a.attestations?.length || 0,
                flags: a.flags || [],
            });
        }
    });

    // Fill with athlete-level entries for athletes without assessments
    athletes.forEach(ath => {
        const hasAssessment = assessments.some(a => a.athleteId === ath.id);
        if (!hasAssessment) {
            entries.push({
                id: `a-${ath.id}`, athleteId: ath.id,
                name: ath.name, nameTamil: ath.nameTamil || '', age: ath.age,
                sport: ath.sport, testType: 'profile_registered', value: ath.talentRating,
                unit: '', percentile: 50, district: ath.district,
                verified: ath.syncStatus === 'synced',
                timestamp: ath.createdAt || Date.now() - Math.random() * 86400000 * 3,
                talentRating: ath.talentRating,
                mentalScore: ath.mentalScore,
                initials: ath.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                isRecent: false,
                hash: '',
                attestationCount: 0,
                flags: [],
            });
        }
    });

    return entries.sort((a, b) => b.timestamp - a.timestamp);
}

const PAGE_SIZE = 6;

export default function DiscoveryFeed({ athletes: propAthletes, assessments: propAssessments, districtFilter, onClearDistrictFilter, filters }) {
    const navigate = useNavigate();
    const athletes = propAthletes?.length ? propAthletes : getAllAthletes();
    const assessments = propAssessments?.length ? propAssessments : getAllAssessments();

    const [allEntries, setAllEntries] = useState([]);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [loading, setLoading] = useState(false);
    const [shortlisted, setShortlisted] = useState(() => {
        try { return JSON.parse(localStorage.getItem('sentrak_shortlist') || '[]'); } catch { return []; }
    });
    const [showFraudAlerts, setShowFraudAlerts] = useState(false);

    useEffect(() => {
        setAllEntries(buildFeedEntries(athletes, assessments));
    }, [athletes, assessments]);

    // Apply filters
    const filteredEntries = useMemo(() => {
        let entries = [...allEntries];

        // District filter from heat map
        if (districtFilter) {
            entries = entries.filter(e => e.district?.toLowerCase() === districtFilter.toLowerCase());
        }

        // Search filters
        if (filters) {
            const activeSports = filters.sports?.length ? filters.sports : (filters.sport ? [filters.sport] : []);
            if (activeSports.length > 0) {
                entries = entries.filter(e => activeSports.includes(e.sport));
            }
            if (filters.ageGroup) {
                const ageMap = { 'U-12': [0, 12], 'U-14': [12, 14], 'U-16': [14, 16], 'U-18': [16, 18], 'U-21': [18, 21] };
                const range = ageMap[filters.ageGroup];
                if (range) entries = entries.filter(e => e.age >= range[0] && e.age < range[1]);
            }
            if (filters.gender) {
                const athGenders = {};
                athletes.forEach(a => { athGenders[a.id] = a.gender; });
                entries = entries.filter(e => athGenders[e.athleteId] === filters.gender);
            }
            if (filters.district) {
                entries = entries.filter(e => e.district?.toLowerCase() === filters.district.toLowerCase());
            }
            if (filters.minRating > 1000) {
                entries = entries.filter(e => (e.talentRating || 0) >= filters.minRating);
            }
            if (filters.verifiedOnly) {
                entries = entries.filter(e => {
                    const ath = athletes.find(a => a.id === e.athleteId);
                    const athAssessments = assessments.filter(a => a.athleteId === e.athleteId);
                    const totalAtt = athAssessments.reduce((s, a) => s + (a.attestations?.length || 0), 0);
                    return totalAtt >= 3 || ath?.syncStatus === 'synced';
                });
            }
        }

        return entries;
    }, [allEntries, districtFilter, filters, athletes, assessments]);

    // Fraud alerts: athletes with flagged assessments
    const fraudAlerts = useMemo(() => {
        return assessments.filter(a => a.flags?.length > 0).map(a => {
            const ath = athletes.find(x => x.id === a.athleteId);
            return { ...a, athleteName: ath?.name || 'Unknown', athleteDistrict: ath?.district || '' };
        });
    }, [assessments, athletes]);

    const visible = filteredEntries.slice(0, visibleCount);
    const hasMore = visibleCount < filteredEntries.length;

    const loadMore = () => {
        setLoading(true);
        setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filteredEntries.length));
            setLoading(false);
        }, 400);
    };

    const toggleShortlist = (entry) => {
        const next = shortlisted.includes(entry.athleteId)
            ? shortlisted.filter(x => x !== entry.athleteId)
            : [...shortlisted, entry.athleteId];
        setShortlisted(next);
        localStorage.setItem('sentrak_shortlist', JSON.stringify(next));

        if (next.includes(entry.athleteId)) {
            toast.success(`Added ${entry.name} to shortlist!`);
        } else {
            toast.info(`Removed ${entry.name} from shortlist`);
        }
    };

    const handleViewPassport = (entry) => {
        if (entry.athleteId) {
            navigate(`/profile/${entry.athleteId}`);
        }
    };

    const handleSendOffer = (entry) => {
        toast.success(`Offer sent to ${entry.name}!`);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-md" style={{ flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                <h3 className="heading-4 flex items-center gap-sm">
                    <Radio size={20} color="var(--accent-success)" style={{ animation: 'pulse 2s infinite' }} />
                    Discovery Feed
                </h3>
                <div className="flex items-center gap-sm">
                    {districtFilter && (
                        <button className="btn btn-ghost" onClick={onClearDistrictFilter}
                            style={{ padding: '4px 10px', minHeight: 'auto', fontSize: '0.72rem' }}>
                            <X size={12} /> Clear: {districtFilter}
                        </button>
                    )}
                    {fraudAlerts.length > 0 && (
                        <button className={`btn ${showFraudAlerts ? 'btn-danger' : 'btn-ghost'}`}
                            onClick={() => setShowFraudAlerts(!showFraudAlerts)}
                            style={{ padding: '4px 10px', minHeight: 48, fontSize: '0.72rem' }}>
                            <AlertTriangle size={13} /> {fraudAlerts.length} Alert{fraudAlerts.length > 1 ? 's' : ''}
                        </button>
                    )}
                    <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>{filteredEntries.length} events</span>
                </div>
            </div>

            {/* ── Fraud Alerts Section ── */}
            {showFraudAlerts && fraudAlerts.length > 0 && (
                <div className="glass-card mb-md animate-slide-up" style={{
                    padding: 'var(--space-md)', borderLeft: '3px solid var(--accent-danger, #ef4444)',
                }}>
                    <h4 className="flex items-center gap-xs mb-sm" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-danger, #ef4444)' }}>
                        <Shield size={16} /> Fraud Alerts
                    </h4>
                    {fraudAlerts.map((fa, i) => (
                        <div key={fa.id || i} style={{
                            padding: '8px 12px', marginBottom: 6, borderRadius: 'var(--radius-sm)',
                            background: 'rgba(239,68,68,0.08)', fontSize: '0.78rem',
                        }}>
                            <span style={{ fontWeight: 600 }}>{fa.athleteName}</span>
                            <span className="text-muted"> — {fa.testType?.replace(/_/g, ' ')}</span>
                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                                Flags: {fa.flags.join(', ')}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex-col" style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                {visible.map((entry, i) => {
                    const tier = getRatingTier(entry.talentRating || 1000);
                    const isStarred = shortlisted.includes(entry.athleteId);
                    const entryAthlete = athletes.find(a => a.id === entry.athleteId);
                    const entryAssessments = assessments.filter(a => a.athleteId === entry.athleteId);

                    return (
                        <div key={entry.id} className="glass-card animate-slide-up" style={{
                            padding: '14px 16px', animationDelay: `${Math.min(i * 0.04, 0.4)}s`, opacity: 0,
                            transition: 'all 0.2s',
                        }}>
                            <div className="flex gap-sm" style={{ alignItems: 'flex-start' }}>
                                {/* Avatar */}
                                <div style={{ position: 'relative', flexShrink: 0 }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 'var(--radius-full)',
                                        background: 'var(--gradient-hero)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700,
                                    }}>
                                        {entry.initials}
                                    </div>
                                    {/* Sport badge */}
                                    <div style={{
                                        position: 'absolute', bottom: -3, right: -3, width: 18, height: 18,
                                        borderRadius: '50%', background: 'var(--bg-card)', border: '2px solid var(--bg-primary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem',
                                    }}>
                                        {entry.sport === 'Cricket' ? '🏏' : entry.sport === 'Football' ? '⚽' :
                                            entry.sport === 'Kabaddi' ? '🤼' : entry.sport?.includes('Track') ? '🏃' :
                                                entry.sport === 'Badminton' ? '🏸' : entry.sport === 'Wrestling' ? '🤼' :
                                                    entry.sport === 'Hockey' ? '🏑' : entry.sport === 'Boxing' ? '🥊' :
                                                        entry.sport === 'Archery' ? '🏹' : '🏅'}
                                    </div>
                                    {/* "New" pulsing dot */}
                                    {entry.isRecent && (
                                        <div style={{
                                            position: 'absolute', top: -2, right: -2, width: 10, height: 10,
                                            borderRadius: '50%', background: 'var(--accent-success)',
                                            border: '2px solid var(--bg-card)', animation: 'pulse 1.5s infinite',
                                        }} />
                                    )}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>
                                        <span style={{ fontWeight: 700 }}>{entry.name}</span>
                                        <span className="text-secondary">, {entry.age}, </span>
                                        {entry.testType !== 'profile_registered' ? (
                                            <>
                                                <span style={{ fontWeight: 600, color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                                                    {entry.value}{entry.unit}
                                                </span>
                                                <span className="text-secondary"> {entry.testType.replace(/_/g, ' ')}</span>
                                            </>
                                        ) : (
                                            <span className="text-muted"> newly registered</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-sm" style={{ marginTop: 4, flexWrap: 'wrap' }}>
                                        <span className={`badge ${tier.class}`} style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                                            {entry.talentRating} {tier.name}
                                        </span>
                                        {entry.testType !== 'profile_registered' && (
                                            <span className="flex items-center gap-xs" style={{
                                                fontSize: '0.72rem', fontWeight: 600,
                                                color: entry.percentile >= 80 ? 'var(--accent-success)' : entry.percentile >= 60 ? 'var(--accent-warning)' : 'var(--text-secondary)',
                                            }}>
                                                <TrendingUp size={11} /> {entry.percentile}th
                                            </span>
                                        )}
                                        {/* Trust Badge */}
                                        {entryAthlete && <TrustBadge athlete={entryAthlete} assessments={assessments} />}
                                        {/* Hash fingerprint */}
                                        {entry.hash && <HashFingerprint hash={entry.hash} />}
                                        {/* Witness count */}
                                        {entry.attestationCount > 0 && (
                                            <span className="text-muted" style={{ fontSize: '0.65rem' }}>
                                                👁️ {entry.attestationCount} witness{entry.attestationCount > 1 ? 'es' : ''}
                                            </span>
                                        )}
                                        <span className="text-muted" style={{ fontSize: '0.65rem', marginLeft: 'auto' }}>
                                            <Clock size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />
                                            {timeAgo(entry.timestamp)}
                                        </span>
                                    </div>
                                    {/* Anomaly flags */}
                                    {entry.flags?.length > 0 && (
                                        <div style={{
                                            marginTop: 4, fontSize: '0.68rem', color: 'var(--accent-danger, #ef4444)',
                                            display: 'flex', alignItems: 'center', gap: 4,
                                        }}>
                                            <AlertTriangle size={11} /> Anomaly: {entry.flags.join(', ')}
                                        </div>
                                    )}
                                </div>

                                {/* Quick actions */}
                                <div className="flex-col" style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                                    <button className="btn btn-ghost" title="View Passport"
                                        onClick={() => handleViewPassport(entry)}
                                        style={{ width: 36, height: 36, padding: 0, minHeight: 48, borderRadius: 'var(--radius-sm)' }}>
                                        <Eye size={14} />
                                    </button>
                                    <button className={`btn ${isStarred ? 'btn-primary' : 'btn-ghost'}`} title="Shortlist"
                                        onClick={() => toggleShortlist(entry)}
                                        style={{ width: 36, height: 36, padding: 0, minHeight: 48, borderRadius: 'var(--radius-sm)' }}>
                                        <Star size={14} fill={isStarred ? 'currentColor' : 'none'} />
                                    </button>
                                    <button className="btn btn-ghost" title="Send Offer"
                                        onClick={() => handleSendOffer(entry)}
                                        style={{ width: 36, height: 36, padding: 0, minHeight: 48, borderRadius: 'var(--radius-sm)' }}>
                                        <Send size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Load More */}
            {hasMore && (
                <div className="text-center mt-md">
                    <button className="btn btn-ghost" onClick={loadMore} disabled={loading}
                        style={{ padding: '8px 24px', fontSize: '0.85rem', minHeight: 48 }}>
                        {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Loading...</> : 'Load More'}
                    </button>
                </div>
            )}

            {!hasMore && visible.length > 0 && (
                <div className="text-center mt-md text-muted" style={{ fontSize: '0.8rem' }}>End of feed</div>
            )}

            {visible.length === 0 && (
                <div className="glass-card text-center" style={{ padding: 'var(--space-3xl)' }}>
                    <Radio size={48} color="var(--text-muted)" style={{ marginBottom: 'var(--space-md)' }} />
                    <p className="text-secondary">No athletes match current filters</p>
                    <p className="text-muted" style={{ fontSize: '0.82rem' }}>Try adjusting filters or clearing the district filter</p>
                </div>
            )}

            <style>{`
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
        @keyframes spin { to { transform:rotate(360deg) } }
      `}</style>
        </div>
    );
}
