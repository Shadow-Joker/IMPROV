import { useState, useEffect } from 'react';
import { createAttestation } from '../../utils/dataShapes';
import { generateHash } from '../../utils/hashVerify';
import { Shield, CheckCircle, Phone, User, Fingerprint, Lock, ShieldCheck, Mail, Send } from 'lucide-react';

const ConfettiBurst = () => (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
        {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{
                position: 'absolute',
                top: '-20px',
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#06b6d4', '#ef4444'][Math.floor(Math.random() * 5)],
                animation: `confetti-fall ${Math.random() * 2 + 1.5}s linear forwards`,
                animationDelay: `${Math.random() * 0.2}s`,
                opacity: 0,
                transform: `rotate(${Math.random() * 360}deg)`
            }} />
        ))}
        <style>{`
            @keyframes confetti-fall {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
            }
        `}</style>
    </div>
);

/**
 * AttestationForm — 3 witness verification slots with OTP and Hash visualization
 * Props: { assessmentId, baseAssessment, onComplete(attestations[], hash) }
 */
export default function AttestationForm({ assessmentId, baseAssessment = { athleteId: 'tmp', testType: 'tmp', value: 0 }, onComplete }) {
    const [witnesses, setWitnesses] = useState([
        { id: 1, name: '', phone: '', otp: '', otpSent: false, verified: false, resendTimer: 0 },
        { id: 2, name: '', phone: '', otp: '', otpSent: false, verified: false, resendTimer: 0 },
        { id: 3, name: '', phone: '', otp: '', otpSent: false, verified: false, resendTimer: 0 },
    ]);

    const [generatedHash, setGeneratedHash] = useState(null);

    // Timer effect for resend OTP
    useEffect(() => {
        const intervals = witnesses.map((w, index) => {
            if (w.resendTimer > 0) {
                return setInterval(() => {
                    setWitnesses(prev => {
                        const next = [...prev];
                        next[index].resendTimer -= 1;
                        return next;
                    });
                }, 1000);
            }
            return null;
        });

        return () => {
            intervals.forEach(int => int && clearInterval(int));
        };
    }, [witnesses]);

    const verifiedCount = witnesses.filter(w => w.verified).length;
    const allVerified = verifiedCount === 3;

    // Generate hash dynamically upon all verified
    useEffect(() => {
        if (allVerified && !generatedHash) {
            const attestations = witnesses.map(w => ({ witnessPhone: w.phone }));
            const mockAssessment = { ...baseAssessment, attestations };
            generateHash(mockAssessment).then(hash => {
                setGeneratedHash(hash);
                if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]); // Success pattern
            });
        }
    }, [allVerified, witnesses, baseAssessment, generatedHash]);

    const updateWitness = (index, field, value) => {
        setWitnesses(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleSendOTP = (index) => {
        const w = witnesses[index];
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(w.phone)) {
            alert('Please enter a valid 10-digit Indian mobile number');
            return;
        }
        if (!w.name.trim()) {
            alert('Please enter the witness name');
            return;
        }

        updateWitness(index, 'otpSent', true);
        updateWitness(index, 'resendTimer', 30); // 30s resend lock

        if (navigator.vibrate) navigator.vibrate(100);
    };

    const handleVerifyOTP = (index) => {
        const w = witnesses[index];
        // Allow any 6 digit input for demo
        if (w.otp.length === 6 && /^\d{6}$/.test(w.otp)) {
            updateWitness(index, 'verified', true);
            if (navigator.vibrate) navigator.vibrate([50, 50, 100]);
        } else {
            alert('Enter a valid 6-digit OTP');
        }
    };

    const handleComplete = () => {
        const attestations = witnesses
            .filter(w => w.verified)
            .map(w => createAttestation({
                assessmentId,
                witnessName: w.name,
                witnessPhone: w.phone,
                otpVerified: true,
            }));
        onComplete(attestations, generatedHash);
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>
            {/* Header */}
            <div className="text-center mb-xl">
                <div style={{
                    width: '80px', height: '80px', margin: '0 auto var(--space-md)',
                    background: allVerified ? 'var(--accent-success)' : 'var(--bg-glass)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: allVerified ? '0 0 30px rgba(16, 185, 129, 0.4)' : 'none',
                    transition: 'all 0.4s ease'
                }}>
                    <Shield size={40} color={allVerified ? '#fff' : 'var(--accent-secondary)'} />
                </div>
                <h2 className="heading-2">Community Attestation</h2>
                <p className="text-secondary">Secure proof via trusted local witnesses</p>
            </div>

            {/* Verified Banner */}
            {allVerified && generatedHash && (
                <div className="animate-slide-in mb-xl" style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(20, 20, 20, 0.8) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-lg)',
                    textAlign: 'center'
                }}>
                    <ShieldCheck size={48} color="var(--accent-success)" style={{ margin: '0 auto var(--space-sm)' }} />
                    <h3 className="heading-3 mb-sm" style={{ color: 'var(--accent-success)' }}>100% COMMUNITY VERIFIED ✓</h3>

                    <div style={{
                        background: 'var(--bg-tertiary)',
                        padding: 'var(--space-sm) var(--space-md)',
                        borderRadius: 'var(--radius-md)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        marginTop: 'var(--space-sm)',
                        border: '1px dashed rgba(255,255,255,0.2)'
                    }}>
                        <Fingerprint size={16} color="var(--text-muted)" />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Integrity: <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{generatedHash.substring(0, 12)}...{generatedHash.substring(generatedHash.length - 4)}</span>
                        </span>
                        <Lock size={14} color="var(--accent-success)" />
                    </div>
                    {/* Render CSS Confetti */}
                    <ConfettiBurst />
                </div>
            )}

            {/* Progress Dots */}
            {!allVerified && (
                <div className="flex justify-center items-center gap-md mb-xl">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="flex flex-col items-center gap-xs">
                            <div
                                className={`transition-all duration-300 ${witnesses[i].verified ? 'animate-glow' : ''}`}
                                style={{
                                    width: '50px', height: '50px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.2rem', fontWeight: 800,
                                    background: witnesses[i].verified ? 'var(--accent-success)' : 'var(--bg-tertiary)',
                                    color: witnesses[i].verified ? 'white' : 'var(--text-muted)',
                                    border: witnesses[i].verified ? '2px solid var(--accent-success)' : '2px solid rgba(255,255,255,0.05)',
                                    boxShadow: witnesses[i].verified ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'none'
                                }}
                            >
                                {witnesses[i].verified ? <CheckCircle size={24} /> : i + 1}
                            </div>
                            <span className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Witness {i + 1}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Witness Slots */}
            <div className={`flex flex-col md:flex-row gap-lg mb-xl w-full ${allVerified ? 'animate-glow' : ''}`}>
                {witnesses.map((w, i) => {
                    if (w.verified && !allVerified) {
                        return (
                            <div key={i} className="glass-card flex justify-between items-center animate-scale-in" style={{ flex: 1, borderTop: '4px solid var(--accent-success)', borderLeft: '1px solid var(--accent-success)', padding: 'var(--space-md) var(--space-sm)' }}>
                                <div className="flex items-center gap-md">
                                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '50%' }}>
                                        <CheckCircle size={20} color="var(--accent-success)" />
                                    </div>
                                    <div>
                                        <h4 className="heading-4" style={{ marginBottom: 0 }}>{w.name}</h4>
                                        <span className="text-muted" style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>{w.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}</span>
                                    </div>
                                </div>
                                <div className="badge badge-verified">Verified</div>
                            </div>
                        );
                    }

                    if (w.verified) return null; // Hide individual cards if all verifying is done, show banner instead

                    return (
                        <div
                            key={i}
                            className={`glass-card-static animate-fade-in ${w.verified ? 'animate-glow' : ''}`}
                            style={{
                                flex: 1,
                                border: w.verified ? '2px solid var(--accent-success)' : '1px solid rgba(255, 255, 255, 0.08)',
                                background: w.verified ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-glass)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {!w.verified && <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent-secondary)' }} />}

                            <div className="flex justify-between items-center mb-md">
                                <h4 className="heading-3 flex items-center gap-sm">
                                    <User size={20} color="var(--accent-secondary)" /> Witness {i + 1}
                                </h4>
                                {w.otpSent && <span className="badge badge-pending animate-pulse">Awaiting OTP</span>}
                            </div>

                            {!w.otpSent ? (
                                <div className="flex flex-col gap-md">
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <div className="flex items-center" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', padding: '5px 15px' }}>
                                            <User size={18} color="var(--text-muted)" />
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder="Full Legal Name"
                                                value={w.name}
                                                onChange={e => updateWitness(i, 'name', e.target.value)}
                                                style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <div className="flex items-center" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', padding: '5px 15px' }}>
                                            <Phone size={18} color="var(--text-muted)" />
                                            <span className="text-secondary" style={{ padding: '0 10px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>+91</span>
                                            <input
                                                type="tel"
                                                className="form-input"
                                                placeholder="Mobile Number"
                                                value={w.phone}
                                                onChange={e => updateWitness(i, 'phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                inputMode="numeric"
                                                maxLength={10}
                                                style={{ border: 'none', background: 'transparent', boxShadow: 'none', fontFamily: 'var(--font-mono)' }}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        className="btn btn-secondary mt-sm hover-lift"
                                        onClick={() => handleSendOTP(i)}
                                        disabled={!w.name.trim() || w.phone.length !== 10}
                                        style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                                    >
                                        <Send size={18} /> Request OTP Verification
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-md animate-fade-in text-center p-md" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
                                    <Mail size={32} color="var(--accent-primary)" style={{ margin: '0 auto' }} />
                                    <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
                                        6-digit code sent to <strong style={{ color: 'white' }}>+91 {w.phone.slice(0, 3)} {w.phone.slice(3, 6)} {w.phone.slice(6)}</strong>
                                    </p>

                                    <div className="flex justify-center gap-xs my-sm">
                                        {/* 6 separate digit boxes */}
                                        {Array.from({ length: 6 }).map((_, digitIdx) => (
                                            <input
                                                key={digitIdx}
                                                id={`otp-${i}-${digitIdx}`}
                                                type="tel"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={w.otp[digitIdx] || ''}
                                                autoFocus={digitIdx === 0}
                                                onChange={e => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    const newOtp = w.otp.split('');
                                                    newOtp[digitIdx] = val;
                                                    updateWitness(i, 'otp', newOtp.join('').slice(0, 6));

                                                    if (val && digitIdx < 5) {
                                                        requestAnimationFrame(() => {
                                                            document.getElementById(`otp-${i}-${digitIdx + 1}`)?.focus();
                                                        });
                                                    }
                                                }}
                                                onKeyDown={e => {
                                                    if (e.key === 'Backspace' && !w.otp[digitIdx] && digitIdx > 0) {
                                                        requestAnimationFrame(() => {
                                                            document.getElementById(`otp-${i}-${digitIdx - 1}`)?.focus();
                                                        });
                                                    }
                                                }}
                                                style={{
                                                    width: 'clamp(35px, 10vw, 45px)', height: 'clamp(45px, 12vw, 55px)',
                                                    background: 'var(--bg-tertiary)', border: '2px solid var(--accent-primary)', borderRadius: 'var(--radius-md)',
                                                    color: 'white', fontSize: '1.5rem', fontFamily: 'var(--font-mono)', textAlign: 'center',
                                                    boxShadow: '0 0 10px rgba(99, 102, 241, 0.2)'
                                                }}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        className="btn btn-primary btn-lg hover-scale mt-sm"
                                        onClick={() => handleVerifyOTP(i)}
                                        disabled={w.otp.length !== 6}
                                        style={{ width: '100%' }}
                                    >
                                        Verify Witness {i + 1}
                                    </button>

                                    <div className="text-muted mt-sm" style={{ fontSize: '0.8rem' }}>
                                        {w.resendTimer > 0
                                            ? `Resend SMS in 00:${String(w.resendTimer).padStart(2, '0')}`
                                            : <button onClick={() => updateWitness(i, 'resendTimer', 30)} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}>Resend code</button>
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: 'var(--space-md)', background: 'linear-gradient(0deg, var(--bg-card) 0%, transparent 100%)', zIndex: 100 }}>
                {allVerified ? (
                    <button
                        className="btn btn-success btn-lg animate-slide-up"
                        onClick={handleComplete}
                        style={{ width: '100%', maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'center', boxShadow: '0 10px 30px rgba(16,185,129,0.4)', borderRadius: 'var(--radius-full)' }}
                    >
                        <ShieldCheck size={20} style={{ marginRight: '8px' }} />
                        Finalize & Lock Assessment Data
                    </button>
                ) : (
                    <button
                        className="btn btn-ghost"
                        onClick={() => onComplete(witnesses.filter(w => w.verified).map(w => createAttestation({
                            assessmentId, witnessName: w.name, witnessPhone: w.phone, otpVerified: true,
                        })), null)}
                        style={{ width: '100%', maxWidth: '600px', margin: '0 auto', display: 'block' }}
                    >
                        Skip Remaining (Warning: Lowers Trust Score)
                    </button>
                )}
            </div>
        </div>
    );
}
