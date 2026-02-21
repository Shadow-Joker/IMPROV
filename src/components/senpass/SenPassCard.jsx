import { QRCodeSVG } from 'qrcode.react';
import { Shield, CheckCircle, AlertTriangle, Download, Share2 } from 'lucide-react';
import { TIER_COLORS, TIER_BADGES } from '../../utils/senpass';

export default function SenPassCard({ cert, athletePhoto }) {
  const color = TIER_COLORS[cert.tier];
  const date = new Date(cert.issuedAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const handleDownload = () => {
    // In a real app, use html2canvas or generate a real PDF
    alert('Generating high-resolution SenPass... (Simulated)');
  };

  return (
    <div className="card senpass-card" style={{
      background: 'var(--bg-secondary)',
      border: `1px solid ${color}44`,
      borderRadius: '24px',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: `0 20px 50px ${color}11`,
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      {/* Glossy Overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '100%',
        background: `linear-gradient(135deg, ${color}08 0%, transparent 50%, ${color}08 100%)`,
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid var(--border-primary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={24} style={{ color }} />
          <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '1px' }}>SenPass</span>
        </div>
        <div style={{
          fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem',
          borderRadius: '20px', background: `${color}22`, color,
          border: `1px solid ${color}44`, textTransform: 'uppercase'
        }}>
          {cert.tier}
        </div>
      </div>

      {/* Profile Info */}
      <div style={{ padding: '1.5rem', display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '20px',
          overflow: 'hidden', border: `2px solid ${color}44`,
          background: 'var(--bg-tertiary)'
        }}>
          {athletePhoto || cert.photo ? (
            <img src={athletePhoto || cert.photo} alt="Athlete" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              🏃
            </div>
          )}
        </div>
        <div>
          <h2 style={{ fontSize: '1.4rem', margin: 0 }}>{cert.athleteName}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.2rem 0' }}>
            {cert.sport} • {cert.district}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>
            ID: <span style={{ fontFamily: 'monospace' }}>{cert.id}</span>
          </p>
        </div>
      </div>

      {/* Stats Table */}
      <div style={{ padding: '0 1.5rem' }}>
        <div className="card" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '16px', border: 'none' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ paddingBottom: '0.5rem' }}>TEST TYPE</th>
                <th style={{ paddingBottom: '0.5rem', textAlign: 'right' }}>RESULT</th>
              </tr>
            </thead>
            <tbody>
              {cert.assessments.slice(0, 4).map((a, i) => (
                <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.5rem 0' }}>{a.testType}</td>
                  <td style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {a.value} {a.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer / QR / Trust */}
      <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#00d4aa', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <CheckCircle size={14} /> Verified by {cert.witnessCount} Witnesses
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            ISSUED ON: {date}<br />
            HASH: {cert.hash.substring(0, 12)}...
          </div>
        </div>
        <div style={{
          padding: '4px', background: '#fff', borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
        }}>
          <QRCodeSVG 
            value={`https://sentrak.vercel.app/verify/${cert.id}`} 
            size={60}
            level="H"
          />
        </div>
      </div>

      {/* Actions */}
      <div style={{
        padding: '1rem 1.5rem',
        background: 'var(--bg-tertiary)',
        display: 'flex',
        gap: '0.5rem'
      }}>
        <button onClick={handleDownload} className="btn btn-primary" style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem', gap: '0.4rem' }}>
          <Download size={16} /> Save SenPass
        </button>
        <button className="btn" style={{
          padding: '0.6rem', background: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--border-primary)', borderRadius: '12px', color: 'var(--text-secondary)'
        }}>
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
}
