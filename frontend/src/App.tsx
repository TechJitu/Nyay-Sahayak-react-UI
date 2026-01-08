import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import AdvocateDashboard from './components/AdvocateDashboard';
import BootScreen from './components/BootScreen';
import SettingsModal from './components/Modals/SettingsModal';
import DocGenModal from './components/Modals/DocGenModal';
import { useLegalAI } from './hooks/useLegalAI';

function App() {
  const [booted, setBooted] = useState(false);
  const [mode, setMode] = useState('chat'); // 'chat', 'advocate', 'draft', 'report'
  const [messages, setMessages] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  
  // User Settings State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nyay_user');
    return saved ? JSON.parse(saved) : {
      name: "User",
      role: "Citizen",
      language: "Hinglish",
      detailLevel: "Detailed",
      state: "India (General)"
    };
  });

  const { sendMessage, generateLegalNotice, generateRentAgreement, loading } = useLegalAI();

  // Save user settings on change
  useEffect(() => {
    localStorage.setItem('nyay_user', JSON.stringify(user));
  }, [user]);

  const handleSendMessage = async (text) => {
    // Optimistic UI Update
    setMessages(prev => [...prev, { sender: 'user', text }]);
    
    // Call API with context
    const response = await sendMessage(text, user);
    
    let aiText = response.answer;
    if(response.status === 'warning') aiText = `🚨 SOS ALERT: ${aiText}`;
    
    setMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
  };

  const handleNyayPatra = async () => {
    const input = prompt("Speak or type your complaint for Legal Notice:");
    if(!input) return;
    setMessages(prev => [...prev, { sender: 'user', text: `⚖️ DRAFTING NOTICE FOR: ${input}` }]);
    
    try {
      const blob = await generateLegalNotice(input);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "Legal_Notice.pdf";
      a.click();
      setMessages(prev => [...prev, { sender: 'ai', text: "✅ Legal Notice Generated & Downloaded." }]);
    } catch (e) {
      setMessages(prev => [...prev, { sender: 'ai', text: "❌ Failed to generate notice." }]);
    }
  };

  if (!booted) return <BootScreen onComplete={() => setBooted(true)} />;

  return (
    <div className="flex h-screen bg-bg-deep text-slate-200 font-body overflow-hidden selection:bg-accent-gold selection:text-black">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(0,242,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <Sidebar 
        mode={mode} 
        setMode={setMode} 
        user={user}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 relative flex flex-col h-full z-10">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 glass-panel border-b border-white/10">
            <span className="font-legal font-bold text-accent-gold">NYAY SAHAYAK</span>
            <button onClick={() => setIsSettingsOpen(true)} className="text-slate-400">Settings</button>
        </div>
        
        {mode === 'chat' || mode === 'draft' || mode === 'report' ? (
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            loading={loading}
            role={user.role}
            onNyayPatra={handleNyayPatra}
            onDocGen={() => setIsDocModalOpen(true)}
            mode={mode}
          />
        ) : (
          <AdvocateDashboard />
        )}
      </main>

      {/* Modals */}
      {isSettingsOpen && (
        <SettingsModal 
          user={user} 
          setUser={setUser} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}
      
      {isDocModalOpen && (
        <DocGenModal 
          onGenerate={generateRentAgreement}
          onClose={() => setIsDocModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;