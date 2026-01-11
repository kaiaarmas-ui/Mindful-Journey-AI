import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Shield, Brain, ArrowRight, Stars, Atom, Zap, Globe, Sparkles, ShieldCheck, Heart, Gift } from 'lucide-react';
import { AppView, MembershipTier } from '../types';

const IntegrationView: React.FC<{ onBack: () => void, onViewChange: (v: AppView, m?: string, p?: string, t?: MembershipTier) => void }> = ({ onBack, onViewChange }) => {
  return (
    <div className="h-full bg-main text-main overflow-y-auto selection:bg-indigo-500/20 custom-scrollbar">
      <div className="max-w-[1700px] mx-auto py-16 px-6 space-y-20 pb-40">
        <header className="space-y-8 text-center relative">
          {onBack && (
            <button onClick={onBack} className="absolute left-0 top-0 p-2.5 hover:bg-sub rounded-full text-sub hover:text-main border border-main">
              <ArrowLeft size={24} />
            </button>
          )}
          <div className="flex justify-center"><div className="w-20 h-20 bg-indigo-600/10 rounded-[28px] border border-indigo-500/20 flex items-center justify-center text-indigo-500"><Gift size={40} /></div></div>
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tighter">Choose Your Path</h1>
            <p className="text-xl text-sub font-light max-w-2xl mx-auto italic font-serif">"Every part of the journey is free. Choose the level that matches your intention."</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <LevelCard title="Seeker" desc="Start your journey with basic breathing and chat." icon={ShieldCheck} onSelect={() => onViewChange('dashboard', undefined, undefined, 'seeker')} />
          <LevelCard title="Architect" desc="Design your day with art journals and more." icon={Crown} onSelect={() => onViewChange('dashboard', undefined, undefined, 'architect')} highlight />
          <LevelCard title="Master" desc="Deep thinking and cinematic video tools." icon={Brain} onSelect={() => onViewChange('dashboard', undefined, undefined, 'zen-master')} />
        </div>

        <section className="bg-sub border border-main rounded-[64px] p-16 text-center shadow-sm max-w-4xl mx-auto">
           <h2 className="text-3xl font-bold mb-4">Always Free</h2>
           <p className="text-sub text-lg leading-relaxed font-light">Mindful Journey is a gift. We use advanced AI to help people find peace. No paywalls. No ads. Just calm.</p>
        </section>
      </div>
    </div>
  );
};

const LevelCard = ({ title, desc, icon: Icon, onSelect, highlight }: any) => (
  <div className={`p-10 rounded-[48px] bg-sub border flex flex-col space-y-8 ${highlight ? 'border-indigo-500 ring-4 ring-indigo-500/5' : 'border-main'}`}>
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Level Access</p>
      </div>
      <div className="p-3 bg-main rounded-2xl border border-main text-sub"><Icon size={24} /></div>
    </div>
    <p className="text-sub text-sm leading-relaxed">{desc}</p>
    <button onClick={onSelect} className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all flex items-center justify-center gap-2">
      Select Level <ArrowRight size={14} />
    </button>
  </div>
);

export default IntegrationView;