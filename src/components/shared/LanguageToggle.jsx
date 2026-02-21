/* ========================================
   SENTRAK — LanguageToggle + Context
   Tamil ↔ English language switch
   Owner: Rahul (feat/athlete)
   ======================================== */

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext({ language: 'en', setLanguage: () => { } });

const STORAGE_KEY = 'sentrak_language';

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        try {
            return localStorage.getItem(STORAGE_KEY) || 'en';
        } catch {
            return 'en';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, language);
        } catch { /* noop */ }
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}

export default function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    const toggle = () => {
        setLanguage(language === 'en' ? 'ta' : 'en');
    };

    return (
        <button
            type="button"
            className="btn-secondary animate-fade-in"
            onClick={toggle}
            style={{
                borderRadius: 'var(--radius-full)',
                padding: '8px 16px',
                fontSize: '0.85rem',
                fontWeight: 700,
                minHeight: '40px',
                letterSpacing: '0.03em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
            }}
            aria-label="Toggle language"
        >
            <span
                className={language === 'ta' ? 'tamil' : ''}
                style={{
                    opacity: language === 'ta' ? 1 : 0.5,
                    transition: 'opacity 0.2s',
                }}
            >
                தமிழ்
            </span>
            <span
                style={{
                    width: '2px',
                    height: '16px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '1px',
                }}
            />
            <span
                style={{
                    opacity: language === 'en' ? 1 : 0.5,
                    transition: 'opacity 0.2s',
                }}
            >
                ENG
            </span>
        </button>
    );
}
