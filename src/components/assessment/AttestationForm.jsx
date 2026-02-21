import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, CheckCircle, RefreshCw, Smartphone, AlertCircle } from 'lucide-react';
import { toast } from '../shared/Toast';

export default function AttestationForm({ witnesses, updateWitness, onComplete }) {
  const [activeResend, setActiveResend] = useState({});

  useEffect(() => {
    const timers = Object.keys(activeResend).map(idx => {
      if (activeResend[idx] > 0) {
        return setInterval(() => {
          setActiveResend(prev => ({ ...prev, [idx]: prev[idx] - 1 }));
        }, 1000);
      }
      return null;
    });
    return () => timers.forEach(t => t && clearInterval(t));
  }, [activeResend]);

  const handleSendOTP = (index) => {
    const w = witnesses[index];
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(w.phone)) {
      toast.error('Enter a valid 10-digit number');
      return;
    }

    // GENERATE RANDOM 6-DIGIT CODE
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    
    updateWitness(index, 'generatedOTP', generated);
    updateWitness(index, 'otpSent', true);
    
    setActiveResend(prev => ({ ...prev, [index]: 30 }));

    // FOR DEMO: Show the code in a modal or toast
    toast.info(`OTP for ${w.name}: ${generated}`, { duration: 8000 });
    
    if (navigator.vibrate) navigator.vibrate(100);
  };

  const handleVerifyOTP = (index) => {
    const w = witnesses[index];
    if (w.otp === w.generatedOTP) {
      updateWitness(index, 'otpVerified', true);
      updateWitness(index, 'verified', true);
      toast.success(`${w.name} verified!`);
      if (navigator.vibrate) navigator.vibrate([50, 100]);
    } else {
      toast.error('Invalid OTP code');
      updateWitness(index, 'otp', ''); // Clear input
    }
  };

  const allVerified = witnesses.every(w => w.verified);

  return (
    <div className="attestation-flow">
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Shield style={{ color: 'var(--accent-primary)' }} />
        Community Attestation
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {witnesses.map((w, i) => (
          <div key={i} className="card" style={{
            padding: '1.25rem',
            border: `1px solid ${w.verified ? 'var(--status-success)44' : 'var(--border-primary)'}`,
            background: w.verified ? 'rgba(0, 212, 170, 0.03)' : 'var(--bg-secondary)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'var(--bg-tertiary)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>
                  {i + 1}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700 }}>{w.name || `Witness ${i + 1}`}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{w.phone || 'No phone entered'}</p>
                </div>
              </div>
              {w.verified && <CheckCircle style={{ color: 'var(--status-success)' }} size={24} />}
            </div>

            {!w.verified && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {!w.otpSent ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" placeholder="Witness Name" 
                      value={w.name} onChange={e => updateWitness(i, 'name', e.target.value)}
                    />
                    <input 
                      type="tel" placeholder="Mobile Number" 
                      value={w.phone} onChange={e => updateWitness(i, 'phone', e.target.value)}
                    />
                    <button onClick={() => handleSendOTP(i)} className="btn btn-primary" style={{ padding: '0 1rem' }}>
                      Send
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input 
                      type="text" placeholder="6-digit OTP" maxLength={6}
                      value={w.otp} onChange={e => updateWitness(i, 'otp', e.target.value)}
                      style={{ flex: 1, letterSpacing: '4px', textAlign: 'center', fontWeight: 'bold' }}
                    />
                    <button onClick={() => handleVerifyOTP(i)} className="btn btn-primary" style={{ padding: '0 1rem' }}>
                      Verify
                    </button>
                    <button 
                      disabled={activeResend[i] > 0}
                      onClick={() => handleSendOTP(i)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem' }}
                    >
                      {activeResend[i] > 0 ? `Resend in ${activeResend[i]}s` : 'Resend'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {allVerified && (
        <button onClick={onComplete} className="btn btn-primary pulse" style={{ width: '100%', marginTop: '2rem', padding: '1rem' }}>
          Finalize Assessment Identity
        </button>
      )}

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', display: 'flex', gap: '0.75rem' }}>
        <AlertCircle size={20} style={{ color: 'var(--accent-secondary)', flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          <strong>Trust Protocol:</strong> Witness phones must be verified. High volume of attestations from the same device may trigger manual audit.
        </p>
      </div>
    </div>
  );
}
