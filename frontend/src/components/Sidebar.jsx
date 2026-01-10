import React, { useEffect, useState } from 'react';
import { MessageSquare, FileText, Shield, Settings, History, ChevronRight, Globe, X, ShieldAlert, Calculator, ChevronLeft } from 'lucide-react';
import { db, auth } from '../firebase'; 
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'; 

const Sidebar = ({ mode, setMode, user, onOpenSettings, onLoadChat, isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false); // ✅ Desktop Collapse State
  
  const getInitials = (name) => {
    return name && name.length > 0 ? name.charAt(0).toUpperCase() : "U";
  };
  
  useEffect(() => {
    const fetchHistory = async () => {
      // ✅ Security Check: Ensure user is logged in before querying
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

    // ✅ Bug Fix: Added 'user' to dependencies so it retries after login finishes
    if (auth.currentUser) fetchHistory();
  }, [mode, user]); 

  const menuItems = [
    { id: 'chat', label: 'Legal Assistant', icon: <MessageSquare size={20} /> },
    { id: 'kavach', label: 'KAVACH (Emergency)', icon: <ShieldAlert size={20} className="text-red-500 animate-pulse" /> },
    { id: 'draft', label: 'Draft Documents', icon: <FileText size={20} /> },
    { id: 'report', label: 'File Report (FIR)', icon: <Shield size={20} /> },
    { id: 'tools', label: 'Nyaya Tools', icon: <Calculator size={20} /> },
    { id: 'digital', label: 'E-Legal Seva', icon: <Globe size={20} /> },
  ];

  // Dynamic Classes based on Collapse
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 bg-black/95 backdrop-blur-xl border-r border-white/10 
    transform transition-all duration-300 ease-in-out flex flex-col
    md:translate-x-0 md:static md:bg-glass
    ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
    ${isCollapsed ? 'md:w-20' : 'md:w-64'} 
  `;

  return (
    <>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"></div>}

      <aside className={sidebarClasses}>
        
        {/* Header */}
        <div className={`p-4 border-b border-white/10 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && (
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-gold to-yellow-700 flex items-center justify-center text-black font-bold text-lg shrink-0">
                        {user.photo ? (
                            <>
                                <img 
                                    src={user.photo} 
                                    alt="User" 
                                    className="w-full h-full object-cover rounded-full" 
                                    referrerPolicy="no-referrer" 
                                    onError={(e)=>{e.target.style.display='none'; e.target.nextSibling.style.display='flex'}} 
                                />
                                <div className="hidden w-full h-full flex items-center justify-center">{getInitials(user.name)}</div>
                            </>
                        ) : getInitials(user.name)}
                    </div>
                    <div className="truncate">
                        <h3 className="font-bold text-slate-100 truncate w-32">{user.name}</h3>
                        <p className="text-xs text-accent-gold truncate">{user.role}</p>
                    </div>
                </div>
            )}
            
            {/* Collapse Toggle (Desktop) */}
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden md:flex p-1 text-slate-400 hover:text-white bg-white/5 rounded-md">
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            {/* Close (Mobile) */}
            <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white"><X size={24} /></button>
        </div>

        {/* Menu Items */}
        <nav className="p-2 space-y-2 mt-2">
            {!isCollapsed && <p className="text-xs text-slate-500 font-bold px-4 mb-2 uppercase tracking-wider">Menu</p>}
            {menuItems.map((item) => (
            <button
                key={item.id}
                onClick={() => { setMode(item.id); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                mode === item.id ? 'bg-accent-gold text-black shadow-lg font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : ''}
            >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
            </button>
            ))}
        </nav>

        {/* History Section (Hide if collapsed) */}
        {!isCollapsed && (
            <div className="flex-1 overflow-y-auto px-4 mt-4 scrollbar-hide">
                <p className="text-xs text-slate-500 font-bold px-4 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <History size={12} /> Recent Cases
                </p>
                <div className="space-y-1 pb-20">
                    {history.map((chat) => (
                        <button key={chat.id} onClick={() => { onLoadChat(chat); onClose(); }} className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg truncate transition-all flex items-center justify-between group">
                            <span className="truncate w-32">{chat.title || "Untitled Case"}</span>
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent-gold" />
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* Bottom Config */}
        <div className={`p-4 border-t border-white/10 ${!isCollapsed ? 'absolute bottom-0 w-full bg-black/20 backdrop-blur-md' : 'mt-auto'}`}>
            <button onClick={() => { onOpenSettings(); onClose(); }} className={`w-full flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-sm font-medium ${isCollapsed ? 'justify-center' : 'justify-center'}`}>
                <Settings size={16} /> {!isCollapsed && "Configure Profile"}
            </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;