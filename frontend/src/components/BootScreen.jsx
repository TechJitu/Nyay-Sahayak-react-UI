import React, { useEffect, useState } from 'react';

const BootScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("INITIALIZING NEURAL LINK...");

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(30), 200);
    const timer2 = setTimeout(() => { setText("LOADING LEGAL MODULES..."); setProgress(60); }, 1000);
    const timer3 = setTimeout(() => { setText("ACCESS GRANTED."); setProgress(100); }, 2000);
    const timer4 = setTimeout(onComplete, 2500);

    return () => {
      clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono text-accent-cyan">
      <div className="text-5xl font-black mb-6 tracking-widest text-white font-legal animate-pulse">
        NYAY OS <span className="text-accent-gold">v2.0</span>
      </div>
      
      <div className="w-80 h-1 bg-gray-900 rounded overflow-hidden relative border border-white/10">
        <div 
          className="h-full bg-accent-gold shadow-[0_0_15px_#FFD700] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="mt-4 text-xs tracking-[0.3em] opacity-70 font-tech">{text}</div>
    </div>
  );
};

export default BootScreen;