import React, { useEffect, useState } from 'react';
import { MessageSquare, FileText, Shield, Settings, History, ChevronRight, Globe, X } from 'lucide-react';
import { db, auth } from '../firebase'; 
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'; 

const Sidebar = ({ mode, setMode, user, onOpenSettings, onLoadChat, isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  
  // ✅ Helper Function for Initials (Fixes crash)
  const getInitials = (name) => {
    return name && name.length > 0 ? name.charAt(0).toUpperCase() : "U";
  };
  
  useEffect(() => {
    const fetchHistory = async () => {
      if (!auth.currentUser) return;
      try {
        const q = query(
          collection(db, "chats"), 
          where("userId", "==", auth.currentUser.email),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const chats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistory(chats);
      } catch (error) {
        console.log("History Error:", error);
      }
    };
    if (auth.currentUser) fetchHistory();
  }, [mode]);

  // ✅ Menu Items (Advocate Removed)
  const menuItems = [
    { id: 'chat', label: 'Legal Assistant', icon: <MessageSquare size={20} /> },
    { id: 'draft', label: 'Draft Documents', icon: <FileText size={20} /> },
    { id: 'report', label: 'File Report (FIR)', icon: <Shield size={20} /> },
    { id: 'digital', label: 'E-Legal Seva', icon: <Globe size={20} /> },
  ];

  // Responsive Classes Logic
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-72 bg-black/95 backdrop-blur-xl border-r border-white/10 
    transform transition-transform duration-300 ease-in-out
    md:translate-x-0 md:static md:w-64 md:bg-glass
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
        ></div>
      )}

      <aside className={sidebarClasses}>
        
        {/* Header & Close Button */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
                
                {/* Profile Picture Logic */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-gold to-yellow-700 flex items-center justify-center text-black font-bold text-lg overflow-hidden shrink-0 relative">
                    {user.photo ? (
                        <>
                            <img 
                                src={user.photo} 
                                alt="User" 
                                className="w-full h-full object-cover" 
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none'; 
                                    const fallback = e.currentTarget.nextSibling;
                                    if(fallback) fallback.style.display = 'flex';
                                }}
                            />
                            <div className="absolute inset-0 hidden items-center justify-center bg-slate-700 text-white w-full h-full">
                                {getInitials(user.name)}
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-700 text-white">
                            {getInitials(user.name)}
                        </div>
                    )}
                </div>

                <div className="overflow-hidden">
                    <h3 className="font-bold text-slate-100 truncate w-32">{user.name}</h3>
                    <p className="text-xs text-accent-gold truncate">{user.role}</p>
                </div>
            </div>
            {/* Close Button */}
            <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
                <X size={24} />
            </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
            <p className="text-xs text-slate-500 font-bold px-4 mb-2 uppercase tracking-wider">Menu</p>
            {menuItems.map((item) => (
            <button
                key={item.id}
                onClick={() => {
                    setMode(item.id);
                    onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                mode === item.id 
                    ? 'bg-accent-gold text-black shadow-[0_0_15px_rgba(255,215,0,0.4)] font-bold' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
            >
                {item.icon}
                <span>{item.label}</span>
            </button>
            ))}
        </nav>

        {/* History Section */}
        <div className="flex-1 overflow-y-auto px-4 mt-4 scrollbar-hide">
            <p className="text-xs text-slate-500 font-bold px-4 mb-2 uppercase tracking-wider flex items-center gap-2">
                <History size={12} /> Recent Cases
            </p>
            <div className="space-y-1 pb-20">
                {history.map((chat) => (
                    <button 
                        key={chat.id}
                        onClick={() => {
                            onLoadChat(chat);
                            onClose();
                        }} 
                        className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg truncate transition-all flex items-center justify-between group"
                    >
                        <span className="truncate w-32">{chat.title || "Untitled Case"}</span>
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent-gold" />
                    </button>
                ))}
            </div>
        </div>

        {/* Bottom Config */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
            <button 
                onClick={() => {
                    onOpenSettings();
                    onClose();
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-sm font-medium"
            >
                <Settings size={16} /> Configure Profile
            </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;