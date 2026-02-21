/* ========================================
   SENTRAK — RegisterForm Component (Phase 2)
   Multi-step voice-first registration with
   progress dots, slide animations, validation,
   Tamil script detection, and celebration
   Owner: Rahul (feat/athlete)
   ======================================== */

import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast as globalToast } from '../shared/Toast';
import {
    User, Calendar, Users, Trophy, MapPin, Camera, CheckCircle,
    ChevronLeft, ChevronRight, Loader, Upload, Star, Edit2
} from 'lucide-react';
import { createAthlete, SPORTS, GENDERS, AGE_GROUPS, getRatingTier } from '../../utils/dataShapes';
import { t } from '../../utils/translations';
import { useLanguage } from '../shared/LanguageToggle';
import VoiceInput from '../shared/VoiceInput';

const TN_DISTRICTS = [
    { en: 'Ariyalur', ta: 'அரியலூர்' }, { en: 'Chengalpattu', ta: 'செங்கல்பட்டு' },
    { en: 'Chennai', ta: 'சென்னை' }, { en: 'Coimbatore', ta: 'கோயம்புத்தூர்' },
    { en: 'Cuddalore', ta: 'கடலூர்' }, { en: 'Dharmapuri', ta: 'தர்மபுரி' },
    { en: 'Dindigul', ta: 'திண்டுக்கல்' }, { en: 'Erode', ta: 'ஈரோடு' },
    { en: 'Kallakurichi', ta: 'கள்ளக்குறிச்சி' }, { en: 'Kanchipuram', ta: 'காஞ்சிபுரம்' },
    { en: 'Karur', ta: 'கரூர்' }, { en: 'Krishnagiri', ta: 'கிருஷ்ணகிரி' },
    { en: 'Madurai', ta: 'மதுரை' }, { en: 'Mayiladuthurai', ta: 'மயிலாடுதுறை' },
    { en: 'Nagapattinam', ta: 'நாகப்பட்டினம்' }, { en: 'Namakkal', ta: 'நாமக்கல்' },
    { en: 'Nilgiris', ta: 'நீலகிரி' }, { en: 'Perambalur', ta: 'பெரம்பலூர்' },
    { en: 'Pudukkottai', ta: 'புதுக்கோட்டை' }, { en: 'Ramanathapuram', ta: 'ராமநாதபுரம்' },
    { en: 'Ranipet', ta: 'ராணிப்பேட்டை' }, { en: 'Salem', ta: 'சேலம்' },
    { en: 'Sivagangai', ta: 'சிவகங்கை' }, { en: 'Tenkasi', ta: 'தென்காசி' },
    { en: 'Thanjavur', ta: 'தஞ்சாவூர்' }, { en: 'Theni', ta: 'தேனி' },
    { en: 'Thoothukudi', ta: 'தூத்துக்குடி' }, { en: 'Tiruchirappalli', ta: 'திருச்சிராப்பள்ளி' },
    { en: 'Tirunelveli', ta: 'திருநெல்வேலி' }, { en: 'Tirupathur', ta: 'திருப்பத்தூர்' },
    { en: 'Tiruppur', ta: 'திருப்பூர்' }, { en: 'Tiruvallur', ta: 'திருவள்ளூர்' },
    { en: 'Tiruvannamalai', ta: 'திருவண்ணாமலை' }, { en: 'Tiruvarur', ta: 'திருவாரூர்' },
    { en: 'Vellore', ta: 'வேலூர்' }, { en: 'Viluppuram', ta: 'விழுப்புரம்' },
    { en: 'Virudhunagar', ta: 'விருதுநகர்' },
];

const SPORT_ICONS = {
    Cricket: '🏏', Football: '⚽', Kabaddi: '🤼', Hockey: '🏑',
    Badminton: '🏸', Wrestling: '🤼‍♂️', Athletics_Track: '🏃',
    Athletics_Field: '🏋️', Swimming: '🏊', Boxing: '🥊',
    Archery: '🏹', Weightlifting: '🏋️‍♂️',
};

// Popular sports by district — hardcoded top 2
const POPULAR_SPORTS = {
    Chennai: ['Cricket', 'Football'],
    Madurai: ['Kabaddi', 'Cricket'],
    Coimbatore: ['Cricket', 'Badminton'],
    _default: ['Cricket', 'Kabaddi'],
};

const GENDER_ICONS = { male: '♂️', female: '♀️', other: '⚧️' };

