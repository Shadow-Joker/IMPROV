import { CheckCircle, XCircle, Clock, Briefcase, MapPin, Banknote, MessageSquare } from 'lucide-react';

const TYPE_LABELS = {
    scholarship: { label: 'Scholarship', icon: '🎓', color: 'var(--accent-success)' },
    training: { label: 'Training Camp', icon: '🏋️', color: 'var(--accent-primary)' },
    trial: { label: 'Trial Invite', icon: '🏅', color: 'var(--accent-warning)' },
    sponsorship: { label: 'Sponsorship', icon: '💰', color: 'var(--accent-secondary)' },
};

export default function OfferCard({ offer, onAccept, onDecline }) {
    if (!offer) return null;

    const typeInfo = TYPE_LABELS[offer.type] || TYPE_LABELS.scholarship;

    const getStatusBadge = () => {
        switch (offer.status) {
            case 'accepted':
                return <span className="badge badge-verified"><CheckCircle size={12} /> Accepted</span>;
            case 'declined':
                return <span className="badge badge-danger"><XCircle size={12} /> Declined</span>;
            default:
                return <span className="badge badge-pending"><Clock size={12} /> Pending</span>;
        }
    };

    return (
        <div className="glass-card animate-fade-in" style={{ padding: 'var(--space-md)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-sm">
                <div className="flex items-center gap-sm">
                    <div style={{
                        width: 42, height: 42, borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-glass)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.3rem',
                    }}>
                        {typeInfo.icon}
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                            {offer.academyName || 'Academy'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: typeInfo.color, fontWeight: 600 }}>
                            {typeInfo.label}
                        </div>
                    </div>
                </div>
                {getStatusBadge()}
            </div>

            {/* Details */}
            <div className="flex-col gap-xs" style={{ display: 'flex', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {offer.value && (
                    <div className="flex items-center gap-xs">
                        <Banknote size={15} color="var(--accent-success)" />
                        <span>{offer.value}</span>
                    </div>
                )}
                {offer.duration && (
                    <div className="flex items-center gap-xs">
                        <Clock size={15} color="var(--accent-warning)" />
                        <span>{offer.duration}</span>
                    </div>
                )}
                {offer.location && (
                    <div className="flex items-center gap-xs">
                        <MapPin size={15} color="var(--accent-primary)" />
                        <span>{offer.location}</span>
                    </div>
                )}
            </div>

            {/* Message */}
            {offer.message && (
                <div className="mt-sm" style={{
                    padding: 'var(--space-sm) var(--space-md)',
                    background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: `3px solid ${typeInfo.color}`,
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic',
                }}>
                    <div className="flex items-center gap-xs mb-xs" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'normal' }}>
                        <MessageSquare size={12} /> Personal Message
                    </div>
                    "{offer.message}"
                </div>
            )}

            {/* Action Buttons (only for pending offers) */}
            {offer.status === 'pending' && (onAccept || onDecline) && (
                <div className="flex gap-sm mt-md">
                    {onAccept && (
                        <button
                            className="btn btn-success"
                            onClick={() => onAccept(offer.id)}
                            style={{ flex: 1, padding: '8px 16px', minHeight: '40px', fontSize: '0.85rem' }}
                        >
                            <CheckCircle size={16} /> Accept
                        </button>
                    )}
                    {onDecline && (
                        <button
                            className="btn btn-danger"
                            onClick={() => onDecline(offer.id)}
                            style={{ flex: 1, padding: '8px 16px', minHeight: '40px', fontSize: '0.85rem' }}
                        >
                            <XCircle size={16} /> Decline
                        </button>
                    )}
                </div>
            )}

            {/* Timestamp */}
            <div className="text-muted mt-sm" style={{ fontSize: '0.7rem', textAlign: 'right' }}>
                {offer.timestamp ? new Date(offer.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : ''}
            </div>
        </div>
    );
}
