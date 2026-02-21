import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Timer, CheckCircle, ChevronRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { DEMO_ATHLETES } from '../utils/dataShapes';
import { SPORT_ICONS } from '../utils/sportMetrics';
import { generateHash } from '../utils/hashVerify';
import { checkAnomalies } from '../utils/fraudDetection';
import { saveAssessment, addToSyncQueue } from '../utils/offlineDB';
import SportSelector from '../components/assessment/SportSelector';
import SAITestEngine from '../components/assessment/SAITestEngine';
import MetricsRecorder from '../components/assessment/MetricsRecorder';
import AttestationForm from '../components/assessment/AttestationForm';
import VideoClipCapture from '../components/assessment/VideoClipCapture';
import ErrorBoundary from '../components/common/ErrorBoundary';

const STEPS = [
  { label: 'Athlete', icon: '👤', id: 'athlete' },
  { label: 'Sport', icon: '🏆', id: 'sport' },
  { label: 'Battery', icon: '📋', id: 'type' },
  { label: 'Assess', icon: '⏱', id: 'assess' },
  { label: 'Verify', icon: '🛡️', id: 'attest' },
  { label: 'Hash', icon: '🔐', id: 'hash' },
  { label: 'Video', icon: '📹', id: 'video' },
];

export default function RecordAssessment() {
  const { athleteId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Assessment State
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [selectedSport, setSelectedSport] = useState('');
  const [testMode, setTestMode] = useState(''); // 'sai' | 'sport_specific'
  const [assessmentResults, setAssessmentResults] = useState([]);
  const [attestations, setAttestations] = useState([]);
  const [hash, setHash] = useState('');
  const [anomalyReport, setAnomalyReport] = useState([]);
  const [videoClip, setVideoClip] = useState(null);
  const [done, setDone] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isOfflineSave, setIsOfflineSave] = useState(false);
  const [anomalyAcknowledged, setAnomalyAcknowledged] = useState(false);

  // Load athletes from localStorage + fallback to demo DB
  const athletes = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem('sentrak_athletes') || '[]');
      return [...DEMO_ATHLETES, ...stored];
    } catch {
      return [...DEMO_ATHLETES];
    }
  })();

  // Pre-select athlete from URL Routing
  useEffect(() => {
    if (athleteId) {
      const found = athletes.find(a => a.id === athleteId);
      if (found) {
        setSelectedAthlete(found);
        setStep(1); // Jump to Sport Selection if athlete already known
      }
    }
  }, [athleteId]);

  // Read deep-link query params for sport/challenge presetting
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const sportQuery = searchParams.get('sport');
    if (sportQuery && step === 1 && selectedAthlete) {
      setSelectedSport(sportQuery);
      setStep(2);
    }
  }, [searchParams, step, selectedAthlete]);

  // Handle Assessment Completion
  const handleAssessmentComplete = useCallback(async (results) => {
    setAssessmentResults(results);

    // Run Fraud Detection Anomalies Scans
    const anomalies = results.map(r => ({
      ...r,
      anomaly: checkAnomalies(r, selectedSport),
    })).filter(r => r.anomaly.isAnomaly);
    setAnomalyReport(anomalies);

    setStep(4); // Move to Attestation
  }, [selectedSport]);

  // Handle Community Verification 
  const handleAttestationComplete = useCallback(async (atts, generatedHash) => {
    setAttestations(atts);

    // Dynamic generatedHash payload from child or fallback manual creation
    if (generatedHash) {
      setHash(generatedHash);
    } else {
      const firstResult = assessmentResults[0];
      if (firstResult) {
        const withAtts = {
          ...firstResult,
          attestations: atts.map(a => ({ witnessPhone: a.witnessPhone })),
        };
        const h = await generateHash(withAtts);
        setHash(h);
      }
    }

    setStep(5); // Move to Hash Preview Screen
  }, [assessmentResults]);

  // Finalize Workflow: Persist to DBs
  const handleFinalize = useCallback(async (videoPayload = null) => {
    const finalVideoObj = videoPayload ? videoPayload : videoClip;
    setIsSaving(true);

    if (!navigator.onLine) {
      setIsOfflineSave(true);
    }

    for (const result of assessmentResults) {
      const fullAssessment = {
        ...result,
        attestations: attestations,
        hash: hash,
        videoClipURL: finalVideoObj || '', // Large base64 string
        flags: anomalyReport
          .filter(a => a.id === result.id)
          .flatMap(a => a.anomaly.flags),
      };

      // 1) Fallback LocalStorage Saving
      try {
        const stored = JSON.parse(localStorage.getItem('sentrak_assessments') || '[]');
        stored.push(fullAssessment);
        localStorage.setItem('sentrak_assessments', JSON.stringify(stored));
      } catch (e) {
        console.error("LocalStorage save failed", e);
      }

      // 2) IndexedDB Persistent Saving & Sync Queueing
      try {
        await saveAssessment(fullAssessment);
        await addToSyncQueue({ ...fullAssessment, type: 'assessment' });
      } catch (err) {
        console.error('[RecordAssessment] OfflineDB persistence save error:', err);
      }
    }

    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]);

    // Task 1: Automatically redirect to profile
    if (!navigator.onLine) {
      // Show the offline warning for 2.5s before redirecting
      setTimeout(() => navigate(`/profile/${selectedAthlete?.id || DEMO_ATHLETES[0].id}`), 2500);
    } else {
      navigate(`/profile/${selectedAthlete?.id || DEMO_ATHLETES[0].id}`);
    }
  }, [assessmentResults, attestations, hash, videoClip, anomalyReport, navigate, selectedAthlete]);

  // UI Components
  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-xl w-full" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '20px', left: '0', right: '0', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex flex-col items-center" style={{ position: 'relative', zIndex: 1, flex: 1 }}>
          <div
            className={`transition-all duration-300 ${i === step ? 'animate-glow' : ''}`}
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i === step ? 'var(--accent-primary)' : i < step ? 'var(--accent-success)' : 'var(--bg-tertiary)',
              border: i === step ? '2px solid var(--accent-primary)' : '2px solid rgba(255,255,255,0.05)',
              boxShadow: i === step ? '0 0 15px rgba(99, 102, 241, 0.4)' : 'none',
              color: i <= step ? 'white' : 'var(--text-muted)',
              fontSize: '1rem', fontWeight: 800
            }}
          >
            {i < step ? <CheckCircle size={20} /> : (i + 1)}
          </div>
          <span className="mt-xs hide-mobile text-center" style={{ fontSize: '0.75rem', color: i <= step ? 'white' : 'var(--text-muted)', fontWeight: i === step ? 600 : 400 }}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );

  // ═══════════════════════════════════════════════
  // DONE STATE / RECEIPT UI
  // ═══════════════════════════════════════════════
  if (done) {
    const fraudLevel = anomalyReport.length > 0 ? 'medium' : 'low';

    return (
      <div className="animate-fade-in" style={{ paddingBottom: '100px' }}>
        <div className="text-center mb-xl">
          <div style={{
            width: '100px', height: '100px', background: 'var(--accent-success)',
            borderRadius: '50%', margin: '0 auto var(--space-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(16, 185, 129, 0.5)',
            animation: 'scale-up-bounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            transform: 'scale(0)'
          }}>
            <CheckCircle size={56} color="white" />
          </div>
          <h2 className="heading-2 text-gradient mb-xs">Assessment Recorded!</h2>
          <p className="text-secondary">Secured offline and ready for cloud synchronization.</p>
        </div>

        <div className="glass-card-static max-w-lg mx-auto p-xl animate-slide-up">
          {/* Athlete Context Header */}
          <div className="flex items-center gap-md mb-lg pb-md" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
              {selectedAthlete?.name.charAt(0)}
            </div>
            <div>
              <h3 className="heading-3" style={{ marginBottom: '2px' }}>{selectedAthlete?.name}</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>{selectedAthlete?.id} • {selectedAthlete?.district}</p>
            </div>
          </div>

          <div className="flex flex-col gap-md mb-xl">
            <div className="flex justify-between items-center bg-black/20 p-md rounded-lg border border-white/5">
              <span className="text-secondary flex items-center gap-sm"><Timer size={16} /> Tests Performed</span>
              <span className="text-white font-bold">{assessmentResults.length}</span>
            </div>

            <div className="flex justify-between items-center bg-black/20 p-md rounded-lg border border-white/5">
              <span className="text-secondary flex items-center gap-sm">🛡️ Security Level</span>
              {attestations.length === 3 ? (
                <span className="badge badge-verified flex gap-xs items-center"><ShieldCheck size={14} /> 3-Auth Verified</span>
              ) : (
                <span className="badge badge-pending">Partial ({attestations.length}/3)</span>
              )}
            </div>

            {/* Cryptographic Hash Segment */}
            <div className="bg-black/30 p-md rounded-lg border border-indigo-500/30">
              <div className="text-secondary text-xs mb-xs uppercase tracking-wider">Blockchain-ready Hash Signature</div>
              <div className="font-mono text-xs text-indigo-400 break-all leading-relaxed p-sm bg-black/50 rounded selection:bg-indigo-500/30">
                {hash}
              </div>
            </div>
          </div>

          {/* Anomaly warnings */}
          {fraudLevel === 'medium' && (
            <div className="glass-card-static mb-lg animate-fade-in" style={{
              background: 'rgba(245, 158, 11, 0.05)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}>
              <div className="flex items-center gap-sm mb-sm">
                <AlertTriangle size={18} color="var(--accent-warning)" />
                <span className="heading-4" style={{ color: 'var(--accent-warning)' }}>AI Review Flagged</span>
              </div>
              <div className="flex flex-col gap-sm">
                {anomalyReport.map((a, i) => (
                  <div key={i} className="text-muted" style={{ fontSize: '0.85rem', paddingLeft: '24px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, top: '4px', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-warning)' }} />
                    {a.anomaly.flags.join(', ')}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-md mt-xl">
            <button className="btn btn-primary btn-lg hover-scale w-full flex justify-center gap-sm" onClick={() => window.location.reload()}>
              ➕ Initialize New Session
            </button>
            <button className="btn btn-secondary btn-lg w-full" onClick={() => navigate(`/profile/${selectedAthlete?.id || DEMO_ATHLETES[0].id}`)}>
              👤 Return to Athlete Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  // MAIN WIZARD
  // ═══════════════════════════════════════════════
  return (
    <div className="animate-fade-in pb-2xl" style={{ paddingBottom: '120px' }}>
      <style>{`
        @keyframes custom-slide {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .slide-300ms {
          animation: custom-slide 300ms ease forwards;
        }
        @keyframes scale-up-bounce {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      {/* Dynamic Header */}
      <div className="page-header sticky top-0 bg-background/90 backdrop-blur z-40 py-md mb-xl" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', margin: '-16px -16px 24px -16px', padding: '16px' }}>
        <h1 className="page-title flex items-center gap-sm mb-xs" style={{ fontSize: '1.5rem' }}>
          <Timer size={24} color="var(--accent-primary)" />
          {step < 3 ? 'Assessment Setup' : 'Live Assessment Active'}
        </h1>
        {renderStepIndicator()}
      </div>

      <div className="max-w-xl mx-auto">
        {/* Step Context Pills */}
        {step > 0 && (
          <div className="flex flex-wrap gap-sm mb-xl animate-fade-in">
            {selectedAthlete && <span className="badge flex items-center gap-xs bg-white/5 border border-white/10"><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-success)' }}></span>{selectedAthlete.name}</span>}
            {selectedSport && <span className="badge flex items-center gap-xs bg-white/5 border border-white/10">{SPORT_ICONS[selectedSport]} {selectedSport.replace('_', ' ')}</span>}
            {testMode && <span className="badge flex items-center gap-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{testMode === 'sai' ? '🏅 SAI Battery' : `🎯 ${selectedSport.replace('_', ' ')} Mode`}</span>}
          </div>
        )}

        {/* STEP 0: Select Athlete */}
        {step === 0 && (
          <div className="slide-300ms">
            <h3 className="heading-3 mb-lg text-gradient">Select Target Athlete</h3>
            <div className="flex flex-col gap-md">
              {athletes && athletes.map(athlete => {
                if (!athlete) return null;
                return (
                  <button
                    key={athlete.id}
                    className="glass-card hover-lift text-left w-full transition-all duration-300"
                    onClick={() => { setSelectedAthlete(athlete); setStep(1); }}
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <div className="flex items-center gap-lg p-sm">
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800 }}>
                        {athlete.name ? athlete.name.charAt(0) : '?'}
                      </div>
                      <div className="flex-1">
                        <div className="heading-4 flex items-center justify-between mb-xs">
                          {athlete.name || 'Unknown Athlete'}
                          <ChevronRight size={18} color="var(--accent-secondary)" />
                        </div>
                        <div className="flex gap-md text-muted text-xs">
                          <span>{athlete.sport?.replace('_', ' ')}</span>
                          <span>•</span>
                          <span>{athlete.district}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP 1: Select Sport */}
        {step === 1 && (
          <div className="slide-300ms">
            <h3 className="heading-3 mb-md">Select Sport Discipline</h3>
            <p className="text-secondary mb-lg">Choose the sport category to calibrate assessment benchmarks and available specific tests.</p>
            <SportSelector selected={selectedSport} onSelect={(sport) => { setSelectedSport(sport); setStep(2); }} />
          </div>
        )}

        {/* STEP 2: Choose Test Mode */}
        {step === 2 && (
          <div className="slide-300ms">
            <h3 className="heading-3 mb-xl text-center">Select Assessment Configuration</h3>
            <div className="flex flex-col md:flex-row gap-lg">

              <button
                className="glass-card hover-lift flex-1 flex flex-col items-center justify-center p-xl relative overflow-hidden group"
                onClick={() => { setTestMode('sai'); setStep(3); }}
                style={{ minHeight: '280px', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)', filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.3))' }}>🏅</div>
                <h3 className="heading-3 mb-sm">SAI Base Battery</h3>
                <p className="text-secondary text-sm text-center mb-lg px-md">
                  Standard 8-test fitness profile (30m Sprint, 600m Run, Standing Broad Jump, V-Jump, Shuttle Run, Sit & Reach, BMI)
                </p>
                <div className="badge bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold uppercase tracking-wider text-xs">Full Standard Audit</div>
              </button>

              <button
                className="glass-card hover-lift flex-1 flex flex-col items-center justify-center p-xl relative overflow-hidden group"
                onClick={() => { setTestMode('sport_specific'); setStep(3); }}
                style={{ minHeight: '280px', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)', filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.3))' }}>
                  {SPORT_ICONS[selectedSport] || '🎯'}
                </div>
                <h3 className="heading-3 mb-sm text-center">{selectedSport?.replace('_', ' ')} Metrics</h3>
                <p className="text-secondary text-sm text-center mb-lg px-md">
                  Specialized tactical and mechanical skill tests designed exclusively for {selectedSport?.replace('_', ' ')} athletes.
                </p>
                <div className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider text-xs">Advanced Drills</div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Run Assessment Battery Widgets */}
        {step === 3 && (
          <div className="slide-300ms">
            <ErrorBoundary onReset={() => setStep(2)}>
              {testMode === 'sai' ? (
                <SAITestEngine athleteId={selectedAthlete?.id} athleteInfo={selectedAthlete} onComplete={handleAssessmentComplete} />
              ) : (
                <MetricsRecorder sport={selectedSport} athleteId={selectedAthlete?.id} onComplete={handleAssessmentComplete} />
              )}
            </ErrorBoundary>
          </div>
        )}

        {/* STEP 4: Network Attestation Form */}
        {step === 4 && (
          <div className="slide-300ms relative z-10">
            <AttestationForm assessmentId={assessmentResults[0]?.id} baseAssessment={assessmentResults[0]} onComplete={handleAttestationComplete} />
          </div>
        )}

        {/* STEP 5: Integrity Hash Results Preview */}
        {step === 5 && (
          <div className="slide-300ms relative z-10">
            {isOfflineSave && (
              <div className="glass-card mb-md text-center p-md bg-warning/20 border-warning/40 animate-pulse">
                <AlertTriangle size={24} className="mx-auto mb-xs text-warning" />
                <p className="text-warning font-bold">Saving to Offline Queue</p>
                <p className="text-sm">Network dropped. Verifications stored safely locally.</p>
              </div>
            )}

            <div className="glass-card-static text-center p-xl relative overflow-hidden mb-xl" style={{ border: '1px solid rgba(99, 102, 241, 0.4)' }}>
              <div className="absolute inset-0 bg-indigo-500/5 mix-blend-overlay" />
              <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)', animation: 'pulse 2s infinite' }}>🔐</div>
              <h2 className="heading-2 mb-sm text-indigo-400">Cryptographic Signature Linked</h2>

              <div className="bg-black/50 p-xl rounded-lg font-mono text-sm break-all leading-loose tracking-wide text-white border border-white/10 my-lg relative shadow-inner">
                {hash || 'Generating HMAC-SHA256 Protocol...'}
                {hash && <div className="absolute -top-3 -right-3 bg-success rounded-full p-2 text-white shadow-lg"><CheckCircle size={14} /></div>}
              </div>

              <p className="text-muted text-sm px-xl">
                This unalterable blockchain-ready signature fuses athlete ID, metrics, timestamps, and witness verifications preventing offline data tampering prior to sync dispatch.
              </p>
            </div>

            {/* Task 3: Anomaly warnings pre-save validation */}
            {anomalyReport.length > 0 && (
              <div className="glass-card-static mb-lg animate-fade-in" style={{
                background: 'rgba(245, 158, 11, 0.05)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}>
                <div className="flex items-center gap-sm mb-sm">
                  <AlertTriangle size={18} color="var(--accent-warning)" />
                  <span className="heading-4" style={{ color: 'var(--accent-warning)' }}>AI Review Flagged Anomalies</span>
                </div>
                <div className="flex flex-col gap-sm mb-md">
                  {anomalyReport.map((a, i) => (
                    <div key={i} className="text-white font-medium" style={{ fontSize: '0.85rem', paddingLeft: '24px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, top: '6px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-warning)' }} />
                      <span className="text-warning mr-sm">{a.testType?.replace(/_/g, ' ')}:</span>
                      {a.anomaly.flags.join(', ')}
                    </div>
                  ))}
                </div>

                <label className="flex items-center gap-sm cursor-pointer p-sm bg-black/40 rounded-lg border border-warning/20 hover:border-warning/50 transition-colors">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    style={{ width: '20px', height: '20px', accentColor: 'var(--accent-warning)' }}
                    checked={anomalyAcknowledged}
                    onChange={(e) => setAnomalyAcknowledged(e.target.checked)}
                  />
                  <span className="text-sm text-white font-bold tracking-wide">I verify this unusual reading is accurate and was witnessed correctly.</span>
                </label>
              </div>
            )}

            <div className="flex flex-col gap-md">
              <button disabled={isSaving || (anomalyReport.length > 0 && !anomalyAcknowledged)} className="btn btn-primary btn-lg hover-scale flex justify-center items-center gap-sm text-lg py-md shadow-[0_0_30px_rgba(99,102,241,0.3)] disabled:opacity-50" onClick={() => setStep(6)}>
                <VideoClipCapture size={24} /> Capture Video Evidence <span className="text-indigo-200 text-sm font-normal ml-sm">(Strongly Recommended)</span>
              </button>
              <button disabled={isSaving || (anomalyReport.length > 0 && !anomalyAcknowledged)} className="btn btn-ghost hover:bg-white/5 py-md disabled:opacity-50" onClick={() => handleFinalize()}>
                {isSaving ? "Finalizing Transaction..." : "Bypass Evidence & Finalize Transaction →"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Anti-Aliasing Video Capture Component */}
        {step === 6 && (
          <div className="slide-300ms relative z-10">
            <VideoClipCapture onCapture={(base64) => { setVideoClip(base64); handleFinalize(base64); }} onSkip={() => handleFinalize(null)} />
          </div>
        )}

        {/* Safety Navigation Back Controls & Next Navigation */}
        {!done && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 24px', background: 'rgba(10, 14, 39, 0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.1)', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              className="btn btn-ghost text-muted hover:text-white flex items-center gap-xs"
              style={{ visibility: step > 0 && step < 4 ? 'visible' : 'hidden' }}
              onClick={() => setStep(s => Math.max(0, s - 1))}
            >
              <ChevronRight size={18} className="rotate-180" /> Back
            </button>

            {step === 0 && <button className="btn btn-primary" disabled={!selectedAthlete} onClick={() => setStep(1)}>Next &rarr;</button>}
            {step === 1 && <button className="btn btn-primary" disabled={!selectedSport} onClick={() => setStep(2)}>Next &rarr;</button>}
            {step === 2 && <button className="btn btn-primary" disabled={!testMode} onClick={() => setStep(3)}>Next &rarr;</button>}
            {step === 3 && <button className="btn btn-primary" disabled={assessmentResults.length === 0} onClick={() => handleAssessmentComplete(assessmentResults)}>Next &rarr;</button>}
          </div>
        )}
      </div>
    </div>
  );
}
