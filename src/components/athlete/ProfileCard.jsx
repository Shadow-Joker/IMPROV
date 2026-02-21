/* ========================================
   SENTRAK — ProfileCard Component (Phase 2)
   Premium athlete profile with gradient hero,
   circular photo, tier badge, embedded radar,
   assessment list, schemes, and share FAB
   Owner: Rahul (feat/athlete)
   ======================================== */

import { useState } from 'react';
import { Share2, Shield, Star, MapPin, Trophy, Activity, User, Award, ChevronRight } from 'lucide-react';
import { getRatingTier, DEMO_ASSESSMENTS } from '../../utils/dataShapes';
import { t } from '../../utils/translations';
import MentalRadarChart from './MentalRadarChart';
import SchemesMatcher from './SchemesMatcher';

export default function ProfileCard({ athlete, language = 'en' }) {
    const [shareToast, setShareToast] = useState(false);

    if (!athlete) return null;

    const tier = getRatingTier(athlete.talentRating || 1000);
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
                setShareToast(true);
                setTimeout(() => setShareToast(false), 2000);
            }
        } catch {
            try {
                await navigator.clipboard.writeText(url);
                setShareToast(true);
                setTimeout(() => setShareToast(false), 2000);
            } catch { /* noop */ }
        }
    };

    return (
        <div className="animate-fade-in flex-col gap-lg" style={{ display: 'flex' }}>
            {/* ─── HERO SECTION ─── */}
            <div className="glass-card-static" style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.1), rgba(16,185,129,0.08))',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Background decoration */}
                <div style={{
                    position: 'absolute', top: '-40px', right: '-40px',
                    width: '120px', height: '120px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent)',
                    pointerEvents: 'none',
                }} />

                <div className="flex gap-lg items-center flex-wrap">
                    {/* Circular photo */}
                    <div style={{
                        width: '100px', height: '100px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '3px solid var(--accent-primary)',
                        boxShadow: '0 0 20px rgba(99,102,241,0.3)',
                        flexShrink: 0,
                        background: 'var(--bg-tertiary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {athlete.photoURL ? (
                            <img src={athlete.photoURL} alt={athlete.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <User size={40} color="var(--text-muted)" />
                        )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: '180px' }}>
                        <h2 className="heading-2" style={{ marginBottom: '2px' }}>{athlete.name}</h2>
                        {athlete.nameTamil && (
                            <p className="tamil text-secondary" style={{ fontSize: '1rem', marginBottom: '8px' }}>
                                {athlete.nameTamil}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-xs">
                            <span className="badge badge-verified">
                                <Trophy size={11} /> {athlete.sport?.replace('_', ' ')}
                            </span>
                            <span className="badge badge-pending">
                                {athlete.age} {t('age', language)}
                            </span>
                            <span className="badge" style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: 'var(--text-muted)', fontSize: '0.7rem',
                            }}>
                                <MapPin size={10} /> {athlete.district}
                            </span>
                        </div>
                        {athlete.village && (
                            <p className="text-muted mt-xs" style={{ fontSize: '0.8rem' }}>
                                📍 {athlete.village}, {athlete.district}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── TALENT RATING ─── */}
            <div className="glass-card-static text-center" style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Background glow */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: `radial-gradient(circle at center, ${tier.class?.includes('gold') ? 'rgba(245,158,11,0.08)' : tier.class?.includes('platinum') ? 'rgba(168,162,158,0.08)' : 'rgba(99,102,241,0.06)'}, transparent)`,
                    pointerEvents: 'none',
                }} />
                <p className="text-secondary mb-xs" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
                    {t('talentRating', language)}
                </p>
                <div className="flex items-center justify-center gap-md">
                    <span style={{
                        fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', fontWeight: 900, lineHeight: 1,
                        background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        {athlete.talentRating || 1000}
                    </span>
                    <span className={`badge ${tier.class}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                        <Star size={14} /> {tier.name}
                    </span>
                </div>
            </div>

            {/* ─── MENTAL PROFILE ─── */}
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

            {/* ─── ASSESSMENTS ─── */}
            {assessments.length > 0 ? (
                <div className="glass-card-static">
                    <h3 className="heading-3 mb-md flex items-center gap-sm">
                        <Shield size={20} className="text-accent" />
                        {t('assessments', language)}
                        <span className="badge badge-verified" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
                            {assessments.length}
                        </span>
                    </h3>
                    <div className="flex-col gap-sm" style={{ display: 'flex' }}>
                        {assessments.slice(0, 5).map((a) => (
                            <div
                                key={a.id}
                                className="flex justify-between items-center"
                                style={{
                                    padding: '12px 16px',
                                    background: 'var(--bg-glass)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    transition: 'background 0.2s ease',
                                }}
                            >
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                        {a.testType?.replace(/_/g, ' ')}
                                    </p>
                                    <p className="text-muted" style={{ fontSize: '0.72rem' }}>
                                        {a.sport?.replace('_', ' ')} • {a.testCategory?.toUpperCase()}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.95rem' }}>
                                        {a.value} {a.unit}
                                    </p>
                                    {a.attestations?.length >= 3 ? (
                                        <span className="badge badge-verified" style={{ fontSize: '0.6rem' }}>
                                            <Shield size={9} /> {t('verified', language)}
                                        </span>
                                    ) : (
                                        <span className="badge badge-pending" style={{ fontSize: '0.6rem' }}>
                                            {t('pending', language)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="glass-card-static text-center" style={{ padding: 'var(--space-xl)' }}>
                    <Shield size={32} className="text-muted" style={{ marginBottom: '8px' }} />
                    <p className="text-secondary" style={{ fontSize: '0.85rem' }}>{t('firstAssessmentCTA', language)}</p>
                </div>
            )}

            {/* ─── SCHEMES ─── */}
            <SchemesMatcher athlete={athlete} language={language} />

            {/* ─── SHARE BUTTON ─── */}
            <button
                className="btn btn-primary btn-lg"
                onClick={handleShare}
                style={{
                    width: '100%',
                    background: 'var(--gradient-hero)',
                    gap: '8px',
                }}
            >
                <Share2 size={18} /> {t('shareProfile', language)}
            </button>

            {/* Share toast */}
            {shareToast && (
                <div className="toast toast-success animate-slide-up" style={{ position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)' }}>
                    ✓ {t('copiedToClipboard', language)}
                </div>
            )}
        </div>
    );
}
