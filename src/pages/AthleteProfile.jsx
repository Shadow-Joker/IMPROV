/* ========================================
   SENTRAK — AthleteProfile Page (Phase 2)
   Full profile page with tab system, skeleton
   loading state, 404 error state, persisted
   mental assessment updates
   Owner: Rahul (feat/athlete)
   ======================================== */

import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User, ClipboardList, Brain, CreditCard, AlertTriangle, UserPlus } from 'lucide-react';
import { DEMO_ATHLETES } from '../utils/dataShapes';
import { t } from '../utils/translations';
import { getSyncQueue, getAssessmentsByAthlete } from '../utils/offlineDB';
import ProfileCard from '../components/athlete/ProfileCard';
import QRPassport from '../components/athlete/QRPassport';
import MentalProfileForm from '../components/athlete/MentalProfileForm';
import LanguageToggle, { LanguageProvider, useLanguage } from '../components/shared/LanguageToggle';

/* ── Skeleton loading shimmer ── */
function ProfileSkeleton() {
  return (
    <div className="animate-fade-in flex-col gap-lg" style={{ display: 'flex' }}>
      {/* Hero skeleton */}
      <div className="glass-card-static">
        <div className="flex gap-lg items-center">
          <div className="skeleton-pulse" style={{ width: 100, height: 100, borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton-pulse" style={{ height: 24, width: '60%', borderRadius: 6, marginBottom: 8 }} />
            <div className="skeleton-pulse" style={{ height: 16, width: '40%', borderRadius: 6, marginBottom: 12 }} />
            <div className="flex gap-sm">
              <div className="skeleton-pulse" style={{ height: 22, width: 70, borderRadius: 12 }} />
              <div className="skeleton-pulse" style={{ height: 22, width: 50, borderRadius: 12 }} />
              <div className="skeleton-pulse" style={{ height: 22, width: 80, borderRadius: 12 }} />
            </div>
          </div>
        </div>
      </div>
      {/* Rating skeleton */}
      <div className="glass-card-static text-center" style={{ padding: 'var(--space-xl)' }}>
        <div className="skeleton-pulse" style={{ height: 14, width: 120, borderRadius: 6, margin: '0 auto 12px' }} />
        <div className="skeleton-pulse" style={{ height: 48, width: 200, borderRadius: 8, margin: '0 auto' }} />
      </div>
      {/* Assessment skeleton */}
      <div className="glass-card-static">
        <div className="skeleton-pulse" style={{ height: 20, width: 160, borderRadius: 6, marginBottom: 16 }} />
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton-pulse" style={{ height: 56, borderRadius: 8, marginBottom: 8 }} />
        ))}
      </div>
      <style>{`
                .skeleton-pulse {
                    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                }
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
    </div>
  );
}

function AthleteProfileContent() {
  const { id } = useParams();
  const { language } = useLanguage();
  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMentalForm, setShowMentalForm] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    setLoading(true);
    // Simulate brief loading for polish
    const timer = setTimeout(async () => {
      let currentAthlete = null;
      try {
        const stored = JSON.parse(localStorage.getItem('sentrak_athletes') || '[]');
        const found = stored.find((a) => a.id === id);
        if (found) { currentAthlete = found; }
      } catch { /* noop */ }

      if (!currentAthlete) {
        const demo = DEMO_ATHLETES.find((a) => a.id === id);
        if (demo) currentAthlete = demo;
      }

      if (currentAthlete) {
        try {
          const storedAssays = JSON.parse(localStorage.getItem('sentrak_assessments') || '[]');
          const localAssays = storedAssays.filter(a => a.athleteId === id);

          let allAssessments = [...localAssays];
          try {
            const queue = await getSyncQueue();
            const pending = queue.filter(q => q.type === 'assessment' && q.athleteId === id);
            const existingIds = new Set(allAssessments.map(a => a.id));

            pending.forEach(pa => {
              if (!existingIds.has(pa.id)) {
                allAssessments.push(pa);
                existingIds.add(pa.id);
              }
            });

            const idbAssays = await getAssessmentsByAthlete(id);
            idbAssays.forEach(pa => {
              if (!existingIds.has(pa.id)) {
                allAssessments.push(pa);
                existingIds.add(pa.id);
              }
            });
          } catch (e) { }

          // Sort descending by timestamp
          allAssessments.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

          if (allAssessments.length > 0) {
            currentAthlete = { ...currentAthlete, assessments: allAssessments };
          }
        } catch (e) { }

        setAthlete(currentAthlete);
      }

      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [id]);

  const handleMentalComplete = ({ profile, score }) => {
    const updated = { ...athlete, mentalProfile: profile, mentalScore: score };
    setAthlete(updated);

    try {
      const stored = JSON.parse(localStorage.getItem('sentrak_athletes') || '[]');
      const idx = stored.findIndex((a) => a.id === id);
      if (idx >= 0) {
        stored[idx] = updated;
      } else {
        stored.push(updated);
      }
      localStorage.setItem('sentrak_athletes', JSON.stringify(stored));
    } catch { /* noop */ }

    setShowMentalForm(false);
    setActiveTab('profile');
  };

  const tabs = [
    { key: 'profile', icon: <User size={16} />, label: t('profile', language) },
    { key: 'passport', icon: <CreditCard size={16} />, label: t('digitalPassport', language) },
    { key: 'mental', icon: <Brain size={16} />, label: t('mentalAssessment', language) },
  ];

  // ── LOADING STATE ──
  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="page-header flex justify-between items-center">
          <div>
            <h1 className="page-title flex items-center gap-sm">
              <User size={28} color="var(--accent-primary)" />
              {t('athleteProfile', language)}
            </h1>
          </div>
          <LanguageToggle />
        </div>
        <ProfileSkeleton />
      </div>
    );
  }

  // ── NOT FOUND STATE ──
  if (!athlete) {
    return (
      <div className="animate-fade-in">
        <div className="page-header flex justify-between items-center">
          <div>
            <h1 className="page-title flex items-center gap-sm">
              <User size={28} color="var(--accent-primary)" />
              {t('athleteProfile', language)}
            </h1>
          </div>
          <LanguageToggle />
        </div>
        <div className="glass-card-static text-center" style={{ padding: 'var(--space-3xl)' }}>
          <AlertTriangle size={48} className="text-warning" style={{ marginBottom: 'var(--space-md)' }} />
          <h3 className="heading-3 mb-sm">{t('noAthleteFound', language)}</h3>
          <p className="text-secondary mb-lg" style={{ fontSize: '0.85rem' }}>
            {language === 'ta'
              ? 'இந்த விளையாட்டு வீரர் காணப்படவில்லை. புதிய வீரரைப் பதிவு செய்யுங்கள்.'
              : 'This athlete profile was not found. Try registering a new athlete.'}
          </p>
          <Link to="/register" className="btn btn-primary">
            <UserPlus size={16} /> {t('register', language)}
          </Link>
        </div>
      </div>
    );
  }

  // ── MAIN PROFILE ──
  return (
    <div className="animate-fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title flex items-center gap-sm">
            <User size={28} color="var(--accent-primary)" />
            {t('athleteProfile', language)}
          </h1>
          <p className="page-subtitle">{athlete.name}</p>
        </div>
        <LanguageToggle />
      </div>

      {/* Tab bar */}
      <div className="tabs mb-lg" style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.key);
              setShowMentalForm(tab.key === 'mental');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'mental' && showMentalForm ? (
        <MentalProfileForm onComplete={handleMentalComplete} athleteId={id} />
      ) : activeTab === 'passport' ? (
        <QRPassport athlete={athlete} language={language} />
      ) : (
        <>
          <ProfileCard athlete={athlete} language={language} />

          {/* Quick actions */}
          <div className="flex gap-sm mt-lg flex-wrap">
            <Link to={`/assess/${athlete.id}`} className="btn btn-primary" style={{ flex: 1 }}>
              <ClipboardList size={16} /> {t('newAssessment', language)}
            </Link>
            <button
              className="btn btn-secondary"
              onClick={() => { setActiveTab('mental'); setShowMentalForm(true); }}
              style={{ flex: 1 }}
            >
              <Brain size={16} /> {t('mentalAssessment', language)}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function AthleteProfile() {
  return (
    <LanguageProvider>
      <AthleteProfileContent />
    </LanguageProvider>
  );
}
