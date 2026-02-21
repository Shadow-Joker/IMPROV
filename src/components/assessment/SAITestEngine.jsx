import { useState, useEffect, useCallback, useMemo } from 'react';
import { SAI_TESTS, calculatePercentile } from '../../utils/sportMetrics';
import { createAssessment } from '../../utils/dataShapes';
import TimerWidget from './TimerWidget';
import { Check, ChevronRight, Calculator, Activity, ArrowRight, Minus, Plus } from 'lucide-react';

/**
 * SAITestEngine — Guided flow through all 8 SAI battery tests
 * Props: { athleteId, athleteInfo, onComplete(results[]) }
 */
export default function SAITestEngine({ athleteId, athleteInfo = { ageGroup: 'U-16', gender: 'male' }, onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [phase, setPhase] = useState('intro'); // intro | test | result | summary
    const [results, setResults] = useState([]);

    // Test value states
    const [currentValue, setCurrentValue] = useState('');
    const [bmiHeight, setBmiHeight] = useState('');
    const [bmiWeight, setBmiWeight] = useState('');

    const test = SAI_TESTS[currentStep];
    const isBMI = test?.key === 'bmi';
    const isTimer = test?.inputType === 'timer';
    const totalTests = SAI_TESTS.length;

    // Derived step labels for the horizontal indicator
    const stepLabels = ['30m', '60m', '600m', 'SBJ', 'VJ', '4x10', 'SR', 'BMI'];

    const getInstructions = (key) => {
        switch (key) {
            case '30m_sprint': return ["Mark a 30-meter distance with clear start/end markers", "Athlete starts from standing position behind the start line", "Timer starts on first movement, stops when chest crosses finish line"];
            case '60m_sprint': return ["Mark a 60-meter distance on a flat track", "Athlete sprints at maximum speed from standing start", "Do not decelerate until past the finish line"];
            case '600m_run': return ["Run 600 meters (1.5 laps of standard track)", "Pacing is important — advise athlete to distribute energy", "Record the exact time upon finishing the distance"];
            case 'standing_broad_jump': return ["Athlete stands with both feet behind the line", "Swing arms and jump forward as far as possible", "Measure from the line to the back of the closest heel"];
            case 'vertical_jump': return ["Athlete stands sideways to wall, reaches up to mark highest point standing", "Jump as high as possible and touch/mark the wall again", "Measure the distance between the standing reach and jump reach in cm"];
            case 'shuttle_run_4x10m': return ["Place two markers exactly 10 meters apart", "Athlete runs to the far marker, picks up a block, runs back and places it", "Repeats for the second block (total 40m sprint with turns)"];
            case 'flexibility_sit_reach': return ["Athlete sits straight-legged on floor with feet against the box", "Slowly reach forward with both hands as far as possible", "Hold the maximum reach for 2 seconds. Record distance in cm"];
            case 'bmi': return ["Measure height barefoot against a wall using a stadiometer", "Measure weight using a calibrated digital scale", "The system will auto-calculate Body Mass Index (BMI)"];
            default: return [test?.description];
        }
    };

    const currentPercentile = useMemo(() => {
        if (!currentValue) return 0;
        return calculatePercentile(parseFloat(currentValue), test?.key, athleteInfo.ageGroup, athleteInfo.gender);
    }, [currentValue, test, athleteInfo]);

    const getPercentileLabel = (p) => {
        if (p >= 75) return { label: 'Above Average', color: 'var(--accent-success)', bg: 'rgba(16, 185, 129, 0.15)' };
        if (p >= 40) return { label: 'Average', color: 'var(--accent-warning)', bg: 'rgba(245, 158, 11, 0.15)' };
        return { label: 'Below Average', color: 'var(--accent-danger)', bg: 'rgba(239, 68, 68, 0.15)' };
    };

    const handleTimerStop = useCallback((timeMs) => {
        const seconds = (timeMs / 1000).toFixed(2);
        setCurrentValue(seconds);
        setPhase('result');
    }, []);

    const handleManualSubmit = () => {
        if (isBMI) {
            const h = parseFloat(bmiHeight) / 100; // cm to m
            const w = parseFloat(bmiWeight);
            if (h > 0 && w > 0) {
                setCurrentValue((w / (h * h)).toFixed(1));
                setPhase('result');
            }
            return;
        }
        if (currentValue) {
            setPhase('result');
        }
    };

    const handleNext = () => {
        // Save result
        const assessment = createAssessment({
            athleteId,
            sport: 'SAI_Battery',
            testType: test.key,
            testCategory: 'sai',
            value: parseFloat(currentValue),
            unit: test.unit,
            percentile: currentPercentile,
        });

        const newResults = [...results, assessment];
        setResults(newResults);

        if (currentStep >= totalTests - 1) {
            setPhase('summary');
            return;
        }

        setCurrentStep(prev => prev + 1);
        setPhase('intro');
        setCurrentValue('');
        setBmiHeight('');
        setBmiWeight('');
    };

    const handleSkip = () => {
        if (currentStep >= totalTests - 1) {
            setPhase('summary');
            return;
        }
        setCurrentStep(prev => prev + 1);
        setPhase('intro');
        setCurrentValue('');
        setBmiHeight('');
        setBmiWeight('');
    };

    const overallPercentile = useMemo(() => {
        if (results.length === 0) return 0;
        const total = results.reduce((sum, r) => sum + (r.percentile || 0), 0);
        return Math.round(total / results.length);
    }, [results]);

    if (phase === 'summary') {
        return (
            <div className="animate-fade-in" style={{ padding: 'var(--space-md) 0' }}>
                <div className="text-center mb-lg">
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>📊</div>
                    <h2 className="heading-2 mb-sm">SAI Battery Complete</h2>
                    <p className="text-secondary mb-lg">All 8 tests successfully recorded.</p>

                    <div className="glass-card" style={{ display: 'inline-block', padding: 'var(--space-lg) var(--space-2xl)' }}>
                        <div className="text-muted text-sm mb-xs" style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>Overall Score</div>
                        <div style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: getPercentileLabel(overallPercentile).color }}>
                            {overallPercentile}<span style={{ fontSize: '2rem' }}>%</span>
                        </div>
                        <div className="badge mt-sm" style={{ background: getPercentileLabel(overallPercentile).bg, color: getPercentileLabel(overallPercentile).color }}>
                            {getPercentileLabel(overallPercentile).label} Candidate
                        </div>
                    </div>
                </div>

                <div className="glass-card-static mb-xl">
                    <h3 className="heading-4 mb-md">Test Results</h3>
                    <div className="flex flex-col gap-sm">
                        {SAI_TESTS.map((t) => {
                            const res = results.find(r => r.testType === t.key);
                            if (!res) return (
                                <div key={t.key} className="flex justify-between items-center" style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', opacity: 0.5 }}>
                                    <span className="text-muted">{t.icon} {t.name}</span>
                                    <span className="text-muted">Skipped</span>
                                </div>
                            );
                            return (
                                <div key={t.key} className="flex justify-between items-center" style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)' }}>
                                    <div className="flex items-center gap-sm">
                                        <span style={{ fontSize: '1.2rem' }}>{t.icon}</span>
                                        <span className="text-secondary" style={{ fontSize: '0.9rem' }}>{t.name}</span>
                                    </div>
                                    <div className="flex items-center gap-md">
                                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                                            {res.value} <span className="text-muted" style={{ fontSize: '0.8rem' }}>{res.unit}</span>
                                        </span>
                                        <span className="badge" style={{ width: '80px', textAlign: 'center', background: getPercentileLabel(res.percentile).bg, color: getPercentileLabel(res.percentile).color }}>
                                            {res.percentile}%
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button className="btn btn-primary btn-lg" onClick={() => onComplete(results)} style={{ width: '100%' }}>
                    Proceed to Attestation 🛡️
                </button>
            </div>
        );
    }

    if (!test) return null;

    return (
        <div className="animate-fade-in">
            {/* Horizontal Step Indicator */}
            <div className="flex justify-between items-center mb-xl" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', background: 'var(--bg-tertiary)', zIndex: 0, transform: 'translateY(-50%)' }} />
                <div style={{ position: 'absolute', top: '50%', left: '0', height: '2px', background: 'var(--accent-primary)', zIndex: 1, transition: 'width 0.4s ease', width: `${(currentStep / (totalTests - 1)) * 100}%`, transform: 'translateY(-50%)' }} />

                {stepLabels.map((label, idx) => {
                    const isCompleted = idx < currentStep;
                    const isCurrent = idx === currentStep;
                    return (
                        <div key={label} className="flex flex-col items-center gap-xs" style={{ zIndex: 2 }}>
                            <div style={{
                                width: '28px', height: '28px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: isCompleted ? 'var(--accent-success)' : isCurrent ? 'var(--bg-card)' : 'var(--bg-tertiary)',
                                color: isCompleted ? '#000' : isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)',
                                border: isCurrent ? '2px solid var(--accent-primary)' : '2px solid transparent',
                                boxShadow: isCurrent ? '0 0 10px rgba(99,102,241,0.5)' : 'none',
                                transition: 'all 0.3s ease',
                                fontSize: '0.7rem', fontWeight: 700
                            }}>
                                {isCompleted ? <Check size={14} strokeWidth={4} /> : (idx + 1)}
                            </div>
                            <span style={{
                                fontSize: '0.65rem',
                                fontWeight: isCurrent ? 700 : 500,
                                color: isCurrent ? 'var(--accent-primary)' : isCompleted ? 'var(--text-secondary)' : 'var(--text-muted)'
                            }}>{label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Test Card Header */}
            <div className="text-center mb-lg">
                <div style={{ fontSize: '3.5rem', display: 'inline-block', marginBottom: 'var(--space-xs)', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }}>
                    {test.icon}
                </div>
                <h2 className="heading-2">{test.name}</h2>
                <div className="badge badge-pending mt-sm" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {test.unit === 's' && test.inputType === 'timer' ? '⏱ TIMED' : test.key === 'bmi' ? '🧮 CALCULATED' : '📏 MANUAL DISTANCE'}
                </div>
            </div>

            {/* INTRO PHASE (Instructions) */}
            {phase === 'intro' && (
                <div className="animate-slide-in">
                    <div className="glass-card mb-lg" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
                        <h4 className="heading-4 mb-md flex items-center gap-sm">
                            <Activity size={18} color="var(--accent-primary)" /> Protocol Instructions
                        </h4>
                        <ul className="text-secondary" style={{ paddingLeft: '20px', fontSize: '0.95rem', lineHeight: 1.6 }}>
                            {getInstructions(test.key).map((point, i) => (
                                <li key={i} style={{ marginBottom: '8px' }}>{point}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex gap-md mt-xl">
                        <button className="btn btn-ghost" onClick={handleSkip} style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Skip Test
                        </button>
                        <button className="btn btn-primary btn-lg hover-scale" onClick={() => setPhase('test')} style={{ flex: 2 }}>
                            Start Assessment <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* TEST PHASE (Timer or Input) */}
            {phase === 'test' && (
                <div className="animate-scale-in">
                    {isTimer ? (
                        <TimerWidget onStop={handleTimerStop} countdownEnabled={true} autoStart={false} />
                    ) : isBMI ? (
                        <div className="glass-card-static" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
                            <div className="form-group mb-md" style={{ textAlign: 'left' }}>
                                <label className="form-label text-muted">Height (cm)</label>
                                <div className="flex items-center" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '5px' }}>
                                    <button className="btn btn-ghost" onClick={() => setBmiHeight(h => String(Math.max(0, Number(h || 160) - 1)))} style={{ padding: '10px' }}><Minus size={20} /></button>
                                    <input type="number" value={bmiHeight} onChange={e => setBmiHeight(e.target.value)} className="form-input" placeholder="165" style={{ flex: 1, textAlign: 'center', fontSize: '2rem', height: '60px', border: 'none', background: 'transparent', fontFamily: 'var(--font-mono)' }} />
                                    <button className="btn btn-ghost" onClick={() => setBmiHeight(h => String(Number(h || 160) + 1))} style={{ padding: '10px' }}><Plus size={20} /></button>
                                </div>
                            </div>
                            <div className="form-group mb-lg" style={{ textAlign: 'left' }}>
                                <label className="form-label text-muted">Weight (kg)</label>
                                <div className="flex items-center" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '5px' }}>
                                    <button className="btn btn-ghost" onClick={() => setBmiWeight(w => String(Math.max(0, Number(w || 50) - 1)))} style={{ padding: '10px' }}><Minus size={20} /></button>
                                    <input type="number" value={bmiWeight} onChange={e => setBmiWeight(e.target.value)} className="form-input" placeholder="55" style={{ flex: 1, textAlign: 'center', fontSize: '2rem', height: '60px', border: 'none', background: 'transparent', fontFamily: 'var(--font-mono)' }} />
                                    <button className="btn btn-ghost" onClick={() => setBmiWeight(w => String(Number(w || 50) + 1))} style={{ padding: '10px' }}><Plus size={20} /></button>
                                </div>
                            </div>

                            {bmiHeight && bmiWeight && (
                                <div className="mb-md animate-fade-in p-md rounded" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                                    <div className="text-sm text-secondary uppercase tracking-widest mb-xs">Calculated BMI</div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                                        {(parseFloat(bmiWeight) / ((parseFloat(bmiHeight) / 100) ** 2)).toFixed(1)}
                                    </div>
                                </div>
                            )}

                            <button className="btn btn-primary btn-lg" onClick={handleManualSubmit} disabled={!bmiHeight || !bmiWeight} style={{ width: '100%' }}>
                                <Calculator size={20} /> Calculate & Record
                            </button>
                        </div>
                    ) : (
                        <div className="glass-card-static" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
                            <div className="text-secondary mb-md">Enter {test.name} Result</div>

                            <div className="flex items-center mb-xl" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', padding: '10px' }}>
                                <button
                                    className="btn hover-lift"
                                    onClick={() => setCurrentValue(v => String(Math.max(0, Number(v || 0) - (test.unit === 'm' ? 0.1 : 1)).toFixed(test.unit === 'm' ? 1 : 0)))}
                                    style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Minus size={28} />
                                </button>

                                <div style={{ flex: 1, position: 'relative' }}>
                                    <input
                                        type="number"
                                        value={currentValue}
                                        onChange={e => setCurrentValue(e.target.value)}
                                        placeholder="0.0"
                                        step={test.unit === 'm' ? "0.1" : "1"}
                                        style={{ width: '100%', textAlign: 'center', fontSize: '3.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', border: 'none', background: 'transparent', color: 'white', padding: '10px 0' }}
                                    />
                                    <div style={{ position: 'absolute', right: '15%', bottom: '15px', fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 600 }}>{test.unit}</div>
                                </div>

                                <button
                                    className="btn hover-lift"
                                    onClick={() => setCurrentValue(v => String((Number(v || 0) + (test.unit === 'm' ? 0.1 : 1)).toFixed(test.unit === 'm' ? 1 : 0)))}
                                    style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Plus size={28} />
                                </button>
                            </div>

                            <button className="btn btn-primary btn-lg" onClick={handleManualSubmit} disabled={!currentValue} style={{ width: '100%' }}>
                                <Check size={20} /> Save Result
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* RESULT PHASE (Score & Benchmark) */}
            {phase === 'result' && (
                <div className="animate-scale-in text-center" style={{ padding: 'var(--space-xl) 0' }}>
                    <div className="glass-card" style={{ display: 'inline-block', minWidth: '300px', padding: 'var(--space-2xl)' }}>
                        <div className="text-muted mb-sm text-sm" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Recorded Result</div>
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '4rem',
                            fontWeight: 900,
                            color: 'var(--text-primary)',
                            lineHeight: 1,
                            marginBottom: 'var(--space-md)'
                        }}>
                            {currentValue}<span className="text-secondary" style={{ fontSize: '2rem', marginLeft: '8px' }}>{test.unit}</span>
                        </div>

                        <div className="badge mb-lg" style={{
                            background: getPercentileLabel(currentPercentile).bg,
                            color: getPercentileLabel(currentPercentile).color,
                            padding: '8px 16px', fontSize: '1rem', border: `1px solid ${getPercentileLabel(currentPercentile).bg}`
                        }}>
                            {currentPercentile}% — {getPercentileLabel(currentPercentile).label}
                        </div>

                        <div className="text-muted text-sm" style={{ opacity: 0.7 }}>
                            Compared to {athleteInfo.ageGroup} {athleteInfo.gender} benchmark
                        </div>
                    </div>

                    <div className="flex gap-md mt-xl justify-center">
                        <button className="btn btn-ghost" onClick={() => { setPhase('test'); setCurrentValue(''); }} style={{ minWidth: '120px' }}>
                            Retake
                        </button>
                        <button className="btn btn-primary btn-lg hover-scale" onClick={handleNext} style={{ minWidth: '200px' }}>
                            {currentStep >= totalTests - 1 ? 'Finish Assessment 🏁' : 'Next Test ➡️'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
