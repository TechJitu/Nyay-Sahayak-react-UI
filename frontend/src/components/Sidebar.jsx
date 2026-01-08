import React from 'react';
import { MessageSquare, Briefcase, FilePen, ShieldAlert, Settings } from 'lucide-react';

const Sidebar = ({ mode, setMode, user, onOpenSettings }) => {
  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  const NavButton = ({ id, icon: Icon, label, activeColor = 'text-accent-cyan' }) => (
    <button
      onClick={() => setMode(id)}
      className={`nav-btn w-full flex items-center gap-4 px-4 py-4 text-sm font-semibold rounded-lg transition-all duration-300
        ${mode === id ? `nav-btn-active ${activeColor}` : 'text-slate-400 hover:text-white'}`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <aside className="hidden md:flex flex-col w-72 glass-panel p-6 justify-between z-40 h-full border-r border-white/10 relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent-gold to-transparent opacity-50"></div>
      
      <div>
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 px-2">
          <div className="relative">
            <div className="text-3xl text-accent-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">⚖️</div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-cyan rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-[0.15em] font-legal text-white">NYAY <span className="text-accent-gold">AI</span></h1>
            <div className="text-[9px] text-accent-cyan tracking-[0.3em] opacity-80 font-tech">COMMAND NODE</div>
          </div>
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-3 mb-8 p-3 rounded border border-white/10 bg-white/5">
          <div className="w-10 h-10 rounded bg-gradient-to-tr from-accent-gold to-yellow-900 flex items-center justify-center font-bold text-black shadow-lg">
            {getInitials(user.name)}
          </div>
          <div className="overflow-hidden">
            <p className="text-[9px] text-accent-cyan uppercase tracking-wider font-bold">WELCOME BACK</p>
            <p className="text-xs font-bold truncate text-white">{user.name || 'User'}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-3 font-tech">
          <NavButton id="chat" icon={MessageSquare} label="Legal Chat" />
          <NavButton id="advocate" icon={Briefcase} label="Advocate's Touch" activeColor="text-accent-gold" />
          <NavButton id="draft" icon={FilePen} label="Draft Documents" />
          <NavButton id="report" icon={ShieldAlert} label="File Report" />
        </nav>
      </div>

      {/* Footer */}
      <div className="space-y-2 pt-6 border-t border-white/10">
        <button onClick={onOpenSettings} className="w-full flex items-center gap-3 px-4 py-2 text-xs uppercase tracking-widest text-slate-500 hover:text-accent-cyan transition">
          <Settings className="w-4 h-4" /> Config
        </button>
        <div className="px-4 text-[10px] text-slate-600 font-mono flex items-center gap-2">
          SERVER STATUS: <span className="text-green-500">● ONLINE</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;