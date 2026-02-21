/* ========================================
   SENTRAK — ProfileCard Component
   LinkedIn-premium style athlete profile card
   Owner: Rahul (feat/athlete)
   ======================================== */

import { Share2, Shield, Star, MapPin, Trophy, Activity } from 'lucide-react';
import { getRatingTier } from '../../utils/dataShapes';
import { DEMO_ASSESSMENTS } from '../../utils/dataShapes';
import { t } from '../../utils/translations';
import MentalRadarChart from './MentalRadarChart';
import SchemesMatcher from './SchemesMatcher';

export default function ProfileCard({ athlete, language = 'en' }) {
    if (!athlete) return null;

    const tier = getRatingTier(athlete.talentRating || 1000);

    // Get assessments for this athlete
    const assessments = athlete.assessments?.length
        ? athlete.assessments
        : DEMO_ASSESSMENTS.filter((a) => a.athleteId === athlete.id);

    const handleShare = async () => {
        const url = `${window.location.origin}/profile/${athlete.id}`;
        const shareData = {
            title: `${athlete.name} — SENTRAK Profile`,
            text: `Check out ${athlete.name}'s athlete profile on SENTRAK`,
            url,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(url);
                alert(t('shareSuccess', language));
            }
        } catch {
            try {
                await navigator.clipboard.writeText(url);
                alert(t('shareSuccess', language));
            } catch { /* noop */ }
        }
    };

    return (
        <div className="animate-fade-in flex-col gap-lg" style={{ display: 'flex' }}>
            {/* Hero Section */}
            <div className="glass-card-static">
                <div className="flex gap-lg items-center flex-wrap">
                    {/* Photo */}
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden',
                        border: '3px solid var(--accent-primary)',
                        boxShadow: 'var(--shadow-glow)',
                        flexShrink: 0,
                        background: 'var(--bg-tertiary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {athlete.photoURL ? (
                            <img
                                src={athlete.photoURL}
                                alt={athlete.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <span style={{ fontSize: '2.5rem' }}>🏅</span>
                        )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <h2 className="heading-2">{athlete.name}</h2>
                        {athlete.nameTamil && (
                            <p className="tamil text-secondary" style={{ fontSize: '1.1rem' }}>{athlete.nameTamil}</p>
                        )}
                        <div className="flex flex-wrap gap-sm mt-sm">
                            <span className="badge badge-verified">
                                <Trophy size={12} /> {athlete.sport?.replace('_', ' ')}
                            </span>
                            <span className="badge badge-pending">
                                {athlete.age} {t('age', language)}
                            </span>
                            <span className="badge" style={{
                                background: 'var(--bg-glass)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--text-secondary)',
                            }}>
                                <MapPin size={12} /> {athlete.district}
                            </span>
                        </div>
                        {athlete.village && (
                            <p className="text-muted mt-sm" style={{ fontSize: '0.85rem' }}>
                                📍 {athlete.village}, {athlete.district}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Talent Rating */}
            <div className="glass-card-static text-center">
                <p className="text-secondary mb-sm" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {t('talentRating', language)}
                </p>
                <div className="flex items-center justify-center gap-md">
                    <span className="text-gradient" style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, lineHeight: 1 }}>
                        {athlete.talentRating || 1000}
                    </span>
                    <span className={`badge ${tier.class}`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
                        <Star size={16} /> {tier.name}
                    </span>
                </div>
            </div>

            {/* Mental Profile */}
            {athlete.mentalProfile && Object.values(athlete.mentalProfile).some(v => v > 0) && (
                <div className="glass-card-static">
                    <h3 className="heading-3 mb-md flex items-center gap-sm">
                        <Activity size={20} className="text-accent" />
                        {t('mentalScore', language)}
                    </h3>
                    <MentalRadarChart
                        profile={athlete.mentalProfile}
                        score={athlete.mentalScore || 0}
                        language={language}
                    />
                </div>
            )}

            {/* Assessments */}
            {assessments.length > 0 && (
                <div className="glass-card-static">
                    <h3 className="heading-3 mb-md flex items-center gap-sm">
                        <Shield size={20} className="text-accent" />
                        {t('assessments', language)}
                    </h3>
                    <div className="flex-col gap-sm" style={{ display: 'flex' }}>
                        {assessments.map((a) => (
                            <div
                                key={a.id}
                                className="flex justify-between items-center"
                                style={{
                                    padding: '12px 16px',
                                    background: 'var(--bg-glass)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                }}
                            >
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                        {a.testType?.replace(/_/g, ' ')}
                                    </p>
                                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                                        {a.sport?.replace('_', ' ')} • {a.testCategory?.toUpperCase()}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                                        {a.value} {a.unit}
                                    </p>
                                    <div className="flex items-center gap-xs">
                                        {a.attestations?.length >= 3 ? (
                                            <span className="badge badge-verified" style={{ fontSize: '0.65rem' }}>
                                                <Shield size={10} /> {t('verified', language)}
                                            </span>
                                        ) : (
                                            <span className="badge badge-pending" style={{ fontSize: '0.65rem' }}>
                                                {t('pending', language)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Schemes */}
            <SchemesMatcher athlete={athlete} language={language} />

            {/* Share */}
            <button className="btn btn-primary btn-lg" onClick={handleShare} style={{ width: '100%' }}>
                <Share2 size={18} /> {t('share', language)}
            </button>
        </div>
    );
}
