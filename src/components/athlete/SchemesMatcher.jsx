/* ========================================
   SENTRAK — SchemesMatcher Component
   Shows matching government schemes as cards
   Owner: Rahul (feat/athlete)
   ======================================== */

import { Award, ExternalLink, CheckCircle } from 'lucide-react';
import { matchSchemes } from '../../utils/schemes';
import { t } from '../../utils/translations';

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

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-sm mb-md">
                <Award size={24} className="text-accent" />
                <h3 className="heading-3">{t('schemesTitle', language)}</h3>
                <span className="badge badge-verified">{matched.length}</span>
            </div>

            {matched.length === 0 ? (
                <div className="glass-card-static text-center" style={{ padding: 'var(--space-2xl)' }}>
                    <p className="text-secondary">{t('noSchemes', language)}</p>
                </div>
            ) : (
                <div className="flex-col gap-md" style={{ display: 'flex' }}>
                    {matched.map((scheme, i) => (
                        <div
                            key={scheme.id}
                            className="glass-card animate-slide-up"
                            style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
                        >
                            <div className="flex justify-between items-center mb-sm">
                                <div style={{ flex: 1 }}>
                                    <h4 className="heading-4">{scheme.name}</h4>
                                    <p className="tamil text-secondary" style={{ fontSize: '0.85rem' }}>{scheme.nameTamil}</p>
                                </div>
                                <div className="badge badge-verified" style={{ flexShrink: 0 }}>
                                    <CheckCircle size={12} /> {t('youQualify', language)}
                                </div>
                            </div>

                            <p className="text-secondary mb-md" style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                                {scheme.description}
                            </p>

                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{t('benefit', language)}</span>
                                    <p style={{ fontWeight: 700, color: 'var(--accent-success)', fontSize: '1.1rem' }}>
                                        {scheme.benefitAmount}
                                    </p>
                                </div>
                                <a
                                    href={scheme.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-ghost"
                                    style={{ fontSize: '0.85rem' }}
                                >
                                    {t('learnMore', language)} <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
