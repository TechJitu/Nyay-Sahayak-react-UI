import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Voice Assistant Hook - Siri/Google Assistant-like functionality
 * Features: Wake word detection, continuous listening, voice commands
 */
export const useVoiceAssistant = (enabled = true, onCommand) => {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);
    const [isSupported, setIsSupported] = useState(false);

    const recognitionRef = useRef(null);
    const isWaitingForWakeWord = useRef(true);

    // Check browser support
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        setIsSupported(!!SpeechRecognition);
    }, []);

    // Initialize Speech Recognition
    const initRecognition = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('Speech recognition not supported in this browser');
            return null;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // English (India) for better Hindi-English mix

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognition.onend = () => {
            // Auto-restart if still enabled and not processing
            if (enabled && !isProcessing && isListening) {
                try {
                    recognition.start();
                } catch (e) {
                    console.log('Recognition restart prevented:', e);
                }
            } else {
                setIsListening(false);
            }
        };

        recognition.onerror = (event) => {
            if (event.error === 'no-speech') {
                // Ignore no-speech errors in continuous mode
                return;
            }
            if (event.error === 'aborted') {
                // Normal when stopping
                return;
            }
            console.error('Speech recognition error:', event.error);
            setError(`Error: ${event.error}`);

            // Don't restart on permission errors
            if (event.error === 'not-allowed') {
                setIsListening(false);
            }
        };

        recognition.onresult = (event) => {
            const current = event.resultIndex;
            const transcriptText = event.results[current][0].transcript;
            const isFinal = event.results[current].isFinal;

            // Update transcript
            setTranscript(transcriptText);

            if (isFinal) {
                handleFinalTranscript(transcriptText.trim());
            }
        };

        return recognition;
    }, [enabled, isProcessing, isListening]);

    // Handle final transcript
    const handleFinalTranscript = useCallback((text) => {
        const lowerText = text.toLowerCase();

        // Wake word detection
        if (isWaitingForWakeWord.current) {
            if (lowerText.includes('hey sahayak') || lowerText.includes('hi sahayak') ||
                lowerText.includes('hey sahayak') || lowerText.includes('hi sahayak')) {
                // Wake word detected!
                isWaitingForWakeWord.current = false;
                setIsProcessing(true);

                // Extract command after wake word
                const command = text.replace(/hey sahayak|hi sahayak/gi, '').trim();

                if (command) {
                    processCommand(command);
                } else {
                    // Just activated, wait for next speech
                    setIsProcessing(false);
                    setTranscript('Listening...');
                }
            }
            return;
        }

        // Process command when already activated
        setIsProcessing(true);
        processCommand(text);
    }, []);

    // Process voice commands
    const processCommand = useCallback((command) => {
        const lowerCommand = command.toLowerCase();

        // Built-in commands
        if (lowerCommand.includes('stop listening') || lowerCommand.includes('stop')) {
            stopListening();
            onCommand?.({ type: 'stop', text: command });
            return;
        }

        if (lowerCommand.includes('clear chat') || lowerCommand.includes('clear messages')) {
            onCommand?.({ type: 'clear', text: command });
            resetToWakeWord();
            return;
        }

        if (lowerCommand.includes('send message') || lowerCommand.includes('search')) {
            const query = command.replace(/send message|search/gi, '').trim();
            onCommand?.({ type: 'send', text: query || command });
            resetToWakeWord();
            return;
        }

        // Default: treat as query
        onCommand?.({ type: 'query', text: command });
        resetToWakeWord();
    }, [onCommand]);

    // Reset to wake word listening
    const resetToWakeWord = useCallback(() => {
        isWaitingForWakeWord.current = true;
        setIsProcessing(false);
        setTranscript('');
    }, []);

    // Start listening
    const startListening = useCallback(() => {
        if (!isSupported) {
            setError('Speech recognition not supported');
            return;
        }

        if (!recognitionRef.current) {
            recognitionRef.current = initRecognition();
        }

        if (recognitionRef.current && !isListening) {
            try {
                isWaitingForWakeWord.current = true;
                recognitionRef.current.start();
            } catch (error) {
                console.error('Error starting recognition:', error);
                setError('Could not start voice recognition');
            }
        }
    }, [isSupported, isListening, initRecognition]);

    // Stop listening
    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsListening(false);
        setIsProcessing(false);
        setTranscript('');
        isWaitingForWakeWord.current = true;
    }, []);

    // Toggle listening
    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    // Auto-start if enabled
    useEffect(() => {
        if (enabled && isSupported) {
            // Don't auto-start, wait for user activation
            return;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [enabled, isSupported]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                recognitionRef.current = null;
            }
        };
    }, []);

    return {
        isListening,
        isProcessing,
        transcript,
        error,
        isSupported,
        startListening,
        stopListening,
        toggleListening,
        isWaitingForWakeWord: isWaitingForWakeWord.current,
    };
};
