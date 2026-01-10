import React, { useState } from 'react';
import { Calculator, HeartCrack, Truck, Banknote, RefreshCw } from 'lucide-react';

const LegalTools = () => {
  const [activeTool, setActiveTool] = useState('alimony');

  return (
    <div className="h-full p-4 md:p-8 overflow-y-auto scrollbar-hide">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <Calculator className="text-accent-gold" /> Nyaya Tools
        </h1>
        <p className="text-slate-400">Smart Legal Calculators to estimate Fines, Alimony, and Compensation.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-8">
        {[
            { id: 'alimony', label: 'Alimony Calculator', icon: <HeartCrack size={18} /> },
            { id: 'traffic', label: 'Traffic Challan', icon: <Truck size={18} /> },
            { id: 'gratuity', label: 'Gratuity Check', icon: <Banknote size={18} /> }
        ].map(tool => (
            <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                    activeTool === tool.id 
                    ? 'bg-accent-gold text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
            >
                {tool.icon} {tool.label}
            </button>
        ))}
      </div>

      {/* Render Calculator */}
      <div className="glass-panel p-6 border border-white/10 rounded-2xl max-w-3xl bg-black/20 backdrop-blur-md">
        {activeTool === 'alimony' && <AlimonyCalc />}
        {activeTool === 'traffic' && <TrafficCalc />}
        {activeTool === 'gratuity' && <GratuityCalc />}
      </div>

    </div>
  );
};

// 💔 1. Alimony Calculator Component
const AlimonyCalc = () => {
    const [income, setIncome] = useState(50000);
    const [years, setYears] = useState(5);
    const [result, setResult] = useState(null);

    const calculate = () => {
        // Simple Logic: 25% of monthly income for maintenance usually
        const monthly = (income * 0.25).toFixed(0);
        const lumpSum = (income * 12 * 0.33 * (years/2)).toFixed(0); // Rough legal estimation formula
        setResult({ monthly, lumpSum });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
                <HeartCrack /> Divorce Maintenance Estimator
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-sm text-slate-400 block mb-2">Husband's Monthly Income (₹)</label>
                    <input type="number" value={income} onChange={e => setIncome(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-slate-200" />
                </div>
                <div>
                    <label className="text-sm text-slate-400 block mb-2">Duration of Marriage (Years)</label>
                    <input type="range" min="1" max="30" value={years} onChange={e => setYears(e.target.value)} className="w-full accent-accent-gold" />
                    <span className="text-right block text-accent-gold font-bold">{years} Years</span>
                </div>
            </div>
            <button onClick={calculate} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                <RefreshCw size={18} /> Calculate Estimation
            </button>
            
            {result && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
                    <p className="text-slate-400 text-sm">Estimated Monthly Maintenance</p>
                    <h3 className="text-2xl font-bold text-white mb-2">₹ {result.monthly} / month</h3>
                    <div className="h-px bg-white/10 my-2"></div>
                    <p className="text-slate-400 text-sm">Or One-time Settlement (Approx)</p>
                    <h3 className="text-2xl font-bold text-accent-gold">₹ {result.lumpSum}</h3>
                    <p className="text-[10px] text-slate-500 mt-2">*Based on Supreme Court guidelines (approx 25% rule). Actual court orders may vary.</p>
                </div>
            )}
        </div>
    );
};

// 🚔 2. Traffic Fine Calculator
const TrafficCalc = () => {
    const [offenses, setOffenses] = useState({ helmet: false, license: false, signal: false, drink: false });
    
    const calculateFine = () => {
        let total = 0;
        if(offenses.helmet) total += 1000;
        if(offenses.license) total += 5000;
        if(offenses.signal) total += 500; // vary by state
        if(offenses.drink) total += 10000;
        return total;
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                <Truck /> Traffic E-Challan Estimator (New MV Act)
            </h2>
            <div className="space-y-3">
                {[
                    { key: 'helmet', label: 'Driving without Helmet', price: '₹1000' },
                    { key: 'license', label: 'Driving without License', price: '₹5000' },
                    { key: 'signal', label: 'Jumping Red Light', price: '₹500' },
                    { key: 'drink', label: 'Drunk Driving', price: '₹10000 + Jail' },
                ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/20 transition-all cursor-pointer" onClick={() => setOffenses({...offenses, [item.key]: !offenses[item.key]})}>
                        <label className="flex items-center gap-3 cursor-pointer pointer-events-none">
                            <input 
                                type="checkbox" 
                                checked={offenses[item.key]} 
                                readOnly
                                className="w-5 h-5 accent-accent-gold rounded"
                            />
                            <span className="text-slate-200">{item.label}</span>
                        </label>
                        <span className="text-xs text-red-400 font-bold">{item.price}</span>
                    </div>
                ))}
            </div>
            
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex justify-between items-center">
                <span className="text-slate-300">Total Potential Fine:</span>
                <span className="text-3xl font-bold text-white">₹ {calculateFine()}</span>
            </div>
        </div>
    );
};

// 💰 3. Gratuity Calculator
const GratuityCalc = () => {
    const [basic, setBasic] = useState(30000);
    const [years, setYears] = useState(5);
    
    // Formula: (15 * last drawn salary * tenure) / 26
    const gratuity = ((15 * basic * years) / 26).toFixed(0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold text-green-400 flex items-center gap-2">
                <Banknote /> Gratuity Calculator
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-sm text-slate-400 block mb-2">Basic Salary + DA (Monthly)</label>
                    <input type="number" value={basic} onChange={e => setBasic(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-slate-200" />
                </div>
                <div>
                    <label className="text-sm text-slate-400 block mb-2">Years of Service (Min 5)</label>
                    <input type="number" value={years} onChange={e => setYears(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-slate-200" />
                </div>
            </div>

            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
                <p className="text-slate-400 text-sm">Total Gratuity Payable</p>
                <h3 className="text-4xl font-bold text-accent-gold mt-2">₹ {gratuity}</h3>
                <p className="text-[10px] text-slate-500 mt-2">Formula: (15 × Salary × Years) / 26</p>
            </div>
        </div>
    );
};

export default LegalTools;