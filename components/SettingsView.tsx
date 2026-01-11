import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Volume2, 
  Palette, 
  Accessibility as AccessibilityIcon, 
  Check, 
  RefreshCcw,
  Lightbulb,
  Plus,
  Play,
  Trash2,
  Type,
  Contrast,
  Loader2,
  Monitor,
  Settings as SettingsIcon,
  X,
  Sparkles,
  Waves
} from 'lucide-react';
import { generateTTS, decode, decodeAudioData } from '../services/geminiService.ts';

interface SettingsViewProps {
  onClose: () => void;
  onThemeChange?: (theme: string) => void;
  onFontSizeChange?: (size: string) => void;
  currentTheme?: string;
}

type SettingsTab = 'audio' | 'theme' | 'accessibility';

interface CustomVoice {
  id: string;
  label: string;
  baseVoice: string;
  tone: number;
  pace: number;
}

const THEMES = [
  { id: 'sage-sky', name: 'Sage & Sky (Dark)', description: 'Original calming green and blue palette', colors: ['#0f172a', '#9dc08b', '#ffffff'] },
  { id: 'light', name: 'Cloud Sanctuary (Light)', description: 'Clean, focused light mode', colors: ['#f8fafc', '#4f46e5', '#1e293b'] },
  { id: 'lavender-dreams', name: 'Lavender Dreams', description: 'Soft purple and pink tones', colors: ['#1e1b4b', '#b39ddb', '#ffffff'] },
  { id: 'forest-retreat', name: 'Forest Retreat', description: 'Deep greens and earth tones', colors: ['#064e3b', '#689f38', '#ffffff'] },
  { id: 'warm-sunset', name: 'Warm Sunset', description: 'Coral and peach hues', colors: ['#451a03', '#ff8a65', '#ffffff'] },
  { id: 'ocean-depths', name: 'Ocean Depths', description: 'Deep blues and teals', colors: ['#0c4a6e', '#0ea5e9', '#ffffff'] },
];

const BASE_VOICES = [
  { id: 'Kore', label: 'Kore', sub: 'Warm, soothing female narrator' },
  { id: 'Puck', label: 'Puck', sub: 'Deep, calming male narrator' },
  { id: 'Charon', label: 'Charon', sub: 'Balanced, gentle narrator' },
  { id: 'Fenrir', label: 'Fenrir', sub: 'Stately, authoritative voice' },
  { id: 'Zephyr', label: 'Zephyr', sub: 'Light, airy and youthful' },
];

