import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import BootScreen from './components/BootScreen';
import SettingsModal from './components/Modals/SettingsModal';
import Login from './components/Login';
import GovServices from './components/GovServices';
<<<<<<< HEAD
import LegalTools from './components/LegalTools';
import LegalKavach from './components/LegalKavach';
import HomePage from './pages/HomePage';
=======
>>>>>>> f97b346bd5f1b09a3a00b62cec3353025a415131
import { useLegalAI } from './hooks/useLegalAI';
import { auth, provider, db } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Protected Route Wrapper
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Login Page Component
const LoginPage = ({ handleGoogleLogin }) => {
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
};

// Main App Layout for Protected Pages
const AppLayout = ({
  mode,
  setMode,
  messages,
  setMessages,
  handleSendMessage,
  loading,
  user,
  setIsSettingsOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleNyayPatra,
  setIsDocModalOpen,
}) => {
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
            <span className="font-legal font-bold text-accent-gold tracking-wider">
              NYAY SAHAYAK
            </span>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-accent-gold/50">
            {user.photo ? (
              <img src={user.photo} alt="User" referrerPolicy="no-referrer" />
            ) : (
              <div className="bg-slate-700 w-full h-full flex items-center justify-center text-xs">
                {user.name[0]}
              </div>
            )}
          </div>
        </div>

        {/* Route-based Content */}
        <Routes>
          <Route
            path="/chat"
            element={
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
            }
          />
          <Route path="/gov-services" element={<GovServices />} />
          <Route path="/legal-tools" element={<LegalTools />} />
          <Route path="/legal-kavach" element={<LegalKavach />} />
          <Route path="/report" element={
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
          } />
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  const [booted, setBooted] = useState(false);
  const [mode, setMode] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
      voiceAssistantEnabled: true
    };
  });

  const { generateLegalNotice } = useLegalAI(); // Removed generateRentAgreement
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

<<<<<<< HEAD
  const handleSendMessage = async (text, isKavach = false) => {
=======
  const handleSendMessage = async (text) => {
    // 1. Add User Message
>>>>>>> f97b346bd5f1b09a3a00b62cec3353025a415131
    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);

    if (mode === 'report') {
      setReportLoading(true);
      try {
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
      setIsStreaming(true);
      setMessages(prev => [...prev, { sender: 'ai', text: "" }]);
      let fullAiResponse = "";

      try {
<<<<<<< HEAD
        let bodyContent = { message: text, history: reportHistory };
        if (isKavach) {
          bodyContent.message = "EMERGENCY: " + text;
        }
=======
        let bodyContent = { message: text, history: reportHistory }; 
>>>>>>> f97b346bd5f1b09a3a00b62cec3353025a415131

        const response = await fetch("http://127.0.0.1:8000/stream-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyContent),
        });

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value, { stream: true });
          fullAiResponse += chunkValue;

          setMessages(prev => {
            const updated = [...prev];
            const lastMsgIndex = updated.length - 1;
            if (updated[lastMsgIndex].sender === 'ai') {
              updated[lastMsgIndex] = { ...updated[lastMsgIndex], text: fullAiResponse };
            }
            return updated;
          });
        }

<<<<<<< HEAD
        if (isKavach) {
          const u = new SpeechSynthesisUtterance(fullAiResponse);
          u.rate = 1.1;
          window.speechSynthesis.speak(u);
        }

=======
        // Save completed chat to Firebase
>>>>>>> f97b346bd5f1b09a3a00b62cec3353025a415131
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

  return (
    <Router>
      <Routes>
        {/* Public Route - Landing Page */}
        <Route path="/" element={<HomePage />} />

        {/* Login Page */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/chat" replace />
            ) : (
              <LoginPage handleGoogleLogin={handleGoogleLogin} />
            )
          }
        />

<<<<<<< HEAD
        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AppLayout
                mode={mode}
                setMode={setMode}
                messages={messages}
                setMessages={setMessages}
                handleSendMessage={handleSendMessage}
                loading={loading}
                user={user}
                setIsSettingsOpen={setIsSettingsOpen}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                handleNyayPatra={handleNyayPatra}
                setIsDocModalOpen={setIsDocModalOpen}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
=======
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

        {/* 🔥 UPDATED RENDER LOGIC: Kavach, Tools, Drafts Removed */}
        {mode === 'digital' ? (
          <GovServices />
        ) : (
          <ChatInterface
            messages={messages}
            setMessages={setMessages}
            onSendMessage={handleSendMessage}
            loading={loading}
            role={user.role}
            user={user}
            onNyayPatra={handleNyayPatra}
            // onDocGen removed
            mode={mode}
            voiceAssistantEnabled={user.voiceAssistantEnabled}
          />
        )}
      </main>
>>>>>>> f97b346bd5f1b09a3a00b62cec3353025a415131

      {/* Modals */}
      {isSettingsOpen && (
        <SettingsModal
          user={user}
          setUser={setUser}
          onClose={() => setIsSettingsOpen(false)}
          onLogout={handleLogout}
        />
      )}
<<<<<<< HEAD
      {isDocModalOpen && (
        <DocGenModal
          onGenerate={generateRentAgreement}
          onClose={() => setIsDocModalOpen(false)}
        />
      )}
    </Router>
=======
      {/* DocGenModal Removed */}
    </div>
>>>>>>> f97b346bd5f1b09a3a00b62cec3353025a415131
  );
}

export default App;