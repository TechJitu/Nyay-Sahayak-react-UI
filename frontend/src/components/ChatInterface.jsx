import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Mic, Terminal, FileText, ShieldAlert } from 'lucide-react';

const ChatInterface = ({ messages, onSendMessage, loading, role, onNyayPatra, onDocGen, mode }) => {
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  const getPlaceholder = () => {
    if (mode === 'draft') return "Describe the document to draft...";
    if (mode === 'report') return "Describe incident for FIR...";
    if (role === "Advocate") return "Adv. Enter citation or legal query...";
    if (role === "Student") return "Ask a doubt or request case summary...";
    return "Apni kanuni samasya batayein (Ask your query)...";
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 pb-48 scroll-smooth custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              relative max-w-[85%] p-5 border-l-2 rounded-sm shadow-lg backdrop-blur-sm animate-fade-in
              ${msg.sender === 'user' 
                ? 'bg-gradient-to-r from-accent-cyan/5 to-transparent border-accent-cyan text-right rounded-tr-none' 
                : 'bg-gradient-to-r from-accent-gold/5 to-transparent border-accent-gold rounded-tl-none'}
            `}>
              <span className={`text-[9px] font-mono opacity-60 block mb-2 tracking-widest ${msg.sender === 'user' ? 'text-accent-cyan' : 'text-accent-gold'}`}>
                {msg.sender === 'user' ? 'CITIZEN INPUT' : 'NYAY INTELLIGENCE'} // {new Date().toLocaleTimeString()}
              </span>
              <div className="prose prose-invert prose-sm font-light text-slate-200">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="p-4 border border-accent-gold/50 bg-black/40 text-accent-gold text-xs font-mono animate-pulse tracking-widest">
               PROCESSING NEURAL REQUEST...
             </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Console */}
      <div className="absolute bottom-0 w-full z-20 input-console p-4 md:p-6 bg-[#02040a]">
        <div className="max-w-5xl mx-auto flex items-end gap-3">
          {/* Tools */}
          <div className="flex gap-2">
             <button onClick={onDocGen} className="h-12 w-12 flex items-center justify-center rounded bg-slate-900 border border-slate-700 hover:border-accent-cyan hover:text-accent-cyan text-slate-400 transition" title="Rent Agreement">
                <FileText className="w-5 h-5" />
             </button>
             <button onClick={onNyayPatra} className="h-12 w-12 flex items-center justify-center rounded bg-red-900/20 border border-red-500/50 text-red-500 hover:bg-red-600 hover:text-white transition animate-pulse" title="Nyay Patra (Legal Notice)">
                <ShieldAlert className="w-5 h-5" />
             </button>
          </div>

          {/* Text Input */}
          <div className="flex-1 bg-slate-900 border border-slate-700 rounded flex items-center px-4 py-2 focus-within:border-accent-cyan transition shadow-inner">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              rows="1" 
              placeholder={getPlaceholder()}
              className="flex-1 bg-transparent text-white placeholder-slate-600 text-sm focus:outline-none resize-none font-mono custom-scrollbar"
            />
            <button className="ml-3 text-slate-500 hover:text-red-500 transition"><Mic className="w-5 h-5" /></button>
          </div>

          <button onClick={handleSend} className="h-12 px-6 bg-accent-gold text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-yellow-400 transition shadow-[0_0_15px_rgba(255,215,0,0.3)] flex items-center gap-2">
            RUN <Terminal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;