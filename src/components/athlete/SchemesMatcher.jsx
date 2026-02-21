/* ========================================
   SENTRAK — SchemesMatcher Component (Phase 2)
   Matching schemes with qualification badges,
   total potential value, gradient benefit amounts,
   staggered card animations, and CTA for no matches
   Owner: Rahul (feat/athlete)
   ======================================== */

import { Award, ExternalLink, CheckCircle, Target, IndianRupee } from 'lucide-react';
import { matchSchemes } from '../../utils/schemes';
import { t } from '../../utils/translations';

// Parse benefit amount string to number for totaling (crude but works for demo)
function parseBenefit(str) {
    if (!str) return 0;
    const cleaned = str.replace(/[₹,/year+\s]/g, '');
    // Handle range like "50,000-5,00,000" — take the max
    const parts = cleaned.split('-');
    const num = parseInt(parts[parts.length - 1].replace(/,/g, ''), 10);
    return isNaN(num) ? 0 : num;
}

function formatRupees(num) {
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
    return `₹${num}`;
}

export default function SchemesMatcher({ athlete, language = 'en' }) {
    const matched = matchSchemes(athlete);

    if (!athlete || !athlete.age) {
        return (
            <div className="glass-card-static text-center animate-fade-in" style={{ padding: 'var(--space-2xl)' }}>
                <Award size={40} className="text-muted" style={{ marginBottom: 'var(--space-md)' }} />
                <p className="text-secondary">{t('noSchemes', language)}</p>
            </div>
        );
    }

    const totalPotential = matched.reduce((sum, s) => sum + parseBenefit(s.benefitAmount), 0);

    return (
        <div className="animate-fade-in">
            {/* Header with match count */}
            <div className="flex items-center gap-sm mb-md">
                <Award size={24} className="text-accent" />
                <h3 className="heading-3">{t('schemesTitle', language)}</h3>
                <span className="badge badge-verified" style={{ marginLeft: 'auto' }}>
                    {matched.length} {language === 'ta' ? 'திட்டங்கள்' : 'schemes'}
                </span>
            </div>

            {matched.length === 0 ? (
                <div className="glass-card-static text-center" style={{ padding: 'var(--space-2xl)' }}>
                    <Target size={40} className="text-muted" style={{ marginBottom: 'var(--space-md)' }} />
                    <p className="text-secondary mb-md">{t('noSchemes', language)}</p>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                        {language === 'ta'
                            ? 'மேலும் மதிப்பீடுகளை முடிக்கவும் மற்றும் உங்கள் திறமை மதிப்பீட்டை உயர்த்தவும்'
                            : 'Complete more assessments and improve your talent rating to qualify'}
                    </p>
                </div>
            ) : (
                <>
                    {/* Total potential value banner */}
                    {totalPotential > 0 && (
                        <div className="glass-card-static mb-md animate-fade-in" style={{
                            background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(99,102,241,0.1))',
                            textAlign: 'center',
                            padding: 'var(--space-md)',
                        }}>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                {t('totalPotentialValue', language)}
                            </span>
                            <p style={{
                                fontSize: '1.75rem', fontWeight: 900,
                                background: 'linear-gradient(135deg, #10b981, #6366f1)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                {formatRupees(totalPotential)}+
                            </p>
                        </div>
                    )}

                    {/* Scheme cards */}
                    <div className="flex-col gap-md" style={{ display: 'flex' }}>
                        {matched.map((scheme, i) => (
                            <div
                                key={scheme.id}
                                className="glass-card scheme-card-appear"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className="flex justify-between items-start mb-sm">
                                    <div style={{ flex: 1 }}>
                                        <h4 className="heading-4">{scheme.name}</h4>
                                        <p className="tamil text-secondary" style={{ fontSize: '0.8rem' }}>
                                            {scheme.nameTamil}
                                        </p>
                                    </div>
                                    <div className="badge badge-verified" style={{ flexShrink: 0, fontSize: '0.7rem' }}>
                                        <CheckCircle size={12} /> {t('youQualify', language)}
                                    </div>
                                </div>

                                <p className="text-secondary mb-md" style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                                    {scheme.description}
                                </p>

                                {/* Benefit summary */}
                                <p className="text-muted mb-sm" style={{ fontSize: '0.8rem' }}>
                                    {scheme.benefit}
                                </p>

                                <div className="flex justify-between items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                                    <div>
                                        <span className="text-muted" style={{ fontSize: '0.7rem', display: 'block' }}>
                                            {t('benefit', language)}
                                        </span>
                                        <span style={{
                                            fontWeight: 800, fontSize: '1.1rem',
                                            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}>
                                            {scheme.benefitAmount}
                                        </span>
                                    </div>
                                    <a
                                        href={scheme.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-ghost"
                                        style={{ fontSize: '0.8rem' }}
                                    >
                                        {t('applyNow', language)} <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <style>{`
                .scheme-card-appear {
                    animation: schemeSlideUp 0.4s ease-out backwards;
                }
                @keyframes schemeSlideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
