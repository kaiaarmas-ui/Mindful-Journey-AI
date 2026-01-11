import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Sun, Heart, Clock, X, ArrowLeft, Loader2, ExternalLink, Beaker, Moon, Smartphone, Eye, Sparkles } from 'lucide-react';
import { searchWellnessResearch } from '../services/geminiService';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  duration: string;
  durationSec: number;
  category: string;
  icon: any;
  insight: string;
  buttonColor: string;
}

const recommendations: Recommendation[] = [
  { id: 'metta', title: 'Kindness Meditation', description: 'Be kind to yourself and others.', duration: '10 min', durationSec: 600, category: 'Heart', icon: Heart, insight: 'Improves mood', buttonColor: 'bg-pink-400 text-slate-900' },
  { id: 'detox', title: 'Phone Break', description: 'Stop scrolling and rest your eyes.', duration: '5 min', durationSec: 300, category: 'Eyes', icon: Smartphone, insight: 'Less brain fog', buttonColor: 'bg-sky-400 text-slate-900' },
  { id: 'rest', title: 'Deep Sleep Prep', description: 'Get ready for a good night rest.', duration: '15 min', durationSec: 900, category: 'Sleep', icon: Moon, insight: 'Restores energy', buttonColor: 'bg-purple-400 text-white' }
];

const RecommendationsView: React.FC<{ onBack?: () => void, onComplete?: () => void }> = ({ onBack, onComplete }) => {
  const [activePractice, setActivePractice] = useState<Recommendation | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [researchTopic, setResearchTopic] = useState('');
  const [researchResult, setResearchResult] = useState<{ text: string; links: any[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let timer: any;
    if (activePractice && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (activePractice && timeLeft === 0) {
      if (onComplete) onComplete();
    }
    return () => clearInterval(timer);
  }, [timeLeft, activePractice, onComplete]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchTopic.trim() || isSearching) return;
    setIsSearching(true);
    try {
      const data = await searchWellnessResearch(researchTopic);
      setResearchResult(data);
    } catch (e) { console.error(e); } finally { setIsSearching(false); }
  };

  return (
    <div className="flex flex-col h-full bg-main text-main overflow-y-auto pb-20 relative">
      <div className="max-w-7xl mx-auto w-full p-8 md:p-16 space-y-12">
        <header className="flex flex-col items-center text-center space-y-6 relative">
          {onBack && (
            <button onClick={onBack} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 hover:bg-sub rounded-full text-sub hover:text-main border border-main">
              <ArrowLeft size={24} />
            </button>
          )}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase">
            <Sparkles size={14} /> Guided Sessions
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif">Relaxing Practices</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <motion.div key={rec.id} className="bg-sub border border-main rounded-3xl p-8 flex flex-col space-y-6">
              <div className="w-12 h-12 bg-main rounded-xl flex items-center justify-center text-sub">
                <rec.icon size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">{rec.title}</h3>
                <p className="text-sub text-sm mt-2">{rec.description}</p>
              </div>
              <div className="flex gap-2 text-[10px] font-bold">
                <span className="px-3 py-1 rounded-full bg-indigo-600/10 text-indigo-500">{rec.duration}</span>
                <span className="px-3 py-1 rounded-full bg-main/50 text-sub">{rec.category}</span>
              </div>
              <button onClick={() => { setActivePractice(rec); setTimeLeft(rec.durationSec); }} className={`w-full py-3.5 rounded-xl font-bold ${rec.buttonColor}`}>Start</button>
            </motion.div>
          ))}
        </div>

        <section className="bg-sub border border-main rounded-[32px] p-8 space-y-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-600/10 flex items-center justify-center text-sky-500">
              <Beaker size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Search Wellness Facts</h2>
              <p className="text-sub">Find real science about your practice.</p>
            </div>
          </div>
          <form onSubmit={handleSearch} className="relative max-w-3xl">
            <input type="text" value={researchTopic} onChange={(e) => setResearchTopic(e.target.value)} placeholder="Search... e.g., 'Benefits of kindness'" className="w-full bg-main border border-main rounded-2xl py-5 px-8 text-main focus:outline-none focus:border-indigo-500 transition-all" />
            <button type="submit" disabled={!researchTopic.trim() || isSearching} className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-sky-600 text-white rounded-xl font-bold transition-all disabled:opacity-50">
              {isSearching ? <Loader2 size={18} className="animate-spin" /> : 'Search'}
            </button>
          </form>
          {researchResult && (
            <div className="p-8 bg-main/40 rounded-3xl border border-main space-y-6">
              <p className="text-main leading-relaxed font-serif text-lg italic">{researchResult.text}</p>
              {researchResult.links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {researchResult.links.map((link, idx) => (
                    <a key={idx} href={link.uri} target="_blank" className="px-4 py-2 bg-sub border border-main text-sky-500 rounded-xl text-xs flex items-center gap-2">
                      <ExternalLink size={12} /> {link.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {activePractice && (
          <div className="fixed inset-0 z-[100] bg-main/95 backdrop-blur-2xl flex items-center justify-center p-6">
            <button onClick={() => setActivePractice(null)} className="absolute top-10 right-10 p-4 rounded-full bg-sub text-sub hover:text-main"><X size={32} /></button>
            <div className="max-w-2xl w-full text-center space-y-12">
              <h2 className="text-5xl font-bold">{activePractice.title}</h2>
              <div className="text-[120px] font-bold tabular-nums">
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </div>
              {timeLeft === 0 && (
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-indigo-500">Session Done!</h3>
                  <button onClick={() => setActivePractice(null)} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-bold">Return</button>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecommendationsView;