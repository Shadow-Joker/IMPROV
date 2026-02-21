import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, XCircle, Clock, Link as LinkIcon, Download } from 'lucide-react';
import { getCertificateById } from '../services/firestoreService';
import { generateHash } from '../utils/hashVerify';
import { TIER_COLORS, TIER_BADGES } from '../utils/senpass';

export default function VerifySenPass() {
  const { certId } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [integrity, setIntegrity] = useState('verifying'); // verifying | valid | invalid

  useEffect(() => {
    async function verify() {
      setLoading(true);
      
      // 1. Load from cloud (or local fallback)
      let data = await getCertificateById(certId);
      
      if (!data) {
        // Fallback to local for demo purposes
        const localCerts = JSON.parse(localStorage.getItem('sentrak_certificates') || '[]');
        data = localCerts.find(c => c.id === certId);
      }

      if (data) {
        setCert(data);
        
        // 2. Cryptographic Re-verification
        const dataToHash = {
          id: data.id,
          athleteId: data.athleteId,
          athleteName: data.athleteName,
          sport: data.sport,
          issuedAt: data.issuedAt,
          tier: data.tier,
          witnessCount: data.witnessCount,
        };
        const computedHash = await generateHash(dataToHash);
        
        setIntegrity(computedHash === data.hash ? 'valid' : 'invalid');
      }
      setLoading(false);
    }
    verify();
  }, [certId]);

  if (loading) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Verifying SenPass Identity...</p>
      </div>
    );
  }

  if (!cert) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <XCircle size={64} style={{ color: 'var(--status-error)', marginBottom: '1.5rem' }} />
        <h1>Invalid Certificate</h1>
        <p style={{ color: 'var(--text-secondary)' }}>The SenPass ID "{certId}" was not found in our secure registry.</p>
        <button onClick={() => window.history.back()} className="btn btn-primary" style={{ marginTop: '2rem' }}>
          Go Back
        </button>
      </div>
    );
  }

  const color = TIER_COLORS[cert.tier];

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
      {/* Integrity Header */}
      <div className="card" style={{
        padding: '2rem',
        textAlign: 'center',
        background: integrity === 'valid' ? 'rgba(0, 212, 170, 0.05)' : 'rgba(255, 71, 87, 0.05)',
        border: `2px solid ${integrity === 'valid' ? 'var(--status-success)' : 'var(--status-error)'}`,
        borderRadius: '24px',
        marginBottom: '2rem'
      }}>
        {integrity === 'valid' ? (
          <>
            <CheckCircle size={64} style={{ color: 'var(--status-success)', marginBottom: '1rem' }} />
            <h1 style={{ color: 'var(--status-success)', margin: 0 }}>AUTHENTIC RECORD</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              SHA-256 integrity check passed. This record has not been tampered with since issuance.
            </p>
          </>
        ) : (
          <>
            <AlertTriangle size={64} style={{ color: 'var(--status-error)', marginBottom: '1rem' }} />
            <h1 style={{ color: 'var(--status-error)', margin: 0 }}>INTEGRITY FAILURE</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Cryptographic hash mismatch. This certificate has been modified or forged.
            </p>
          </>
        )}
      </div>

      {/* Public Record View */}
      <div className="card" style={{ padding: '2rem', borderRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <span style={{
              fontSize: '0.75rem', fontWeight: 800, padding: '0.3rem 0.8rem',
              borderRadius: '20px', background: `${color}22`, color,
              border: `1px solid ${color}44`, textTransform: 'uppercase'
            }}>
              {TIER_BADGES[cert.tier]}
            </span>
            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 0' }}>{cert.athleteName}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0 }}>
              {cert.sport} • {cert.district}
            </p>
          </div>
          <div style={{
            width: '100px', height: '100px', borderRadius: '24px',
            overflow: 'hidden', background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)'
          }}>
            {cert.photo && <img src={cert.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>
        </div>

        <h4 style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-primary)', paddingBottom: '0.5rem' }}>
          VERIFIED PERFORMANCE DATA
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          {cert.assessments.map((a, i) => (
            <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', margin: '0 0 0.2rem' }}>{a.testType.toUpperCase()}</p>
              <p style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{a.value} {a.unit}</p>
            </div>
          ))}
        </div>

        <h4 style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-primary)', paddingBottom: '0.5rem' }}>
          COMMUNITY ATTESTATION
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {cert.witnesses.map((w, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} style={{ color: w.verified ? 'var(--status-success)' : 'var(--text-muted)' }} />
                <span>{w.name}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{w.phone}</span>
            </div>
          ))}
        </div>

        <div style={{
          padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '16px',
          fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6
        }}>
          <div style={{ dispaly: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>CERTIFICATE ID:</span>
            <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{cert.id}</span>
          </div>
          <div style={{ dispaly: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>ISSUED AT:</span>
            <span style={{ color: 'var(--text-primary)' }}>{new Date(cert.issuedAt).toLocaleString()}</span>
          </div>
          <div style={{ dispaly: 'flex', justifyContent: 'space-between' }}>
            <span>SHA-256 HASH:</span>
            <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{cert.hash}</span>
          </div>
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        SENTRAK Protocol — Sports Authority of Tamil Nadu Digital Verification Engine
      </p>
    </div>
  );
}
