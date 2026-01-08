import React, { useState } from 'react';
import { X, Sliders } from 'lucide-react';

const SettingsModal = ({ user, setUser, onClose }) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUser(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-[700px] p-8 rounded-2xl transform scale-100 transition-all">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
          <h2 className="text-xl font-bold font-legal text-accent-gold tracking-widest flex items-center gap-3">
            <Sliders className="w-6 h-6" /> SYSTEM CONFIG
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-accent-cyan mb-2">Identity</label>
              <input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Name" 
                className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-accent-cyan focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-accent-cyan mb-2">Role / Access</label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-accent-cyan outline-none"
              >
                <option value="Citizen">Citizen (Public Access)</option>
                <option value="Advocate">Advocate (Pro Tools)</option>
                <option value="Student">Student (Learning Mode)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-accent-gold mb-2">Jurisdiction</label>
              <select 
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-accent-gold outline-none custom-scrollbar"
              >
                <option value="India (General)">🇮🇳 India (Central Laws)</option>
                <optgroup label="States" className="text-accent-gold bg-black font-bold">
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi (NCR)</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-accent-cyan mb-2">Language</label>
              <select 
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-accent-cyan outline-none"
              >
                <option value="Hinglish">Hinglish (Default)</option>
                <option value="English">English (Formal)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Marathi">Marathi (मराठी)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-accent-cyan mb-2">Response Style</label>
              <select 
                name="detailLevel"
                value={formData.detailLevel}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-accent-cyan outline-none"
              >
                <option value="Detailed">Detailed Explanation</option>
                <option value="Concise">Short & Precise</option>
              </select>
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="w-full py-4 action-btn rounded-xl mt-8 text-sm tracking-widest shadow-lg">
          APPLY SETTINGS & REBOOT
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;