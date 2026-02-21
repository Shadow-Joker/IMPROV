import { Link } from 'react-router-dom';
import { Clock, Users, Trophy, MapPin, ChevronRight, Play } from 'lucide-react';
import { SPORT_ICONS } from '../../utils/sportMetrics';

/**
 * ChallengeCard — Display card for a district challenge
 * Props: { challenge }
 */
export default function ChallengeCard({ challenge }) {
    const {
        id,
        title,
        sport,
        ageGroup,
        district,
        endDate,
        entries = [],
        testType,
    } = challenge;

    // Calculate days remaining
    const now = Date.now();
    const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
    const isUrgent = daysRemaining <= 3;

    // Top 3 leaders (from entries) - auto sorting based on test metric
    const topEntries = [...entries]
        .sort((a, b) => {
            // Lower time is better for timer events, higher is better for others
            if (['sprint', 'run', 'shuttle'].some(k => testType?.includes(k))) {
                return a.value - b.value;
            }
            return b.value - a.value;
        })
        .slice(0, 3);

    return (
        <div className="glass-card flex flex-col h-full hover-scale animate-fade-in group relative overflow-hidden" style={{ padding: 0, border: isUrgent ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255,255,255,0.08)' }}>
            {/* Dynamic Header Banner */}
            <div className="p-lg relative" style={{ background: 'var(--bg-card)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>

                {/* Subtle Background Icon */}
                <div className="absolute top-0 right-0 -mr-6 -mt-6 opacity-5 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500">
                    <Trophy size={140} color="var(--accent-primary)" />
                </div>

                <div className="flex justify-between items-start mb-md relative z-10">
                    <div className="flex gap-sm">
                        <span className="badge badge-pending tracking-widest uppercase" style={{ fontSize: '0.65rem' }}>{ageGroup}</span>
                        <span className="badge bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 tracking-wider uppercase" style={{ fontSize: '0.65rem' }}>{sport?.replace('_', ' ')}</span>
                    </div>
                    <span className={`badge flex items-center gap-xs font-bold shadow-lg ${isUrgent ? 'bg-red-500 text-white border-red-400' : 'bg-white/10 text-white border-white/20'}`} style={{ fontSize: '0.7rem' }}>
                        <Clock size={12} className={isUrgent ? 'animate-pulse' : ''} />
                        {daysRemaining}d left
                    </span>
                </div>

                <div className="flex items-start gap-md relative z-10">
                    <div style={{
                        fontSize: '2rem', width: '48px', height: '48px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--gradient-hero)', borderRadius: 'var(--radius-lg)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                    }}>
                        {SPORT_ICONS[sport] || '🏅'}
                    </div>
                    <div>
                        <h3 className="heading-3 mb-xs text-white group-hover:text-indigo-300 transition-colors" style={{ fontSize: '1.2rem', lineHeight: 1.2 }}>
                            {title}
                        </h3>
                        <div className="flex items-center gap-xs text-muted">
                            <MapPin size={14} color="var(--accent-secondary)" />
                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{district}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leaderboard Body */}
            <div className="p-lg flex-1 flex flex-col bg-black/40">
                <div className="flex justify-between items-center mb-md border-b border-white/5 pb-sm">
                    <h4 className="text-secondary tracking-widest uppercase text-xs font-bold drop-shadow-md">🏆 Live Hierarchy</h4>
                    <div className="flex items-center gap-xs bg-white/5 px-sm py-xs rounded-full">
                        <Users size={12} className="text-indigo-400" />
                        <span className="text-white text-xs font-bold">{entries.length} Actives</span>
                    </div>
                </div>

                {topEntries.length > 0 ? (
                    <div className="flex flex-col gap-sm flex-1">
                        {topEntries.map((entry, i) => (
                            <div key={i} className="flex items-center gap-md bg-white/5 hover:bg-white/10 transition-colors p-sm rounded-lg border border-white/5">
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: i === 0 ? 'linear-gradient(135deg, #FDF0D5 0%, #D4AF37 100%)' : i === 1 ? 'linear-gradient(135deg, #F5F5F5 0%, #C0C0C0 100%)' : 'linear-gradient(135deg, #FAD6A5 0%, #CD7F32 100%)',
                                    color: 'black', fontWeight: 900, fontSize: '0.8rem', boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
                                }}>
                                    {i + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="text-white text-sm font-bold truncate pr-md">{entry.name}</div>
                                    {/* Subtle id trace */}
                                    <div className="text-muted text-[10px] font-mono opacity-50">id:{entry.athleteId || 'anon'}</div>
                                </div>
                                <div className="text-right">
                                    <span className="font-mono font-bold text-success text-sm drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                                        {entry.value}
                                    </span>
                                    <span className="text-muted text-xs ml-xs">{entry.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-md border border-dashed border-white/10 rounded-lg opacity-50">
                        <Trophy size={24} className="mb-sm text-muted" />
                        <span className="text-sm">Be the first to establish<br />a baseline score!</span>
                    </div>
                )}
            </div>

            {/* Footer Action */}
            <div className="p-md bg-black/60 border-t border-white/10 mt-auto">
                <Link to={`/assess?challenge=${id}&sport=${sport}`} className="btn w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wide rounded-lg flex items-center justify-between group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all">
                    <span className="flex items-center gap-sm"><Play fill="currentColor" size={16} /> Enter Match </span>
                    <ChevronRight size={18} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
            </div>
        </div>
    );
}
