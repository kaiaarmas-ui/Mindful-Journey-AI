import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, ShieldCheck, Instagram, Zap, Search, Palette, Coffee, Smartphone, Heart } from 'lucide-react';
import Logo from './Logo';

const AboutView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  return (
    <div className="h-full bg-main text-main overflow-y-auto selection:bg-indigo-500/20 custom-scrollbar">
      <div className="max-w-5xl mx-auto py-24 px-8 space-y-32 pb-64">
        <header className="space-y-10 text-center relative">
          {onBack && (
            <button onClick={onBack} className="absolute left-0 top-0 p-3 hover:bg-sub rounded-full text-sub hover:text-main border border-main">
              <ArrowLeft size={24} />
            </button>
          )}
          <div className="flex justify-center"><Logo size={100} /></div>
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">A Space <br /><span className="text-indigo-500 font-serif italic">for Peace</span></h1>
            <p className="text-2xl font-light max-w-4xl mx-auto leading-relaxed">Intelligence designed for human focus and calm.</p>
          </div>
        </header>

        <section className="bg-sub border border-main rounded-[64px] p-8 md:p-20 space-y-16 shadow-sm">
             <div className="max-w-3xl space-y-10 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase">Our Story</div>
                <div className="space-y-8">
                  <p className="text-xl md:text-2xl leading-relaxed font-light">The digital world is noisy. We spend our lives looking at screens while life happens elsewhere. Everywhere you look, people are distracted.</p>
                  <p className="text-lg text-sub leading-relaxed font-light font-serif italic border-l-2 border-main pl-8">We decided to use AI to help us instead of distracting us. Mindful Journey uses the power of Gemini AI to guide you back to focus and peace.</p>
                </div>
             </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Pillar icon={Globe} title="Open Access" desc="Mindfulness is a human right. MJ is free for everyone, always." color="text-sky-500" />
          <Pillar icon={ShieldCheck} title="Privacy First" desc="Your thoughts stay on your device. We don't track you." color="text-emerald-500" />
          <Pillar icon={Zap} title="AI Calm" desc="Trillions of unique paths tailored just for your mood." color="text-purple-500" />
        </section>

        <footer className="pt-20 border-t border-main text-center space-y-10 opacity-60">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
             <p className="text-[10px] font-black uppercase tracking-widest text-sub">© 2026 Mindful Journey</p>
             <div className="flex justify-center gap-6">
               <a href="https://www.instagram.com/mindfuljourneyai/" target="_blank" className="hover:text-main"><Instagram size={20} /></a>
               <Globe size={20} className="cursor-pointer hover:text-main" />
             </div>
          </div>
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Built for Harmony</p>
        </footer>
      </div>
    </div>
  );
};

const Pillar = ({ icon: Icon, title, desc, color }: any) => (
  <div className="bg-sub border border-main p-8 rounded-[40px] space-y-6 hover:border-indigo-500/30 transition-all flex flex-col h-full shadow-sm">
    <div className={`w-12 h-12 rounded-2xl bg-main border border-main flex items-center justify-center ${color} shadow-sm`}><Icon size={24} /></div>
    <div className="space-y-2">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-sm text-sub leading-relaxed font-light">{desc}</p>
    </div>
  </div>
);

export default AboutView;