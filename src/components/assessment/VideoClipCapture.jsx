import { useState, useRef, useCallback, useEffect } from 'react';
import { Video, Circle, Square, FastForward, Play, RotateCcw, Check, X, Camera } from 'lucide-react';

/**
 * VideoClipCapture — Camera capture component (15s max)
 * Props: { onCapture(base64String), onSkip() }
 */
export default function VideoClipCapture({ onCapture, onSkip }) {
    const [phase, setPhase] = useState('idle'); // idle | preview | recording | playback
    const [countdown, setCountdown] = useState(15);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const streamRef = useRef(null);
    const countdownRef = useRef(null);
    const recordedBlobRef = useRef(null);

    // Stop camera stream safely
    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
    }, []);

    // Start camera preview
    const startPreview = useCallback(async () => {
        try {
            setError(null);
            // Request 720p 16:9 ideal for mobile
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    aspectRatio: { ideal: 16 / 9 },
                    facingMode: 'user', // "user" for mirrored selfie, "environment" for back cam
                },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setPhase('preview');
        } catch (err) {
            console.error('[VideoClipCapture] Camera error:', err);
            setError('Camera access denied or unavailable. Please check permissions.');
        }
    }, []);

    // Start recording
    const startRecording = useCallback(() => {
        if (!streamRef.current) return;
        chunksRef.current = [];
        setCountdown(15);

        // Prioritize mp4 or webm compression
        const options = [
            { mimeType: 'video/webm;codecs=vp9' },
            { mimeType: 'video/webm;codecs=vp8' },
            { mimeType: 'video/webm' },
            { mimeType: 'video/mp4' }
        ].find(opt => MediaRecorder.isTypeSupported(opt.mimeType));

        let recorder;
        try {
            recorder = new MediaRecorder(streamRef.current, options || undefined);
        } catch {
            recorder = new MediaRecorder(streamRef.current);
        }

        recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                chunksRef.current.push(e.data);
            }
        };

        recorder.onstop = () => {
            const mime = (options && options.mimeType) || 'video/webm';
            const blob = new Blob(chunksRef.current, { type: mime });
            recordedBlobRef.current = { blob, mime };

            // Stop camera feed to save battery during playback
            stopCamera();

            // Show playback
            if (videoRef.current) {
                videoRef.current.srcObject = null;
                videoRef.current.src = URL.createObjectURL(blob);
                videoRef.current.controls = true;
            }
            setPhase('playback');
        };

        mediaRecorderRef.current = recorder;
        recorder.start(100); // 100ms timeslice
        setPhase('recording');

        // Auto-stop after 15s
        let remaining = 15;
        countdownRef.current = setInterval(() => {
            remaining -= 1;
            setCountdown(remaining);
            if (remaining <= 0) {
                clearInterval(countdownRef.current);
                if (recorder.state === 'recording') {
                    recorder.stop();
                }
            }
        }, 1000);

        if (navigator.vibrate) navigator.vibrate(100);
    }, [stopCamera]);

    // Stop recording manually
    const stopRecording = useCallback(() => {
        clearInterval(countdownRef.current);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    }, []);

    // Save captured video (Base64 wrapper for offline storage)
    const handleSave = useCallback(async () => {
        if (!recordedBlobRef.current) return;
        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result;
                onCapture(base64); // Pass to parent RecordAssessment
            };
            reader.readAsDataURL(recordedBlobRef.current.blob);
        } catch (err) {
            console.error('[VideoClipCapture] Save error:', err);
            setError('Failed to process video compression.');
        }
    }, [onCapture]);

    // Retake functionality
    const handleRetake = useCallback(() => {
        recordedBlobRef.current = null;
        if (videoRef.current) {
            videoRef.current.src = '';
            videoRef.current.controls = false;
        }
        startPreview();
    }, [startPreview]);

    // Force skip
    const handleSkip = useCallback(() => {
        stopCamera();
        onSkip();
    }, [stopCamera, onSkip]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearInterval(countdownRef.current);
            stopCamera();
        };
    }, [stopCamera]);

    return (
        <div className="glass-card-static animate-fade-in" style={{ padding: 'var(--space-md)' }}>
            {/* Header */}
            <div className="flex justify-between items-center mb-md">
                <div className="flex items-center gap-sm">
                    <div style={{ background: 'var(--accent-primary)', padding: '8px', borderRadius: '50%' }}>
                        <Video size={18} color="white" />
                    </div>
                    <div>
                        <h4 className="heading-4" style={{ marginBottom: 0 }}>Video Evidence</h4>
                        <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Max 15 seconds</span>
                    </div>
                </div>
                {phase === 'idle' && (
                    <span className="badge badge-pending">Optional</span>
                )}
            </div>

            {error && (
                <div className="mb-md animate-fade-in" style={{
                    background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-md)'
                }}>
                    <p className="text-danger" style={{ fontSize: '0.85rem' }}>{error}</p>
                </div>
            )}

            {/* Camera Viewport */}
            {phase !== 'idle' && (
                <div className="mb-md animate-scale-in" style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    background: '#0a0a0a',
                    aspectRatio: '16/9', // Responsive 16:9
                    boxShadow: phase === 'recording' ? '0 0 20px rgba(239, 68, 68, 0.3)' : '0 10px 30px rgba(0,0,0,0.5)',
                    border: phase === 'recording' ? '2px solid var(--accent-danger)' : '1px solid rgba(255,255,255,0.1)'
                }}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted={phase !== 'playback'}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: phase === 'preview' || phase === 'recording' ? 'scaleX(-1)' : 'none' // Mirror for front cam recording
                        }}
                    />

                    {/* Recording HUD Overlay */}
                    {phase === 'recording' && (
                        <div className="animate-fade-in" style={{
                            position: 'absolute', top: '15px', right: '15px',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
                            padding: '6px 14px', borderRadius: 'var(--radius-full)',
                            border: '1px solid rgba(239,68,68,0.4)'
                        }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-danger)', animation: 'pulse 1s infinite alternate' }} />
                            <span style={{ color: 'white', fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                                00:{String(countdown).padStart(2, '0')}
                            </span>
                        </div>
                    )}

                    {/* Viewport Guidelines */}
                    {phase === 'preview' && (
                        <div style={{ position: 'absolute', inset: 0, border: '2px dashed rgba(255,255,255,0.2)', margin: '10%', pointerEvents: 'none', borderRadius: '8px' }}>
                            <div style={{ position: 'absolute', bottom: '-25px', width: '100%', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                                Keep subject within frame
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Control Deck */}
            <div className="flex justify-center items-center gap-md">
                {phase === 'idle' && (
                    <div className="flex flex-col gap-sm" style={{ width: '100%' }}>
                        <button className="btn btn-primary btn-lg hover-scale" onClick={startPreview} style={{ width: '100%', padding: '1rem' }}>
                            <Camera size={20} style={{ marginRight: '8px' }} /> Activate Camera
                        </button>
                        <button className="btn btn-ghost text-muted" onClick={handleSkip} style={{ width: '100%', fontSize: '0.9rem' }}>
                            Skip Video Evidence →
                        </button>
                    </div>
                )}

                {phase === 'preview' && (
                    <div className="flex flex-col items-center gap-sm">
                        <button
                            className="btn hover-scale"
                            onClick={startRecording}
                            style={{
                                width: '72px', height: '72px', borderRadius: '50%',
                                background: 'transparent', border: '3px solid white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                            }}
                        >
                            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-danger)' }} />
                        </button>
                        <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Tap to record</span>
                        <button className="btn btn-ghost mt-xs text-muted" onClick={handleSkip} style={{ fontSize: '0.8rem' }}>Cancel</button>
                    </div>
                )}

                {phase === 'recording' && (
                    <div className="flex flex-col items-center gap-sm">
                        <button
                            className="btn hover-scale"
                            onClick={stopRecording}
                            style={{
                                width: '72px', height: '72px', borderRadius: '50%',
                                background: 'transparent', border: '3px solid rgba(255,255,255,0.5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                            }}
                        >
                            <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--accent-danger)', animation: 'pulse 1s infinite alternate' }} />
                        </button>
                        <span className="text-danger" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Recording...</span>
                    </div>
                )}

                {phase === 'playback' && (
                    <div className="flex flex-col gap-md w-full animate-slide-up">
                        <button className="btn btn-success btn-lg" onClick={handleSave} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(16,185,129,0.3)' }}>
                            <Check size={20} /> Attach Clip to Record
                        </button>
                        <div className="flex gap-md">
                            <button className="btn btn-secondary flex-1" onClick={handleRetake}>
                                <RotateCcw size={16} style={{ marginRight: '6px' }} /> Retake
                            </button>
                            <button className="btn btn-ghost flex-1 text-danger" onClick={() => { setPhase('idle'); setError(null); }}>
                                <X size={16} style={{ marginRight: '6px' }} /> Discard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
