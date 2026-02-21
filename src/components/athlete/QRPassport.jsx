/* ========================================
   SENTRAK — QRPassport Component
   Digital Talent Passport with QR code
   Owner: Rahul (feat/athlete)
   ======================================== */

import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, CreditCard } from 'lucide-react';
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
            // Use html2canvas-like approach with foreign object SVG
            const el = passportRef.current;
            const canvas = document.createElement('canvas');
            const scale = 2;
            canvas.width = el.offsetWidth * scale;
            canvas.height = el.offsetHeight * scale;
            const ctx = canvas.getContext('2d');

            // Background
            ctx.fillStyle = '#0a0e27';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw gradient bar
            const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
            grad.addColorStop(0, '#6366f1');
            grad.addColorStop(0.5, '#06b6d4');
            grad.addColorStop(1, '#10b981');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, 8 * scale);

            // Title
            ctx.fillStyle = '#f1f5f9';
            ctx.font = `bold ${16 * scale}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('SENTRAK Digital Talent Passport', canvas.width / 2, 40 * scale);

            // Name
            ctx.font = `bold ${20 * scale}px Inter, sans-serif`;
            ctx.fillText(athlete.name, canvas.width / 2, 70 * scale);

            // Tamil name
            if (athlete.nameTamil) {
                ctx.font = `${14 * scale}px Noto Sans Tamil, Inter, sans-serif`;
                ctx.fillStyle = '#94a3b8';
                ctx.fillText(athlete.nameTamil, canvas.width / 2, 90 * scale);
            }

            // Stats
            ctx.fillStyle = '#94a3b8';
            ctx.font = `${12 * scale}px Inter, sans-serif`;
            ctx.fillText(`${athlete.sport?.replace('_', ' ')} | Age: ${athlete.age} | ${athlete.district}`, canvas.width / 2, 115 * scale);

            // Rating
            ctx.fillStyle = '#6366f1';
            ctx.font = `bold ${24 * scale}px Inter, sans-serif`;
            ctx.fillText(`${athlete.talentRating} — ${tier.name}`, canvas.width / 2, 145 * scale);

            // QR Code — render as image from SVG
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

                    // Trigger download
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

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-sm mb-md">
                <CreditCard size={20} className="text-accent" />
                <h3 className="heading-3">{t('digitalPassport', language)}</h3>
            </div>

            {/* Passport card */}
            <div
                ref={passportRef}
                className="glass-card-static"
                style={{
                    maxWidth: '400px',
                    margin: '0 auto',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Gradient top bar */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'var(--gradient-hero)',
                }} />

                <div className="text-center" style={{ paddingTop: 'var(--space-md)' }}>
                    {/* Header */}
                    <p className="text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
                        SENTRAK Digital Talent Passport
                    </p>

                    {/* Photo */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden',
                        border: '3px solid var(--accent-primary)',
                        margin: 'var(--space-md) auto',
                        background: 'var(--bg-tertiary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {athlete.photoURL ? (
                            <img src={athlete.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontSize: '2rem' }}>🏅</span>
                        )}
                    </div>

                    {/* Name */}
                    <h3 className="heading-3">{athlete.name}</h3>
                    {athlete.nameTamil && (
                        <p className="tamil text-secondary" style={{ fontSize: '0.9rem' }}>{athlete.nameTamil}</p>
                    )}

                    {/* Key stats */}
                    <div className="flex justify-center gap-md mt-md flex-wrap">
                        <div>
                            <p className="text-muted" style={{ fontSize: '0.7rem' }}>SPORT</p>
                            <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{athlete.sport?.replace('_', ' ')}</p>
                        </div>
                        <div>
                            <p className="text-muted" style={{ fontSize: '0.7rem' }}>AGE</p>
                            <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{athlete.age}</p>
                        </div>
                        <div>
                            <p className="text-muted" style={{ fontSize: '0.7rem' }}>DISTRICT</p>
                            <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{athlete.district}</p>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="mt-md mb-md">
                        <span className="text-gradient" style={{ fontSize: '2rem', fontWeight: 900 }}>
                            {athlete.talentRating || 1000}
                        </span>
                        <span className={`badge ${tier.class}`} style={{ marginLeft: '8px' }}>
                            {tier.name}
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="section-divider" />

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
                    <p className="text-muted" style={{ fontSize: '0.7rem', marginTop: 'var(--space-xs)' }}>
                        Scan to view full profile
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
        </div>
    );
}
