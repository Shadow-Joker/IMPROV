/* ========================================
   SENTRAK — Register Page
   Owner: Rahul (feat/athlete)
   ======================================== */

import { UserPlus } from 'lucide-react';
import RegisterForm from '../components/athlete/RegisterForm';
import LanguageToggle, { LanguageProvider, useLanguage } from '../components/shared/LanguageToggle';
import { t } from '../utils/translations';

function RegisterContent() {
  const { language } = useLanguage();
  return (
    <div className="animate-fade-in">
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
