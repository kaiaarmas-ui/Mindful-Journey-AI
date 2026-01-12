
import React from 'react';
import { motion } from 'framer-motion';
import { AppView, UserProfile } from '../types';
import Logo from './Logo';
import { 
  Zap, 
  Bot, 
  Palette, 
  Library,
  Globe,
  Gift,
  Sun,
  Moon,
  BookOpen,
  PenTool,
  Hash,
  Music,
  Feather,
  Star,
  ShieldCheck
} from 'lucide-react';

interface DashboardProps {
  onViewChange?: (view: AppView, mode?: string, prompt?: string) => void;
  user: UserProfile | null;
  levelTitle: string;
  onToggleTheme?: () => void;
  currentTheme?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange, user, levelTitle, onToggleTheme, currentTheme }) => {
  const awakening = user?.awakening || { level: 1, xp: 0, nextLevelXp: 200, daysPresent: 1, currentStreak: 1 };
  const xpPercentage = (awakening.xp / awakening.nextLevelXp) * 100;

  return (
    <div className="flex-1 overflow-y-auto h-full bg-main text-main transition-all pb-24 custom-scrollbar">
      <nav className="flex items-center justify-between px-6 md:px-8 py-4 bg-main/80 backdrop-blur-md border-b border-main sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="cursor-pointer" onClick={() => onViewChange?.('dashboard')}>
            <Logo size={32} showText={true} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onToggleTheme} className="p-2.5 bg-sub border border-main rounded-xl text-sub hover:text-main" title="Switch Theme">
            {currentTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button onClick={() => user ? onViewChange?.('integration') : onViewChange?.('auth')} className="px-5 py-2.5 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 flex items-center gap-2">
            <Gift size={14} /> {user ? 'My Profile' : 'Join'}
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        <section className="bg-sub border border-main rounded-[32px] p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
             <div className="flex-1 w-full space-y-4">
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[10px] font-black uppercase text-sub">Infinite Progression</p>
                      <h2 className="text-2xl font-bold">Level {awakening.level} {levelTitle}</h2>
                   </div>
                   <p className="text-xs font-bold text-sub">{awakening.xp} / {awakening.nextLevelXp} XP</p>
                </div>
                <div className="w-full h-2.5 bg-main rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${xpPercentage}%` }} className="h-full bg-indigo-500" />
                </div>
             </div>
             <div className="flex gap-4">
                <div className="text-center bg-main/50 px-6 py-3 rounded-2xl border border-main min-w-[100px]">
                   <p className="text-2xl font-bold">{awakening.daysPresent}</p>
                   <p className="text-[9px] font-black uppercase text-sub">Days</p>
                </div>
                <div className="text-center bg-main/50 px-6 py-3 rounded-2xl border border-main min-w-[100px]">
                   <p className="text-2xl font-bold text-orange-400">{awakening.currentStreak}</p>
                   <p className="text-[9px] font-black uppercase text-sub">Streak</p>
                </div>
             </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-main pb-2">
             <ShieldCheck size={16} className="text-sub" />
             <h2 className="text-xs font-black text-sub uppercase">Quick Relax</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SimpleCard icon={Zap} title="Breathe" desc="Easy breathing exercises" onClick={() => onViewChange?.('quick-relief')} color="text-sky-400" />
            <SimpleCard icon={Bot} title="AI Chat" desc="Talk to your guide" onClick={() => onViewChange?.('chat')} color="text-emerald-400" />
            <SimpleCard icon={Star} title="Daily Quotes" desc="Inspiration for today" onClick={() => onViewChange?.('daily-inspiration')} color="text-purple-400" />
            <SimpleCard icon={Globe} title="Community" desc="Global shared thoughts" onClick={() => onViewChange?.('collective-soul')} color="text-pink-400" />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-main pb-2">
             <Palette size={16} className="text-sub" />
             <h2 className="text-xs font-black text-sub uppercase">Create Something</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SimpleCard icon={PenTool} title="AI Art" desc="Turn words into images" onClick={() => onViewChange?.('image')} color="text-indigo-400" />
            <SimpleCard icon={Feather} title="AI Poetry" desc="Generate calm poems" onClick={() => onViewChange?.('poetry')} color="text-pink-400" />
            <SimpleCard icon={BookOpen} title="AI Stories" desc="Write a peaceful tale" onClick={() => onViewChange?.('story')} color="text-amber-500" />
            <SimpleCard icon={Hash} title="Patterns" desc="Connect-the-dots game" onClick={() => onViewChange?.('journal', 'dot-to-dot', 'Mountain')} color="text-sky-500" />
            <SimpleCard icon={Library} title="Journal" desc="Writing prompts" onClick={() => onViewChange?.('journal-library')} color="text-emerald-400" />
            <SimpleCard icon={Music} title="AI Music" desc="Sync with your sound" onClick={() => onViewChange?.('music')} color="text-slate-400" />
          </div>
        </section>
      </main>
    </div>
  );
};

const SimpleCard = ({ icon: Icon, title, desc, onClick, color }: any) => (
  <button onClick={onClick} className="group bg-sub border border-main p-6 rounded-[24px] text-left hover:border-indigo-500/50 transition-all flex flex-col gap-4 shadow-sm">
    <div className={`w-10 h-10 rounded-xl bg-main border border-main flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
      <Icon size={20} />
    </div>
    <div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-xs text-sub leading-tight">{desc}</p>
    </div>
  </button>
);

export default Dashboard;
