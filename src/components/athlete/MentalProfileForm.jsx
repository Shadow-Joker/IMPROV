/* ========================================
   SENTRAK — MentalProfileForm Component
   15-question voice-first mental assessment
   Owner: Rahul (feat/athlete)
   ======================================== */

import { useState, useCallback, useEffect } from 'react';
import { Brain, Volume2, ChevronRight, CheckCircle } from 'lucide-react';
import { MENTAL_QUESTIONS, calculateMentalProfile, calculateMentalScore } from '../../utils/mentalScoring';
import { t } from '../../utils/translations';
import { useLanguage } from '../shared/LanguageToggle';
import MentalRadarChart from './MentalRadarChart';

export default function MentalProfileForm({ onComplete, athleteId }) {
    const { language } = useLanguage();
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState(Array(15).fill(0));
    const [completed, setCompleted] = useState(false);
    const [profile, setProfile] = useState(null);
    const [score, setScore] = useState(0);

    const question = MENTAL_QUESTIONS[currentQ];

    // Speak question on change
    const speak = useCallback((text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
            utter.rate = 0.85;
            window.speechSynthesis.speak(utter);
        }
    }, [language]);

    useEffect(() => {
        if (!completed && question) {
            const text = language === 'ta' ? question.question_ta : question.question_en;
            // Small delay so animation plays first
            const timer = setTimeout(() => speak(text), 400);
            return () => clearTimeout(timer);
        }
    }, [currentQ, completed, question, language, speak]);

    const handleAnswer = (value) => {
        const newAnswers = [...answers];
        newAnswers[currentQ] = value;
        setAnswers(newAnswers);

        if (currentQ < MENTAL_QUESTIONS.length - 1) {
            setTimeout(() => setCurrentQ(currentQ + 1), 300);
        } else {
            // All done
            const prof = calculateMentalProfile(newAnswers);
            const sc = calculateMentalScore(prof);
            setProfile(prof);
            setScore(sc);
            setCompleted(true);
            if (onComplete) {
                onComplete({ profile: prof, score: sc, answers: newAnswers });
            }
        }
    };

    const scaleLabels = [
        t('scale1', language),
        t('scale2', language),
        t('scale3', language),
        t('scale4', language),
        t('scale5', language),
    ];

    const progressPct = ((currentQ + (completed ? 1 : 0)) / MENTAL_QUESTIONS.length) * 100;

    if (completed && profile) {
        return (
            <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="glass-card-static text-center">
                    <CheckCircle size={48} className="text-success" style={{ marginBottom: 'var(--space-md)' }} />
                    <h2 className="heading-2 mb-sm">{t('mentalComplete', language)}</h2>
                    <p className="text-secondary mb-lg">
                        {t('overallScore', language)}: <strong className="text-accent" style={{ fontSize: '2rem' }}>{score}</strong>/100
                    </p>
                    <MentalRadarChart profile={profile} score={score} />
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {/* Progress */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="flex justify-between items-center mb-sm">
                    <span className="text-secondary" style={{ fontSize: '0.8rem' }}>
                        {t('mentalAssessment', language)}
                    </span>
                    <span className="text-secondary" style={{ fontSize: '0.8rem' }}>
                        {currentQ + 1} {t('questionOf', language)} {MENTAL_QUESTIONS.length}
                    </span>
                </div>
                <div style={{
                    width: '100%',
                    height: '4px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        width: `${progressPct}%`,
                        height: '100%',
                        background: 'var(--gradient-hero)',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.4s ease',
                    }} />
                </div>
            </div>

            {/* Question card */}
            <div className="glass-card-static animate-fade-in" key={currentQ} style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="flex items-center gap-sm mb-md">
                    <Brain size={24} className="text-accent" />
                    <span className="badge badge-verified">{question.dimension}</span>
                </div>

                {/* Question text */}
                <h3 className="heading-3 mb-sm">{question.question_en}</h3>
                <p className="tamil text-secondary mb-lg" style={{ fontSize: '1rem' }}>
                    {question.question_ta}
                </p>

                {/* Speak button */}
                <button
                    type="button"
                    className="btn btn-ghost mb-lg"
                    onClick={() => speak(language === 'ta' ? question.question_ta : question.question_en)}
                >
                    <Volume2 size={18} /> {language === 'ta' ? 'மீண்டும் கேளுங்கள்' : 'Listen again'}
                </button>

                {/* Scale buttons */}
                <div className="flex-col gap-sm" style={{ display: 'flex' }}>
                    {scaleLabels.map((label, i) => {
                        const val = i + 1;
                        return (
                            <button
                                key={val}
                                type="button"
                                className={`btn ${answers[currentQ] === val ? 'btn-primary' : 'btn-secondary'} btn-lg`}
                                onClick={() => handleAnswer(val)}
                                style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                            >
                                <span style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: 'var(--radius-full)',
                                    background: answers[currentQ] === val ? 'rgba(255,255,255,0.2)' : 'var(--bg-glass)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    flexShrink: 0,
                                }}>
                                    {val}
                                </span>
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
