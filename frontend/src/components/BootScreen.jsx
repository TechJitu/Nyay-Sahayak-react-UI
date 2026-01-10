import React, { useEffect } from 'react';

const BootScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-bg-deep flex flex-col items-center justify-center">
      <div className="text-4xl font-bold mb-6 text-white font-legal animate-pulse">
        <span className="text-accent-gold">N</span>YAY SAHAYAK
      </div>

      <div className="w-32 h-1 bg-gray-800 rounded overflow-hidden">
        <div className="h-full bg-accent-gold shadow-[0_0_15px_#FFD700] animate-[shimmer_1s_ease-in-out_infinite]" />
      </div>
    </div>
  );
};

export default BootScreen;