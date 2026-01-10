import React, { useState } from 'react';
import { Shield, Siren, Key, Home, AlertTriangle, Volume2, MicOff, Lock } from 'lucide-react';

const LegalKavach = () => {
  const [activeScenario, setActiveScenario] = useState(null);

  // 🔊 Text-to-Speech (Stern/Serious Voice for Authority)
  const playWarning = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN'; // Indian Accent
    utterance.rate = 0.9; // Slightly slow and clear
    utterance.pitch = 0.8; // Authoritative tone
    window.speechSynthesis.speak(utterance);
  };

  const scenarios = [
    {
      id: 'police',
      title: 'Police Stopped Me',
      icon: <Siren size={32} className="text-red-500" />,
      desc: "If traffic police takes your keys or demands a bribe.",
      steps: [
        { label: "Don't Panic", text: "Shaant rahiye. Gadi side mein lagayein." },
        { label: "Key Snatching?", text: "Sir, Motor Vehicle Act ke tahat aapko meri gadi ki chaabi nikalne ka adhikar nahi hai. (Video record karein)." },
        { label: "Challan Amount?", text: "Sir, mujhe official e-challan machine se raseed dijiye. Cash dene se mana karein." }
      ],
      audioScript: "Sir, Motor Vehicle Act ke tahat, kisi bhi police adhikari ko gadi ki chaabi nikalne ka adhikar nahi hai. Kripya meri chaabi wapas karein aur niyam purvak challan kaatein."
    },
    {
      id: 'landlord',
      title: 'Landlord Issues',
      icon: <Home size={32} className="text-orange-500" />,
      desc: "Forced eviction or entering without notice.",
      steps: [
        { label: "Privacy Right", text: "Aap meri permission ke bina mere ghar mein nahi aa sakte." },
        { label: "Eviction Threat?", text: "Bina court order aur 1 mahine ke notice ke aap mujhe nahi nikal sakte." },
        { label: "Security Deposit", text: "Deposit katne ka valid reason aur bill dikhana padega." }
      ],
      audioScript: "Sir, Rent Control Act ke anusar, aap bina 24 ghante ke notice ke mere ghar mein nahi aa sakte. Agar aapne zabardasti ki, toh mujhe police complaint karni padegi."
    },
    {
      id: 'accident',
      title: 'Road Accident',
      icon: <AlertTriangle size={32} className="text-yellow-500" />,
      desc: "Someone hit your car or you hit someone.",
      steps: [
        { label: "Evidence", text: "Sabse pehle gadi aur number plate ka photo lein." },
        { label: "No Fight", text: "Behes na karein. Seedha insurance claim ke liye bolein." },
        { label: "Injured?", text: "Agar koi ghayal hai, toh turant hospital le jayein (Good Samaritan Law aapko protect karta hai)." }
      ],
      audioScript: "Dekhiye, hum sadak par tamasha nahi karenge. Maine gadi ka number note kar liya hai. Hum police station jakar baat karenge. Kripya shanti banaye rakhein."
    },
    {
      id: 'scam',
      title: 'Online Scam / Fraud',
      icon: <Lock size={32} className="text-blue-500" />,
      desc: "Bank money deducted or OTP fraud.",
      steps: [
        { label: "Call 1930", text: "Turant 1930 par call karein (Cyber Crime Helpline)." },
        { label: "Block Card", text: "Apne bank app se card freeze karein." },
        { label: "Don't Delete", text: "SMS ya Transaction ID delete na karein." }
      ],
      audioScript: "Main abhi Cyber Crime Portal par complaint register kar raha hun. Agar yeh fraud hai, toh aapka account trace ho jayega."
    }
  ];

  return (
    <div className="h-full p-4 md:p-8 overflow-y-auto scrollbar-hide bg-gradient-to-br from-black via-red-950/20 to-black">
      
      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-red-500 flex items-center justify-center md:justify-start gap-3 animate-pulse">
          <Shield size={40} /> KAVACH (कवच)
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Emergency Legal Protection. <span className="text-white font-bold">Jab bolne mein darr lage, toh Phone bolega!</span>
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto pb-20">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => setActiveScenario(activeScenario === scenario.id ? null : scenario.id)}
            className={`text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
              activeScenario === scenario.id 
                ? 'bg-red-900/40 border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.3)] scale-[1.02]' 
                : 'glass-panel border-white/10 hover:border-red-500/50 hover:bg-white/5'
            }`}
          >
            <div className="flex items-start justify-between mb-2 relative z-10">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">{scenario.icon}</div>
              {activeScenario === scenario.id && <div className="animate-ping w-3 h-3 bg-red-500 rounded-full"></div>}
            </div>
            
            <h3 className="text-xl font-bold text-slate-100 relative z-10">{scenario.title}</h3>
            <p className="text-sm text-slate-400 mt-1 relative z-10">{scenario.desc}</p>

            {/* EXPANDED CONTENT */}
            {activeScenario === scenario.id && (
              <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 relative z-10">
                <div className="h-px bg-white/10"></div>
                
                {/* Steps */}
                <div className="space-y-3">
                    {scenario.steps.map((step, i) => (
                        <div key={i} className="flex gap-3">
                            <span className="text-red-500 font-bold">{i+1}.</span>
                            <div>
                                <span className="text-white font-bold text-sm block">{step.label}</span>
                                <span className="text-slate-400 text-xs">{step.text}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 🔊 THE MAGIC BUTTON */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        playWarning(scenario.audioScript);
                    }}
                    className="w-full mt-4 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform"
                >
                    <Volume2 size={24} className="animate-pulse" />
                    PLAY LEGAL WARNING
                </button>
                <p className="text-[10px] text-center text-slate-500">
                    *Press this to make your phone speak the law to the other person.
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

    </div>
  );
};

export default LegalKavach;