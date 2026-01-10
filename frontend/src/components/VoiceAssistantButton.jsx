import React from 'react';
import { Mic, MicOff } from 'lucide-react';

/**
 * Voice Assistant Button Component
 * Shows different states: idle, listening, processing
 */
const VoiceAssistantButton = ({ isListening, isProcessing, onClick, disabled }) => {
    const getButtonState = () => {
        if (isProcessing) return 'processing';
        if (isListening) return 'listening';
        return 'idle';
    };

    const state = getButtonState();

    const stateConfig = {
        idle: {
            bg: 'bg-gradient-to-br from-accent-gold/20 to-yellow-600/20',
            border: 'border-accent-gold/40',
            text: 'text-accent-gold',
            icon: Mic,
            label: 'Start Voice Assistant',
            pulse: false,
        },
        listening: {
            bg: 'bg-gradient-to-br from-green-500/30 to-emerald-600/30',
            border: 'border-green-400/50',
            text: 'text-green-300',
            icon: Mic,
            label: 'Listening for "Hey Sahayak"...',
            pulse: true,
        },
        processing: {
            bg: 'bg-gradient-to-br from-blue-500/30 to-purple-600/30',
            border: 'border-blue-400/50',
            text: 'text-blue-300',
            icon: Mic,
            label: 'Processing...',
            pulse: true,
        },
    };

    const config = stateConfig[state];
    const Icon = config.icon;

    return (
        <div className="relative inline-flex items-center group">
            {/* Ripple Effect for Active States */}
            {config.pulse && (
                <>
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50 animate-pulse"></span>
                </>
            )}

            {/* Main Button */}
            <button
                onClick={onClick}
                disabled={disabled}
                className={`
          relative p-4 rounded-full border-2 backdrop-blur-md
          transition-all duration-300 shadow-lg
          hover:scale-110 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          ${config.bg} ${config.border} ${config.text}
          ${config.pulse ? 'animate-pulse' : ''}
        `}
                title={config.label}
            >
                <Icon size={24} />
            </button>

            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                <div className="bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg border border-white/20">
                    {config.label}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                        <div className="border-4 border-transparent border-t-black/90"></div>
                    </div>
                </div>
            </div>

            {/* Status Text (Mobile) */}
            {state !== 'idle' && (
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap">
                    {state === 'listening' ? 'Say "Hey Sahayak"' : 'Processing...'}
                </span>
            )}
        </div>
    );
};

export default VoiceAssistantButton;
