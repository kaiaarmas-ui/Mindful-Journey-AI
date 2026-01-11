
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  Brain, 
  Infinity as InfinityIcon, 
  Zap, 
  Target, 
  ShieldCheck,
  ChevronRight,
  Globe,
  Stars,
  Search,
  Palette,
  Fingerprint,
  Mic2
} from 'lucide-react';
import Logo from './Logo';
import { AppView } from '../types';

interface VisionViewProps {
  onBack?: () => void;
  onViewChange?: (view: AppView) => void;
}

const VisionView: React.FC<VisionViewProps> = ({ onBack, onViewChange }) => {
  const revealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        delay: i * 0.1,
        ease: [0.22, 1, 0.36, 1] as any
      }
    })
  };

  return (
    <div className="h-full bg-[#0b0f1a] text-slate-300 overflow-y-auto selection:bg-indigo-500/20 scroll-smooth custom-scrollbar">
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(79,70,229,0.08),transparent_60%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_70%,rgba(99,102,241,0.05),transparent_60%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <div className="max-w-5xl mx-auto py-24 px-8 space-y-32 relative z-10 pb-64">
        {/* Header */}
        <header className="space-y-10 text-center relative">
          {onBack && (
            <button 
              onClick={onBack}
              className="absolute left-0 top-0 p-3 hover:bg-slate-800/50 rounded-full transition-all text-slate-500 hover:text-white group z-50"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
          )}
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex justify-center"
          >
            <Logo size={100} mdSize={120} />
          </motion.div>

          <motion.div 
            custom={0}
            initial="hidden"
            animate="visible"
            variants={revealVariants}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-[0.95]">
              Our Vision: <br />
              <span className="text-indigo-500 font-serif italic">The Architecture of Presence</span>
            </h1>
            <p className="text-2xl md:text-3xl text-slate-200 font-light max-w-4xl mx-auto leading-relaxed">
              We are engineering a future where the infinite power of AI is finally calibrated to the stillness of the human mind.
            </p>
            <div className="h-px w-24 bg-indigo-500/30 mx-auto" />
            <p className="text-xl text-slate-500 max-w-3xl mx-auto font-light leading-relaxed italic font-serif">
              Mindful Journey is the bridge between the exponential growth of neural computation and the timeless depth of meditative presence. We believe technology should not be a distraction from life, but a conduit to its most profound moments.
            </p>
          </motion.div>
        </header>

        {/* The Challenge: The Fragmented Mind */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.2em]">
              The Challenge
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">The Fragmented Mind.</h2>
            <p className="text-lg text-slate-400 leading-relaxed font-light">
              We live in an era of infinite noise. Every byte of data competes for your attention, leaving the modern mind depleted and fragmented. Most AI is designed to accelerate this chaos, optimizing for "engagement" over "well-being." We choose a different path.
            </p>
            <div className="flex items-center gap-4 text-slate-500 italic">
               <div className="w-12 h-px bg-slate-800" />
               <p className="text-sm font-medium">Seeking stillness in the machine.</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative aspect-square rounded-[60px] overflow-hidden bg-slate-900 border border-slate-800/50 shadow-3xl group"
          >
            <img 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
              alt="Digital Noise"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
               </div>
            </div>
          </motion.div>
        </section>

        {/* The Three Core Convictions */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">The Three Core Convictions</h2>
            <p className="text-slate-500 max-w-xl mx-auto tracking-tight font-light">The foundational philosophy of our neural architecture.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <VisionCard 
              index={0}
              icon={Target}
              title="I. Intention Over Automation"
              desc="We are redefining the ‘I’ in AI. Here, it stands for Intention. AI should not live your life for you; it should illuminate the life you choose to live. Our meditation protocols don’t just automate relaxation—they sharpen your awareness for the world outside the screen."
              color="text-indigo-400"
            />
            <VisionCard 
              index={1}
              icon={ShieldCheck}
              title="II. Cognitive Autonomy"
              desc="Mindfulness requires total trust. Your thoughts, reflections, and manifestations stay in your browser. Our Local-First commitment ensures your journey remains private, providing a secure frontier for your inner spirit."
              color="text-emerald-400"
            />
            <VisionCard 
              index={2}
              icon={InfinityIcon}
              title="III. Infinite Perspective"
              desc="Every person is a multiverse of possibilities. We provide trillions of paths to ensure that your practice is as unique as your own neural signature. This is personalized intelligence at the scale of the soul."
              color="text-purple-400"
            />
          </div>
        </section>

        {/* The Operational Foundations */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">The Operational Foundations</h2>
            <p className="text-slate-500 max-w-xl mx-auto tracking-tight font-light">Three essential modalities of cognitive and meditative harmonization.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PillarCard 
              icon={Zap}
              title="Rapid Recalibration"
              subtitle="High-Performance Toolkit"
              desc="A high-performance toolkit for immediate stress mitigation. Shed the noise of high-stakes environments and return to focused composure instantly through zero-latency protocols."
              color="text-yellow-400"
            />
            <PillarCard 
              icon={Search}
              title="Verified Intelligence"
              subtitle="Empirical Decision Support"
              desc="By utilizing real-time search grounding, we bypass generative speculation to deliver wellness insights rooted in biological and psychological fact."
              color="text-sky-400"
            />
            <PillarCard 
              icon={Palette}
              title="Visual Synthesis"
              subtitle="The Alchemical Mirror"
              desc="Our generative architecture transmutes abstract emotional data into tangible artistic manifestations, turning internal complexity into external clarity."
              color="text-pink-400"
            />
          </div>
        </section>

        {/* The Future: Emotional Resonance AI */}
        <section className="relative p-12 md:p-24 bg-slate-900/40 border border-slate-800 rounded-[64px] overflow-hidden shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12">
             <Stars size={200} />
           </div>
           
           <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                The Future
              </div>
              <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter">Emotional Resonance AI.</h2>
              <div className="w-16 h-1 bg-indigo-500/50 mx-auto rounded-full" />
              <p className="text-2xl md:text-3xl text-slate-300 leading-relaxed font-light font-serif italic px-4">
                "Our roadmap extends beyond text and image. We are designing a future where AI resonates with your emotional state in real-time—harmonizing sound, light, and guidance through Gemini’s Native Audio to match your specific neural rhythm."
              </p>
              
              <div className="space-y-4 pt-12">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">The Metrics of Presence</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  <MetricItem label="Instant" value="0.1s" />
                  <MetricItem label="Private" value="100%" />
                  <MetricItem label="Infinite" value="Trillions" />
                  <MetricItem label="Open" value="For All" />
                </div>
              </div>
           </div>
        </section>

        {/* Be Part of the Convergence */}
        <footer className="text-center space-y-16 border-t border-slate-800/40 pt-24">
           <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Be Part of the Convergence.</h3>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                Join a community dedicated to the mindful evolution of intelligence. Reach out through our Direct Channel or follow the Social Stream to see the echoes of our users.
              </p>
           </div>
           
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewChange?.('auth')}
                className="w-full sm:w-auto px-16 py-6 bg-indigo-600 text-white rounded-full font-black uppercase tracking-[0.4em] text-xs hover:bg-white hover:text-indigo-900 transition-all shadow-3xl shadow-indigo-600/30"
              >
                Get Started
              </motion.button>
              <motion.button 
                whileHover={{ backgroundColor: "rgba(30, 41, 59, 0.8)" }}
                onClick={() => onViewChange?.('dashboard')}
                className="w-full sm:w-auto px-16 py-6 bg-slate-900/60 border border-slate-800 text-slate-300 rounded-full font-black uppercase tracking-[0.4em] text-xs hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Explore the Sanctuary <ChevronRight size={14} />
              </motion.button>
           </div>

           <div className="pt-20 opacity-30 flex items-center justify-center gap-8">
              <Globe size={24} />
              <Brain size={24} />
              <Mic2 size={24} />
              <Fingerprint size={24} />
           </div>
        </footer>
      </div>
    </div>
  );
};

