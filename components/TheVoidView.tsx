
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ZapOff, Maximize2, Minimize2, Settings2, VolumeX, Volume2 } from 'lucide-react';

interface TheVoidViewProps {
  onBack: () => void;
}

const TheVoidView: React.FC<TheVoidViewProps> = ({ onBack }) => {
  const [isActive, setIsActive] = useState(false);
  const [pulseSpeed, setPulseSpeed] = useState(6); // Seconds
  const [showUI, setShowUI] = useState(true);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    let timeout: any;
    if (isActive && showUI) {
      timeout = setTimeout(() => setShowUI(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isActive, showUI]);

  const toggleVoid = () => {
    setIsActive(!isActive);
    if (!isActive) setShowUI(false);
  };

  return (
    <div 
      className={`h-full bg-black flex flex-col items-center justify-center relative overflow-hidden transition-all duration-1000 ${isActive ? 'cursor-none' : ''}`}
      onMouseMove={() => setShowUI(true)}
      onClick={() => isActive && setShowUI(true)}
    >
      {/* Neural Pulse Background */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
             <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{ 
                duration: pulseSpeed, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-[800px] h-[800px] rounded-full bg-indigo-500/20 blur-[150px]"
             />
             <motion.div 
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0.03, 0.08, 0.03]
              }}
              transition={{ 
                duration: pulseSpeed * 0.8, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: pulseSpeed / 2
              }}
              className="w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-[120px]"
             />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Star / Focus Point */}
      <div className="relative z-10">
        <motion.div 
          animate={isActive ? { scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] } : {}}
          transition={{ duration: pulseSpeed, repeat: Infinity, ease: "easeInOut" }}
          className={`w-1 h-1 rounded-full bg-white shadow-[0_0_20px_white] transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-20'}`}
        />
      </div>

      {/* Floating UI Elements */}
      <AnimatePresence>
        {showUI && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col justify-between p-8 pointer-events-none"
          >
            <div className="flex items-center justify-between pointer-events-auto">
              <button 
                onClick={onBack}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-500 hover:text-white border border-white/5 backdrop-blur-md transition-all"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                 <button 
                    onClick={() => setMuted(!muted)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-500 hover:text-white border border-white/5 backdrop-blur-md transition-all"
                 >
                    {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                 </button>
                 <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                   Sensory Deprivation Protocol
                 </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-8 pointer-events-auto">
               {!isActive && (
                 <div className="text-center space-y-4 max-w-sm">
                    <ZapOff size={48} className="mx-auto text-slate-700" />
                    <h2 className="text-2xl font-bold text-white tracking-tight">Enter The Void</h2>
                    <p className="text-slate-500 text-sm leading-relaxed">A minimalist sensory modality designed for deep neural reset. Focus solely on the rhythmic light.</p>
                 </div>
               )}
               
               <button 
                onClick={toggleVoid}
                className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] transition-all border shadow-2xl ${
                  isActive 
                  ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20' 
                  : 'bg-white text-black border-transparent hover:scale-105'
                }`}
               >
                 {isActive ? <><Minimize2 size={16} /> Exit The Void</> : <><Maximize2 size={16} /> Initiate Deprivation</>}
               </button>

               <div className="flex items-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pulse Frequency</span>
                    <input 
                      type="range" 
                      min="2" 
                      max="12" 
                      value={pulseSpeed} 
                      onChange={(e) => setPulseSpeed(parseInt(e.target.value))}
                      className="w-32 h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
               </div>
            </div>

            <div className="text-center opacity-20">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em]">Stillness is the ultimate intelligence.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Neural Static (Subtle noise effect) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
    </div>
  );
};

export default TheVoidView;
