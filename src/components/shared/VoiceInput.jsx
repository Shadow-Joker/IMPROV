/* ========================================
   SENTRAK — VoiceInput Component
   Reusable voice-first text input
   Owner: Rahul (feat/athlete)
   ======================================== */

import { useState, useEffect } from 'react';
import { Mic, MicOff, X } from 'lucide-react';
import useVoiceInput from '../../hooks/useVoiceInput';

export default function VoiceInput({
    onResult,
    language = 'ta-IN',
    placeholder = '',
    label = '',
    value = '',
    onChange,
    className = '',
}) {
    const [localValue, setLocalValue] = useState(value);

    const {
        isListening,
        transcript,
        interimTranscript,
        startListening,
        stopListening,
        error,
        isSupported,
    } = useVoiceInput({
        language,
        continuous: false,
        onResult: (text) => {
            setLocalValue(text);
            if (onChange) onChange(text);
            if (onResult) onResult(text);
        },
    });

    // Sync external value changes
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleTextChange = (e) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        if (onChange) onChange(newValue);
    };

    const handleClear = () => {
        setLocalValue('');
        if (onChange) onChange('');
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    return (
        <div className={`form-group ${className}`}>
            {label && <label className="form-label">{label}</label>}
            <div className="flex gap-sm items-center">
                <div className="flex-1" style={{ position: 'relative' }}>
                    <input
                        type="text"
                        className="form-input"
                        value={localValue}
                        onChange={handleTextChange}
                        placeholder={isListening ? (interimTranscript || '🎤 Listening...') : placeholder}
                    />
                    {localValue && (
                        <button
                            type="button"
                            className="btn-ghost"
                            onClick={handleClear}
                            style={{
                                position: 'absolute',
                                right: '8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                padding: '4px',
                                minHeight: 'auto',
                            }}
                            aria-label="Clear"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
                {isSupported && (
                    <button
                        type="button"
                        className={`voice-btn ${isListening ? 'listening' : ''}`}
                        onClick={toggleListening}
                        aria-label={isListening ? 'Stop listening' : 'Start listening'}
                    >
                        {isListening ? <MicOff size={22} /> : <Mic size={22} />}
                    </button>
                )}
            </div>
            {error && <p className="text-danger" style={{ fontSize: '0.8rem', marginTop: '4px' }}>{error}</p>}
            {isListening && interimTranscript && (
                <p className="text-muted animate-pulse" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                    {interimTranscript}
                </p>
            )}
        </div>
    );
}
