
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ArrowLeft, 
  Brain, 
  Palette, 
  Hash, 
  Star, 
  Moon, 
  Sun, 
  Heart, 
  Zap, 
  Target, 
  Smile, 
  Cloud, 
  BookOpen, 
  Pen, 
  Pencil, 
  Coffee, 
  Home, 
  Cat, 
  Rocket, 
  Wand2, 
  Loader2, 
  Baby, 
  Ghost, 
  Utensils, 
  Camera, 
  Bike, 
  Music, 
  Tent, 
  Gamepad2, 
  TreeDeciduous, 
  Flag, 
  Globe, 
  Telescope, 
  Shield, 
  Cpu, 
  ZapOff, 
  Flame, 
  Bird, 
  Waves, 
  Mountain, 
  Compass, 
  Anchor, 
  Atom, 
  Eye, 
  Sparkles, 
  RefreshCw, 
  Wind, 
  Map, 
  Car, 
  Pizza, 
  Building, 
  Laptop, 
  Microscope, 
  Gem, 
  Infinity as InfinityIcon,
  ChevronDown,
  X,
  Scan,
  Activity
} from 'lucide-react';
import { JournalTemplate } from '../types';

const CATEGORIES = [
  "ALL", 
  "SELF-DISCOVERY", 
  "CAREER", 
  "WELLNESS", 
  "CREATIVITY", 
  "INNER CALM", 
  "RELATIONSHIPS", 
  "SPIRITUALITY", 
  "PRODUCTIVITY", 
  "DEEP FOCUS"
];

const BASE_TEMPLATES: JournalTemplate[] = [
  { id: 'k1', title: 'My Super Pet', category: 'WELLNESS', mode: 'art', iconName: 'Cat', description: 'Draw a pet with a secret power.', prompt: 'If your pet could talk or fly, what would happen?' },
  { id: 'k2', title: 'Moon Base', category: 'CREATIVITY', iconName: 'Rocket', description: 'Life on another planet.', prompt: 'You live on the moon. What does your bedroom look like?' },
  { id: 'k3', title: 'The Candy Shop', category: 'CREATIVITY', mode: 'art', iconName: 'Smile', description: 'Design a store for sweets.', prompt: 'Draw a machine that makes giant chocolate bars.' },
  { id: 'k4', title: 'Dinosaur Picnic', category: 'WELLNESS', iconName: 'Baby', description: 'Eating lunch with a T-Rex.', prompt: 'What do you feed a dinosaur at a picnic?' },
  { id: 's1', title: 'Daily Check-in', category: 'SELF-DISCOVERY', iconName: 'Sun', description: 'How are you feeling right now?', prompt: 'Mood check: How is your energy? What is one goal for today?' },
  { id: 's2', title: 'Morning Coffee', category: 'PRODUCTIVITY', iconName: 'Coffee', description: 'Early morning brain dump.', prompt: 'What is the first thing you thought of today?' },
  { id: 'art1', title: 'Color My Mood', category: 'CREATIVITY', mode: 'art', iconName: 'Palette', description: 'Paint with your feelings.', prompt: 'Use colors to show how you feel right now.' },
  { id: 'art6', title: 'Future City', category: 'DEEP FOCUS', mode: 'art', iconName: 'Cpu', description: 'Visualize the year 3000.', prompt: 'Draw the skyline of a city with flying cars and neon lights.' },
  { id: 'stoic1', title: 'Dealing with Hard Times', category: 'INNER CALM', iconName: 'Shield', description: 'Prepare for future difficulties.', prompt: 'What is the hardest thing that could happen today? How would you handle it with a calm mind?' },
  { id: 'ns1', title: 'Finding Connections', category: 'DEEP FOCUS', iconName: 'Brain', description: 'Find the invisible links.', prompt: 'Write three unrelated things that happened today. Now find the hidden connection.' },
  { id: 'car1', title: 'The Next Milestone', category: 'CAREER', iconName: 'Flag', description: 'Strategic visioning.', prompt: 'What is the one task that, if completed, makes everything else easier or unnecessary?' }
];

const ICON_MAP: Record<string, any> = { 
  Brain, Palette, Hash, Star, Moon, Sun, Heart, Zap, Target, Smile, Cloud, BookOpen, Pen, Pencil, Coffee, Home, Cat, Rocket, Wand2, Baby, Ghost, Utensils, Camera, Bike, Music, Tent, Gamepad2, TreeDeciduous, Flag, Globe, Telescope, Shield, Cpu, ZapOff, Flame, Bird, Waves, Mountain, Compass, Anchor, Atom, Eye, Sparkles, RefreshCw, Wind, Map, Car, Pizza, Building, Laptop, Microscope, Gem, InfinityIcon
};

