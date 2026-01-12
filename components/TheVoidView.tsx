import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ZapOff, Maximize2, Minimize2, VolumeX, Volume2, Sparkles, Wind, Target, EyeOff, Radio } from 'lucide-react';

interface TheVoidViewProps {
  onBack: () => void;
}

const TheVoidView: React.FC<TheVoidViewProps> = ({ onBack }) => {
  const [isActive, setIsActive] = useState(false);
  const [pulseSpeed, setPulseSpeed] = useState(7); 
  const [showUI, setShowUI] = useState(true);
  const [muted, setMuted] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  // Audio Engine Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mainGainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const noiseNodeRef = useRef<AudioWorkletNode | AudioBufferSourceNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);

  // Initialize Sound Engine (Advanced)
  const initAudio = () => {
    if (audioCtxRef.current) return;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = ctx;

    const mainGain = ctx.createGain();
    mainGain.gain.value = 0;
    mainGain.connect(ctx.destination);
    mainGainRef.current = mainGain;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 80;
    filter.Q.value = 8;
    filter.connect(mainGain);
    filterRef.current = filter;

    // 1. Deep Drone Layer (Grounding)
    [40, 60.5, 80].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      oscGain.gain.value = 0.15 / (i + 1);
      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      oscillatorsRef.current.push(osc);
    });

    // 2. Binaural Theta Layer (4.5Hz offset)
    const leftPanner = ctx.createPanner();
    const rightPanner = ctx.createPanner();
    leftPanner.setPosition(-1, 0, 0);
    rightPanner.setPosition(1, 0, 0);

    const oscL = ctx.createOscillator();
    const oscR = ctx.createOscillator();
    oscL.frequency.value = 100;
    oscR.frequency.value = 104.5; // Theta offset
    
    const bGain = ctx.createGain();
    bGain.gain.value = 0.05;

    oscL.connect(leftPanner).connect(bGain);
    oscR.connect(rightPanner).connect(bGain);
    bGain.connect(mainGain);
    oscL.start();
    oscR.start();
    oscillatorsRef.current.push(oscL, oscR);

    // 3. Cosmic Noise Layer (White noise through sweep)
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.02;
    noise.connect(noiseGain).connect(filter);
    noise.start();
    noiseNodeRef.current = noise;

    // 4. Synchronization LFO
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 1 / pulseSpeed;
    lfoGain.gain.value = 60; 
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    lfoRef.current = lfo;

    // Fade In
    mainGain.gain.setTargetAtTime(muted ? 0 : 0.2, ctx.currentTime, 2);
  };

  const stopAudio = () => {
    if (mainGainRef.current && audioCtxRef.current) {
        mainGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
    }
    setTimeout(() => {
        oscillatorsRef.current.forEach(o => { try { o.stop(); } catch(e) {} });
        oscillatorsRef.current = [];
        if (noiseNodeRef.current instanceof AudioBufferSourceNode) noiseNodeRef.current.stop();
        if (lfoRef.current) lfoRef.current.stop();
        if (audioCtxRef.current) audioCtxRef.current.close();
        audioCtxRef.current = null;
    }, 600);
  };

  useEffect(() => {
    if (lfoRef.current && audioCtxRef.current) {
      lfoRef.current.frequency.setTargetAtTime(1 / pulseSpeed, audioCtxRef.current.currentTime, 1);
    }
  }, [pulseSpeed]);

  useEffect(() => {
    if (mainGainRef.current && audioCtxRef.current) {
      mainGainRef.current.gain.setTargetAtTime(muted ? 0 : 0.2, audioCtxRef.current.currentTime, 0.5);
    }
  }, [muted]);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    } else {
      setSessionTime(0);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleVoid = async () => {
    if (!isActive) {
      initAudio();
      setIsActive(true);
      setShowUI(false);
      try { if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen(); } catch (e) {}
    } else {
      setIsActive(false);
      stopAudio();
      if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen();
    }
  };

  useEffect(() => { return () => stopAudio(); }, []);

  // Generate background stars
  const stars = useRef([...Array(120)].map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5
  })));

  return (
    <div 
      className={`h-full bg-[#02040a] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-1000 ${isActive ? 'cursor-none' : ''}`}
      onMouseMove={() => setShowUI(true)}
      onClick={() => isActive && setShowUI(true)}
    >
      {/* 1. DEEP SPACE PARTICLE FIELD */}
      <div className="absolute inset-0 z-0">
        {stars.current.map((star, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
                opacity: [0.1, 0.4, 0.1],
                scale: isActive ? [1, 1.2, 1] : 1
            }}
            transition={{ 
                duration: star.duration, 
                repeat: Infinity, 
                delay: star.delay 
            }}
            className="absolute rounded-full bg-indigo-200/40"
            style={{ 
                top: star.top, 
                left: star.left, 
                width: star.size, 
                height: star.size,
                filter: 'blur(1px)' 
            }}
          />
        ))}
      </div>

      {/* 2. NEURAL BLOOM (The Core Visual) */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
             {/* Large Radial Glow */}
             <motion.div 
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.05, 0.15, 0.05],
                filter: ['blur(100px)', 'blur(150px)', 'blur(100px)']
              }}
              transition={{ duration: pulseSpeed, repeat: Infinity, ease: "easeInOut" }}
              className="w-[1200px] h-[1200px] rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-transparent"
             />
             
             {/* Secondary Chromatic Ring */}
             <motion.div 
              animate={{ 
                scale: [0.8, 1.1, 0.8],
                opacity: [0.02, 0.08, 0.02],
                rotate: [0, 90, 180, 270, 360]
              }}
              transition={{ 
                scale: { duration: pulseSpeed, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: pulseSpeed * 4, repeat: Infinity, ease: "linear" }
              }}
              className="absolute w-[800px] h-[800px] border-[1px] border-dashed border-indigo-400/20 rounded-full"
             />

             {/* Focal Bloom */}
             <motion.div 
               animate={{ 
                boxShadow: [
                  "0 0 40px 10px rgba(99,102,241,0.1)", 
                  "0 0 100px 30px rgba(99,102,241,0.4)", 
                  "0 0 40px 10px rgba(99,102,241,0.1)"
                ]
               }}
               transition={{ duration: pulseSpeed, repeat: Infinity, ease: "easeInOut" }}
               className="absolute w-2 h-2 rounded-full bg-white z-20"
             />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. INTERFACE OVERLAY */}
      <AnimatePresence>
        {showUI && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col justify-between p-8 md:p-12 pointer-events-none"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pointer-events-auto">
              <button 
                onClick={onBack}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-500 hover:text-white border border-white/5 backdrop-blur-xl transition-all group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center gap-4">
                 {isActive && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-[10px] font-black text-indigo-400 tracking-[0.2em] tabular-nums backdrop-blur-md"
                    >
                        SESSION: {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}
                    </motion.div>
                 )}
                 <button 
                    onClick={() => setMuted(!muted)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-500 hover:text-white border border-white/5 backdrop-blur-xl transition-all"
                 >
                    {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                 </button>
              </div>
            </div>

            {/* Content Center-Lower */}
            <div className="flex flex-col items-center gap-12 pointer-events-auto">
               {!isActive && (
                 <div className="text-center space-y-6 max-w-lg">
                    <div className="flex justify-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20"><EyeOff size={24} /></div>
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20"><Radio size={24} /></div>
                        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500 border border-sky-500/20"><Target size={24} /></div>
                    </div>
                    <div className="space-y-3">
                       <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase italic">Total Nullity</h2>
                       <p className="text-slate-400 text-sm leading-relaxed font-light tracking-wide px-6">
                         A digital sensory deprivation chamber. No data. No noise. Just the neural rhythm of light and binaural grounding.
                       </p>
                    </div>
                 </div>
               )}
               
               <div className="flex flex-col items-center gap-8">
                   <button 
                    onClick={toggleVoid}
                    className={`group relative flex items-center gap-6 px-16 py-7 rounded-[32px] font-black uppercase tracking-[0.6em] text-[12px] transition-all duration-700 shadow-2xl overflow-hidden ${
                      isActive 
                      ? 'bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500/20' 
                      : 'bg-white text-black border-transparent hover:scale-105 active:scale-95'
                    }`}
                   >
                     {isActive ? <><Minimize2 size={20} /> Disengage</> : <><Maximize2 size={20} /> Initiate Protocol</>}
                     {!isActive && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />}
                   </button>

                   {isActive && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-4"
                      >
                         <div className="flex items-center gap-6">
                            <Wind size={14} className="text-indigo-500 animate-pulse" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Inhale with the Bloom</span>
                         </div>
                      </motion.div>
                   )}

                   {!isActive && (
                      <div className="flex flex-col items-center gap-6 px-10 py-6 bg-white/5 rounded-[32px] border border-white/5 backdrop-blur-xl">
                        <div className="flex items-center gap-6">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resonance</span>
                            <input 
                            type="range" 
                            min="4" 
                            max="12" 
                            step="0.1"
                            value={pulseSpeed} 
                            onChange={(e) => setPulseSpeed(parseFloat(e.target.value))}
                            className="w-48 h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
                            />
                            <span className="text-[10px] font-black text-indigo-400/80 tabular-nums w-10">{pulseSpeed}s</span>
                        </div>
                        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest text-center">Calibrated to your natural breath cycle</p>
                      </div>
                   )}
               </div>
            </div>

            {/* Bottom Status */}
            <div className="flex items-center justify-between opacity-30">
               <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-800" />
               <div className="px-8 text-[9px] font-black text-slate-500 uppercase tracking-[0.8em] whitespace-nowrap">
                  Architecture of Silence
               </div>
               <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-800" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. POST-PROCESSING OVERLAYS */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      
      {/* CRT Scanline Effect (Subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-40 bg-[length:100%_2px,3px_100%]" />
    </div>
  );
};

export default TheVoidView;