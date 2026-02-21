/* ========================================
   SENTRAK — AthleteProfile Page
   Full profile page with ProfileCard + QRPassport
   Owner: Rahul (feat/athlete)
   ======================================== */

import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User, Edit, ClipboardList, Share2 } from 'lucide-react';
import { DEMO_ATHLETES } from '../utils/dataShapes';
import { t } from '../utils/translations';
import ProfileCard from '../components/athlete/ProfileCard';
import QRPassport from '../components/athlete/QRPassport';
import MentalProfileForm from '../components/athlete/MentalProfileForm';
import LanguageToggle, { LanguageProvider, useLanguage } from '../components/shared/LanguageToggle';

function AthleteProfileContent() {
  const { id } = useParams();
  const { language } = useLanguage();
  const [athlete, setAthlete] = useState(null);
  const [showMentalForm, setShowMentalForm] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Try localStorage first, fallback to DEMO_ATHLETES
    try {
      const stored = JSON.parse(localStorage.getItem('sentrak_athletes') || '[]');
      const found = stored.find((a) => a.id === id);
      if (found) {
        setAthlete(found);
        return;
      }
    } catch { /* noop */ }

    const demo = DEMO_ATHLETES.find((a) => a.id === id);
    if (demo) setAthlete(demo);
  }, [id]);

  const handleMentalComplete = ({ profile, score }) => {
    const updated = { ...athlete, mentalProfile: profile, mentalScore: score };
    setAthlete(updated);

    // Persist to localStorage
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
  };

  if (!athlete) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1 className="page-title flex items-center gap-sm">
            <User size={28} color="var(--accent-primary)" />
            {t('athleteProfile', language)}
          </h1>
        </div>
        <div className="glass-card text-center" style={{ padding: 'var(--space-3xl)' }}>
          <p className="text-secondary">{t('noAthleteFound', language)}</p>
          <Link to="/register" className="btn btn-primary mt-lg">
            {t('register', language)}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title flex items-center gap-sm">
            <User size={28} color="var(--accent-primary)" />
            {t('athleteProfile', language)}
          </h1>
          <p className="page-subtitle">{t('digitalPassport', language)}</p>
        </div>
        <LanguageToggle />
      </div>

      {/* Tabs */}
      <div className="tabs mb-lg">
        <button
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => { setActiveTab('profile'); setShowMentalForm(false); }}
        >
          {t('profile', language)}
        </button>
        <button
          className={`tab ${activeTab === 'passport' ? 'active' : ''}`}
          onClick={() => { setActiveTab('passport'); setShowMentalForm(false); }}
        >
          {t('digitalPassport', language)}
        </button>
        <button
          className={`tab ${activeTab === 'mental' ? 'active' : ''}`}
          onClick={() => { setActiveTab('mental'); setShowMentalForm(true); }}
        >
          {t('mentalAssessment', language)}
        </button>
      </div>

      {/* Content */}
      {showMentalForm && activeTab === 'mental' ? (
        <MentalProfileForm onComplete={handleMentalComplete} athleteId={id} />
      ) : activeTab === 'passport' ? (
        <QRPassport athlete={athlete} language={language} />
      ) : (
        <>
          <ProfileCard athlete={athlete} language={language} />

          {/* Action buttons */}
          <div className="flex gap-sm mt-lg flex-wrap">
            <Link to={`/assess/${athlete.id}`} className="btn btn-primary" style={{ flex: 1 }}>
              <ClipboardList size={16} /> {t('newAssessment', language)}
            </Link>
            <button
              className="btn btn-secondary"
              onClick={() => { setActiveTab('mental'); setShowMentalForm(true); }}
              style={{ flex: 1 }}
            >
              🧠 {t('mentalAssessment', language)}
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
