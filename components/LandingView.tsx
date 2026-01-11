import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  Infinity as InfinityIcon,
  Gift,
  Layers,
  Fingerprint,
  Brain,
  Zap,
  Moon,
  Sun
} from 'lucide-react';
import Logo from './Logo.tsx';
import { AppView } from '../types.ts';

// Added onToggleTheme and currentTheme to resolve props mismatch error in App.tsx
interface LandingViewProps {
  onJoin: () => void;
  onExplore: () => void;
  onViewChange?: (view: AppView) => void;
  onToggleTheme?: () => void;
  currentTheme?: string;
}

const LandingView: React.FC<LandingViewProps> = ({ onJoin, onExplore, onViewChange, onToggleTheme, currentTheme }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 200 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const revealVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] theme-bg-main text-slate-300 theme-text-main overflow-x-hidden selection:bg-indigo-500/20 relative font-sans">
      
      {/* Dynamic Background */}
      <motion.div
        className="fixed top-0 left-0 w-[800px] h-[800px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none z-0 mix-blend-screen hidden lg:block"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-[100] bg-[#0f172a]/80 theme-bg-main/80 backdrop-blur-xl border-b border-slate-800/50 theme-border-main px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size={40} showText={true} />
          <div className="hidden md:flex items-center gap-10">
            <button onClick={() => document.getElementById('manifesto')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-bold text-slate-400 theme-text-sub hover:text-white transition-colors uppercase tracking-widest">Overview</button>
            <button onClick={() => onViewChange?.('about')} className="text-sm font-bold text-slate-400 theme-text-sub hover:text-white transition-colors uppercase tracking-widest">Principles</button>
            <button onClick={() => onViewChange?.('integration')} className="text-sm font-bold text-slate-400 theme-text-sub hover:text-white transition-colors uppercase tracking-widest">Pathways</button>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onToggleTheme}
              className="p-2.5 hover:bg-slate-800/50 rounded-xl transition-all text-slate-500 hover:text-white border border-slate-800/50"
              title="Toggle Atmosphere"
            >
              {currentTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <motion.button 
              onClick={onJoin}
              whileHover={{ scale: 1.02 }}
              className="px-6 py-2.5 rounded-full bg-indigo-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-2 uppercase tracking-widest"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-64 pb-32 px-8 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-10 text-center lg:text-left">
            <motion.div variants={revealVariants} className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.2em]">
              <Sparkles size={14} className="animate-pulse" /> Mindful Space
            </motion.div>
            
            <motion.h1 variants={revealVariants} className="text-6xl md:text-8xl font-extrabold text-white theme-text-main tracking-tighter leading-[1.05]">
              Endless calm, <br />
              <span className="text-indigo-500 font-serif italic">flowing trees.</span>
            </motion.h1>
            
            <motion.p variants={revealVariants} className="text-xl md:text-2xl text-slate-400 theme-text-sub font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
              A bridge between intelligent computation and mindful stillness—creating a shared mental space that is free, accessible, and intentional.
            </motion.p>

            <motion.div variants={revealVariants} className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <button onClick={onJoin} className="w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white rounded-full font-black uppercase tracking-[0.3em] text-xs hover:bg-white hover:text-indigo-900 transition-all shadow-3xl shadow-indigo-600/30">Get Started</button>
              <button onClick={onExplore} className="w-full sm:w-auto px-12 py-5 bg-slate-900/60 border border-slate-800 text-slate-300 theme-text-sub rounded-full font-black uppercase tracking-[0.3em] text-xs hover:text-white transition-all">Explore Features</button>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.4 }} className="relative hidden lg:block">
            <div className="aspect-square rounded-[80px] overflow-hidden border border-slate-800/50 shadow-3xl bg-slate-900/40 relative">
              <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop" alt="Trees Flowing" className="w-full h-full object-cover opacity-80 transition-all duration-1000 hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent theme-bg-main" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Universal Access Section */}
      <section id="universal-access" className="py-40 px-8 relative bg-slate-950/40">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Universal Access</h2>
            <div className="h-1 w-24 bg-indigo-500 mx-auto rounded-full" />
            <p className="text-3xl md:text-5xl text-indigo-400 font-serif italic leading-tight">"Calm and clarity for everyone."</p>
            <p className="text-xl md:text-2xl text-slate-400 theme-text-sub font-light leading-relaxed">
              A shared mental space designed with purpose—free to use, with no subscriptions or barriers.
            </p>
          </motion.div>
          
          <motion.button 
            onClick={onJoin}
            whileHover={{ scale: 1.05 }}
            className="px-12 py-5 bg-white text-indigo-900 rounded-full font-black uppercase tracking-[0.3em] text-xs transition-all shadow-3xl"
          >
            Get Started
          </motion.button>
        </div>
      </section>

      {/* Our Principles Section */}
      <section id="manifesto" className="py-40 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="md:col-span-3 text-center space-y-4 mb-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">The Ethos</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-widest">Our Principles</h3>
          </div>
          
          <ManifestoItem icon={Globe} title="Open Access" content="We believe clarity is a human right. Mindful Journey is designed as a global commons—available to every mind without condition or cost." />
          <ManifestoItem icon={ShieldCheck} title="Privacy First" content="Your inner world belongs to you. Every reflection is stored locally on your device. We offer intelligence, never surveillance." />
          <ManifestoItem icon={InfinityIcon} title="Infinite Rhythms" content="Static paths are a limitation of the past. Using Gemini AI, we synthesize trillions of non-repeating paths for your unique intention." />
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-32 px-8 bg-slate-900/20 theme-bg-sub">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             <MetricItem label="Instant" value="0.1s" />
             <MetricItem label="Private" value="100%" />
             <MetricItem label="Infinite" value="Trillions" />
             <MetricItem label="Open" value="For All" />
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <footer className="py-40 px-8 border-t border-slate-800/40 theme-border-main text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          <Logo size={60} className="mx-auto" />
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">The Beginning is Now.</h2>
          <p className="text-slate-400 text-xl font-light">Join the architects of presence. Claim your shared space today.</p>
          <div className="flex justify-center">
            <button onClick={onJoin} className="px-16 py-6 bg-indigo-600 text-white rounded-full font-black uppercase tracking-[0.4em] text-xs hover:bg-white hover:text-indigo-900 transition-all shadow-3xl">Get Started</button>
          </div>
        </div>
        
        {/* Subtle Decorative Bottom Element */}
        <div className="pt-32 opacity-30 flex items-center justify-center gap-12 text-slate-500">
          <Layers size={24} />
          <Fingerprint size={24} />
          <Brain size={24} />
          <Zap size={24} />
        </div>
      </footer>
    </div>
  );
};

const ManifestoItem = ({ icon: Icon, title, content }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6 p-8 bg-slate-900/40 theme-bg-sub/40 border border-slate-800 theme-border-main rounded-[48px] hover:border-indigo-500/30 transition-all group">
    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
      <Icon size={28} />
    </div>
    <div className="space-y-4">
      <h4 className="text-2xl font-bold text-white tracking-tight">{title}</h4>
      <p className="text-slate-500 leading-relaxed font-light italic font-serif">{content}</p>
    </div>
  </motion.div>
);

const MetricItem = ({ label, value }: { label: string, value: string }) => (
  <motion.div 
    whileHover={{ scale: 1.05, backgroundColor: "rgba(79, 70, 229, 0.05)" }}
    className="p-8 rounded-[40px] bg-slate-950/60 theme-bg-main/60 border border-slate-800/40 theme-border-main text-center transition-all shadow-xl"
  >
    <p className="text-2xl md:text-4xl font-extrabold text-white tracking-tighter mb-2">{value}</p>
    <div className="h-px w-8 bg-indigo-500/20 mx-auto mb-3" />
    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-tight">{label}</p>
  </motion.div>
);

export default LandingView;