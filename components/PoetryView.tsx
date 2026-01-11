import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Feather, Loader2, RefreshCw, PenLine } from 'lucide-react';
import { generatePoem } from '../services/geminiService';

interface PoetryViewProps {
  onBack: () => void;
  onSave: (poem: string) => void;
}

const PoetryView: React.FC<PoetryViewProps> = ({ onBack, onSave }) => {
  const [theme, setTheme] = useState('');
  const [poem, setPoem] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!theme.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const result = await generatePoem(theme);
      setPoem(result);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  return (
    <div className="h-full bg-main text-main overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 pb-40">
        <header className="flex items-center justify-between border-b border-main pb-8">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-3 hover:bg-sub rounded-full transition-all text-sub hover:text-main border border-main">
              <ArrowLeft size={24} />
            </button>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-black uppercase tracking-widest mb-1">
                <Feather size={12} /> Verse Generation
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter">AI Poetry</h1>
            </div>
          </div>
        </header>

        <section className="bg-sub border border-main rounded-[48px] p-8 md:p-12 space-y-8 shadow-xl">
           <div className="space-y-4">
              <p className="text-sm font-bold text-sub uppercase px-4">What theme resonates with you?</p>
              <div className="relative">
                 <input 
                   type="text" 
                   value={theme}
                   onChange={(e) => setTheme(e.target.value)}
                   placeholder="e.g., Summer rain, First light, Silent forest..."
                   className="w-full bg-main border border-main rounded-3xl p-6 text-xl text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500/40 transition-all"
                 />
                 <button 
                   onClick={handleGenerate}
                   disabled={!theme.trim() || isLoading}
                   className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all disabled:opacity-30"
                 >
                   {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Generate'}
                 </button>
              </div>
           </div>

           <AnimatePresence>
              {poem && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pt-10 border-t border-main">
                   <div className="p-10 bg-main/40 rounded-[40px] border border-main relative group">
                      <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Sparkles size={80} />
                      </div>
                      <pre className="whitespace-pre-wrap font-serif text-2xl leading-relaxed text-slate-200 text-center italic">
                        {poem}
                      </pre>
                   </div>
                   <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button onClick={handleGenerate} className="flex items-center justify-center gap-2 px-8 py-4 bg-sub border border-main rounded-2xl text-sub font-bold hover:text-white transition-all">
                         <RefreshCw size={18} /> New Version
                      </button>
                      <button onClick={() => onSave(poem)} className="flex items-center justify-center gap-2 px-12 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all">
                         <PenLine size={18} /> Add to Journal
                      </button>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

export default PoetryView;