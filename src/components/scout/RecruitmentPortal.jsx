import { useState, useEffect, useRef } from 'react';
import { Send, Briefcase, X, Clock, CheckCircle, XCircle, Banknote, MapPin, MessageSquare, Star, PartyPopper } from 'lucide-react';
import { createOffer } from '../../utils/dataShapes';
import { getAllAthletes } from '../../utils/demoLoader';
import { toast } from '../shared/Toast';

const PROGRAM_TYPES = [
    { value: 'scholarship', label: 'Scholarship', icon: '🎓', color: 'var(--accent-success)' },
    { value: 'training', label: 'Training Camp', icon: '🏋️', color: 'var(--accent-primary)' },
    { value: 'trial', label: 'Trial Invite', icon: '🏅', color: 'var(--accent-warning)' },
    { value: 'sponsorship', label: 'Sponsorship', icon: '💰', color: 'var(--accent-secondary)' },
];

/* ── Tiny confetti burst ── */
function Confetti({ show }) {
    const canvasRef = useRef(null);
    useEffect(() => {
        if (!show || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        const particles = [];
        const colors = ['#fbbf24', '#22c55e', '#6366f1', '#ec4899', '#06b6d4', '#f97316'];
        for (let i = 0; i < 60; i++) {
            particles.push({
                x: canvas.width / 2, y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12 - 4,
                size: Math.random() * 6 + 3, color: colors[Math.floor(Math.random() * colors.length)],
                life: 1, decay: 0.015 + Math.random() * 0.01,
            });
        }
        let frame;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= p.decay;
                if (p.life > 0) {
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.x, p.y, p.size, p.size);
                }
            });
            if (particles.some(p => p.life > 0)) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => { if (frame) cancelAnimationFrame(frame); };
    }, [show]);
    if (!show) return null;
    return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }} />;
}