const TOTAL_STEPS = 6;
const STEP_ICONS = [User, Calendar, Trophy, MapPin, Camera, CheckCircle];

// Detect Tamil script (Unicode range \u0B80-\u0BFF)
function isTamilScript(text) {
    return /[\u0B80-\u0BFF]/.test(text);
}

// Get age group from age
function getAgeGroup(age) {
    const num = parseInt(age);
    if (!num) return '';
    const group = AGE_GROUPS?.find(g => num >= g.min && num <= g.max);
    return group ? group.label : (num <= 12 ? 'U-12' : num <= 14 ? 'U-14' : num <= 17 ? 'U-17' : num <= 21 ? 'U-21' : 'Senior');
}

export default function RegisterForm() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [step, setStep] = useState(1);
    const [slideDir, setSlideDir] = useState('right');
    const [saving, setSaving] = useState(false);
    const [localToast, setLocalToast] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [newAthlete, setNewAthlete] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [districtSearch, setDistrictSearch] = useState('');
    const [cameraFailed, setCameraFailed] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const nameRef = useRef(null);

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

    const update = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        // Clear validation error when user inputs
        setValidationErrors(prev => ({ ...prev, [field]: null }));
    };

    // Auto-focus name field on mount
    useEffect(() => {
        if (step === 1 && nameRef.current) {
            setTimeout(() => nameRef.current?.focus(), 300);
        }
    }, [step]);

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
        setCameraFailed(false);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 480, height: 480 },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch {
            setCameraFailed(true);
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
        if (navigator.vibrate) navigator.vibrate(50);
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

    // Name handler with Tamil script auto-detection
    const handleNameChange = (value) => {
        if (isTamilScript(value) && !form.name) {
            // If voice gives Tamil for the English name field, redirect to Tamil name
            update('nameTamil', value);
        } else {
            update('name', value);
        }
    };

    // Validation
    const validate = (stepNum) => {
        const errors = {};
        switch (stepNum) {
            case 1:
                if (form.name.trim().length < 2) errors.name = language === 'ta' ? 'பெயர் குறைந்தது 2 எழுத்துகள்' : 'Name must be at least 2 characters';
                break;
            case 2:
                if (!form.age || parseInt(form.age) < 8 || parseInt(form.age) > 25) errors.age = language === 'ta' ? 'வயது 8-25 இடையே இருக்க வேண்டும்' : 'Age must be between 8 and 25';
                if (!form.gender) errors.gender = language === 'ta' ? 'பாலினத்தைத் தேர்ந்தெடுக்கவும்' : 'Please select gender';
                break;
            case 3:
                if (!form.sport) errors.sport = language === 'ta' ? 'விளையாட்டைத் தேர்ந்தெடுக்கவும்' : 'Please select a sport';
                break;
            case 4:
                if (!form.district) errors.district = language === 'ta' ? 'மாவட்டத்தைத் தேர்ந்தெடுக்கவும்' : 'Please select a district';
                break;
            default: break;
        }
        return errors;
    };

    const canProceed = () => {
        switch (step) {
            case 1: return form.name.trim().length >= 2;
            case 2: return form.age && parseInt(form.age) >= 8 && parseInt(form.age) <= 25 && form.gender;
            case 3: return !!form.sport;
            case 4: return !!form.district;
            case 5: return true;
            case 6: return true;
            default: return false;
        }
    };

    const handleNext = () => {
        const errors = validate(step);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        if (step < TOTAL_STEPS) {
            setSlideDir('right');
            const nextStep = step + 1;
            setStep(nextStep);
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
            setSlideDir('left');
            setStep(step - 1);
        }
    };

    const jumpToStep = (targetStep) => {
        if (step === 5) stopCamera();
        setSlideDir(targetStep < step ? 'left' : 'right');
        setStep(targetStep);
        if (targetStep === 5) startCamera();
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
            setNewAthlete(athlete);
            setSubmitted(true);
            globalToast.success('Athlete registered successfully!');
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
            // Auto-navigate after 3 seconds
            setTimeout(() => navigate(`/profile/${athlete.id}`), 3000);
        } catch {
            setLocalToast(t('saveError', language));
            setSaving(false);
        }
    };

    const voiceLang = language === 'ta' ? 'ta-IN' : 'en-IN';
    const progressPct = (step / TOTAL_STEPS) * 100;
    const filteredDistricts = districtSearch
        ? TN_DISTRICTS.filter(d =>
            d.en.toLowerCase().includes(districtSearch.toLowerCase()) ||
            d.ta.includes(districtSearch))
        : TN_DISTRICTS;
    const popularSports = POPULAR_SPORTS[form.district] || POPULAR_SPORTS._default;

    // ─── SUCCESS SCREEN ────────────────────────────
    if (submitted && newAthlete) {
        const tier = getRatingTier(newAthlete.talentRating || 1000);
        return (
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <div className="glass-card-static animate-fade-in" style={{ padding: 'var(--space-2xl)' }}>
                    {/* Confetti effect */}
                    <div className="confetti-container">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <span key={i} className="confetti-piece" style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 1}s`,
                                background: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'][i % 5],
                            }} />
                        ))}
                    </div>

                    {/* Success checkmark */}
                    <div className="success-check">
                        <CheckCircle size={64} color="var(--accent-success, #10b981)" />
                    </div>

                    <h2 className="heading-2 mt-md">{t('athleteRegistered', language)}</h2>
                    <p className="text-secondary mb-lg">{t('registerSuccess', language)}</p>

                    {/* Quick stats */}
                    <div className="glass-card-static" style={{ textAlign: 'left', marginBottom: 'var(--space-lg)' }}>
                        <div className="flex gap-md items-center mb-md">
                            {newAthlete.photoURL && (
                                <img src={newAthlete.photoURL} alt="" style={{
                                    width: '60px', height: '60px',
                                    borderRadius: 'var(--radius-full)',
                                    objectFit: 'cover',
                                    border: '2px solid var(--accent-primary)',
                                }} />
                            )}
                            <div>
                                <h3 className="heading-3">{newAthlete.name}</h3>
                                {newAthlete.nameTamil && <p className="tamil text-secondary">{newAthlete.nameTamil}</p>}
                            </div>
                        </div>
                        <div className="flex gap-sm flex-wrap">
                            <span className="badge badge-verified"><Trophy size={12} /> {newAthlete.sport?.replace('_', ' ')}</span>
                            <span className="badge badge-pending">{newAthlete.age} {t('age', language)}</span>
                        </div>
                        <div className="text-center mt-md">
                            <span className="text-gradient" style={{ fontSize: '2rem', fontWeight: 900 }}>
                                {newAthlete.talentRating || 1000}
                            </span>
                            <span className={`badge ${tier.class}`} style={{ marginLeft: '8px' }}>
                                <Star size={12} /> {tier.name}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-sm justify-center flex-wrap">
                        <button className="btn btn-primary" onClick={() => navigate(`/profile/${newAthlete.id}`)}>
                            {t('viewProfile', language)}
                        </button>
                        <button className="btn btn-secondary" onClick={() => {
                            setSubmitted(false);
                            setNewAthlete(null);
                            setSaving(false);
                            setStep(1);
                            setForm({ name: '', nameTamil: '', age: '', gender: '', sport: '', district: '', village: '', photoURL: '' });
                        }}>
                            {t('registerAnother', language)}
                        </button>
                    </div>
                </div>

                <style>{`
                    .confetti-container {
                        position: absolute;
                        top: 0; left: 0; right: 0;
                        height: 120px;
                        overflow: hidden;
                        pointer-events: none;
                    }
                    .confetti-piece {
                        position: absolute;
                        width: 8px; height: 8px;
                        top: -10px;
                        border-radius: 2px;
                        animation: confettiFall 2s ease-out forwards;
                    }
                    @keyframes confettiFall {
                        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                        100% { transform: translateY(120px) rotate(720deg); opacity: 0; }
                    }
                    .success-check {
                        animation: successBounce 0.6s ease-out;
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

    // ─── STEP CONTENT ────────────────────────────
    const renderStep = () => {
        const animClass = `step-slide-${slideDir}`;

        switch (step) {
            case 1:
                return (
                    <div className={`${animClass} flex-col gap-md`} key="step1" style={{ display: 'flex' }}>
                        <div className="flex items-center gap-sm mb-md">
                            <User size={24} className="text-accent" />
                            <h2 className="heading-3">{t('step1Title', language)}</h2>
                        </div>
                        <VoiceInput
                            label={t('name', language)}
                            placeholder={t('promptName', language)}
                            value={form.name}
                            onChange={handleNameChange}
                            language={voiceLang}
                            speakQuestion={true}
                        />
                        {validationErrors.name && <p className="validation-error">{validationErrors.name}</p>}
                        <VoiceInput
                            label={t('nameTamil', language)}
                            placeholder="தமிழில் பெயர்"
                            value={form.nameTamil}
                            onChange={(v) => update('nameTamil', v)}
                            language="ta-IN"
                        />
                    </div>
                );

            case 2:
                return (
                    <div className={`${animClass} flex-col gap-md`} key="step2" style={{ display: 'flex' }}>
                        <div className="flex items-center gap-sm mb-md">
                            <Calendar size={24} className="text-accent" />
                            <h2 className="heading-3">{t('step2Title', language)}</h2>
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t('age', language)}</label>
                            <div className="flex items-center gap-sm">
                                <button type="button" className="btn btn-secondary" onClick={() => {
                                    const v = Math.max(8, (parseInt(form.age) || 8) - 1);
                                    update('age', String(v));
                                }} style={{ width: '48px', height: '48px', fontSize: '1.2rem', padding: 0 }}>−</button>
                                <input
                                    type="number"
                                    className="form-input"
                                    min="8" max="25"
                                    value={form.age}
                                    onChange={(e) => update('age', e.target.value)}
                                    placeholder={t('promptAge', language)}
                                    style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, maxWidth: '100px' }}
                                />
                                <button type="button" className="btn btn-secondary" onClick={() => {
                                    const v = Math.min(25, (parseInt(form.age) || 8) + 1);
                                    update('age', String(v));
                                }} style={{ width: '48px', height: '48px', fontSize: '1.2rem', padding: 0 }}>+</button>
                                {form.age && (
                                    <span className="badge badge-verified" style={{ fontSize: '0.8rem' }}>
                                        {getAgeGroup(form.age)}
                                    </span>
                                )}
                            </div>
                            {validationErrors.age && <p className="validation-error">{validationErrors.age}</p>}
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
                                        style={{ flex: 1, minWidth: '100px', transition: 'all 0.2s ease' }}
                                    >
                                        {GENDER_ICONS[g] || '⚧️'} {t(g, language)}
                                    </button>
                                ))}
                            </div>
                            {validationErrors.gender && <p className="validation-error">{validationErrors.gender}</p>}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className={`${animClass}`} key="step3">
                        <div className="flex items-center gap-sm mb-md">
                            <Trophy size={24} className="text-accent" />
                            <h2 className="heading-3">{t('step3Title', language)}</h2>
                        </div>
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                            {SPORTS.map((sport) => {
                                const isPopular = popularSports.includes(sport);
                                return (
                                    <button
                                        key={sport}
                                        type="button"
                                        className={`btn ${form.sport === sport ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => update('sport', sport)}
                                        style={{
                                            flexDirection: 'column',
                                            padding: '16px 12px',
                                            minHeight: '80px',
                                            fontSize: '0.85rem',
                                            position: 'relative',
                                            transition: 'all 0.2s ease',
                                            transform: form.sport === sport ? 'scale(1.05)' : 'scale(1)',
                                            border: form.sport === sport ? '2px solid var(--accent-primary)' : undefined,
                                        }}
                                    >
                                        {isPopular && (
                                            <span style={{
                                                position: 'absolute', top: '4px', right: '4px',
                                                fontSize: '0.6rem', background: 'var(--accent-primary)',
                                                color: '#fff', padding: '1px 5px', borderRadius: '999px',
                                                fontWeight: 700,
                                            }}>
                                                {language === 'ta' ? 'பிரபலம்' : 'Popular'}
                                            </span>
                                        )}
                                        <span style={{ fontSize: '1.5rem' }}>{SPORT_ICONS[sport] || '🏅'}</span>
                                        {sport.replace('_', ' ')}
                                    </button>
                                );
                            })}
                        </div>
                        {validationErrors.sport && <p className="validation-error">{validationErrors.sport}</p>}
                    </div>
                );

            case 4:
                return (
                    <div className={`${animClass} flex-col gap-md`} key="step4" style={{ display: 'flex' }}>
                        <div className="flex items-center gap-sm mb-md">
                            <MapPin size={24} className="text-accent" />
                            <h2 className="heading-3">{t('step4Title', language)}</h2>
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t('district', language)}</label>
                            <input
                                type="text"
                                className="form-input mb-sm"
                                placeholder={language === 'ta' ? '🔍 மாவட்டத்தைத் தேடு...' : '🔍 Search district...'}
                                value={districtSearch}
                                onChange={(e) => setDistrictSearch(e.target.value)}
                            />
                            <div style={{
                                maxHeight: '240px', overflowY: 'auto',
                                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                gap: '8px',
                            }}>
                                {filteredDistricts.map((d) => (
                                    <button
                                        key={d.en}
                                        type="button"
                                        className={`btn ${form.district === d.en ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => { update('district', d.en); setDistrictSearch(''); }}
                                        style={{ fontSize: '0.8rem', padding: '10px', justifyContent: 'flex-start', textAlign: 'left' }}
                                    >
                                        {d.en} <span className="text-muted" style={{ fontSize: '0.7rem', marginLeft: '4px' }}>({d.ta})</span>
                                    </button>
                                ))}
                            </div>
                            {validationErrors.district && <p className="validation-error">{validationErrors.district}</p>}
                        </div>
                        <VoiceInput
                            label={t('village', language)}
                            placeholder={t('promptVillage', language)}
                            value={form.village}
                            onChange={(v) => update('village', v)}
                            language={voiceLang}
                        />
                        {form.district && form.village && (
                            <div className="flex items-center gap-xs text-accent" style={{ fontSize: '0.85rem' }}>
                                📍 {form.village}, {form.district}
                            </div>
                        )}
                    </div>
                );

            case 5:
                return (
                    <div className={`${animClass} flex-col gap-md`} key="step5" style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="flex items-center gap-sm mb-md" style={{ alignSelf: 'flex-start' }}>
                            <Camera size={24} className="text-accent" />
                            <h2 className="heading-3">{t('step5Title', language)}</h2>
                        </div>

                        {form.photoURL ? (
                            <div className="flex-col gap-md" style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={form.photoURL}
                                        alt="Athlete"
                                        style={{
                                            width: '200px', height: '200px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: '3px solid var(--accent-primary)',
                                            boxShadow: 'var(--shadow-glow)',
                                        }}
                                    />
                                    <CheckCircle
                                        size={32}
                                        color="var(--accent-success, #10b981)"
                                        style={{
                                            position: 'absolute', bottom: '8px', right: '8px',
                                            background: 'var(--bg-primary)',
                                            borderRadius: '50%',
                                        }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => { update('photoURL', ''); startCamera(); }}
                                >
                                    {t('retakePhoto', language)}
                                </button>
                            </div>
                        ) : cameraFailed ? (
                            <div className="flex-col gap-md" style={{ display: 'flex', alignItems: 'center' }}>
                                {/* Default avatar */}
                                <div style={{
                                    width: '200px', height: '200px',
                                    borderRadius: '50%',
                                    background: 'var(--bg-tertiary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '2px dashed rgba(255,255,255,0.2)',
                                }}>
                                    <User size={64} color="var(--text-muted)" />
                                </div>
                                <p className="text-secondary" style={{ fontSize: '0.85rem', textAlign: 'center' }}>
                                    {t('cameraPermissionDenied', language)}
                                </p>
                                <label className="btn btn-primary btn-lg" style={{ cursor: 'pointer' }}>
                                    <Upload size={18} /> {t('uploadFromGallery', language)}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                        ) : (
                            <>
                                <div style={{
                                    width: '200px', height: '200px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    border: '3px solid var(--accent-primary)',
                                    background: 'var(--bg-tertiary)',
                                }}>
                                    <video
                                        ref={videoRef}
                                        autoPlay playsInline muted
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                                    />
                                </div>
                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                                <div className="flex gap-sm">
                                    <button type="button" className="btn btn-primary btn-lg" onClick={capturePhoto}>
                                        📸 {t('photoCapture', language)}
                                    </button>
                                    <label className="btn btn-secondary btn-lg" style={{ cursor: 'pointer' }}>
                                        📁 {t('uploadFromGallery', language)}
                                        <input
                                            type="file" accept="image/*"
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
                    <div className={`${animClass}`} key="step6">
                        <div className="flex items-center gap-sm mb-md">
                            <CheckCircle size={24} className="text-success" />
                            <h2 className="heading-3">{t('step6Title', language)}</h2>
                        </div>
                        <div className="glass-card-static">
                            <div className="flex gap-md items-center mb-lg">
                                {form.photoURL ? (
                                    <img src={form.photoURL} alt="" style={{
                                        width: '80px', height: '80px',
                                        borderRadius: 'var(--radius-full)',
                                        objectFit: 'cover',
                                        border: '2px solid var(--accent-primary)',
                                    }} />
                                ) : (
                                    <div style={{
                                        width: '80px', height: '80px',
                                        borderRadius: 'var(--radius-full)',
                                        background: 'var(--bg-tertiary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <User size={32} color="var(--text-muted)" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="heading-3">{form.name}</h3>
                                    {form.nameTamil && <p className="tamil text-secondary">{form.nameTamil}</p>}
                                </div>
                            </div>
                            <div className="flex-col gap-sm" style={{ display: 'flex' }}>
                                <ReviewRow label={t('age', language)} value={`${form.age} (${getAgeGroup(form.age)})`} onEdit={() => jumpToStep(2)} />
                                <ReviewRow label={t('gender', language)} value={`${GENDER_ICONS[form.gender] || ''} ${t(form.gender, language)}`} onEdit={() => jumpToStep(2)} />
                                <ReviewRow label={t('sport', language)} value={`${SPORT_ICONS[form.sport] || '🏅'} ${form.sport?.replace('_', ' ')}`} onEdit={() => jumpToStep(3)} />
                                <ReviewRow label={t('district', language)} value={form.district} onEdit={() => jumpToStep(4)} />
                                <ReviewRow label={t('village', language)} value={form.village || '—'} onEdit={() => jumpToStep(4)} />
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
            {/* Step dots progress */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="flex justify-center items-center gap-xs mb-sm">
                    {Array.from({ length: TOTAL_STEPS }, (_, i) => {
                        const stepNum = i + 1;
                        const Icon = STEP_ICONS[i];
                        const isActive = stepNum === step;
                        const isDone = stepNum < step;
                        return (
                            <div key={stepNum} className="flex items-center">
                                <div
                                    style={{
                                        width: isActive ? '36px' : '28px',
                                        height: isActive ? '36px' : '28px',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: isDone ? 'var(--accent-primary)' : isActive ? 'var(--gradient-hero)' : 'var(--bg-tertiary)',
                                        border: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                                        transition: 'all 0.3s ease',
                                        boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                                    }}
                                >
                                    {isDone ? (
                                        <CheckCircle size={14} color="#fff" />
                                    ) : (
                                        <Icon size={14} color={isActive ? '#fff' : 'var(--text-muted)'} />
                                    )}
                                </div>
                                {i < TOTAL_STEPS - 1 && (
                                    <div style={{
                                        width: '24px', height: '2px',
                                        background: isDone ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                        transition: 'background 0.3s ease',
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>
                {/* Gradient progress bar */}
                <div style={{
                    width: '100%', height: '4px',
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
            <div className="glass-card-static" style={{ marginBottom: 'var(--space-lg)', overflow: 'hidden' }}>
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
                        style={{ opacity: canProceed() ? 1 : 0.5, transition: 'opacity 0.2s ease' }}
                    >
                        {t('next', language)} <ChevronRight size={18} />
                    </button>
                ) : (
                    <button
                        type="button"
                        className="btn btn-success btn-lg"
                        onClick={handleSubmit}
                        disabled={saving}
                        style={{
                            background: saving ? undefined : 'var(--gradient-hero)',
                            minWidth: '200px',
                        }}
                    >
                        {saving ? (
                            <><Loader size={18} className="animate-pulse" /> {t('loading', language)}</>
                        ) : (
                            <><CheckCircle size={18} /> {t('reviewSubmit', language)}</>
                        )}
                    </button>
                )}
            </div>

            {/* Toast */}
            {localToast && (
                <div className="toast toast-success animate-slide-up">
                    {localToast}
                </div>
            )}

            {/* Slide animation + validation CSS */}
            <style>{`
                .step-slide-right {
                    animation: slideInRight 0.3s ease-out;
                }
                .step-slide-left {
                    animation: slideInLeft 0.3s ease-out;
                }
                @keyframes slideInRight {
                    from { transform: translateX(60px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideInLeft {
                    from { transform: translateX(-60px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .validation-error {
                    color: var(--accent-error, #ef4444);
                    font-size: 0.8rem;
                    margin-top: 4px;
                    font-weight: 500;
                }
            `}</style>
        </div>
    );
}

function ReviewRow({ label, value, onEdit }) {
    return (
        <div className="flex justify-between items-center" style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-secondary" style={{ fontSize: '0.85rem' }}>{label}</span>
            <div className="flex items-center gap-sm">
                <span style={{ fontWeight: 600 }}>{value}</span>
                {onEdit && (
                    <button type="button" onClick={onEdit} style={{
                        background: 'none', border: 'none',
                        color: 'var(--accent-primary)', cursor: 'pointer',
                        padding: '2px',
                    }}>
                        <Edit2 size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}
