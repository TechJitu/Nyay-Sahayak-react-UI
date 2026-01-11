import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Volume2, VolumeX, User, Trash2, Copy, Check } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import VoiceAssistantButton from './VoiceAssistantButton';
import VoiceWaveform from './VoiceWaveform';
import API_BASE_URL from '../config/api';

const ChatInterface = ({ messages, setMessages, onSendMessage, loading, role, user, onNyayPatra, onDocGen, mode, voiceAssistantEnabled = true }) => {
  const [input, setInput] = useState('');
  const [reportHistory, setReportHistory] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Copy message to clipboard
  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  // Format message with markdown (convert **text** to bold)
  const formatMessage = (text) => {
    if (!text) return null;
    // Split by **bold** pattern
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove ** and wrap in bold
        return <strong key={i} className="font-semibold text-accent-gold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

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

  const handleVoiceCommand = (command) => {
    console.log('Voice Command Received:', command); // Debug log
    switch (command.type) {
      case 'stop': break;
      case 'clear':
        setMessages([]);
        setReportHistory('');
        break;
      case 'send':
      case 'query':
        if (command.text && command.text.trim()) {
          const queryText = command.text.trim();
          console.log('Processing voice query:', queryText); // Debug log
          setInput(queryText);
          // Immediately send the message
          handleSend(queryText);
        }
        break;
      default:
        // For any unrecognized command, treat as query
        if (command.text && command.text.trim()) {
          handleSend(command.text.trim());
        }
        break;
    }
  };

  const voiceAssistant = useVoiceAssistant(voiceAssistantEnabled, handleVoiceCommand);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isRecording]);

  // Track when AI finishes responding to speak the response
  const [wasLoading, setWasLoading] = useState(false);

  useEffect(() => {
    // Track loading state changes
    if (loading) {
      setWasLoading(true);
    }

    // When loading finishes and we have messages
    if (!loading && wasLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.sender === 'ai' && lastMessage.text && !isMuted && voiceAssistantEnabled) {
        console.log('AI finished, speaking response:', lastMessage.text.substring(0, 50) + '...');
        // Small delay to ensure response is complete
        setTimeout(() => {
          speakText(lastMessage.text, true);
        }, 500);
      }
      setWasLoading(false);
    }
  }, [loading, messages, voiceAssistantEnabled, isMuted]);

  const speakText = (text, autoPlay = false) => {
    if (!window.speechSynthesis || isMuted) {
      console.log('Speech synthesis not available or muted');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();

      console.log('Available voices:', voices.length);

      let selectedVoice = null;

      // Prioritize Indian voices
      if (voices.length > 0) {
        // Try to find Indian English voice first
        selectedVoice = voices.find(v => v.lang === 'en-IN');

        // Then try Hindi
        if (!selectedVoice) {
          selectedVoice = voices.find(v => v.lang === 'hi-IN');
        }

        // Then try any voice with India in name
        if (!selectedVoice) {
          selectedVoice = voices.find(v =>
            v.name.toLowerCase().includes('india') ||
            v.name.toLowerCase().includes('hindi') ||
            v.lang.includes('IN')
          );
        }

        // Fallback to first voice
        if (!selectedVoice) {
          selectedVoice = voices[0];
        }
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Speaking with voice:', selectedVoice.name, selectedVoice.lang);
      } else {
        console.log('Using default voice');
      }

      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => console.log('Speech started');
      utterance.onend = () => console.log('Speech ended');
      utterance.onerror = (e) => console.error('Speech error:', e);

      window.speechSynthesis.speak(utterance);
    };

    // Voices might not be loaded yet, wait for them
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      speak();
    } else {
      // Wait for voices to load
      window.speechSynthesis.onvoiceschanged = () => {
        speak();
      };
      // Fallback: try after a short delay
      setTimeout(speak, 100);
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      if (!prev) window.speechSynthesis.cancel();
      return !prev;
    });
  };

  // Load voices on component mount
  useEffect(() => {
    if (window.speechSynthesis) {
      // Trigger voice loading
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Voices loaded:', voices.length);
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
        const response = await fetch(`${API_BASE_URL}/voice-message`, {
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
        const response = await fetch(`${API_BASE_URL}/file-report-interview`, {
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
            <div className={`max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-2xl backdrop-blur-md border shadow-lg text-sm md:text-base relative ${msg.sender === 'user'
              ? 'bg-gradient-to-br from-blue-600/40 to-purple-600/40 border-blue-400/30 text-white rounded-tr-none'
              : mode === 'report' ? 'bg-red-900/20 border-red-500/30 text-red-100 rounded-tl-none' : 'glass-panel border-white/10 text-slate-200 rounded-tl-none'
              }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{formatMessage(msg.text)}</p>

              {/* Copy Button for AI messages */}
              {msg.sender === 'ai' && msg.text && (
                <button
                  onClick={() => copyToClipboard(msg.text, idx)}
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-white/5 hover:bg-accent-gold text-slate-400 hover:text-black opacity-0 group-hover:opacity-100 transition-all"
                  title="Copy to clipboard"
                >
                  {copiedIndex === idx ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              )}
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
          {/* Input Field with Send Button Inside */}
          <div className="flex-1 relative bg-black/40 border border-white/10 focus-within:border-accent-gold rounded-xl transition-all overflow-hidden">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={mode === 'report' ? "Type your complaint..." : "Type your legal query..."}
              className="w-full bg-transparent border-none rounded-xl py-3 pl-4 pr-12 text-slate-200 placeholder-slate-500 focus:ring-0 resize-none max-h-32 min-h-[48px]"
            />
            {/* Send Button Inside Input */}
            <button
              onClick={() => input.trim() && handleSend()}
              disabled={!input.trim()}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${input.trim() ? (mode === 'report' ? 'bg-red-500 hover:bg-red-600' : 'bg-accent-gold hover:bg-yellow-500') : 'bg-white/10'} text-black disabled:text-slate-500`}
            >
              <Send size={18} />
            </button>
          </div>

          {/* Voice Assistant Button */}
          {voiceAssistantEnabled && voiceAssistant.isSupported && (
            <VoiceAssistantButton
              isListening={voiceAssistant.isListening}
              isProcessing={voiceAssistant.isProcessing}
              onClick={voiceAssistant.toggleListening}
              disabled={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;