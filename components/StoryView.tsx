import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Loader2, RefreshCw, BookmarkPlus, Compass } from 'lucide-react';
import { generateStory } from '../services/geminiService';

interface StoryViewProps {
  onBack: () => void;
  onSave: (story: string) => void;
}

const StoryView: React.FC<StoryViewProps> = ({ onBack, onSave }) => {
  const [setting, setSetting] = useState('');
  const [vibe, setVibe] = useState('Peaceful');
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!setting.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const result = await generateStory(setting, vibe);
      setStory(result);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  return (
    <div className="h-full bg-main text-main overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto py-12 px-6 space-y-12 pb-40">
        <header className="flex items-center justify-between border-b border-main pb-8">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-3 hover:bg-sub rounded-full transition-all text-sub hover:text-main border border-main">
              <ArrowLeft size={24} />
            </button>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-1">
                <Compass size={12} /> Narrative Synthesis
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter">AI Stories</h1>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-sub border border-main rounded-[32px] p-8 space-y-6 shadow-lg">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sub uppercase tracking-widest px-2">The Setting</label>
                    <textarea 
                      value={setting}
                      onChange={(e) => setSetting(e.target.value)}
                      placeholder="e.g., A library on the moon, a house in a giant pumpkin..."
                      className="w-full bg-main border border-main rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500/40 min-h-[100px] resize-none transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sub uppercase tracking-widest px-2">The Vibe</label>
                    <select 
                      value={vibe}
                      onChange={(e) => setVibe(e.target.value)}
                      className="w-full bg-main border border-main rounded-2xl p-4 text-sm text-white appearance-none"
                    >
                       <option>Peaceful</option>
                       <option>Ethereal</option>
                       <option>Melancholic</option>
                       <option>Inspiring</option>
                    </select>
                 </div>
                 <button 
                   onClick={handleGenerate}
                   disabled={!setting.trim() || isLoading}
                   className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                 >
                   {isLoading ? <Loader2 size={18} className="animate-spin" /> : <BookOpen size={18} />}
                   Manifest Tale
                 </button>
              </div>
           </div>

           <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                 {story ? (
                   <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                      <div className="bg-sub border border-main rounded-[48px] p-10 md:p-14 shadow-2xl relative">
                         <div className="prose prose-invert max-w-none">
                            <p className="font-serif text-xl leading-relaxed text-slate-300 whitespace-pre-wrap italic">
                               {story}
                            </p>
                         </div>
                      </div>
                      <div className="flex justify-center gap-4">
                         <button onClick={handleGenerate} className="flex items-center gap-2 px-6 py-3 bg-sub border border-main rounded-xl text-sub font-bold hover:text-white transition-all">
                            <RefreshCw size={18} /> Rewrite
                         </button>
                         <button onClick={() => onSave(story)} className="flex items-center gap-2 px-10 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-xl hover:bg-emerald-500 transition-all">
                            <BookmarkPlus size={18} /> Store in Journal
                         </button>
                      </div>
                   </motion.div>
                 ) : (
                   <div className="h-[400px] bg-sub/40 border border-dashed border-main rounded-[48px] flex flex-col items-center justify-center text-center p-12 space-y-4">
                      <Compass size={48} className="text-slate-700" />
                      <p className="text-sub font-serif italic text-lg">Define a setting to begin your journey into a peaceful world.</p>
                   </div>
                 )}
              </AnimatePresence>
           </div>
        </section>
      </div>
    </div>
  );
};

export default StoryView;