const VisionCard = ({ icon: Icon, title, desc, color, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.15 }}
    whileHover={{ y: -8, backgroundColor: "rgba(30, 41, 59, 0.6)" }}
    className="bg-slate-900/40 border border-slate-800 p-10 rounded-[48px] space-y-8 hover:border-indigo-500/20 transition-all flex flex-col h-full shadow-2xl group"
  >
    <div className={`w-16 h-16 rounded-[24px] bg-slate-950 border border-slate-800 flex items-center justify-center ${color} shadow-inner group-hover:scale-110 transition-transform`}>
      <Icon size={32} strokeWidth={1.5} />
    </div>
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-light font-serif italic text-lg">{desc}</p>
    </div>
  </motion.div>
);

const PillarCard = ({ icon: Icon, title, subtitle, desc, color }: any) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-slate-900/20 border border-slate-800 p-8 rounded-[40px] space-y-6 flex flex-col h-full hover:bg-slate-800/40 transition-all shadow-lg"
  >
    <div className={`w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center ${color} shadow-lg`}>
      <Icon size={28} />
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">{subtitle}</p>
      <p className="text-sm text-slate-400 leading-relaxed font-light pt-2">{desc}</p>
    </div>
  </motion.div>
);

const MetricItem = ({ label, value }: { label: string, value: string }) => (
  <motion.div 
    whileHover={{ scale: 1.05, backgroundColor: "rgba(79, 70, 229, 0.1)" }}
    className="p-5 rounded-[28px] bg-slate-950/60 border border-slate-800/40 text-center transition-all"
  >
    <p className="text-xl md:text-2xl font-extrabold text-white tracking-tighter mb-1">{value}</p>
    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-tight">{label}</p>
  </motion.div>
);

export default VisionView;