const JournalLibraryView: React.FC<{ onBack: () => void, onSelectTemplate: (t: JournalTemplate) => void }> = ({ onBack, onSelectTemplate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [isCreating, setIsCreating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [counter, setCounter] = useState(10240000000000);
  const scanTimeoutRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => prev + Math.floor(Math.random() * 1000000));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const triggerForge = (customTitle?: string) => {
    const title = customTitle || searchQuery || 'Untitled Journey';
    if (isCreating) return;
    
    setIsCreating(true);
    setTimeout(() => {
      const lower = title.toLowerCase();
      const isArtType = lower.includes('draw') || lower.includes('paint') || lower.includes('sketch') || lower.includes('visual') || lower.includes('blueprint') || lower.includes('color');

      const customTemplate: JournalTemplate = {
        id: `custom-${Date.now()}`,
        title: title.charAt(0).toUpperCase() + title.slice(1),
        category: 'DEEP FOCUS',
        description: `A unique journal path manifested from the neural matrix specifically for: "${title}".`,
        prompt: `Focusing on ${title}... how does this concept resonate with your current state of being?`,
        iconName: isArtType ? 'Palette' : 'Sparkles',
        mode: isArtType ? 'art' : 'free'
      };
      setIsCreating(false);
      onSelectTemplate(customTemplate);
      setSearchQuery('');
    }, 1500);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setIsScanning(true);
    if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
    
    scanTimeoutRef.current = setTimeout(() => {
      setIsScanning(false);
    }, 800);

    if (val.length > 0 && activeCategory !== 'ALL') {
      setActiveCategory('ALL');
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setActiveCategory('ALL');
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Simulate a neural refresh
    setCounter(prev => prev + 50000000);
  };

  const filtered = BASE_TEMPLATES.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'ALL' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div ref={containerRef} className="h-full bg-[#0b0f1a] text-slate-300 overflow-y-auto selection:bg-indigo-500/20 custom-scrollbar relative">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto py-20 px-6 space-y-16 relative z-10 pb-40">
        {/* Navigation Back */}
        <button 
          onClick={onBack} 
          className="absolute left-0 top-0 p-3 text-slate-500 hover:text-white transition-all"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Header Section: Discovery Engine */}
        <header className="flex flex-col items-center text-center space-y-8">
          <div className="relative">
             <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
             <div className="w-24 h-24 rounded-[32px] bg-slate-900 border border-indigo-500/20 flex items-center justify-center relative z-10">
                <InfinityIcon size={48} className="text-indigo-400" strokeWidth={1} />
             </div>
          </div>

          <div className="space-y-6 max-w-4xl">
             <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-500/5 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <Cpu size={12} /> Neural Synthesis Engine
             </div>
             
             <div className="space-y-2">
                <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none tabular-nums">
                  {counter.toLocaleString()}+
                </h1>
                <p className="text-3xl md:text-5xl text-indigo-400 font-serif italic tracking-tight flex items-center justify-center gap-4">
                  Journaling Pathways
                </p>
             </div>

             <div className="space-y-4">
               <div className="inline-block px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.4em] shadow-xl shadow-indigo-600/20">
                  Infinite Discovery Active
               </div>
               <p className="text-slate-400 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto font-light italic">
                 "Our system creates a unique path for every moment. This library never repeats."
               </p>
             </div>
          </div>
        </header>

        {/* Search & Infinite Forge Integration */}
        <div className="max-w-4xl mx-auto space-y-10">
           <div className="relative group">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-indigo-500/5 blur-xl group-focus-within:bg-indigo-500/10 transition-all rounded-3xl pointer-events-none" />
              
              {/* The Input */}
              <div className="relative z-20">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={24} />
                <input 
                  type="text" 
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search or describe a new path..."
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-3xl py-8 pl-16 pr-40 text-white text-2xl placeholder-slate-700 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all shadow-2xl font-light"
                />
                
                {/* Visual Feedback Line */}
                {isScanning && (
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 origin-left"
                  />
                )}
                
                <AnimatePresence>
                  {searchQuery.length > 0 && !isCreating && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearchQuery('')}
                      className="absolute right-32 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-white"
                    >
                      <X size={20} />
                    </motion.button>
                  )}
                  {searchQuery.length > 2 && (
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onClick={() => triggerForge()}
                      disabled={isCreating}
                      className="absolute right-4 top-1/2 -translate-y-1/2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-500 shadow-xl disabled:opacity-50 min-w-[140px] flex items-center justify-center gap-2"
                    >
                      {isCreating ? <Loader2 className="animate-spin" size={16} /> : <><Sparkles size={16}/> Forge</>}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Context Label */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-8 left-6 flex items-center gap-2 text-[9px] font-black text-indigo-400 uppercase tracking-widest"
                  >
                    <Activity size={10} className="animate-pulse" /> Scanning {counter.toLocaleString()} Neural Nodes...
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           {/* Filter Grid */}
           <div className="flex flex-wrap justify-center gap-3">
             {CATEGORIES.map(cat => (
               <button 
                key={cat} 
                onClick={() => { setActiveCategory(cat); if(cat !== 'ALL') setSearchQuery(''); }}
                className={`px-6 py-3 rounded-full text-[10px] font-black tracking-[0.1em] transition-all border ${
                  activeCategory === cat 
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                }`}
               >
                 {cat}
               </button>
             ))}
           </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
          <AnimatePresence mode="popLayout">
            {filtered.map((template) => {
              const Icon = ICON_MAP[template.iconName] || Pen;
              const isArt = template.mode === 'art';
              
              return (
                <motion.button 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={template.id} 
                  onClick={() => onSelectTemplate(template)} 
                  className="bg-slate-900/20 border border-slate-800 p-8 rounded-[40px] text-left hover:border-indigo-500/40 transition-all group flex flex-col justify-between shadow-sm min-h-[320px] hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden backdrop-blur-sm"
                >
                  {isArt && (
                    <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                        <Palette size={140} />
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isArt ? 'bg-pink-500/10 text-pink-500' : 'bg-slate-950 border border-slate-800 text-slate-500 group-hover:text-indigo-400'}`}>
                      <Icon size={28} />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-indigo-500 uppercase px-2.5 py-1 rounded-lg bg-indigo-500/5 border border-indigo-500/10">{template.category}</span>
                        {isArt && <span className="text-[9px] font-black text-pink-500 uppercase px-2.5 py-1 rounded-lg bg-pink-500/5 border border-pink-500/10">VISUAL MODE</span>}
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight text-white">{template.title}</h3>
                      <p className="text-slate-500 text-sm font-light leading-relaxed line-clamp-3">{template.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-indigo-400 font-bold text-[10px] uppercase tracking-widest">
                    <span>Initiate Journey</span>
                    <InfinityIcon className="group-hover:rotate-180 transition-transform duration-1000" size={16} />
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>

          {/* Dynamic Manifest Card - Adapts to empty states or general browsing */}
          <motion.button 
            layout
            onClick={() => triggerForge()}
            disabled={isCreating}
            className={`bg-indigo-600/10 border-2 border-dashed border-indigo-500/30 p-12 rounded-[40px] text-left flex flex-col justify-center items-center text-center space-y-8 min-h-[320px] relative overflow-hidden group shadow-2xl transition-all hover:border-indigo-500/60 ${isCreating ? 'cursor-wait' : ''} ${filtered.length === 0 ? 'md:col-span-2 lg:col-span-3 py-20' : ''}`}
          >
             <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/10 animate-pulse" />
             <AnimatePresence mode="wait">
               {isCreating ? (
                 <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Loader2 className="text-indigo-400 w-24 h-24 animate-spin" strokeWidth={1} />
                 </motion.div>
               ) : (
                 <motion.div key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                    <Wand2 className="text-indigo-400 w-24 h-24 group-hover:scale-110 transition-transform relative z-10" strokeWidth={1} />
                 </motion.div>
               )}
             </AnimatePresence>
             
             <div className="space-y-4 relative z-10 max-w-2xl">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                  {searchQuery ? `Manifest: "${searchQuery}"` : 'Neural Forge'}
                </h3>
                <p className="text-slate-400 text-lg font-light leading-relaxed">
                  {isCreating 
                    ? 'Synthesizing trillions of possibilities...' 
                    : searchQuery 
                      ? `We found no pre-set templates for "${searchQuery}". Tap here to have the engine manifest a completely unique journey based on your intent.`
                      : 'The library never ends. Tap here to manifest a completely random new path from our non-repeating matrix.'}
                </p>
                <div className="pt-4 flex justify-center">
                   <div className="inline-flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-3xl shadow-indigo-600/40 group-hover:bg-indigo-500 transition-all">
                      {isCreating ? 'Synthesizing...' : 'Engage Engine'}
                   </div>
                </div>
             </div>
          </motion.button>
        </div>

        {/* Functional Scroll Indicator / Reset Button */}
        <button 
          onClick={handleReset}
          className="w-full flex flex-col items-center pt-20 pb-10 space-y-4 opacity-40 hover:opacity-100 transition-opacity group"
        >
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 group-hover:text-indigo-400 transition-colors">Reset & Find New Paths</p>
           <div className="p-3 rounded-full border border-slate-800 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/5 transition-all">
              <ChevronDown size={24} className="animate-bounce" />
           </div>
        </button>
      </div>
    </div>
  );
};

export default JournalLibraryView;
