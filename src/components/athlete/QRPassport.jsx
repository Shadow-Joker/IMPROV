/* ========================================
   SENTRAK — QRPassport Component (Phase 2)
   Digital Talent Passport with gradient top bar,
   holographic watermark, stat columns, QR code,
   canvas download, and print support
   Owner: Rahul (feat/athlete)
   ======================================== */

import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, CreditCard, Star, User } from 'lucide-react';
import { getRatingTier } from '../../utils/dataShapes';
import { t } from '../../utils/translations';

export default function QRPassport({ athlete, language = 'en' }) {
    if (!athlete) return null;

    const passportRef = useRef(null);
    const tier = getRatingTier(athlete.talentRating || 1000);
    const profileUrl = `${window.location.origin}/profile/${athlete.id}`;

    const handleDownload = async () => {
        if (!passportRef.current) return;

        try {
            const el = passportRef.current;
            const canvas = document.createElement('canvas');
            const scale = 2;
            canvas.width = el.offsetWidth * scale;
            canvas.height = el.offsetHeight * scale;
            const ctx = canvas.getContext('2d');

            // Background
            ctx.fillStyle = '#0a0e27';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Gradient bar
            const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
            grad.addColorStop(0, '#6366f1');
            grad.addColorStop(0.5, '#06b6d4');
            grad.addColorStop(1, '#10b981');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, 8 * scale);

            ctx.fillStyle = '#f1f5f9';
            ctx.font = `bold ${16 * scale}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('SENTRAK Digital Talent Passport', canvas.width / 2, 40 * scale);

            ctx.font = `bold ${20 * scale}px Inter, sans-serif`;
            ctx.fillText(athlete.name, canvas.width / 2, 70 * scale);

            if (athlete.nameTamil) {
                ctx.font = `${14 * scale}px Noto Sans Tamil, Inter, sans-serif`;
                ctx.fillStyle = '#94a3b8';
                ctx.fillText(athlete.nameTamil, canvas.width / 2, 90 * scale);
            }

            ctx.fillStyle = '#94a3b8';
            ctx.font = `${12 * scale}px Inter, sans-serif`;
            ctx.fillText(`${athlete.sport?.replace('_', ' ')} | Age: ${athlete.age} | ${athlete.district}`, canvas.width / 2, 115 * scale);

            ctx.fillStyle = '#6366f1';
            ctx.font = `bold ${24 * scale}px Inter, sans-serif`;
            ctx.fillText(`${athlete.talentRating} — ${tier.name}`, canvas.width / 2, 145 * scale);

            // QR Code from SVG
            const svgEl = el.querySelector('svg');
            if (svgEl) {
                const svgData = new XMLSerializer().serializeToString(svgEl);
                const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(svgBlob);
                const img = new Image();
                img.onload = () => {
                    const qrSize = 120 * scale;
                    ctx.drawImage(img, (canvas.width - qrSize) / 2, 160 * scale, qrSize, qrSize);
                    URL.revokeObjectURL(url);

                    canvas.toBlob((blob) => {
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(blob);
                        a.download = `sentrak-passport-${athlete.name.replace(/\s/g, '-')}.png`;
                        a.click();
                        URL.revokeObjectURL(a.href);
                    }, 'image/png');
                };
                img.src = url;
            }
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    const handlePrint = () => window.print();

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-sm mb-md">
                <CreditCard size={20} className="text-accent" />
                <h3 className="heading-3">{t('digitalPassport', language)}</h3>
            </div>

            {/* Passport card */}
            <div
                ref={passportRef}
                className="glass-card-static passport-card"
                style={{
                    maxWidth: '400px',
                    margin: '0 auto',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Gradient top bar */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #6366f1, #06b6d4, #10b981)',
                }} />

                {/* Holographic watermark */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-30deg)',
                    fontSize: '6rem', fontWeight: 900,
                    opacity: 0.03,
                    color: 'white',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    letterSpacing: '0.1em',
                }}>SENTRAK</div>

                <div className="text-center" style={{ paddingTop: 'var(--space-lg)', position: 'relative' }}>
                    {/* Header */}
                    <p className="text-muted" style={{
                        fontSize: '0.65rem', letterSpacing: '0.2em',
                        textTransform: 'uppercase', fontWeight: 700,
                    }}>
                        SENTRAK Digital Talent Passport
                    </p>

                    {/* Photo */}
                    <div style={{
                        width: '80px', height: '80px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '3px solid var(--accent-primary)',
                        boxShadow: '0 0 16px rgba(99,102,241,0.3)',
                        margin: 'var(--space-md) auto',
                        background: 'var(--bg-tertiary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {athlete.photoURL ? (
                            <img src={athlete.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <User size={32} color="var(--text-muted)" />
                        )}
                    </div>

                    {/* Name */}
                    <h3 className="heading-3" style={{ marginBottom: '2px' }}>{athlete.name}</h3>
                    {athlete.nameTamil && (
                        <p className="tamil text-secondary" style={{ fontSize: '0.85rem' }}>{athlete.nameTamil}</p>
                    )}

                    {/* Stats row */}
                    <div className="flex justify-center gap-lg mt-md flex-wrap"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                        {[
                            { label: language === 'ta' ? 'விளையாட்டு' : 'SPORT', value: athlete.sport?.replace('_', ' ') },
                            { label: language === 'ta' ? 'வயது' : 'AGE', value: athlete.age },
                            { label: language === 'ta' ? 'மாவட்டம்' : 'DISTRICT', value: athlete.district },
                        ].map(s => (
                            <div key={s.label}>
                                <p className="text-muted" style={{ fontSize: '0.6rem', letterSpacing: '0.1em', fontWeight: 600 }}>{s.label}</p>
                                <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Rating with tier */}
                    <div className="mt-md mb-md" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}>
                        <span style={{
                            fontSize: '2rem', fontWeight: 900,
                            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            {athlete.talentRating || 1000}
                        </span>
                        <span className={`badge ${tier.class}`}>
                            <Star size={12} /> {tier.name}
                        </span>
                    </div>

                    {/* Divider */}
                    <div style={{
                        height: '1px', margin: '0 auto',
                        width: '60%',
                        background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)',
                    }} />

                    {/* QR Code */}
                    <div style={{ margin: 'var(--space-md) auto', display: 'inline-block' }}>
                        <QRCodeSVG
                            value={profileUrl}
                            size={120}
                            bgColor="transparent"
                            fgColor="#f1f5f9"
                            level="M"
                        />
                    </div>
                    <p className="text-muted" style={{ fontSize: '0.65rem', marginBottom: 'var(--space-sm)' }}>
                        {language === 'ta' ? 'முழு சுயவிவரத்தைக் காண ஸ்கேன் செய்யுங்கள்' : 'Scan to view full profile'}
                    </p>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-sm justify-center mt-lg">
                <button className="btn btn-primary" onClick={handleDownload}>
                    <Download size={16} /> {t('downloadPassport', language)}
                </button>
                <button className="btn btn-secondary" onClick={handlePrint}>
                    <Printer size={16} /> {t('printPassport', language)}
                </button>
            </div>

            <style>{`
                .passport-card {
                    box-shadow: 0 4px 30px rgba(99,102,241,0.1), 0 1px 3px rgba(0,0,0,0.3);
                }
                @media print {
                    .passport-card { break-inside: avoid; }
                }
            `}</style>
        </div>
    );
}