export default function RecruitmentPortal({ athletes: propAthletes }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedAthlete, setSelectedAthlete] = useState('');
    const [offers, setOffers] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [form, setForm] = useState({
        academyName: '', type: 'scholarship', value: '', duration: '', location: '', message: '',
    });

    const allAthletes = propAthletes?.length ? propAthletes : getAllAthletes();

    // Saved athletes (shortlisted)
    const [saved, setSaved] = useState(() => {
        try { return JSON.parse(localStorage.getItem('sentrak_shortlist') || '[]'); } catch { return []; }
    });

    // Auto-update saved list periodically or listen to storage events
    useEffect(() => {
        const updateSaved = () => {
            try { setSaved(JSON.parse(localStorage.getItem('sentrak_shortlist') || '[]')); } catch { }
        };
        const interval = setInterval(updateSaved, 2000);
        return () => clearInterval(interval);
    }, []);

    const savedAthletes = allAthletes.filter(a => saved.includes(a.id) || saved.includes(`r-${a.id}`) || saved.includes(`s-${a.id}`));

    useEffect(() => {
        try { setOffers(JSON.parse(localStorage.getItem('sentrak_offers') || '[]')); } catch { setOffers([]); }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const offer = createOffer({ ...form, athleteId: selectedAthlete, scoutName: 'Demo Scout', scoutId: 'scout-demo' });
        const updated = [offer, ...offers];
        setOffers(updated);
        localStorage.setItem('sentrak_offers', JSON.stringify(updated));
        setShowModal(false);
        setForm({ academyName: '', type: 'scholarship', value: '', duration: '', location: '', message: '' });
        setSelectedAthlete('');
        setShowConfetti(true);
        toast.success('Offer sent successfully!');
        setTimeout(() => setShowConfetti(false), 3000);
    };

    const updateStatus = (id, status) => {
        const updated = offers.map(o => o.id === id ? { ...o, status } : o);
        setOffers(updated);
        localStorage.setItem('sentrak_offers', JSON.stringify(updated));
    };

    const getStatusBadge = (s) => {
        if (s === 'accepted') return <span className="badge badge-verified"><CheckCircle size={11} /> Accepted</span>;
        if (s === 'declined') return <span className="badge badge-danger"><XCircle size={11} /> Declined</span>;
        return <span className="badge badge-pending"><Clock size={11} /> Pending</span>;
    };

    return (
        <div className="animate-fade-in">
            <Confetti show={showConfetti} />

            <div className="flex items-center justify-between mb-md">
                <h3 className="heading-4 flex items-center gap-sm">
                    <Briefcase size={20} color="var(--accent-warning)" /> Recruitment Portal
                </h3>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}
                    style={{ padding: '8px 16px', minHeight: 48, fontSize: '0.85rem' }}>
                    <Send size={16} /> Send Offer
                </button>
            </div>

            {/* Saved Athletes */}
            {savedAthletes.length > 0 && (
                <div className="glass-card mb-md" style={{ padding: 'var(--space-md)' }}>
                    <h4 className="flex items-center gap-xs mb-sm" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                        <Star size={15} color="var(--accent-warning)" /> Saved Athletes ({savedAthletes.length})
                    </h4>
                    <div className="flex" style={{ gap: 8, flexWrap: 'wrap' }}>
                        {savedAthletes.map(a => (
                            <div key={a.id} style={{
                                padding: '6px 12px', borderRadius: 'var(--radius-full)',
                                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                                fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                                minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }} onClick={() => { setSelectedAthlete(a.id); setShowModal(true); }}>
                                {a.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Offers List */}
            {offers.length > 0 ? (
                <div className="flex-col" style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    {offers.map(offer => {
                        const athlete = allAthletes.find(a => a.id === offer.athleteId);
                        const typeInfo = PROGRAM_TYPES.find(p => p.value === offer.type) || PROGRAM_TYPES[0];
                        return (
                            <div key={offer.id} className="glass-card" style={{ padding: 'var(--space-md)' }}>
                                <div className="flex items-center justify-between mb-sm">
                                    <div className="flex items-center gap-sm">
                                        <span style={{ fontSize: '1.3rem' }}>{typeInfo.icon}</span>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{offer.academyName || 'Academy'}</div>
                                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                                                To: {athlete?.name || 'Athlete'} · {typeInfo.label}
                                            </div>
                                        </div>
                                    </div>
                                    {getStatusBadge(offer.status)}
                                </div>
                                <div className="flex" style={{ gap: 12, fontSize: '0.78rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                                    {offer.value && <span className="flex items-center gap-xs"><Banknote size={13} /> {offer.value}</span>}
                                    {offer.duration && <span className="flex items-center gap-xs"><Clock size={13} /> {offer.duration}</span>}
                                    {offer.location && <span className="flex items-center gap-xs"><MapPin size={13} /> {offer.location}</span>}
                                </div>
                                {offer.message && (
                                    <div className="mt-sm" style={{
                                        fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic',
                                        borderLeft: `3px solid ${typeInfo.color}`, paddingLeft: 'var(--space-sm)',
                                    }}>"{offer.message}"</div>
                                )}
                                {offer.status === 'pending' && (
                                    <div className="flex gap-sm mt-sm">
                                        <button className="btn btn-success" onClick={() => updateStatus(offer.id, 'accepted')}
                                            style={{ padding: '4px 12px', minHeight: 48, fontSize: '0.8rem', flex: 1 }}>
                                            <CheckCircle size={14} /> Accept
                                        </button>
                                        <button className="btn btn-danger" onClick={() => updateStatus(offer.id, 'declined')}
                                            style={{ padding: '4px 12px', minHeight: 48, fontSize: '0.8rem', flex: 1 }}>
                                            <XCircle size={14} /> Decline
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="glass-card text-center" style={{ padding: 'var(--space-3xl)' }}>
                    <Briefcase size={48} color="var(--text-muted)" style={{ marginBottom: 'var(--space-md)' }} />
                    <p className="text-secondary">No offers sent yet</p>
                    <p className="text-muted" style={{ fontSize: '0.82rem' }}>Click "Send Offer" to start recruiting</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="heading-3 flex items-center gap-sm">
                                <Send size={20} color="var(--accent-primary)" /> Send Offer
                            </h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}
                                style={{ width: 48, height: 48 }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Select Athlete</label>
                                <select className="form-select" value={selectedAthlete} onChange={e => setSelectedAthlete(e.target.value)} required>
                                    <option value="">Choose an athlete...</option>
                                    {allAthletes.map(a => (
                                        <option key={a.id} value={a.id}>{a.name} — {a.sport?.replace(/_/g, ' ')} ({a.district})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Academy / Organization</label>
                                <input className="form-input" type="text" placeholder="e.g. Tamil Nadu Sports Academy"
                                    value={form.academyName} onChange={e => setForm({ ...form, academyName: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Program Type</label>
                                <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                    {PROGRAM_TYPES.map(p => <option key={p.value} value={p.value}>{p.icon} {p.label}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Value / Benefits</label>
                                <input className="form-input" type="text" placeholder="e.g. ₹5,00,000 scholarship + boarding"
                                    value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Duration</label>
                                <input className="form-input" type="text" placeholder="e.g. 2 years"
                                    value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input className="form-input" type="text" placeholder="e.g. Chennai"
                                    value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Personal Message</label>
                                <textarea className="form-textarea" placeholder="Write a note to the athlete..."
                                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ minHeight: 120 }} />
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-sm)', minHeight: 48 }}>
                                <Send size={18} /> Send Offer
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
