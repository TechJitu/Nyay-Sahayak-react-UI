import React, { useState } from 'react';
import { ExternalLink, Shield, Globe, ShoppingBag, Users, FileText, Video, Truck, AlertTriangle, Lock, Briefcase, PhoneCall, Building, Plane, Landmark, Filter } from 'lucide-react';

const GovServices = () => {
  const [filter, setFilter] = useState('all'); // 'all', 'complaint', 'service', 'legal'

  const services = [
    // --- 🚨 COMPLAINTS (SHIKAYAT) ---
    {
      title: "Cyber Crime Portal",
      desc: "Report online financial fraud, hacking, and social media harassment anonymously.",
      url: "https://cybercrime.gov.in",
      icon: <Shield size={32} className="text-red-500" />,
      category: "complaint"
    },
    {
      title: "RBI Sachet (Bank Fraud)",
      desc: "Report illegal money collection schemes and financial frauds directly to RBI.",
      url: "https://sachet.rbi.org.in",
      icon: <Landmark size={32} className="text-red-400" />,
      category: "complaint"
    },
    {
      title: "National Consumer Helpline",
      desc: "File complaints against companies for bad products, refund issues, or unfair trade.",
      url: "https://consumerhelpline.gov.in",
      icon: <ShoppingBag size={32} className="text-orange-400" />,
      category: "complaint"
    },
    {
      title: "CPGRAMS (PG Portal)",
      desc: "File complaints against ANY Central Govt Ministry/Department if work is stalled.",
      url: "https://pgportal.gov.in",
      icon: <AlertTriangle size={32} className="text-yellow-500" />,
      category: "complaint"
    },
    {
      title: "RERA (Property Issue)",
      desc: "File complaint against builders for delay in possession or false promises.",
      url: "https://rera.example.in", // State specific hota hai, usually user searches RERA + State
      icon: <Building size={32} className="text-amber-600" />,
      category: "complaint"
    },

    // --- 📄 SERVICES (SUVIDHA) ---
    {
      title: "e-Courts Services",
      desc: "Check Case Status, Court Orders, Judgments, and Hearing Dates for any court.",
      url: "https://services.ecourts.gov.in",
      icon: <FileText size={32} className="text-green-400" />,
      category: "service"
    },
    {
      title: "e-Challan Parivahan",
      desc: "Check and pay pending traffic fines/challans online without visiting court.",
      url: "https://echallan.parivahan.gov.in",
      icon: <Truck size={32} className="text-blue-400" />,
      category: "service"
    },
    {
      title: "DigiLocker",
      desc: "Legally valid digital storage for Driving License, Marksheets, and PAN Card.",
      url: "https://www.digilocker.gov.in",
      icon: <Lock size={32} className="text-blue-500" />,
      category: "service"
    },
    {
      title: "Passport Seva",
      desc: "Apply for new Passport, renewal, or check application status online.",
      url: "https://www.passportindia.gov.in",
      icon: <Plane size={32} className="text-cyan-400" />,
      category: "service"
    },
    {
      title: "RTI Online",
      desc: "File 'Right to Information' application to demand answers from Govt departments.",
      url: "https://rtionline.gov.in",
      icon: <FileText size={32} className="text-indigo-400" />,
      category: "service"
    },
    {
      title: "IP India (Patents)",
      desc: "Register your Logo (Trademark), Inventions (Patent), or Creative Work.",
      url: "https://ipindia.gov.in",
      icon: <Briefcase size={32} className="text-emerald-400" />,
      category: "service"
    },

    // --- ⚖️ LEGAL HELP (SAHAYATA) ---
    {
      title: "Tele-Law Service",
      desc: "Get free legal advice through video conferencing with expert lawyers.",
      url: "https://www.tele-law.in",
      icon: <Video size={32} className="text-purple-400" />,
      category: "legal"
    },
    {
      title: "NALSA (Free Legal Aid)",
      desc: "Apply for free government lawyer for women, SC/ST, and low-income groups.",
      url: "https://nalsa.gov.in",
      icon: <Users size={32} className="text-pink-400" />,
      category: "legal"
    },
    {
      title: "Childline 1098",
      desc: "Emergency report for child abuse or lost children. Direct POCSO help.",
      url: "https://www.childlineindia.org.in",
      icon: <PhoneCall size={32} className="text-orange-500" />,
      category: "legal"
    },
  ];

  // Filtering Logic
  const filteredServices = filter === 'all' 
    ? services 
    : services.filter(s => s.category === filter);

  return (
    <div className="h-full overflow-y-auto p-6 scrollbar-hide">
      {/* Header */}
      <div className="mb-6 text-center md:text-left">
        <h1 className="text-3xl font-bold text-accent-gold mb-2 flex items-center justify-center md:justify-start gap-3">
          <Globe className="animate-pulse" /> Digital Legal Seva
        </h1>
        <p className="text-slate-400">One-stop portal for all Indian Government Legal & Citizen Services.</p>
      </div>

      {/* 🔥 FILTER BUTTONS */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center md:justify-start">
        {[
            { id: 'all', label: 'All Portals', icon: <Globe size={16} /> },
            { id: 'complaint', label: 'File Complaint', icon: <AlertTriangle size={16} /> },
            { id: 'service', label: 'Citizen Services', icon: <FileText size={16} /> },
            { id: 'legal', label: 'Legal Aid', icon: <Users size={16} /> }
        ].map((btn) => (
            <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all font-medium ${
                    filter === btn.id 
                    ? 'bg-accent-gold text-black border-accent-gold shadow-[0_0_15px_rgba(255,215,0,0.4)]' 
                    : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
            >
                {btn.icon} {btn.label}
            </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {filteredServices.map((service, index) => (
          <div key={index} className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-accent-gold/50 transition-all hover:bg-white/5 group relative overflow-hidden flex flex-col">
            
            {/* Glow Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-start justify-between mb-4">
                <div className="bg-black/40 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform shadow-lg">
                  {service.icon}
                </div>
                <div className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${
                    service.category === 'complaint' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                    service.category === 'service' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' :
                    'text-purple-400 border-purple-500/30 bg-purple-500/10'
                }`}>
                    {service.category === 'complaint' ? 'Report' : service.category === 'service' ? 'Service' : 'Help'}
                </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-accent-gold transition-colors">{service.title}</h3>
            <p className="text-slate-400 text-sm mb-6 flex-1 leading-relaxed">{service.desc}</p>
            
            <a 
              href={service.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-accent-gold hover:text-black font-bold transition-all border border-white/10 mt-auto"
            >
              Visit Portal <ExternalLink size={16} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GovServices;