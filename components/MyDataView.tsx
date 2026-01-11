
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Download, 
  Trash2, 
  ShieldCheck, 
  BarChart3, 
  Clock, 
  Calendar, 
  Zap,
  ArrowLeft,
  FileJson,
  History,
  TrendingUp,
  Image as ImageIcon,
  Video,
  Brain,
  Bot,
  Sparkles,
  ExternalLink,
  Target,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { CreationItem } from '../types';

interface MyDataViewProps {
  onBack?: () => void;
}

const PERSPECTIVES = [
  {
    id: 'golf-ball',
    question: "What is Mindfulness from a Golf Ball's Point of View? *",
    options: [
      { text: "Mindfulness is: Just observe... just breathe... just... OH NO, THE CLUB!", type: 'panic' },
      { text: "Mindfulness is... the final, panicked thought: 'I should have stayed in the golf bag! It was safe there!'", type: 'fear' },
      { text: "Mindfulness is: The shadow of the golfer looms. I observe the shift in light, the gathering of energy. I note the tightening grip on the club, the focused intent. I simply witness, without judgment.", type: 'zen' }
    ]
  }
];

const MyDataView: React.FC<MyDataViewProps> = ({ onBack }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [archive, setArchive] = useState<CreationItem[]>([]);
  const [selectedGolfOption, setSelectedGolfOption] = useState<number | null>(null);

  useEffect(() => {
    const loadArchive = () => {
      const saved = localStorage.getItem('creation_archive');
      if (saved) {
        setArchive(JSON.parse(saved));
      }
    };
    loadArchive();
    window.addEventListener('storage', loadArchive);
    return () => window.removeEventListener('storage', loadArchive);
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const data = {
        app: "Mindful Journey",
        timestamp: new Date().toISOString(),
        stats: { sessions: 42, minutes: 640, streak: 12 },
        archive: archive,
        preferences: localStorage.getItem('theme_pref') || 'default'
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindful-journey-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      setIsExporting(false);
    }, 1500);
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear your local session data? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="h-full bg-[#0f172a] text-slate-300 overflow-y-auto selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto py-16 px-6 space-y-16 pb-32">
        
        {/* Header */}
        <header className="space-y-6 relative">
          {onBack && (
            <button 
              onClick={onBack}
              className="absolute -left-12 top-1 p-2 hover:bg-slate-800 rounded-full transition-all text-slate-500 hover:text-white"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
              <Database size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">My Mindful Data</h1>
              <p className="text-slate-500 font-medium">Insights, history, and privacy controls</p>
            </div>
          </div>
        </header>

        {/* PERSPECTIVE SHIFT: THE GOLF BALL KOAN */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Sparkles size={20} className="text-yellow-400" />
              Perspective Shifts
            </h2>
            <p className="text-sm text-slate-500">Unconventional wisdom for your journey</p>
          </div>

          <div className="bg-[#1e293b] border border-slate-700/50 rounded-[40px] overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row">
              {/* Illustration Side */}
              <div className="md:w-1/3 bg-[#8fb3af]/20 p-12 flex flex-col items-center justify-center relative min-h-[300px]">
                <div className="absolute top-4 left-4">
                   <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Zen Humor</span>
                </div>
                
                {/* Golf Ball Visual Recreated with CSS/SVG */}
                <div className="relative w-40 h-40">
                   {/* Club Shadow */}
                   <div className="absolute -top-12 -right-8 w-24 h-48 bg-slate-900/10 blur-xl rotate-45 animate-pulse" />
                   
                   {/* The Ball */}
                   <div className="w-full h-full bg-[#f87171] rounded-full shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.3)] border-4 border-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
                      {/* Dents */}
                      <div className="absolute inset-0 opacity-20 grid grid-cols-6 gap-2 p-2">
                         {[...Array(36)].map((_, i) => (
                           <div key={i} className="w-1 h-1 bg-black rounded-full" />
                         ))}
                      </div>
                      
                      {/* Eyes */}
                      <div className="flex gap-4 z-10">
                        <div className="w-10 h-10 bg-white rounded-full border-2 border-black flex items-center justify-center">
                           <div className="w-4 h-4 bg-black rounded-full animate-bounce" />
                        </div>
                        <div className="w-10 h-10 bg-white rounded-full border-2 border-black flex items-center justify-center">
                           <div className="w-4 h-4 bg-black rounded-full animate-bounce" />
                        </div>
                      </div>
                      
                      {/* Sad Mouth */}
                      <div className="w-14 h-8 border-t-4 border-black rounded-[100%] mt-4 transform translate-y-2" />
                   </div>
                   
                   {/* Tee */}
                   <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4 h-16 bg-slate-800 rounded-b-full shadow-lg" />
                </div>
              </div>

              {/* Content Side */}
              <div className="md:w-2/3 p-10 md:p-14 space-y-8 bg-slate-900/40">
                <h3 className="text-2xl font-bold text-white leading-tight">
                  {PERSPECTIVES[0].question}
                </h3>
                
                <div className="space-y-4">
                  {PERSPECTIVES[0].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedGolfOption(idx)}
                      className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                        selectedGolfOption === idx 
                          ? 'border-indigo-500 bg-indigo-500/5 ring-4 ring-indigo-500/10' 
                          : 'border-slate-800 hover:border-slate-700 bg-slate-900/20'
                      }`}
                    >
                      <div className={`mt-1 flex-shrink-0 ${selectedGolfOption === idx ? 'text-indigo-400' : 'text-slate-700'}`}>
                        {selectedGolfOption === idx ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                      </div>
                      <p className={`text-sm font-medium leading-relaxed ${selectedGolfOption === idx ? 'text-white' : 'text-slate-400'}`}>
                        {option.text}
                      </p>
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {selectedGolfOption === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-2xl bg-[#b0cc8a]/10 border border-[#b0cc8a]/30 flex items-center gap-4"
                    >
                      <Brain className="text-[#b0cc8a] flex-shrink-0" size={24} />
                      <p className="text-sm text-[#b0cc8a] font-bold">
                        Satori Reached. True mindfulness is the ability to witness the inevitable without attaching to the fear.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={Clock} label="Total Mindfulness" value="640m" sub="10.6 hours total" color="text-indigo-400" />
          <StatCard icon={Zap} label="Current Streak" value="12" sub="Consecutive days" color="text-orange-400" />
          <StatCard icon={TrendingUp} label="Total Sessions" value="42" sub="Practices completed" color="text-emerald-400" />
        </section>

        {/* Creation Archive - Visual Gallery */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <BarChart3 size={20} className="text-indigo-400" />
                Creation Archive
              </h2>
              <p className="text-sm text-slate-500">A visual timeline of your serene creations</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
              {archive.length} Items Saved
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {archive.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative aspect-square rounded-[24px] overflow-hidden border border-slate-800 bg-slate-900/40 cursor-pointer shadow-lg hover:shadow-indigo-500/10 transition-all"
                >
                  {item.type === 'image' ? (
                    <img src={item.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <video src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" muted onMouseOver={e => e.currentTarget.play()} onMouseOut={e => e.currentTarget.pause()} />
                  )}
                  
                  {/* Glass Overlay Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <div className="px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-bold text-white uppercase tracking-tighter flex items-center gap-1">
                      {item.type === 'image' ? <ImageIcon size={10} /> : <Video size={10} />}
                      {item.type === 'image' ? 'Still' : 'Motion'}
                    </div>
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <div className="px-2 py-1 rounded-lg bg-indigo-500/80 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-tighter shadow-xl">
                      {getTimeAgo(item.timestamp)}
                    </div>
                  </div>

                  {/* Hover Detail Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                    <p className="text-[10px] text-white/90 line-clamp-2 leading-relaxed italic font-medium mb-2">
                      "{item.prompt}"
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-[9px] font-bold text-white uppercase transition-colors flex items-center justify-center gap-1">
                        <Download size={10} /> Save
                      </button>
                      <button className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
                        <ExternalLink size={10} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {archive.length === 0 && (
              <div className="col-span-full py-20 bg-slate-900/40 border border-dashed border-slate-800 rounded-[32px] flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-600">
                  <Sparkles size={24} />
                </div>
                <div className="text-center">
                  <p className="text-slate-400 font-bold">Your archive is empty.</p>
                  <p className="text-slate-600 text-xs">Generated art and videos will appear here.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Activity Log */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <History size={20} className="text-slate-500" />
                Recent Activity
              </h2>
              <button className="text-xs font-bold text-indigo-400 hover:underline">View All</button>
            </div>
            
            <div className="bg-slate-900/40 border border-slate-800 rounded-[32px] overflow-hidden">
              <ActivityItem icon={Brain} title="Guided Meditation: Sage Forest" time="2 hours ago" duration="15m" />
              <ActivityItem icon={ImageIcon} title="Peaceful Canvas: Ethereal Lake" time="Yesterday" duration="Created" />
              <ActivityItem icon={Bot} title="Soul Guide: Reflection on Focus" time="2 days ago" duration="8m" />
              <ActivityItem icon={Video} title="Zen Motion: Starry Path" time="Oct 14, 2025" duration="Created" />
              <ActivityItem icon={Zap} title="Quick Relief: Box Breathing" time="Oct 12, 2025" duration="1m" />
            </div>
          </div>

          {/* Privacy & Tools */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <ShieldCheck size={20} className="text-emerald-400" />
                Data Privacy
              </h2>
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl space-y-4">
                <p className="text-sm leading-relaxed text-slate-400">
                  Your data is stored <strong>locally in your browser</strong>. We do not sync your personal reflections or biometric logs to external servers.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Local-Only Mode Active
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Data Management</h3>
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <FileJson size={18} className="text-indigo-400" />
                  <span className="font-bold text-sm text-white">Export My Data</span>
                </div>
                {isExporting ? <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full" /> : <Download size={16} className="text-slate-500 group-hover:text-white" />}
              </button>

              <button 
                onClick={handleClearData}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Trash2 size={18} className="text-red-400" />
                  <span className="font-bold text-sm text-red-400">Wipe All Records</span>
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, sub, color }: any) => (
  <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[32px] space-y-4 hover:border-slate-700 transition-all">
    <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center ${color}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-sm font-bold text-slate-300 mt-1">{label}</p>
      <p className="text-xs text-slate-500 mt-2 font-medium">{sub}</p>
    </div>
  </div>
);

const ActivityItem = ({ icon: Icon, title, time, duration }: any) => (
  <div className="flex items-center justify-between p-6 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/20 transition-all">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
        <Icon size={18} />
      </div>
      <div>
        <p className="font-bold text-[15px] text-white">{title}</p>
        <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
          <Calendar size={12} />
          {time}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{duration}</p>
    </div>
  </div>
);

export default MyDataView;
