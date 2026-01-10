import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Paperclip, Volume2, VolumeX, User, Trash2 } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import VoiceAssistantButton from './VoiceAssistantButton';
import VoiceWaveform from './VoiceWaveform';

const ChatInterface = ({ messages, setMessages, onSendMessage, loading, role, user, onNyayPatra, onDocGen, mode, voiceAssistantEnabled = true }) => {
  const [input, setInput] = useState('');
  const [reportHistory, setReportHistory] = useState("");

  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Voice Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const [rightIndex, setRightIndex] = useState(0);
  const rights = [
    "Right to Information (RTI)",
    "Right to Equality",
    "Right to Education",
    "Right to Privacy",
    "Right Against Exploitation",
    "Right to Free Speech",
    "Right to Legal Aid"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRightIndex((prev) => (prev + 1) % rights.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const rolePrompts = {
    Citizen: [
      "How do I file a consumer complaint online?",
      "What are my tenant rights in India?",
      "How to get free legal aid?",
      "Steps to file RTI application"
    ],
    Advocate: [
      "Draft legal notice for cheque bounce",
      "Recent Supreme Court judgments on Section 138",
      "Civil procedure timeline for suit filing",
      "Bail application format and procedure"
    ],
    Police: [
      "FIR filing procedure step-by-step",
      "When is arrest warrant required?",
      "Evidence documentation guidelines",
      "Cognizable vs non-cognizable offenses"
    ],
    Student: [
      "Explain IPC Section 420 in detail",
      "Difference between bail and anticipatory bail",
      "Constitutional law fundamental rights overview",
      "Landmark cases on Article 21"
    ]
  };

  const roleQuickActions = {
    Citizen: [
      { label: "Check Case Status", query: "How can I check my case status online?" },
      { label: "File Complaint", query: "What is the process to file an online complaint?" }
    ],
    Advocate: [
      { label: "Draft Document", query: "Help me draft a legal document" },
      { label: "Case Law Search", query: "Find recent case laws on" }
    ],
    Police: [
      { label: "FIR Template", query: "Show me FIR filing template and format" },
      { label: "Evidence Rules", query: "What are the evidence documentation rules?" }
    ],
    Student: [
      { label: "Explain Concept", query: "Explain this legal concept in detail:" },
      { label: "Case Analysis", query: "Analyze this landmark case:" }
    ]
  };

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const bottomRef = useRef(null);
  const lastMessageCountRef = useRef(0);

  const handleVoiceCommand = (command) => {
    switch (command.type) {
      case 'stop': break;
      case 'clear':
        setMessages([]);
        setReportHistory('');
        break;
      case 'send':
      case 'query':
        if (command.text) {
          setInput(command.text);
          setTimeout(() => handleSend(command.text), 500);
        }
        break;
      default: break;
    }
  };

  const voiceAssistant = useVoiceAssistant(voiceAssistantEnabled, handleVoiceCommand);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isRecording]);

  useEffect(() => {
    const previousCount = lastMessageCountRef.current;
    const currentCount = messages.length;

    if (!voiceAssistantEnabled || currentCount <= previousCount || currentCount !== previousCount + 1) {
      lastMessageCountRef.current = currentCount;
      return;
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'ai' && lastMessage.text && !loading) {
      setTimeout(() => {
        speakText(lastMessage.text, true);
      }, 300);
    }
    lastMessageCountRef.current = currentCount;
  }, [messages, voiceAssistantEnabled, loading]);

  const speakText = (text, autoPlay = false) => {
    if (!window.speechSynthesis || isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    const languageMap = {
      'Hindi': ['hi-IN', 'Hindi', 'हिन्दी'],
      'Hinglish': ['en-IN', 'India', 'Indian'],
      'English': ['en-IN', 'en-US', 'en-GB', 'English'],
      'Marathi': ['mr-IN', 'Marathi', 'मराठी']
    };
    const searchTerms = languageMap[user?.language] || languageMap['Hinglish'];
    for (const term of searchTerms) {
      selectedVoice = voices.find(v => v.lang === term || v.lang.startsWith(term) || v.name.includes(term));
      if (selectedVoice) break;
    }
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.includes('IN') || v.name.includes('India')) || voices[0];
    }
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = (user?.language === 'Hindi' || user?.language === 'Marathi') ? 0.9 : 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      if (!prev) window.speechSynthesis.cancel();
      return !prev;
    });
  };

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setRecordingTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      startTimer();
    } catch (error) {
      alert("Microphone access denied! Please allow permission.");
    }
  };

  // STOP & SEND RECORDING
  const stopAndSendRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    stopTimer();
    setIsRecording(false);
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const audioFile = new File([audioBlob], "voice_note.wav", { type: "audio/wav" });

      setMessages(prev => [...prev, { sender: 'user', text: "Audio Sent (Processing...)" }]);

      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("history", reportHistory);
      try {
        const response = await fetch("http://127.0.0.1:8000/voice-message", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setMessages(prev => {
          const newMsgs = [...prev];
          if (newMsgs[newMsgs.length - 1].sender === 'user') {
            newMsgs[newMsgs.length - 1].text = "" + data.user_text;
          }
          return newMsgs;
        });
        setMessages(prev => [...prev, { sender: 'ai', text: data.answer }]);
        setReportHistory(prev => `${prev}\nUser: ${data.user_text}\nAI: ${data.answer}`);
        speakText(data.answer);
      } catch (error) {
        setMessages(prev => [...prev, { sender: 'ai', text: "Error processing voice note." }]);
      }
    };
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    stopTimer();
    setIsRecording(false);
  };

  // Normal Text Send
  const handleSend = async (textOverride) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    if (mode === 'report') {
      try {
        const response = await fetch("http://127.0.0.1:8000/file-report-interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_input: textToSend, history: reportHistory }),
        });
        const data = await response.json();
        setMessages(prev => [...prev, { sender: 'ai', text: data.answer }]);
        setReportHistory(prev => `${prev}\nUser: ${textToSend}\nAI: ${data.answer}`);
      } catch (error) {
        setMessages(prev => [...prev, { sender: 'ai', text: "Connection Error." }]);
      }
    } else {
      onSendMessage(textToSend);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent relative">

      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 border border-white/10 text-white hover:bg-white/10 transition-all shadow-lg backdrop-blur-md"
        title={isMuted ? "Unmute Voice" : "Mute Voice"}
      >
        {isMuted ? <VolumeX size={20} className="text-red-400" /> : <Volume2 size={20} className="text-accent-gold" />}
      </button>

      <div className="absolute top-0 left-0 right-0 z-10 flex justify-center p-2 pointer-events-none">
        {mode === 'report' ? (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-1 rounded-full text-[10px] md:text-xs font-bold backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse">
            FIR FILING MODE ACTIVATED
          </div>
        ) : (
          <div className="bg-accent-gold/10 border border-accent-gold/20 text-accent-gold px-4 py-1 rounded-full text-[10px] md:text-xs font-bold backdrop-blur-md">
            NYAY SAHAYAK ACTIVE
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide pt-12">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-90 mt-[-20px]">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-accent-gold/30 p-1 mb-6 shadow-[0_0_30px_rgba(255,215,0,0.2)]">
              {user?.photo ? (
                <img src={user.photo} alt="User" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center">
                  <User size={40} className="text-accent-gold" />
                </div>
              )}
            </div>

            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
              {greeting}, <span className="text-accent-gold">{user?.name?.split(' ')[0] || "Citizen"}</span>!
            </h2>


            <div className="mt-8 w-full max-w-2xl">
              <p className="text-sm text-slate-400 mb-3">Try asking:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(rolePrompts[user?.role] || rolePrompts.Citizen).map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(prompt);
                      handleSend(prompt);
                    }}
                    className="text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent-gold/50 transition-all text-sm text-slate-300 hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              {(roleQuickActions[user?.role] || roleQuickActions.Citizen).map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(action.query);
                    handleSend(action.query);
                  }}
                  className="px-4 py-2 rounded-lg bg-accent-gold/10 hover:bg-accent-gold/20 border border-accent-gold/30 hover:border-accent-gold text-accent-gold font-medium transition-all text-sm"
                >
                  {action.label}
                </button>
              ))}
            </div>

          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} group relative`}>
            {msg.sender === 'ai' && voiceAssistantEnabled && !isMuted && (
              <button
                onClick={() => speakText(msg.text)}
                className="absolute -left-8 top-2 p-1.5 rounded-full bg-white/5 hover:bg-accent-gold text-slate-400 hover:text-black opacity-0 group-hover:opacity-100 transition-all hidden md:block"
              >
                <Volume2 size={14} />
              </button>
            )}
            <div className={`max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-2xl backdrop-blur-md border shadow-lg text-sm md:text-base ${msg.sender === 'user'
              ? 'bg-gradient-to-br from-blue-600/40 to-purple-600/40 border-blue-400/30 text-white rounded-tr-none'
              : mode === 'report' ? 'bg-red-900/20 border-red-500/30 text-red-100 rounded-tl-none' : 'glass-panel border-white/10 text-slate-200 rounded-tl-none'
              }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && <div className="flex justify-start animate-pulse"><div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-xs text-slate-400">Thinking...</div></div>}
        <div ref={bottomRef} />
      </div>

      {/* Voice Assistant Waveform */}
      {voiceAssistantEnabled && (voiceAssistant.isListening || voiceAssistant.isProcessing) && (
        <div className="flex justify-center py-2 border-t border-white/5">
          <div className="flex flex-col items-center gap-2">
            <VoiceWaveform isActive={voiceAssistant.isListening} isProcessing={voiceAssistant.isProcessing} />
            <p className="text-xs text-slate-400">
              {voiceAssistant.isProcessing ? 'Processing...' : voiceAssistant.transcript || 'Say "Hey Sahayak"'}
            </p>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 md:p-4 glass-panel border-t border-white/10 shrink-0">
        <div className="flex items-end gap-2 max-w-5xl mx-auto">
          {voiceAssistantEnabled && voiceAssistant.isSupported && (
            <VoiceAssistantButton
              isListening={voiceAssistant.isListening}
              isProcessing={voiceAssistant.isProcessing}
              onClick={voiceAssistant.toggleListening}
              disabled={loading || isRecording}
            />
          )}

          <button className="hidden md:block p-3 hover:bg-white/10 rounded-full text-accent-gold transition-colors">
            <Paperclip size={20} />
          </button>

          <div className="flex-1 relative bg-black/40 border border-white/10 focus-within:border-accent-gold rounded-xl transition-all overflow-hidden">
            {isRecording ? (
              <div className="absolute inset-0 bg-red-900/90 flex items-center justify-between px-4 z-20 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-white font-mono font-bold tracking-widest">{formatTime(recordingTime)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-red-200 text-xs animate-pulse">Recording...</span>
                  <button onClick={cancelRecording} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ) : null}

            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={mode === 'report' ? "Type details..." : "Type query..."}
              className="w-full bg-transparent border-none rounded-xl py-3 pl-3 pr-10 text-slate-200 placeholder-slate-500 focus:ring-0 resize-none max-h-32 min-h-[48px]"
              style={{ paddingRight: '40px' }}
            />
          </div>

          {isRecording ? (
            <button onClick={stopAndSendRecording} className="p-3 rounded-xl shadow-[0_0_20px_red] bg-red-600 text-white font-bold h-[48px] w-[48px] flex items-center justify-center animate-pulse"><Send size={24} /></button>
          ) : (
            <button onClick={() => input.trim() ? handleSend() : startRecording()} className={`p-3 rounded-xl transition-all shadow-lg flex items-center justify-center shrink-0 ${mode === 'report' ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-accent-gold to-yellow-600'} text-black font-bold h-[48px] w-[48px]`}>
              {input.trim() ? <Send size={20} /> : <Mic size={24} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;