import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, MapPin, Dumbbell, Zap, X, ArrowLeft, Clock } from 'lucide-react';

interface Exercise {
  id: string;
  title: string;
  duration: string;
  durationSec: number;
  steps: string[];
  icon: any;
  buttonColor: string;
}

const exercises: Record<string, Exercise[]> = {
  breathing: [
    { id: 'box', title: 'Box Breathing', duration: '60s', durationSec: 60, icon: Wind, buttonColor: 'bg-sky-400 text-slate-900', steps: ['Breathe in 4s', 'Hold 4s', 'Breathe out 4s', 'Hold 4s'] },
    { id: '478', title: '4-7-8 Relax', duration: '90s', durationSec: 90, icon: Wind, buttonColor: 'bg-indigo-400 text-white', steps: ['Inhale 4s', 'Hold 7s', 'Exhale 8s'] }
  ],
  grounding: [
    { id: '54321', title: '5-4-3-2-1 Sensory', duration: '2m', durationSec: 120, icon: MapPin, buttonColor: 'bg-emerald-400 text-slate-900', steps: ['5 Things you see', '4 Things you feel', '3 Things you hear', '2 Things you smell', '1 Thing you taste'] }
  ]
};

const QuickReliefView: React.FC<{ onBack?: () => void, onComplete?: () => void }> = ({ onBack, onComplete }) => {
  const [activeCategory, setActiveCategory] = useState('breathing');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let timer: any;
    if (activeExercise && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (activeExercise && timeLeft === 0) {
      if (onComplete) onComplete();
    }
    return () => clearInterval(timer);
  }, [timeLeft, activeExercise, onComplete]);

  return (
    <div className="flex flex-col h-full bg-main text-main overflow-hidden relative">
      <div className="sticky top-0 z-50 bg-main/90 backdrop-blur-xl border-b border-main px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2.5 hover:bg-sub rounded-full text-sub hover:text-main border border-main">
              <ArrowLeft size={20} />
            </button>
          )}
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Zap size={18} className="text-emerald-400" />
            Quick Relax
          </h2>
        </div>
        <div className="flex gap-1 bg-sub p-1 rounded-xl">
          {Object.keys(exercises).map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeCategory === cat ? 'bg-main text-main shadow-sm' : 'text-sub'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center py-10">
             <h1 className="text-4xl font-bold">Quick Exercises</h1>
             <p className="text-sub text-lg font-light mt-2">Simple tools to help you find focus right now.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
            {exercises[activeCategory].map((ex) => (
              <motion.div key={ex.id} className="bg-sub border border-main rounded-[32px] p-8 flex flex-col justify-between hover:border-indigo-500/30 transition-all shadow-sm group">
                <div className="w-14 h-14 rounded-2xl bg-main flex items-center justify-center text-sub group-hover:text-main transition-colors mb-6">
                  <ex.icon size={28} />
                </div>
                <div className="space-y-2 mb-8">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-sub uppercase">
                    <Clock size={10} /> {ex.duration}
                  </div>
                  <h3 className="text-2xl font-bold">{ex.title}</h3>
                </div>
                <button onClick={() => { setActiveExercise(ex); setTimeLeft(ex.durationSec); }} className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg ${ex.buttonColor}`}>
                  Start
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeExercise && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-main/95 backdrop-blur-2xl flex items-center justify-center p-6">
            <button onClick={() => setActiveExercise(null)} className="absolute top-10 right-10 p-4 rounded-full bg-sub text-sub hover:text-main">
              <X size={32} />
            </button>
            <div className="max-w-2xl w-full text-center space-y-12">
              <h2 className="text-5xl font-bold">{activeExercise.title}</h2>
              <div className="text-[100px] leading-none font-bold tabular-nums">{timeLeft}s</div>
              <div className="flex flex-wrap justify-center gap-4">
                {activeExercise.steps.map((step, idx) => (
                  <div key={idx} className="px-6 py-3 rounded-2xl bg-sub border border-main text-sub font-bold text-sm">{step}</div>
                ))}
              </div>
              {timeLeft === 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                   <h3 className="text-3xl font-bold text-emerald-500">Finished! (+15 XP)</h3>
                   <button onClick={() => setActiveExercise(null)} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl">Return</button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickReliefView;