import React from 'react';

/**
 * Voice Waveform Animation Component
 * Shows animated bars when voice assistant is active
 */
const VoiceWaveform = ({ isActive, isProcessing }) => {
    if (!isActive && !isProcessing) return null;

    const bars = [
        { delay: '0s', height: isProcessing ? '60%' : '40%' },
        { delay: '0.1s', height: isProcessing ? '80%' : '60%' },
        { delay: '0.2s', height: isProcessing ? '100%' : '80%' },
        { delay: '0.3s', height: isProcessing ? '80%' : '60%' },
        { delay: '0.4s', height: isProcessing ? '60%' : '40%' },
    ];

    return (
        <div className="flex items-center justify-center gap-1 h-12 px-4">
            {bars.map((bar, index) => (
                <div
                    key={index}
                    className={`w-1 rounded-full transition-all duration-300 ${isProcessing
                            ? 'bg-gradient-to-t from-blue-400 to-purple-500'
                            : 'bg-gradient-to-t from-green-400 to-emerald-500'
                        }`}
                    style={{
                        height: bar.height,
                        animation: isActive ? `wave 0.8s ease-in-out infinite ${bar.delay}` : 'none',
                    }}
                />
            ))}

            <style jsx>{`
        @keyframes wave {
          0%, 100% {
            transform: scaleY(0.5);
          }
          50% {
            transform: scaleY(1.2);
          }
        }
      `}</style>
        </div>
    );
};

export default VoiceWaveform;
