import React, { useEffect, useState, useRef } from 'react';
import { MessageSquare, Shield, Settings, History, ChevronRight, Globe, X, ChevronLeft, Plus, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const Sidebar = ({ mode, setMode, user, onOpenSettings, onLoadChat, isOpen, onClose }) => {
    const [history, setHistory] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [renameModal, setRenameModal] = useState({ open: false, chatId: null, currentTitle: '' });
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, chatId: null });
    const menuRef = useRef(null);

    const getInitials = (name) => {
        return name && name.length > 0 ? name.charAt(0).toUpperCase() : "U";
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    useEffect(() => {
        if (auth.currentUser) fetchHistory();
    }, [mode, user]);

    // Handle delete chat
    const handleDeleteChat = async (chatId) => {
        try {
            await deleteDoc(doc(db, "chats", chatId));
            setHistory(history.filter(chat => chat.id !== chatId));
            setDeleteConfirm({ open: false, chatId: null });
            setActiveMenu(null);
        } catch (error) {
            console.error("Error deleting chat:", error);
        }
    };

    // Handle rename chat
    const handleRenameChat = async () => {
        if (!renameModal.chatId || !renameModal.currentTitle.trim()) return;

        try {
            await updateDoc(doc(db, "chats", renameModal.chatId), {
                title: renameModal.currentTitle.trim()
            });
            setHistory(history.map(chat =>
                chat.id === renameModal.chatId
                    ? { ...chat, title: renameModal.currentTitle.trim() }
                    : chat
            ));
            setRenameModal({ open: false, chatId: null, currentTitle: '' });
            setActiveMenu(null);
        } catch (error) {
            console.error("Error renaming chat:", error);
        }
    };

    // Simplified menu items
    const menuItems = [
        { id: 'chat', label: 'Legal Assistant', icon: <MessageSquare size={20} /> },
        { id: 'report', label: 'File Report (FIR)', icon: <Shield size={20} /> },
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
                                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
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
                    <button
                        onClick={() => {
                            setMode('chat');
                            onLoadChat({ messages: [], mode: 'chat' });
                            onClose();
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-accent-gold hover:bg-yellow-400 text-black font-bold transition-all transform hover:scale-105 shadow-lg ${isCollapsed ? 'justify-center' : ''
                            }`}
                        title="New Chat"
                    >
                        <Plus size={20} className="shrink-0" />
                        {!isCollapsed && <span>New Chat</span>}
                    </button>

                    {!isCollapsed && <p className="text-xs text-slate-500 font-bold px-4 mt-4 mb-2 uppercase tracking-wider">Menu</p>}
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setMode(item.id); onClose(); }}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${mode === item.id ? 'bg-accent-gold text-black shadow-lg font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white'
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
                        <div className="space-y-1 pb-20" ref={menuRef}>
                            {history.map((chat) => (
                                <div key={chat.id} className="relative group">
                                    <button
                                        onClick={() => { onLoadChat(chat); onClose(); }}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg truncate transition-all flex items-center justify-between"
                                    >
                                        <span className="truncate w-28">{chat.title || "Untitled Case"}</span>
                                    </button>

                                    {/* 3-Dot Menu Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenu(activeMenu === chat.id ? null : chat.id);
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                                    >
                                        <MoreVertical size={16} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {activeMenu === chat.id && (
                                        <div className="absolute right-0 top-full mt-1 w-36 bg-gray-900 border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setRenameModal({ open: true, chatId: chat.id, currentTitle: chat.title || '' });
                                                    setActiveMenu(null);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                                            >
                                                <Pencil size={14} />
                                                <span>Rename</span>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteConfirm({ open: true, chatId: chat.id });
                                                    setActiveMenu(null);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
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

            {/* Rename Modal */}
            {renameModal.open && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">Rename Chat</h3>
                        <input
                            type="text"
                            value={renameModal.currentTitle}
                            onChange={(e) => setRenameModal({ ...renameModal, currentTitle: e.target.value })}
                            placeholder="Enter new name..."
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleRenameChat()}
                        />
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setRenameModal({ open: false, chatId: null, currentTitle: '' })}
                                className="flex-1 px-4 py-2 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRenameChat}
                                className="flex-1 px-4 py-2 rounded-xl bg-accent-gold text-black font-bold hover:bg-yellow-400 transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.open && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Delete Chat</h3>
                        </div>
                        <p className="text-slate-400 mb-6">Are you sure you want to delete this chat? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm({ open: false, chatId: null })}
                                className="flex-1 px-4 py-2 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteChat(deleteConfirm.chatId)}
                                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;