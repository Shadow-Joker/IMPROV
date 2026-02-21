import { useState, useEffect } from 'react';
import { Send, Briefcase, X, Clock, CheckCircle, XCircle, Banknote, MapPin, MessageSquare } from 'lucide-react';
import { createOffer, DEMO_ATHLETES } from '../../utils/dataShapes';

const PROGRAM_TYPES = [
    { value: 'scholarship', label: 'Scholarship', icon: '🎓' },
    { value: 'training', label: 'Training Camp', icon: '🏋️' },
    { value: 'trial', label: 'Trial Invite', icon: '🏅' },
    { value: 'sponsorship', label: 'Sponsorship', icon: '💰' },
];

export default function RecruitmentPortal({ athletes = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedAthlete, setSelectedAthlete] = useState('');
    const [offers, setOffers] = useState([]);
    const [form, setForm] = useState({
        academyName: '',
        type: 'scholarship',
        value: '',
        duration: '',
        location: '',
        message: '',
    });
    const [toast, setToast] = useState(null);

    // Load offers from localStorage
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('sentrak_offers') || '[]');
            setOffers(saved);
        } catch { setOffers([]); }
    }, []);

    const allAthletes = athletes.length > 0 ? athletes : DEMO_ATHLETES;

    const handleSubmit = (e) => {
        e.preventDefault();
        const offer = createOffer({
            ...form,
            athleteId: selectedAthlete,
            scoutName: 'Demo Scout',
            scoutId: 'scout-demo',
        });

        const updated = [offer, ...offers];
        setOffers(updated);
        localStorage.setItem('sentrak_offers', JSON.stringify(updated));

        setShowModal(false);
        setForm({ academyName: '', type: 'scholarship', value: '', duration: '', location: '', message: '' });
        setSelectedAthlete('');
        setToast('Offer sent successfully!');
        setTimeout(() => setToast(null), 3000);
    };

    const updateStatus = (offerId, status) => {
        const updated = offers.map(o => o.id === offerId ? { ...o, status } : o);
        setOffers(updated);
        localStorage.setItem('sentrak_offers', JSON.stringify(updated));
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'accepted': return <span className="badge badge-verified"><CheckCircle size={12} /> Accepted</span>;
            case 'declined': return <span className="badge badge-danger"><XCircle size={12} /> Declined</span>;
            default: return <span className="badge badge-pending"><Clock size={12} /> Pending</span>;
        }
    };

    const getProgramIcon = (type) => {
        return PROGRAM_TYPES.find(p => p.value === type)?.icon || '📋';
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-md">
                <h3 className="heading-4 flex items-center gap-sm">
                    <Briefcase size={20} color="var(--accent-warning)" />
                    Recruitment Portal
                </h3>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                    style={{ padding: '8px 16px', minHeight: '40px', fontSize: '0.85rem' }}
                >
                    <Send size={16} /> Send Offer
                </button>
            </div>

            {/* Offers List */}
            {offers.length > 0 ? (
                <div className="flex-col gap-sm" style={{ display: 'flex' }}>
                    {offers.map(offer => {
                        const athlete = allAthletes.find(a => a.id === offer.athleteId);
                        return (
                            <div key={offer.id} className="glass-card" style={{ padding: 'var(--space-md)' }}>
                                <div className="flex items-center justify-between mb-sm">
                                    <div className="flex items-center gap-sm">
                                        <span style={{ fontSize: '1.2rem' }}>{getProgramIcon(offer.type)}</span>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{offer.academyName || 'Academy'}</div>
                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                To: {athlete?.name || 'Unknown Athlete'} · {PROGRAM_TYPES.find(p => p.value === offer.type)?.label}
                                            </div>
                                        </div>
                                    </div>
                                    {getStatusBadge(offer.status)}
                                </div>

                                <div className="flex flex-wrap gap-sm" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    {offer.value && (
                                        <span className="flex items-center gap-xs"><Banknote size={14} /> {offer.value}</span>
                                    )}
                                    {offer.duration && (
                                        <span className="flex items-center gap-xs"><Clock size={14} /> {offer.duration}</span>
                                    )}
                                    {offer.location && (
                                        <span className="flex items-center gap-xs"><MapPin size={14} /> {offer.location}</span>
                                    )}
                                </div>

                                {offer.message && (
                                    <div className="mt-sm" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '2px solid var(--accent-primary)', paddingLeft: 'var(--space-sm)' }}>
                                        "{offer.message}"
                                    </div>
                                )}

                                {offer.status === 'pending' && (
                                    <div className="flex gap-sm mt-sm">
                                        <button className="btn btn-success" onClick={() => updateStatus(offer.id, 'accepted')} style={{ padding: '4px 12px', minHeight: '32px', fontSize: '0.75rem' }}>
                                            <CheckCircle size={14} /> Accept
                                        </button>
                                        <button className="btn btn-danger" onClick={() => updateStatus(offer.id, 'declined')} style={{ padding: '4px 12px', minHeight: '32px', fontSize: '0.75rem' }}>
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
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>Click "Send Offer" to start recruiting talent</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="heading-3 flex items-center gap-sm">
                                <Send size={20} color="var(--accent-primary)" />
                                Send Offer
                            </h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)} style={{ width: 36, height: 36 }}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Select Athlete */}
                            <div className="form-group">
                                <label className="form-label">Select Athlete</label>
                                <select className="form-select" value={selectedAthlete} onChange={e => setSelectedAthlete(e.target.value)} required>
                                    <option value="">Choose an athlete...</option>
                                    {allAthletes.map(a => (
                                        <option key={a.id} value={a.id}>{a.name} — {a.sport?.replace(/_/g, ' ')} ({a.district})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Academy Name */}
                            <div className="form-group">
                                <label className="form-label">Academy / Organization Name</label>
                                <input className="form-input" type="text" placeholder="e.g. Tamil Nadu Sports Academy" value={form.academyName} onChange={e => setForm({ ...form, academyName: e.target.value })} required />
                            </div>

                            {/* Program Type */}
                            <div className="form-group">
                                <label className="form-label">Program Type</label>
                                <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                    {PROGRAM_TYPES.map(p => (
                                        <option key={p.value} value={p.value}>{p.icon} {p.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Value/Benefits */}
                            <div className="form-group">
                                <label className="form-label">Value / Benefits</label>
                                <input className="form-input" type="text" placeholder="e.g. ₹5,00,000 scholarship + boarding" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
                            </div>

                            {/* Duration */}
                            <div className="form-group">
                                <label className="form-label">Duration</label>
                                <input className="form-input" type="text" placeholder="e.g. 2 years" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                            </div>

                            {/* Location */}
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input className="form-input" type="text" placeholder="e.g. Chennai, Tamil Nadu" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                            </div>

                            {/* Personal Message */}
                            <div className="form-group">
                                <label className="form-label">Personal Message</label>
                                <textarea className="form-textarea" placeholder="Write a personal note to the athlete..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ minHeight: 80 }} />
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-sm)' }}>
                                <Send size={18} /> Send Offer
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className="toast toast-success">
                    <CheckCircle size={16} /> {toast}
                </div>
            )}
        </div>
    );
}
