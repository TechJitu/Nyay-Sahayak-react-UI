import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import BootScreen from './components/BootScreen';
import SettingsModal from './components/Modals/SettingsModal';
import DocGenModal from './components/Modals/DocGenModal';
import Login from './components/Login';
import GovServices from './components/GovServices';
import LegalTools from './components/LegalTools';
import LegalKavach from './components/LegalKavach';
import { useLegalAI } from './hooks/useLegalAI';
import { auth, provider, db } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

function App() {
  const [booted, setBooted] = useState(false);
  const [mode, setMode] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Police Report State
  const [reportHistory, setReportHistory] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  const [isStreaming, setIsStreaming] = useState(false);

  // User State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nyay_user');
    return saved ? JSON.parse(saved) : {
      name: "User",
      email: "",
      photo: "",
      role: "Citizen",
      language: "Hinglish",
      detailLevel: "Detailed",
      state: "India (General)",
      voiceAssistantEnabled: true  // Enable voice assistant by default
    };
  });

  const { generateLegalNotice, generateRentAgreement } = useLegalAI();
  const loading = reportLoading || isStreaming;

  useEffect(() => {
    localStorage.setItem('nyay_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true);
        setUser(prev => ({
          ...prev,
          name: currentUser.displayName || prev.name,
          email: currentUser.email,
          photo: currentUser.photoURL
        }));
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login Failed: " + error.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setIsAuthenticated(false);
  };

  // ⚡ UPDATED: Handle Send Message with Streaming & Report Logic
  const handleSendMessage = async (text, isKavach = false) => {
    // 1. Add User Message
    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);

    // Check Mode
    if (mode === 'report') {
      // --- POLICE REPORT MODE (Text Input) ---
      setReportLoading(true);
      try {
        // We use file-report-interview for text inputs
        const response = await fetch("http://127.0.0.1:8000/file-report-interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_input: text,
            history: reportHistory
          }),
        });

        const data = await response.json();
        const aiText = data.answer;

        setReportHistory(prev => `${prev}\nUser: ${text}\nAI: ${aiText}`);
        const finalMsgs = [...newMessages, { sender: 'ai', text: aiText }];
        setMessages(finalMsgs);
        saveChatToFirebase(finalMsgs);

      } catch (error) {
        setMessages(prev => [...prev, { sender: 'ai', text: "⚠️ Connection Error: Police Station server is down." }]);
      }
      setReportLoading(false);
    }
    else {
      // --- LIVE STREAMING CHAT MODE (Groq Llama-3) ---
      setIsStreaming(true);

      // Add Placeholder AI Message
      setMessages(prev => [...prev, { sender: 'ai', text: "" }]);
      let fullAiResponse = "";

      try {
        let bodyContent = { message: text, history: reportHistory }; // Reusing reportHistory as generic context
        if (isKavach) {
          bodyContent.message = "EMERGENCY: " + text;
        }

        const response = await fetch("http://127.0.0.1:8000/stream-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyContent),
        });

        if (!response.body) throw new Error("No response body");

        // ⚡ Initialize Reader for Streaming
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value, { stream: true });
          fullAiResponse += chunkValue;

          // Live Update UI
          setMessages(prev => {
            const updated = [...prev];
            const lastMsgIndex = updated.length - 1;
            // Ensure we are updating the AI message
            if (updated[lastMsgIndex].sender === 'ai') {
              updated[lastMsgIndex] = { ...updated[lastMsgIndex], text: fullAiResponse };
            }
            return updated;
          });
        }

        // Speak response if in Kavach Mode
        if (isKavach) {
          const u = new SpeechSynthesisUtterance(fullAiResponse);
          u.rate = 1.1;
          window.speechSynthesis.speak(u);
        }

        // Save completed chat to Firebase
        saveChatToFirebase([...newMessages, { sender: 'ai', text: fullAiResponse }]);

      } catch (error) {
        console.error("Stream Error:", error);
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = "⚠️ Connection lost. Please try again.";
          return updated;
        });
      }
      setIsStreaming(false);
    }
  };

  const saveChatToFirebase = async (finalMsgs) => {
    if (auth.currentUser) {
      const today = new Date().toISOString().split('T')[0];
      const chatId = `chat_${auth.currentUser.uid}_${today}`;

      try {
        await setDoc(doc(db, "chats", chatId), {
          userId: auth.currentUser.email,
          title: finalMsgs[0]?.text.substring(0, 30) + "..." || "Ongoing Case",
          messages: finalMsgs,
          timestamp: serverTimestamp(),
          mode: mode
        }, { merge: true });
      } catch (e) {
        console.error("Error saving chat:", e);
      }
    }
  };

  const handleNyayPatra = async () => {
    const input = prompt("Speak/Type your complaint for Legal Notice:");
    if (!input) return;
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

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen bg-bg-deep items-center justify-center text-slate-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-accent-gold mb-8">NYAY SAHAYAK</h1>
          <Login />
          <button
            onClick={handleGoogleLogin}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white font-bold transition-all"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bg-deep text-slate-200 font-body overflow-hidden selection:bg-accent-gold selection:text-black">
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(0,242,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <Sidebar
        mode={mode}
        setMode={(newMode) => {
          setMode(newMode);
          if (newMode !== mode) setMessages([]);
        }}
        user={user}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLoadChat={(chat) => {
          setMessages(chat.messages || []);
          setMode(chat.mode || 'chat');
        }}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 relative flex flex-col h-full z-10 w-full">

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 glass-panel border-b border-white/10 sticky top-0 z-20 bg-bg-deep/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-accent-gold hover:bg-white/10 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <span className="font-legal font-bold text-accent-gold tracking-wider">NYAY SAHAYAK</span>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-accent-gold/50">
            {user.photo ? <img src={user.photo} alt="User" referrerPolicy="no-referrer" /> : <div className="bg-slate-700 w-full h-full flex items-center justify-center text-xs">{user.name[0]}</div>}
          </div>
        </div>

        {/* 🔥 UPDATED RENDER LOGIC: Include all Features */}
        {mode === 'digital' ? (
          <GovServices />
        ) : mode === 'tools' ? (
          <LegalTools />
        ) : mode === 'kavach' ? (
          <LegalKavach />
        ) : (
          <ChatInterface
            messages={messages}
            setMessages={setMessages}
            onSendMessage={handleSendMessage}
            loading={loading}
            role={user.role}
            user={user}
            onNyayPatra={handleNyayPatra}
            onDocGen={() => setIsDocModalOpen(true)}
            mode={mode}
            voiceAssistantEnabled={user.voiceAssistantEnabled}
          />
        )}
      </main>

      {isSettingsOpen && (
        <SettingsModal
          user={user}
          setUser={setUser}
          onClose={() => setIsSettingsOpen(false)}
          onLogout={handleLogout}
        />
      )}
      {isDocModalOpen && <DocGenModal onGenerate={generateRentAgreement} onClose={() => setIsDocModalOpen(false)} />}
    </div>
  );
}

export default App;