
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Leaf, 
  Lightbulb, 
  Heart, 
  RefreshCw,
  BookOpen,
  ArrowLeft,
  Globe,
  Loader2,
  ExternalLink,
  Volume2,
  Lock,
  Crown
} from 'lucide-react';
import { fetchGlobalWisdom, generateTTS, decode, decodeAudioData } from '../services/geminiService';

type MomentType = 'tip' | 'quote' | 'practice' | 'reflection';

interface MindfulMoment {
  id: string;
  type: MomentType;
  category: string;
  content: string;
  author?: string;
  icon: any;
  borderColor: string;
}

const initialMoments: MindfulMoment[] = [
  {
    id: '1',
    type: 'tip',
    category: 'Environment',
    content: 'Create a "mindful corner" in your home with a cushion, candle, or inspiring object.',
    icon: Lightbulb,
    borderColor: 'border-t-[#b0cc8a]'
  },
  {
    id: '2',
    type: 'quote',
    category: 'Presence',
    content: 'The present moment is the only time over which we have dominion.',
    author: 'Thích Nhất Hạnh',
    icon: Sparkles,
    borderColor: 'border-t-[#b0cc8a]'
  },
  {
    id: '3',
    type: 'tip',
    category: 'Focus',
    content: 'Try "single-tasking" instead of multitasking. Give your full attention to one thing at a time.',
    icon: Lightbulb,
    borderColor: 'border-t-sky-400'
  },
  {
    id: '4',
    type: 'quote',
    category: 'Choice',
    content: 'Between stimulus and response there is a space. In that space is our power to choose.',
    author: 'Viktor Frankl',
    icon: Sparkles,
    borderColor: 'border-t-[#b0cc8a]'
  },
  {
    id: '5',
    type: 'practice',
    category: 'Self-Compassion',
    content: 'Place your hand on your heart. Feel the gentle rhythm and send yourself kindness.',
    icon: Leaf,
    borderColor: 'border-t-sky-400'
  },
  {
    id: '6',
    type: 'reflection',
    category: 'Gratitude',
    content: 'What am I grateful for in this moment? Name three things, no matter how small.',
    icon: Heart,
    borderColor: 'border-t-pink-400'
  }
];

interface InspirationViewProps {
  onBack?: () => void;
  isMember?: boolean;
}

