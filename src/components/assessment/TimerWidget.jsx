import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Square, RotateCcw, Flag } from 'lucide-react';

/**
 * TimerWidget — Precision stopwatch component
 * Props: { onStop(timeMs), onLap(lapMs), autoStart, countdownEnabled }
 */
export default function TimerWidget({ onStop, onLap, autoStart = false, countdownEnabled = false }) {
    const [status, setStatus] = useState('ready'); // counting_down | ready | running | stopped
    const [countdown, setCountdown] = useState(0); // 3, 2, 1, 'GO!'
    const [displayTime, setDisplayTime] = useState(0);
    const [flash, setFlash] = useState(false);
    const [laps, setLaps] = useState([]);

    const startTimeRef = useRef(0);
    const rafRef = useRef(null);
    const elapsedRef = useRef(0);
    const audioCtxRef = useRef(null);

    // Initialize AudioContext on first interaction
    const initAudio = () => {
        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtxRef.current = new AudioContext();
            }
        }
    };

    const playBeep = useCallback((freq = 880, duration = 150) => {
        try {
            if (audioCtxRef.current) {
                if (audioCtxRef.current.state === 'suspended') {
                    audioCtxRef.current.resume();
                }
                const osc = audioCtxRef.current.createOscillator();
                const gainNode = audioCtxRef.current.createGain();

                osc.frequency.value = freq;
                osc.type = 'sine';

                gainNode.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration / 1000);

                osc.connect(gainNode);
                gainNode.connect(audioCtxRef.current.destination);

                osc.start();
                osc.stop(audioCtxRef.current.currentTime + duration / 1000);
            }
        } catch (e) {
            console.error("Audio beep failed", e);
        }
    }, []);

    const formatTime = useCallback((ms) => {
        const totalCs = Math.floor(ms / 10);
        const cs = totalCs % 100;
        const totalSecs = Math.floor(totalCs / 100);
        const secs = totalSecs % 60;
        const mins = Math.floor(totalSecs / 60);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
    }, []);

    const updateDisplay = useCallback(() => {
        const now = performance.now();
        const elapsed = elapsedRef.current + (now - startTimeRef.current);
        setDisplayTime(elapsed);
        rafRef.current = requestAnimationFrame(updateDisplay);
    }, []);

    const startActualTimer = useCallback(() => {
        setStatus('running');
        startTimeRef.current = performance.now();
        rafRef.current = requestAnimationFrame(updateDisplay);
        if (navigator.vibrate) navigator.vibrate(100);
        playBeep(1200, 200);
    }, [updateDisplay, playBeep]);

    const handleStart = useCallback(() => {
        if (status === 'running' || status === 'counting_down') return;
        initAudio();

        if (countdownEnabled && elapsedRef.current === 0) {
            setStatus('counting_down');
            setCountdown(3);
            playBeep(440, 150);

            let count = 3;
            const interval = setInterval(() => {
                count -= 1;
                if (count > 0) {
                    setCountdown(count);
                    playBeep(440, 150);
                } else if (count === 0) {
                    setCountdown('GO!');
                    playBeep(880, 300);
                    clearInterval(interval);
                    setTimeout(() => {
                        startActualTimer();
                        setCountdown(0);
                    }, 700);
                }
            }, 1000);
        } else {
            startActualTimer();
        }
    }, [status, countdownEnabled, startActualTimer, playBeep]);

    const handleStop = useCallback(() => {
        if (status !== 'running') return;
        cancelAnimationFrame(rafRef.current);
        const now = performance.now();
        const finalTime = elapsedRef.current + (now - startTimeRef.current);
        elapsedRef.current = finalTime;
        setDisplayTime(finalTime);
        setStatus('stopped');

        setFlash(true);
        setTimeout(() => setFlash(false), 300);

        if (navigator.vibrate) navigator.vibrate(100);

        if (onStop) onStop(finalTime);
    }, [status, onStop]);

    const handleReset = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        setStatus('ready');
        setDisplayTime(0);
        setLaps([]);
        elapsedRef.current = 0;
        startTimeRef.current = 0;
    }, []);

    const handleLap = useCallback(() => {
        if (status !== 'running') return;
        const now = performance.now();
        const currentTime = elapsedRef.current + (now - startTimeRef.current);

        const previousTotal = laps.reduce((sum, l) => sum + l.delta, 0);
        const lapTime = currentTime - previousTotal;

        setLaps(prev => [...prev, { total: currentTime, delta: lapTime }]);
        if (onLap) onLap(lapTime);
        if (navigator.vibrate) navigator.vibrate(50);
    }, [status, laps, onLap]);

    useEffect(() => {
        if (autoStart) {
            handleStart();
        }
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const timerColorClass = status === 'running'
        ? 'text-danger' // Use existing text colors or custom
        : status === 'stopped'
            ? 'text-success'
            : 'text-primary';

    return (
        <div className="glass-card-static flex-col flex items-center justify-center p-xl" style={{
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: status === 'running' ? 'inset 0 0 0 4px rgba(239, 68, 68, 0.4), 0 0 30px rgba(239, 68, 68, 0.2)' : flash ? 'inset 0 0 0 4px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.5)' : 'none',
            transition: 'box-shadow 0.3s ease',
            animation: status === 'running' ? 'pulse 1.5s infinite alternate' : 'none'
        }}>

            {/* 3-2-1 Countdown Overlay */}
            {status === 'counting_down' && (
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.8)', zIndex: 10,
                    backdropFilter: 'blur(4px)',
                    borderRadius: 'var(--radius-lg)'
                }}>
                    <div key={countdown} className="animate-scale-in" style={{
                        fontSize: countdown === 'GO!' ? '6rem' : '5rem',
                        fontWeight: 900,
                        background: countdown === 'GO!' ? 'var(--gradient-hero)' : 'white',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: countdown === 'GO!' ? 'transparent' : 'white',
                        textShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}>
                        {countdown}
                    </div>
                </div>
            )}

            {/* Timer Display */}
            <div
                className="timer-display"
                style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'clamp(2rem, 12vw, 4.5rem)',
                    fontWeight: 800,
                    color: status === 'running' ? 'var(--accent-danger)' : status === 'stopped' ? 'var(--accent-success)' : 'white',
                    textShadow: status === 'running' ? '0 0 20px rgba(239, 68, 68, 0.4)' : 'none',
                    transition: 'color 0.3s ease, text-shadow 0.3s ease',
                    margin: 'var(--space-md) 0'
                }}
            >
                {formatTime(displayTime)}
            </div>

            {/* Control Buttons (Stacked vertically on mobile, row on tablet/desktop) */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-md w-full" style={{ marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>

                {/* Reset */}
                <button
                    className="btn btn-ghost hover-lift"
                    onClick={handleReset}
                    disabled={status === 'running' || status === 'counting_down'}
                    style={{ width: '100%', maxWidth: '120px', height: '80px', borderRadius: 'var(--radius-md)', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <RotateCcw size={28} />
                </button>

                {/* Start / Stop (Center, Huge) */}
                {status !== 'running' ? (
                    <button
                        className="btn hover-lift"
                        onClick={handleStart}
                        disabled={status === 'counting_down'}
                        style={{
                            width: '100%', maxWidth: '240px', height: '80px', borderRadius: 'var(--radius-full)',
                            background: 'var(--accent-success)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)',
                            border: 'none', cursor: 'pointer', zIndex: 2
                        }}
                    >
                        <Play size={40} fill="currentColor" style={{ marginLeft: '6px' }} />
                    </button>
                ) : (
                    <button
                        className="btn hover-lift"
                        onClick={handleStop}
                        style={{
                            width: '100%', maxWidth: '240px', height: '80px', borderRadius: 'var(--radius-full)',
                            background: 'var(--accent-danger)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)',
                            animation: 'pulse 1s infinite alternate',
                            border: 'none', cursor: 'pointer', zIndex: 2
                        }}
                    >
                        <Square size={32} fill="currentColor" />
                    </button>
                )}

                {/* Lap */}
                <button
                    className="btn btn-secondary hover-lift"
                    onClick={handleLap}
                    disabled={status !== 'running'}
                    style={{ width: '100%', maxWidth: '120px', height: '80px', borderRadius: 'var(--radius-md)', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Flag size={28} />
                </button>

            </div>

            {/* Laps List */}
            {laps.length > 0 && (
                <div className="animate-fade-in" style={{ maxHeight: '180px', overflowY: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 'var(--space-sm)' }}>
                    <h4 className="text-muted mb-xs" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left' }}>
                        Laps
                    </h4>
                    <div className="flex flex-col gap-xs">
                        {[...laps].reverse().map((lap, index) => {
                            const displayIndex = laps.length - index;
                            return (
                                <div key={displayIndex} className="flex justify-between items-center" style={{
                                    padding: '8px 12px',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.85rem'
                                }}>
                                    <span className="text-secondary">Lap {displayIndex}</span>
                                    <div className="flex gap-md" style={{ fontFamily: 'var(--font-mono)' }}>
                                        <span className="text-muted">+{formatTime(lap.delta)}</span>
                                        <span style={{ fontWeight: 600 }}>{formatTime(lap.total)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
