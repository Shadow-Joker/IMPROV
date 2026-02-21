/* ========================================
   SENTRAK — MentalProfileForm Component (Phase 2)
   15-question assessment with question cards,
   auto-advance, circular progress, voice prompts,
   and completion screen with radar + breakdown
   Owner: Rahul (feat/athlete)
   ======================================== */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Brain, Volume2, ChevronRight, CheckCircle, BarChart3, Star } from 'lucide-react';
import { MENTAL_QUESTIONS, calculateMentalProfile, getMentalResultMessage } from '../../utils/mentalScoring';
import { t } from '../../utils/translations';
import { useLanguage } from '../shared/LanguageToggle';
import MentalRadarChart from './MentalRadarChart';

const DIMENSIONS = ['toughness', 'teamwork', 'drive', 'strategy', 'discipline'];
const DIM_COLORS = {
    toughness: '#ef4444',
    teamwork: '#3b82f6',
    drive: '#f59e0b',
    strategy: '#10b981',
    discipline: '#8b5cf6',
};

export default function MentalProfileForm({ onComplete, athleteId }) {
    const { language } = useLanguage();
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState(Array(15).fill(0));
    const [completed, setCompleted] = useState(false);
    const [profile, setProfile] = useState(null);
    const [animatingAnswer, setAnimatingAnswer] = useState(false);
    const containerRef = useRef(null);

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
            const timer = setTimeout(() => speak(text), 400);
            return () => clearTimeout(timer);
        }
    }, [currentQ, completed, question, language, speak]);

    const handleAnswer = (value) => {
        if (animatingAnswer) return; // prevent double-tap
        setAnimatingAnswer(true);
        if (navigator.vibrate) navigator.vibrate(20);

        const newAnswers = [...answers];
        newAnswers[currentQ] = value;
        setAnswers(newAnswers);

        if (currentQ < MENTAL_QUESTIONS.length - 1) {
            // Auto-advance with slide animation
            setTimeout(() => {
                setCurrentQ(currentQ + 1);
                setAnimatingAnswer(false);
            }, 350);
        } else {
            // All done
            const prof = calculateMentalProfile(newAnswers);
            setProfile(prof);
            setCompleted(true);
            setAnimatingAnswer(false);
            if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 100]);
            if (onComplete) {
                onComplete({ profile: prof, score: prof.overall, answers: newAnswers });
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
    const circumference = 2 * Math.PI * 40;
    const circleOffset = circumference - (progressPct / 100) * circumference;

    // ─── COMPLETION SCREEN ────────────────────────────
    if (completed && profile) {
        const resultMsg = getMentalResultMessage(profile.overall, language);
        return (
            <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="glass-card-static text-center" style={{ padding: 'var(--space-2xl)' }}>
                    {/* Success icon */}
                    <div className="success-check-mental">
                        <CheckCircle size={48} className="text-success" />
                    </div>
                    <h2 className="heading-2 mb-sm">{t('mentalComplete', language)}</h2>

                    {/* Score with ring */}
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: 'var(--space-lg)' }}>
                        <svg width="120" height="120" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-tertiary)" strokeWidth="6" />
                            <circle
                                cx="50" cy="50" r="40" fill="none"
                                stroke="url(#mentalGrad)"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={0}
                                transform="rotate(-90 50 50)"
                                style={{ transition: 'stroke-dashoffset 1s ease' }}
                            />
                            <defs>
                                <linearGradient id="mentalGrad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#06b6d4" />
                                </linearGradient>
                            </defs>
                            <text x="50" y="46" textAnchor="middle" fill="var(--text-primary)" fontSize="24" fontWeight="900">{profile.overall}</text>
                            <text x="50" y="62" textAnchor="middle" fill="var(--text-muted)" fontSize="10">/100</text>
                        </svg>
                    </div>

                    {/* Result message */}
                    <p className="text-accent mb-lg" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                        {resultMsg}
                    </p>

                    {/* Radar chart */}
                    <MentalRadarChart profile={profile} score={profile.overall} />

                    {/* Dimension breakdown */}
                    <div className="mt-lg" style={{ textAlign: 'left' }}>
                        <h4 className="heading-4 mb-md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BarChart3 size={18} /> {language === 'ta' ? 'பரிமாண பகுப்பாய்வு' : 'Dimension Breakdown'}
                        </h4>
                        {DIMENSIONS.map(dim => (
                            <div key={dim} style={{ marginBottom: '12px' }}>
                                <div className="flex justify-between items-center mb-xs">
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize' }}>
                                        {t(dim, language)}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: DIM_COLORS[dim] }}>
                                        {profile[dim]}/5.0
                                    </span>
                                </div>
                                <div style={{
                                    width: '100%', height: '8px',
                                    background: 'var(--bg-tertiary)',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        width: `${(profile[dim] / 5) * 100}%`,
                                        height: '100%',
                                        background: DIM_COLORS[dim],
                                        borderRadius: '4px',
                                        transition: 'width 0.8s ease',
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <style>{`
                    .success-check-mental {
                        animation: successBounce 0.6s ease-out;
                        margin-bottom: var(--space-md);
                    }
                    @keyframes successBounce {
                        0% { transform: scale(0); }
                        60% { transform: scale(1.2); }
                        100% { transform: scale(1); }
                    }
                `}</style>
            </div>
        );
    }

    // ─── QUESTION SCREEN ────────────────────────────
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }} ref={containerRef}>
            {/* Header row with circular progress */}
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="flex items-center gap-sm">
                    <Brain size={20} className="text-accent" />
                    <span className="text-secondary" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {t('mentalAssessment', language)}
                    </span>
                </div>

                {/* Circular progress */}
                <div style={{ position: 'relative', width: '48px', height: '48px' }}>
                    <svg width="48" height="48" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" />
                        <circle
                            cx="50" cy="50" r="40" fill="none"
                            stroke="var(--accent-primary)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={circleOffset}
                            transform="rotate(-90 50 50)"
                            style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                        />
                    </svg>
                    <span style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-primary)',
                    }}>
                        {currentQ + 1}/{MENTAL_QUESTIONS.length}
                    </span>
                </div>
            </div>

            {/* Linear progress bar */}
            <div style={{
                width: '100%', height: '4px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                marginBottom: 'var(--space-lg)',
            }}>
                <div style={{
                    width: `${progressPct}%`,
                    height: '100%',
                    background: 'var(--gradient-hero)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.4s ease',
                }} />
            </div>

            {/* Question card */}
            <div className={`glass-card-static question-card-slide`} key={currentQ} style={{ marginBottom: 'var(--space-lg)' }}>
                {/* Dimension badge */}
                <div className="flex items-center gap-sm mb-md">
                    <span style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: DIM_COLORS[question.dimension] + '22',
                        color: DIM_COLORS[question.dimension],
                        textTransform: 'capitalize',
                    }}>
                        {t(question.dimension, language)}
                    </span>
                    <span className="text-muted" style={{ fontSize: '0.75rem', marginLeft: 'auto' }}>
                        Q{currentQ + 1}
                    </span>
                </div>

                {/* Question text */}
                <h3 className="heading-3 mb-sm">{question.question_en}</h3>
                <p className="tamil text-secondary mb-md" style={{ fontSize: '0.95rem' }}>
                    {question.question_ta}
                </p>

                {/* Speak again button */}
                <button
                    type="button"
                    className="btn btn-ghost mb-lg"
                    onClick={() => speak(language === 'ta' ? question.question_ta : question.question_en)}
                    style={{ fontSize: '0.8rem' }}
                >
                    <Volume2 size={16} /> {language === 'ta' ? 'மீண்டும் கேளுங்கள்' : 'Listen again'}
                </button>

                {/* Scale answer buttons */}
                <div className="flex-col gap-sm" style={{ display: 'flex' }}>
                    {scaleLabels.map((label, i) => {
                        const val = i + 1;
                        const isSelected = answers[currentQ] === val;
                        // Color gradient from red(1) to green(5)
                        const hue = (i / 4) * 120;
                        return (
                            <button
                                key={val}
                                type="button"
                                className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'} btn-lg`}
                                onClick={() => handleAnswer(val)}
                                disabled={animatingAnswer}
                                style={{
                                    justifyContent: 'flex-start',
                                    textAlign: 'left',
                                    transition: 'all 0.2s ease',
                                    opacity: animatingAnswer ? 0.6 : 1,
                                }}
                            >
                                <span style={{
                                    width: '32px', height: '32px',
                                    borderRadius: 'var(--radius-full)',
                                    background: isSelected
                                        ? 'rgba(255,255,255,0.2)'
                                        : `hsla(${hue}, 70%, 50%, 0.15)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
                                    color: isSelected ? '#fff' : `hsl(${hue}, 70%, 60%)`,
                                }}>
                                    {val}
                                </span>
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Slide animation CSS */}
            <style>{`
                .question-card-slide {
                    animation: questionSlideIn 0.3s ease-out;
                }
                @keyframes questionSlideIn {
                    from { transform: translateX(40px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
