import React from 'react';
import { X, Save, LogOut, User, MapPin, Globe, Shield, Mic } from 'lucide-react';

const SettingsModal = ({ user, setUser, onClose, onLogout }) => {

  // Handle Input Change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg-deep border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <User className="text-accent-gold" /> Profile Settings
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          {/* Photo/Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-accent-gold/20 p-1">
              {user.photo ? (
                <img src={user.photo} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-700 rounded-full flex items-center justify-center text-3xl font-bold text-slate-400">
                  {user.name[0]}
                </div>
              )}
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Full Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-slate-200 focus:border-accent-gold outline-none transition-all"
            />
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                <Shield size={12} /> Role
              </label>
              <select
                name="role"
                value={user.role}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-slate-200 focus:border-accent-gold outline-none"
              >
                <option value="Citizen">Citizen</option>
                <option value="Advocate">Advocate</option>
                <option value="Police">Police Officer</option>
                <option value="Student">Law Student</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                <Globe size={12} /> Language
              </label>
              <select
                name="language"
                value={user.language}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-slate-200 focus:border-accent-gold outline-none"
              >
                <option value="Hinglish">Hinglish</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Marathi">Marathi</option>
              </select>
            </div>
          </div>

          {/* State Selection */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <MapPin size={12} /> Location (State Laws)
            </label>
            <select
              name="state"
              value={user.state}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-slate-200 focus:border-accent-gold outline-none"
            >
              <option value="India (General)">India (General Central Laws)</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
            </select>
          </div>

          {/* Voice Assistant Toggle */}
          <div className="space-y-2 p-4 bg-gradient-to-br from-accent-gold/5 to-yellow-600/5 border border-accent-gold/20 rounded-lg">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-200 font-medium flex items-center gap-2">
                <Mic size={16} className="text-accent-gold" />
                Voice Assistant
              </label>
              <button
                onClick={() => setUser({ ...user, voiceAssistantEnabled: !user.voiceAssistantEnabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${user.voiceAssistantEnabled ? 'bg-accent-gold' : 'bg-slate-600'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.voiceAssistantEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enable hands-free control with voice commands. Say <span className="text-accent-gold font-medium">"Hey Sahayak"</span> to activate.
              <br />
              <span className="text-slate-500">Works best in Chrome/Edge browsers.</span>
            </p>
          </div>

        </div>

        {/* Footer with Actions */}
        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-between items-center gap-4">

          {/* 🔴 LOGOUT BUTTON (Updated: No Popup) */}
          <button
            onClick={() => {
              onLogout(); // Seedha Logout
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all font-medium text-sm"
          >
            <LogOut size={16} /> Log Out
          </button>

          {/* Save Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-accent-gold text-black font-bold hover:shadow-[0_0_15px_rgba(255,215,0,0.4)] transition-all"
          >
            <Save size={18} /> Save Profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;