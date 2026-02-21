/* ========================================
   SENTRAK — RegisterForm Component
   Multi-step voice-first registration
   Owner: Rahul (feat/athlete)
   ======================================== */

import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Calendar, Users, Trophy, MapPin, Camera, CheckCircle,
    ChevronLeft, ChevronRight, Loader
} from 'lucide-react';
import { createAthlete, SPORTS, GENDERS } from '../../utils/dataShapes';
import { t } from '../../utils/translations';
import { useLanguage } from '../shared/LanguageToggle';
import VoiceInput from '../shared/VoiceInput';

const TN_DISTRICTS = [
    'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
    'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram',
    'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam',
    'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram',
    'Ranipet', 'Salem', 'Sivagangai', 'Tenkasi', 'Thanjavur',
    'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur',
    'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore',
    'Viluppuram', 'Virudhunagar', 'Kallakurichi'
];

const SPORT_ICONS = {
    Cricket: '🏏', Football: '⚽', Kabaddi: '🤼', Hockey: '🏑',
    Badminton: '🏸', Wrestling: '🤼‍♂️', Athletics_Track: '🏃',
    Athletics_Field: '🏋️', Swimming: '🏊', Boxing: '🥊',
    Archery: '🏹', Weightlifting: '🏋️‍♂️',
};

const TOTAL_STEPS = 6;

