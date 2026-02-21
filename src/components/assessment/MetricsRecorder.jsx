import { useState, useEffect } from 'react';
import { SPORT_METRICS } from '../../utils/sportMetrics';
import { createAssessment } from '../../utils/dataShapes';
import TimerWidget from './TimerWidget';
import { CheckCircle, Minus, Plus, Star } from 'lucide-react';

/**
 * MetricsRecorder — Dynamic form for sport-specific metrics
 * Props: { sport, athleteId, onComplete(results[]) }
 */
export default function MetricsRecorder({ sport, athleteId, onComplete }) {
    const [values, setValues] = useState({});
    const [completedKeys, setCompletedKeys] = useState([]);

    const metrics = SPORT_METRICS[sport] || [];

    const handleTimerStop = (key, timeMs) => {
        const seconds = (timeMs / 1000).toFixed(2);
        setValues(prev => ({ ...prev, [key]: seconds }));
        if (!completedKeys.includes(key)) {
            setCompletedKeys(prev => [...prev, key]);
        }
    };

    const handleManualChange = (key, val) => {
        setValues(prev => ({ ...prev, [key]: val }));
        if (val && !completedKeys.includes(key)) setCompletedKeys(prev => [...prev, key]);
        if (!val) setCompletedKeys(prev => prev.filter(k => k !== key));
    };

    const handleManualStep = (key, stepStr, direction) => {
        const step = parseFloat(stepStr) || 1;
        setValues(prev => {
            const cur = parseFloat(prev[key] || 0);
            const newVal = Math.max(0, cur + (direction * step)).toFixed(step < 1 ? 2 : 1);
            if (!completedKeys.includes(key)) setCompletedKeys(prev => [...prev, key]);
            return { ...prev, [key]: String(newVal) };
        });
    };

    const handleCountIncrement = (key, delta) => {
        setValues(prev => {
            const cur = parseInt(prev[key] || 0, 10);
            const newVal = Math.max(0, cur + delta);
            if (!completedKeys.includes(key)) setCompletedKeys(prev => [...prev, key]);
            if (newVal === 0) setCompletedKeys(prev => prev.filter(k => k !== key));
            return { ...prev, [key]: String(newVal) };
        });
    };

    const handleRatingSelect = (key, rating) => {
        setValues(prev => ({ ...prev, [key]: String(rating) }));
        if (!completedKeys.includes(key)) {
            setCompletedKeys(prev => [...prev, key]);
        }
    };

    const handleSaveAll = () => {
        const results = metrics
            .filter(m => values[m.key] !== undefined && values[m.key] !== '')
            .map(m => createAssessment({
                athleteId,
                sport,
                testType: m.key,
                testCategory: 'sport_specific',
                value: parseFloat(values[m.key]),
                unit: m.unit,
            }));

        // Also save to generic 'sentrak_assessments' array for redundancy as requested
        try {
            const stored = JSON.parse(localStorage.getItem('sentrak_assessments') || '[]');
            const updated = [...stored, ...results];
            localStorage.setItem('sentrak_assessments', JSON.stringify(updated));
        } catch (err) {
            console.error("Failed to save to localStorage array", err);
        }

        onComplete(results);
    };

    const filledCount = completedKeys.length;
    const progressPercent = metrics.length > 0 ? (filledCount / metrics.length) * 100 : 0;

    return (
        <div className="animate-fade-in">
            {/* Progress */}
            <div className="flex justify-between items-center mb-sm">
                <span className="text-secondary" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                    {sport.replace('_', ' ')} Metrics
                </span>
                <span className="text-primary" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    {filledCount} of {metrics.length} metrics recorded
                </span>
            </div>
            <div style={{
                height: '8px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                marginBottom: 'var(--space-2xl)',
            }}>
                <div style={{
                    height: '100%',
                    width: `${progressPercent}%`,
                    background: 'var(--gradient-hero)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }} />
            </div>

            {/* Metric Cards */}
            <div className="flex flex-col gap-lg">
                {metrics.map((metric, index) => {
                    const isDone = completedKeys.includes(metric.key);
                    const stepSize = metric.unit === 's' ? '0.01' : metric.unit === 'm' ? '0.1' : '1';

                    return (
                        <div
                            key={metric.key}
                            className={`glass-card-static animate-fade-in`}
                            style={{
                                transition: 'all 0.3s ease',
                                border: isDone ? '2px solid rgba(16, 185, 129, 0.4)' : '2px solid rgba(255, 255, 255, 0.05)',
                                background: isDone ? 'linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, rgba(20, 20, 20, 0.4) 100%)' : 'var(--bg-glass)',
                                transform: `translateX(0)`,
                                animationDelay: `${index * 0.05}s`
                            }}
                        >
                            <div className="flex justify-between items-start mb-md">
                                <div>
                                    <h4 className="heading-3 flex items-center gap-sm">
                                        {metric.name}
                                        {isDone && <CheckCircle size={20} color="var(--accent-success)" className="animate-scale-in" />}
                                    </h4>
                                    <span className="tamil text-secondary" style={{ fontSize: '0.85rem' }}>
                                        {metric.nameTamil}
                                    </span>
                                </div>
                                <div className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                                    {metric.unit}
                                </div>
                            </div>

                            <p className="text-muted mb-lg" style={{ fontSize: '0.9rem' }}>
                                {metric.description}
                            </p>

                            {/* Input by type */}
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>

                                {metric.inputType === 'timer' && (
                                    <TimerWidget
                                        onStop={(ms) => handleTimerStop(metric.key, ms)}
                                    />
                                )}

                                {metric.inputType === 'manual' && (
                                    <div className="flex items-center justify-center gap-md">
                                        <button
                                            className="btn hover-lift"
                                            onClick={() => handleManualStep(metric.key, stepSize, -1)}
                                            style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <Minus size={24} color="var(--text-primary)" />
                                        </button>
                                        <div style={{ flex: 1, maxWidth: '200px', position: 'relative' }}>
                                            <input
                                                type="number"
                                                className="form-input"
                                                placeholder="0.0"
                                                value={values[metric.key] || ''}
                                                onChange={e => handleManualChange(metric.key, e.target.value)}
                                                inputMode="decimal"
                                                step={stepSize}
                                                style={{ width: '100%', textAlign: 'center', fontSize: '2.5rem', height: '70px', fontFamily: 'var(--font-mono)', fontWeight: 800, border: 'none', background: 'transparent' }}
                                            />
                                            <div style={{ position: 'absolute', right: '10px', bottom: '15px', color: 'var(--text-muted)' }}>{metric.unit}</div>
                                        </div>
                                        <button
                                            className="btn hover-lift"
                                            onClick={() => handleManualStep(metric.key, stepSize, 1)}
                                            style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <Plus size={24} color="var(--text-primary)" />
                                        </button>
                                    </div>
                                )}

                                {metric.inputType === 'count' && (
                                    <div className="flex items-center justify-center gap-xl">
                                        <button
                                            className="btn hover-lift"
                                            onClick={() => handleCountIncrement(metric.key, -1)}
                                            style={{
                                                width: '65px', height: '65px', borderRadius: '50%',
                                                background: 'var(--bg-tertiary)', border: '2px solid rgba(255,255,255,0.1)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            <Minus size={28} color="var(--text-primary)" />
                                        </button>
                                        <div style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: 'clamp(3rem, 8vw, 4rem)',
                                            fontWeight: 900,
                                            color: 'var(--accent-primary)',
                                            minWidth: '100px',
                                            textAlign: 'center',
                                        }}>
                                            {values[metric.key] || '0'}
                                        </div>
                                        <button
                                            className="btn hover-lift"
                                            onClick={() => handleCountIncrement(metric.key, 1)}
                                            style={{
                                                width: '65px', height: '65px', borderRadius: '50%',
                                                background: 'var(--accent-primary)', border: 'none',
                                                boxShadow: '0 0 20px rgba(99,102,241,0.4)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            <Plus size={28} color="#fff" />
                                        </button>
                                    </div>
                                )}

                                {metric.inputType === 'rating' && (
                                    <div className="flex justify-center gap-md">
                                        {[1, 2, 3, 4, 5].map(star => {
                                            const isSelected = parseInt(values[metric.key] || 0, 10) >= star;
                                            return (
                                                <button
                                                    key={star}
                                                    className="hover-scale"
                                                    onClick={() => handleRatingSelect(metric.key, star)}
                                                    style={{
                                                        width: '60px', height: '60px',
                                                        borderRadius: 'var(--radius-full)',
                                                        background: isSelected ? 'var(--accent-gold)' : 'var(--bg-tertiary)',
                                                        border: 'none',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        boxShadow: isSelected ? '0 0 15px rgba(251, 191, 36, 0.4)' : 'none',
                                                        transition: 'all 0.2s ease',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <Star size={30} fill={isSelected ? '#fff' : 'transparent'} color={isSelected ? '#fff' : 'var(--text-muted)'} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Save All Button */}
            <div className="mt-xl text-center" style={{ position: 'sticky', bottom: 'var(--space-md)', zIndex: 10 }}>
                {filledCount === metrics.length ? (
                    <button
                        className="btn btn-success btn-lg animate-scale-in"
                        onClick={handleSaveAll}
                        style={{ width: '100%', maxWidth: '400px', padding: '1.2rem', fontSize: '1.2rem', boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)' }}
                    >
                        <CheckCircle size={24} /> Complete Assessment
                    </button>
                ) : (
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleSaveAll}
                        disabled={filledCount === 0}
                        style={{ width: '100%', maxWidth: '400px', opacity: filledCount > 0 ? 1 : 0.5 }}
                    >
                        Save {filledCount > 0 ? filledCount : ''} Metrics
                    </button>
                )}
            </div>
        </div>
    );
}
