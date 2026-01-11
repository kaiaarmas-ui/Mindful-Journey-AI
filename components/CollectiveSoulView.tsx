
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Globe, Sparkles, Heart, Share2, Info, Users, Search, Filter, MessageCircle, Crown } from 'lucide-react';
import { MembershipTier, CreationItem } from '../types';

interface CollectiveSoulViewProps {
  onBack: () => void;
  userTier: MembershipTier;
}

const DUMMY_CREATIONS: CreationItem[] = [
  { id: 'cs-1', type: 'image', url: 'https://images.unsplash.com/photo-1518005020251-58296d8fca17?q=80&w=800&auto=format&fit=crop', prompt: 'A field of neon lotuses floating in a void of peace.', timestamp: Date.now() - 100000, author: 'SatoriExplorer' },
  { id: 'cs-2', type: 'image', url: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=800&auto=format&fit=crop', prompt: 'The bridge between thought and silence, represented as a crystalline path.', timestamp: Date.now() - 500000, author: 'ZenMaster99' },
  { id: 'cs-3', type: 'reflection', prompt: 'Today I realized that my breath is the only anchor I will ever truly need in a digital storm.', timestamp: Date.now() - 900000, author: 'SilentPresence' },
  { id: 'cs-4', type: 'image', url: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=800&auto=format&fit=crop', prompt: 'A cinematic view of the collective consciousness as a golden ocean.', timestamp: Date.now() - 2000000, author: 'EchoSeeker' },
];

const CollectiveSoulView: React.FC<CollectiveSoulViewProps> = ({ onBack, userTier }) => {
  const [creations, setCreations] = useState<CreationItem[]>(DUMMY_CREATIONS);
  const [filter, setFilter] = useState<'all' | 'image' | 'reflection'>('all');
  const [search, setSearch] = useState('');

  const filtered = creations.filter(m => {
    const matchesFilter = filter === 'all' || m.type === filter;
    const matchesSearch = m.prompt.toLowerCase().includes(search.toLowerCase()) || (m.author?.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-full bg-[#0b0f1a] text-slate-300 overflow-y-auto selection:bg-indigo-500/20 custom-scrollbar">
      <div className="max-w-7xl mx-auto py-16 px-6 space-y-12 pb-40">
        
        {/* Header */}
        <header className="space-y-8 relative">
          <button 
            onClick={onBack}
            className="p-2.5 hover:bg-slate-800 rounded-full transition-all text-slate-400 hover:text-white border border-slate-800/50 mb-4 inline-flex"
            title="Back"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                <Globe size={12} /> The Collective Soul
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tighter leading-none">Shared Creations</h1>
              <p className="text-slate-500 font-medium">Anonymous echoes of presence from our global sanctuary.</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-3xl border border-slate-800">
               <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-indigo-400">
                  <Users size={24} />
               </div>
               <div>
                  <p className="text-xl font-bold text-white">4,281</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Present Minds</p>
               </div>
            </div>
          </div>
        </header>

        {/* Search & Filter Bar */}
        <div className="sticky top-0 z-30 py-4 bg-[#0b0f1a]/80 backdrop-blur-xl border-b border-slate-800/40 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search creations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
              />
           </div>
           <div className="flex items-center gap-2 bg-slate-900/60 p-1 rounded-xl">
              <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
              <FilterBtn active={filter === 'image'} onClick={() => setFilter('image')} label="Visuals" />
              <FilterBtn active={filter === 'reflection'} onClick={() => setFilter('reflection')} label="Reflections" />
           </div>
        </div>

        {/* Creation Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <AnimatePresence mode="popLayout">
             {filtered.map((item, idx) => (
               <motion.div
                 key={item.id}
                 layout
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="bg-slate-900/30 border border-slate-800/60 rounded-[40px] overflow-hidden group hover:border-indigo-500/30 transition-all shadow-xl flex flex-col h-full"
               >
                 {item.type === 'image' && item.url && (
                   <div className="aspect-square relative overflow-hidden">
                      <img src={item.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                      <div className="absolute top-4 right-4">
                         <div className="p-2 bg-black/40 backdrop-blur-md rounded-xl text-white/80 border border-white/10">
                            <Sparkles size={14} />
                         </div>
                      </div>
                   </div>
                 )}

                 <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                             <Crown size={10} /> {item.author || 'Anonymous'}
                          </div>
                          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString()}</span>
                       </div>
                       <p className={`text-slate-300 leading-relaxed italic ${item.type === 'reflection' ? 'text-xl font-serif py-4 border-l-2 border-indigo-500/30 pl-6' : 'text-sm font-light'}`}>
                         "{item.prompt}"
                       </p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                       <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-pink-500 transition-colors">
                             <Heart size={14} /> 24
                          </button>
                          <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-indigo-400 transition-colors">
                             <MessageCircle size={14} /> 2
                          </button>
                       </div>
                       <button className="p-2 text-slate-600 hover:text-white transition-colors">
                          <Share2 size={14} />
                       </button>
                    </div>
                 </div>
               </motion.div>
             ))}
           </AnimatePresence>
        </div>

        {/* Footer Insight */}
        <footer className="text-center pt-24 space-y-6 opacity-40">
           <div className="flex justify-center gap-4">
              <div className="w-12 h-px bg-slate-800 self-center" />
              <Sparkles className="text-indigo-400" size={24} />
              <div className="w-12 h-px bg-slate-800 self-center" />
           </div>
           <p className="text-xs text-slate-500 uppercase tracking-[0.4em] font-bold">You are one thread in a trillion.</p>
        </footer>
      </div>
    </div>
  );
};

const FilterBtn = ({ active, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
      active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
    }`}
  >
    {label}
  </button>
);

export default CollectiveSoulView;