export default function RegisterForm() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const [form, setForm] = useState({
        name: '',
        nameTamil: '',
        age: '',
        gender: '',
        sport: '',
        district: '',
        village: '',
        photoURL: '',
    });

    const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    // Speech synthesis for conversational mode
    const speak = useCallback((text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
            utter.rate = 0.9;
            window.speechSynthesis.speak(utter);
        }
    }, [language]);

    // Camera functions
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 480, height: 480 },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch {
            setToast(t('cameraError', language));
            setTimeout(() => setToast(null), 3000);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        const size = Math.min(video.videoWidth, video.videoHeight);
        const sx = (video.videoWidth - size) / 2;
        const sy = (video.videoHeight - size) / 2;
        ctx.drawImage(video, sx, sy, size, size, 0, 0, 300, 300);
        const dataURL = canvas.toDataURL('image/jpeg', 0.7);
        update('photoURL', dataURL);
        stopCamera();
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => update('photoURL', ev.target.result);
        reader.readAsDataURL(file);
    };

    const canProceed = () => {
        switch (step) {
            case 1: return form.name.trim().length > 0;
            case 2: return form.age && parseInt(form.age) > 0 && form.gender;
            case 3: return form.sport;
            case 4: return form.district;
            case 5: return true; // photo is optional
            case 6: return true;
            default: return false;
        }
    };

    const handleNext = () => {
        if (step < TOTAL_STEPS) {
            const nextStep = step + 1;
            setStep(nextStep);
            // Speak next prompt
            const prompts = {
                2: t('promptAge', language),
                3: t('promptSport', language),
                4: t('promptDistrict', language),
                5: t('promptPhoto', language),
                6: t('promptReview', language),
            };
            if (prompts[nextStep]) speak(prompts[nextStep]);
            if (nextStep === 5) startCamera();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            if (step === 5) stopCamera();
            setStep(step - 1);
        }
    };

    const handleSubmit = () => {
        setSaving(true);
        const athlete = createAthlete({
            name: form.name.trim(),
            nameTamil: form.nameTamil.trim(),
            age: parseInt(form.age) || 0,
            gender: form.gender,
            sport: form.sport,
            district: form.district,
            village: form.village.trim(),
            photoURL: form.photoURL,
        });

        try {
            const athletes = JSON.parse(localStorage.getItem('sentrak_athletes') || '[]');
            athletes.push(athlete);
            localStorage.setItem('sentrak_athletes', JSON.stringify(athletes));
            setToast(t('registerSuccess', language));
            setTimeout(() => {
                navigate(`/profile/${athlete.id}`);
            }, 1000);
        } catch {
            setToast(t('error', language));
            setSaving(false);
        }
    };

    const voiceLang = language === 'ta' ? 'ta-IN' : 'en-IN';
    const progressPct = (step / TOTAL_STEPS) * 100;

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="animate-fade-in flex-col gap-md" style={{ display: 'flex' }}>
                        <div className="flex items-center gap-sm mb-md">
                            <User size={24} className="text-accent" />
                            <h2 className="heading-3">{t('step1Title', language)}</h2>
                        </div>
                        <VoiceInput
                            label={t('name', language)}
                            placeholder={t('promptName', language)}
                            value={form.name}
                            onChange={(v) => update('name', v)}
                            language={voiceLang}
                        />
                        <VoiceInput
                            label={t('nameTamil', language)}
                            placeholder={t('promptNameTamil', language)}
                            value={form.nameTamil}
                            onChange={(v) => update('nameTamil', v)}
                            language="ta-IN"
                        />
                    </div>
                );

            case 2:
                return (
                    <div className="animate-fade-in flex-col gap-md" style={{ display: 'flex' }}>
                        <div className="flex items-center gap-sm mb-md">
                            <Calendar size={24} className="text-accent" />
                            <h2 className="heading-3">{t('step2Title', language)}</h2>
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t('age', language)}</label>
                            <input
                                type="number"
                                className="form-input"
                                min="5"
                                max="25"
                                value={form.age}
                                onChange={(e) => update('age', e.target.value)}
                                placeholder={t('promptAge', language)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t('gender', language)}</label>
                            <div className="flex gap-sm flex-wrap">
                                {GENDERS.map((g) => (
                                    <button
                                        key={g}
                                        type="button"
                                        className={`btn ${form.gender === g ? 'btn-primary' : 'btn-secondary'} btn-lg`}
                                        onClick={() => update('gender', g)}
                                        style={{ flex: 1, minWidth: '100px' }}
                                    >
                                        {g === 'male' ? '♂️' : g === 'female' ? '♀️' : '⚧️'}{' '}
                                        {t(g, language)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="animate-fade-in">
                        <div className="flex items-center gap-sm mb-md">
                            <Trophy size={24} className="text-accent" />
                            <h2 className="heading-3">{t('step3Title', language)}</h2>
                        </div>
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                            {SPORTS.map((sport) => (
                                <button
                                    key={sport}
                                    type="button"
                                    className={`btn ${form.sport === sport ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => update('sport', sport)}
                                    style={{ flexDirection: 'column', padding: '16px 12px', minHeight: '80px', fontSize: '0.85rem' }}
                                >
                                    <span style={{ fontSize: '1.5rem' }}>{SPORT_ICONS[sport] || '🏅'}</span>
                                    {sport.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="animate-fade-in flex-col gap-md" style={{ display: 'flex' }}>
                        <div className="flex items-center gap-sm mb-md">
                            <MapPin size={24} className="text-accent" />
                            <h2 className="heading-3">{t('step4Title', language)}</h2>
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t('district', language)}</label>
                            <select
                                className="form-select"
                                value={form.district}
                                onChange={(e) => update('district', e.target.value)}
                            >
                                <option value="">{t('promptDistrict', language)}</option>
                                {TN_DISTRICTS.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                        <VoiceInput
                            label={t('village', language)}
                            placeholder={t('promptVillage', language)}
                            value={form.village}
                            onChange={(v) => update('village', v)}
                            language={voiceLang}
                        />
                    </div>
                );

            case 5:
                return (
                    <div className="animate-fade-in flex-col gap-md" style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="flex items-center gap-sm mb-md" style={{ alignSelf: 'flex-start' }}>
                            <Camera size={24} className="text-accent" />
                            <h2 className="heading-3">{t('step5Title', language)}</h2>
                        </div>

                        {form.photoURL ? (
                            <div className="flex-col gap-md" style={{ display: 'flex', alignItems: 'center' }}>
                                <img
                                    src={form.photoURL}
                                    alt="Athlete"
                                    style={{
                                        width: '200px',
                                        height: '200px',
                                        borderRadius: 'var(--radius-lg)',
                                        objectFit: 'cover',
                                        border: '3px solid var(--accent-primary)',
                                    }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => { update('photoURL', ''); startCamera(); }}
                                >
                                    Retake
                                </button>
                            </div>
                        ) : (
                            <>
                                <div
                                    style={{
                                        width: '280px',
                                        height: '280px',
                                        borderRadius: 'var(--radius-lg)',
                                        overflow: 'hidden',
                                        border: '2px solid rgba(255,255,255,0.1)',
                                        background: 'var(--bg-tertiary)',
                                    }}
                                >
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                                    />
                                </div>
                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                                <div className="flex gap-sm">
                                    <button type="button" className="btn btn-primary btn-lg" onClick={capturePhoto}>
                                        📸 Capture
                                    </button>
                                    <label className="btn btn-secondary btn-lg" style={{ cursor: 'pointer' }}>
                                        📁 Upload
                                        <input
                                            type="file"
                                            accept="image/*"
                                            capture="user"
                                            onChange={handleFileUpload}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </div>
                            </>
                        )}
                    </div>
                );

            case 6:
                return (
                    <div className="animate-fade-in">
                        <div className="flex items-center gap-sm mb-md">
                            <CheckCircle size={24} className="text-success" />
                            <h2 className="heading-3">{t('step6Title', language)}</h2>
                        </div>
                        <div className="glass-card-static">
                            <div className="flex gap-md items-center mb-lg">
                                {form.photoURL && (
                                    <img
                                        src={form.photoURL}
                                        alt=""
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: 'var(--radius-full)',
                                            objectFit: 'cover',
                                            border: '2px solid var(--accent-primary)',
                                        }}
                                    />
                                )}
                                <div>
                                    <h3 className="heading-3">{form.name}</h3>
                                    {form.nameTamil && <p className="tamil text-secondary">{form.nameTamil}</p>}
                                </div>
                            </div>
                            <div className="flex-col gap-sm" style={{ display: 'flex' }}>
                                <ReviewRow label={t('age', language)} value={form.age} />
                                <ReviewRow label={t('gender', language)} value={t(form.gender, language)} />
                                <ReviewRow label={t('sport', language)} value={form.sport?.replace('_', ' ')} />
                                <ReviewRow label={t('district', language)} value={form.district} />
                                <ReviewRow label={t('village', language)} value={form.village || '—'} />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {/* Progress bar */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="flex justify-between items-center mb-sm">
                    <span className="text-secondary" style={{ fontSize: '0.8rem' }}>
                        {step} {t('questionOf', language)} {TOTAL_STEPS}
                    </span>
                    <span className="text-secondary" style={{ fontSize: '0.8rem' }}>
                        {Math.round(progressPct)}%
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

            {/* Step content */}
            <div className="glass-card-static" style={{ marginBottom: 'var(--space-lg)' }}>
                {renderStep()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between gap-md">
                {step > 1 ? (
                    <button type="button" className="btn btn-secondary" onClick={handleBack}>
                        <ChevronLeft size={18} /> {t('back', language)}
                    </button>
                ) : (
                    <div />
                )}
                {step < TOTAL_STEPS ? (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleNext}
                        disabled={!canProceed()}
                        style={{ opacity: canProceed() ? 1 : 0.5 }}
                    >
                        {t('next', language)} <ChevronRight size={18} />
                    </button>
                ) : (
                    <button
                        type="button"
                        className="btn btn-success btn-lg"
                        onClick={handleSubmit}
                        disabled={saving}
                    >
                        {saving ? (
                            <><Loader size={18} className="animate-pulse" /> {t('loading', language)}</>
                        ) : (
                            <><CheckCircle size={18} /> {t('submit', language)}</>
                        )}
                    </button>
                )}
            </div>

            {/* Toast */}
            {toast && (
                <div className="toast toast-success animate-slide-up">
                    {toast}
                </div>
            )}
        </div>
    );
}

function ReviewRow({ label, value }) {
    return (
        <div className="flex justify-between items-center" style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-secondary" style={{ fontSize: '0.85rem' }}>{label}</span>
            <span style={{ fontWeight: 600 }}>{value}</span>
        </div>
    );
}
