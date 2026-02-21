/* ========================================
   SENTRAK — useVoiceInput Hook
   Custom React hook for Web Speech API
   Owner: Rahul (feat/athlete)
   ======================================== */

import { useState, useEffect, useRef, useCallback } from 'react';

const SpeechRecognition = typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

/**
 * Custom hook for voice input using Web Speech API
 * @param {Object} options
 * @param {string} options.language - 'ta-IN' for Tamil, 'en-IN' for English
 * @param {boolean} options.continuous - keep listening after result
 * @param {function} options.onResult - callback when final result received
 */
export default function useVoiceInput({
    language = 'ta-IN',
    continuous = false,
    onResult = null,
} = {}) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [error, setError] = useState(null);
    const recognitionRef = useRef(null);
    const isSupported = !!SpeechRecognition;

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                try { recognitionRef.current.abort(); } catch (_) { /* noop */ }
            }
        };
    }, []);

    const startListening = useCallback(() => {
        if (!SpeechRecognition) {
            setError('Speech recognition not supported in this browser');
            return;
        }

        // Stop existing instance
        if (recognitionRef.current) {
            try { recognitionRef.current.abort(); } catch (_) { /* noop */ }
        }

        setError(null);
        setInterimTranscript('');

        const recognition = new SpeechRecognition();
        recognition.lang = language;
        recognition.continuous = continuous;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognitionRef.current = recognition;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    final += result[0].transcript;
                } else {
                    interim += result[0].transcript;
                }
            }

            if (interim) {
                setInterimTranscript(interim);
            }

            if (final) {
                setTranscript(final.trim());
                setInterimTranscript('');
                if (onResult) {
                    onResult(final.trim());
                }
            }
        };

        recognition.onerror = (event) => {
            let errorMsg = 'Speech recognition error';
            switch (event.error) {
                case 'not-allowed':
                case 'service-not-allowed':
                    errorMsg = 'Microphone permission denied';
                    break;
                case 'no-speech':
                    errorMsg = 'No speech detected';
                    break;
                case 'audio-capture':
                    errorMsg = 'No microphone found';
                    break;
                case 'network':
                    errorMsg = 'Network error during recognition';
                    break;
                case 'aborted':
                    // User intentionally stopped — not an error
                    setIsListening(false);
                    return;
                default:
                    errorMsg = `Recognition error: ${event.error}`;
            }
            setError(errorMsg);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            recognitionRef.current = null;
        };

        try {
            recognition.start();
        } catch (err) {
            setError('Failed to start speech recognition');
            setIsListening(false);
        }
    }, [language, continuous, onResult]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (_) { /* noop */ }
        }
        setIsListening(false);
    }, []);

    return {
        isListening,
        transcript,
        interimTranscript,
        startListening,
        stopListening,
        error,
        isSupported,
    };
}
