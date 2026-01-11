import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Palette, 
  Maximize2, 
  Minimize2, 
  CheckCircle2,
  Sparkles,
  Loader2,
  ChevronDown,
  Quote,
  Heading1,
  Heading2,
  Minus,
  Brain,
  History,
  Info,
  Image as ImageIcon,
  Upload,
  PenTool
} from 'lucide-react';
import { JournalMode, Reflection } from '../types';
import DotToDotCanvas from './DotToDotCanvas';
import ArtCanvas from './ArtCanvas';
import { generateJournalInsight } from '../services/geminiService';

interface JournalViewProps {
  onBack?: () => void;
  initialMode?: string;
  initialPrompt?: string;
  isMember?: boolean;
  onComplete?: () => void;
}

const THEMES = [
  { id: 'sage-sky', name: 'Sage', color: '#9dc08b' },
  { id: 'lavender-dreams', name: 'Lavender', color: '#b39ddb' },
  { id: 'forest-retreat', name: 'Forest', color: '#689f38' },
  { id: 'warm-sunset', name: 'Sunset', color: '#ff8a65' },
  { id: 'ocean-depths', name: 'Ocean', color: '#0ea5e9' },
  { id: 'light', name: 'Cloud', color: '#4f46e5' },
];

const JournalView: React.FC<JournalViewProps> = ({ onBack, initialMode, initialPrompt, isMember = false, onComplete }) => {
  const [title, setTitle] = useState('');
  const [reflection, setReflection] = useState('');
  const [mode, setMode] = useState<JournalMode>((initialMode as any) || 'free');
  const [history, setHistory] = useState<Reflection[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('theme_pref') || 'sage-sky');
  const [isDotToDotFinished, setIsDotToDotFinished] = useState(false);
  const [soulEcho, setSoulEcho] = useState<string | null>(null);
  
  // Art Mode State
  const [artType, setArtType] = useState<'draw' | 'upload'>('draw');
  const [visualAsset, setVisualAsset] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('mindful_journal');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleSave = async () => {
    const contentToSave = mode === 'dot-to-dot' ? (reflection || `Completed ${initialPrompt} connection ritual.`) : reflection;
    
    if (!contentToSave.trim() && !title.trim() && !visualAsset) return;
    setIsSaving(true);
    setSoulEcho(null);
    
    try {
      // 1. Generate AI Reflection
      const insight = await generateJournalInsight(contentToSave || title || (mode === 'art' ? 'Visual reflection' : 'Untitled'));
      
      // 2. Persist Locally
      const newReflection: Reflection = { 
        id: Date.now().toString(), 
        content: contentToSave, 
        prompt: title || initialPrompt || 'Untitled Reflection', 
        mode, 
        timestamp: Date.now(),
        visualAsset: visualAsset || undefined
      };
      
      const updatedHistory = [newReflection, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('mindful_journal', JSON.stringify(updatedHistory));
      
      // 3. UI Updates
      setSoulEcho(insight);
      setIsSaving(false); 
      setIsSaved(true);
      if (onComplete) onComplete();
      
      // Keep "Stored" state for a moment
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Save failed:", error);
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVisualAsset(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);
    const newText = `${beforeText}${prefix}${selectedText}${suffix}${afterText}`;
    setReflection(newText);
    
    // Focus back and adjust cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const changeTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem('theme_pref', themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    setShowThemePicker(false);
  };

  const wordCount = reflection.trim() === '' ? 0 : reflection.trim().split(/\s+/).length;
  const charCount = reflection.length;

  const isStoreDisabled = () => {
    if (isSaving) return true;
    if (mode === 'dot-to-dot') return !isDotToDotFinished;
    if (mode === 'art') return !visualAsset && !reflection.trim() && !title.trim();
    return !reflection.trim() && !title.trim();
  };

  return (
    <div className={`h-full bg-main text-slate-300 overflow-hidden flex flex-col transition-all duration-700 ${zenMode ? 'fixed inset-0 z-[200] bg-[#020617]' : ''}`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 bg-[#0f172a]/90 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4 flex items-center justify-between transition-opacity ${zenMode ? 'opacity-40 hover:opacity-100' : ''}`}>
        <div className="flex items-center gap-4">
          {onBack && !zenMode && (
            <button onClick={onBack} className="p-2.5 hover:bg-slate-800 rounded-full transition-all text-slate-400 hover:text-white border border-slate-800/50">
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight leading-tight">
               {mode === 'dot-to-dot' ? 'Neural Connector' : mode === 'gratitude' ? '365 Gratitude' : mode === 'five-minute' ? 'Five Minute Focus' : mode === 'art' ? 'Art Journal' : 'Mindful Reflection'}
            </h2>
            {initialPrompt && mode !== 'dot-to-dot' && <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Template Active</p>}
            {mode === 'dot-to-dot' && <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Pattern: {initialPrompt}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="p-2.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-indigo-400 transition-all flex items-center gap-2 border border-slate-800/50"
            >
              <Palette size={18} />
              <ChevronDown size={12} className={`transition-transform ${showThemePicker ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showThemePicker && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-48 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-3xl z-[100]"
                >
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-3 py-2">Atmosphere</p>
                  <div className="grid grid-cols-1 gap-1">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => changeTheme(t.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${currentTheme === t.id ? 'bg-indigo-600/10 text-indigo-400' : 'hover:bg-slate-800 text-slate-400'}`}
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                        <span className="text-xs font-bold">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => setZenMode(!zenMode)} className={`p-2.5 hover:bg-slate-800 rounded-xl transition-all ${zenMode ? 'text-indigo-400 bg-indigo-400/10' : 'text-slate-500'}`}>
            {zenMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>

          <button 
            onClick={handleSave} 
            disabled={isStoreDisabled()} 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs transition-all shadow-lg active:scale-95 disabled:opacity-30 ${
              isSaved ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : isSaved ? <CheckCircle2 size={16} /> : <Save size={16} />}
            <span>{isSaving ? 'Storing...' : isSaved ? 'Stored' : 'Store (+25 XP)'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center pb-24 bg-main">
        <div className={`max-w-4xl w-full px-6 py-12 space-y-12 transition-all duration-700 ${zenMode ? 'max-w-5xl' : ''}`}>
          
          <AnimatePresence>
            {soulEcho && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-500/5 border border-indigo-500/20 rounded-[32px] p-8 space-y-3 relative overflow-hidden group shadow-2xl"
              >
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                   <Brain size={120} />
                </div>
                <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                   <Sparkles size={14} className="animate-pulse" /> Soul Echo
                </div>
                <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-serif italic relative z-10">
                  "{soulEcho}"
                </p>
                <button onClick={() => setSoulEcho(null)} className="text-[10px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest pt-2">
                  Dismiss reflection
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {mode === 'dot-to-dot' ? (
            <div className="space-y-8">
              <header className="text-center space-y-3">
                 <h3 className="text-2xl font-bold text-white tracking-tight">Connect the nodes.</h3>
                 <p className="text-slate-500 text-sm italic">Follow the numbers to manifest the form hidden within the void.</p>
              </header>
              <DotToDotCanvas 
                patternType={initialPrompt || 'Mountain'} 
                onComplete={() => setIsDotToDotFinished(true)} 
              />
              <div className="max-w-xl mx-auto space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 text-center">Add a reflection (Optional)</p>
                 <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="How did this flow feel?..."
                    className="w-full bg-slate-900/40 border border-slate-800 rounded-[32px] p-6 text-white focus:outline-none focus:border-indigo-500/40 transition-all font-light text-lg italic resize-none h-32"
                 />
              </div>
            </div>
          ) : mode === 'art' ? (
            <div className="space-y-10">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="space-y-2">
                   <h3 className="text-3xl font-extrabold text-white tracking-tight">Visual Creation</h3>
                   <p className="text-slate-500 text-sm">{initialPrompt || "Express your inner landscape without words."}</p>
                 </div>
                 <div className="flex bg-slate-900/60 p-1 rounded-2xl border border-slate-800">
                    <button 
                      onClick={() => setArtType('draw')}
                      className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${artType === 'draw' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      <PenTool size={14} /> Draw
                    </button>
                    <button 
                      onClick={() => setArtType('upload')}
                      className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${artType === 'upload' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      <Upload size={14} /> Upload
                    </button>
                 </div>
               </div>

               {artType === 'draw' ? (
                 <ArtCanvas onImageChange={setVisualAsset} />
               ) : (
                 <div className="space-y-4">
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-video rounded-[40px] border-2 border-dashed border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 hover:border-indigo-500/40 transition-all flex flex-col items-center justify-center gap-4 group"
                    >
                      {visualAsset ? (
                        <img src={visualAsset} alt="Preview" className="w-full h-full object-contain p-4" />
                      ) : (
                        <>
                          <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all">
                             <ImageIcon size={32} />
                          </div>
                          <div className="text-center">
                             <p className="text-white font-bold">Select a peaceful image</p>
                             <p className="text-slate-500 text-xs">A photo of nature, a memory, or an inspiration</p>
                          </div>
                        </>
                      )}
                    </button>
                    {visualAsset && (
                      <button onClick={() => setVisualAsset('')} className="text-xs font-bold text-red-400 hover:underline">Remove image</button>
                    )}
                 </div>
               )}

               <div className="space-y-4 pt-8 border-t border-slate-800/40">
                  <div className="space-y-2 group">
                    <input 
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Title your creation..."
                      className="w-full bg-transparent border-none p-0 text-3xl font-extrabold text-white placeholder-slate-800 focus:outline-none focus:ring-0 tracking-tighter"
                    />
                    <div className="h-px w-24 bg-slate-800 group-focus-within:w-full transition-all duration-700" />
                  </div>
                  <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Capture the thoughts behind the visuals..."
                    className="w-full bg-transparent border-none p-0 min-h-[150px] text-slate-300 focus:outline-none focus:ring-0 transition-all font-light text-xl font-serif leading-relaxed resize-none"
                  />
               </div>
            </div>
          ) : (
            <div className="space-y-8 relative">
              
              {/* Title Area */}
              <div className="space-y-2 group">
                 <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={initialPrompt || "Untethered thoughts..."}
                  className="w-full bg-transparent border-none p-0 text-4xl md:text-5xl font-extrabold text-white placeholder-slate-800 focus:outline-none focus:ring-0 tracking-tighter"
                 />
                 <div className="h-px w-24 bg-slate-800 group-focus-within:w-full transition-all duration-700" />
              </div>

              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1 bg-slate-900/60 backdrop-blur-md border border-slate-800 p-2 rounded-2xl w-fit sticky top-4 z-40 shadow-xl">
                <ToolbarButton onClick={() => applyFormatting('# ', '')} icon={Heading1} title="H1" />
                <ToolbarButton onClick={() => applyFormatting('## ', '')} icon={Heading2} title="H2" />
                <div className="w-px h-4 bg-slate-800 mx-1" />
                <ToolbarButton onClick={() => applyFormatting('**', '**')} icon={Bold} title="Bold" />
                <ToolbarButton onClick={() => applyFormatting('*', '*')} icon={Italic} title="Italic" />
                <ToolbarButton onClick={() => applyFormatting('\n> ', '')} icon={Quote} title="Quote" />
                <div className="w-px h-4 bg-slate-800 mx-1" />
                <ToolbarButton onClick={() => applyFormatting('\n- ', '')} icon={List} title="Bullet List" />
                <ToolbarButton onClick={() => applyFormatting('\n1. ', '')} icon={ListOrdered} title="Numbered List" />
                <div className="w-px h-4 bg-slate-800 mx-1" />
                <ToolbarButton onClick={() => applyFormatting('\n---\n', '')} icon={Minus} title="Divider" />
              </div>

              {/* Main Content Area */}
              <textarea
                ref={textareaRef}
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                onFocus={() => !zenMode && setZenMode(false)}
                placeholder="Let your thoughts arrive, untethered..."
                className={`w-full bg-transparent border-none p-0 min-h-[50vh] text-slate-200 focus:outline-none focus:ring-0 transition-all font-light text-2xl font-serif leading-relaxed resize-none ${
                  zenMode ? 'text-3xl' : ''
                }`}
              />

              {/* Metrics Footer */}
              <div className="flex items-center gap-6 pt-12 opacity-30 group-hover:opacity-100 transition-opacity border-t border-slate-800/40">
                 <div className="flex items-center gap-2">
                    <History size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{wordCount} Words</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Info size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{charCount} Characters</span>
                 </div>
                 <div className="ml-auto text-[9px] font-black uppercase tracking-[0.2em]">Neural Encryption Active</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ToolbarButton = ({ onClick, icon: Icon, title }: any) => (
  <button 
    onClick={(e) => { e.preventDefault(); onClick(); }} 
    title={title} 
    className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-all"
  >
    <Icon size={18} />
  </button>
);

export default JournalView;