import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MembershipTier } from '../types';
import { chatWithGrounding, chatWithLite, chatWithPro, generateTTS, decode, decodeAudioData } from '../services/geminiService';
import { Send, Bot, User, Globe, Sparkles, ArrowLeft, Zap, Brain, Volume2, Loader2, Lock, Crown, Info, Database, Stars } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatViewProps {
  onBack?: () => void;
  isMember?: boolean;
  userTier?: MembershipTier;
  initialMode?: string;
  onViewChange?: (view: any) => void;
}

type CognitiveMode = 'fast' | 'grounded' | 'deep';

const ChatView: React.FC<ChatViewProps> = ({ onBack, isMember = false, userTier = 'seeker', initialMode, onViewChange }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('eternal_memory_vault');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [mode, setMode] = useState<CognitiveMode>(() => {
    if (initialMode === 'deep') return 'deep';
    if (initialMode === 'grounded') return 'grounded';
    return 'grounded';
  });

  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    localStorage.setItem('eternal_memory_vault', JSON.stringify(messages.slice(-20)));
  }, [messages]);

  const speakMessage = async (text: string, id: string) => {
    if (isSpeaking === id) return;
    setIsSpeaking(id);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      // Resolve Voice Preference
      const voiceId = localStorage.getItem('voice_pref') || 'Kore';
      let finalVoice = voiceId;
      if (voiceId.startsWith('custom-')) {
        const customVoices = JSON.parse(localStorage.getItem('custom_voices') || '[]');
        const persona = customVoices.find((v: any) => v.id === voiceId);
        if (persona) finalVoice = persona.baseVoice;
      }

      const base64 = await generateTTS(text, finalVoice);
      const buffer = await decodeAudioData(decode(base64), audioContextRef.current, 24000, 1);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsSpeaking(null);
      source.start(0);
    } catch (e) {
      console.error(e);
      setIsSpeaking(null);
    }
  };

  const handleModeChange = (newMode: CognitiveMode) => {
    setMode(newMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let result;
      if (mode === 'fast') {
        result = await chatWithLite(input);
      } else if (mode === 'deep') {
        result = await chatWithPro(input, true);
      } else {
        result = await chatWithGrounding(input);
      }

      const botMessage: ChatMessage = {
        role: 'model',
        content: result.text,
        groundingLinks: result.links
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: "I encountered a momentary ripple in the flow. Let's try reflecting on that again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-sub max-w-5xl mx-auto w-full border-x border-main relative">
      <div className="sticky top-0 inset-x-0 p-6 border-b border-main flex items-center justify-between bg-sub/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2.5 hover:bg-main rounded-full transition-all text-sub hover:text-main border border-main"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-main tracking-tight leading-none">
              Soul Guide
            </h2>
             <div className="flex items-center gap-1.5 text-[8px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">
                <Database size={8} /> Persistent Neural Memory Active
             </div>
          </div>
        </div>

        <div className="flex bg-main/60 p-1 rounded-xl border border-main shadow-lg">
          <ModeButton 
            active={mode === 'fast'} 
            onClick={() => handleModeChange('fast')} 
            icon={Zap} 
            label="Fast" 
          />
          <ModeButton 
            active={mode === 'grounded'} 
            onClick={() => handleModeChange('grounded')} 
            icon={Globe} 
            label="Insight" 
          />
          <ModeButton 
            active={mode === 'deep'} 
            onClick={() => handleModeChange('deep')} 
            icon={Brain} 
            label="Essence" 
          />
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth custom-scrollbar bg-main">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-10 py-16">
            <div className="w-24 h-24 rounded-[32px] bg-sub border border-main flex items-center justify-center text-indigo-500 shadow-3xl relative group">
              <Stars size={48} className="text-indigo-400 animate-pulse" />
            </div>
            <div className="space-y-4 max-w-lg mx-auto">
              <h3 className="text-2xl font-bold text-main tracking-tight">
                Continuing your journey...
              </h3>
              <p className="text-sub text-base leading-relaxed font-light italic">
                {mode === 'fast' ? "Using low-latency technology. Perfect for quick check-ins." : 
                 mode === 'grounded' ? "Utilizing real-time Search Grounding for evidence-based insights." : 
                 "Deep Thought mode active. Best for complex existential queries."}
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-[32px] p-8 border shadow-xl ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white border-transparent'
                : 'bg-sub/60 backdrop-blur-sm border-main text-main'
            }`}>
              <div className="flex items-center justify-between mb-4 opacity-40 uppercase tracking-[0.2em] text-[10px] font-black">
                <div className="flex items-center gap-2">
                  {msg.role === 'user' ? <User size={10}/> : <Bot size={10}/>}
                  {msg.role === 'user' ? 'Presence' : 'Soul Guide'}
                </div>
                {msg.role === 'model' && (
                  <button onClick={() => speakMessage(msg.content, idx.toString())} className="p-1.5 hover:bg-main rounded-lg transition-colors">
                    <Volume2 size={14} className={isSpeaking === idx.toString() ? 'text-indigo-400 animate-pulse' : ''} />
                  </button>
                )}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed font-light text-lg font-serif">{msg.content}</div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-sub/80 border border-main rounded-[28px] px-8 py-6 flex gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-main bg-sub/95 backdrop-blur-2xl sticky bottom-0 z-50">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Continue our conversation..."
            className="w-full bg-main border border-main rounded-full py-5 pl-8 pr-20 text-main placeholder-slate-600 focus:outline-none focus:border-indigo-500/40 transition-all font-light text-lg"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 transition-all text-white shadow-lg"
          >
            {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
          </button>
        </form>
      </div>
    </div>
  );
};

const ModeButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all relative ${
      active ? `bg-slate-800 text-white shadow-md` : 'text-sub hover:text-main'
    }`}
  >
    <Icon size={12} />
    <span>{label}</span>
  </button>
);

export default ChatView;