const InspirationView: React.FC<InspirationViewProps> = ({ onBack }) => {
  const [filter, setFilter] = useState<'all' | MomentType>('all');
  const [activeMoments, setActiveMoments] = useState(initialMoments);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [globalWisdom, setGlobalWisdom] = useState<{ text: string; links: any[] } | null>(null);
  const [isFetchingGlobal, setIsFetchingGlobal] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const filteredMoments = activeMoments.filter(m => filter === 'all' || m.type === filter);

  const speak = async (text: string, id: string) => {
    if (isSpeakingId === id) return;
    setIsSpeakingId(id);
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
      source.onended = () => setIsSpeakingId(null);
      source.start(0);
    } catch (e) {
      console.error(e);
      setIsSpeakingId(null);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setActiveMoments([...activeMoments].sort(() => Math.random() - 0.5));
      setIsRefreshing(false);
    }, 600);
  };

  const handleGlobalWisdom = async () => {
    setIsFetchingGlobal(true);
    try {
      const data = await fetchGlobalWisdom();
      setGlobalWisdom(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingGlobal(false);
    }
  };

  const handleLoadMore = () => {
    const more = initialMoments.map(m => ({ ...m, id: Math.random().toString() }));
    setActiveMoments([...activeMoments, ...more]);
  };

  return (
    <div className="flex flex-col h-full bg-[#111827] overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full p-8 md:p-16 space-y-12 pb-40">
        
        {/* Header Section */}
        <header className="flex flex-col items-center text-center space-y-6 relative">
          {onBack && (
            <button 
              onClick={onBack}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-800 rounded-full transition-all text-slate-400 hover:text-white"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} />
            Daily Inspiration
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-serif">Mindful Moments</h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed font-light">
              Bite-sized wisdom, quick practices, and gentle reminders for your mindfulness journey
            </p>
          </div>
        </header>

        {/* Global Pulse Section */}
        <section className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 rounded-[40px] p-8 md:p-10 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Globe size={28} className={isFetchingGlobal ? "animate-spin" : ""} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Global Wellness Pulse
                </h3>
                <p className="text-sm text-slate-500 font-medium">Real-time wisdom from the mindfulness community</p>
              </div>
            </div>
            <button 
              onClick={handleGlobalWisdom}
              disabled={isFetchingGlobal}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/10 active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
            >
              {isFetchingGlobal ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
              {globalWisdom ? 'Update Wisdom' : 'Connect to Global Wisdom'}
            </button>
          </div>

          <AnimatePresence>
            {globalWisdom && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6 pt-6 border-t border-slate-800/50"
              >
                <div className="text-slate-200 leading-relaxed font-serif text-lg whitespace-pre-wrap relative pr-12">
                  {globalWisdom.text}
                  <button 
                    onClick={() => speak(globalWisdom.text, 'global')}
                    className="absolute top-0 right-0 p-3 bg-slate-800 rounded-xl hover:text-indigo-400 transition-all shadow-xl"
                  >
                    <Volume2 size={20} className={isSpeakingId === 'global' ? 'animate-pulse' : ''} />
                  </button>
                </div>
                
                {globalWisdom.links.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Grounding Citations</p>
                    <div className="flex flex-wrap gap-2">
                      {globalWisdom.links.map((link, idx) => (
                        <a 
                          key={idx} 
                          href={link.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-indigo-400 hover:text-white transition-all flex items-center gap-2"
                        >
                          <ExternalLink size={12} />
                          {link.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Filter Tabs */}
        <div className="flex justify-center">
          <div className="flex flex-wrap justify-center items-center gap-3 bg-slate-800/20 p-2 rounded-2xl border border-slate-800/40">
            <FilterTab active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
            <FilterTab active={filter === 'quote'} onClick={() => setFilter('quote')} icon={BookOpen} label="Quotes" />
            <FilterTab active={filter === 'practice'} onClick={() => setFilter('practice')} icon={Leaf} label="Practices" />
            <FilterTab active={filter === 'tip'} onClick={() => setFilter('tip')} icon={Lightbulb} label="Tips" />
            <FilterTab active={filter === 'reflection'} onClick={() => setFilter('reflection')} icon={Heart} label="Reflections" />
            <div className="w-px h-6 bg-slate-700/50 mx-1 hidden md:block"></div>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-white transition-colors ${isRefreshing ? 'opacity-50' : ''}`}
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Feed Grid */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredMoments.map((moment) => (
              <motion.div
                key={moment.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-slate-800/20 border-l border-r border-b border-slate-800 border-t-4 ${moment.borderColor} rounded-3xl p-8 flex gap-6 group hover:bg-slate-800/30 transition-all relative`}
              >
                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-500 group-hover:text-slate-300 transition-colors border border-slate-700/50">
                  <moment.icon size={28} />
                </div>
                
                <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-900/60 border border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {moment.type}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider">
                        {moment.category}
                      </span>
                    </div>
                    <button 
                      onClick={() => speak(moment.content, moment.id)}
                      className={`p-2 bg-slate-800/50 rounded-lg hover:text-white transition-all opacity-0 group-hover:opacity-100 ${isSpeakingId === moment.id ? 'opacity-100 text-indigo-400' : 'text-slate-500'}`}
                    >
                      <Volume2 size={16} className={isSpeakingId === moment.id ? 'animate-pulse' : ''} />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-serif">
                      {moment.content}
                    </p>
                    {moment.author && (
                      <p className="text-slate-500 font-medium italic">— {moment.author}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More Button */}
        <div className="flex justify-center pt-8">
          <button 
            onClick={handleLoadMore}
            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors group"
          >
            Load More Moments
            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>

        {/* Footer Pro Tip */}
        <footer className="pt-12 pb-20">
          <div className="w-full py-5 px-8 rounded-2xl bg-[#b0cc8a]/5 border border-[#b0cc8a]/20 flex items-center justify-center gap-3 text-slate-400 text-sm font-medium">
            <Lightbulb size={18} className="text-[#b0cc8a]" />
            Pro Tip: Bookmark moments that resonate with you, or listen to them aloud for deeper absorption
          </div>
        </footer>
      </div>
    </div>
  );
};

const FilterTab: React.FC<{ active: boolean; onClick: () => void; icon?: any; label: string }> = ({ 
  active, 
  onClick, 
  icon: Icon, 
  label 
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
      active 
        ? 'bg-[#b0cc8a] text-slate-900 shadow-lg shadow-[#b0cc8a]/10' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
    }`}
  >
    {Icon && <Icon size={16} />}
    {label}
  </button>
);

export default InspirationView;