const SettingsView: React.FC<SettingsViewProps> = ({ onClose, onThemeChange, onFontSizeChange, currentTheme }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('audio');
  const [selectedVoiceId, setSelectedVoiceId] = useState(() => localStorage.getItem('voice_pref') || 'Kore');
  
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('acc_font_size') || '16'));
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('acc_high_contrast') === 'true');
  const [reduceMotion, setReduceMotion] = useState(() => localStorage.getItem('acc_reduce_motion') === 'true');
  const [dyslexiaFont, setDyslexiaFont] = useState(() => localStorage.getItem('acc_dyslexia_font') === 'true');

  const [customVoices, setCustomVoices] = useState<CustomVoice[]>(() => {
    const saved = localStorage.getItem('custom_voices');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isCreatingVoice, setIsCreatingVoice] = useState(false);
  const [newVoiceName, setNewVoiceName] = useState('');
  const [newVoiceBase, setNewVoiceBase] = useState('Kore');
  const [newVoiceTone, setNewVoiceTone] = useState(50);
  const [newVoicePace, setNewVoicePace] = useState(50);
  const [isTesting, setIsTesting] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    localStorage.setItem('voice_pref', selectedVoiceId);
    localStorage.setItem('custom_voices', JSON.stringify(customVoices));
    localStorage.setItem('acc_font_size', fontSize.toString());
    localStorage.setItem('acc_high_contrast', highContrast.toString());
    localStorage.setItem('acc_reduce_motion', reduceMotion.toString());
    localStorage.setItem('acc_dyslexia_font', dyslexiaFont.toString());
    
    onFontSizeChange?.(fontSize.toString());

    const root = document.documentElement;
    if (highContrast) root.classList.add('high-contrast');
    else root.classList.remove('high-contrast');

    if (reduceMotion) root.classList.add('reduce-motion');
    else root.classList.remove('reduce-motion');

    if (dyslexiaFont) root.classList.add('dyslexia-font');
    else root.classList.remove('dyslexia-font');
    
    window.dispatchEvent(new Event('storage'));
  }, [selectedVoiceId, customVoices, fontSize, highContrast, reduceMotion, dyslexiaFont]);

  const handleReset = () => {
    if (confirm("Reset all settings to defaults?")) {
      setSelectedVoiceId('Kore');
      onThemeChange?.('sage-sky');
      setCustomVoices([]);
      setFontSize(16);
      setHighContrast(false);
      setReduceMotion(false);
      setDyslexiaFont(false);
    }
  };

  const createVoice = () => {
    if (!newVoiceName.trim()) return;
    const voice: CustomVoice = { 
      id: `custom-${Date.now()}`, 
      label: newVoiceName, 
      baseVoice: newVoiceBase,
      tone: newVoiceTone, 
      pace: newVoicePace 
    };
    setCustomVoices([...customVoices, voice]);
    setSelectedVoiceId(voice.id);
    setIsCreatingVoice(false);
    setNewVoiceName('');
  };

  const deleteCustomVoice = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customVoices.filter(v => v.id !== id);
    setCustomVoices(updated);
    if (selectedVoiceId === id) {
      setSelectedVoiceId('Kore');
    }
  };

  const testVoice = async (voiceName: string, testId: string) => {
    if (isTesting) return;
    setIsTesting(testId);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const base64 = await generateTTS("Hello. I am your custom neural persona. My voice is calibrated to your journey.", voiceName);
      const buffer = await decodeAudioData(decode(base64), audioContextRef.current, 24000, 1);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsTesting(null);
      source.start(0);
    } catch (e) {
      console.error(e);
      setIsTesting(null);
    }
  };

  return (
    <div className="h-full bg-main text-main flex flex-col overflow-hidden">
      <div className="p-6 md:p-8 flex items-center justify-between border-b border-main bg-main/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2.5 hover:bg-sub rounded-full transition-all text-sub hover:text-main border border-main">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-main tracking-tight flex items-center gap-3">
            <SettingsIcon size={20} className="text-indigo-400" />
            Sanctuary Preferences
          </h2>
        </div>
        <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-sub hover:text-red-400 transition-colors">
          <RefreshCcw size={14} />
          Reset All
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-20 md:w-64 border-r border-main bg-sub flex flex-col">
          <div className="p-4 space-y-2">
            <TabButton icon={Volume2} label="Audio & Voice" active={activeTab === 'audio'} onClick={() => setActiveTab('audio')} />
            <TabButton icon={Palette} label="Theme & Spirit" active={activeTab === 'theme'} onClick={() => setActiveTab('theme')} />
            <TabButton icon={AccessibilityIcon} label="Accessibility" active={activeTab === 'accessibility'} onClick={() => setActiveTab('accessibility')} />
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar bg-main">
          <div className="max-w-3xl space-y-12">
            
            {activeTab === 'audio' && (
              <section className="space-y-10">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-main tracking-tight">Audio Presence</h3>
                  <p className="text-sub text-sm">Choose the frequency of your guide or manifest a custom persona.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-full mb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-sub mb-4 px-2">System Neural Voices</p>
                  </div>
                  {BASE_VOICES.map(v => (
                    <VoiceCard 
                      key={v.id}
                      label={v.label}
                      sub={v.sub}
                      active={selectedVoiceId === v.id}
                      onClick={() => setSelectedVoiceId(v.id)}
                      onTest={() => testVoice(v.id, v.id)}
                      isTesting={isTesting === v.id}
                    />
                  ))}
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Your Custom Personas</p>
                    <button 
                      onClick={() => setIsCreatingVoice(true)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      <Plus size={14} /> New Persona
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customVoices.map(v => (
                      <VoiceCard 
                        key={v.id}
                        label={v.label}
                        sub={`Calibrated ${v.baseVoice}`}
                        active={selectedVoiceId === v.id}
                        onClick={() => setSelectedVoiceId(v.id)}
                        onTest={() => testVoice(v.baseVoice, v.id)}
                        isTesting={isTesting === v.id}
                        onDelete={(e) => deleteCustomVoice(v.id, e)}
                      />
                    ))}
                    {customVoices.length === 0 && (
                      <div className="col-span-full p-8 border border-dashed border-main rounded-[32px] text-center">
                        <p className="text-sub text-sm italic">No custom personas created yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'theme' && (
              <section className="space-y-10">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-main tracking-tight">Environmental Atmosphere</h3>
                  <p className="text-sub text-sm">Resonate with the visual frequency that best supports your focus.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {THEMES.map(t => (
                    <button 
                      key={t.id}
                      onClick={() => onThemeChange?.(t.id)}
                      className={`group p-6 rounded-[32px] border-2 text-left transition-all relative overflow-hidden ${
                        currentTheme === t.id ? 'border-indigo-500 bg-indigo-500/5' : 'border-main hover:border-slate-700 bg-sub/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-1.5">
                          {t.colors.map((c, i) => (
                            <div key={i} className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        {currentTheme === t.id && <Check size={18} className="text-indigo-400" />}
                      </div>
                      <h4 className="text-main font-bold mb-1">{t.name}</h4>
                      <p className="text-xs text-sub leading-relaxed italic">{t.description}</p>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'accessibility' && (
              <section className="space-y-12">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-main tracking-tight">Universal Access</h3>
                  <p className="text-sub text-sm">Fine-tune the architecture of the sanctuary for your specific needs.</p>
                </div>

                <div className="bg-sub border border-main rounded-[40px] p-8 md:p-10 space-y-10 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-main text-sub"><Type size={18} /></div>
                        <div>
                          <p className="text-sm font-bold text-main">Neural Scaling</p>
                          <p className="text-[10px] text-sub uppercase tracking-widest">Base Font Size</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-indigo-400">{fontSize}px</span>
                    </div>
                    <input 
                      type="range" min="12" max="24" value={fontSize} 
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-main rounded-full appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToggleItem 
                      icon={Contrast} 
                      label="Deep Contrast" 
                      sub="Enhanced clarity"
                      active={highContrast} 
                      onClick={() => setHighContrast(!highContrast)} 
                    />
                    <ToggleItem 
                      icon={Monitor} 
                      label="Stillness Mode" 
                      sub="Reduce motion"
                      active={reduceMotion} 
                      onClick={() => setReduceMotion(!reduceMotion)} 
                    />
                    <ToggleItem 
                      icon={Lightbulb} 
                      label="Lexicon Assist" 
                      sub="Dyslexia friendly"
                      active={dyslexiaFont} 
                      onClick={() => setDyslexiaFont(!dyslexiaFont)} 
                    />
                  </div>
                </div>
              </section>
            )}

          </div>
        </main>
      </div>

      {/* Create Persona Modal */}
      <AnimatePresence>
        {isCreatingVoice && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="max-w-md w-full bg-sub border border-main rounded-[48px] p-10 shadow-3xl space-y-8"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-indigo-400" size={24} />
                  <h3 className="text-2xl font-bold text-main tracking-tight">Manifest Persona</h3>
                </div>
                <button onClick={() => setIsCreatingVoice(false)} className="p-2 text-sub hover:text-main transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sub px-4">Persona Identity</label>
                  <input 
                    type="text" value={newVoiceName} onChange={(e) => setNewVoiceName(e.target.value)}
                    placeholder="e.g., Deep Guide"
                    className="w-full bg-main border border-main rounded-2xl p-4 text-main focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sub px-4">Neural Base</label>
                  <select 
                    value={newVoiceBase} onChange={(e) => setNewVoiceBase(e.target.value)}
                    className="w-full bg-main border border-main rounded-2xl p-4 text-main appearance-none"
                  >
                    {BASE_VOICES.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                  </select>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => testVoice(newVoiceBase, 'preview')} disabled={isTesting === 'preview'} className="flex-1 py-4 bg-sub hover:bg-slate-700 text-main rounded-2xl font-bold flex items-center justify-center gap-2">
                    {isTesting === 'preview' ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />} Hear Preview
                  </button>
                  <button onClick={createVoice} disabled={!newVoiceName.trim()} className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold">
                    Add Persona
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TabButton = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
      active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-sub hover:bg-main/40 hover:text-main'
    }`}
  >
    <Icon size={20} className="flex-shrink-0" />
    <span className="hidden md:block font-bold text-sm">{label}</span>
  </button>
);

const VoiceCard = ({ label, sub, active, onClick, onTest, isTesting, onDelete }: any) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-[32px] border-2 text-left transition-all relative group overflow-hidden ${
      active ? 'border-indigo-500 bg-indigo-500/5 shadow-xl shadow-indigo-500/5' : 'border-main hover:border-slate-700 bg-main/20'
    }`}
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`p-2 rounded-xl border ${active ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-sub border-main text-sub'}`}>
        {isTesting ? <Waves size={18} className="animate-pulse" /> : <Volume2 size={18} />}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={(e) => { e.stopPropagation(); onTest(); }} className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${isTesting ? 'text-indigo-400' : 'text-sub'}`}>
          <Play size={14} fill={isTesting ? 'currentColor' : 'none'} />
        </button>
        {onDelete && (
          <button onClick={onDelete} className="p-2 rounded-lg hover:bg-red-500/10 text-sub hover:text-red-400 transition-colors">
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
    <h4 className="text-main font-bold text-sm mb-1">{label}</h4>
    <p className="text-[10px] text-sub font-bold uppercase tracking-widest">{sub}</p>
    {active && (
      <div className="absolute top-3 right-3 text-indigo-400">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
      </div>
    )}
  </button>
);

const ToggleItem = ({ icon: Icon, label, sub, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-[32px] border-2 text-left transition-all ${
      active ? 'border-indigo-500 bg-indigo-500/5' : 'border-main hover:border-slate-700 bg-main/40'
    }`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-xl ${active ? 'bg-indigo-500/10 text-indigo-400' : 'bg-sub text-sub'}`}>
        <Icon size={18} />
      </div>
      <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${active ? 'bg-indigo-600' : 'bg-main'}`}>
        <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${active ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
    </div>
    <h4 className="text-main font-bold text-xs mb-1">{label}</h4>
    <p className="text-[9px] text-sub font-bold uppercase tracking-widest">{sub}</p>
  </button>
);

export default SettingsView;