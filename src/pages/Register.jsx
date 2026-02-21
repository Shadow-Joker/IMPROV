/* ========================================
   SENTRAK — Register Page (Phase 2)
   Demo mode banner, voice-first subtitle,
   Language toggle in header
   Owner: Rahul (feat/athlete)
   ======================================== */

import { UserPlus, Sparkles } from 'lucide-react';
import RegisterForm from '../components/athlete/RegisterForm';
import LanguageToggle, { LanguageProvider, useLanguage } from '../components/shared/LanguageToggle';
import { t } from '../utils/translations';

function RegisterContent() {
  const { language } = useLanguage();
  return (
    <div className="animate-fade-in">
      {/* Demo mode banner */}
      <div className="demo-banner" style={{
        background: 'linear-gradient(90deg, rgba(245,158,11,0.12), rgba(245,158,11,0.05))',
        border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 16px',
        marginBottom: 'var(--space-lg)',
        display: 'flex', alignItems: 'center', gap: '8px',
        fontSize: '0.8rem', color: '#f59e0b',
      }}>
        <Sparkles size={16} />
        {language === 'ta'
          ? '🎮 விளக்க பயன்முறை — தரவு இந்தச் சாதனத்தில் மட்டுமே சேமிக்கப்படும்'
          : '🎮 Demo Mode — data is saved locally on this device only'}
      </div>

      {/* Page header */}
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title flex items-center gap-sm">
            <UserPlus size={28} color="var(--accent-primary)" />
            {t('register', language)}
          </h1>
          <p className="page-subtitle">
            {language === 'ta'
              ? 'குரல்-முதல் பதிவு — தமிழ் அல்லது ஆங்கிலத்தில் பேசுங்கள்'
              : 'Voice-first registration — speak in Tamil or English'}
          </p>
        </div>
        <LanguageToggle />
      </div>

      <RegisterForm />
    </div>
  );
}

export default function Register() {
  return (
    <LanguageProvider>
      <RegisterContent />
    </LanguageProvider>
  );
}
