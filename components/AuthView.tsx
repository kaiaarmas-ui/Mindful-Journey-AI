
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Mail, Lock, Sparkles, CheckCircle2, Shield, Crown, Brain, Stars, Heart, Gift } from 'lucide-react';
import { UserProfile, MembershipTier } from '../types';

interface AuthViewProps {
  onBack: () => void;
  onAuthSuccess: (user: UserProfile) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onBack, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tier, setTier] = useState<MembershipTier>('zen-master');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      // Pull existing data if it exists for login to maintain current stats
      const savedData = JSON.parse(localStorage.getItem('mindful_user') || '{}');
      
      const user: UserProfile = {
        name: isLogin ? (savedData.name || 'Seeker') : name || 'Seeker',
        email,
        joinedDate: isLogin ? (savedData.joinedDate || Date.now()) : Date.now(),
        tier: isLogin ? (savedData.tier || 'zen-master') : tier,
        // Provided missing required awakening property to satisfy UserProfile type
        awakening: isLogin && savedData.awakening ? savedData.awakening : {
          level: 1,
          xp: 0,
          totalXp: 0,
          nextLevelXp: 200,
          daysPresent: 1,
          lastLoginTimestamp: Date.now(),
          currentStreak: 1
        }
      };
      
      localStorage.setItem('mindful_user', JSON.stringify(user));
      onAuthSuccess(user);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="h-full bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-slate-900/40 border border-slate-800 rounded-[48px] p-8 md:p-12 backdrop-blur-xl shadow-2xl relative z-10"
      >
        <button 
          onClick={onBack}
          className="absolute left-8 top-8 p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full transition-all"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="text-center space-y-4 mb-8 mt-4">
          <div className="w-16 h-16 rounded-[24px] bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-600/20 mx-auto">
            <Gift size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {isLogin ? 'Identity Ritual' : 'Enter Dimension'}
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              {isLogin ? 'Reconnect with your presence.' : 'All paths are gifted. Define your resonant dimension.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">Starting Dimension</label>
                  <div className="grid grid-cols-3 gap-2">
                    <TierSelectBtn active={tier === 'architect'} onClick={() => setTier('architect')} icon={Crown} label="Manifest" color="text-indigo-400" />
                    <TierSelectBtn active={tier === 'zen-master'} onClick={() => setTier('zen-master')} icon={Brain} label="Transcend" color="text-purple-400" />
                    <TierSelectBtn active={tier === 'universal'} onClick={() => setTier('universal')} icon={Stars} label="Infinity" color="text-sky-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">Presence Identity</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Bodhi" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">Signal Channel (Email)</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all" />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">Sanctuary Key</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Gift size={20} />{isLogin ? 'Get Started' : 'Get Started'}</>}
          </button>
        </form>

        <div className="mt-8 text-center space-y-6">
          <p className="text-sm text-slate-500">
            {isLogin ? "New to the Dimension?" : "Already present?"}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
              {isLogin ? 'Define Identity here' : 'Ritual here'}
            </button>
          </p>
          <div className="pt-6 border-t border-slate-800/50 flex items-center justify-center gap-3 text-slate-600">
            <Heart size={14} className="text-pink-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">A Collective Neural Gift</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const TierSelectBtn = ({ active, onClick, icon: Icon, label, color }: any) => (
  <button type="button" onClick={onClick} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${active ? 'bg-indigo-500/10 border-indigo-500/50 ring-2 ring-indigo-500/20' : 'bg-slate-950/40 border-slate-800 opacity-60 hover:opacity-100'}`}>
    <Icon size={18} className={active ? color : 'text-slate-500'} />
    <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-slate-600'}`}>{label}</span>
  </button>
);

export default AuthView;
